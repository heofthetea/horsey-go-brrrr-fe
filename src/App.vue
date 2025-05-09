<template>
    <v-app>
        <Sidebar />

        <v-main>
            <v-container fluid>
                <GameBoard :jen="demoJen" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
import GameBoard from "./components/GameBoard.vue";

// Example JEN string from your documentation
const demoJen = "004003o-xox--xo----";
</script>
