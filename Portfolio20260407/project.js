// ─── Set active nav link ────────────────────────────────────────────────
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.dataset.page === 'work') a.classList.add('active');
});

// ─── Get case ID from URL ────────────────────────────────────────────────
const caseId = new URLSearchParams(window.location.search).get('case');
if (!caseId) { window.location.href = 'work.html'; }

// ─── Per-case hero colors ────────────────────────────────────────────────
const CASE_COLORS = {
  'featured_01': '#08218F',
  'featured_02': '#08218F',
  'featured_03': '#08218F',
  'featured_04': '#08218F',
  'featured_05': '#627039',
  'featured_06': '#EF6717',
  'featured_07': '#061D47',
};

// ─── Helpers ─────────────────────────────────────────────────────────────
function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function clientFromSlug(slug) {
  if (!slug) return '';
  if (slug.startsWith('bbva')) return 'BBVA';
  if (slug.startsWith('vml')) return 'VML The Cocktail';
  if (slug.startsWith('nationale')) return 'Nationale Nederlanden';
  if (slug.startsWith('patronato') || slug.startsWith('aecid')) return 'AECID / Patronato';
  if (slug.startsWith('iberia')) return 'Iberia';
  if (slug.startsWith('ie-')) return 'IE University';
  return slug.split('-').slice(0, 2).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function splitTitle(title) {
  const words = title.split(' ');
  if (words.length <= 3) return title.toUpperCase();
  const mid = Math.ceil(words.length / 2);
  return words.slice(0, mid).join(' ').toUpperCase() + '<br>' + words.slice(mid).join(' ').toUpperCase();
}

// ─── Load ─────────────────────────────────────────────────────────────────
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
    document.getElementById('project-root').innerHTML =
      '<p style="padding:120px var(--pad);color:var(--muted);">Could not load project data. Run via a local server.</p>';
    return;
  }

  const c = (data.featured_cases || []).find(x => x.case_id === caseId);

  if (!c) {
    document.getElementById('project-root').innerHTML =
      '<p style="padding:120px var(--pad);color:var(--muted);">Case not found. <a href="work.html" style="text-decoration:underline;">← Back to work</a></p>';
    return;
  }

  renderCase(c);
  document.title = `${c.title} · José Antonio Ávila`;
}

// ─── Render case ──────────────────────────────────────────────────────────
function renderCase(c) {
  const client = clientFromSlug(c.source_project_slugs[0]);

  // Framing: split double-newlines into paragraphs
  const framingHtml = esc(c.framing || '')
    .replace(/\n\n/g, '</p><p class="project-section-text">');

  // Contribution: same paragraph handling
  const contributionHtml = esc(c.contribution || '')
    .replace(/\n\n/g, '</p><p class="project-section-text">');

  // Shift: two lines (From / To)
  const shiftLines = (c.shift || '').split('\n')
    .map(l => `<p class="project-section-text">${esc(l)}</p>`).join('');

  // Key moves: each item has two \n-separated lines (move + explanation)
  const moves = (c.key_moves_and_learnings || []).map((m, i) => {
    const lines = m.split('\n');
    const headline = (lines[0] || '').replace(/^—\s*/, '');
    const explanation = (lines[1] || '').replace(/^—\s*/, '');
    return `<div class="phase-row">
      <span class="phase-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="phase-content">
        <h3>${esc(headline).toUpperCase()}</h3>
        <p>${esc(explanation)}</p>
      </div>
    </div>`;
  }).join('');

  // Outcome: bullet list
  const outcomes = (c.outcome || [])
    .map(o => `<li class="outcome-item">${esc(o)}</li>`).join('');

  // Keywords: tags
  const keywords = (c.keywords || [])
    .map(k => `<span class="output-tag">${esc(k)}</span>`).join('');

  document.getElementById('project-root').innerHTML = `

    <!-- HERO -->
    <section class="project-hero" style="background:${CASE_COLORS[c.case_id] || '#26412a'};">
      <div class="project-hero-inner">
        <span class="spec-tag">${esc(c.specialty)}</span>
        <h1>${splitTitle(c.title)}</h1>
        <p class="hero-sub-desc">${esc(client)}</p>
      </div>
    </section>

    <!-- BODY -->
    <div class="project-body">

      <!-- SIDEBAR -->
      <aside class="project-sidebar">
        <div class="project-sidebar-inner">
          <p class="sidebar-meta-label">Case Specs</p>
          <div class="sidebar-meta-items">
            <div>
              <p class="meta-item-label">Client</p>
              <p class="meta-item-value">${esc(client)}</p>
            </div>
            <div>
              <p class="meta-item-label">Specialty</p>
              <p class="meta-item-value">${esc(c.specialty)}</p>
            </div>
            <div>
              <p class="meta-item-label">Keywords</p>
              <p class="meta-item-value">${(c.keywords || []).join(', ')}</p>
            </div>
          </div>
          <a href="work.html" class="project-back">← All Work</a>
        </div>
      </aside>

      <!-- CONTENT -->
      <main class="project-content">

        <!-- 01. Framing -->
        <div class="project-section-block">
          <h2 class="project-section-heading">01. Framing</h2>
          <p class="project-section-text">${framingHtml}</p>
        </div>

        <!-- 02. The Shift -->
        <div class="project-section-block">
          <h2 class="project-section-heading">02. The Shift</h2>
          ${shiftLines}
        </div>

        <!-- 03. Contribution -->
        <div class="project-section-block">
          <h2 class="project-section-heading">03. Contribution</h2>
          <p class="project-section-text">${contributionHtml}</p>
        </div>

        <!-- 04. Key Moves & Learnings -->
        ${moves ? `
        <div class="project-section-block">
          <h2 class="project-section-heading">04. Key Moves &amp; Learnings</h2>
          <div class="process-phases">${moves}</div>
        </div>
        ` : ''}

        <!-- 05. Outcome -->
        ${outcomes ? `
        <div class="project-section-block">
          <h2 class="project-section-heading">05. Outcome</h2>
          <ul class="outcome-list">${outcomes}</ul>
        </div>
        ` : ''}

        <!-- Keywords -->
        ${keywords ? `
        <div class="project-section-block">
          <div class="outputs-grid">${keywords}</div>
        </div>
        ` : ''}

      </main>
    </div>
  `;
}

load();
