# Not A Billboard, LLC - Static Site

Simple one-page marketing website built with vanilla HTML, CSS, and JS for GitHub Pages hosting.

## Local Preview

- Open `index.html` directly in your browser, or
- Use a local static server (recommended for smoother testing):
  - `python -m http.server 8080`
  - then visit <http://localhost:8080>

## Publish To GitHub Pages

1. Create a new GitHub repository and push this project.
2. In GitHub, go to **Settings -> Pages**.
3. Under **Build and deployment**, choose:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Save and wait for Pages deployment.

Your site URL will be one of:

- User/org site repo: `https://<username>.github.io/`
- Project repo: `https://<username>.github.io/<repo>/`

## Custom Domain (`nabmaine.com`)

When you are ready to connect the custom domain:

1. In **Settings -> Pages**, set **Custom domain** to `nabmaine.com`.
2. Add DNS records at your registrar:
   - `A` record(s) for apex domain to GitHub Pages IPs.
   - `CNAME` for `www` to `<username>.github.io`.
3. Enable HTTPS in GitHub Pages once DNS is active.

## Contact & Lead Forms

The contact section and “Get Started” modal submit by opening the visitor’s email client with a pre-filled message to:

- `maria@nabmaine.com` (CC: `mike@nabmaine.com`)

No server or Google Form is required for that flow. To switch to a Google Form later, replace the form `action` with your Form `formResponse` URL and map `name="entry.…"` fields to each Google Form question.
