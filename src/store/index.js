import { createStore } from "vuex"; // YES IT DOES SHUT UP VSCODE
import VuexORM from "@vuex-orm/core";
import { Database } from "@vuex-orm/core";
import Game from "./models/Game";
import gameLoader from "./gameLoader";

const database = new Database();
database.register(Game);

export default createStore({
    plugins: [VuexORM.install(database)],
    modules: {
        gameLoader,
    },
});
