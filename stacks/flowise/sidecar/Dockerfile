FROM oven/bun:1
WORKDIR /usr/src/app

COPY . .

RUN bun install --frozen-lockfile

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]
