import store from "@/store";
import Game from "@/store/models/Game";
import keycloak from "../plugins/keycloak";

const connections = new Map(); // maps gameId => WebSocket

/**
 * Connect to a WebSocket server for the given gameId.
 * Defines standard WebSocket callbacks for onopen, onmessage, onerror, and onclose.
 * Incoming messages lead to an update of the orm store.
 * @param {*} gameId
 * @returns
 */
export function connectToSocket(gameId) {
    if (connections.has(gameId)) {
        return; // already connected
    }

    const url = `${import.meta.env.VITE_WEBSOCKET_URL}/game/${gameId}`;
    // shouldn't need to refresh the token here
    const ws = new WebSocket(url, ["access_token", keycloak.token]);

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
                console.log(
                    `[WS] Received game update from ${message.turnBy}: ${message.turnIn}`
                );
                store.dispatch("gameLoader/insertGame", {
                    ...message.game,
                    lastTurnIn: message.turnIn,
                });
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
