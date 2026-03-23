export function renderFooter(site, { currentLang, hrefFor }) {
  return `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="eyebrow">${site.footer.eyebrow}</span>
          <h2>${site.footer.title}</h2>
          <p>${site.footer.text}</p>
          <a class="footer-email" href="mailto:${site.contact.email}">
            ${site.contact.email}
          </a>
        </div>

        <div class="footer-column">
          <h3>${site.footer.navigationTitle}</h3>
          <div class="footer-links">
            ${site.navigation
              .map(
                (item) => `
                  <a href="${hrefFor(item.to, currentLang)}" data-link>
                    ${item.label}
                  </a>
                `,
              )
              .join("")}
          </div>
        </div>

        <div class="footer-column">
          <h3>${site.footer.contactTitle}</h3>
          <ul class="detail-list">
            <li>${site.contact.location}</li>
            <li>${site.contact.wechat}</li>
            <li>${site.footer.supportNote}</li>
          </ul>
        </div>
      </div>

      <div class="footer-meta">
        <span>${site.footer.bottomLine}</span>
        <span>${site.footer.copyright}</span>
      </div>
    </footer>
  `
}
