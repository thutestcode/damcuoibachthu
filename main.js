(() => {
  'use strict';
  const c = window.WEDDING_CONFIG;
  const $ = id => document.getElementById(id);
  const date = new Date(c.date);
  if (Number.isNaN(date.getTime())) {
    $('cover-date').textContent = 'Vui lòng kiểm tra ngày cưới trong config.js';
    return;
  }
  document.querySelectorAll('[data-bind]').forEach(el => {
    el.textContent = el.dataset.bind.split('.').reduce((obj, key) => obj?.[key], c) ?? '';
  });
  const zone = 'Asia/Ho_Chi_Minh';
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(date).map(p => [p.type, p.value]));
  const title = `${c.bride.name} & ${c.groom.name} | Thiệp mời lễ thành hôn`;
  document.title = title;
  document.querySelector('meta[property="og:title"]').content = title;
  $('cover-date').textContent = new Intl.DateTimeFormat('vi-VN', {
    timeZone: zone, day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
  const params = new URLSearchParams(location.search);
  $('guest-name').textContent = String(params.get('guest') || c.guestName || '').slice(0, 120);
  $('event-time').textContent = `${Number(parts.hour)}:${parts.minute}`;
  $('event-day').textContent = Number(parts.day);
  $('event-weekday').textContent = new Intl.DateTimeFormat('vi-VN', {
    timeZone: zone, weekday: 'long'
  }).format(date).toUpperCase();
  $('event-month-year').textContent = `THÁNG ${Number(parts.month)}\n${parts.year}`;

  // Giữ hai khung trống khi chưa có ảnh; không tạo yêu cầu tải ảnh bị lỗi.
  for (const person of ['bride', 'groom']) {
    const image = $(`${person}-photo`);
    if (c[person].photo) { image.src = c[person].photo; image.hidden = false; }
  }
  function safeHttpUrl(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }
  c.timeline.forEach(item => {
    const li = document.createElement('li');
    const time = document.createElement('time');
    const details = document.createElement('div');
    const title = document.createElement('h3');
    const address = document.createElement('p');
    time.textContent = item.time;
    const [hour, minute] = item.time.split(':');
    time.dateTime = `${parts.year}-${parts.month}-${parts.day}T${hour.padStart(2, '0')}:${minute}:00+07:00`;
    title.textContent = item.title;
    address.className = 'timeline-address';
    address.textContent = item.address;
    details.className = 'timeline-details';
    details.append(title, address);
    let mapsUrl = safeHttpUrl(item.mapsUrl);
    if (!mapsUrl && item.mapsQuery) {
      const url = new URL('https://www.google.com/maps/search/');
      url.search = new URLSearchParams({ api: '1', query: item.mapsQuery });
      mapsUrl = url.href;
    }
    if (mapsUrl) {
      const link = document.createElement('a');
      link.className = 'timeline-map'; link.href = mapsUrl;
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.textContent = 'Xem trên Google Maps ↗';
      link.setAttribute('aria-label', `Xem địa điểm ${item.time} trên Google Maps: ${item.address}`);
      details.append(link);
    }
    li.append(time, details); $('timeline').append(li);
  });

  const audio = $('background-music'), musicButton = $('music-toggle');
  if (c.music) { audio.src = c.music; musicButton.hidden = false; }
  function syncMusic() {
    musicButton.setAttribute('aria-pressed', String(!audio.paused));
    musicButton.setAttribute('aria-label', audio.paused ? 'Phát nhạc' : 'Tạm dừng nhạc');
  }
  audio.addEventListener('play', syncMusic);
  audio.addEventListener('pause', syncMusic);
  audio.addEventListener('error', () => musicButton.setAttribute('aria-label', 'Không tải được nhạc — thử lại'));
  async function playMusic() { try { await audio.play(); } catch { syncMusic(); } }
  musicButton.addEventListener('click', () => { if (audio.paused) playMusic(); else audio.pause(); });
  function openInvitation(shouldPlay = true) {
    $('cover').classList.add('is-open'); $('cover').inert = true;
    $('invitation').inert = false; document.body.classList.remove('is-covered');
    $('invitation').setAttribute('tabindex', '-1'); $('invitation').focus({ preventScroll: true });
    if (c.music && shouldPlay) playMusic();
  }
  $('open-invitation').addEventListener('click', () => openInvitation());
  if (params.get('open') === '1') openInvitation(false);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let n = 0; n < 10; n++) {
      const petal = document.createElement('i'); petal.className = 'petal';
      petal.style.left = `${n * 10}%`;
      petal.style.animationDuration = `${15 + n % 5 * 3}s`;
      petal.style.animationDelay = `${-n * 3.1}s`;
      $('cover').querySelector('.petals').append(petal);
    }
  }
})();
