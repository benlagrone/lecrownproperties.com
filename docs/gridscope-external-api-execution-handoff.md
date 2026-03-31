# GridScope External API Execution Handoff

Date: March 30, 2026

## Purpose

This handoff tells the `lecrownproperties.com` codebase how to consume the separate GridScope external API for the property evaluation feature.

This is a server-to-server integration.

Do not call the GridScope API directly from browser JavaScript.

## Auth Material

The LeCrown-side auth file is local-only and intentionally not committed:

- `/Users/benjaminlagrone/Documents/projects/real-estate/lecrownproperties/.env.gridscope.local`

That file contains:

- `GRIDSCOPE_EXTERNAL_API_KEY`
- `GRIDSCOPE_EXTERNAL_API_URL`
- `GRIDSCOPE_EXTERNAL_API_AUTH_MODE`
- `GRIDSCOPE_EXTERNAL_API_HEADER_NAME`

Important:

- Keep the key server-side only.
- Do not place the key in `app.js`, `data/*.json`, HTML, browser storage, or client-rendered config.
- The same key value must also be configured on the deployed GridScope external API service as `GRIDSCOPE_EXTERNAL_API_KEY`.

## Current Architecture Constraint

This repository is currently a static site.

That means it cannot safely own the GridScope API key inside the existing client-only app.

Before the property evaluation feature ships, LeCrown needs a server-side surface such as one of these:

1. `api.lecrownproperties.com` as a small backend or serverless proxy
2. `portal.lecrownproperties.com` as an authenticated app with server routes
3. another private LeCrown backend that the static site or future portal can call

Required request flow:

1. Browser calls LeCrown backend
2. LeCrown backend calls GridScope external API
3. GridScope returns evaluation JSON
4. LeCrown backend returns a filtered response to the browser

## GridScope API Auth

GridScope external API expects one of these on protected `/v1/*` routes:

- `X-API-Key: <key>`
- `Authorization: Bearer <key>`

Use the simpler header first:

```http
X-API-Key: ${GRIDSCOPE_EXTERNAL_API_KEY}
```

## Initial Endpoint To Use

Start with:

- `POST /v1/evaluate`

Then add:

- `POST /v1/parcel/resolve`
- `POST /v1/evaluate/compare-modes`
- `GET /v1/evaluations/{id}`
- `GET /v1/reports/{id}`

## Initial Request Shape

```json
{
  "parcel": {
    "locator": {
      "parcel_id": "123-ABC"
    },
    "market": "tx-statewide"
  },
  "modes": ["data_center"],
  "include_report": true,
  "include_ai_summary": false
}
```

Supported locator paths today:

- `parcel_id`
- `latitude` and `longitude`
- geometry payloads

Address-only lookup is not the right first integration path.

## Initial Execution Plan For LeCrown Codex

1. Read `/Users/benjaminlagrone/Documents/projects/real-estate/lecrownproperties/.env.gridscope.local`.
2. Add a server-side integration surface before touching the current browser app.
3. Load `GRIDSCOPE_EXTERNAL_API_KEY` and `GRIDSCOPE_EXTERNAL_API_URL` from server env only.
4. Build a backend function that forwards property evaluation requests to `${GRIDSCOPE_EXTERNAL_API_URL}/v1/evaluate`.
5. Send the key using `X-API-Key`.
6. Return only the needed evaluation fields to the frontend.
7. Add request timeout, error handling, and basic response caching.

## Minimum Backend Contract

LeCrown backend request to GridScope:

```http
POST ${GRIDSCOPE_EXTERNAL_API_URL}/v1/evaluate
Content-Type: application/json
X-API-Key: ${GRIDSCOPE_EXTERNAL_API_KEY}
```

LeCrown backend should expect:

- `normalized_parcel`
- `shared_facts`
- `mode_evaluations`
- optional `report_id`
- optional `evaluation_id`

## Security Rules

- Never expose the GridScope key to the browser.
- Never commit the populated `.env.gridscope.local` file.
- Use a separate staging key later if LeCrown gets a staging environment.
- Rotate the key if it is ever copied into logs, screenshots, or tracked files.

## Operational Next Step

LeCrown can prepare the integration now, but the real `GRIDSCOPE_EXTERNAL_API_URL` should be filled only after the separate GridScope external API deployment is live.

Once deployment exists, update:

- `/Users/benjaminlagrone/Documents/projects/real-estate/lecrownproperties/.env.gridscope.local`

and mirror the same key into the GridScope deployment environment.
