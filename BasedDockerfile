FROM node:18-alpine
LABEL authors="phu.dangn"

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@8.5.1 --activate
COPY . .
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "start"]
# ENTRYPOINT ["pnpm", "start"]
# -> when run docker run -it <image> hostname
# new command will override the existed one
# CMD ["pnpm", "start"]
# -> when run docker run -it <image> hostname
# ->  hostname will be bind to the final
# -> pnpm run start hostname
# docker run -p 3000:3000 docker-training
