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

// ─── Per-case card colors ────────────────────────────────────────────────
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

function isActive(item) {
  const y = item.year || '';
  return y.includes('Now') || y.startsWith('2026') || y.startsWith('2025');
}

let allItems = [];
let currentFilter = 'ALL';

const FILTERS = ['ALL', 'STRATEGY', 'OPERATIONS', 'ECOSYSTEM', 'VALUE PROPOSITION', 'SPACE', 'EDUCATION', 'PRODUCT'];

// ─── Load ──────────────────────────────────────────────────────────────────
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
    } catch (_) {}
  }

  if (!data) {
    const el = document.getElementById('work-projects');
    if (el) el.innerHTML = '<p style="padding:80px 0;color:var(--muted);">Run via a local server to load projects.</p>';
    return;
  }

  const featured = (data.featured_cases || []).map(c => ({
    id: c.case_id,
    title: c.title,
    client: clientFromSlug(c.source_project_slugs[0], c.case_id),
    year: null,
    specialty: c.specialty,
    category: c.filter || 'ALL',
    isLevel2: false,
    data: c,
  }));

  const level2 = (data.level_2_projects || []).map(p => ({
    id: p.source_project_slug,
    title: p.confidential ? 'Confidential' : p.title,
    client: p.client,
    year: p.year,
    specialty: p.specialty,
    category: p.filter || 'ALL',
    isLevel2: true,
    confidential: p.confidential || false,
    data: p,
  }));

  allItems = [...featured, ...level2];

  renderFilters();
  renderProjects();
  setupPanel();
}

// ─── Filters ────────────────────────────────────────────────────────────────
function renderFilters() {
  const container = document.getElementById('work-filters');
  if (!container) return;

  FILTERS.forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'arch-filter-btn' + (label === 'ALL' ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      currentFilter = label;
      container.querySelectorAll('.arch-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects();
    });
    container.appendChild(btn);
  });
}

function filteredItems() {
  if (currentFilter === 'ALL') return allItems;
  return allItems.filter(item => item.category === currentFilter);
}

// ─── Render ─────────────────────────────────────────────────────────────────
function renderProjects() {
  const container = document.getElementById('work-projects');
  if (!container) return;
  container.className = 'work-projects-inner';

  const filtered = filteredItems();
  const featured = filtered.filter(x => !x.isLevel2);
  const level2   = filtered.filter(x =>  x.isLevel2);

  const active  = level2.filter(isActive);
  const archive = level2.filter(x => !isActive(x));

  // ── Left column: featured cards ──────────────────────────────────────
  const featuredHTML = featured.length
    ? `<div class="work-featured-grid">
        ${featured.map(item => `
          <a class="work-grid-card" href="${caseHref(item.id)}">
            <div class="work-card-img" style="background:${cardColor(item.id, item.specialty)};"></div>
            <div class="work-card-info">
              <h3>${esc(item.title)}</h3>
              <p class="work-card-meta">${esc(item.specialty)}</p>
              <p class="work-card-meta">${esc(item.client)}</p>
            </div>
          </a>
        `).join('')}
      </div>`
    : `<p class="work-empty">No cases in this category.</p>`;

  // ── Right column: level_2 list ───────────────────────────────────────
  const makeRow = item => {
    const sub = [item.specialty, item.client, item.year].filter(Boolean).join(' · ');
    return `
    <a class="work-l2-item${isActive(item) ? ' is-active' : ''} is-level2"
       href="javascript:void(0)" data-id="${esc(item.id)}">
      <span class="work-l2-dot"></span>
      <span class="work-l2-main">
        <span class="work-l2-title">${esc(item.title)}</span>
        <span class="work-l2-sub">${esc(sub)}</span>
      </span>
    </a>`;
  };

  const activeHTML  = active.length  ? active.map(makeRow).join('')  : '';
  const archiveHTML = archive.length ? archive.map(makeRow).join('') : '';

  const level2HTML = `
    ${active.length  ? `<p class="work-l2-section">Active</p>${activeHTML}` : ''}
    ${archive.length ? `<p class="work-l2-section${active.length ? ' work-l2-section--gap' : ''}">Archive</p>${archiveHTML}` : ''}
    ${!level2.length ? `<p class="work-empty">No projects in this category.</p>` : ''}
  `;

  container.innerHTML = `
    <div class="work-two-col">
      <div class="work-col-left">
        <p class="work-col-label">Selected Cases</p>
        ${featuredHTML}
      </div>
      <div class="work-col-right">
        <p class="work-col-label">All Projects</p>
        <div class="work-l2-list">${level2HTML}</div>
      </div>
    </div>
  `;

  // Click handlers for level_2 rows
  container.querySelectorAll('.is-level2').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const item = allItems.find(x => x.id === el.dataset.id);
      if (item) openPanel(item.data);
    });
  });
}

// ─── Panel ─────────────────────────────────────────────────────────────────
function setupPanel() {
  const backdrop = document.getElementById('proj-panel-backdrop');
  const closeBtn  = document.getElementById('proj-panel-close');
  if (backdrop) backdrop.addEventListener('click', closePanel);
  if (closeBtn)  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
}

function openPanel(p) {
  const panel   = document.getElementById('proj-panel');
  const backdrop = document.getElementById('proj-panel-backdrop');
  const body    = document.getElementById('proj-panel-body');
  if (!panel || !body) return;

  const yearRole = [p.year, p.role].filter(Boolean).join(' · ');
  const shiftLines = (p.shift || '').split('\n')
    .map(l => `<p class="panel-shift-line">${esc(l)}</p>`).join('');

  body.innerHTML = p.confidential ? `
    <div class="panel-meta">
      <p class="panel-client">${esc(p.client)}</p>
      <p class="panel-year-role">${esc(yearRole)}</p>
      <p class="panel-specialty">${esc(p.specialty)}</p>
    </div>
    <h2 class="panel-title">Confidential</h2>
    <p class="panel-nda">This project is under NDA. Detailed information is not publicly available.</p>
  ` : `
    <div class="panel-meta">
      <p class="panel-client">${esc(p.client)}</p>
      <p class="panel-year-role">${esc(yearRole)}</p>
      <p class="panel-specialty">${esc(p.specialty)}</p>
    </div>
    <h2 class="panel-title">${esc(p.title)}</h2>

    <div class="panel-section">
      <p class="panel-label">Tension</p>
      <p class="panel-text">${esc(p.core_tension || '')}</p>
    </div>

    <div class="panel-section">
      <p class="panel-label">Shift</p>
      <div class="panel-shift">${shiftLines}</div>
    </div>

    <div class="panel-section">
      <p class="panel-label">Contribution</p>
      <p class="panel-text">${esc(p.contribution || '')}</p>
    </div>

    <div class="panel-section">
      <p class="panel-label">Outcome</p>
      <p class="panel-text">${esc(p.outcome || '')}</p>
    </div>

    ${(p.keywords || []).length ? `
    <div class="panel-keywords">
      ${p.keywords.map(k => `<span class="panel-kw">${esc(k)}</span>`).join('')}
    </div>` : ''}
  `;

  backdrop.classList.add('open');
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  const panel   = document.getElementById('proj-panel');
  const backdrop = document.getElementById('proj-panel-backdrop');
  if (panel)   panel.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

load();
