/**
 * Initializes the vuetify plugin
 */
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css"; // i fucking hate npm

export default createVuetify({
    components,
    directives,
});
