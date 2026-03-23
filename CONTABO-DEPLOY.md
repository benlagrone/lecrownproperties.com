# Contabo Deploy

This site is packaged as a single Nginx container that serves the static SPA on internal port `8080`.

The deployment model intentionally follows the same broad pattern used in `fortress-phronesis`:

- direct `docker compose` commands are the canonical deploy path
- host Nginx keeps TLS and proxies to a localhost container port
- a fixed host port is part of the deploy contract
- preflight and post-deploy verification are documented explicitly

## Recommended production layout

- Host Nginx handles TLS and public traffic.
- Docker Compose runs the site container on `127.0.0.1:18033`.
- Host Nginx proxies `lecrownproperties.com` to `127.0.0.1:18033`.

## Files

- `Dockerfile`: static container image
- `compose.yaml`: runtime container definition
- `nginx.container.conf`: container-side SPA config
- `nginx.conf`: host Nginx reverse proxy example for Contabo
- `scripts/verify-deploy-contract.sh`: confirms the expected port and proxy mapping
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
docker compose -p lecrownproperties -f compose.yaml config >/tmp/lecrownproperties-compose.yaml
docker compose -p lecrownproperties -f compose.yaml up -d --build
docker compose -p lecrownproperties -f compose.yaml ps
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

This repository also includes a GitHub Actions workflow that deploys on pushes to `main`.

Before enabling that path, add these repository or environment secrets in GitHub:

- `CONTABO_HOST`: VPS hostname or IP
- `CONTABO_USER`: SSH user with access to `REMOTE_DIR`
- `CONTABO_SSH_KEY`: private SSH key for that user
- `CONTABO_PORT`: optional SSH port override, defaults to `22`
- `CONTABO_REMOTE_DIR`: optional deploy path override, defaults to `~/workspace/lecrownproperties`

The workflow verifies the deploy contract, builds the container, smoke tests it locally on the runner, then calls `deploy-contabo.sh` for the actual sync and `docker compose up -d --build` step.
