<template>
    <v-navigation-drawer app permanent width="300">
        <!-- Title -->
        <v-toolbar flat>
            <v-toolbar-title>My Games</v-toolbar-title>
        </v-toolbar>

        <!-- Game List -->
        <v-list dense nav>
            <v-list-item
                v-for="game in games"
                :key="game.id"
                @click="selectGame(game.id)"
                :active="game.id === selectedId"
                :title="`Game ${game.id.slice(0, 8)}...`"
            >
                <template #prepend>
                    <v-icon>{{ game.icon }}</v-icon>
                </template>
            </v-list-item>
        </v-list>

        <!-- Spacer pushes buttons to bottom -->
        <div class="flex-grow-1" />

        <!-- Action Buttons -->
        <v-list>
            <v-list-item @click="openDialog = true">
                <v-icon left>mdi-plus</v-icon>
                Create Game
            </v-list-item>

            <v-list-item @click="logout">
                <v-icon left>mdi-logout</v-icon>
                Logout
            </v-list-item>
        </v-list>

        <!-- Create Game Dialog -->
        <v-dialog v-model="openDialog" max-width="400">
            <v-card>
                <v-card-title>Create New Game</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="newGameName"
                        label="Game Name (optional)"
                    />
                    <v-text-field v-model="width" label="Width" type="number" />
                    <v-text-field
                        v-model="height"
                        label="Height"
                        type="number"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="openDialog = false">Cancel</v-btn>
                    <v-btn color="primary" @click="createGame">Create</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue";

const games = ref([
    { id: "abc123", icon: "mdi-gamepad-variant" },
    { id: "def456", icon: "mdi-gamepad-variant" },
]);

const selectedId = ref(null);
const openDialog = ref(false);
const newGameName = ref("");
const width = ref(7);
const height = ref(6);

function selectGame(id) {
    selectedId.value = id;
    // In a real app, you’d emit or update state here
}

function createGame() {
    //TODO actual logic
    console.log("Creating game with", width.value, height.value);
    openDialog.value = false;
}

function logout() {
    //TODO actual logic
    console.log("Logging out...");
}
</script>
