# LeCrown Properties Deployment Plan

## Goal

Move `lecrownproperties.com` to the same predictable deployment model used for the other controlled container apps:

- source repo owns the app and image build
- GitHub Actions validates and publishes an immutable image
- Contabo pulls that image instead of rebuilding from synced source
- deployment stays contract-driven and reversible

## Current State

The repo already has a working direct-to-Contabo deploy path:

- SPA and same-origin GridScope proxy served by a single application container
- current compose contract in `compose.yaml`
- fixed localhost bind `127.0.0.1:18033:8080`
- host Nginx proxies `lecrownproperties.com` to `127.0.0.1:18033`
- GitHub workflow `.github/workflows/deploy.yml` validates and then runs `deploy-contabo.sh`
- `deploy-contabo.sh` uses `rsync` and `docker compose up -d --build` on the server

That path is usable, but it is still the older `sync source -> build on server` pattern.

## Recommended Target State

Recommended target: keep the runtime contract exactly the same, but switch the release path to image promotion.

Keep:

- compose project name: `lecrownproperties`
- service name: `lecrown-properties-site`
- host bind: `127.0.0.1:18033`
- public host Nginx proxy and TLS termination
- local smoke paths:
  - `/`
  - `/contact?lang=zh`
  - `/data/site.en.json`

Change:

- build image in GitHub, not on Contabo
- publish image to GHCR, for example `ghcr.io/benlagrone/lecrownproperties-site`
- deploy by pinned tag or digest
- use `fortress-phronesis` as the deployment control plane

## Recommended Architecture

### Source repo: `lecrownproperties.com`

Responsibilities:

- validate deploy contract
- build container image
- smoke-test the built image
- publish `ghcr.io/benlagrone/lecrownproperties-site:sha-<commit>`
- automatically dispatch fortress deploy on successful pushes to `main`

Suggested workflow:

- replace or supersede `.github/workflows/deploy.yml` with `.github/workflows/build-lecrownproperties.yml`
- keep `pull_request` and `push` validation
- remove server-side `rsync + build` from the source repo workflow

### Control plane repo: `fortress-phronesis`

Responsibilities:

- receive approved image SHA from the source repo
- SSH to Contabo
- pull the pinned image
- run `docker compose up -d` for this app only
- run local and public smoke checks
- provide the manual rollback path

Suggested fortress files:

- `deploy/apps/lecrownproperties.yaml`
- `deploy/environments/prod.yaml` entry
- `.github/workflows/deploy-lecrownproperties.yml`
- `docker-compose.lecrownproperties.yml`

## Compose Strategy

Recommended fortress compose file:

```yaml
services:
  lecrown-properties-site:
    image: ${LECROWNPROPERTIES_IMAGE:-ghcr.io/benlagrone/lecrownproperties-site:latest}
    container_name: lecrown-properties-site
    restart: unless-stopped
    ports:
      - "127.0.0.1:18033:8080"
```

Notes:

- do not change the host port
- keep the service name stable
- keep the container-side SPA server and proxy behavior from this repo
- the source repo remains the place where the Dockerfile and app files live

## Phase Plan

### Phase 0: Freeze the runtime contract

Confirm and document these as immutable unless intentionally migrated:

- domain: `lecrownproperties.com`
- optional redirect host: `www.lecrownproperties.com`
- compose project: `lecrownproperties`
- service: `lecrown-properties-site`
- host port: `18033`
- container port: `8080`
- host Nginx upstream: `http://127.0.0.1:18033`

### Phase 1: Make source CI image-first

Implement in `lecrownproperties.com`:

- `bash scripts/verify-deploy-contract.sh`
- `docker compose -p lecrownproperties -f compose.yaml config`
- `bash scripts/smoke-test-container.sh`
- `docker login ghcr.io`
- `docker tag/push ghcr.io/benlagrone/lecrownproperties-site:sha-<commit>`
- optionally also push `:latest`

Expected output artifact:

- image tag
- image digest
- commit SHA

### Phase 2: Add fortress deploy workflow

Implement in `fortress-phronesis`:

- dispatch input: `source_sha`
- image ref:
  - `ghcr.io/benlagrone/lecrownproperties-site:sha-${source_sha}`
- SSH to Contabo
- `docker login ghcr.io` if image is private
- `docker compose -p lecrownproperties -f docker-compose.lecrownproperties.yml pull lecrown-properties-site`
- `docker compose -p lecrownproperties -f docker-compose.lecrownproperties.yml up -d lecrown-properties-site`

Post-deploy smoke:

- `http://127.0.0.1:18033/`
- `http://127.0.0.1:18033/contact?lang=zh`
- `http://127.0.0.1:18033/data/site.en.json`
- `https://lecrownproperties.com/`
- `https://www.lecrownproperties.com/`

### Phase 3: Secrets and server wiring

#### In `lecrownproperties.com`

- `FORTRESS_WORKFLOW_TOKEN`
  - used only to dispatch fortress workflow

Runtime GridScope settings can stay outside the image and be injected at deploy time:

- `GRIDSCOPE_EXTERNAL_API_URL`
- `GRIDSCOPE_EXTERNAL_API_KEY`
- `GRIDSCOPE_EXTERNAL_API_AUTH_MODE`
- `GRIDSCOPE_EXTERNAL_API_HEADER_NAME`

#### In `fortress-phronesis` environment `prod`

- `LECROWNPROPERTIES_DEPLOY_HOST`
- `LECROWNPROPERTIES_DEPLOY_USER`
- `LECROWNPROPERTIES_DEPLOY_ROOT`
- `LECROWNPROPERTIES_DEPLOY_SSH_KEY`
- `LECROWNPROPERTIES_DEPLOY_KNOWN_HOSTS`
- `LECROWNPROPERTIES_GHCR_READ_TOKEN`
  - only needed if the GHCR image is private

#### On Contabo

- Docker installed
- Compose plugin installed
- host Nginx already proxying `lecrownproperties.com`
- Docker logged into GHCR if image is private

### Phase 4: Cutover

Cutover steps:

1. Keep the current repo-local deploy path as fallback until image deploy is verified.
2. Publish the first GHCR image from GitHub Actions.
3. Run fortress deploy workflow manually once for the first cutover.
4. Confirm:
   - container health
   - public HTTP 200/301 behavior
   - Chinese contact page route
   - static JSON asset delivery
5. After first success, enable automatic fortress dispatch on pushes to `main`.

### Phase 5: Rollback

Rollback method:

- redeploy a prior green image SHA through fortress
- do not rebuild from source during rollback
- preserve the same compose project and host port

Rollback command shape:

```bash
LECROWNPROPERTIES_IMAGE=ghcr.io/benlagrone/lecrownproperties-site:sha-<old-sha> \
docker compose -p lecrownproperties -f docker-compose.lecrownproperties.yml up -d lecrown-properties-site
```

## Why This Plan Is Better Than The Current One

Compared with the current `deploy-contabo.sh` approach, this gives:

- repeatable deploys from immutable images
- no server-side build dependency during release
- clearer rollback
- one deployment control path shared with other apps
- less drift between what CI tested and what production runs

## Minimal Alternative

If speed matters more than consistency, keep the current repo-local deployment path and only tighten it:

- keep `.github/workflows/deploy.yml`
- add GHCR image build as a non-blocking artifact
- keep `rsync + docker compose up -d --build`
- add a manual rollback doc

This is the fastest option, but it is not the recommended long-term pattern.

## Recommended Next Implementation Slice

Implement exactly this first slice:

1. Add `build-lecrownproperties.yml` in the source repo.
2. Publish `ghcr.io/benlagrone/lecrownproperties-site`.
3. Add fortress files:
   - `docker-compose.lecrownproperties.yml`
   - `.github/workflows/deploy-lecrownproperties.yml`
   - `deploy/apps/lecrownproperties.yaml`
4. Configure GitHub secrets.
5. Run one manual production cutover.
6. Turn on automatic dispatch from source repo `main` pushes.
