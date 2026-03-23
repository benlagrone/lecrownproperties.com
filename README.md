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

- Pull requests and pushes to `main` run deploy-contract validation, render the Compose config, and smoke test the container image.
- Pushes to `main` then deploy to Contabo over SSH by running `deploy-contabo.sh`.

Configure these GitHub secrets before relying on the deploy job:

- `CONTABO_HOST`: VPS hostname or IP
- `CONTABO_USER`: SSH user on the VPS
- `CONTABO_SSH_KEY`: private key for that user
- `CONTABO_PORT`: optional SSH port override
- `CONTABO_REMOTE_DIR`: optional deploy path override

## Planning docs

- `docs/roadmap.md`: phased roadmap covering public site architecture, internal product dogfooding, and the path to multitenant SaaS
