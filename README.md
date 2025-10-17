# Portfolio — GitHub Pages scaffold

This is a simple, static portfolio scaffold intended for hosting on GitHub Pages.

What you'll find:
- `index.html` — single-page portfolio
- `assets/css/styles.css` — basic responsive styles
- `assets/js/main.js` — tiny client-side code that loads `assets/data/projects.json`
- `assets/data/projects.json` — sample projects list
- `.github/workflows/gh-pages.yml` — GitHub Actions workflow to publish to `gh-pages` branch

Quick local preview (no build required):

PowerShell:

```powershell
# start a simple file server from repo root
python -m http.server 8000
# then open http://localhost:8000
```

Customizing:
- Replace placeholder text in `index.html` (name, bio, links).
- Update `assets/data/projects.json` with your projects.
- Change styles in `assets/css/styles.css`.
 - Add project thumbnails to `assets/images/` and reference them in `assets/data/projects.json` using the `image` field (e.g. `assets/images/project1.png`). Thumbnails should be around 800×450 or 1200×675 for best results.

- Timeline and resume
- Add a career timeline in `assets/data/timeline.json` (example file included). Each item should have `start`, `end`, `title`, `company`, and `description` fields.
- To show your resume on the site, add a PDF named `assets/resume.pdf`. The site will attempt to render it in an embedded preview with a download fallback.

Formspree contact form
- The included contact form posts to Formspree. Replace the action URL in `index.html` with your Formspree form endpoint (e.g. `https://formspree.io/f/mayvlkbr`).
- Mailto fallback: this project includes a mailto fallback. If the Formspree action remains the placeholder, clicking "Send message" will open the visitor's default mail client with a prefilled email (name, email, message). This avoids third-party services but requires the visitor to have an email client configured.

Deploying to GitHub Pages (automatic via Actions):
1) Push this repository to GitHub.
2) Create a repository secret `ACTIONS_DEPLOY_KEY` or follow the workflow to deploy using `peaceiris/actions-gh-pages` (the workflow included uses the default token and will publish to `gh-pages`).

If you'd like, I can personalize this site with your name, bio, and project list. Reply with the content and preferred GitHub repository name.
