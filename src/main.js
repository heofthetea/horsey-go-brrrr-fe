import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";

createApp(App).use(vuetify).use(store).mount("#app");
