<template>
    <v-container class="pa-4 d-flex justify-center" fluid>
        <div class="board">
            <div
                v-for="(row, rowIndex) in parsed.board"
                :key="rowIndex"
                class="board-row"
            >
                <div
                    v-for="(cell, colIndex) in row"
                    :key="colIndex"
                    class="cell"
                >
                    <img v-if="cell === 'x'" :src="xSvg" class="mark" alt="x" />
                    <img
                        v-else-if="cell === 'o'"
                        :src="oSvg"
                        class="mark"
                        alt="o"
                    />
                </div>
            </div>
        </div>
    </v-container>
</template>

<script setup>
import { computed } from "vue";
import xSvg from "@/assets/x.svg";
import oSvg from "@/assets/o.svg";

const props = defineProps({
    jen: {
        type: String,
        required: true,
    },
});

const parsed = computed(() => {
    const jen = props.jen;
    if (!jen || jen.length < 7) return null;

    const width = parseInt(jen.slice(0, 3), 10);
    const height = parseInt(jen.slice(3, 6), 10);
    const toMove = jen[6];
    const boardStr = jen.slice(7);

    if (boardStr.length !== width * height) return null;

    const board = [];
    for (let row = height - 1; row >= 0; row--) {
        const start = row * width;
        const end = start + width;
        board.push(boardStr.slice(start, end).split(""));
    }

    return { width, height, toMove, board };
});
</script>

<style scoped>
.board {
    display: flex;
    flex-direction: column;
    gap: 0px;
}

.board-row {
    display: flex;
    gap: 0px;
}

.cell {
    width: 50px;
    height: 50px;
    background-color: white;
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mark {
    width: 80%;
    height: 80%;
}
</style>
