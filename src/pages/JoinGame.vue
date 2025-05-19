<template>Make team 2 great again</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getUsername } from "@/plugins/keycloak";

const route = useRoute();
const router = useRouter();
const store = useStore();
const username = getUsername();

onMounted(async () => {
    const game_id = route.params.gameId;
    try {
        const response = await store.dispatch("gameLoader/joinGame", {
            game_id,
            username,
        });

        // Redirect to root and auto-select the joined game
        router.push({ path: "/", query: { select: game_id } });
    } catch (err) {
        if (err.response.status == 403) {
            console.error("You are not allowed to join this game");
            router.push({
                path: "/",
                query: {
                    errorMessage: "You are not allowed to join this game",
                },
            });
        }
    }
});
</script>
