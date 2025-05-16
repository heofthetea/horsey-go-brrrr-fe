
# FROM node:22.15.0-alpine

# # install simple http server for serving static content
# RUN npm install -g http-server

# # make the 'app' folder the current working directory
# WORKDIR /app

# # copy both 'package.json' and 'package-lock.json' (if available)
# COPY package*.json ./

# RUN npm install

# COPY . .
# COPY .env.docker .env

# # build app for production with minification
# RUN npm run build

# EXPOSE 8080
# CMD [ "http-server", "dist" ]



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
COPY ./set-env.sh /docker-entrypoint.d/set-env.sh
RUN chmod +x /docker-entrypoint.d/set-env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]