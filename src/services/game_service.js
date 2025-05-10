// API communication for game
import api from "@/services/api";

export async function get_games_by_user(username) {
    const response = await api.get(`/games`, { params: { username } });
    if (!response.status === 200) {
        throw new Error("Failed to fetch games", response.status);
    }
    return response.data;
}
/**
 * Create a new game for the given player.
 * @param {string} username - The username of the host player.
 * @param {number} width - Width of the board.
 * @param {number} height - Height of the board.
 * @returns {Promise<Object>} The created game object.
 */
export async function create_game(username, width, height) {
    const payload = {
        host: { username },
        width,
        height,
        state: "NOT_STARTED", // Must be included as string
    };

    const response = await api.post("/games/create", payload);
    return response.data;
}

export async function make_turn(game_id, username, column) {
    const payload = {
        user: { username },
        column,
    };
    console.log(payload);

    const response = await api.put(`/games/${game_id}/make-turn`, payload);
    if (!response.status === 200) {
        throw new Error("Failed to make turn", response.status);
    }
    return response.data;
}

export async function get_game(game_id) {
    const response = await api.get(`/games/${game_id}`);
    if (!response.status === 200) {
        throw new Error("Failed to fetch game", response.status);
    }
    return response.data;
}

export async function join_game(game_id, username) {
    const payload = { username };
    const response = await api.put(`/games/${game_id}/join`, payload);
    if (!response.status === 200) {
        throw new Error("Failed to join game", response.status);
    }
    return response.data;
}
