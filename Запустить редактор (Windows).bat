@echo off
chcp 65001 >nul
cd /d "%~dp0"
cls
echo.
echo   Запускаю редактор сайта «Пафия»...
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo   Не найден Node.js — без него редактор не работает.
  echo.
  echo   Установите его: https://nodejs.org — большая зелёная кнопка со словом LTS.
  echo   Установщик надо просто прощёлкать «Далее».
  echo   После установки запустите этот файл ещё раз.
  echo.
  pause
  exit /b 1
)

node tools\editor.mjs

echo.
echo   Редактор остановлен.
pause
