const projectsList = document.getElementById('projects-list');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

// Load projects from local JSON
fetch('assets/data/projects.json')
  .then(r => r.json())
  .then(data => renderProjects(data))
  .catch(err => {
    console.error('Could not load projects.json', err);
    projectsList.innerHTML = '<p class="muted">No projects found.</p>';
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
