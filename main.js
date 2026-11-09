(() => {
  'use strict';
  const c = window.WEDDING_CONFIG;
  const $ = id => document.getElementById(id);
  const date = new Date(c.date);
  if (Number.isNaN(date.getTime())) {
    $('cover-date').textContent = 'Vui lòng kiểm tra ngày cưới trong config.js';
    return;
  }
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
  const year = Number(values.year), month = Number(values.month), day = Number(values.day);
  const time = `${values.hour}:${values.minute}`;
  const longDate = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  const title = `${c.bride.name} & ${c.groom.name} | Thiệp mời lễ thành hôn`;
  document.title = title;
  document.querySelector('meta[property="og:title"]').content = title;
  document.querySelectorAll('[data-bind]').forEach(el => {
    el.textContent = el.dataset.bind.split('.').reduce((obj, key) => obj?.[key], c) ?? '';
  });
  $('cover-date').textContent = longDate;
  const guest = new URLSearchParams(location.search).get('guest') || c.guestName;
  $('guest-name').textContent = guest ? String(guest).slice(0, 120) : '';
  $('bride-photo').src = c.bride.photo;
  $('groom-photo').src = c.groom.photo;
  $('event-time').textContent = $('party-time').textContent = time;
  $('event-day').textContent = day;
  $('event-weekday').textContent = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'long' }).format(date).toUpperCase();
  $('event-month-year').textContent = `THÁNG ${month}\n${year}`;
  $('calendar-month').textContent = `Tháng ${month} / ${year}`;
  const firstDay = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const dayCount = new Date(Date.UTC(year, month, 0)).getUTCDate();
  for (let n = 0; n < firstDay; n++) {
    const blank = document.createElement('span');
    blank.setAttribute('aria-hidden', 'true');
    $('calendar-days').append(blank);
  }
  for (let n = 1; n <= dayCount; n++) {
    const cell = document.createElement('span');
    cell.textContent = n;
    if (n === day) { cell.className = 'wedding-day'; cell.setAttribute('aria-label', `${n}, ngày cưới`); }
    $('calendar-days').append(cell);
  }
  function updateCountdown() {
    let seconds = Math.floor((date - Date.now()) / 1000);
    if (seconds <= 0) {
      $('countdown').textContent = 'Ngày hạnh phúc đã đến!';
      return;
    }
    const days = Math.floor(seconds / 86400); seconds %= 86400;
    const hours = Math.floor(seconds / 3600); seconds %= 3600;
    const minutes = Math.floor(seconds / 60); seconds %= 60;
    $('countdown').textContent = `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
  function utcStamp(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  const endDate = new Date(c.date.slice(0, 10) + 'T' + c.endTime + ':00+07:00');
  if (!Number.isFinite(endDate.getTime()) || endDate <= date) endDate.setTime(date.getTime() + 7200000);
  const calendar = new URL('https://calendar.google.com/calendar/render');
  calendar.search = new URLSearchParams({ action: 'TEMPLATE', text: `Lễ thành hôn ${c.bride.name} & ${c.groom.name}`, dates: `${utcStamp(date)}/${utcStamp(endDate)}`, ctz: 'Asia/Ho_Chi_Minh', details: c.closing, location: `${c.venue.name}, ${c.venue.address}` }).toString();
  $('calendar-link').href = calendar.href;
  function safeHttpUrl(value) {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
  }
  const mapsUrl = safeHttpUrl(c.venue.mapsUrl);
  if (mapsUrl) { $('directions-link').href = mapsUrl; $('directions-link').hidden = false; }
  const embedUrl = safeHttpUrl(c.venue.embedUrl);
  if (embedUrl && ['www.google.com', 'maps.google.com', 'www.openstreetmap.org'].includes(new URL(embedUrl).hostname)) {
    const frame = document.createElement('iframe');
    frame.src = embedUrl; frame.title = 'Bản đồ địa điểm tổ chức tiệc cưới'; frame.loading = 'lazy'; frame.referrerPolicy = 'no-referrer-when-downgrade'; frame.allowFullscreen = true;
    $('map-container').replaceChildren(frame);
  }
  c.timeline.forEach(item => {
    const li = document.createElement('li'), t = document.createElement('time'), p = document.createElement('span');
    t.textContent = item.time; p.textContent = item.title; li.append(t, p); $('timeline').append(li);
  });

  // Album: dialog native giữ focus và hỗ trợ Escape; nút ảnh dùng được bằng bàn phím.
  let currentPhoto = 0, lastPhotoButton = null, touchStart = null;
  const photos = c.photos || [];
  const lightbox = $('lightbox');
  function showPhoto(index) {
    currentPhoto = (index + photos.length) % photos.length;
    $('lightbox-photo').src = photos[currentPhoto];
    $('lightbox-photo').alt = `Ảnh cưới ${currentPhoto + 1}`;
    $('photo-caption').textContent = `Ảnh ${currentPhoto + 1} trong ${photos.length} ảnh`;
    $('lightbox-counter').textContent = `${currentPhoto + 1} / ${photos.length}`;
    [...$('thumbnails').children].forEach((button, n) => button.setAttribute('aria-current', String(n === currentPhoto)));
  }
  function openAlbum(index, button) {
    lastPhotoButton = button; showPhoto(index); lightbox.showModal(); document.body.classList.add('has-lightbox');
  }
  photos.slice(0, 5).forEach((src, n) => {
    const button = document.createElement('button'), img = document.createElement('img');
    button.type = 'button'; button.className = 'photo-tile'; button.setAttribute('aria-label', `Xem ảnh cưới ${n + 1}`);
    img.src = src; img.alt = `Ảnh cưới ${n + 1}`; img.loading = 'lazy'; img.decoding = 'async'; button.append(img);
    if (n === 4 && photos.length > 5) {
      const more = document.createElement('span'); more.className = 'photo-more'; more.textContent = `+${photos.length - 5}`; button.append(more);
    }
    button.addEventListener('click', () => openAlbum(n, button)); $('photo-grid').append(button);
  });
  photos.forEach((src, n) => {
    const button = document.createElement('button'), img = document.createElement('img');
    button.type = 'button'; button.className = 'thumbnail'; button.setAttribute('aria-label', `Xem ảnh ${n + 1}`);
    img.src = src; img.alt = ''; img.loading = 'lazy'; button.append(img); button.addEventListener('click', () => showPhoto(n)); $('thumbnails').append(button);
  });
  $('previous-photo').addEventListener('click', () => showPhoto(currentPhoto - 1));
  $('next-photo').addEventListener('click', () => showPhoto(currentPhoto + 1));
  $('lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('close', () => { document.body.classList.remove('has-lightbox'); lastPhotoButton?.focus({ preventScroll: true }); });
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); showPhoto(currentPhoto - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); showPhoto(currentPhoto + 1); }
  });
  $('lightbox-photo').addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; }, { passive: true });
  $('lightbox-photo').addEventListener('touchend', e => {
    if (touchStart === null) return;
    const delta = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 50) showPhoto(currentPhoto + (delta > 0 ? -1 : 1));
    touchStart = null;
  }, { passive: true });
  $('previous-photo').hidden = $('next-photo').hidden = photos.length < 2;

  // Nhạc chỉ phát sau thao tác người dùng; lỗi phát không làm gián đoạn thiệp.
  const audio = $('background-music'), musicButton = $('music-toggle');
  if (c.music) { audio.src = c.music; musicButton.hidden = false; }
  const syncMusic = () => {
    musicButton.setAttribute('aria-pressed', String(!audio.paused));
    musicButton.setAttribute('aria-label', audio.paused ? 'Phát nhạc' : 'Tạm dừng nhạc');
  };
  audio.addEventListener('play', syncMusic); audio.addEventListener('pause', syncMusic);
  audio.addEventListener('error', () => { musicButton.setAttribute('aria-label', 'Không tải được nhạc — thử lại'); });
  async function playMusic() { try { await audio.play(); } catch { syncMusic(); } }
  musicButton.addEventListener('click', () => { if (audio.paused) playMusic(); else audio.pause(); });
  function openInvitation(shouldPlay = true) {
    $('cover').classList.add('is-open'); $('cover').inert = true; $('invitation').inert = false; document.body.classList.remove('is-covered');
    $('invitation').setAttribute('tabindex', '-1'); $('invitation').focus({ preventScroll: true });
    if (c.music && shouldPlay) playMusic();
  }
  $('open-invitation').addEventListener('click', () => openInvitation());
  if (new URLSearchParams(location.search).get('open') === '1') openInvitation(false);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let n = 0; n < 12; n++) {
      const leaf = document.createElement('i'); leaf.className = 'leaf';
      leaf.style.left = `${n * 8.3}%`; leaf.style.animationDuration = `${12 + n % 5 * 3}s`; leaf.style.animationDelay = `${-n * 2.7}s`; $('cover').querySelector('.leaves').append(leaf);
    }
  }

  // Sổ lưu bút: chế độ thử trên thiết bị hoặc Supabase REST khi có cấu hình.
  const settings = c.guestbook || {};
  const shared = Boolean(settings.supabaseUrl && settings.supabaseAnonKey);
  const storageKey = `wedding-wishes:${settings.invitationId || 'default'}`;
  const note = $('guestbook-note'), status = $('wish-status');
  let wishes = [];
  note.textContent = shared ? 'Gửi đôi lời yêu thương đến cô dâu và chú rể.' : 'Bản xem thử: lời chúc chỉ được lưu trên trình duyệt của bạn.';
  function readLocalWishes() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(parsed) ? parsed.filter(w => typeof w.name === 'string' && typeof w.message === 'string' && Number.isFinite(new Date(w.created_at).getTime())).slice(0, 100) : [];
    } catch { return []; }
  }
  function renderWishes() {
    $('wishes').replaceChildren();
    if (!wishes.length) {
      const p = document.createElement('p'); p.className = 'empty-wishes'; p.textContent = 'Hãy là người đầu tiên gửi lời chúc yêu thương ♡'; $('wishes').append(p); return;
    }
    wishes.forEach(w => {
      const article = document.createElement('article'), header = document.createElement('header'), name = document.createElement('strong'), timeEl = document.createElement('time'), message = document.createElement('p');
      article.className = 'wish'; name.textContent = w.name; message.textContent = w.message; message.style.whiteSpace = 'pre-line';
      const d = new Date(w.created_at);
      if (Number.isFinite(d.getTime())) { timeEl.dateTime = d.toISOString(); timeEl.textContent = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' }).format(d); }
      header.append(name, timeEl); article.append(header, message); $('wishes').append(article);
    });
  }
  async function requestWishes(method = 'GET', body) {
    const base = safeHttpUrl(settings.supabaseUrl);
    if (!base) throw new Error('Cấu hình kết nối chưa đúng.');
    const url = new URL('/rest/v1/wedding_wishes', base);
    if (method === 'GET') url.search = new URLSearchParams({ select: 'name,message,created_at', invitation_id: `eq.${settings.invitationId}`, order: 'created_at.desc', limit: '100' });
    const result = await fetch(url, { method, headers: { apikey: settings.supabaseAnonKey, Authorization: `Bearer ${settings.supabaseAnonKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(12000) });
    if (!result.ok) throw new Error('Chưa kết nối được sổ lưu bút.');
    return method === 'GET' ? result.json() : null;
  }
  async function loadWishes() {
    if (shared) {
      try { wishes = await requestWishes(); }
      catch { note.textContent = 'Chưa tải được lời chúc. Bạn có thể thử tải lại trang.'; }
    } else wishes = readLocalWishes();
    renderWishes();
  }
  loadWishes();
  $('wish-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('wish-name').value.trim(), message = $('wish-message').value.trim();
    if (!name || !message) { status.textContent = 'Bạn vui lòng nhập tên và lời chúc nhé.'; return; }
    const button = e.target.querySelector('[type="submit"]'); button.disabled = true; button.textContent = 'ĐANG GỬI…'; status.textContent = '';
    const wish = { name, message, created_at: new Date().toISOString() };
    try {
      if (shared) {
        await requestWishes('POST', { invitation_id: settings.invitationId, name, message });
        // Gửi thành công độc lập với lần tải lại danh sách; tránh yêu cầu gửi trùng.
        wishes.unshift(wish); renderWishes();
      } else {
        const next = [wish, ...wishes].slice(0, 100);
        localStorage.setItem(storageKey, JSON.stringify(next)); wishes = next; renderWishes();
      }
      $('wish-message').value = ''; status.textContent = shared ? 'Cảm ơn bạn đã gửi lời chúc yêu thương ♡' : 'Đã lưu lời chúc trên thiết bị này ♡';
    } catch { status.textContent = shared ? 'Chưa gửi được lời chúc. Bạn vui lòng thử lại sau nhé.' : 'Trình duyệt chưa cho phép lưu lời chúc. Bạn hãy bật lưu trữ và thử lại nhé.'; }
    finally { button.disabled = false; button.textContent = 'GỬI LỜI CHÚC'; }
  });
  const suggestions = ['Chúc hai bạn trăm năm hạnh phúc, luôn yêu thương và đồng hành cùng nhau trên mọi chặng đường!', 'Chúc cô dâu chú rể một đời bình an, một nhà đầy ắp tiếng cười và một tình yêu mãi vẹn nguyên ♡', 'Chúc hai bạn hạnh phúc viên mãn, cùng nhau viết tiếp thật nhiều kỷ niệm đẹp!'];
  let suggestionIndex = 0;
  $('suggest-wish').addEventListener('click', () => { $('wish-message').value = suggestions[suggestionIndex++ % suggestions.length]; $('wish-message').focus(); });
})();
