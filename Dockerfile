FROM python:3.12-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY server.py /app/server.py
COPY index.html /app/index.html
COPY app.js /app/app.js
COPY styles.css /app/styles.css
COPY assets /app/assets
COPY components /app/components
COPY data /app/data

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD python3 -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/health', timeout=2).read()"

CMD ["python3", "/app/server.py", "8080", "--host", "0.0.0.0"]
