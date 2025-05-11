import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export function initKeycloak(onAuthenticatedCallback) {
    keycloak
        .init({
            onLoad: "login-required",
            checkLoginIframe: false,
        })
        .then((authenticated) => {
            if (!authenticated) {
                console.warn("[Keycloak] Not authenticated");
            }
            onAuthenticatedCallback();
        })
        .catch(console.error);
}

export function getToken() {
    return keycloak.token;
}

export function getUsername() {
    return keycloak.tokenParsed?.preferred_username ?? "unknown";
}

export function logout() {
    keycloak.logout();
}

export default keycloak;
