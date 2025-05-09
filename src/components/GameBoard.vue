<template>
    <v-container class="pa-4 d-flex justify-center" fluid>
        <div class="board">
            <div v-for="(row, ri) in parsed.board" :key="ri" class="board-row">
                <div
                    v-for="(cell, ci) in row"
                    :key="ci"
                    class="cell"
                    :class="{
                        clickable: find_lowest_free_cell(ci) === ri,
                        hovered:
                            hover_col === ci &&
                            find_lowest_free_cell(ci) === ri,
                    }"
                    @mouseenter="hover_col = ci"
                    @mouseleave="hover_col = null"
                    @click="handle_click(ci)"
                >
                    <!-- Actual token -->
                    <img v-if="cell === 'x'" :src="xSvg" class="mark" alt="x" />
                    <img
                        v-else-if="cell === 'o'"
                        :src="oSvg"
                        class="mark"
                        alt="o"
                    />

                    <!-- Hover preview -->
                    <img
                        v-else-if="
                            hover_col === ci && find_lowest_free_cell(ci) === ri
                        "
                        :src="parsed.current_player === 'x' ? xSvg : oSvg"
                        class="mark faint"
                        alt="preview"
                    />
                </div>
            </div>
        </div>
    </v-container>
</template>

<script setup>
import { computed, ref } from "vue";
import xSvg from "../assets/x.svg";
import oSvg from "../assets/o.svg";

const props = defineProps({
    jen: {
        type: String,
        required: true,
    },
});

const hover_col = ref(null);

/**
 * Parses the JEN string into a format better suited for rendering.
 * Inverts the array so that the top-left cell is rendered bottom-left.
 * Also extracts the width, height, and current player.
 */
const parsed = computed(() => {
    const jen = props.jen;
    if (!jen || jen.length < 7) return null;

    const width = parseInt(jen.slice(0, 3), 10);
    const height = parseInt(jen.slice(3, 6), 10);
    const current_player = jen[6];
    const board_string = jen.slice(7);

    if (board_string.length !== width * height) return null;

    const board = [];
    for (let row = height - 1; row >= 0; row--) {
        const start = row * width;
        const end = start + width;
        board.push(board_string.slice(start, end).split(""));
    }

    return { width, height, current_player, board };
});

/**
 * Find the lowest available cell in a given column
 * @param col
 */
const find_lowest_free_cell = (col) => {
    if (!parsed.value) return null;
    const { height, board } = parsed.value;
    for (let r = height - 1; r >= 0; r--) {
        if (board[r][col] === "-") return r;
    }
    return null; // column full
};

const handle_click = (col) => {
    const row = find_lowest_free_cell(col);
    if (row !== null) {
        console.log(
            `Placing ${parsed.value.current_player} at column ${col}, row ${row}`
        );
    }
};
</script>

<style scoped>
.board {
    display: flex;
    flex-direction: column;
}

.board-row {
    display: flex;
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

.cell.clickable {
    background-color: #b3ddc5;
    cursor: pointer;
}

.cell.hovered {
    background-color: #b3ddc5;
}

.mark {
    width: 80%;
    height: 80%;
}

.faint {
    opacity: 0.3;
}
</style>
