# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable && yarn --version && yarn install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Accept build arguments for environment variables
ARG NEXT_PUBLIC_CONVEX_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN
ARG CLERK_SECRET_KEY
ARG CLERK_WEBHOOK_SECRET
ARG CLERK_JWT_ISSUER_DOMAIN
ARG CLERK_APP_DOMAIN
ARG CONVEX_DEPLOYMENT

# Set environment variables for the build process
ENV NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN=$NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV CLERK_WEBHOOK_SECRET=$CLERK_WEBHOOK_SECRET
ENV CLERK_JWT_ISSUER_DOMAIN=$CLERK_JWT_ISSUER_DOMAIN
ENV CLERK_APP_DOMAIN=$CLERK_APP_DOMAIN
ENV CONVEX_DEPLOYMENT=$CONVEX_DEPLOYMENT

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && yarn build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files
COPY package.json yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN corepack enable && yarn install --frozen-lockfile --production=true
# Drop privileges for runtime security
USER node

EXPOSE 3000
CMD ["yarn", "start"]
