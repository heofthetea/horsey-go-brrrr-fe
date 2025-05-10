import { Model } from "@vuex-orm/core";

export default class Game extends Model {
    static entity = "games";

    static fields() {
        return {
            id: this.string(null),
            currentPosition: this.string(""),
            state: this.string("NOT_STARTED"), // see backend for possible values
            start_time: this.attr(null), // ISO string assumed
            end_time: this.attr(null), // null if unfinished
        };
    }

    get is_finished() {
        return this.end_time !== null;
    }
}
