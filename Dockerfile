# Static site on unprivileged nginx plus the booking mailer (Node), one image for both Compose services.
# Contract (CLAUDE.md): port 8080, GET /healthz, GET /version.txt (= APP_VERSION), non-root USER.
# The mailer runs as its own service from this image: node /app/mailer/server.mjs (docker-compose.yml).

FROM node:22-alpine AS mailer-deps
WORKDIR /app/mailer
COPY mailer/package.json mailer/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Photos uploaded through Pages CMS: turn upright, shrink to at most 1600 px, recompress and drop all metadata
# (camera data and GPS location). The repository keeps the originals; only these copies go live.
FROM alpine:3.22 AS photos
RUN apk add --no-cache imagemagick imagemagick-jpeg imagemagick-webp
COPY public/assets/images/uploads/ /uploads/
RUN find /uploads -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) \
      -exec magick mogrify -auto-orient -strip -resize '1600x1600>' -quality 80 {} +

FROM nginxinc/nginx-unprivileged:1.29-alpine
ARG APP_VERSION=dev
USER root
RUN apk add --no-cache nodejs
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/
COPY --from=photos /uploads/ /usr/share/nginx/html/assets/images/uploads/
COPY --from=mailer-deps /app/mailer/node_modules /app/mailer/node_modules
COPY mailer/package.json mailer/lib.mjs mailer/server.mjs /app/mailer/
RUN printf '%s' "$APP_VERSION" > /usr/share/nginx/html/version.txt
USER 101
