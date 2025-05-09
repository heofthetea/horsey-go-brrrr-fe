import { Model } from "@vuex-orm/core";

export default class Game extends Model {
    static entity = "games";

    static fields() {
        return {
            id: this.string(null),
            jen: this.string(""),
        };
    }
}
