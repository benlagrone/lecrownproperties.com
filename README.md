# LeCrown Properties Static Site

Static JSON-driven marketing site for `LeCrown Properties`.

## Structure

- `index.html`: app shell
- `app.js`: client-side router and JSON loader
- `styles.css`: brand system and responsive layout
- `components/`: reusable render helpers
- `data/`: English and Chinese content files
- `assets/`: logo and pattern assets

## Local Preview

Because the site loads JSON with `fetch`, serve it over HTTP:

```bash
python3 scripts/dev_server.py 4173
```

Then open `http://localhost:4173`.

## Content Editing

Update any page by editing the matching JSON files:

- `data/site.en.json` / `data/site.zh.json`
- `data/home.en.json` / `data/home.zh.json`
- `data/services.en.json` / `data/services.zh.json`
- `data/properties.en.json` / `data/properties.zh.json`
- `data/clients.en.json` / `data/clients.zh.json`
- `data/case-studies.en.json` / `data/case-studies.zh.json`
- `data/insights.en.json` / `data/insights.zh.json`
- `data/about.en.json` / `data/about.zh.json`
- `data/contact.en.json` / `data/contact.zh.json`

## Containerized deployment

This project is ready to run as a containerized static site on Contabo.

- `Dockerfile`: Nginx-based image for the static SPA
- `compose.yaml`: container runtime on `127.0.0.1:18033`
- `nginx.container.conf`: SPA fallback and cache behavior inside the container
- `nginx.conf`: host Nginx reverse proxy example
- `deploy-contabo.sh`: sync and deploy helper for the VPS
- `scripts/verify-deploy-contract.sh`: simple guard to confirm port and proxy expectations

For full server steps, see [CONTABO-DEPLOY.md](./CONTABO-DEPLOY.md).

## GitHub Actions

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

- Pull requests run deploy-contract validation, render the Compose config, and smoke test the container image.
- Pushes to `main` also publish `ghcr.io/benlagrone/lecrownproperties-site:sha-<commit>` and refresh `:latest`.
- Successful `main` publishes then dispatch the deployment workflow in `fortress-phronesis`, which performs the actual Contabo rollout.

Configure this GitHub secret in `lecrownproperties.com` before relying on the deploy-dispatch job:

- `FORTRESS_WORKFLOW_TOKEN`: GitHub token with permission to dispatch workflows in `benlagrone/fortress-phronesis`

The Contabo SSH and GHCR read secrets stay in `fortress-phronesis`, not in this source repo.

## Planning docs

- `docs/roadmap.md`: phased roadmap covering public site architecture, internal product dogfooding, and the path to multitenant SaaS
