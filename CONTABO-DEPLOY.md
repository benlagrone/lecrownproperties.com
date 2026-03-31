# Contabo Deploy

This site is packaged as a single container that serves the SPA and the GridScope proxy on internal port `8080`.

The deployment model intentionally follows the same broad pattern used in `fortress-phronesis`:

- direct `docker compose` commands are the canonical deploy path
- host Nginx keeps TLS and proxies to a localhost container port
- a fixed host port is part of the deploy contract
- preflight and post-deploy verification are documented explicitly

## Recommended production layout

- Host Nginx handles TLS and public traffic.
- Docker Compose runs the site container on `127.0.0.1:18033`.
- Host Nginx proxies `lecrownproperties.com` to `127.0.0.1:18033`.
- The container loads GridScope settings from environment variables when they are present.

## Files

- `Dockerfile`: Python container image for the SPA server and API proxy
- `compose.yaml`: runtime container definition
- `nginx.conf`: host Nginx reverse proxy example for Contabo
- `scripts/verify-deploy-contract.sh`: confirms the expected port and proxy mapping
- `scripts/smoke-test-gridscope-proxy.sh`: mock-backed proxy validation
- `deploy-contabo.sh`: sync and deploy helper

## Server prerequisites

- Docker installed
- Docker Compose plugin installed
- Host Nginx installed
- DNS already pointed at the Contabo VPS

## Deploy contract

- Workspace root: `~/workspace`
- Stack root: `~/workspace/lecrownproperties`
- Compose file: `~/workspace/lecrownproperties/compose.yaml`
- Compose project: `lecrownproperties`
- Host Nginx upstream: `127.0.0.1:18033`
- Container port: `8080`

Do not change these during deployment unless you also update the docs and Nginx config.

## Manual server setup

Copy the project to the server, for example:

```bash
mkdir -p ~/workspace/lecrownproperties
```

Then sync the files and start the container:

```bash
cd ~/workspace/lecrownproperties
bash scripts/verify-deploy-contract.sh
if [[ -f .env.gridscope.local ]]; then
  docker compose --env-file .env.gridscope.local -p lecrownproperties -f compose.yaml config >/tmp/lecrownproperties-compose.yaml
  docker compose --env-file .env.gridscope.local -p lecrownproperties -f compose.yaml up -d --build
  docker compose --env-file .env.gridscope.local -p lecrownproperties -f compose.yaml ps
else
  docker compose -p lecrownproperties -f compose.yaml config >/tmp/lecrownproperties-compose.yaml
  docker compose -p lecrownproperties -f compose.yaml up -d --build
  docker compose -p lecrownproperties -f compose.yaml ps
fi
```

The site will be available internally at `http://127.0.0.1:18033`.

## Host Nginx

Copy `nginx.conf` to the host Nginx site config, adjust `server_name`, and reload:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/lecrownproperties.conf
sudo ln -sf /etc/nginx/sites-available/lecrownproperties.conf /etc/nginx/sites-enabled/lecrownproperties.conf
sudo nginx -t
sudo systemctl reload nginx
```

## Verification

On the server:

```bash
cd ~/workspace/lecrownproperties
docker compose -p lecrownproperties -f compose.yaml ps
curl -I http://127.0.0.1:18033/
curl -I http://127.0.0.1:18033/contact?lang=zh
curl http://127.0.0.1:18033/health
sudo nginx -t
```

From outside the server after DNS and TLS are in place:

```bash
curl -I https://lecrownproperties.com
curl -I https://www.lecrownproperties.com
```

## Logs

```bash
cd ~/workspace/lecrownproperties
docker compose -p lecrownproperties -f compose.yaml logs --tail=200 lecrown-properties-site
```

## Optional helper script

From the local machine:

```bash
chmod +x deploy-contabo.sh
./deploy-contabo.sh user@your-contabo-host
```

Optional overrides:

```bash
REMOTE_DIR=~/workspace/lecrownproperties ./deploy-contabo.sh user@your-contabo-host
```

The script is only a convenience wrapper around the documented sync and `docker compose` flow above.

## GitHub Actions deployment

The primary automated path now publishes a container image from this repo and dispatches a deployment workflow in `fortress-phronesis`.

This source repo needs only one secret for that handoff:

- `FORTRESS_WORKFLOW_TOKEN`: token allowed to dispatch `deploy-lecrownproperties.yml` in `benlagrone/fortress-phronesis`

The `fortress-phronesis` repo remains responsible for Contabo SSH access, GHCR read access, and the production rollout itself.

## Manual fallback

`deploy-contabo.sh` remains a manual fallback if the fortress path is unavailable. It still syncs source and rebuilds on the VPS using the documented Contabo contract in this file.

## GridScope runtime settings

The server reads these values from environment variables:

- `GRIDSCOPE_EXTERNAL_API_URL`
- `GRIDSCOPE_EXTERNAL_API_KEY`
- `GRIDSCOPE_EXTERNAL_API_AUTH_MODE`
- `GRIDSCOPE_EXTERNAL_API_HEADER_NAME`

The current handoff file keeps the LeCrown-side values in `.env.gridscope.local`. When that file exists on the server, the documented `docker compose --env-file .env.gridscope.local ...` flow injects those values into the container without baking them into the image.
