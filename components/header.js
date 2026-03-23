export function renderHeader(site, { currentPath, currentLang, navOpen, hrefFor }) {
  return `
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand-lockup" href="${hrefFor("/")}" data-link aria-label="${site.brand.name}">
          <span class="brand-mark-shell">
            <img
              class="brand-mark"
              src="/assets/logo-mark.svg"
              alt="${site.brand.name} logo"
            />
          </span>
          <span class="brand-copy">
            <span class="brand-kicker">${site.brand.kicker}</span>
            <span class="brand-name">${site.brand.name}</span>
          </span>
        </a>

        <button
          class="nav-toggle"
          type="button"
          data-nav-toggle
          aria-expanded="${navOpen ? "true" : "false"}"
          aria-label="${site.labels.menu}"
        >
          <span></span>
          <span></span>
        </button>

        <div class="nav-group ${navOpen ? "is-open" : ""}">
          <nav class="nav-links" aria-label="Primary">
            ${site.navigation
              .map(
                (item) => `
                  <a
                    href="${hrefFor(item.to)}"
                    data-link
                    class="${currentPath === item.to ? "is-active" : ""}"
                  >
                    ${item.label}
                  </a>
                `,
              )
              .join("")}
          </nav>

          <div class="language-switch" role="group" aria-label="${site.languageToggleLabel}">
            ${site.languages
              .map(
                (language) => `
                  <button
                    type="button"
                    class="${currentLang === language.code ? "is-active" : ""}"
                    data-lang="${language.code}"
                  >
                    ${language.label}
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </header>
  `
}
