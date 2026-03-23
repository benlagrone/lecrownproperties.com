# GridScope Land-Use Product Roadmap

Date: March 17, 2026

## Goal

Build a two-tier land-use evaluation product on top of GridScope:

- a light public screen that attracts and qualifies demand
- a full authenticated product that delivers paid diligence value
- a reusable GridScope engine and API that powers both

## Locked Product Shape

- GridScope stays on GCP.
- GridScope becomes the engine, API layer, and internal analyst console.
- The current Streamlit UI remains internal.
- The public product gets a light screening flow.
- The paid product lives in a separate authenticated portal.
- Deterministic scoring remains the source of truth.
- Vertex AI and agent workflows are allowed only where they create measurable leverage.

## Non-Goals

- Do not market v1 as formal valuation.
- Do not move the platform off GCP before revenue or hard platform blockers.
- Do not make the Streamlit UI the commercial product.
- Do not build a broad multitenant SaaS before the first paid workflow is proven.
- Do not let prompt-only logic replace deterministic parcel and infrastructure screening.

## Commercial Model

Recommended ladder:

- `Light`: free or low-friction parcel screen
- `Pro`: paid self-serve full evaluation
- `Advisory`: analyst-backed diligence and follow-up

The light version should prove interest.
The full version should save serious time.
The advisory layer should convert high-intent customers who want deeper work.

## Phase 0: Scope Lock

Objective:

- freeze the first commercial workflow and the first three land-use modes

Work:

- pick first market
- pick first customer type
- pick first three modes
- define mode scorecard schema
- define light versus full product boundary
- define what remains analyst-only

Recommended first market:

- Houston

Recommended first customer:

- developers, brokers, and acquisitive investors looking at power-sensitive or industrial land

Recommended first modes:

1. Data center
2. Industrial / logistics
3. Outside storage / flex industrial

Exit criteria:

- written mode definitions approved
- first customer workflow named
- light/full boundary documented

## Phase 1: Engine and API Foundation

Objective:

- make GridScope usable as a stable service, not only a UI and pipeline

Work:

- add parcel resolution endpoint
- add evaluation endpoint
- add compare-modes endpoint
- add report payload output
- standardize evaluation job IDs and persistence
- define response schema for light and full payloads
- move toward Cloud SQL-backed app state where needed

Target API surface:

- `POST /v1/parcel/resolve`
- `POST /v1/evaluate`
- `POST /v1/evaluate/compare-modes`
- `GET /v1/evaluations/{id}`
- `GET /v1/reports/{id}`
- `GET /v1/modes`
- `GET /v1/markets`

Exit criteria:

- same parcel can be evaluated through API without using Streamlit
- response schema is stable enough for portal work
- evaluation outputs contain fit score, blockers, confidence, and evidence

## Phase 2: Light Product

Objective:

- launch a public-facing screen that creates qualified leads without giving away the full product

Work:

- build public intake flow
- support address and parcel input
- return coarse fit results
- show limited reasons and parcel context
- gate deeper detail behind contact capture
- add CRM or inbox handoff for follow-up

Light version should show:

- parcel identification
- top mode or top two modes
- coarse fit band like `High`, `Medium`, `Low`
- 2-4 reasons
- simple map or parcel context
- CTA into full evaluation

Light version should hide:

- detailed evidence
- raw exports
- workflow actions
- utility contacts
- analyst notes
- premium follow-up paths

Exit criteria:

- live public screen exists
- lead capture and routing works
- team can see which screens convert into deeper requests

## Phase 3: Full Portal MVP

Objective:

- deliver the first paid, operationally useful product surface

Work:

- build authenticated portal
- show per-mode scoring and comparison
- show blockers and evidence
- support saved evaluations
- support exports and branded reports
- support analyst review state
- support manual upgrade path into advisory work

Portal should include:

- full parcel facts
- per-mode scorecards
- confidence and evidence
- nearby-use context
- owner and seller signals
- next diligence actions
- report download

Exit criteria:

- first real users can complete end-to-end evaluation workflow
- team can deliver paid reports from the portal
- at least one workflow is clearly better than manual process

## Phase 4: AI Packaging and Agent Workflows

Objective:

- use AI where it improves throughput, conversion, or deliverable quality

Good uses:

- executive summaries
- mode comparison narratives
- parcel briefs
- customer-facing explanations
- analyst copilots
- utility, zoning, water, and fiber follow-up workflows

Guardrails:

- keep deterministic scoring authoritative
- do not let AI make unsupported regulatory or entitlement claims
- require evidence-backed outputs for customer-facing conclusions

Recommended GCP services:

- Vertex AI for summaries and assistant behaviors
- Agent Builder or ADK only when a workflow is clear and repeatable

Exit criteria:

- measurable analyst time savings or conversion lift
- no core screening dependency on prompt-only logic

## Phase 5: Monetization and Scale

Objective:

- turn the workflow into a repeatable business, not just a useful internal tool

Work:

- define pricing and packaging
- add usage tracking
- add billing hooks
- add team accounts
- expand market coverage
- expand supported land-use modes
- add enterprise API access only after product demand is clear

Possible revenue paths:

- per-report pricing
- monthly subscription
- team subscription
- enterprise API
- analyst-backed advisory or diligence packages

Exit criteria:

- repeat paid usage exists
- pricing is tied to a real workflow, not just access
- at least one revenue path is demonstrably viable

## GCP Platform Plan

Use now:

- Cloud Run for API and internal UI
- Cloud Run Jobs for long-running evaluation runs
- Cloud Storage for source and output datasets
- Artifact Registry and Cloud Build for deployment
- IAM and Workspace gating for internal access

Add as needed:

- Cloud SQL Postgres for portal state and job metadata
- Secret Manager for credentials and integration secrets
- Cloud Tasks or Pub/Sub if evaluation orchestration becomes more asynchronous
- Vertex AI only where clear ROI exists

Do not replatform off GCP unless:

- GCP blocks a paying workflow
- cost structure breaks the business
- the team needs capabilities GCP cannot provide cleanly

## Success Metrics

Track early:

- number of light screens completed
- percent of light users who request deeper evaluation
- percent of deep evaluations that become paid work
- analyst time saved per report
- turnaround time from parcel intake to report

Track later:

- subscription retention
- expansion revenue
- API usage by paying customers
- gross margin by workflow

## Immediate Next Actions

1. Approve first market, customer, and first three modes.
2. Define light payload and full payload schemas.
3. Define the first report format.
4. Decide where the portal codebase will live.
5. Start API contract work inside GridScope.
