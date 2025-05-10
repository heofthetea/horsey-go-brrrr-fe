import {
    create_game as create_api_call,
    get_games_by_user,
    make_turn,
    get_game,
    join_game,
} from "@/services/game_service";
import Game from "@/store/models/Game";

export default {
    namespaced: true,
    actions: {
        async loadGames({ commit }) {
            const games = await get_games_by_user(
                import.meta.env.VITE_HARDCODED_USERNAME
            );
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
            console.log("Joining game", game_id, username);
            const joined = await join_game(game_id, username);
            Game.insert({ data: joined });
            return joined;
        },
    },
};
