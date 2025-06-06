import { Model } from "@vuex-orm/core";

export default class Game extends Model {
    static entity = "games";

    static fields() {
        return {
            id: this.string(null),
            currentPosition: this.string(null),
            positions: this.attr([]),
            host: this.attr(null),
            guest: this.attr(null),
            state: this.string("NOT_STARTED"), // see backend for possible values
            start_time: this.attr(null), // ISO string assumed
            end_time: this.attr(null), // null if unfinished
            lastTurnIn: this.number(-1), // -1 <=> beginning of the game; no turns yet
            lastTurnWon: this.boolean(false), // only true if the last update was a "GAME_OVER" message (lazy af but easiest to implement)
            justMoved: this.boolean(false), // true if a move just came in. Used to pull a scrolling player away to the current board
        };
    }

    get is_finished() {
        return this.end_time !== null;
    }
}
