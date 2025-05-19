<template>
    <v-navigation-drawer
        v-model="drawer"
        :temporary="$vuetify.display.smAndDown"
        mobile-breakpoint="960"
        app
        width="300"
    >
        <!-- Title -->
        <v-toolbar flat>
            <v-toolbar-title>My Games</v-toolbar-title>
        </v-toolbar>

        <!-- Game List -->
        <v-list dense nav>
            <v-list-item
                v-for="game in games"
                :key="game.id"
                @click="select_game(game.id)"
                :active="game.id === selected_id"
                :title="`${game.id}`"
            >
            </v-list-item>
        </v-list>

        <!-- Spacer pushes buttons to bottom -->
        <div class="flex-grow-1" />

        <!-- Action Buttons -->
        <v-list>
            <v-list-item @click="open_dialog = true">
                <v-icon left>mdi-plus</v-icon>
                Create Game
            </v-list-item>

            <v-list-item @click="logout">
                <v-icon left>mdi-logout</v-icon>
                Logout
            </v-list-item>
        </v-list>

        <!-- Create Game Dialog -->
        <v-dialog
            v-model="open_dialog"
            max-width="400"
            @keydown.enter.prevent="create_game"
        >
            <v-card>
                <v-card-title>Create New Game</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="width"
                        label="Width"
                        type="number"
                        required
                    />
                    <v-text-field
                        v-model="height"
                        label="Height"
                        type="number"
                        required
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="open_dialog = false">Cancel</v-btn>
                    <v-btn color="primary" @click="create_game">Create</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import keycloak, { getUsername } from "@/plugins/keycloak";

const store = useStore();
const width = ref(null);
const height = ref(null);
const drawer = ref(true);
const emit = defineEmits(["select-game", "update:modelValue"]);

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});

watch(
    () => drawer.value,
    (val) => emit("update:modelValue", val)
);
watch(
    () => props.modelValue,
    (val) => (drawer.value = val)
);

onMounted(async () => {
    await store.dispatch("gameLoader/loadGames");
    // Set the first game as selected if available - makes for a nicer first view experience
    const games = Object.values(store.state.entities.games.data);
    if (games.length > 0) {
        const first_game = games[0];
        selected_id.value = first_game.id;
        emit("select-game", first_game.id);
    }
});

const games = computed(() =>
    store.state.entities.games.data
        ? Object.values(store.state.entities.games.data)
        : []
);

const selected_id = ref(null);
const open_dialog = ref(false);

/**
 * Emit the selected game when user clicks on it in the sidebar
 * @param id id of the selected game
 */
function select_game(id) {
    selected_id.value = id;
    emit("select-game", id);
}

async function create_game() {
    const game = await store.dispatch("gameLoader/createGame", {
        username: getUsername(),
        width: width.value,
        height: height.value,
    });

    selected_id.value = game.id;
    emit("select-game", game.id);
    open_dialog.value = false;
}

function logout() {
    keycloak.logout();
}
</script>
