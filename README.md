# LeCrown Properties Site

JSON-driven marketing site for `LeCrown Properties` with a same-origin server-side proxy for the GridScope property evaluation API.

## Structure

- `index.html`: app shell
- `app.js`: client-side router and JSON loader
- `styles.css`: brand system and responsive layout
- `server.py`: SPA server plus `POST /api/gridscope/evaluate`
- `components/`: reusable render helpers
- `data/`: English and Chinese content files
- `assets/`: logo and pattern assets

## Local Preview

Serve the app over HTTP with SPA fallback:

```bash
python3 server.py 4173
```

Then open `http://localhost:4173`.

If `.env.gridscope.local` is present, the GridScope proxy is also available at `POST /api/gridscope/evaluate`.

Example request:

```bash
curl -X POST http://127.0.0.1:4173/api/gridscope/evaluate \
  -H 'Content-Type: application/json' \
  -d '{
    "parcel": {
      "locator": { "parcel_id": "123-ABC" },
      "market": "tx-statewide"
    },
    "modes": ["data_center"],
    "include_report": true,
    "include_ai_summary": false
  }'
```

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

This project is ready to run as a containerized site and proxy on Contabo.

- `Dockerfile`: Python-based image for the SPA server and GridScope proxy
- `compose.yaml`: container runtime on `127.0.0.1:18033` with optional GridScope env injection
- `nginx.conf`: host Nginx reverse proxy example
- `deploy-contabo.sh`: sync and deploy helper for the VPS
- `scripts/verify-deploy-contract.sh`: simple guard to confirm port and proxy expectations
- `scripts/smoke-test-gridscope-proxy.sh`: mock-backed proxy smoke test

For full server steps, see [CONTABO-DEPLOY.md](./CONTABO-DEPLOY.md).

## GitHub Actions

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

- Pull requests run deploy-contract validation, render the Compose config, smoke test the GridScope proxy, and smoke test the container image.
- Pushes to `main` also publish `ghcr.io/benlagrone/lecrownproperties-site:sha-<commit>` and refresh `:latest`.
- Successful `main` publishes then dispatch the deployment workflow in `fortress-phronesis`, which performs the actual Contabo rollout.

Configure this GitHub secret in `lecrownproperties.com` before relying on the deploy-dispatch job:

- `FORTRESS_WORKFLOW_TOKEN`: GitHub token with permission to dispatch workflows in `benlagrone/fortress-phronesis`

The Contabo SSH and GHCR read secrets stay in `fortress-phronesis`, not in this source repo.

## Planning docs

- `docs/roadmap.md`: phased roadmap covering public site architecture, internal product dogfooding, and the path to multitenant SaaS
