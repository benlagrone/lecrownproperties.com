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
const DATASETS = [
  "site",
  "home",
  "about",
  "contact",
  "services",
  "properties",
  "clients",
  "case-studies",
  "insights",
]

const ROUTES = new Set([
  "/",
  "/services",
  "/properties",
  "/property-evaluation-preview",
  "/clients",
  "/case-studies",
  "/insights",
  "/about",
  "/contact",
])

const PROPERTY_EVALUATION_ROUTE = "/property-evaluation-preview"
const PROPERTY_EVALUATION_PREVIEW = {
  hero: {
    eyebrow: "GridScope Preview",
    title: "Property evaluation preview",
    summary:
      "Preview the parcel-screening surface LeCrown can use for data-center site review. The page renders a polished demo immediately and switches to live GridScope results whenever the backend runtime is configured.",
    primaryCta: {
      to: `${PROPERTY_EVALUATION_ROUTE}#preview-intake`,
      label: "Run the preview",
    },
    secondaryCta: {
      to: "/properties",
      label: "Back to properties",
    },
    visual: {
      src: "/assets/warehouse.jpg",
      alt: "Industrial corridor with utility infrastructure",
      kicker: "Data center mode",
      title: "Utility-aware parcel screening",
      text: "Normalize parcel inputs, check shared site facts, and turn the result into an operator-facing decision surface without exposing GridScope credentials in the browser.",
    },
    brief: {
      eyebrow: "Current contract",
      title: "Same-origin secure flow",
      text:
        "The preview page talks only to LeCrown's backend. When the backend is configured, it forwards the request to GridScope and filters the response before it reaches the browser.",
      points: [
        "LeCrown browser -> /api/gridscope/evaluate",
        "LeCrown server -> GridScope /v1/evaluate",
        "Browser receives filtered parcel facts only",
      ],
    },
    metrics: [
      { value: "1", label: "Preview route" },
      { value: "/health", label: "Runtime availability check" },
      { value: "Demo + Live", label: "Fallback behavior" },
    ],
  },
  intakeHeading: {
    eyebrow: "Preview intake",
    title: "Shape the request before it hits the backend",
    text:
      "Use the form below to test the parcel input shape. If the live GridScope runtime is unavailable, the page still renders a realistic demo response so the preview stays reviewable.",
  },
  runtimeHeading: {
    eyebrow: "Runtime contract",
    title: "Live path and fallback path in one surface",
    text:
      "Production can expose the same preview safely. The backend advertises availability through /health and the page adapts between live evaluation and demo fallback automatically.",
  },
  resultHeading: {
    eyebrow: "Evaluation surface",
    title: "Operator-friendly parcel output",
    text:
      "The preview emphasizes the parcel facts, mode recommendation, and next-step framing that matter most when triaging a new site candidate.",
  },
  requestHeading: "Request preview",
  responseHeading: "Filtered response preview",
  demoStatus:
    "Demo data loaded. Live evaluation will take over automatically when GridScope is configured.",
  demoFallbackStatus:
    "GridScope is not configured on this environment, so the preview is showing demo results based on your input.",
  liveReadyStatus:
    "GridScope is configured. Submitting the form will call the live evaluation endpoint.",
  liveLoadingStatus: "Running live property evaluation through the LeCrown backend...",
  liveSuccessStatus:
    "Live GridScope response loaded through /api/gridscope/evaluate.",
  liveErrorStatus:
    "The live request failed, so the preview fell back to demo data for layout review.",
  checkingStatus: "Checking backend availability at /health...",
  apiFacts: [
    "POST /api/gridscope/evaluate",
    "Server-only auth header or bearer token",
    "Response shape: normalized_parcel, shared_facts, mode_evaluations",
    "In-memory response caching on identical requests",
  ],
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
  sourceLabel: "Demo response",
  request: null,
  response: null,
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
  const request = propertyEvaluationPreviewState.request
  const response = propertyEvaluationPreviewState.response

  return `
    ${renderHero(PROPERTY_EVALUATION_PREVIEW.hero, { hrefFor })}

    <section class="section-block split-grid" data-reveal>
      <div class="panel panel-rich evaluation-panel">
        ${renderSectionHeading(PROPERTY_EVALUATION_PREVIEW.intakeHeading, "left")}
        ${renderPropertyEvaluationPreviewForm(request)}
        <div class="evaluation-json-block">
          <div class="card-topline">
            <strong>${PROPERTY_EVALUATION_PREVIEW.requestHeading}</strong>
            <span class="card-highlight">POST /api/gridscope/evaluate</span>
          </div>
          <pre class="evaluation-json" data-preview-request>${escapeHtml(prettyJson(request))}</pre>
        </div>
      </div>

      <div class="panel panel-brief evaluation-panel">
        ${renderSectionHeading(PROPERTY_EVALUATION_PREVIEW.runtimeHeading, "left")}
        <div class="evaluation-runtime-head">
          <span class="badge evaluation-badge" data-preview-health-badge>Checking backend</span>
          <span class="card-highlight" data-preview-source-badge>${escapeHtml(propertyEvaluationPreviewState.sourceLabel)}</span>
        </div>
        <p class="evaluation-note" data-preview-status>
          ${escapeHtml(propertyEvaluationPreviewState.statusMessage)}
        </p>
        <div class="pill-cloud evaluation-pill-cloud" data-preview-meta>
          ${renderPropertyEvaluationMeta(response)}
        </div>
        <ul class="detail-list evaluation-detail-list">
          ${PROPERTY_EVALUATION_PREVIEW.apiFacts
            .map((fact) => `<li>${escapeHtml(fact)}</li>`)
            .join("")}
        </ul>
      </div>
    </section>

    <section class="section-block split-grid" data-reveal>
      <div class="panel panel-rich evaluation-panel">
        ${renderSectionHeading(PROPERTY_EVALUATION_PREVIEW.resultHeading, "left")}
        <div class="metrics-grid evaluation-highlight-grid" data-preview-highlights>
          ${renderPropertyEvaluationHighlights(response)}
        </div>
        <div class="card-grid cols-3 evaluation-mode-grid" data-preview-modes>
          ${renderPropertyEvaluationModeCards(response)}
        </div>
      </div>

      <div class="panel panel-brief evaluation-panel">
        <span class="eyebrow">Filtered payload</span>
        <h2>${PROPERTY_EVALUATION_PREVIEW.responseHeading}</h2>
        <p class="evaluation-note">
          The preview page keeps the raw payload visible so LeCrown can review the browser-side contract before the full portal is built.
        </p>
        <pre class="evaluation-json" data-preview-response>${escapeHtml(prettyJson(response))}</pre>
      </div>
    </section>
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
  const includeReport =
    request?.include_report ?? PROPERTY_EVALUATION_PREVIEW.demoRequest.include_report
  const includeAiSummary =
    request?.include_ai_summary ?? PROPERTY_EVALUATION_PREVIEW.demoRequest.include_ai_summary

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
        <label class="evaluation-checkbox">
          <input name="include_report" type="checkbox"${includeReport ? " checked" : ""} />
          <span>Include report id in the response</span>
        </label>
        <label class="evaluation-checkbox">
          <input name="include_ai_summary" type="checkbox"${includeAiSummary ? " checked" : ""} />
          <span>Request AI summary when live runtime is enabled</span>
        </label>
      </div>
      <div class="form-actions">
        <button class="button button-primary" type="submit">Run property preview</button>
        <button class="button button-secondary" type="button" data-preview-demo>
          Reset demo
        </button>
        <p>
          This preview route works without a live GridScope runtime and upgrades automatically when the backend is configured.
        </p>
      </div>
    </form>
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
  return ROUTES.has(clean) ? clean : "/"
}

function buildTitle(path) {
  if (path === PROPERTY_EVALUATION_ROUTE) {
    return `Property Evaluation Preview${state.data.site.seo.titleSuffix}`
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
      propertyEvaluationPreviewState.sourceLabel = "Live GridScope response"
      propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.liveSuccessStatus
      propertyEvaluationPreviewState.statusTone = "live"
      syncPropertyEvaluationPreviewDom()
      return
    } catch (error) {
      propertyEvaluationPreviewState.response = createDemoEvaluationResponse(request)
      propertyEvaluationPreviewState.sourceLabel = "Demo fallback"
      propertyEvaluationPreviewState.statusMessage = `${PROPERTY_EVALUATION_PREVIEW.liveErrorStatus} ${error.message}`
      propertyEvaluationPreviewState.statusTone = "error"
      syncPropertyEvaluationPreviewDom()
      return
    }
  }

  propertyEvaluationPreviewState.response = createDemoEvaluationResponse(request)
  propertyEvaluationPreviewState.sourceLabel = "Demo fallback"
  propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.demoFallbackStatus
  propertyEvaluationPreviewState.statusTone = "demo"
  syncPropertyEvaluationPreviewDom()
}

function loadDemoPropertyEvaluationPreview(form) {
  const request = buildPropertyEvaluationRequest(form)
  propertyEvaluationPreviewState.request = request
  propertyEvaluationPreviewState.response = createDemoEvaluationResponse(request)
  propertyEvaluationPreviewState.sourceLabel = "Demo response"
  propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.demoStatus
  propertyEvaluationPreviewState.statusTone = propertyEvaluationPreviewState.liveConfigured
    ? "live"
    : "demo"
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
    include_report: formData.get("include_report") === "on",
    include_ai_summary: formData.get("include_ai_summary") === "on",
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
  const requestNode = document.querySelector("[data-preview-request]")
  const responseNode = document.querySelector("[data-preview-response]")
  const highlightsNode = document.querySelector("[data-preview-highlights]")
  const modesNode = document.querySelector("[data-preview-modes]")
  const statusNode = document.querySelector("[data-preview-status]")
  const healthBadgeNode = document.querySelector("[data-preview-health-badge]")
  const sourceBadgeNode = document.querySelector("[data-preview-source-badge]")
  const metaNode = document.querySelector("[data-preview-meta]")

  if (
    !requestNode ||
    !responseNode ||
    !highlightsNode ||
    !modesNode ||
    !statusNode ||
    !healthBadgeNode ||
    !sourceBadgeNode ||
    !metaNode
  ) {
    return
  }

  requestNode.textContent = prettyJson(propertyEvaluationPreviewState.request)
  responseNode.textContent = prettyJson(propertyEvaluationPreviewState.response)
  highlightsNode.innerHTML = renderPropertyEvaluationHighlights(propertyEvaluationPreviewState.response)
  modesNode.innerHTML = renderPropertyEvaluationModeCards(propertyEvaluationPreviewState.response)
  metaNode.innerHTML = renderPropertyEvaluationMeta(propertyEvaluationPreviewState.response)
  statusNode.textContent = propertyEvaluationPreviewState.statusMessage
  healthBadgeNode.textContent =
    propertyEvaluationPreviewState.liveConfigured === null
      ? "Checking backend"
      : propertyEvaluationPreviewState.liveConfigured
        ? "Live runtime ready"
        : "Demo mode"
  sourceBadgeNode.textContent = propertyEvaluationPreviewState.sourceLabel

  applyEvaluationTone(healthBadgeNode, propertyEvaluationPreviewState.statusTone)
  applyEvaluationTone(statusNode, propertyEvaluationPreviewState.statusTone)
}

function renderPropertyEvaluationHighlights(response) {
  const parcel = response?.normalized_parcel || {}
  const sharedFacts = response?.shared_facts || {}
  const firstMode = Array.isArray(response?.mode_evaluations)
    ? response.mode_evaluations[0]
    : null
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
      label: "Score",
      value: firstMode ? formatPreviewScore(firstMode.score) : null,
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
        <p>No evaluation modes are available for this preview.</p>
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
  const entries = [
    response?.evaluation_id
      ? `<span class="pill">Evaluation ${escapeHtml(response.evaluation_id)}</span>`
      : "",
    response?.report_id
      ? `<span class="pill">Report ${escapeHtml(response.report_id)}</span>`
      : '<span class="pill">No report id requested</span>',
  ].filter(Boolean)

  return entries.join("")
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
