// ─── Specialty colors ────────────────────────────────────────────────────
const SPECIALTY_COLORS = {
  'Design Strategy':              '#C8BCA8',
  'Organizational Strategy':      '#B5C5AE',
  'Product and Service Strategy': '#C8BBC0',
  'Strategic Foresight':          '#A8BBC8',
  'Ecosystem Strategy':           '#A8C5B8',
  'Service Design':               '#AEBCC8',
  'Design Research':              '#C8C0A5',
  'System Strategy':              '#B0BFC8',
  'Space Strategy':               '#C8C0A5',
  'Business Design':              '#C8BEA8',
  'Innovation Strategy':          '#BFBAD0',
  'Brand Strategy':               '#CEBEAA',
  'Product Design':               '#C8BEA8',
  'Mentorship':                   '#C8B8B5',
  'Product Development':          '#C8BEA8',
  'Program Strategy':             '#BFBAD0',
};

function specialtyColor(s) { return SPECIALTY_COLORS[s] || '#C4C0B8'; }

// ─── Per-case card colors (override specialty) ────────────────────────────
const CASE_COLORS = {
  'featured_01': '#08218F',
  'featured_02': '#08218F',
  'featured_03': '#08218F',
  'featured_04': '#08218F',
  'featured_05': '#627039',
  'featured_06': '#EF6717',
  'featured_07': '#061D47',
};

function cardColor(caseId, specialty) {
  return CASE_COLORS[caseId] || specialtyColor(specialty);
}

function clientFromSlug(slug, caseId) {
  if (!slug) return '';
  if (caseId === 'featured_07') return 'IDB · Patronato Pikimachay';
  if (slug.startsWith('bbva')) return 'BBVA';
  if (slug.startsWith('vml')) return 'VML The Cocktail';
  if (slug.startsWith('nationale')) return 'Nationale Nederlanden';
  if (slug.startsWith('patronato') || slug.startsWith('aecid')) return 'IDB · Patronato Pikimachay';
  if (slug.startsWith('iberia')) return 'Iberia';
  if (slug.startsWith('ie-')) return 'IE University';
  return slug.split('-').slice(0, 2).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function caseHref(id) {
  return 'project.html?case=' + encodeURIComponent(id);
}

let allFeatured = [];

async function load() {
  const paths = [
    'portfolio_project_content.json',
    '/portfolio_project_content.json',
    '../portfolio_project_content.json'
  ];
  let data = null;

  for (const path of paths) {
    try {
      const res = await fetch(path);
      if (res.ok) { data = await res.json(); break; }
    } catch (e) { /* try next */ }
  }

  const grid = document.getElementById('project-grid');

  if (!data) {
    if (grid) grid.innerHTML = '<p style="padding:40px;color:var(--muted);">Run via a local server to load projects.</p>';
    return;
  }

  allFeatured = data.featured_cases || [];
  renderCarousel(allFeatured);
}

// ─── Carousel ─────────────────────────────────────────────────────────
function renderCarousel(cases) {
  const track = document.getElementById('project-grid');
  if (!track) return;

  track.innerHTML = cases.map((c) => {
    const client = clientFromSlug(c.source_project_slugs[0], c.case_id);
    return `
    <a class="proj-card" href="${caseHref(c.case_id)}">
      <div class="card-image" style="background:${cardColor(c.case_id, c.specialty)};"></div>
      <div class="card-body">
        <h3 class="card-title">${esc(c.title)}</h3>
        <p class="card-type-label">${esc(c.specialty)}</p>
        <p class="card-client-label">${esc(client)}</p>
      </div>
    </a>
  `;
  }).join('');

  // ─── Carousel navigation ────────────────────────────────────────────
  const prev = document.getElementById('carousel-prev');
  const next = document.getElementById('carousel-next');

  const scroll = (dir) => {
    const card = track.querySelector('.proj-card');
    if (!card) return;
    const step = card.offsetWidth + 16;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (prev) prev.addEventListener('click', () => scroll(-1));
  if (next) next.addEventListener('click', () => scroll(1));
}

load();

// ─── Nav: auto-contrast over dark sections ───────────────────────────────
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const darkSections = document.querySelectorAll('[data-nav-dark]');
  if (!darkSections.length) return;

  const observer = new IntersectionObserver((entries) => {
    const anyDark = [...darkSections].some(el => {
      const r = el.getBoundingClientRect();
      return r.top < 80 && r.bottom > 0;
    });
    nav.classList.toggle('over-dark', anyDark);
  }, { threshold: 0, rootMargin: '0px 0px -90% 0px' });

  darkSections.forEach(s => observer.observe(s));
}());
