/**
 * Provides a function to create WebSockets.
 * Defines the WebSockets behaviour and registers it with the API
 */

import store from "@/store";
import keycloak from "../plugins/keycloak";
import { reactive } from "vue";

const connections = new Map(); // maps gameId => WebSocket
const retryCounts = new Map(); // keep track of connection attempts for each game to avoid infinite loops
const MAX_RETRIES = import.meta.env.VITE_MAX_RETRIES || 5;

export const connectionStatus = reactive({});

export function isConnected(gameId) {
    return connections.has(gameId);
}

/**
 * Connect to a WebSocket for the given gameId.
 * Defines standard WebSocket callbacks for onopen, onmessage, onerror, and onclose.
 * Incoming messages lead to an update of the orm store.
 * @param {*} gameId id of the game, used to connect to the corresponding websocket
 * @returns {void}
 */
export async function connectToSocket(gameId) {
    if (connections.has(gameId)) {
        return; // already connected
    }

    const url = `${import.meta.env.VITE_WEBSOCKET_URL}/game/${gameId}`;
    // shouldn't need to refresh the token here
    const ws = new WebSocket(url, ["access_token", keycloak.token]);

    ws.onopen = () => {
        console.log(`[WS] Connected to game ${gameId}`);
        connectionStatus[gameId] = "connected";
        retryCounts.set(gameId, 0); // reset counter on successfull connection only
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
                    justMoved: true,
                });
            }
            // case is treated seperately so that horse sound can be played
            if ("GAME_OVER" === message.type) {
                console.log(`[WS] Game over: ${message.gameId}`);
                store.dispatch("gameLoader/insertGame", {
                    ...message.game,
                    lastTurnIn: message.turnIn,
                    lastTurnWon: true,
                    justMoved: true,
                });
            }
        } catch (err) {
            console.error("[WS] Failed to handle message:", err);
        }
    };

    ws.onerror = (err) => {
        console.error("[WS] Error:", err);
        retryCounts.set(gameId, (retryCounts.get(gameId) || 0) + 1);
        connectionStatus[gameId] = "failed";
    };

    /**
     * onClose callback behaviour:
     * attempt to reconnect if connection was closed, and game is not over
     *
     */
    ws.onclose = () => {
        console.warn(`[WS] Disconnected from game ${gameId}`);
        connections.delete(gameId);
        // attempting to reconnect makes no sense if the game is over
        if (
            ["HOST_WON", "GUEST_WON", "DRAW"].includes(
                store.state.entities.games.data[gameId].state
            )
        ) {
            return;
        }

        const retries = retryCounts.get(gameId) || 0;
        if (retries >= MAX_RETRIES) {
            console.error(
                `[WS] Max retries reached for game ${gameId}. Not reconnecting.`
            );
            connectionStatus[gameId] = "failed";
            return;
        }
        connectionStatus[gameId] = "disconnected";
        connectToSocket(gameId);
    };

    connections.set(gameId, ws);
}
