
FROM node:22.15.0-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# replace env with the placeholder env
COPY .env.docker .env
COPY ./set-env.sh /app/set-env.sh
RUN /bin/sh /app/set-env.sh
# COPY .env.docker .env
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
# ensure set-env.sh is run, so that env variables configured using docker are registered by the app
COPY ./set-env.sh /docker-entrypoint.d/set-env.sh
RUN chmod +x /docker-entrypoint.d/set-env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]