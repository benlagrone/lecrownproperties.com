# GridScope Land-Use Strategy Handoff

Date: March 17, 2026

## Purpose

This handoff captures a directional change:

- GridScope should not remain only a data-center screening tool with an internal UI.
- The more valuable direction is a reusable land-intelligence engine that can evaluate multiple land-use modes.
- The customer-facing product should be a separate portal or application that consumes GridScope through an API.

This is a product and platform decision, not just a feature request.

## Current State

### LeCrown repo

- The current LeCrown site is a static JSON-driven marketing site.
- Its roadmap already anticipates a separate portal and API surface.

Relevant local references:

- `/Users/benjaminlagrone/Documents/projects/real-estate/lecrownproperties/README.md`
- `/Users/benjaminlagrone/Documents/projects/real-estate/lecrownproperties/docs/roadmap.md`

### GridScope repo

- GridScope already has a pipeline, API, Streamlit UI, GCP deployment runbook, and Cloud Run deployment script.
- It already runs in a GCP-oriented shape:
  - Cloud Run UI
  - optional Cloud Run API
  - Cloud Run Job for batch pipeline runs
  - GCS buckets for inputs and outputs
  - Google Workspace-restricted access

Relevant local references:

- `/Users/benjaminlagrone/Documents/projects/real-estate/data-center-bird-dog/README.md`
- `/Users/benjaminlagrone/Documents/projects/real-estate/data-center-bird-dog/data_center_bird_dog/api.py`
- `/Users/benjaminlagrone/Documents/projects/real-estate/data-center-bird-dog/docs/deployment_runbook_gcp_cloud_run.md`
- `/Users/benjaminlagrone/Documents/projects/real-estate/data-center-bird-dog/scripts/deploy_gcp.sh`

## Directional Decision

### Decision

Keep GridScope on GCP for the next stage and evolve it into a headless land-intelligence service.

Do not move the core platform out of GCP right now.

Do not make the Streamlit UI the long-term product surface.

### Why

- The GCP foundation is already partly built and documented.
- Cloud Run matches the current workload split well: request/response API, internal UI, and run-to-completion jobs.
- Existing private Workspace access is useful for internal ops while the commercial product is still being shaped.
- Replatforming now would create churn without proving revenue first.

### Strategic framing

GridScope becomes:

- parcel resolution and enrichment engine
- land-use mode scoring engine
- report payload API
- internal analyst console

The portal/app becomes:

- customer-facing workflow
- authentication and account model
- billing and subscriptions
- branded report presentation
- CRM and follow-up workflow

## Locked Plan

Status: locked on March 17, 2026 unless revenue or infrastructure constraints force a change.

- Keep GridScope on GCP.
- Treat GridScope as the engine, API layer, and internal analyst console.
- Keep the current Streamlit UI as an internal operating surface, not the commercial product.
- Build a light public parcel screen to generate leads and qualify demand.
- Build the full product as an authenticated portal that consumes GridScope APIs.
- Keep deterministic scoring as the source of truth.
- Use Vertex AI and agent workflows only for summaries, packaging, copilots, and follow-up automation where clear ROI exists.

Execution roadmap:

- `docs/gridscope-land-use-roadmap.md`

## Product Shift

### Old framing

- internal or semi-internal parcel screening
- mostly data-center land origination

### New framing

- multi-mode land-use evaluator
- one parcel in, ranked land-use modes out
- API-first intelligence product

Recommended mode rollout:

1. Data center
2. Industrial / logistics
3. Outside storage / flex industrial
4. Solar / storage
5. Multifamily or retail only after clearer market demand

Important naming guidance:

- Use terms like `site suitability`, `land-use mode evaluation`, or `highest-and-best-use screening`.
- Avoid calling it `valuation` until there is a real comps and pricing layer behind it.

## What Goes Into GridScope

These are the right new features for GridScope itself:

- parcel/address/APN resolution
- shared parcel normalization and geometry services
- reusable mode scorers
- power, flood, fiber, water, road, and neighbor enrichment
- owner and seller-signal enrichment
- evaluation report JSON assembly
- async evaluation jobs
- run persistence and auditability
- internal analyst review tools

These are not GridScope responsibilities:

- marketing website
- customer billing
- customer workspace UX
- polished external share pages
- CRM ownership
- sales onboarding

## API-First Boundary

GridScope should expose a stable service layer for the next product surface.

Recommended endpoints:

- `POST /v1/parcel/resolve`
- `POST /v1/evaluate`
- `POST /v1/evaluate/compare-modes`
- `GET /v1/evaluations/{id}`
- `GET /v1/reports/{id}`
- `GET /v1/modes`
- `GET /v1/markets`

Recommended output shape:

- normalized parcel facts
- per-mode fit score
- blockers
- positive signals
- confidence
- evidence
- nearby-use context
- next diligence actions
- AI-written executive summary

## GCP Recommendation

### Recommendation

Stay on GCP now.

The current architecture already maps cleanly to Google Cloud services:

- Cloud Run for API and internal UI
- Cloud Run Jobs for long-running evaluations and scheduled refreshes
- Cloud Storage for source and output datasets
- Artifact Registry and Cloud Build for deployment
- IAM / Workspace gating for internal access

For the product layer, add only what is needed:

- Cloud SQL Postgres for portal state, user data, jobs, and billing metadata
- Secret Manager for credentials and integration secrets
- optional Pub/Sub or Cloud Tasks for async orchestration if API-triggered evaluations grow

### Official Google Cloud references

- Vertex AI overview: https://docs.cloud.google.com/vertex-ai/docs
- Vertex AI Agent Builder overview: https://docs.cloud.google.com/agent-builder
- Agent Development Kit overview: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-development-kit/overview
- Cloud Run overview: https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run
- Vertex AI pricing: https://cloud.google.com/vertex-ai/pricing
- Generative AI pricing on Vertex AI: https://cloud.google.com/vertex-ai/generative-ai/pricing

### When to use Vertex AI and agents

Use GCP AI selectively, not as the foundation of the screening logic.

Good uses:

- executive summaries and parcel briefs
- mode-to-mode comparison narratives
- outreach draft generation
- guided analyst copilots
- portal assistants that explain evaluation outputs
- agentic follow-up workflows for utility, zoning, water, and fiber validation

Bad uses:

- replacing deterministic parcel filters
- making zoning or entitlement claims without hard evidence
- replacing the scoring engine with prompt-only logic

The hard scoring should remain rules-based and data-backed.
AI should summarize, compare, route, and assist.

## Revenue Logic

The business case is not "use AI because AI is available."

The business case is:

- charge for high-value evaluation workflows
- use AI to reduce analyst time and increase throughput
- turn internal origination tooling into a productized service

Potential monetization paths:

- paid parcel evaluations
- subscription access for brokers, developers, or investors
- enterprise API access
- retainer-based diligence services
- success-fee or origination-adjacent services
- premium utility / entitlement validation workflows

Practical rule:

- If AI reduces time but does not create a sellable workflow, keep it internal.
- If AI helps package a repeatable, premium workflow, expose it through the product.

## Build Order

### Phase 1

- Freeze the product boundary: GridScope engine plus separate portal.
- Harden the GridScope API around parcel evaluation, not only batch outputs.
- Keep Streamlit as the internal console.

### Phase 2

- Build a small authenticated portal that calls GridScope.
- Start with one market and three modes.
- Produce a report that a human analyst can still review before delivery.

### Phase 3

- Add AI summaries and guided next-step recommendations.
- Add workflow actions: save report, request diligence, assign analyst, export memo.

### Phase 4

- Add agentic validation for utility, zoning, water, and fiber workflows where clear ROI exists.
- Add pricing, subscriptions, and usage tracking after the workflow proves commercial demand.

## Practical Call

The present call is:

1. Keep GCP.
2. Keep GridScope as the engine.
3. Build an API boundary inside GridScope.
4. Put the commercial experience in a separate portal.
5. Use Vertex AI and agents only where they create leverage or paid product value.

## Light-to-Full Product Ladder

The approved commercial shape is a two-tier funnel:

- Light version: public-facing, lead-generating, and intentionally limited.
- Full version: authenticated, operationally useful, and worth paying for.

The light version should include:

- parcel or address intake
- coarse fit result
- top reasons
- limited parcel context
- call to action into the full workflow

The full version should include:

- per-mode scoring and comparison
- evidence and blockers
- workflow actions
- exports and reports
- analyst review path
- premium diligence and follow-up options

Do not replatform before proving revenue.

## Immediate Next Actions

1. Convert the product idea into an API contract and mode schema.
2. Decide the first paying workflow and target customer.
3. Choose the first three land-use modes.
4. Define what remains analyst-only versus customer-visible.
5. Decide whether the portal lives in a new repo or alongside LeCrown infrastructure.
