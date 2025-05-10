import { createRouter, createWebHistory } from "vue-router";
import Home from "@/App.vue";
import JoinGame from "@/pages/JoinGame.vue";

const routes = [
    { path: "/join/:gameId", component: JoinGame },
    { path: "/", component: Home },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
