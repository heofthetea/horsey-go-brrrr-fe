import { createRouter, createWebHistory } from "vue-router";
import Home from "@/App.vue";
import JoinGame from "@/pages/JoinGame.vue";
import { keycloakGuard } from "./keycloakGuard";

const routes = [
    { path: "/join/:gameId", component: JoinGame },
    { path: "/", component: Home },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// route everything through guard
router.beforeEach((to, from, next) => keycloakGuard(to, from, next));

export default router;
