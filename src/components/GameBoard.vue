<template>
    <v-container
        class="pa-4 d-flex flex-column"
        style="width: fit-content"
        fluid
    >
        <!-- Player X -->
        <div class="font-weight-bold mb-2">x: {{ host }}</div>
        <!-- Banner -->
        <v-alert
            v-if="isGameOver && !dismissedBanner"
            type="info"
            close-label="Close"
            closable
            @click:close="dismissedBanner = true"
            class="mb-2 alert-banner"
        >
            {{ resultText }}
        </v-alert>
        <div class="board">
            <div v-for="(row, ri) in parsed.board" :key="ri" class="board-row">
                <div
                    v-for="(cell, ci) in row"
                    :key="ci"
                    class="cell"
                    :class="{
                        clickable:
                            find_lowest_free_cell(ci) === ri &&
                            is_my_turn &&
                            !isGameOver,
                        hovered:
                            hover_col === ci &&
                            find_lowest_free_cell(ci) === ri &&
                            is_my_turn &&
                            !isGameOver,
                        lastTurn: lastTurnInY === ri && lastTurnIn === ci,
                        winning:
                            is_winning_coordinate(
                                ci,
                                parsed.board.length - 1 - ri
                            ) && did_I_win,
                        losing:
                            is_winning_coordinate(
                                ci,
                                parsed.board.length - 1 - ri
                            ) && !did_I_win,
                    }"
                    @mouseenter="!isGameOver && (hover_col = ci)"
                    @mouseleave="hover_col = null"
                    @click="!isGameOver && handle_click(ci)"
                >
                    <img v-if="cell === 'x'" :src="xSvg" class="mark" alt="x" />
                    <img
                        v-else-if="cell === 'o'"
                        :src="oSvg"
                        class="mark"
                        alt="o"
                    />

                    <img
                        v-else-if="
                            hover_col === ci &&
                            find_lowest_free_cell(ci) === ri &&
                            is_my_turn
                        "
                        :src="parsed.current_player === 'x' ? xSvg : oSvg"
                        class="mark faint"
                        alt="preview"
                    />
                </div>
            </div>
        </div>
        <!-- Player O -->
        <div class="font-weight-bold mt-2">o: {{ guest }}</div>
    </v-container>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import xSvg from "../assets/x.svg";
import oSvg from "../assets/o.svg";
import { getUsername } from "../plugins/keycloak";
import getWinningCoordinates from "../utils/jenWinDetection";

const props = defineProps({
    game: {
        type: Object,
        required: true,
    },
});

const store = useStore();
const hover_col = ref(null);
const dismissedBanner = ref(false);

const state = computed(() => props.game.state);
const host = computed(
    () =>
        props.game.host.username +
        (props.game.host.username === username ? " (you)" : "")
);
const guest = computed(
    () =>
        (props.game.guest?.username ?? "Waiting for players to join...") +
        (props.game.guest?.username === username ? " (you)" : "")
);

const isGameOver = computed(() =>
    ["HOST_WON", "GUEST_WON", "DRAW"].includes(state.value)
);

const is_my_turn = computed(() => {
    if (props.game.guest === null) return false;
    if (props.game.guest.username === username) {
        return parsed.value.current_player === "o";
    } else {
        return parsed.value.current_player === "x";
    }
});

const did_I_win = computed(() => {
    if (props.game.guest === null) return false;
    if (props.game.guest.username === username) {
        return state.value === "GUEST_WON";
    } else {
        return state.value === "HOST_WON";
    }
});

const lastTurnIn = computed(() => props.game.lastTurnIn);
const lastTurnInY = computed(() => {
    if (lastTurnIn.value == -1 || !parsed.value) return null;
    return find_lowest_free_cell(lastTurnIn.value) + 1;
});

const winningCoordinates = computed(() => {
    if (!isGameOver.value) return null;
    return getWinningCoordinates(
        props.game.currentPosition,
        state.value === "HOST_WON" ? "x" : "o"
    );
});
const username = getUsername();

/**
 * Parses the JEN string into a format better suited for rendering.
 * Inverts the array so that the top-left cell is rendered bottom-left.
 * Also extracts the width, height, and current player.
 */
const parsed = computed(() => {
    const jen = props.game.currentPosition;
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

const resultText = computed(() => {
    switch (state.value) {
        case "HOST_WON":
            return "x won!";
        case "GUEST_WON":
            return "o won!";
        case "DRAW":
            return "Draw!";
        default:
            return "";
    }
});

function find_lowest_free_cell(col) {
    if (!parsed.value) return null;
    const { height, board } = parsed.value;
    for (let r = height - 1; r >= 0; r--) {
        if (board[r][col] === "-") return r;
    }
    return null; // column full
}

function is_winning_coordinate(x, y) {
    if (!winningCoordinates.value) return false;
    console.log(
        winningCoordinates.value.some(
            (coord) => coord["x"] === x && coord["y"] === y
        )
    );
    return winningCoordinates.value.some(
        (coord) => coord["x"] === x && coord["y"] === y
    );
}

async function handle_click(col) {
    const row = find_lowest_free_cell(col);
    if (row === null) return;

    try {
        await store.dispatch("gameLoader/makeTurn", {
            game_id: props.game.id,
            username,
            column: col,
        });
    } catch (err) {
        console.error("Failed to make move:", err);
    }
}
</script>

<style scoped>
.board {
    display: flex;
    flex-direction: column;
    width: fit-content;
}

.board-row {
    display: flex;
    justify-content: center;
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

.cell.lastTurn {
    background-color: lightblue;
}
.cell.winning {
    background-color: lightgreen;
}

.cell.losing {
    background-color: lightcoral;
}

.mark {
    width: 80%;
    height: 80%;
    stroke: red !important;
}

.faint {
    opacity: 0.3;
}
.alert-banner {
    position: sticky;
    text-align: center;
    top: 40%;
    height: fit-content;
    margin: -4.5rem auto; /*everytime you do literally ANYTHING with css it ends up being the worst Pfusch the world has ever seen i swear */
    width: 100%;
}
</style>
