<template>
    <v-container>
        <h2>Hello world</h2>
    </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const store = useStore();
const username = import.meta.env.VITE_HARDCODED_USERNAME;

onMounted(async () => {
    const game_id = route.params.gameId;
    console.log("game id:", game_id);
    try {
        await store.dispatch("gameLoader/getGame", game_id);
        await store.dispatch("gameLoader/joinGame", { game_id, username });

        // Redirect to root and auto-select the joined game
        router.push({ path: "/", query: { select: game_id } });
    } catch (err) {
        console.error("Error joining game:", err);
        // Optionally redirect or show error
    }
});
</script>
