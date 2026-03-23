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
  "/clients",
  "/case-studies",
  "/insights",
  "/about",
  "/contact",
])

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
}

function renderPage(path) {
  switch (path) {
    case "/":
      return renderHomePage()
    case "/services":
      return renderServicesPage()
    case "/properties":
      return renderPropertiesPage()
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

function handleSubmit(event) {
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
