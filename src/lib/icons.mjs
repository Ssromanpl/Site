const svg = (body, extra = '') =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${body}</svg>`;

export const icons = {
  scissors: svg('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/>'),
  drop: svg('<path d="M12 2.7s6 6.2 6 10.3a6 6 0 1 1-12 0c0-4.1 6-10.3 6-10.3Z"/>'),
  hand: svg('<path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V6.5a1.5 1.5 0 0 1 3 0V14"/><path d="M17 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-3.5a1.5 1.5 0 0 1 3 0"/>'),
  leaf: svg('<path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 16-9 0 10-4 15-9 15Z"/><path d="M4 21c2-6 6-9 11-11"/>'),
  eye: svg('<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.6"/>'),
  phone: svg('<path d="M5 3h3l2 5-2.4 1.4a12 12 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 3 5.2 2 2 0 0 1 5 3Z"/>'),
  chat: svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>'),
  pin: svg('<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
  star: '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.2 14.6 9l6.4.6-4.8 4.2 1.4 6.2-5.6-3.3-5.6 3.3L7.8 13.8 3 9.6 9.4 9Z"/></svg>',
  arrow: svg('<path d="M5 12h13"/><path d="m13 6 6 6-6 6"/>'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  minus: svg('<path d="M5 12h14"/>'),
  calendar: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>'),
  instagram: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>'),
  shield: svg('<path d="M12 3 5 6v6c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6Z"/><path d="m9 12 2 2 4-4"/>'),
  sparkle: svg('<path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9Z"/><path d="M18.5 16.5 19.2 19l2.3.8-2.3.8-.7 2.4"/>'),
};

export const icon = (name) => icons[name] || '';
