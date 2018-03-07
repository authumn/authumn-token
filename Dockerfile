FROM mhart/alpine-node:8

ENV WHITELIST http://localhost,http://test.com
ENV PORT 2301
ENV USER_API http://test.com/api/user/login
ENV TOKEN_ISSUER https://test.com
ENV TOKEN_SECRET change_me
ENV TOKEN_EXPIRATION_TIME 86400000
ENV TOKEN_REFRESH_EXPIRATION_TIME 600000
ENV REDIS_PORT 6379
ENV REDIS_HOST localhost
ENV REDIS_DATABASE 0

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

EXPOSE 2302

ENTRYPOINT ["npm", "start"]
