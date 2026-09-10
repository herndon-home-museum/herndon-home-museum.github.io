document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveSection();
  initAccessibility();
});

function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('open'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

function initActiveSection() {
  const links = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] }
  );

  sections.forEach((section) => observer.observe(section));
}

function initAccessibility() {
  const toolbar = document.querySelector('.a11y-toolbar');
  if (!toolbar) return;

  toolbar.querySelector('[data-action="font-up"]')?.addEventListener('click', () => {
    const current = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = Math.min(current + 2, 22) + 'px';
  });

  toolbar.querySelector('[data-action="font-down"]')?.addEventListener('click', () => {
    const current = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = Math.max(current - 2, 14) + 'px';
  });

  toolbar.querySelector('[data-action="contrast"]')?.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });
}
