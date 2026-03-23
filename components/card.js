export function renderMetricCard(item) {
  return `
    <article class="metric-card">
      <strong>${item.value}</strong>
      <span>${item.label}</span>
    </article>
  `
}

export function renderServiceCard(service) {
  return `
    <article class="card service-card">
      <span class="badge">${service.badge}</span>
      <h3>${service.title}</h3>
      <p>${service.summary}</p>
      <ul class="detail-list">
        ${service.bullets.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <div class="card-footnote">${service.fit}</div>
    </article>
  `
}

export function renderPropertyCard(property) {
  const image = property.image
    ? `
        <div class="card-media">
          <img
            src="${property.image.src}"
            alt="${property.image.alt}"
            loading="lazy"
            decoding="async"
          />
        </div>
      `
    : ""

  return `
    <article class="card property-card">
      ${image}
      <div class="card-topline">
        <span class="badge">${property.category}</span>
        <span class="card-highlight">${property.focus}</span>
      </div>
      <h3>${property.title}</h3>
      <p>${property.summary}</p>
      <ul class="detail-list">
        ${property.details.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </article>
  `
}

export function renderClientCard(client) {
  return `
    <article class="card client-card">
      <span class="badge">${client.segment}</span>
      <h3>${client.title}</h3>
      <p>${client.summary}</p>
      <ul class="detail-list">
        ${client.needs.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <div class="card-footnote">${client.outcome}</div>
    </article>
  `
}

export function renderCaseStudyCard(study) {
  return `
    <article class="card case-study-card">
      <span class="badge">${study.label}</span>
      <h3>${study.title}</h3>
      <p>${study.challenge}</p>
      <div class="case-study-block">
        <h4>${study.approachLabel}</h4>
        <ul class="detail-list">
          ${study.approach.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <div class="card-footnote">${study.impact}</div>
    </article>
  `
}

export function renderInsightCard(post) {
  return `
    <article class="card insight-card">
      <div class="card-topline">
        <span class="badge">${post.category}</span>
        <span class="card-highlight">${post.readTime}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.summary}</p>
      <ul class="detail-list">
        ${post.takeaways.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <div class="card-footnote">${post.date}</div>
    </article>
  `
}

export function renderValueCard(item) {
  return `
    <article class="card value-card">
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `
}

export function renderStepCard(step, index) {
  return `
    <article class="step-card">
      <span class="step-index">0${index + 1}</span>
      <div>
        <h3>${step.title}</h3>
        <p>${step.text}</p>
      </div>
    </article>
  `
}

export function renderChannelCard(channel) {
  const value = channel.href
    ? `<a href="${channel.href}">${channel.value}</a>`
    : `<span>${channel.value}</span>`

  return `
    <article class="card channel-card">
      <span class="badge">${channel.badge}</span>
      <h3>${channel.title}</h3>
      <p>${channel.text}</p>
      <div class="card-footnote">${value}</div>
    </article>
  `
}

export function renderFaqItem(item) {
  return `
    <article class="faq-item">
      <h3>${item.question}</h3>
      <p>${item.answer}</p>
    </article>
  `
}
