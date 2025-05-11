import keycloak from "@/plugins/keycloak";

export const keycloakGuard = async (to, from, next) => {
    try {
        // Initialize Keycloak if not already initialized
        if (!keycloak.authenticated) {
            await keycloak.init({ onLoad: "login-required" });
        }

        if (keycloak.authenticated) {
            next();
        } else {
            keycloak.login();
            console.log("logged in");
        }
    } catch (error) {
        console.error("Keycloak authentication error:", error);
        next(false);
    }
};
