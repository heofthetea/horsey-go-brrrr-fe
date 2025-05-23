<template>
    <v-app>
        <v-app-bar app>
            <v-app-bar-nav-icon
                @click="showSidebar = !showSidebar"
                v-if="$vuetify.display.smAndDown"
            />
            <v-toolbar-title
                >horsey-go-brrrr - beat Josia edition</v-toolbar-title
            >
        </v-app-bar>

        <Sidebar v-model="showSidebar" @select-game="handle_game_select" />

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
            <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                style="height: fit-content"
                closable
            >
                {{ errorMessage }}
            </v-alert>
            <v-alert
                v-if="selected_game_id && socketStatus === 'disconnected'"
                type="warning"
                variant="tonal"
                style="height: fit-content"
            >
                Disconnected from WebSocket. Trying to reconnect...
            </v-alert>
            <v-alert
                v-if="selected_game_id && socketStatus === 'failed'"
                type="error"
                variant="tonal"
                style="height: fit-content"
            >
                Failed to connect to WebSocket: Max retries exceeded. You can
                probably blame Josia
                <v-tooltip
                    text="Well I wanted to write 'my deployment' but honestly
                    blaming Josia is way more fun, thanks copilot"
                    location="top"
                >
                    <template #activator="{ props }">
                        <v-icon
                            v-bind="props"
                            class="ml-2"
                            color="red"
                            style="cursor: pointer"
                        >
                            mdi-help-circle
                        </v-icon>
                    </template>
                </v-tooltip>
                <br />
            </v-alert>
            <v-container fluid class="h-100 d-flex justify-center align-center">
                <GameBoard v-if="selected_game" :game="selected_game" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useStore } from "vuex";
import Sidebar from "./components/Sidebar.vue";
import GameBoard from "./components/GameBoard.vue";
import { useRoute } from "vue-router";
import { connectToSocket, connectionStatus } from "./services/socket_client";

const store = useStore();
const route = useRoute();
const selected_game_id = ref(null);
const showSidebar = ref(true);

const socketStatus = computed(
    () => selected_game_id.value && connectionStatus[selected_game_id.value]
);

const errorMessage = computed(() => {
    return route.query.errorMessage;
});

const selected_game = computed(() => {
    if (!selected_game_id.value) return null;
    const game = store.state.entities.games.data[selected_game_id.value];
    return game;
});

const join_link = computed(() => {
    return `${window.location.origin}/join/${selected_game_id.value}`;
});

onMounted(() => {
    if (route.query.errorMessage) {
        console.error(errorMessage);
        return;
    }
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
