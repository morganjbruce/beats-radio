FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/dist dist
COPY package.json ./
COPY server server
ENV NODE_ENV=production
EXPOSE 3001
# .beats/ (SQLite history + logs) lives on the mounted volume — see fly.toml [mounts]
CMD ["bun", "server/index.ts"]
