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
console.log(router);

onMounted(async () => {
    const game_id = route.params.gameId;
    console.log("game id:", game_id);
    try {
        const response = await store.dispatch("gameLoader/joinGame", {
            game_id,
            username,
        });

        // Redirect to root and auto-select the joined game
        router.push({ path: "/", query: { select: game_id } });
    } catch (err) {
        // localhost:5173/join/54443494-9f7a-4acb-a764-11aa82c72444
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
