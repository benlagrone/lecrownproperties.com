import { renderHeader } from "./components/header.js?v=phone-hero-20260703"
import { renderFooter } from "./components/footer.js?v=phone-hero-20260703"
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
const SHORT_TERM_LEASE_ROUTE = "/short-term-office-lease"
const MEDICAL_CENTER_LISTINGS_ROUTE = "/medical-center-office-lease"
const PROPERTY_EVALUATION_MARKETS_PATH = "/api/gridscope/markets"
const PROPERTY_EVALUATION_REQUEST_PATH = "/api/property-evaluation-requests"
const LEASE_INQUIRY_PATH = "/api/lease-inquiries"
const PROPERTY_EVALUATION_SUPPORTED_MARKETS = [
  {
    slug: "tx-statewide",
    name: "Texas Statewide",
    summary: "Statewide Texas parcel screening against the current GridScope data stack.",
    is_default: true,
  },
  {
    slug: "tx-houston-1h",
    name: "Texas Houston 1H",
    summary: "Houston 1-hour market cut for faster parcel evaluation and parity checks.",
    is_default: false,
  },
]
const PROPERTY_EVALUATION_SUPPORTED_MARKET_SLUGS = new Set(
  PROPERTY_EVALUATION_SUPPORTED_MARKETS.map((item) => item.slug),
)
const PROPERTY_EVALUATION_MARKET_COUNTIES = {
  "tx-statewide": "Texas",
  "tx-houston-1h": "Houston area, TX",
}

const DATASETS = [
  "site",
  "home",
  "about",
  "contact",
  "services",
  "properties",
  "short-term-lease",
  "medical-center-listings",
  "property-evaluation",
  "clients",
  "case-studies",
  "insights",
]

const ROUTES = new Set([
  "/",
  "/services",
  "/properties",
  SHORT_TERM_LEASE_ROUTE,
  MEDICAL_CENTER_LISTINGS_ROUTE,
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

const PROPERTY_EVALUATION_DEMO_SCENARIOS = [
  {
    parcel: {
      locator: {
        parcel_id: "00000324724000000",
      },
      market: "tx-statewide",
    },
    modes: ["data_center"],
    include_report: true,
    include_ai_summary: false,
  },
  {
    parcel: {
      locator: {
        parcel_id: "0410880000003",
      },
      market: "tx-houston-1h",
    },
    modes: ["data_center"],
    include_report: true,
    include_ai_summary: false,
  },
  {
    parcel: {
      locator: {
        parcel_id: "00000760432000000",
      },
      market: "tx-statewide",
    },
    modes: ["data_center"],
    include_report: true,
    include_ai_summary: false,
  },
]

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
      title: "Use the public screen to qualify a site",
      text:
        "The browser only talks to LeCrown. Strong parcels can be upgraded into a paid evaluation request with the parcel, data center fit, and first readout already attached.",
      points: [
        "Public screen identifies parcel and fit band",
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
    title: "Start with parcel and market",
    text:
      "Use the public screen to qualify whether a parcel deserves deeper work. The page falls back to example output when the live runtime is unavailable.",
  },
  runtimeHeading: {
    eyebrow: "Screen status",
    title: "Live runtime when available, demo fallback when not",
    text:
      "The same customer-facing surface can run in production safely. The backend advertises runtime availability and the page adapts automatically.",
  },
  resultHeading: {
    eyebrow: "Public result",
    title: "What the current screen found on this parcel",
    text:
      "The public screen shows the parcel, data center fit, and the main reasons it surfaced. Paid follow-up adds the deeper scorecard.",
  },
  upgradeHeading: {
    eyebrow: "Paid follow-up",
    title: "If the parcel looks good, request the deeper evaluation",
    text:
      "Paid work adds scorecards, blockers, and next diligence steps on this parcel.",
  },
  lockedHeading: {
    eyebrow: "Paid detail",
    title: "What you get after the paid handoff",
    text:
      "The free screen is a first-pass readout. Paid work adds the detailed score, blockers, and follow-up actions.",
  },
  requestSummaryHeading: "Current parcel",
  demoStatus:
    "Example result loaded from the parcel ID and market you selected.",
  demoFallbackStatus:
    "Example mode. This environment is not connected to live GridScope, so the result below is example output shaped by your inputs.",
  liveReadyStatus:
    "Live mode is available for this page.",
  liveLoadingStatus: "Running live parcel evaluation...",
  liveSuccessStatus:
    "Live parcel evaluation loaded.",
  liveErrorStatus:
    "Live parcel evaluation failed. Showing example output based on your inputs instead.",
  checkingStatus: "Checking whether live parcel data is available...",
  actionLabels: {
    checkingPrimary: "Run screen",
    checkingHelper: "Checking whether this deployment can reach live parcel data.",
    livePrimary: "Run live screen",
    liveSecondary: "Load example parcel",
    liveHelper: "Live mode. This deployment pulls parcel evaluations from LeCrown's backend.",
    demoPrimary: "Run example screen",
    demoSecondary: "Load another example",
    demoHelper:
      "Example mode. The result below is generated from your parcel ID and market selection because live GridScope is not configured here.",
    liveRunning: "Running live screen...",
    demoRunning: "Running example screen...",
  },
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
  marketOptions: PROPERTY_EVALUATION_SUPPORTED_MARKETS.map((item) => item.slug),
  modeOptions: ["data_center"],
  demoScenarios: PROPERTY_EVALUATION_DEMO_SCENARIOS,
  demoRequest: PROPERTY_EVALUATION_DEMO_SCENARIOS[0],
}

const propertyEvaluationPreviewState = {
  liveConfigured: null,
  statusMessage: PROPERTY_EVALUATION_PREVIEW.checkingStatus,
  statusTone: "checking",
  sourceLabel: "Awaiting screen",
  request: null,
  response: null,
  inquiryError: "",
  inquiryResult: null,
  detailUnlocked: false,
  previewRunning: false,
  demoScenarioIndex: 0,
  marketCatalog: clonePreviewValue(PROPERTY_EVALUATION_SUPPORTED_MARKETS),
}

const leaseInquiryState = {
  activeRoom: "",
  mode: "gallery",
  inquiryError: "",
  inquiryResult: null,
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
document.addEventListener("keydown", handleKeydown)
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
    case SHORT_TERM_LEASE_ROUTE:
      return renderShortTermLeasePage()
    case MEDICAL_CENTER_LISTINGS_ROUTE:
      return renderMedicalCenterListingsPage()
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

    ${state.data.shortTermLease?.feature ? renderLeaseFeature(state.data.shortTermLease.feature) : ""}
    ${state.data.medicalCenterListings?.feature ? renderMedicalCenterListingsFeature(state.data.medicalCenterListings.feature) : ""}

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

function renderLeaseFeature(feature) {
  return `
    <section class="section-block lease-feature" data-reveal>
      <div>
        <span class="eyebrow">${feature.eyebrow}</span>
        <h2>${feature.title}</h2>
        <p>${feature.text}</p>
      </div>
      <div class="lease-feature-actions">
        <div class="pill-cloud">
          ${feature.highlights.map((item) => `<span class="pill">${item}</span>`).join("")}
        </div>
        <a class="button button-primary" href="${hrefFor(feature.primaryCta.to)}" data-link>
          ${feature.primaryCta.label}
        </a>
      </div>
    </section>
  `
}

function renderMedicalCenterListingsFeature(feature) {
  return `
    <section class="section-block lease-feature medical-listings-feature" data-reveal>
      <div>
        <span class="eyebrow">${feature.eyebrow}</span>
        <h2>${feature.title}</h2>
        <p>${feature.text}</p>
      </div>
      <div class="lease-feature-actions">
        <div class="pill-cloud">
          ${feature.highlights.map((item) => `<span class="pill">${item}</span>`).join("")}
        </div>
        <a class="button button-primary" href="${hrefFor(feature.primaryCta.to)}" data-link>
          ${feature.primaryCta.label}
        </a>
      </div>
    </section>
  `
}

function renderMedicalCenterListingsPage() {
  const { medicalCenterListings } = state.data
  const { contact, page } = medicalCenterListings

  return `
    ${renderHero(page.hero, { hrefFor })}

    <section class="section-block" data-reveal>
      <div class="metrics-grid dorrington-summary-grid">
        ${page.summary.map(renderMetricCard).join("")}
      </div>
    </section>

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.listingsHeading)}
      <div class="dorrington-listing-grid">
        ${page.listings.map((listing) => renderDorringtonListingCard(listing, contact)).join("")}
      </div>
      ${page.sourceNote ? `<p class="dorrington-source-note">${page.sourceNote}</p>` : ""}
    </section>

    <section class="section-block split-grid dorrington-gallery-section" data-reveal>
      <div>
        ${renderSectionHeading(page.galleryHeading, "left")}
        <div class="dorrington-gallery-grid">
          ${page.gallery.map(renderDorringtonGalleryPhoto).join("")}
        </div>
      </div>
      ${renderDorringtonLocationPanel(page.location, contact)}
    </section>

    <section class="section-block" data-reveal>
      ${renderSectionHeading(page.comparisonHeading)}
      <div class="lease-table-shell">
        <table class="lease-room-table dorrington-table">
          <thead>
            <tr>
              ${page.tableLabels.map((label) => `<th>${label}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${page.comparisonRows
              .map(
                (row) => `
                  <tr>
                    <td data-label="${escapeHtml(page.tableLabels[0])}">${row.property}</td>
                    <td data-label="${escapeHtml(page.tableLabels[1])}">${row.size}</td>
                    <td data-label="${escapeHtml(page.tableLabels[2])}">${row.rate}</td>
                    <td data-label="${escapeHtml(page.tableLabels[3])}">${row.bestFor}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>

    ${renderDorringtonContactBanner(page.ctaBanner, contact)}
  `
}

function renderDorringtonListingCard(listing, contact) {
  const inquiryHref = buildDorringtonInquiryHref(listing, contact)
  const visual = listing.image
    ? `
        <figure class="dorrington-listing-visual">
          <img src="${escapeHtml(listing.image.src)}" alt="${escapeHtml(listing.image.alt)}" loading="lazy" decoding="async" />
        </figure>
      `
    : renderDorringtonParcelDiagram(listing.diagram)

  return `
    <article class="dorrington-listing-card" id="${escapeHtml(listing.id)}">
      ${visual}
      <div class="dorrington-listing-body">
        <div class="card-topline">
          <span class="badge">${escapeHtml(listing.category)}</span>
          <span class="card-highlight">${escapeHtml(listing.status)}</span>
        </div>
        <h2>${escapeHtml(listing.title)}</h2>
        <p>${escapeHtml(listing.summary)}</p>
        <div class="dorrington-price-row">
          <strong>${escapeHtml(listing.price)}</strong>
          <span>${escapeHtml(listing.priceNote)}</span>
        </div>
        <div class="dorrington-stat-grid">
          ${listing.stats
            .map(
              (stat) => `
                <article class="dorrington-stat">
                  <strong>${escapeHtml(stat.value)}</strong>
                  <span>${escapeHtml(stat.label)}</span>
                </article>
              `,
            )
            .join("")}
        </div>
        <ul class="detail-list">
          ${listing.details.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        <div class="pill-cloud dorrington-use-cloud">
          ${listing.uses.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("")}
        </div>
        <div class="dorrington-card-actions">
          <a class="button button-primary" href="${escapeHtml(inquiryHref)}">${escapeHtml(listing.primaryCta)}</a>
          <a class="button button-secondary" href="${escapeHtml(contact.phoneHref)}">${escapeHtml(contact.phoneLabel)}</a>
        </div>
      </div>
    </article>
  `
}

function renderDorringtonParcelDiagram(diagram = {}) {
  return `
    <figure class="dorrington-parcel-diagram" role="img" aria-label="${escapeHtml(diagram.alt || "Not-to-scale adjacency diagram for 2223 and 2227 Dorrington")}">
      <div class="diagram-road diagram-road-top">${escapeHtml(diagram.topRoad || "Holcombe Blvd")}</div>
      <div class="diagram-road diagram-road-left">${escapeHtml(diagram.leftRoad || "Dorrington St")}</div>
      <div class="diagram-parcel diagram-parcel-office">
        <strong>${escapeHtml(diagram.officeLabel || "2223")}</strong>
        <span>${escapeHtml(diagram.officeText || "Medical office")}</span>
      </div>
      <div class="diagram-parcel diagram-parcel-lot">
        <strong>${escapeHtml(diagram.lotLabel || "2227")}</strong>
        <span>${escapeHtml(diagram.lotText || "Adjacent lot")}</span>
      </div>
      <figcaption>${escapeHtml(diagram.caption || "Not-to-scale adjacency view")}</figcaption>
    </figure>
  `
}

function renderDorringtonGalleryPhoto(photo) {
  return `
    <figure class="dorrington-gallery-photo">
      <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" loading="lazy" decoding="async" />
      <figcaption>${escapeHtml(photo.label)}</figcaption>
    </figure>
  `
}

function renderDorringtonLocationPanel(location, contact) {
  return `
    <aside class="panel panel-rich dorrington-location-panel">
      ${renderSectionHeading(location.heading, "left")}
      <ul class="detail-list">
        ${location.points.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <div class="dorrington-contact-card">
        <span class="eyebrow">${escapeHtml(location.contactEyebrow)}</span>
        <h3>${escapeHtml(location.contactTitle)}</h3>
        <p>${escapeHtml(location.contactText)}</p>
        <div class="dorrington-card-actions">
          <a class="button button-primary" href="${escapeHtml(buildDorringtonInquiryHref(null, contact))}">
            ${escapeHtml(location.emailLabel)}
          </a>
          <a class="button button-secondary" href="${escapeHtml(contact.phoneHref)}">
            ${escapeHtml(contact.phone)}
          </a>
        </div>
      </div>
    </aside>
  `
}

function renderDorringtonContactBanner(banner, contact) {
  return `
    <section class="section-block" id="inquire" data-reveal>
      <div class="cta-banner dorrington-cta-banner">
        <div>
          <span class="eyebrow">${banner.eyebrow}</span>
          <h2>${banner.title}</h2>
          <p>${banner.text}</p>
        </div>
        <div class="cta-banner-actions">
          <a class="button button-primary" href="${escapeHtml(buildDorringtonInquiryHref(null, contact))}">
            ${banner.primaryLabel}
          </a>
          <a class="button button-secondary" href="${escapeHtml(contact.phoneHref)}">
            ${banner.secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  `
}

function buildDorringtonInquiryHref(listing, contact) {
  const subject = encodeURIComponent(
    listing ? `Inquiry: ${listing.address}` : "Medical Center Dorrington leasing inquiry",
  )
  const body = encodeURIComponent(
    [
      `Hello ${contact.name},`,
      "",
      listing
        ? `I am interested in ${listing.address} (${listing.title}).`
        : "I am interested in the Dorrington Medical Center leasing opportunities.",
      "Please send current availability, showing times, and next steps.",
      "",
      "Name:",
      "Phone:",
      "Company:",
    ].join("\n"),
  )

  return `mailto:${contact.email}?subject=${subject}&body=${body}`
}

function renderShortTermLeasePage() {
  const { site, shortTermLease } = state.data
  const page = shortTermLease.page

  return `
    ${renderHero(page.hero, { hrefFor })}

    <section class="section-block" data-reveal>
      <div class="metrics-grid lease-summary-grid">
        ${page.summary.map(renderMetricCard).join("")}
      </div>
    </section>

    <section class="section-block split-grid lease-map-section" data-reveal>
      <div class="panel panel-rich lease-map-panel">
        ${renderSectionHeading(page.mapHeading, "left")}
        ${renderCleanLeaseMap(page, shortTermLease.leadCapture)}
      </div>
      <div class="stack-panel">
        ${renderSectionHeading(page.rentHeading, "left")}
        <div class="lease-rent-grid">
          ${page.rentBands.map((band) => renderLeaseRentBand(band, page.rooms)).join("")}
        </div>
      </div>
    </section>

    <section class="section-block lease-room-catalog-section" id="rooms" data-reveal>
      ${renderSectionHeading(page.roomGalleryHeading)}
      <div class="lease-room-card-grid">
        ${page.rooms.map((room) => renderLeaseRoomCard(room, shortTermLease.leadCapture)).join("")}
      </div>
    </section>

    <section class="section-block lease-table-section" id="rent-table" data-reveal>
      ${renderSectionHeading(page.tableHeading)}
      <div class="lease-table-shell">
        <table class="lease-room-table">
          <thead>
            <tr>
              <th>${page.tableLabels.room}</th>
              <th>${page.tableLabels.squareFeet}</th>
              <th>${page.tableLabels.rent}</th>
              <th>${page.tableLabels.type}</th>
              <th>${page.tableLabels.status}</th>
            </tr>
          </thead>
          <tbody>
            ${page.rooms
              .map(
                (room) => `
                  <tr>
                    <td>${room.room}</td>
                    <td>${room.squareFeet}</td>
                    <td>${room.rent}</td>
                    <td>${room.type}</td>
                    <td>${room.status}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section-block split-grid" data-reveal>
      <div class="panel panel-brief">
        ${renderSectionHeading(page.notesHeading, "left")}
        <ul class="detail-list">
          ${page.notes.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <div class="panel panel-rich">
        ${renderSectionHeading(page.unpricedHeading, "left")}
        <div class="pill-cloud">
          ${page.unpricedRooms.map((item) => `<span class="pill">${item}</span>`).join("")}
        </div>
      </div>
    </section>

    ${renderBanner(page.ctaBanner, site.contact.email)}
    ${renderLeaseRoomModal(page, shortTermLease.leadCapture)}
  `
}

function renderLeaseRentBand(band, rooms) {
  const matchingRooms = getLeaseRoomsForRentBand(band, rooms)
  const countLabel = formatLeaseRoomCount(matchingRooms.length)

  return `
    <article class="lease-rent-band ${getLeaseRentBandClass(band.price)}" id="${escapeHtml(getLeaseRentBandId(band.price))}">
      <div class="lease-rent-band-header">
        <div>
          <strong>${escapeHtml(band.price)}</strong>
          <span>${escapeHtml(band.label)}</span>
        </div>
        ${countLabel ? `<em>${escapeHtml(countLabel)}</em>` : ""}
      </div>
      ${
        matchingRooms.length
          ? `
            <div class="lease-rent-room-grid" aria-label="${escapeHtml(`${band.price} rooms`)}">
              ${matchingRooms.map(renderLeaseRentRoomChip).join("")}
            </div>
          `
          : `<p>${escapeHtml(band.rooms)}</p>`
      }
    </article>
  `
}

function getLeaseRoomsForRentBand(band, rooms) {
  const normalizedPrice = normalizeLeaseRent(band.price)
  const matchingRooms = rooms.filter((room) => normalizeLeaseRent(room.rent) === normalizedPrice)
  if (matchingRooms.length) {
    return matchingRooms
  }

  const roomNumbers = extractLeaseRoomNumbers(band.rooms)
  return roomNumbers
    .map((roomNumber) => rooms.find((room) => room.room === roomNumber))
    .filter(Boolean)
}

function renderLeaseRentRoomChip(room) {
  return `
    <button
      class="lease-rent-room-chip"
      type="button"
      data-lease-gallery-room="${escapeHtml(room.room)}"
      aria-label="${escapeHtml(`Open gallery for Room ${room.room}, ${room.squareFeet} square feet`)}"
    >
      <b>${escapeHtml(room.room)}</b>
      <small>${escapeHtml(room.squareFeet)} SF</small>
    </button>
  `
}

function formatLeaseRoomCount(count) {
  if (!count) {
    return ""
  }
  const suffix = state.lang === "zh" ? "间" : count === 1 ? "room" : "rooms"
  return state.lang === "zh" ? `${count}${suffix}` : `${count} ${suffix}`
}

function getLeaseRentBandClass(price) {
  return `is-${getLeaseMapRentClass(normalizeLeaseRent(price))}`
}

function getLeaseRentBandId(price) {
  const normalizedPrice = normalizeLeaseRent(price)
  const digits = normalizedPrice.match(/\d+/)?.[0]
  return digits ? `rent-band-${digits}` : "rent-band-confirm"
}

function normalizeLeaseRent(value) {
  return String(value || "")
    .replace("/月", "/mo")
    .replace(/\s+/g, "")
    .toLowerCase()
}

function extractLeaseRoomNumbers(value) {
  return [...new Set(String(value || "").match(/\b(?:BY)?\d{3}[A-Z]?\b/g) || [])]
}

function renderCleanLeaseMap(page, leadCapture) {
  const pricedRooms = new Map(page.rooms.map((room) => [room.room, room]))
  const mapRooms = buildLeaseMapRooms(pricedRooms)
  const legend = [
    { className: "rent-300", label: "$300/mo" },
    { className: "rent-399", label: "$399/mo" },
    { className: "rent-499", label: "$499/mo" },
    { className: "rent-599", label: "$599/mo" },
    { className: "rent-cowork", label: "$250/desk" },
    { className: "rent-confirm", label: "Confirm" },
  ]

  return `
    <div class="lease-clean-map">
      <div class="lease-clean-map-toolbar">
        <div>
          <strong>Suite 700 rendered leasing map</strong>
          <span>Click a priced room to open its gallery and inquiry form.</span>
        </div>
        <div class="lease-map-legend" aria-label="Rent legend">
          ${legend
            .map(
              (item) => `
                <span><i class="${item.className}"></i>${escapeHtml(item.label)}</span>
              `,
            )
            .join("")}
        </div>
      </div>
      <svg
        class="lease-map-svg"
        viewBox="0 0 1400 900"
        role="img"
        aria-label="Rendered Suite 700 office leasing map with room numbers, sizes, and rent bands"
      >
        <defs>
          <filter id="leaseMapShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#000000" flood-opacity="0.28" />
          </filter>
        </defs>
        <rect class="lease-map-floor" x="22" y="22" width="1356" height="856" rx="30" />
        <path
          class="lease-map-corridor"
          d="M165 182 H1220 V742 H1020 V790 H260 V742 H165 Z"
        />
        <rect class="lease-map-core" x="505" y="360" width="310" height="250" rx="18" />
        <rect class="lease-map-amenity amenity-training" x="318" y="348" width="205" height="210" rx="14" />
        <rect class="lease-map-amenity amenity-lounge" x="535" y="642" width="345" height="110" rx="16" />
        <rect class="lease-map-amenity amenity-cowork" x="900" y="585" width="260" height="154" rx="16" />
        <text class="lease-map-amenity-label" x="420" y="445">TRAINING CENTER</text>
        <text class="lease-map-amenity-label" x="708" y="700">RECEPTION / LOUNGE</text>
        <text class="lease-map-amenity-label" x="1030" y="665">OPEN CO-WORK</text>
        ${mapRooms.map((room) => renderLeaseMapRoom(room, leadCapture)).join("")}
      </svg>
      <details class="lease-map-source-reference">
        <summary>Source photo reference</summary>
        <figure class="lease-map-frame">
          <img src="${escapeHtml(page.map.src)}" alt="${escapeHtml(page.map.alt)}" loading="lazy" decoding="async" />
          <figcaption>${escapeHtml(page.map.caption)}</figcaption>
        </figure>
      </details>
    </div>
  `
}

function buildLeaseMapRooms(pricedRooms) {
  const rooms = [
    ["733", 142, 68, 86, 94],
    ["732", 234, 68, 76, 94],
    ["731", 316, 68, 76, 94],
    ["730", 398, 68, 76, 94],
    ["729", 480, 68, 76, 94],
    ["727", 562, 68, 76, 94],
    ["723", 644, 68, 76, 94],
    ["722", 726, 68, 76, 94],
    ["721", 808, 68, 76, 94],
    ["720", 890, 68, 76, 94],
    ["719", 972, 68, 76, 94],
    ["714", 1054, 68, 108, 94, { type: "Dedicated co-work" }],
    ["713", 1170, 68, 88, 94],
    ["738", 76, 204, 86, 82],
    ["739", 76, 292, 86, 82],
    ["740", 76, 380, 86, 82],
    ["741", 76, 468, 86, 82],
    ["742", 76, 556, 86, 82],
    ["743", 76, 644, 86, 92],
    ["746", 272, 785, 76, 78],
    ["745", 354, 785, 76, 78, { rent: "Crossed out", status: "Crossed out", disabled: true, squareFeet: "230" }],
    ["746A", 436, 785, 88, 78, { rent: "Confirm", status: "Needs rent", squareFeet: "288" }],
    ["747A", 530, 785, 76, 78, { rent: "Confirm", status: "Needs rent", squareFeet: "119" }],
    ["747B", 612, 785, 76, 78, { rent: "Confirm", status: "Needs rent", squareFeet: "115" }],
    ["747", 694, 785, 80, 78, { rent: "Confirm", status: "Needs rent", squareFeet: "177" }],
    ["734", 245, 247, 88, 76],
    ["735", 245, 329, 88, 74],
    ["736", 245, 409, 88, 74],
    ["737", 245, 489, 88, 74],
    ["BY07", 360, 250, 132, 126, { rent: "Confirm", status: "Open co-work", squareFeet: "370", type: "Open co-work" }],
    ["728", 566, 276, 70, 82, { rent: "Confirm", status: "Needs rent", squareFeet: "127" }],
    ["728A", 642, 276, 70, 82, { rent: "Confirm", status: "Needs rent", squareFeet: "125" }],
    ["725", 718, 276, 70, 82, { rent: "Crossed out", status: "Crossed out", disabled: true, squareFeet: "26" }],
    ["726", 794, 276, 70, 82, { rent: "Confirm", status: "Needs rent", squareFeet: "157" }],
    ["BY04", 930, 252, 112, 78, { rent: "Confirm", status: "Meeting room", squareFeet: "151", type: "Meeting room" }],
    ["BY06", 1054, 252, 104, 78, { rent: "Confirm", status: "Open co-work", squareFeet: "143", type: "Open co-work" }],
    ["717", 926, 370, 84, 82],
    ["715", 1024, 370, 84, 82],
    ["716", 1024, 462, 84, 82],
    ["709", 1168, 500, 84, 82, { rent: "Confirm", status: "Needs rent", squareFeet: "113" }],
    ["711", 1232, 206, 86, 82],
    ["710", 1232, 294, 86, 82],
    ["708", 1232, 382, 86, 82],
    ["707", 1232, 470, 86, 82],
    ["706", 1232, 558, 86, 82],
    ["705", 1232, 646, 86, 82],
    ["704", 1232, 734, 86, 82],
    ["703", 1212, 814, 106, 52],
    ["701", 914, 790, 94, 76],
    ["702", 1096, 790, 96, 76, { rent: "Confirm", status: "Needs rent", squareFeet: "249" }],
  ]

  return rooms.map(([room, x, y, width, height, fallback = {}]) => {
    const priced = pricedRooms.get(room)
    return {
      room,
      x,
      y,
      width,
      height,
      squareFeet: priced?.squareFeet || fallback.squareFeet || "",
      rent: priced?.rent || fallback.rent || "Confirm",
      type: priced?.type || fallback.type || "Private office",
      status: priced?.status || fallback.status || "Needs confirmation",
      disabled: Boolean(fallback.disabled),
    }
  })
}

function renderLeaseMapRoom(room) {
  const rentClass = getLeaseMapRentClass(room.rent, room.disabled)
  const canOpenGallery = !room.disabled && /^\d/.test(room.room)
  const dataAttribute = canOpenGallery ? ` data-lease-gallery-room="${escapeHtml(room.room)}"` : ""
  const tabIndex = canOpenGallery ? ' tabindex="0" role="button"' : ""
  const label = room.rent === "Confirm" ? "Confirm" : room.rent
  const roomLabel = room.room.startsWith("BY") ? room.room : `Room ${room.room}`
  const ariaLabel = `${roomLabel}, ${room.squareFeet ? `${room.squareFeet} square feet, ` : ""}${label}`
  const compact = room.width < 82 || room.height < 72

  return `
    <g
      class="lease-map-room ${rentClass}${room.disabled ? " is-disabled" : ""}"
      aria-label="${escapeHtml(ariaLabel)}"
      ${dataAttribute}
      ${tabIndex}
    >
      <rect x="${room.x}" y="${room.y}" width="${room.width}" height="${room.height}" rx="10" />
      <text class="lease-map-room-number" x="${room.x + room.width / 2}" y="${room.y + (compact ? 27 : 29)}">${escapeHtml(room.room)}</text>
      ${
        room.squareFeet
          ? `<text class="lease-map-room-sf" x="${room.x + room.width / 2}" y="${room.y + (compact ? 45 : 50)}">${escapeHtml(room.squareFeet)} SF</text>`
          : ""
      }
      <text class="lease-map-room-rent" x="${room.x + room.width / 2}" y="${room.y + room.height - 13}">${escapeHtml(label)}</text>
      ${room.disabled ? `<line class="lease-map-room-cross" x1="${room.x + 10}" y1="${room.y + 10}" x2="${room.x + room.width - 10}" y2="${room.y + room.height - 10}" />` : ""}
    </g>
  `
}

function getLeaseMapRentClass(rent, disabled = false) {
  if (disabled || rent === "Crossed out") {
    return "rent-disabled"
  }
  if (rent === "$300/mo" || rent === "$300/月") {
    return "rent-300"
  }
  if (rent === "$399/mo" || rent === "$399/月") {
    return "rent-399"
  }
  if (rent === "$499/mo" || rent === "$499/月") {
    return "rent-499"
  }
  if (rent === "$599/mo" || rent === "$599/月") {
    return "rent-599"
  }
  if (rent === "$250/desk") {
    return "rent-cowork"
  }
  return "rent-confirm"
}

function renderLeaseRoomCard(room, leadCapture) {
  return `
    <article class="lease-room-card">
      <div class="lease-room-card-topline">
        <span>${escapeHtml(room.type)}</span>
        <strong>${escapeHtml(room.rent)}</strong>
      </div>
      <h3>${escapeHtml(room.room)}</h3>
      <p>${escapeHtml(room.squareFeet)} SF · ${escapeHtml(room.status)}</p>
      <div class="lease-room-card-actions">
        <button class="button button-secondary" type="button" data-lease-gallery-room="${escapeHtml(room.room)}">
          ${escapeHtml(leadCapture.galleryOpenLabel)}
        </button>
        <button class="button button-primary" type="button" data-lease-inquiry-room="${escapeHtml(room.room)}">
          ${escapeHtml(leadCapture.inquiryOpenLabel)}
        </button>
      </div>
    </article>
  `
}

function renderLeaseRoomModal(page, leadCapture) {
  const room = getLeaseRoomById(leaseInquiryState.activeRoom)
  if (!room) {
    return ""
  }

  const isInquiry = leaseInquiryState.mode === "inquiry"
  const title = isInquiry
    ? `${leadCapture.inquiryHeadingPrefix} ${room.room}`
    : `${room.room} · ${room.rent}`

  return `
    <div class="lease-modal-backdrop" data-lease-modal-close>
      <section
        class="lease-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lease-modal-title"
        data-lease-modal
      >
        <div class="lease-modal-header">
          <div>
            <span class="eyebrow">${escapeHtml(room.type)}</span>
            <h2 id="lease-modal-title">${escapeHtml(title)}</h2>
            <p>${escapeHtml(room.squareFeet)} SF · ${escapeHtml(room.status)}</p>
          </div>
          <button class="button button-secondary" type="button" data-lease-modal-close>
            ${escapeHtml(leadCapture.galleryCloseLabel)}
          </button>
        </div>
        <div class="lease-modal-tabs" role="tablist" aria-label="Room actions">
          <button
            class="lease-modal-tab${isInquiry ? "" : " is-active"}"
            type="button"
            data-lease-modal-mode="gallery"
          >
            ${escapeHtml(leadCapture.galleryTabLabel)}
          </button>
          <button
            class="lease-modal-tab${isInquiry ? " is-active" : ""}"
            type="button"
            data-lease-modal-mode="inquiry"
          >
            ${escapeHtml(leadCapture.inquiryTabLabel)}
          </button>
        </div>
        ${isInquiry ? renderLeaseInquiryPanel(room, leadCapture) : renderLeaseGalleryPanel(room, page, leadCapture)}
      </section>
    </div>
  `
}

function renderLeaseGalleryPanel(room, page, leadCapture) {
  const roomPhotos = Array.isArray(room.photos) ? room.photos : []
  const representativePhotos = Array.isArray(page.galleryPhotos) ? page.galleryPhotos : []
  const photos = roomPhotos.length ? roomPhotos : representativePhotos
  const isRepresentativeGallery = !roomPhotos.length && representativePhotos.length

  if (photos.length) {
    return `
      ${
        isRepresentativeGallery
          ? `
            <div class="lease-gallery-note">
              <h3>${escapeHtml(leadCapture.galleryRepresentativeTitle)}</h3>
              <p>${escapeHtml(leadCapture.galleryRepresentativeText)}</p>
            </div>
          `
          : ""
      }
      <div class="lease-gallery-grid">
        ${photos
          .map(
            (photo) => `
              <figure class="lease-gallery-photo">
                <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt || `Room ${room.room}`)}" loading="lazy" decoding="async" />
                ${photo.caption ? `<figcaption>${escapeHtml(photo.caption)}</figcaption>` : ""}
              </figure>
            `,
          )
          .join("")}
      </div>
    `
  }

  return `
    <div class="lease-gallery-empty">
      <figure>
        <img src="${escapeHtml(page.map.src)}" alt="${escapeHtml(page.map.alt)}" loading="lazy" decoding="async" />
        <figcaption>${escapeHtml(leadCapture.galleryMapLabel)}</figcaption>
      </figure>
      <div>
        <h3>${escapeHtml(leadCapture.galleryEmptyTitle)}</h3>
        <p>${escapeHtml(leadCapture.galleryEmptyText)}</p>
      </div>
    </div>
  `
}

function renderLeaseInquiryPanel(room, leadCapture) {
  if (leaseInquiryState.inquiryResult) {
    return renderLeaseInquirySuccess(room, leadCapture)
  }

  return `
    <form class="intake-form lease-inquiry-form" data-lease-inquiry-form data-room="${escapeHtml(room.room)}">
      <p>${escapeHtml(leadCapture.inquiryText)}</p>
      <div class="form-grid">
        <label>
          <span>${escapeHtml(leadCapture.fields.name)}</span>
          <input name="name" type="text" required />
        </label>
        <label>
          <span>${escapeHtml(leadCapture.fields.email)}</span>
          <input name="email" type="email" required />
        </label>
        <label>
          <span>${escapeHtml(leadCapture.fields.phone)}</span>
          <input name="phone" type="tel" />
        </label>
        <label>
          <span>${escapeHtml(leadCapture.fields.timeline)}</span>
          <select name="timeline">
            ${leadCapture.timelineOptions
              .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
              .join("")}
          </select>
        </label>
        <label class="span-2">
          <span>${escapeHtml(leadCapture.fields.notes)}</span>
          <textarea name="notes" rows="4"></textarea>
        </label>
      </div>
      <div class="form-actions">
        <button class="button button-primary" type="submit">${escapeHtml(leadCapture.submitLabel)}</button>
        <a class="button button-secondary" href="${escapeHtml(buildLeaseMailtoHref(room, leadCapture))}">
          ${escapeHtml(leadCapture.fallbackLabel)}
        </a>
        <p>${escapeHtml(leadCapture.helper)}</p>
      </div>
      <p class="evaluation-form-error" data-lease-inquiry-error>
        ${escapeHtml(leaseInquiryState.inquiryError)}
      </p>
    </form>
  `
}

function renderLeaseInquirySuccess(room, leadCapture) {
  const result = leaseInquiryState.inquiryResult || {}
  return `
    <article class="card lease-inquiry-success-card">
      <div class="card-topline">
        <span class="badge">${escapeHtml(leadCapture.successTitle)}</span>
        ${result.request_id ? `<span class="card-highlight">${escapeHtml(result.request_id)}</span>` : ""}
      </div>
      <h3>${escapeHtml(room.room)} · ${escapeHtml(room.rent)}</h3>
      <p>${escapeHtml(leadCapture.successText)}</p>
      <ul class="detail-list evaluation-detail-list">
        ${result.recipient ? `<li>Recipient: ${escapeHtml(result.recipient)}</li>` : ""}
        ${result.crm_status ? `<li>CRM: ${escapeHtml(result.crm_status)}</li>` : ""}
      </ul>
      <div class="form-actions">
        <button class="button button-secondary" type="button" data-lease-inquiry-reset>
          ${escapeHtml(leadCapture.resetLabel)}
        </button>
        <a class="button button-secondary" href="${escapeHtml(buildLeaseMailtoHref(room, leadCapture))}">
          ${escapeHtml(leadCapture.fallbackLabel)}
        </a>
      </div>
    </article>
  `
}

function openLeaseRoomModal(roomId, mode) {
  const room = getLeaseRoomById(roomId)
  if (!room) {
    return
  }

  leaseInquiryState.activeRoom = room.room
  leaseInquiryState.mode = mode || "gallery"
  leaseInquiryState.inquiryError = ""
  leaseInquiryState.inquiryResult = null
  render()
}

function closeLeaseRoomModal() {
  leaseInquiryState.activeRoom = ""
  leaseInquiryState.mode = "gallery"
  leaseInquiryState.inquiryError = ""
  leaseInquiryState.inquiryResult = null
  render()
}

function getLeaseRoomById(roomId) {
  const rooms = state.data?.shortTermLease?.page?.rooms || []
  return rooms.find((room) => room.room === String(roomId || ""))
}

function getLeaseLeadCapture() {
  return state.data?.shortTermLease?.leadCapture || {}
}

function buildLeaseMailtoHref(room, leadCapture = getLeaseLeadCapture()) {
  const recipient = leadCapture.recipientEmail || "jessica@lecrownproperties.com"
  const subject = encodeURIComponent(`Suite 700 Room ${room.room} inquiry`)
  const body = encodeURIComponent(
    [
      `Room: ${room.room}`,
      `Square feet: ${room.squareFeet}`,
      `Rent: ${room.rent}`,
      `Type: ${room.type}`,
      `Page: ${window.location.href}`,
      "",
      "Name:",
      "Email:",
      "Phone:",
      "Move-in timing:",
      "Notes:",
    ].join("\n"),
  )
  return `mailto:${recipient}?subject=${subject}&body=${body}`
}

function buildLeaseInquiryPayload(form) {
  const room = getLeaseRoomById(form.dataset.room)
  const formData = new FormData(form)
  const leadCapture = getLeaseLeadCapture()
  const roomPhotos = Array.isArray(room?.photos) ? room.photos : []
  const representativePhotos = Array.isArray(state.data?.shortTermLease?.page?.galleryPhotos)
    ? state.data.shortTermLease.page.galleryPhotos
    : []
  const photos = roomPhotos.length ? roomPhotos : representativePhotos

  return {
    source: leadCapture.source || "suite_700_short_term_office",
    crm: {
      target: leadCapture.crmTarget || "espcrm",
      status: "pending_integration",
    },
    recipient: {
      email: leadCapture.recipientEmail || "jessica@lecrownproperties.com",
      name: "Jessica",
    },
    room: {
      room: room?.room || "",
      square_feet: room?.squareFeet || "",
      rent: room?.rent || "",
      type: room?.type || "",
      status: room?.status || "",
      photo_count: photos.length,
      photo_scope: roomPhotos.length ? "room_specific" : photos.length ? "representative_suite_700" : "map_only",
    },
    contact: {
      name: formData.get("name")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
    },
    leasing: {
      timeline: formData.get("timeline")?.toString().trim() || "",
      notes: formData.get("notes")?.toString().trim() || "",
    },
    page: {
      path: window.location.pathname,
      referrer: document.referrer || "",
      url: window.location.href,
    },
  }
}

async function submitLeaseInquiry(form) {
  const leadCapture = getLeaseLeadCapture()
  const submitButton = form.querySelector('button[type="submit"]')
  const errorNode = form.querySelector("[data-lease-inquiry-error]")

  leaseInquiryState.inquiryError = ""
  if (errorNode) {
    errorNode.textContent = ""
  }
  if (submitButton) {
    submitButton.disabled = true
    submitButton.textContent = leadCapture.submittingLabel || "Sending..."
  }

  try {
    const endpoint = leadCapture.endpoint || LEASE_INQUIRY_PATH
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(buildLeaseInquiryPayload(form)),
    })

    const body = await response.json()
    if (!response.ok) {
      throw new Error(body.message || `lease inquiry status ${response.status}`)
    }

    leaseInquiryState.inquiryError = ""
    leaseInquiryState.inquiryResult = body
    render()
  } catch (error) {
    leaseInquiryState.inquiryError =
      error?.message || leadCapture.errorFallback || "The lease inquiry could not be submitted."
    if (errorNode) {
      errorNode.textContent = leaseInquiryState.inquiryError
    }
    if (submitButton) {
      submitButton.disabled = false
      submitButton.textContent = leadCapture.submitLabel || "Send inquiry"
    }
  }
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
    ${renderHero(page.hero, { hrefFor, variant: "compact" })}

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
        evaluation?.summary || "Choose a parcel and run the screen to load a live data center fit signal.",
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
  const actionCopy = getPreviewActionCopy()
  const markets = getPropertyEvaluationMarketOptions()

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
            ${markets
              .map(
                (option) =>
                  `<option value="${escapeHtml(option.slug)}"${option.slug === market ? " selected" : ""}>${escapeHtml(option.name || formatPreviewOptionLabel(option.slug))}</option>`,
              )
              .join("")}
          </select>
        </label>
      </div>
      <input name="mode" type="hidden" value="${escapeHtml(mode)}" />
      <div class="form-actions">
        <button class="button button-primary" type="submit" data-preview-submit-label>
          ${escapeHtml(actionCopy.submitLabel)}
        </button>
        <button class="button button-secondary" type="button" data-preview-demo data-preview-demo-label>
          ${escapeHtml(actionCopy.demoLabel)}
        </button>
        <p data-preview-helper>${escapeHtml(actionCopy.helper)}</p>
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
      <span class="card-highlight">Public screen</span>
    </div>
    <div class="pill-cloud evaluation-pill-cloud">
      <span class="pill">${escapeHtml(parcelId)}</span>
      <span class="pill">${escapeHtml(formatPropertyEvaluationMarketLabel(market))}</span>
      <span class="pill">${escapeHtml(formatPreviewOptionLabel(mode))}</span>
    </div>
    <p class="evaluation-summary-copy">
      The public screen shows the parcel, market, data center fit, and the first reasons.
      Paid follow-up adds scoring, blockers, and next diligence steps.
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
  const leaseGalleryButton = event.target.closest("[data-lease-gallery-room]")
  if (leaseGalleryButton) {
    openLeaseRoomModal(leaseGalleryButton.dataset.leaseGalleryRoom, "gallery")
    return
  }

  const leaseInquiryButton = event.target.closest("[data-lease-inquiry-room]")
  if (leaseInquiryButton) {
    openLeaseRoomModal(leaseInquiryButton.dataset.leaseInquiryRoom, "inquiry")
    return
  }

  const leaseModeButton = event.target.closest("[data-lease-modal-mode]")
  if (leaseModeButton) {
    leaseInquiryState.mode = leaseModeButton.dataset.leaseModalMode || "gallery"
    leaseInquiryState.inquiryError = ""
    leaseInquiryState.inquiryResult = null
    render()
    return
  }

  const leaseResetButton = event.target.closest("[data-lease-inquiry-reset]")
  if (leaseResetButton) {
    leaseInquiryState.inquiryError = ""
    leaseInquiryState.inquiryResult = null
    render()
    return
  }

  const leaseCloseTarget = event.target.closest("[data-lease-modal-close]")
  if (leaseCloseTarget && !event.target.closest("[data-lease-modal]")) {
    closeLeaseRoomModal()
    return
  }

  const leaseCloseButton = event.target.closest("button[data-lease-modal-close]")
  if (leaseCloseButton) {
    closeLeaseRoomModal()
    return
  }

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

function handleKeydown(event) {
  if (event.key === "Escape" && leaseInquiryState.activeRoom) {
    closeLeaseRoomModal()
    return
  }

  if (event.key !== "Enter" && event.key !== " ") {
    return
  }

  const leaseGalleryButton = event.target.closest?.("[data-lease-gallery-room]")
  if (!leaseGalleryButton) {
    return
  }

  event.preventDefault()
  openLeaseRoomModal(leaseGalleryButton.dataset.leaseGalleryRoom, "gallery")
}

async function handleSubmit(event) {
  const leaseInquiryForm = event.target.closest("[data-lease-inquiry-form]")
  if (leaseInquiryForm) {
    event.preventDefault()
    await submitLeaseInquiry(leaseInquiryForm)
    return
  }

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
  if (propertyEvaluationPreviewState.request) {
    return
  }

  const request = clonePreviewValue(PROPERTY_EVALUATION_PREVIEW.demoRequest)
  propertyEvaluationPreviewState.request = request
  propertyEvaluationPreviewState.response = null
  propertyEvaluationPreviewState.sourceLabel = "Awaiting screen"
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
  const previewForm = document.querySelector("[data-property-evaluation-form]")

  try {
    const response = await fetch("/health", { headers: { Accept: "application/json" } })
    if (!response.ok) {
      throw new Error(`health status ${response.status}`)
    }

    const payload = await response.json()
    propertyEvaluationPreviewState.liveConfigured = Boolean(payload.gridscope_configured)
    if (propertyEvaluationPreviewState.liveConfigured) {
      await refreshPropertyEvaluationMarkets()
      propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.liveReadyStatus
      propertyEvaluationPreviewState.statusTone = "live"
      syncPropertyEvaluationPreviewDom()
      if (previewForm) {
        await runPropertyEvaluationPreview(previewForm)
        return
      }
    } else {
      propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.demoFallbackStatus
      propertyEvaluationPreviewState.statusTone = "demo"
      propertyEvaluationPreviewState.response = createDemoEvaluationResponse(
        propertyEvaluationPreviewState.request,
      )
      propertyEvaluationPreviewState.sourceLabel = "Example result"
    }
  } catch (error) {
    propertyEvaluationPreviewState.liveConfigured = false
    propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.demoFallbackStatus
    propertyEvaluationPreviewState.statusTone = "demo"
    propertyEvaluationPreviewState.response = createDemoEvaluationResponse(
      propertyEvaluationPreviewState.request,
    )
    propertyEvaluationPreviewState.sourceLabel = "Example result"
  }

  syncPropertyEvaluationPreviewDom()
}

async function runPropertyEvaluationPreview(form) {
  const request = buildPropertyEvaluationRequest(form)
  propertyEvaluationPreviewState.request = request
  propertyEvaluationPreviewState.previewRunning = true
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
      propertyEvaluationPreviewState.sourceLabel = "Live result"
      propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.liveSuccessStatus
      propertyEvaluationPreviewState.statusTone = "live"
      propertyEvaluationPreviewState.previewRunning = false
      syncPropertyEvaluationPreviewDom()
      return
    } catch (error) {
      propertyEvaluationPreviewState.response = createDemoEvaluationResponse(request)
      propertyEvaluationPreviewState.sourceLabel = "Example result"
      propertyEvaluationPreviewState.statusMessage = `${PROPERTY_EVALUATION_PREVIEW.liveErrorStatus} ${error.message}`
      propertyEvaluationPreviewState.statusTone = "error"
      propertyEvaluationPreviewState.previewRunning = false
      syncPropertyEvaluationPreviewDom()
      return
    }
  }

  propertyEvaluationPreviewState.response = createDemoEvaluationResponse(request)
  propertyEvaluationPreviewState.sourceLabel = "Example result"
  propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.demoStatus
  propertyEvaluationPreviewState.statusTone = "demo"
  propertyEvaluationPreviewState.previewRunning = false
  syncPropertyEvaluationPreviewDom()
}

async function loadDemoPropertyEvaluationPreview(form) {
  const request = getNextDemoScenarioRequest()
  applyPropertyEvaluationRequestToForm(form, request)
  propertyEvaluationPreviewState.request = request
  resetPropertyEvaluationInquiry({
    preserveUnlock: propertyEvaluationPreviewState.detailUnlocked,
  })

  if (propertyEvaluationPreviewState.liveConfigured) {
    propertyEvaluationPreviewState.response = null
    propertyEvaluationPreviewState.sourceLabel = "Loading live result"
    syncPropertyEvaluationPreviewDom()
    await runPropertyEvaluationPreview(form)
    return
  }

  propertyEvaluationPreviewState.response = createDemoEvaluationResponse(request)
  propertyEvaluationPreviewState.sourceLabel = "Example result"
  propertyEvaluationPreviewState.statusMessage = PROPERTY_EVALUATION_PREVIEW.demoStatus
  propertyEvaluationPreviewState.statusTone = "demo"
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
  const marketLabel = formatPropertyEvaluationMarketLabel(market)
  const modeLabel = formatPreviewOptionLabel(mode)
  const seed = hashPreviewSeed(`${parcelId}:${market}:${mode}`)
  const county = PROPERTY_EVALUATION_MARKET_COUNTIES[market] || ""
  const baseScore = {
    data_center: 0.79,
    industrial_flex: 0.69,
    battery_storage: 0.74,
  }[mode] || 0.7
  const score = clampPreviewNumber(
    baseScore + ((seed % 19) - 9) * 0.012,
    0.52,
    0.9,
  )
  const acreage = Math.round((18 + (seed % 68) * 0.8) * 10) / 10
  const frontageFt = 420 + (seed % 1180)
  const verdict =
    score >= 0.82
      ? "Strong shortlist candidate"
      : score >= 0.66
        ? "Viable with diligence"
        : "Needs a narrower search"
  const summary =
    score >= 0.82
      ? `This ${modeLabel.toLowerCase()} screen looks strong for an initial pass in ${marketLabel}.`
      : score >= 0.66
        ? `This parcel could work for ${modeLabel.toLowerCase()}, but utilities and entitlement still need confirmation.`
        : `This parcel is only a weak ${modeLabel.toLowerCase()} fit on the current screen.`
  const strengths = [
    `${marketLabel} keeps the parcel inside the current search area.`,
    `${formatPreviewAcreage(acreage)} is workable for an early ${modeLabel.toLowerCase()} screen.`,
    "Road access and parcel shape look usable at first pass.",
  ]
  const constraints = [
    "Utility availability still needs live confirmation.",
    "Zoning and entitlement need municipality-level review.",
    "Floodplain, drainage, and easements still need parcel-specific diligence.",
  ]
  const nextSteps = [
    "Confirm utility and interconnection constraints.",
    "Check zoning, access, and any easements.",
    "Decide whether this parcel merits a paid evaluation.",
  ]

  return {
    normalized_parcel: {
      locator: {
        parcel_id: parcelId,
      },
      market,
      county,
      acreage,
      frontage_ft: frontageFt,
    },
    shared_facts: {
      market,
      county,
      power_readiness:
        mode === "data_center"
          ? "Grid and substation position still need live utility confirmation"
          : "Utility capacity still needs a live site-specific check",
      highway_access:
        market === "tx-houston-1h"
          ? "Houston-area road access looks workable for first-pass screening"
          : "Regional highway access looks workable for first-pass screening",
      fiber_access:
        mode === "data_center"
          ? "Carrier route still needs live confirmation for data-center use"
          : "Telecom routing is a secondary check on this use case",
      floodplain: "Floodplain and drainage still need parcel-specific review",
      entitlement_path: "Local zoning and entitlement path still need confirmation",
    },
    mode_evaluations: [
      {
        mode,
        score,
        verdict,
        summary,
        strengths,
        constraints,
        next_steps: nextSteps,
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
        ? "Live mode"
        : "Example mode"
  sourceBadgeNode.textContent = propertyEvaluationPreviewState.sourceLabel

  const statusNode = document.querySelector("[data-preview-status]")

  syncPropertyEvaluationFormUi()
  applyEvaluationTone(healthBadgeNode, propertyEvaluationPreviewState.statusTone)
  if (statusNode) {
    applyEvaluationTone(statusNode, propertyEvaluationPreviewState.statusTone)
  }
}

function renderPropertyEvaluationHighlights(response) {
  const request = propertyEvaluationPreviewState.request || {}
  const parcel = response?.normalized_parcel || {}
  const sharedFacts = response?.shared_facts || {}
  const firstMode = getLeadModeEvaluation(response)
  const highlights = [
    {
      label: "Parcel ID",
      value: pickPreviewValue(
        parcel?.locator?.parcel_id,
        parcel.parcel_id,
        request?.parcel?.locator?.parcel_id,
      ),
    },
    {
      label: "Market",
      value: formatPropertyEvaluationMarketLabel(
        pickPreviewValue(parcel.market, sharedFacts.market, request?.parcel?.market),
      ),
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
      label: "Use case",
      value: firstMode
        ? formatPreviewOptionLabel(firstMode.mode)
        : request?.modes?.[0]
          ? formatPreviewOptionLabel(request.modes[0])
          : null,
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
      : `<span class="pill">${propertyEvaluationPreviewState.liveConfigured ? "Live runtime" : "Example fallback"}</span>`,
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

function getPreviewActionCopy() {
  const labels = PROPERTY_EVALUATION_PREVIEW.actionLabels

  if (propertyEvaluationPreviewState.previewRunning) {
    return {
      submitLabel: propertyEvaluationPreviewState.liveConfigured
        ? labels.liveRunning
        : labels.demoRunning,
      demoLabel:
        propertyEvaluationPreviewState.liveConfigured === false
          ? labels.demoSecondary
          : labels.liveSecondary,
      helper:
        propertyEvaluationPreviewState.liveConfigured === false
          ? labels.demoHelper
          : propertyEvaluationPreviewState.liveConfigured
            ? labels.liveHelper
            : labels.checkingHelper,
    }
  }

  if (propertyEvaluationPreviewState.liveConfigured === true) {
    return {
      submitLabel: labels.livePrimary,
      demoLabel: labels.liveSecondary,
      helper: labels.liveHelper,
    }
  }

  if (propertyEvaluationPreviewState.liveConfigured === false) {
    return {
      submitLabel: labels.demoPrimary,
      demoLabel: labels.demoSecondary,
      helper: labels.demoHelper,
    }
  }

  return {
    submitLabel: labels.checkingPrimary,
    demoLabel: labels.liveSecondary,
    helper: labels.checkingHelper,
  }
}

function syncPropertyEvaluationFormUi() {
  const form = document.querySelector("[data-property-evaluation-form]")
  if (!form) {
    return
  }

  const actionCopy = getPreviewActionCopy()
  const submitButton = form.querySelector("[data-preview-submit-label]")
  const demoButton = form.querySelector("[data-preview-demo-label]")
  const helperNode = form.querySelector("[data-preview-helper]")

  if (submitButton) {
    submitButton.textContent = actionCopy.submitLabel
    submitButton.disabled = propertyEvaluationPreviewState.previewRunning
  }

  if (demoButton) {
    demoButton.textContent = actionCopy.demoLabel
    demoButton.disabled = propertyEvaluationPreviewState.previewRunning
  }

  if (helperNode) {
    helperNode.textContent = actionCopy.helper
  }
}

function getNextDemoScenarioRequest() {
  const nextIndex =
    (propertyEvaluationPreviewState.demoScenarioIndex + 1) %
    PROPERTY_EVALUATION_PREVIEW.demoScenarios.length
  propertyEvaluationPreviewState.demoScenarioIndex = nextIndex
  return clonePreviewValue(PROPERTY_EVALUATION_PREVIEW.demoScenarios[nextIndex])
}

function applyPropertyEvaluationRequestToForm(form, request) {
  if (!form) {
    return
  }

  const parcelId = request?.parcel?.locator?.parcel_id || ""
  const market = request?.parcel?.market || ""
  const mode = request?.modes?.[0] || ""

  if (form.elements.parcel_id) {
    form.elements.parcel_id.value = parcelId
  }
  if (form.elements.market) {
    form.elements.market.value = market
  }
  if (form.elements.mode) {
    form.elements.mode.value = mode
  }
}

function getPropertyEvaluationMarketOptions() {
  if (
    Array.isArray(propertyEvaluationPreviewState.marketCatalog) &&
    propertyEvaluationPreviewState.marketCatalog.length
  ) {
    return propertyEvaluationPreviewState.marketCatalog
  }

  return PROPERTY_EVALUATION_SUPPORTED_MARKETS
}

function findPropertyEvaluationMarket(slug) {
  return getPropertyEvaluationMarketOptions().find((item) => item.slug === slug)
}

function formatPropertyEvaluationMarketLabel(value) {
  const market = findPropertyEvaluationMarket(value)
  return market?.name || formatPreviewOptionLabel(value)
}

async function refreshPropertyEvaluationMarkets() {
  try {
    const response = await fetch(PROPERTY_EVALUATION_MARKETS_PATH, {
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error(`markets status ${response.status}`)
    }

    const payload = await response.json()
    const markets = Array.isArray(payload?.markets)
      ? payload.markets
          .filter(
            (item) =>
              item &&
              typeof item.slug === "string" &&
              PROPERTY_EVALUATION_SUPPORTED_MARKET_SLUGS.has(item.slug),
          )
          .map((item) => ({
            slug: item.slug,
            name: item.name || formatPreviewOptionLabel(item.slug),
            summary: item.summary || "",
            is_default: Boolean(item.is_default),
          }))
      : []

    propertyEvaluationPreviewState.marketCatalog = markets.length
      ? markets
      : clonePreviewValue(PROPERTY_EVALUATION_SUPPORTED_MARKETS)
  } catch (error) {
    propertyEvaluationPreviewState.marketCatalog = clonePreviewValue(
      PROPERTY_EVALUATION_SUPPORTED_MARKETS,
    )
  }

  syncPropertyEvaluationMarketOptions()
}

function syncPropertyEvaluationMarketOptions() {
  const form = document.querySelector("[data-property-evaluation-form]")
  const marketField = form?.elements?.market
  if (!marketField) {
    return
  }

  const markets = getPropertyEvaluationMarketOptions()
  const selectedMarket =
    propertyEvaluationPreviewState.request?.parcel?.market ||
    PROPERTY_EVALUATION_PREVIEW.demoRequest.parcel.market

  marketField.innerHTML = markets
    .map(
      (option) =>
        `<option value="${escapeHtml(option.slug)}"${option.slug === selectedMarket ? " selected" : ""}>${escapeHtml(option.name || formatPreviewOptionLabel(option.slug))}</option>`,
    )
    .join("")

  const nextMarket = markets.some((item) => item.slug === selectedMarket)
    ? selectedMarket
    : markets[0]?.slug || ""
  marketField.value = nextMarket
  if (propertyEvaluationPreviewState.request?.parcel) {
    propertyEvaluationPreviewState.request.parcel.market = nextMarket
  }
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
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase()
      if (lower === "tx") {
        return "TX"
      }
      if (lower === "dfw") {
        return "DFW"
      }
      return part[0].toUpperCase() + part.slice(1)
    })
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

function clampPreviewNumber(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function hashPreviewSeed(value) {
  return String(value)
    .split("")
    .reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 10000, 7)
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
