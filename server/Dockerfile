# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies from deps stage
COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --chown=appuser:appgroup package.json ./

# Copy application source explicitly to avoid copying sensitive files
COPY --chown=appuser:appgroup server.js ./
COPY --chown=appuser:appgroup config ./config
COPY --chown=appuser:appgroup controllers ./controllers
COPY --chown=appuser:appgroup middleware ./middleware
COPY --chown=appuser:appgroup models ./models
COPY --chown=appuser:appgroup routes ./routes
COPY --chown=appuser:appgroup utils ./utils
COPY --chown=appuser:appgroup validators ./validators

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
