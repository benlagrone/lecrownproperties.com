import { renderHeader } from "./components/header.js"
import { renderFooter } from "./components/footer.js"
import { renderHero } from "./components/hero.js"
import {
  renderCaseStudyCard,
  renderChannelCard,
  renderClientCard,
  renderFaqItem,
  renderInsightCard,
  renderMetricCard,
  renderPropertyCard,
  renderServiceCard,
  renderStepCard,
  renderValueCard,
} from "./components/card.js"

const DEFAULT_LANG = "en"
const GA_TRACKING_ID = "G-M5058P5ZVQ"
const PROPERTY_EVALUATION_ROUTE = "/property-evaluation"
const PROPERTY_EVALUATION_LEGACY_ROUTE = "/property-evaluation-preview"
const PROPERTY_EVALUATION_REQUEST_PATH = "/api/property-evaluation-requests"

const DATASETS = [
  "site",
  "home",
  "about",
  "contact",
  "services",
  "properties",
  "property-evaluation",
  "clients",
  "case-studies",
  "insights",
]

const ROUTES = new Set([
  "/",
  "/services",
  "/properties",
  PROPERTY_EVALUATION_ROUTE,
  "/clients",
  "/case-studies",
  "/insights",
  "/about",
  "/contact",
])

const ROUTE_ALIASES = new Map([
  [PROPERTY_EVALUATION_LEGACY_ROUTE, PROPERTY_EVALUATION_ROUTE],
])

const PROPERTY_EVALUATION_PREVIEW = {
  hero: {
    eyebrow: "GridScope Screen",
    title: "Screen a parcel, then upgrade into paid diligence",
    summary:
      "Run a fast land-use suitability screen on a parcel. If the site looks viable, request a paid evaluation and move it into LeCrown's analyst workflow.",
    primaryCta: {
      to: `${PROPERTY_EVALUATION_ROUTE}#preview-intake`,
      label: "Run the screen",
    },
    secondaryCta: {
      to: "/properties",
      label: "Back to properties",
    },
    visual: {
      src: "/assets/warehouse.jpg",
      alt: "Industrial corridor with utility infrastructure",
      kicker: "Public screen -> paid report",
      title: "Site suitability without exposing GridScope",
      text: "The public screen returns a coarse fit band. Paid work adds scorecards, blockers, evidence, and operator-ready next steps.",
    },
    brief: {
      eyebrow: "Commercial flow",
      title: "Use the public screen to qualify demand",
      text:
        "The browser only talks to LeCrown. Strong parcels can be upgraded into a paid evaluation request with the parcel, top mode, and fit summary already attached.",
      points: [
        "Public screen identifies parcel and top mode",
        "Paid request routes into LeCrown's review queue",
        "Same-origin proxy keeps GridScope credentials server-side",
      ],
    },
    metrics: [
      { value: "Free", label: "Public screen" },
      { value: "Paid", label: "Upgrade path" },
      { value: "Houston", label: "Initial market focus" },
    ],
  },
  intakeHeading: {
    eyebrow: "Run the screen",
    title: "Start with parcel, market, and mode",
    text:
      "Use the public screen to qualify whether a parcel deserves deeper work. The page falls back to realistic demo data when the live runtime is unavailable.",
  },
  runtimeHeading: {
    eyebrow: "Screen status",
    title: "Live runtime when available, demo fallback when not",
    text:
      "The same customer-facing surface can run in production safely. The backend advertises runtime availability and the page adapts automatically.",
  },
  resultHeading: {
    eyebrow: "Public result",
    title: "Show enough to qualify, not enough to give away the whole product",
    text:
      "Visitors get parcel context, a top-mode recommendation, and coarse fit reasons. Paid evaluation requests unlock the deeper scorecard for this session and route the parcel into follow-up.",
  },
  upgradeHeading: {
    eyebrow: "Paid packages",
    title: "Turn a promising parcel into paid work",
    text:
      "The public screen is the top of funnel. The money is in paid evaluation reports and analyst-backed diligence.",
  },
  lockedHeading: {
    eyebrow: "Premium detail",
    title: "Detailed scorecards stay behind contact capture",
    text:
      "Use the free screen to qualify the parcel. Use the paid request to unlock per-mode numeric scoring, blockers, and diligence actions.",
  },
  requestSummaryHeading: "Selected parcel",
  demoStatus:
    "Sample parcel response loaded. Live results will take over automatically when the backend is configured.",
  demoFallbackStatus:
    "Live evaluation is not configured here, so the screen is showing sample parcel data.",
  liveReadyStatus:
    "GridScope is configured. Running the screen will call the live evaluation endpoint.",
  liveLoadingStatus: "Running parcel screen through the LeCrown backend...",
  liveSuccessStatus:
    "Live parcel screen loaded through the LeCrown backend.",
  liveErrorStatus:
    "The live request failed, so the page fell back to sample parcel data.",
  checkingStatus: "Checking backend availability at /health...",
  publicFacts: [
    "Parcel identification and market context",
    "Top mode and coarse fit band",
    "2-4 reasons that explain why the parcel surfaced",
    "CTA into a paid evaluation request",
  ],
  premiumFacts: [
    "Per-mode numeric scoring and blockers",
    "Evidence-backed next diligence actions",
    "Evaluation and report identifiers",
    "Analyst review and advisory upgrade path",
  ],
  packages: [
    {
      slug: "light_screen",
      name: "Initial screen",
      price: "Included",
      delivery: "Instant parcel qualification",
      points: [
        "Public parcel screen with top mode and fit band",
        "Useful for triage, not for diligence or underwriting",
      ],
    },
    {
      slug: "pro_evaluation",
      name: "Formal evaluation",
      price: "Paid report",
      delivery: "Scorecard, blockers, and next actions",
      recommended: true,
      points: [
        "Per-mode scorecard and parcel brief",
        "Clear blockers, confidence, and next diligence actions",
      ],
    },
    {
      slug: "advisory_sprint",
      name: "Operator advisory",
      price: "Analyst engagement",
      delivery: "Deeper diligence and follow-up",
      points: [
        "Human review on top of the GridScope screen",
        "Power, entitlement, and diligence follow-up planning",
      ],
    },
  ],
  requestForm: {
    heading: {
      eyebrow: "Request paid evaluation",
      title: "Request a formal evaluation on this parcel",
      text:
        "LeCrown receives the parcel, top mode, fit summary, and package choice so the next step can be scoped around the site rather than a generic inquiry.",
    },
    fields: {
      name: "Name",
      company: "Company",
      email: "Work email",
      phone: "Phone",
      role: "Role",
      timeline: "Timeline",
      package: "Paid package",
      notes: "What would make this parcel worth paying to evaluate?",
    },
    roleOptions: [
      "Developer",
      "Broker",
      "Investor",
      "Site selector",
      "Other",
    ],
    timelineOptions: ["Immediate", "30 days", "60 days", "Exploring"],
    submitLabel: "Request paid evaluation",
    helper:
      "This request captures the parcel, package, and project note so LeCrown can scope the next step around the site.",
  },
  requestSuccess: {
    title: "Parcel submitted for formal follow-up",
    text:
      "LeCrown now has the parcel context, contact details, and package intent. The next step is to scope the evaluation around this specific site.",
    resetLabel: "Request another parcel",
  },
  marketOptions: ["tx-statewide", "houston-metro", "dfw-metro"],
  modeOptions: ["data_center", "industrial_flex", "battery_storage"],
  demoRequest: {
    parcel: {
      locator: {
        parcel_id: "PCL-41A-TX-DC",
      },
      market: "tx-statewide",
    },
    modes: ["data_center"],
    include_report: true,
    include_ai_summary: false,
  },
}

const propertyEvaluationPreviewState = {
  liveConfigured: null,
  statusMessage: PROPERTY_EVALUATION_PREVIEW.checkingStatus,
  statusTone: "checking",
  sourceLabel: "Sample parcel response",
  request: null,
  response: null,
  inquiryError: "",
  inquiryResult: null,
  detailUnlocked: false,
}

const cache = new Map()
const state = {
  lang: getLangFromUrl(),
  data: null,
  navOpen: false,
}

const app = document.querySelector("#app")
let lastTrackedPage = ""

document.addEventListener("click", handleClick)
document.addEventListener("submit", handleSubmit)
window.addEventListener("popstate", () => {
  state.navOpen = false
  render()
})

render()

async function render() {
  const path = normalizePath(window.location.pathname)
  const lang = getLangFromUrl()
  state.lang = lang
  state.data = await loadContent(lang)

  const pageContent = renderPage(path)

  app.innerHTML = `
    <div class="site-shell">
      ${renderHeader(state.data.site, {
        currentPath: path,
        currentLang: lang,
        navOpen: state.navOpen,
        hrefFor,
      })}
      <main class="page-shell">
        ${pageContent}
      </main>
      ${renderFooter(state.data.site, { currentLang: lang, hrefFor })}
    </div>
  `

  document.title = buildTitle(path)
  trackPageView()
  activateReveal()
  syncHashTarget()
  initializePropertyEvaluationPreview(path)
}

function renderPage(path) {
  switch (path) {
    case "/":
      return renderHomePage()
    case "/services":
      return renderServicesPage()
    case "/properties":
      return renderPropertiesPage()
    case PROPERTY_EVALUATION_ROUTE:
      return renderPropertyEvaluationPreviewPage()
    case "/clients":
      return renderClientsPage()
    case "/case-studies":
      return renderCaseStudiesPage()
    case "/insights":
      return renderInsightsPage()
    case "/about":
      return renderAboutPage()
    case "/contact":
      return renderContactPage()
    default:
      return renderHomePage()
  }
}

function renderHomePage() {
  const { site, home, services, properties } = state.data

  return `
    ${renderHero(home.hero, { hrefFor })}

    <section class="section-block" data-reveal>
      ${renderSectionHeading(home.propertyTypesSection)}
      <div class="card-grid cols-3">
        ${home.propertyTypes.map(renderPropertyCard).join("")}
      </div>
    </section>

    <section class="section-block" data-reveal>
      ${renderSectionHeading(home.servicesSection)}
      <div class="card-grid cols-3">
        ${services.map(renderServiceCard).join("")}
      </div>
    </section>

    <section class="section-block split-grid" data-reveal>
      <div class="stack-panel panel-rich">
        ${renderSectionHeading(home.whySection, "left")}
        <div class="card-grid cols-1">
          ${home.reasons.map(renderValueCard).join("")}
        </div>
      </div>
      <div class="stack-panel">
        <div class="section-heading left">
          <span class="eyebrow">${home.workflowSection.eyebrow}</span>
          <h2>${home.workflowSection.title}</h2>
          <p>${home.workflowSection.text}</p>
        </div>
        <div class="steps-grid">
          ${home.workflow.map(renderStepCard).join("")}
        </div>
      </div>
    </section>

    ${renderBanner(home.ctaBanner, site.contact.email)}
    ${renderPhotoCredits(home)}
  `
}

function renderServicesPage() {
  const { site, services, about } = state.data
  const page = site.pages.services

  return `
    ${renderHero(page.hero, { hrefFor })}

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.scopeHeading)}
      <div class="card-grid cols-3">
        ${services.map(renderServiceCard).join("")}
      </div>
    </section>

    <section class="section-block split-grid" data-reveal>
      <div class="panel panel-rich">
        ${renderSectionHeading(page.deliveryHeading, "left")}
        <div class="mini-grid">
          ${about.advantages.map(renderValueCard).join("")}
        </div>
      </div>
      <div class="panel panel-brief">
        <span class="eyebrow">${page.brief.eyebrow}</span>
        <h2>${page.brief.title}</h2>
        <p>${page.brief.text}</p>
        <ul class="detail-list">
          ${page.brief.points.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    </section>

    ${renderBanner(page.ctaBanner, site.contact.email)}
  `
}

function renderPropertiesPage() {
  const { site, properties, services } = state.data
  const page = site.pages.properties

  return `
    ${renderHero(page.hero, { hrefFor })}

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.gridHeading)}
      <div class="card-grid cols-2">
        ${properties.map(renderPropertyCard).join("")}
      </div>
    </section>

    <section class="section-block split-grid" data-reveal>
      <div class="panel panel-rich">
        ${renderSectionHeading(page.handoffHeading, "left")}
        <div class="pill-cloud">
          ${services
            .flatMap((service) => service.bullets.slice(0, 2))
            .map((item) => `<span class="pill">${item}</span>`)
            .join("")}
        </div>
      </div>
      <div class="panel panel-brief">
        <span class="eyebrow">${page.note.eyebrow}</span>
        <h2>${page.note.title}</h2>
        <p>${page.note.text}</p>
      </div>
    </section>

    ${renderBanner(page.ctaBanner, site.contact.email)}
  `
}

function renderClientsPage() {
  const { site, clients, about } = state.data
  const page = site.pages.clients

  return `
    ${renderHero(page.hero, { hrefFor })}

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.gridHeading)}
      <div class="card-grid cols-2">
        ${clients.map(renderClientCard).join("")}
      </div>
    </section>

    <section class="section-block split-grid" data-reveal>
      <div class="panel panel-rich">
        ${renderSectionHeading(page.principlesHeading, "left")}
        <div class="mini-grid">
          ${about.values.map(renderValueCard).join("")}
        </div>
      </div>
      <div class="panel panel-brief">
        <span class="eyebrow">${page.relationshipNote.eyebrow}</span>
        <h2>${page.relationshipNote.title}</h2>
        <p>${page.relationshipNote.text}</p>
        <ul class="detail-list">
          ${page.relationshipNote.points
            .map((item) => `<li>${item}</li>`)
            .join("")}
        </ul>
      </div>
    </section>

    ${renderBanner(page.ctaBanner, site.contact.email)}
  `
}

function renderPropertyEvaluationPreviewPage() {
  ensurePropertyEvaluationPreviewState()
  const page = state.data.propertyEvaluation
  const { request, response } = propertyEvaluationPreviewState

  return `
    ${renderHero(page.hero, { hrefFor })}

    <section class="section-block split-grid evaluation-preview-shell" data-reveal>
      <div class="stack-panel">
        ${renderSectionHeading(page.screenHeading, "left")}
        <div class="panel panel-rich evaluation-preview-stage">
          <div class="evaluation-preview-header">
            <div class="evaluation-preview-heading">
              <span class="eyebrow">${page.stageHeader.eyebrow}</span>
              <h2>${page.stageHeader.title}</h2>
              <p>${page.stageHeader.text}</p>
            </div>
            <div class="evaluation-runtime-head">
              <span class="badge evaluation-badge" data-preview-health-badge>Checking backend</span>
              <span class="card-highlight" data-preview-source-badge>${escapeHtml(propertyEvaluationPreviewState.sourceLabel)}</span>
            </div>
          </div>

          <div class="split-grid evaluation-preview-main">
            <div class="evaluation-panel">
              ${renderPropertyEvaluationPreviewForm(request)}
              <div class="evaluation-request-summary" data-preview-request-summary>
                ${renderPropertyEvaluationRequestSummary(request)}
              </div>
            </div>

            <div class="panel panel-brief evaluation-panel evaluation-lead-card" data-preview-lead-panel>
              ${renderPropertyEvaluationLeadPanel(response)}
            </div>
          </div>
        </div>
      </div>
      <div class="stack-panel">
        ${renderSectionHeading(page.overviewHeading, "left")}
        <div class="card-grid cols-1">
          ${page.overview.map(renderValueCard).join("")}
        </div>
      </div>
    </section>

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.signalHeading)}
      <div class="metrics-grid evaluation-highlight-grid" data-preview-highlights>
        ${renderPropertyEvaluationHighlights(response)}
      </div>
    </section>

    <section class="section-block split-grid evaluation-preview-details" data-reveal>
      <div class="panel panel-rich evaluation-panel">
        <div class="card-grid cols-2 evaluation-reason-grid" data-preview-public-reasons>
          ${renderPropertyEvaluationPublicReasons(response)}
        </div>
      </div>

      <div class="panel panel-brief evaluation-panel" data-preview-premium-surface>
        ${renderPropertyEvaluationPremiumSurface(response)}
      </div>
    </section>

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.workflowHeading)}
      <div class="steps-grid">
        ${page.workflow.map(renderStepCard).join("")}
      </div>
    </section>

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.audienceHeading)}
      <div class="card-grid cols-2">
        ${page.audiences.map(renderValueCard).join("")}
      </div>
    </section>

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.faqHeading)}
      <div class="faq-list">
        ${page.faq.map(renderFaqItem).join("")}
      </div>
    </section>

    ${renderBanner(page.ctaBanner, state.data.site.contact.email)}
  `
}

function renderPropertyEvaluationLeadPanel(response) {
  const evaluation = getLeadModeEvaluation(response)

  return `
    <div class="card-topline">
      <span class="badge">${escapeHtml(evaluation ? formatPreviewOptionLabel(evaluation.mode) : "Awaiting screen")}</span>
      <span class="card-highlight">${escapeHtml(evaluation ? formatFitBand(evaluation.score) : "No fit yet")}</span>
    </div>
    <h2>${escapeHtml(evaluation?.verdict || "Run a parcel screen")}</h2>
    <p class="evaluation-summary-copy">
      ${escapeHtml(
        evaluation?.summary || "Choose a parcel and run the screen to load a fit signal.",
      )}
    </p>
    ${
      propertyEvaluationPreviewState.detailUnlocked
        ? '<span class="badge">Detailed scorecard unlocked for this session</span>'
        : ""
    }
    <p class="evaluation-note" data-preview-status>
      ${escapeHtml(propertyEvaluationPreviewState.statusMessage)}
    </p>
    <div class="pill-cloud evaluation-pill-cloud" data-preview-meta>
      ${renderPropertyEvaluationMeta(response)}
    </div>
  `
}

function renderCaseStudiesPage() {
  const { site, caseStudies } = state.data
  const page = site.pages.caseStudies

  return `
    ${renderHero(page.hero, { hrefFor })}

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.gridHeading)}
      <div class="card-grid cols-3">
        ${caseStudies.map(renderCaseStudyCard).join("")}
      </div>
    </section>

    ${renderBanner(page.ctaBanner, state.data.site.contact.email)}
  `
}

function renderInsightsPage() {
  const { site, insights } = state.data
  const page = site.pages.insights

  return `
    ${renderHero(page.hero, { hrefFor })}

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.gridHeading)}
      <div class="card-grid cols-2">
        ${insights.map(renderInsightCard).join("")}
      </div>
    </section>

    ${renderBanner(page.ctaBanner, site.contact.email)}
  `
}

function renderAboutPage() {
  const { site, about } = state.data

  return `
    ${renderHero(about.hero, { hrefFor })}

    <section class="section-block split-grid" data-reveal>
      <div class="panel panel-story">
        ${renderSectionHeading(about.storyHeading, "left")}
        <div class="story-copy">
          ${about.story.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
      </div>
      <div class="panel panel-brief">
        <span class="eyebrow">${about.marketHeading.eyebrow}</span>
        <h2>${about.marketHeading.title}</h2>
        <div class="pill-cloud">
          ${about.markets.map((item) => `<span class="pill">${item}</span>`).join("")}
        </div>
      </div>
    </section>

    <section class="section-block" data-reveal>
      ${renderSectionHeading(about.valuesHeading)}
      <div class="card-grid cols-2">
        ${about.values.map(renderValueCard).join("")}
      </div>
    </section>

    <section class="section-block" data-reveal>
      ${renderSectionHeading(about.advantagesHeading)}
      <div class="card-grid cols-3">
        ${about.advantages.map(renderValueCard).join("")}
      </div>
    </section>

    ${renderBanner(about.ctaBanner, site.contact.email)}
  `
}

function renderContactPage() {
  const { site, contact } = state.data

  return `
    ${renderHero(contact.hero, { hrefFor })}

    <section class="section-block split-grid" data-reveal>
      <div class="stack-panel">
        ${renderSectionHeading(contact.channelsHeading, "left")}
        <div class="card-grid cols-1">
          ${contact.channels.map(renderChannelCard).join("")}
        </div>
      </div>
      <div class="stack-panel" id="intake">
        <div class="section-heading left">
          <span class="eyebrow">${contact.form.heading.eyebrow}</span>
          <h2>${contact.form.heading.title}</h2>
          <p>${contact.form.heading.text}</p>
        </div>
        ${renderForm(contact.form)}
      </div>
    </section>

    <section class="section-block split-grid" data-reveal>
      <div class="panel panel-brief">
        <span class="eyebrow">${contact.hoursHeading.eyebrow}</span>
        <h2>${contact.hoursHeading.title}</h2>
        <ul class="detail-list detail-list-hours">
          ${site.contact.hours
            .map((item) => `<li><span>${item.label}</span><strong>${item.value}</strong></li>`)
            .join("")}
        </ul>
      </div>
      <div class="panel panel-rich">
        ${renderSectionHeading(contact.faqHeading, "left")}
        <div class="faq-list">
          ${contact.faq.map(renderFaqItem).join("")}
        </div>
      </div>
    </section>
  `
}

function renderSectionHeading(section, alignment = "center") {
  return `
    <div class="section-heading ${alignment}">
      <span class="eyebrow">${section.eyebrow}</span>
      <h2>${section.title}</h2>
      <p>${section.text}</p>
    </div>
  `
}

function renderBanner(banner, email) {
  return `
    <section class="section-block" data-reveal>
      <div class="cta-banner">
        <div>
          <span class="eyebrow">${banner.eyebrow}</span>
          <h2>${banner.title}</h2>
          <p>${banner.text}</p>
        </div>
        <div class="cta-banner-actions">
          <a class="button button-primary" href="${hrefFor("/contact", state.lang)}" data-link>
            ${banner.primaryLabel}
          </a>
          <a class="button button-secondary" href="mailto:${email}">
            ${banner.secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  `
}

function renderPhotoCredits(home) {
  if (!home.photoCredits?.length) {
    return ""
  }

  return `
    <section class="photo-credits" data-reveal>
      <p class="photo-credits-title">${home.photoCreditsLabel}</p>
      <p class="photo-credits-note">${home.photoCreditsNote}</p>
      <div class="photo-credits-list">
        ${home.photoCredits
          .map(
            (credit) => `
              <p>
                <span>${credit.label}</span>
                <a href="${credit.sourceHref}" target="_blank" rel="noreferrer">
                  ${credit.sourceLabel}
                </a>
                <a href="${credit.licenseHref}" target="_blank" rel="noreferrer">
                  ${credit.licenseLabel}
                </a>
              </p>
            `,
          )
          .join("")}
      </div>
    </section>
  `
}

function renderForm(form) {
  return `
    <form class="intake-form" data-intake-form>
      <div class="form-grid">
        <label>
          <span>${form.fields.name}</span>
          <input name="name" type="text" required />
        </label>
        <label>
          <span>${form.fields.company}</span>
          <input name="company" type="text" />
        </label>
        <label>
          <span>${form.fields.email}</span>
          <input name="email" type="email" required />
        </label>
        <label>
          <span>${form.fields.phone}</span>
          <input name="phone" type="tel" />
        </label>
        <label class="span-2">
          <span>${form.fields.service}</span>
          <select name="service">
            ${form.serviceOptions
              .map((option) => `<option value="${option}">${option}</option>`)
              .join("")}
          </select>
        </label>
        <label class="span-2">
          <span>${form.fields.notes}</span>
          <textarea name="notes" rows="6" required></textarea>
        </label>
      </div>
      <div class="form-actions">
        <button class="button button-primary" type="submit">
          ${form.submitLabel}
        </button>
        <p>${form.helper}</p>
      </div>
    </form>
  `
}

function renderPropertyEvaluationPreviewForm(request) {
  const parcelId =
    request?.parcel?.locator?.parcel_id ||
    PROPERTY_EVALUATION_PREVIEW.demoRequest.parcel.locator.parcel_id
  const market =
    request?.parcel?.market ||
    PROPERTY_EVALUATION_PREVIEW.demoRequest.parcel.market
  const mode =
    request?.modes?.[0] ||
    PROPERTY_EVALUATION_PREVIEW.demoRequest.modes[0]

  return `
    <form class="intake-form evaluation-form" data-property-evaluation-form id="preview-intake">
      <div class="form-grid">
        <label>
          <span>Parcel ID</span>
          <input name="parcel_id" type="text" value="${escapeHtml(parcelId)}" required />
        </label>
        <label>
          <span>Market</span>
          <select name="market">
            ${PROPERTY_EVALUATION_PREVIEW.marketOptions
              .map(
                (option) =>
                  `<option value="${escapeHtml(option)}"${option === market ? " selected" : ""}>${escapeHtml(formatPreviewOptionLabel(option))}</option>`,
              )
              .join("")}
          </select>
        </label>
        <label>
          <span>Mode</span>
          <select name="mode">
            ${PROPERTY_EVALUATION_PREVIEW.modeOptions
              .map(
                (option) =>
                  `<option value="${escapeHtml(option)}"${option === mode ? " selected" : ""}>${escapeHtml(formatPreviewOptionLabel(option))}</option>`,
              )
              .join("")}
          </select>
        </label>
      </div>
      <div class="form-actions">
        <button class="button button-primary" type="submit">Run site screen</button>
        <button class="button button-secondary" type="button" data-preview-demo>
          Load sample parcel
        </button>
        <p>Live results load automatically when GridScope is configured. Otherwise the page stays on sample parcel data.</p>
      </div>
    </form>
  `
}

function renderPropertyEvaluationRequestSummary(request) {
  const parcelId =
    request?.parcel?.locator?.parcel_id ||
    PROPERTY_EVALUATION_PREVIEW.demoRequest.parcel.locator.parcel_id
  const market =
    request?.parcel?.market ||
    PROPERTY_EVALUATION_PREVIEW.demoRequest.parcel.market
  const mode =
    request?.modes?.[0] ||
    PROPERTY_EVALUATION_PREVIEW.demoRequest.modes[0]

  return `
    <div class="card-topline">
      <strong>${PROPERTY_EVALUATION_PREVIEW.requestSummaryHeading}</strong>
      <span class="card-highlight">Free screen</span>
    </div>
    <div class="pill-cloud evaluation-pill-cloud">
      <span class="pill">${escapeHtml(parcelId)}</span>
      <span class="pill">${escapeHtml(formatPreviewOptionLabel(market))}</span>
      <span class="pill">${escapeHtml(formatPreviewOptionLabel(mode))}</span>
    </div>
    <p class="evaluation-summary-copy">
      The free screen gives a parcel fit readout. Paid work adds the scorecard,
      blockers, and analyst follow-up around the same site.
    </p>
  `
}

function renderPropertyEvaluationPublicReasons(response) {
  const evaluation = getLeadModeEvaluation(response)
  if (!evaluation) {
    return `
      <article class="card evaluation-reason-card">
        <div class="card-topline">
          <span class="badge">Waiting on screen</span>
        </div>
        <p>Run the parcel screen to see the first public reasons.</p>
      </article>
    `
  }

  const reasons = []

  if (evaluation.summary) {
    reasons.push({
      label: "Readout",
      text: evaluation.summary,
    })
  }

  if (Array.isArray(evaluation.strengths) && evaluation.strengths[0]) {
    reasons.push({
      label: "Signal",
      text: evaluation.strengths[0],
    })
  }

  if (Array.isArray(evaluation.constraints) && evaluation.constraints[0]) {
    reasons.push({
      label: "Risk",
      text: evaluation.constraints[0],
    })
  }

  if (Array.isArray(evaluation.next_steps) && evaluation.next_steps[0]) {
    reasons.push({
      label: "Next step",
      text: evaluation.next_steps[0],
    })
  }

  return reasons.slice(0, 4).map(renderPropertyEvaluationReasonCard).join("")
}

function renderPropertyEvaluationReasonCard(reason) {
  return `
    <article class="card evaluation-reason-card">
      <div class="card-topline">
        <span class="badge">${escapeHtml(reason.label)}</span>
      </div>
      <p>${escapeHtml(reason.text)}</p>
    </article>
  `
}

function renderPropertyEvaluationPremiumSurface(response) {
  const parcel = response?.normalized_parcel || {}
  const sharedFacts = response?.shared_facts || {}
  const evaluation = getLeadModeEvaluation(response)
  const facts = [
    ["Power", sharedFacts.power_readiness],
    ["Highway", sharedFacts.highway_access],
    ["Fiber", sharedFacts.fiber_access],
    ["Floodplain", sharedFacts.floodplain],
    ["Entitlement", sharedFacts.entitlement_path],
  ].filter(([, value]) => value)

  const detailBlock = propertyEvaluationPreviewState.detailUnlocked
    ? `
        <article class="card evaluation-facts-card">
          <div class="card-topline">
            <span class="badge">Unlocked scorecard</span>
            ${
              parcel.frontage_ft == null
                ? ""
                : `<span class="card-highlight">${escapeHtml(`${parcel.frontage_ft} ft frontage`)}</span>`
            }
          </div>
          <ul class="detail-list evaluation-detail-list evaluation-fact-list">
            ${facts
              .map(
                ([label, value]) =>
                  `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`,
              )
              .join("")}
          </ul>
        </article>
        <div class="card-grid cols-1 evaluation-mode-grid">
          ${renderPropertyEvaluationModeCards(response)}
        </div>
      `
    : `
        <article class="card evaluation-lock-card">
          <div class="card-topline">
            <span class="badge">${PROPERTY_EVALUATION_PREVIEW.lockedHeading.eyebrow}</span>
            <span class="card-highlight">
              ${escapeHtml(evaluation ? formatFitBand(evaluation.score) : "Contact gate")}
            </span>
          </div>
          <h3>${PROPERTY_EVALUATION_PREVIEW.lockedHeading.title}</h3>
          <p>${PROPERTY_EVALUATION_PREVIEW.lockedHeading.text}</p>
          <ul class="detail-list evaluation-detail-list">
            ${PROPERTY_EVALUATION_PREVIEW.premiumFacts
              .map((fact) => `<li>${escapeHtml(fact)}</li>`)
              .join("")}
          </ul>
        </article>
      `

  return `
    <div class="evaluation-unlocked-surface">
      <div class="section-heading left evaluation-upgrade-heading">
        <span class="eyebrow">${PROPERTY_EVALUATION_PREVIEW.upgradeHeading.eyebrow}</span>
        <h2>${PROPERTY_EVALUATION_PREVIEW.upgradeHeading.title}</h2>
        <p>${PROPERTY_EVALUATION_PREVIEW.upgradeHeading.text}</p>
      </div>
      ${detailBlock}
      <div class="card-grid cols-1 evaluation-package-grid">
        ${renderPropertyEvaluationPackageCards()}
      </div>
      ${renderPropertyEvaluationRequestPanel()}
    </div>
  `
}

function renderPropertyEvaluationPackageCards() {
  return PROPERTY_EVALUATION_PREVIEW.packages
    .map(
      (item) => `
        <article class="card evaluation-package-card${item.recommended ? " is-recommended" : ""}">
          <div class="card-topline">
            <span class="badge">${escapeHtml(item.price)}</span>
            ${item.recommended ? '<span class="card-highlight">Recommended</span>' : ""}
          </div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.delivery)}</p>
          <ul class="detail-list evaluation-detail-list">
            ${item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("")
}

function renderPropertyEvaluationRequestPanel() {
  if (propertyEvaluationPreviewState.inquiryResult) {
    return renderPropertyEvaluationRequestSuccess()
  }

  return renderPropertyEvaluationRequestForm()
}

function renderPropertyEvaluationRequestForm() {
  const form = PROPERTY_EVALUATION_PREVIEW.requestForm
  const paidPackages = PROPERTY_EVALUATION_PREVIEW.packages.filter(
    (item) => item.slug !== "light_screen",
  )

  return `
    ${renderSectionHeading(form.heading, "left")}
    <form class="intake-form evaluation-request-form" data-property-evaluation-request-form>
      <div class="form-grid">
        <label>
          <span>${form.fields.name}</span>
          <input name="name" type="text" required />
        </label>
        <label>
          <span>${form.fields.company}</span>
          <input name="company" type="text" />
        </label>
        <label>
          <span>${form.fields.email}</span>
          <input name="email" type="email" required />
        </label>
        <label>
          <span>${form.fields.phone}</span>
          <input name="phone" type="tel" />
        </label>
        <label>
          <span>${form.fields.role}</span>
          <select name="role">
            ${form.roleOptions
              .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
              .join("")}
          </select>
        </label>
        <label>
          <span>${form.fields.timeline}</span>
          <select name="timeline">
            ${form.timelineOptions
              .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
              .join("")}
          </select>
        </label>
        <label class="span-2">
          <span>${form.fields.package}</span>
          <select name="package">
            ${paidPackages
              .map(
                (item) =>
                  `<option value="${escapeHtml(item.slug)}"${item.recommended ? " selected" : ""}>${escapeHtml(item.name)} · ${escapeHtml(item.price)}</option>`,
              )
              .join("")}
          </select>
        </label>
        <label class="span-2">
          <span>${form.fields.notes}</span>
          <textarea name="notes" rows="5" required></textarea>
        </label>
      </div>
      <div class="form-actions">
        <button class="button button-primary" type="submit">${form.submitLabel}</button>
        <p>${form.helper}</p>
      </div>
      <p class="evaluation-form-error" data-preview-request-error>
        ${escapeHtml(propertyEvaluationPreviewState.inquiryError)}
      </p>
    </form>
  `
}

function renderPropertyEvaluationRequestSuccess() {
  const result = propertyEvaluationPreviewState.inquiryResult || {}
  const summary = result.screening || {}
  const offer = result.offer || {}

  return `
    <article class="card evaluation-success-card">
      <div class="card-topline">
        <span class="badge">Request received</span>
        ${result.request_id ? `<span class="card-highlight">${escapeHtml(result.request_id)}</span>` : ""}
      </div>
      <h3>${PROPERTY_EVALUATION_PREVIEW.requestSuccess.title}</h3>
      <p>${PROPERTY_EVALUATION_PREVIEW.requestSuccess.text}</p>
      <ul class="detail-list evaluation-detail-list">
        ${summary.parcel_id ? `<li>Parcel: ${escapeHtml(summary.parcel_id)}</li>` : ""}
        ${summary.lead_mode ? `<li>Lead mode: ${escapeHtml(summary.lead_mode)}</li>` : ""}
        ${offer.label ? `<li>Requested package: ${escapeHtml(offer.label)}</li>` : ""}
        ${result.next_step ? `<li>Next step: ${escapeHtml(result.next_step)}</li>` : ""}
      </ul>
      <div class="form-actions">
        <button class="button button-secondary" type="button" data-preview-request-reset>
          ${PROPERTY_EVALUATION_PREVIEW.requestSuccess.resetLabel}
        </button>
      </div>
    </article>
  `
}

function handleClick(event) {
  const toggle = event.target.closest("[data-nav-toggle]")
  if (toggle) {
    state.navOpen = !state.navOpen
    render()
    return
  }

  const langButton = event.target.closest("[data-lang]")
  if (langButton) {
    const nextLang = langButton.dataset.lang
    const nextUrl = hrefFor(normalizePath(window.location.pathname), nextLang, window.location.hash)
    history.pushState({}, "", nextUrl)
    state.navOpen = false
    render()
    return
  }

  const demoButton = event.target.closest("[data-preview-demo]")
  if (demoButton) {
    const previewForm = document.querySelector("[data-property-evaluation-form]")
    if (previewForm) {
      loadDemoPropertyEvaluationPreview(previewForm)
    }
    return
  }

  const resetRequestButton = event.target.closest("[data-preview-request-reset]")
  if (resetRequestButton) {
    resetPropertyEvaluationInquiry({ preserveUnlock: true })
    syncPropertyEvaluationPreviewDom()
    return
  }

  const link = event.target.closest("a[data-link]")
  if (!link) {
    return
  }

  const url = new URL(link.href, window.location.origin)
  if (url.origin !== window.location.origin) {
    return
  }

  event.preventDefault()
  state.navOpen = false
  history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`)
  render()
}

async function handleSubmit(event) {
  const previewForm = event.target.closest("[data-property-evaluation-form]")
  if (previewForm) {
    event.preventDefault()
    await runPropertyEvaluationPreview(previewForm)
    return
  }

  const requestForm = event.target.closest("[data-property-evaluation-request-form]")
  if (requestForm) {
    event.preventDefault()
    await submitPropertyEvaluationRequest(requestForm)
    return
  }

  const form = event.target.closest("[data-intake-form]")
  if (!form) {
    return
  }

  event.preventDefault()

  const formData = new FormData(form)
  const name = formData.get("name")?.toString().trim() || ""
  const company = formData.get("company")?.toString().trim() || ""
  const email = formData.get("email")?.toString().trim() || ""
  const phone = formData.get("phone")?.toString().trim() || ""
  const service = formData.get("service")?.toString().trim() || ""
  const notes = formData.get("notes")?.toString().trim() || ""

  const subject = encodeURIComponent(
    `${state.data.contact.form.mailSubjectPrefix}: ${service || state.data.site.brand.name}`,
  )
  const body = encodeURIComponent(
    [
      `${state.data.contact.form.mailLabels.name}: ${name}`,
      `${state.data.contact.form.mailLabels.company}: ${company || "-"}`,
      `${state.data.contact.form.mailLabels.email}: ${email}`,
      `${state.data.contact.form.mailLabels.phone}: ${phone || "-"}`,
      `${state.data.contact.form.mailLabels.service}: ${service || "-"}`,
      "",
      `${state.data.contact.form.mailLabels.notes}:`,
      notes,
    ].join("\n"),
  )

  window.location.href = `mailto:${state.data.site.contact.email}?subject=${subject}&body=${body}`
}

function hrefFor(path, lang = state.lang, hash = "") {
  const [pathname, inlineHash] = path.split("#")
  const query = lang === DEFAULT_LANG ? "" : `?lang=${lang}`
  const suffix = hash || (inlineHash ? `#${inlineHash}` : "")
  return `${pathname}${query}${suffix}`
}

function getLangFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get("lang") === "zh" ? "zh" : DEFAULT_LANG
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") {
    return "/"
  }

  const clean = pathname.replace(/\/+$/, "") || "/"
  if (ROUTE_ALIASES.has(clean)) {
    return ROUTE_ALIASES.get(clean) || "/"
  }
  return ROUTES.has(clean) ? clean : "/"
}

function buildTitle(path) {
  if (path === PROPERTY_EVALUATION_ROUTE) {
    const title = state.data.propertyEvaluation?.seoTitle || "Site Suitability Screen"
    return `${title}${state.data.site.seo.titleSuffix}`
  }

  const page = state.data.site.navigation.find((item) => item.to === path)

  if (!page || path === "/") {
    return state.data.site.seo.defaultTitle
  }

  return `${page.label}${state.data.site.seo.titleSuffix}`
}

function trackPageView() {
  if (typeof window.gtag !== "function") {
    return
  }

  const pagePath = `${window.location.pathname}${window.location.search}`
  if (pagePath === lastTrackedPage) {
    return
  }

  lastTrackedPage = pagePath
  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
    send_to: GA_TRACKING_ID,
  })
}

async function loadContent(lang) {
  const key = `content:${lang}`
  if (cache.has(key)) {
    return cache.get(key)
  }

  const entries = await Promise.all(
    DATASETS.map(async (name) => [camelKey(name), await fetchJson(name, lang)]),
  )

  const content = Object.fromEntries(entries)
  cache.set(key, content)
  return content
}

function initializePropertyEvaluationPreview(path) {
  if (path !== PROPERTY_EVALUATION_ROUTE) {
    return
  }

  ensurePropertyEvaluationPreviewState()

  const previewForm = document.querySelector("[data-property-evaluation-form]")
  if (previewForm) {
    const syncRequest = () => {
      propertyEvaluationPreviewState.request = buildPropertyEvaluationRequest(previewForm)
      syncPropertyEvaluationPreviewDom()
    }

    previewForm.addEventListener("input", syncRequest)
    previewForm.addEventListener("change", syncRequest)
  }

  syncPropertyEvaluationPreviewDom()

  if (propertyEvaluationPreviewState.liveConfigured === null) {
    refreshPropertyEvaluationHealth()
  }
}

function ensurePropertyEvaluationPreviewState() {
  if (propertyEvaluationPreviewState.request && propertyEvaluationPreviewState.response) {
    return
  }

  const request = clonePreviewValue(PROPERTY_EVALUATION_PREVIEW.demoRequest)
  propertyEvaluationPreviewState.request = request
  propertyEvaluationPreviewState.response = createDemoEvaluationResponse(request)
}

function resetPropertyEvaluationInquiry({ preserveUnlock = true } = {}) {
  propertyEvaluationPreviewState.inquiryError = ""
  propertyEvaluationPreviewState.inquiryResult = null
  if (!preserveUnlock) {
    propertyEvaluationPreviewState.detailUnlocked = false
  }
}

async function refreshPropertyEvaluationHealth() {
  propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.checkingStatus
  propertyEvaluationPreviewState.statusTone = "checking"
  syncPropertyEvaluationPreviewDom()

  try {
    const response = await fetch("/health", { headers: { Accept: "application/json" } })
    if (!response.ok) {
      throw new Error(`health status ${response.status}`)
    }

    const payload = await response.json()
    propertyEvaluationPreviewState.liveConfigured = Boolean(payload.gridscope_configured)
    if (propertyEvaluationPreviewState.liveConfigured) {
      propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.liveReadyStatus
      propertyEvaluationPreviewState.statusTone = "live"
    } else {
      propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.demoFallbackStatus
      propertyEvaluationPreviewState.statusTone = "demo"
    }
  } catch (error) {
    propertyEvaluationPreviewState.liveConfigured = false
    propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.demoFallbackStatus
    propertyEvaluationPreviewState.statusTone = "demo"
  }

  syncPropertyEvaluationPreviewDom()
}

async function runPropertyEvaluationPreview(form) {
  const request = buildPropertyEvaluationRequest(form)
  propertyEvaluationPreviewState.request = request
  resetPropertyEvaluationInquiry({
    preserveUnlock: propertyEvaluationPreviewState.detailUnlocked,
  })

  if (propertyEvaluationPreviewState.liveConfigured) {
    propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.liveLoadingStatus
    propertyEvaluationPreviewState.statusTone = "checking"
    syncPropertyEvaluationPreviewDom()

    try {
      const response = await fetch("/api/gridscope/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(request),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || `evaluation status ${response.status}`)
      }

      propertyEvaluationPreviewState.response = payload
      propertyEvaluationPreviewState.sourceLabel = "Live evaluation"
      propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.liveSuccessStatus
      propertyEvaluationPreviewState.statusTone = "live"
      syncPropertyEvaluationPreviewDom()
      return
    } catch (error) {
      propertyEvaluationPreviewState.response = createDemoEvaluationResponse(request)
      propertyEvaluationPreviewState.sourceLabel = "Sample parcel response"
      propertyEvaluationPreviewState.statusMessage = `${PROPERTY_EVALUATION_PREVIEW.liveErrorStatus} ${error.message}`
      propertyEvaluationPreviewState.statusTone = "error"
      syncPropertyEvaluationPreviewDom()
      return
    }
  }

  propertyEvaluationPreviewState.response = createDemoEvaluationResponse(request)
  propertyEvaluationPreviewState.sourceLabel = "Sample parcel response"
  propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.demoFallbackStatus
  propertyEvaluationPreviewState.statusTone = "demo"
  syncPropertyEvaluationPreviewDom()
}

function loadDemoPropertyEvaluationPreview(form) {
  const request = buildPropertyEvaluationRequest(form)
  propertyEvaluationPreviewState.request = request
  propertyEvaluationPreviewState.response = createDemoEvaluationResponse(request)
  propertyEvaluationPreviewState.sourceLabel = "Sample parcel response"
  propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.demoStatus
  propertyEvaluationPreviewState.statusTone = propertyEvaluationPreviewState.liveConfigured
    ? "live"
    : "demo"
  resetPropertyEvaluationInquiry({
    preserveUnlock: propertyEvaluationPreviewState.detailUnlocked,
  })
  syncPropertyEvaluationPreviewDom()
}

function buildPropertyEvaluationRequest(form) {
  const formData = new FormData(form)
  const parcelId = formData.get("parcel_id")?.toString().trim()
  const market = formData.get("market")?.toString().trim()
  const mode = formData.get("mode")?.toString().trim()

  return {
    parcel: {
      locator: {
        parcel_id:
          parcelId ||
          PROPERTY_EVALUATION_PREVIEW.demoRequest.parcel.locator.parcel_id,
      },
      market:
        market ||
        PROPERTY_EVALUATION_PREVIEW.demoRequest.parcel.market,
    },
    modes: [mode || PROPERTY_EVALUATION_PREVIEW.demoRequest.modes[0]],
    include_report: true,
    include_ai_summary: false,
  }
}

function buildPropertyEvaluationInquiryPayload(form) {
  const formData = new FormData(form)
  const request = clonePreviewValue(propertyEvaluationPreviewState.request)
  const response = propertyEvaluationPreviewState.response || createDemoEvaluationResponse(request)
  const packageSlug = formData.get("package")?.toString().trim() || "pro_evaluation"
  const selectedPackage =
    PROPERTY_EVALUATION_PREVIEW.packages.find((item) => item.slug === packageSlug) ||
    PROPERTY_EVALUATION_PREVIEW.packages[1]
  const leadMode = getLeadModeEvaluation(response)
  const parcel = response?.normalized_parcel || {}

  return {
    contact: {
      name: formData.get("name")?.toString().trim() || "",
      company: formData.get("company")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
    },
    offer: {
      slug: selectedPackage.slug,
      label: selectedPackage.name,
      price: selectedPackage.price,
      delivery: selectedPackage.delivery,
    },
    opportunity: {
      role: formData.get("role")?.toString().trim() || "",
      timeline: formData.get("timeline")?.toString().trim() || "",
      notes: formData.get("notes")?.toString().trim() || "",
    },
    screening: {
      source: propertyEvaluationPreviewState.sourceLabel,
      live_configured: Boolean(propertyEvaluationPreviewState.liveConfigured),
      request,
      summary: {
        parcel_id: pickPreviewValue(parcel?.locator?.parcel_id, parcel.parcel_id),
        market: pickPreviewValue(parcel.market, response?.shared_facts?.market),
        county: pickPreviewValue(parcel.county, response?.shared_facts?.county),
        acreage: parcel.acreage ?? null,
        lead_mode: leadMode ? formatPreviewOptionLabel(leadMode.mode) : "",
        fit_band: leadMode ? formatFitBand(leadMode.score) : "",
        score: leadMode?.score ?? null,
        verdict: leadMode?.verdict || "",
        summary: leadMode?.summary || "",
        evaluation_id: response?.evaluation_id || "",
        report_id: response?.report_id || "",
      },
    },
    page: {
      path: window.location.pathname,
      referrer: document.referrer || "",
      url: window.location.href,
    },
  }
}

async function submitPropertyEvaluationRequest(form) {
  const submitButton = form.querySelector('button[type="submit"]')
  const errorNode = form.querySelector("[data-preview-request-error]")

  propertyEvaluationPreviewState.inquiryError = ""
  if (errorNode) {
    errorNode.textContent = ""
  }

  if (submitButton) {
    submitButton.disabled = true
    submitButton.textContent = "Submitting..."
  }

  try {
    const payload = buildPropertyEvaluationInquiryPayload(form)
    const response = await fetch(PROPERTY_EVALUATION_REQUEST_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    const body = await response.json()
    if (!response.ok) {
      throw new Error(body.message || `request status ${response.status}`)
    }

    propertyEvaluationPreviewState.inquiryResult = body
    propertyEvaluationPreviewState.inquiryError = ""
    propertyEvaluationPreviewState.detailUnlocked = true
    await render()
  } catch (error) {
    propertyEvaluationPreviewState.inquiryError =
      error?.message || "The paid evaluation request could not be submitted."
    if (errorNode) {
      errorNode.textContent = propertyEvaluationPreviewState.inquiryError
    }
    if (submitButton) {
      submitButton.disabled = false
      submitButton.textContent = PROPERTY_EVALUATION_PREVIEW.requestForm.submitLabel
    }
  }
}

function createDemoEvaluationResponse(request) {
  const parcelId =
    request?.parcel?.locator?.parcel_id ||
    PROPERTY_EVALUATION_PREVIEW.demoRequest.parcel.locator.parcel_id
  const market =
    request?.parcel?.market ||
    PROPERTY_EVALUATION_PREVIEW.demoRequest.parcel.market
  const mode = request?.modes?.[0] || PROPERTY_EVALUATION_PREVIEW.demoRequest.modes[0]
  const slug = parcelId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "preview"
  const score = {
    data_center: 0.84,
    industrial_flex: 0.68,
    battery_storage: 0.73,
  }[mode] || 0.7

  return {
    normalized_parcel: {
      locator: {
        parcel_id: parcelId,
      },
      market,
      county: "Fort Bend County, TX",
      acreage: 41.8,
      frontage_ft: 1260,
    },
    shared_facts: {
      market,
      power_readiness: "Dual-feed corridor roughly 1.4 miles away",
      highway_access: "Interstate logistics access within 4.8 miles",
      fiber_access: "Carrier route available within 7.2 miles",
      floodplain: "Minimal overlap based on preliminary screen",
      entitlement_path: "Industrial-compatible zoning path likely with diligence",
    },
    mode_evaluations: [
      {
        mode,
        score,
        verdict: score >= 0.8 ? "Strong shortlist candidate" : "Viable with diligence",
        summary:
          mode === "data_center"
            ? "Parcel shows strong utility adjacency and clean logistics access for initial data-center screening."
            : "Parcel supports alternative industrial energy use cases, but utility and entitlement diligence still determine fit.",
        strengths: [
          "Utility corridor nearby for early-stage feasibility review",
          "Parcel size supports phased site planning rather than a one-shot build",
          "Shared access context is straightforward enough for broker-facing screening",
        ],
        constraints: [
          "Entitlement path still needs municipality-level confirmation",
          "Substation queue position and real deliverable capacity remain unknown",
          "Floodplain and drainage assumptions need parcel-specific engineering review",
        ],
        next_steps: [
          "Confirm substation ownership and available deliverable capacity",
          "Resolve entitlement posture with municipality and county inputs",
          "Generate operator memo and optional report if the parcel stays on the shortlist",
        ],
      },
    ],
    report_id: request?.include_report ? `report-${slug}` : undefined,
    evaluation_id: `eval-${slug}`,
  }
}

function syncPropertyEvaluationPreviewDom() {
  const requestSummaryNode = document.querySelector("[data-preview-request-summary]")
  const leadPanelNode = document.querySelector("[data-preview-lead-panel]")
  const highlightsNode = document.querySelector("[data-preview-highlights]")
  const publicReasonsNode = document.querySelector("[data-preview-public-reasons]")
  const healthBadgeNode = document.querySelector("[data-preview-health-badge]")
  const sourceBadgeNode = document.querySelector("[data-preview-source-badge]")
  const premiumSurfaceNode = document.querySelector("[data-preview-premium-surface]")

  if (
    !requestSummaryNode ||
    !leadPanelNode ||
    !highlightsNode ||
    !publicReasonsNode ||
    !healthBadgeNode ||
    !sourceBadgeNode ||
    !premiumSurfaceNode
  ) {
    return
  }

  requestSummaryNode.innerHTML = renderPropertyEvaluationRequestSummary(
    propertyEvaluationPreviewState.request,
  )
  leadPanelNode.innerHTML = renderPropertyEvaluationLeadPanel(
    propertyEvaluationPreviewState.response,
  )
  highlightsNode.innerHTML = renderPropertyEvaluationHighlights(propertyEvaluationPreviewState.response)
  publicReasonsNode.innerHTML = renderPropertyEvaluationPublicReasons(
    propertyEvaluationPreviewState.response,
  )
  premiumSurfaceNode.innerHTML = renderPropertyEvaluationPremiumSurface(
    propertyEvaluationPreviewState.response,
  )
  healthBadgeNode.textContent =
    propertyEvaluationPreviewState.liveConfigured === null
      ? "Checking backend"
      : propertyEvaluationPreviewState.liveConfigured
        ? "Live runtime ready"
        : "Sample data"
  sourceBadgeNode.textContent = propertyEvaluationPreviewState.sourceLabel

  const statusNode = document.querySelector("[data-preview-status]")

  applyEvaluationTone(healthBadgeNode, propertyEvaluationPreviewState.statusTone)
  if (statusNode) {
    applyEvaluationTone(statusNode, propertyEvaluationPreviewState.statusTone)
  }
}

function renderPropertyEvaluationHighlights(response) {
  const parcel = response?.normalized_parcel || {}
  const sharedFacts = response?.shared_facts || {}
  const firstMode = getLeadModeEvaluation(response)
  const highlights = [
    {
      label: "Parcel ID",
      value: pickPreviewValue(parcel?.locator?.parcel_id, parcel.parcel_id),
    },
    {
      label: "Market",
      value: pickPreviewValue(parcel.market, sharedFacts.market),
    },
    {
      label: "County",
      value: pickPreviewValue(parcel.county, sharedFacts.county),
    },
    {
      label: "Acreage",
      value: formatPreviewAcreage(parcel.acreage),
    },
    {
      label: "Lead mode",
      value: firstMode ? formatPreviewOptionLabel(firstMode.mode) : null,
    },
    {
      label: "Fit band",
      value: firstMode ? formatFitBand(firstMode.score) : null,
    },
  ].filter((item) => item.value)

  return highlights
    .map(
      (item) => `
        <article class="metric-card evaluation-highlight-card">
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(item.label)}</span>
        </article>
      `,
    )
    .join("")
}

function renderPropertyEvaluationModeCards(response) {
  const modes = Array.isArray(response?.mode_evaluations)
    ? response.mode_evaluations
    : []

  if (!modes.length) {
    return `
      <article class="card evaluation-mode-card">
        <div class="card-topline">
          <span class="badge">No modes returned</span>
        </div>
        <p>No evaluation modes are available for this parcel.</p>
      </article>
    `
  }

  return modes
    .map(
      (evaluation) => `
        <article class="card evaluation-mode-card">
          <div class="card-topline">
            <span class="badge">${escapeHtml(formatPreviewOptionLabel(evaluation.mode))}</span>
            ${evaluation.score == null ? "" : `<span class="card-highlight">${escapeHtml(formatPreviewScore(evaluation.score))}</span>`}
          </div>
          <h3>${escapeHtml(evaluation.verdict || "Evaluation result")}</h3>
          <p>${escapeHtml(evaluation.summary || "Preview response loaded.")}</p>
          ${renderPreviewListBlock("Strengths", evaluation.strengths)}
          ${renderPreviewListBlock("Constraints", evaluation.constraints)}
          ${renderPreviewListBlock("Next steps", evaluation.next_steps)}
        </article>
      `,
    )
    .join("")
}

function renderPropertyEvaluationMeta(response) {
  const parcel = response?.normalized_parcel || {}
  const evaluation = getLeadModeEvaluation(response)
  const entries = [
    evaluation
      ? `<span class="pill">Top mode ${escapeHtml(formatPreviewOptionLabel(evaluation.mode))}</span>`
      : "",
    evaluation
      ? `<span class="pill">${escapeHtml(formatFitBand(evaluation.score))}</span>`
      : "",
    parcel.county ? `<span class="pill">${escapeHtml(parcel.county)}</span>` : "",
    propertyEvaluationPreviewState.liveConfigured === null
      ? ""
      : `<span class="pill">${propertyEvaluationPreviewState.liveConfigured ? "Live runtime" : "Sample data"}</span>`,
  ].filter(Boolean)

  if (propertyEvaluationPreviewState.detailUnlocked) {
    if (response?.evaluation_id) {
      entries.push(`<span class="pill">${escapeHtml(response.evaluation_id)}</span>`)
    }
    if (response?.report_id) {
      entries.push(`<span class="pill">${escapeHtml(response.report_id)}</span>`)
    }
  } else {
    entries.push("<span class=\"pill\">Paid request unlocks deeper scorecards</span>")
  }

  return entries.join("")
}

function getLeadModeEvaluation(response) {
  return Array.isArray(response?.mode_evaluations)
    ? response.mode_evaluations[0]
    : null
}

function renderPreviewListBlock(label, items) {
  if (!Array.isArray(items) || !items.length) {
    return ""
  }

  return `
    <div class="evaluation-list-block">
      <h4>${escapeHtml(label)}</h4>
      <ul class="detail-list evaluation-detail-list">
        ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `
}

function applyEvaluationTone(node, tone) {
  node.classList.remove("is-live", "is-demo", "is-error", "is-checking")
  const className = {
    live: "is-live",
    demo: "is-demo",
    error: "is-error",
    checking: "is-checking",
  }[tone]

  if (className) {
    node.classList.add(className)
  }
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2)
}

function clonePreviewValue(value) {
  return JSON.parse(JSON.stringify(value))
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function formatPreviewOptionLabel(value) {
  return String(value || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ")
}

function formatPreviewScore(score) {
  const number = Number(score)
  if (!Number.isFinite(number)) {
    return "Not scored"
  }
  return `${Math.round(number * 100)} / 100`
}

function formatFitBand(score) {
  const number = Number(score)
  if (!Number.isFinite(number)) {
    return "Unscored"
  }
  if (number >= 0.8) {
    return "High fit"
  }
  if (number >= 0.65) {
    return "Medium fit"
  }
  return "Low fit"
}

function formatPreviewAcreage(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) {
    return null
  }
  return `${number.toFixed(1)} acres`
}

function pickPreviewValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "")
}

async function fetchJson(name, lang) {
  const response = await fetch(`/data/${name}.${lang}.json`)

  if (!response.ok) {
    throw new Error(`Failed to load /data/${name}.${lang}.json`)
  }

  return response.json()
}

function camelKey(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function activateReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.18 },
  )

  document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node))
}

function syncHashTarget() {
  if (!window.location.hash) {
    window.scrollTo({ top: 0, behavior: "auto" })
    return
  }

  const target = document.querySelector(window.location.hash)
  if (!target) {
    return
  }

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" })
  })
}
