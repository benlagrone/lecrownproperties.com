export function renderHero(hero, { hrefFor }) {
  const visual = hero.visual
    ? `
        <figure class="hero-visual">
          <img
            src="${hero.visual.src}"
            alt="${hero.visual.alt}"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
          <figcaption class="hero-visual-copy">
            <span class="hero-visual-kicker">${hero.visual.kicker}</span>
            <strong>${hero.visual.title}</strong>
            <span>${hero.visual.text}</span>
          </figcaption>
        </figure>
      `
    : ""

  return `
    <section class="hero" data-reveal>
      <div class="hero-copy">
        <span class="eyebrow">${hero.eyebrow}</span>
        <h1>${hero.title}</h1>
        <p class="hero-summary">${hero.summary}</p>

        <div class="hero-actions">
          <a class="button button-primary" href="${hrefFor(hero.primaryCta.to)}" data-link>
            ${hero.primaryCta.label}
          </a>
          <a class="button button-secondary" href="${hrefFor(hero.secondaryCta.to)}" data-link>
            ${hero.secondaryCta.label}
          </a>
        </div>
      </div>

      <aside class="hero-side">
        ${visual}
        <div class="hero-brief-card">
          <div class="hero-brief-header">
            <div class="hero-mark-frame" aria-hidden="true">
              <img src="/assets/logo-mark.svg" alt="" />
            </div>
            <div>
              <span class="eyebrow">${hero.brief.eyebrow}</span>
              <h2>${hero.brief.title}</h2>
            </div>
          </div>
          <p>${hero.brief.text}</p>
          <ul class="detail-list">
            ${hero.brief.points.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>

        <div class="hero-metrics">
          ${hero.metrics
            .map(
              (metric) => `
                <article class="hero-metric">
                  <strong>${metric.value}</strong>
                  <span>${metric.label}</span>
                </article>
              `,
            )
            .join("")}
        </div>
      </aside>
    </section>
  `
}
