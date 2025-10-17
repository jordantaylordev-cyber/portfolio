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
    let bulletsHtml = '';
    if (it.bullets && it.bullets.length) {
      const bullets = it.bullets;
      // Build list items; highlight first bullet
      const checkSvg = `<svg class="timeline-check inline-block mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      const listItems = bullets.map((b, bi) => {
      const text = bi === 0 ? `<strong>${escapeHtml(b)}</strong>` : escapeHtml(b);
        return `<li class="mb-1">${checkSvg}${text}</li>`;
      });

      if (bullets.length > 3) {
        const visible = listItems.slice(0,3).join('');
        const hidden = listItems.slice(3).join('');
        // Toggle button includes an inline chevron and ARIA attributes for accessibility
        bulletsHtml = `\n        <ul class="timeline-bullets mt-3 text-slate-700">${visible}</ul>\n        <ul class="timeline-bullets mt-3 text-slate-700 collapsed" id="hidden-bullets-${idx}">${hidden}</ul>\n        <button class="timeline-toggle mt-2 text-sm text-brand" data-target="hidden-bullets-${idx}" aria-expanded="false" aria-controls="hidden-bullets-${idx}">Show more <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
      } else {
        bulletsHtml = `<ul class="timeline-bullets mt-3 text-slate-700">${listItems.join('')}</ul>`;
      }
    }

    const html = `\n      <div class="timeline-item ${sideClass} p-4">\n        <div class="timeline-badge" style="${idx % 2 === 0 ? 'right:-6px' : 'left:-6px'}"></div>\n        <div class="p-4 bg-white rounded-md shadow-sm">\n          <div class="flex items-baseline justify-between">\n            <div class="text-sm text-slate-500">${escapeHtml(it.start)} — ${escapeHtml(it.end)}</div>\n            <div class="text-sm font-medium text-slate-700">${escapeHtml(it.company)}</div>\n          </div>\n          <h4 class="mt-2 text-slate-900 font-semibold">${escapeHtml(it.title)}</h4>\n          <p class="mt-1 text-slate-700">${escapeHtml(it.description)}</p>\n          ${bulletsHtml}\n        </div>\n      </div>`;

    return html;
  }).join('\n');
}

// Attach timeline toggle handlers after rendering
setTimeout(() => {
  document.querySelectorAll('.timeline-toggle').forEach(btn => {
    // click toggles
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (!target) return;
      const isOpen = target.classList.contains('open');
      if (isOpen) {
        target.classList.remove('open');
        target.classList.add('collapsed');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('open');
        btn.firstChild.nodeValue = 'Show more ';
      } else {
        target.classList.remove('collapsed');
        target.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('open');
        btn.firstChild.nodeValue = 'Show less ';
      }
    });

    // keyboard activation (Enter / Space)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}, 50);

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
