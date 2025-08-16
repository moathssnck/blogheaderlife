// Utilities
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// Theme (Light/Dark/System)
(function theme(){
  const key = 'theme-preference';
  const root = document.documentElement;
  const saved = localStorage.getItem(key);
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  $('#themeToggle').addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'system';
    const next = current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark';
    root.setAttribute('data-theme', next);
    if (next === 'system') localStorage.removeItem(key); else localStorage.setItem(key, next);
    const labelMap = { light: 'الوضع الفاتح', dark: 'الوضع الداكن', system: 'افتراضي النظام' };
    $('#themeToggle').setAttribute('aria-label', 'تبديل السمة: ' + labelMap[next]);
  });
})();

// Mobile Nav
(function mobileNav(){
  const btn = $('#menuBtn'); const nav = $('#mobileNav');
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  $$('#mobileNav a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); btn.setAttribute('aria-expanded','false');
  }));
})();

// Footer Year
$('#year').textContent = new Date().getFullYear();

// Load Posts from seed JSON
(function renderPosts(){
  const seed = JSON.parse($('#seed').textContent);
  const wrap = $('#posts');
  const frag = document.createDocumentFragment();
  seed.posts.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card post';
    card.dataset.category = p.category;
    card.dataset.title = p.title;

    const cover = document.createElement('div');
    cover.className = 'post__cover';
    cover.setAttribute('role','img');
    cover.setAttribute('aria-label','غلاف مقال');

    const body = document.createElement('div');
    body.className = 'post__body';
    body.innerHTML = `
      <span class="badge">${p.category}</span>
      <h3>${p.title}</h3>
      <p class="muted">${p.excerpt}</p>
      <footer>
        <small class="muted">${p.readTime}</small>
        <a class="btn ghost" href="${p.url}">اقرأ المزيد</a>
      </footer>
    `;
    card.append(cover, body);
    frag.append(card);
  });
  wrap.append(frag);
})();

// Search & Filter
(function postsFilter(){
  const search = $('#search');
  const chips = $$('.chip');
  const cards = () => $$('.post');
  let active = 'all';
  const apply = () => {
    const q = (search.value || '').trim().toLowerCase();
    cards().forEach(card => {
      const cat = card.dataset.category;
      const title = (card.dataset.title || card.querySelector('h3').textContent).toLowerCase();
      const matchCat = (active === 'all') || (cat === active);
      const matchText = !q || title.includes(q);
      card.hidden = !(matchCat && matchText);
    });
  };
  search.addEventListener('input', apply);
  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    ch.classList.add('is-active');
    active = ch.dataset.filter;
    apply();
  }));
})();

// Newsletter (local stub)
$('#newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $('#email').value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!ok) { alert('رجاءً أدخل بريدًا صحيحًا.'); return; }
  localStorage.setItem('newsletter-email', email);
  e.target.reset();
  alert('شكرًا لاشتراكك!');
});

// Contact (local stub)
$('#contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  $('#contactStatus').textContent = 'تم استلام رسالتك! سنعود إليك قريبًا.';
  e.target.reset();
});

// Cookie Bar
(function cookieBar(){
  const bar = $('#cookieBar');
  if (!localStorage.getItem('cookies-accepted')) bar.style.display = 'block';
  $('#acceptCookies').addEventListener('click', () => {
    localStorage.setItem('cookies-accepted','yes');
    bar.style.display = 'none';
  });
})();

// Back to top
(function toTop(){
  const btn = $('#toTop');
  addEventListener('scroll', () => { btn.style.display = scrollY > 400 ? 'inline-flex' : 'none'; });
  btn.addEventListener('click', () => { scrollTo({top:0,behavior:'smooth'}); });
})();

// Register Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}
