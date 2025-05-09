<template>
    <v-app>
        <Sidebar />

        <v-main>
            <v-container fluid class="h-100 d-flex justify-center align-center">
                <GameBoard :jen="demoJen2" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
import GameBoard from "./components/GameBoard.vue";

const demoJen2 =
    "009009ox-o------x-o------x-o------x-----------------------------------------------------";
</script>

<style></style>
