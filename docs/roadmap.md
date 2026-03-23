# LeCrown Properties Roadmap

## Current State

- `lecrownproperties.com` and `www.lecrownproperties.com` serve the public marketing site.
- The current repository is optimized for a static JSON-driven site deployed behind Nginx.

## Adjacent Strategic Lock: GridScope Land-Use Product

- Treat GridScope as a separate intelligence-product track from the LeCrown property-operations roadmap.
- Keep GridScope on GCP and evolve it into an engine plus API, not just an internal UI.
- A light public screening experience can live on the public side to generate and qualify leads.
- The full evaluation product should live in a separate authenticated portal that consumes GridScope APIs.
- The current GridScope Streamlit UI should remain an internal operating surface rather than the long-term commercial product.
- See `docs/gridscope-land-use-strategy-handoff.md` for the locked product and platform decision.
- See `docs/gridscope-land-use-roadmap.md` for the execution roadmap.

## Recommended Surface Area

Use separate subdomains for public, client, vendor, API, and internal workflows.

- `lecrownproperties.com` or `www.lecrownproperties.com`: public marketing site
- `portal.lecrownproperties.com`: authenticated owner and client portal
- `vendor.lecrownproperties.com`: vendor, contractor, and field worker app
- `api.lecrownproperties.com`: shared backend API when portal and vendor apps need one
- `admin.lecrownproperties.com`: internal staff tools if back-office operations outgrow the public site

## Why Subdomains

- Keeps the marketing site simple and static while the portal can evolve into a full application.
- Separates authentication, permissions, navigation, and deployment concerns by audience.
- Reduces role-mixing problems between owners, clients, vendors, and internal staff.
- Makes it easier to scale different surfaces independently over time.

Use a `/portal` path on the main domain only if the portal remains a very small protected document area. If it becomes a real product surface with dashboards, tickets, invoices, reports, messaging, or bilingual workflows, `portal.lecrownproperties.com` is the cleaner architecture.

## Product Roadmap

### Phase 1: Public Site Foundation

- Launch and stabilize the marketing site on the root domain.
- Keep content, SEO, and lead capture focused on public visitors.
- Preserve this repository as the public-site codebase unless there is a strong reason to merge app concerns into it.

### Phase 2: Dogfood the Internal Operating Layer

- Build the first authenticated product around LeCrown's own daily workflows before trying to sell software broadly.
- Start with the smallest internal surfaces that remove manual coordination work: owner updates, documents, issue tracking, vendor coordination, and activity history.
- Treat the first release as an internal operations platform for LeCrown staff and a small number of real properties rather than as a general SaaS product.
- Use that dogfooding period to validate the actual workflow model, permissions model, reporting needs, and bilingual communication patterns.

### Phase 3: External-Facing Portals on Proven Workflows

- Define core owner and client workflows for `portal.lecrownproperties.com` based on what works internally.
- Prioritize secure login, property status views, documents, invoices, reports, and messaging.
- Launch `vendor.lecrownproperties.com` for work orders, scheduling, check-ins, photos, completion updates, and payment visibility.
- Design role boundaries so vendor users do not share the same navigation or permissions model as clients.

### Phase 4: Shared Platform Services

- Add `api.lecrownproperties.com` when both apps need a common backend.
- Standardize authentication, file storage, notifications, audit logging, and bilingual support.
- Add `admin.lecrownproperties.com` only when internal operations need a dedicated interface.

### Phase 5: Multitenant SaaS Foundation

- After LeCrown has run real properties on the system, refactor the product for tenant-aware data isolation instead of assuming a single operating company.
- Introduce account-level boundaries for companies, users, properties, documents, work orders, notifications, and branding.
- Build multitenant primitives deliberately: tenant-scoped RBAC, audit logs, billing hooks, onboarding flows, and per-tenant configuration.
- Keep the first SaaS target narrow: boutique commercial property managers who need better owner reporting, vendor coordination, and communication rather than a full replacement for major PMS platforms.

### Phase 6: Operations and Scale

- Add monitoring, support tooling, and access reviews across all subdomains.
- Document DNS, TLS, deployment, and environment ownership for each surface.
- Expand reporting, automation, integrations, and support processes after the core portals and multitenant controls are stable.

## Go-To-Market Sequence

- First prove the product by using it inside LeCrown operations.
- Then expose the proven workflows to owners and vendors through dedicated portals.
- Only after the internal model is stable should the product be sold outward as multitenant software for third-party property managers.

This sequence reduces product risk because the first version is built against live operational pain instead of hypothetical SaaS requirements.

## Architecture Notes

- Prefer separate deployments for the marketing site, customer portal, and vendor app.
- Reuse a shared design system and API contract where it helps, but avoid coupling release cycles unnecessarily.
- Treat the public site as a low-risk static surface and the portal/vendor apps as authenticated application surfaces with stricter security and audit requirements.
- Do not force multitenancy too early. Start with a clean internal domain model, then add true tenant isolation once the workflows are proven and repeated.
- When the SaaS transition starts, enforce tenant boundaries at the data, auth, storage, and background-job layers rather than relying on UI separation alone.
