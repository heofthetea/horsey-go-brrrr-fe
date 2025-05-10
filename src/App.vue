<template>
    <v-app>
        <Sidebar @select-game="handle_game_select" />

        <v-main>
            <div
                v-if="selected_game?.state === 'NOT_STARTED'"
                class="mt-4 text-center"
            >
                <v-alert type="info" variant="tonal">
                    Share this link to invite an opponent:<br />
                    <code>{{ join_link }}</code>
                </v-alert>
            </div>
            <v-container fluid class="h-100 d-flex justify-center align-center">
                <GameBoard v-if="selected_game" :game="selected_game" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import Sidebar from "./components/Sidebar.vue";
import GameBoard from "./components/GameBoard.vue";
import { useRoute } from "vue-router";
import { connectToSocket } from "./services/socket_client";

const store = useStore();
const route = useRoute();
const selected_game_id = ref(null);

const selected_game = computed(() => {
    if (!selected_game_id.value) return null;
    const game = store.state.entities.games.data[selected_game_id.value];
    return game;
});

const join_link = computed(() => {
    return `${window.location.origin}/join/${selected_game_id.value}`;
});

onMounted(() => {
    const game_id = route.query.select;
    if (game_id) {
        selected_game_id.value = game_id;
    }
});

function handle_game_select(id) {
    selected_game_id.value = id;
    connectToSocket(id);
}
</script>

<style></style>
