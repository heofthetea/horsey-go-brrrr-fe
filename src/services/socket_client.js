import store from "@/store";
import Game from "@/store/models/Game";

const connections = new Map(); // maps gameId => WebSocket

/**
 * Connect to a WebSocket server for the given gameId.
 * @param {*} gameId
 * @returns
 */
export function connectToSocket(gameId) {
    if (connections.has(gameId)) {
        return; // already connected
    }

    const url = `${import.meta.env.VITE_API_BASE_URL.replace(
        /^http/,
        "ws"
    )}/ws/game/${gameId}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
        console.log(`[WS] Connected to game ${gameId}`);
    };

    ws.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            if (
                ["GAME_UPDATED", "GUEST_JOINED"].includes(message.type) &&
                message.game
            ) {
                console.log(`[WS] Received game update from ${message.turnBy}`);
                store.dispatch("gameLoader/insertGame", message.game);
            }
        } catch (err) {
            console.error("[WS] Failed to handle message:", err);
        }
    };

    ws.onerror = (err) => {
        console.error("[WS] Error:", err);
    };

    ws.onclose = () => {
        console.warn(`[WS] Disconnected from game ${gameId}`);
        connections.delete(gameId);
    };

    connections.set(gameId, ws);
}
