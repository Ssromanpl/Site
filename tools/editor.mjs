#!/usr/bin/env node
/**
 * Редактор сайта «Пафия». Запуск: npm run edit
 *
 * Поднимает на localhost небольшую админку: правите цены, мастеров, тексты
 * и контакты в формах, нажимаете «Сохранить» — данные пишутся в src/data/*.json,
 * сайт пересобирается, предпросмотр обновляется.
 *
 * Инструмент локальный и в интернет не смотрит: слушает только 127.0.0.1.
 * Резервных копий не делает — их роль выполняет git, поэтому перед крупной
 * правкой удобно закоммитить текущее состояние.
 */
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, renameSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative, isAbsolute, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, spawn } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 4321;

/** Редактируемые наборы данных. Ничего, кроме них, писать нельзя. */
const DATASETS = ['site', 'prices', 'masters', 'techniques', 'content'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

const send = (res, code, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
};
const json = (res, code, obj) => send(res, code, JSON.stringify(obj));

const dataFile = (name) => join(ROOT, 'src', 'data', `${name}.json`);

function readBody(req) {
  // Собираем именно байты и декодируем один раз в конце. Если складывать
  // чанки строками, кириллическая буква, попавшая на границу чанка,
  // распадается на два символа-замены — и правка тихо портит текст.
  return new Promise((ok, fail) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > 5e6) return fail(new Error('Слишком большой запрос'));
      chunks.push(c);
    });
    req.on('end', () => ok(Buffer.concat(chunks).toString('utf8')));
    req.on('error', fail);
  });
}

/** Пишем через временный файл: обрыв на середине не оставит битый JSON. */
function writeAtomic(file, text) {
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, file);
}

function runBuild() {
  const r = spawnSync(process.execPath, ['build.mjs'], { cwd: ROOT, encoding: 'utf8' });
  let log = `${r.stdout || ''}${r.stderr || ''}`.trim();
  if (r.status !== 0) return { ok: false, log };

  // Заодно обновляем версию «одним файлом»: иначе она молча устаревает,
  // и отправленная кому-то копия расходится с сайтом.
  const single = spawnSync(process.execPath, ['build-single.mjs'], { cwd: ROOT, encoding: 'utf8' });
  const singleLog = `${single.stdout || ''}${single.stderr || ''}`.trim();
  log += singleLog ? `\n${singleLog}` : '';
  if (single.status !== 0) log += '\nВерсия «одним файлом» не собралась — на сам сайт это не влияет.';

  return { ok: true, log };
}

/**
 * Путь обязан остаться внутри проекта.
 * Сравнивать строки со «/» нельзя: на Windows разделитель обратный,
 * и такая проверка отвергала вообще все запросы. relative() знает
 * разделитель своей системы.
 */
function insideRoot(file) {
  const rel = relative(ROOT, file);
  if (rel === '' || isAbsolute(rel)) return false;
  // Именно «..» как отдельный сегмент: файл с именем «..точка.html» законен.
  return rel !== '..' && !rel.startsWith('..' + sep);
}

function servePreview(res, urlPath) {
  const rel = decodeURIComponent(urlPath.replace(/^\/preview\/?/, '')) || 'index.html';
  const file = resolve(ROOT, rel);
  const deny = (why) => send(res, 403, `Нельзя: ${why}`, 'text/plain; charset=utf-8');
  // Не выпускаем за пределы проекта и не отдаём исходники редактора.
  if (!insideRoot(file)) return deny('путь ведёт за пределы проекта');
  if (/^(src|tools|node_modules|\.git)[\\/]/.test(rel.replace(/\\/g, '/'))) return deny('служебная папка');
  if (!existsSync(file) || statSync(file).isDirectory()) {
    const fallback = join(ROOT, '404.html');
    if (existsSync(fallback)) return send(res, 404, readFileSync(fallback), MIME['.html']);
    return send(res, 404, 'Не найдено', 'text/plain; charset=utf-8');
  }
  send(res, 200, readFileSync(file), MIME[extname(file)] || 'application/octet-stream');
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    if (path === '/' || path === '/index.html') {
      return send(res, 200, readFileSync(join(ROOT, 'tools', 'editor-ui.html')), MIME['.html']);
    }

    if (path === '/api/data' && req.method === 'GET') {
      const all = {};
      for (const name of DATASETS) all[name] = JSON.parse(readFileSync(dataFile(name), 'utf8'));
      return json(res, 200, all);
    }

    if (path === '/api/save' && req.method === 'POST') {
      const payload = JSON.parse(await readBody(req));
      const names = Object.keys(payload);
      const unknown = names.filter((n) => !DATASETS.includes(n));
      if (unknown.length) return json(res, 400, { error: `Неизвестные данные: ${unknown.join(', ')}` });

      for (const name of names) writeAtomic(dataFile(name), JSON.stringify(payload[name], null, 2) + '\n');

      const build = runBuild();
      return json(res, build.ok ? 200 : 500, {
        saved: names,
        ok: build.ok,
        log: build.log,
        error: build.ok ? null : 'Данные сохранены, но сборка упала — смотрите журнал',
      });
    }

    if (path === '/api/build' && req.method === 'POST') {
      const build = runBuild();
      return json(res, build.ok ? 200 : 500, build);
    }

    if (path.startsWith('/preview')) return servePreview(res, path);

    send(res, 404, 'Не найдено', 'text/plain; charset=utf-8');
  } catch (e) {
    json(res, 500, { error: e.message });
  }
});

/** Сами открываем браузер, чтобы не пришлось копировать адрес руками. */
function openBrowser(url) {
  if (process.env.PAFIA_NO_OPEN) return;
  const cmd = process.platform === 'darwin' ? ['open', [url]]
    : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : ['xdg-open', [url]];
  try {
    spawn(cmd[0], cmd[1], { stdio: 'ignore', detached: true }).on('error', () => {}).unref();
  } catch {
    /* Браузер не открылся — не беда, адрес напечатан выше. */
  }
}

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${PORT}`;
  console.log('');
  console.log('  Редактор сайта «Пафия» запущен.');
  console.log('');
  console.log(`  Откройте в браузере:  ${url}`);
  console.log('  (обычно он открывается сам через пару секунд)');
  console.log('');
  console.log('  Правки сохраняются в файлы проекта, сайт пересобирается сам.');
  console.log('  Чтобы закончить работу — закройте это окно или нажмите Ctrl+C.');
  console.log('');
  openBrowser(url);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\n  Порт ${PORT} уже занят — возможно, редактор уже запущен в другом окне.`);
    console.error(`  Проверьте http://127.0.0.1:${PORT} или запустите на другом порте:`);
    console.error(`  PORT=5000 npm run edit\n`);
  } else {
    console.error('\n  Не удалось запустить редактор:', e.message, '\n');
  }
  process.exit(1);
});
