# Builder
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN corepack enable
RUN corepack prepare pnpm@8.5.1 --activate
RUN pnpm install

COPY . .
RUN pnpm run build
RUN pnpm install --prod

# Runner
FROM node:18-alpine as runner
WORKDIR /app

COPY package.json .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]
