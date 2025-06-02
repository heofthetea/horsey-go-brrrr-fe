# horsey-go-brrrr-fe

Frontend for the horsey-go-brrrr connect 4 game, using Vue.js and Vite.

## Local setup

Requirements:

-   Node 22.15 or later

Run the app using:

```
npm install
npm run dev
```

> !Warning: keep in mind that the app needs a connection to the corresponding api to run properly.

## Environment Variables

-   `API_BASE_URL`: base url of horsey-go-brrrr-be REST api
-   `WEBSOCKET_URL`: base url where the websocket is reachable at
-   `KEYCLOAK_URL`: base url of the keycloak
-   `KEYCLOAK_REALM`: the kecloak realm
-   `KEYCLOAK_CLIENT_ID`: the keycloak client id. Client should be configured as public.

## Docker

This app is distributed through the docker repository [heofthetea/horsey-go-brrrr-fe](https://hub.docker.com/repository/docker/heofthetea/horsey-go-brrrr-fe/). <br>
See [horsey-go-brrrr-deployment](https://github.com/heofthetea/horsey-go-brrrr-deployment) for a local docker compose to the full app, including api and additional required services.<br>
The above mentioned Env variables can be configured as Docker environment variables, as `set-env.sh` is configured to run on startup by the Dockerfile.

### Build a docker image

The Dockerfile for this app is provided. It uses NGINX as a webserver, an accommodating `nginx.conf` is provided also.

```bash
docker build -t heofthetea/horsey-go-brrrr-fe:latest .
```

## Code Overview

The root directory mostly holds miscellaneous files. All Vue source code is located in `src/`.

```tree
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── o.svg
│   │   └── x.svg
│   ├── components
│   │   ├── Board.vue
│   │   └── Sidebar.vue
│   ├── Index.vue
│   ├── main.js
│   ├── pages
│   │   └── JoinGame.vue
│   ├── plugins
│   │   ├── keycloak.js
│   │   └── vuetify.js
│   ├── router
│   │   ├── index.js
│   │   └── keycloakGuard.js
│   ├── services
│   │   ├── api.js
│   │   ├── game_service.js
│   │   └── socket_client.js
│   ├── store
│   │   ├── gameLoader.js
│   │   ├── index.js
│   │   └── models
│   └── utils
│       └── jenWinDetection.js
```

The top-most component is `Index.vue`, holding a `RouterView` to enable internal routing to the `/join/*` route.<br>
The single-page application containing the Sidebar menu and the main board view is rendered under `App.vue`, combining `Sidebar.vue` and `Board.vue`.
