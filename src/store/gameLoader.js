import { get_games_by_user } from "@/service/game_service";
import Game from "@/store/models/Game";

export default {
    namespaced: true,
    actions: {
        async loadGames({ commit }) {
            console.log("loadGames");
            const games = await get_games_by_user("dummy_user");
            Game.insert({ data: games });
        },
    },
};
