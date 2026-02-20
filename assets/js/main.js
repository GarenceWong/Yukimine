const sakeCollection = [
  {
    title: '雪峰 純米大吟醸',
    subtitle: 'Yukimine Junmai Daiginjo',
    price: '¥12,800',
    image:
      'https://images.unsplash.com/photo-1703756292847-833e3cb741eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWtlJTIwYm90dGxlJTIwamFwYW5lc2V8ZW58MXx8fHwxNzcxNTgyODE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description:
      'Premium sake polished to 35%, featuring delicate floral notes and a silky smooth finish.',
    grade: 'ULTRA PREMIUM',
  },
  {
    title: '雪峰 純米吟醸',
    subtitle: 'Yukimine Junmai Ginjo',
    price: '¥8,500',
    image:
      'https://images.unsplash.com/photo-1664711414381-b0768d979223?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWtlJTIwcG91cmluZyUyMGdsYXNzfGVufDF8fHx8MTc3MTU4MjgxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description:
      'Balanced and aromatic with notes of green apple and pear, perfect for any occasion.',
    grade: 'PREMIUM',
  },
  {
    title: '雪峰 本醸造',
    subtitle: 'Yukimine Honjozo',
    price: '¥5,200',
    image:
      'https://images.unsplash.com/photo-1759753876668-a5e7a7e41a59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWtlJTIwY2VyYW1pYyUyMGN1cHxlbnwxfHx8fDE3NzE1ODI4MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description:
      'Classic dry sake with clean, crisp flavor profile. Excellent served warm or chilled.',
    grade: 'CLASSIC',
  },
  {
    title: '雪峰 にごり酒',
    subtitle: 'Yukimine Nigori',
    price: '¥6,800',
    image:
      'https://images.unsplash.com/photo-1765008603344-ec98d37d2fc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGJyZXdlcnklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NzE1ODI4MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Unfiltered cloudy sake with a rich, creamy texture and subtle sweetness.',
    grade: 'SPECIALTY',
  },
];

function qs(sel, root = document) {
  return root.querySelector(sel);
}
function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}


(function initMobileMenu() {
  const toggle = qs('.nav__toggle');
  const mobile = qs('.nav__mobile');
  if (!toggle || !mobile) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobile.hidden = !open;
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
  });


  qsa('a', mobile).forEach((a) => a.addEventListener('click', () => setOpen(false)));


  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 860px)').matches) setOpen(false);
  });
})();


(function renderProducts() {
  const grid = qs('#productGrid');
  if (!grid) return;

  const html = sakeCollection
    .map(
      (p, i) => `
      <article class="product reveal" style="--delay:${i * 120}ms" data-tilt>
        <div class="product__badge">${escapeHtml(p.grade)}</div>
        <div class="product__media">
          <img src="${p.image}" alt="${escapeAttr(p.title)}" loading="lazy" />
          <div class="product__glass" aria-hidden="true"></div>
          <div class="product__shine" aria-hidden="true"></div>
        </div>
        <div class="product__body">
          <h3 class="product__title">${escapeHtml(p.title)}</h3>
          <p class="product__sub">${escapeHtml(p.subtitle)}</p>
          <p class="product__desc">${escapeHtml(p.description)}</p>
          <div class="product__row">
            <span class="product__price">${escapeHtml(p.price)}</span>
            <button class="btn btn--primary product__btn" type="button" data-view="${i}">VIEW DETAILS</button>
          </div>
        </div>
      </article>
    `
    )
    .join('');

  grid.innerHTML = html;


  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    const idx = Number(btn.getAttribute('data-view'));
    const item = sakeCollection[idx];
    if (!item) return;

    alert(`${item.title}\n${item.subtitle}\n\n${item.description}\n\nPrice: ${item.price}`);
  });
})();


(function revealOnScroll() {
  const els = qsa('.reveal');
  if (!els.length) return;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduce) {
    els.forEach((el) => el.classList.add('reveal--in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const ent of entries) {
        if (ent.isIntersecting) {
          ent.target.classList.add('reveal--in');
          io.unobserve(ent.target);
        }
      }
    },
    { threshold: 0.18 }
  );

  els.forEach((el) => io.observe(el));
})();


(function parallax() {
  const bg = qs('[data-parallax]');
  if (!bg) return;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduce) return;

  let rafId = 0;
  const onScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      const rect = bg.parentElement.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const progress = clamp((viewH - rect.top) / (viewH + rect.height), 0, 1);
      const y = lerp(-20, 50, progress);
      bg.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


(function particles() {
  const root = qs('.particles');
  if (!root) return;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduce) return;

  const count = 18;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 6 + Math.random() * 10;
    const dur = 10 + Math.random() * 12;
    const delay = Math.random() * 6;

    p.style.left = `${x}vw`;
    p.style.top = `${y}vh`;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.setProperty('--dur', `${dur}s`);
    p.style.setProperty('--delay', `${delay}s`);

    frag.appendChild(p);
  }

  root.appendChild(frag);
})();

(function tiltCards() {
  const cards = qsa('[data-tilt]');
  if (!cards.length) return;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduce) return;

  const max = 10; 

  function onMove(e, el) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);

    const ry = clamp(dx, -1, 1) * max;
    const rx = clamp(-dy, -1, 1) * max;

    el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  }

  function reset(el) {
    el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    el.classList.remove('tiltActive');
  }

  cards.forEach((el) => {
    el.addEventListener('mouseenter', () => el.classList.add('tiltActive'));
    el.addEventListener('mousemove', (e) => onMove(e, el));
    el.addEventListener('mouseleave', () => reset(el));
    el.addEventListener('touchstart', () => reset(el), { passive: true });
  });
})();

// 7) Contact form (demo)
(function contactForm() {
  const form = qs('#contactForm');
  const note = qs('#formNote');
  if (!form || !note) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();


    note.textContent = `Thanks, ${name || 'friend'}! (Demo only — wire this to your backend.)`;
    form.reset();
  });
})();

(function setYear() {
  const y = qs('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
function escapeAttr(str) {
  return escapeHtml(str);
}
