# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Use npm install if package-lock.json doesn't exist, otherwise use npm ci
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Build arguments for NEXT_PUBLIC_* variables (required at build time)
ARG NEXT_PUBLIC_SUPABASE_URL=dummy
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy
ARG NEXT_PUBLIC_RAG_BASE_URL=dummy
ARG NEXT_PUBLIC_LLM_SERVICE_URL=dummy
ARG NEXT_PUBLIC_SITE_URL=dummy

# Set environment variables from build args
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_RAG_BASE_URL=$NEXT_PUBLIC_RAG_BASE_URL
ENV NEXT_PUBLIC_LLM_SERVICE_URL=$NEXT_PUBLIC_LLM_SERVICE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set proper permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
