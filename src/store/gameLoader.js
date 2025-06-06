import {
    create_game as create_api_call,
    get_games_by_user,
    make_turn,
    get_game,
    join_game,
    fetch_positions,
} from "@/services/game_service";
import Game from "@/store/models/Game";
import { getUsername } from "../plugins/keycloak";

export default {
    namespaced: true,
    actions: {
        async loadGames(_) {
            const games = await get_games_by_user(getUsername());
            Game.insert({ data: games });
        },

        async createGame(_, { username, width, height }) {
            const new_game = await create_api_call(username, width, height);
            Game.insert({ data: new_game });
            return new_game;
        },

        async makeTurn(_, { game_id, username, column }) {
            const new_game = await make_turn(game_id, username, column);
            Game.insert({ data: new_game });
            return new_game;
        },
        async getGame(_, game_id) {
            const game = await get_game(game_id);
            Game.insert({ data: game });
            return game;
        },
        async joinGame(_, { game_id, username }) {
            const joined = await join_game(game_id, username);
            joined.justMoved = true;
            Game.insert({ data: joined });
            return joined;
        },
        async insertGame(_, game) {
            Game.insert({ data: game });
        },
        async fetchPositions(_, game) {
            const positions = await fetch_positions(game.id);
            game.positions = positions;
            game.currentPosition = positions[positions.length - 1].jen;
        },
    },
};
