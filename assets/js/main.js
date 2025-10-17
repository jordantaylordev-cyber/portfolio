const projectsList = document.getElementById('projects-list');
const yearEl = document.getElementById('year');
const timelineList = document.getElementById('timeline-list');

yearEl.textContent = new Date().getFullYear();

// Load projects from local JSON
fetch('assets/data/projects.json')
  .then(r => r.json())
  .then(data => renderProjects(data))
  .catch(err => {
    console.error('Could not load projects.json', err);
    projectsList.innerHTML = '<p class="muted">No projects found.</p>';
  });

// Load timeline
fetch('assets/data/timeline.json')
  .then(r => r.json())
  .then(data => renderTimeline(data))
  .catch(err => {
    console.warn('No timeline data', err);
  });

function renderProjects(projects){
  if(!projects || projects.length === 0) {
    projectsList.innerHTML = '<p class="muted">No projects yet.</p>';
    return;
  }
  projectsList.innerHTML = projects.map(p => projectCard(p)).join('\n');
}

function projectCard(p){
  const img = p.image ? `<img src="${p.image}" alt="${escapeHtml(p.title)} thumbnail" class="w-full h-40 object-cover rounded-md mb-3">` : '';
  return `\n  <article class="card">\n    ${img}\n    <h4 class="text-slate-900">${escapeHtml(p.title)}</h4>\n    <p class="muted text-sm">${escapeHtml(p.stack.join(' • '))}</p>\n    <p class="mt-2 text-slate-700">${escapeHtml(p.description)}</p>\n    <p class="mt-3"><a class="text-brand font-medium" href="${p.url}" target="_blank" rel="noopener">View project</a></p>\n  </article>`;
}

function escapeHtml(s){
  if(!s) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// Render career timeline
function renderTimeline(items){
  if(!timelineList) return;
  if(!items || items.length === 0){
    timelineList.innerHTML = '<p class="muted">No timeline available.</p>';
    return;
  }
  // Build alternating layout
  timelineList.innerHTML = items.map((it, idx) => {
    const sideClass = (idx % 2 === 0) ? 'timeline-item-left' : 'timeline-item-right';
    return `\n      <div class="timeline-item ${sideClass} p-4">\n        <div class="timeline-badge" style="${idx % 2 === 0 ? 'right:-6px' : 'left:-6px'}"></div>\n        <div class="p-4 bg-white rounded-md shadow-sm">\n          <div class="flex items-baseline justify-between">\n            <div class="text-sm text-slate-500">${escapeHtml(it.start)} — ${escapeHtml(it.end)}</div>\n            <div class="text-sm font-medium text-slate-700">${escapeHtml(it.company)}</div>\n          </div>\n          <h4 class="mt-2 text-slate-900 font-semibold">${escapeHtml(it.title)}</h4>\n          <p class="mt-1 text-slate-700">${escapeHtml(it.description)}</p>\n        </div>\n      </div>`;
  }).join('\n');
}

// Smooth scroll for in-page anchors
(function setupSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return; // normal behavior
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - 24; // slight offset
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

// Resume preview: if PDF missing, fallback link is already in HTML; nothing more required

// Contact form fallback: if the form action still contains the placeholder
// (no Formspree ID configured), open the user's mail client with a prefilled
// mailto: link. This avoids relying on a third-party service.
;(function setupContactMailtoFallback(){
  try {
    const contactForm = document.querySelector('form[action*="formspree.io"]');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      const action = (contactForm.getAttribute('action') || '').trim();
      const isPlaceholder = action.includes('{your-form-id}') || action.includes('{');
      if (!isPlaceholder) return; // let normal submission proceed

      e.preventDefault();

      const name = (contactForm.querySelector('[name="name"]') || {}).value || '';
      const email = (contactForm.querySelector('[name="email"]') || {}).value || '';
      const message = (contactForm.querySelector('[name="message"]') || {}).value || '';

      const subject = encodeURIComponent(`Portfolio contact from ${name || email}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

      // Use the visible contact email if present in the page, otherwise fallback
      const visibleEmail = (document.getElementById('contact-email') || {}).textContent || 'you@example.com';
      const to = visibleEmail.includes('@') ? visibleEmail : 'you@example.com';

      // Build mailto and navigate the browser to it (will open mail client)
      const mailto = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
      window.location.href = mailto;

      // Provide immediate feedback on the page
      const note = document.createElement('p');
      note.className = 'text-slate-700 mt-3';
      note.textContent = 'Opening your email client to send the message...';
      contactForm.after(note);
    });
  } catch (err) {
    // do not break the rest of the page
    console.error('contact mailto fallback error', err);
  }
})();
