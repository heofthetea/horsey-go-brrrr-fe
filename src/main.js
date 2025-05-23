import { createApp } from "vue";
import Index from "./Index.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import router from "./router";
import { initKeycloak } from "@/plugins/keycloak";

initKeycloak(() => {
    createApp(Index).use(vuetify).use(store).use(router).mount("#app");
});
