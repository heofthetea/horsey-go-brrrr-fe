<template>
    <v-app>
        <Sidebar @select-game="handle_game_select" />

        <v-main>
            <v-container fluid class="h-100 d-flex justify-center align-center">
                <GameBoard v-if="selected_jen" :jen="selected_jen" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import Sidebar from "./components/Sidebar.vue";
import GameBoard from "./components/GameBoard.vue";

const store = useStore();
const selected_game_id = ref(null);

const selected_jen = computed(() => {
    if (!selected_game_id.value) return null;
    const game = store.state.entities.games.data[selected_game_id.value];
    return game?.jen ?? null;
});

function handle_game_select(id) {
    selected_game_id.value = id;
}
</script>

<style></style>
