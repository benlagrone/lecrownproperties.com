FROM nginx:1.27-alpine

COPY nginx.container.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY app.js /usr/share/nginx/html/app.js
COPY styles.css /usr/share/nginx/html/styles.css
COPY assets /usr/share/nginx/html/assets
COPY components /usr/share/nginx/html/components
COPY data /usr/share/nginx/html/data

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
