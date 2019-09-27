import * as assert from "assert";
import { State, Player } from "./Schema";
import { ArraySchema, MapSchema } from "../src";

const getRandomNumber = (max: number = 2000) => Math.floor(Math.random() * max);

function assertExecutionTime(cb: Function, message: string, threshold: number) {
    const now = Date.now();
    cb();
    const diff = Date.now() - now;
    console.log(`${message} took ${diff}ms`)
    assert.ok(diff < threshold, `${message} exceeded ${threshold}ms. took: ${diff}ms`);

}

describe("Performance", () => {
    it("ArraySchema", () => {
        const state = new State();
        state.arrayOfPlayers = new ArraySchema<Player>();

        const totalItems = 10000;

        assertExecutionTime(() => {
            for (let i = 0; i < totalItems; i++) {
                state.arrayOfPlayers.push(new Player("Player " + i, getRandomNumber(), getRandomNumber()));
            }
        }, `inserting ${totalItems} items to array`, 1200); // TODO: improve this!

        assertExecutionTime(() => state.encode(), `encoding ${totalItems} array entries`, 150);

        const player: Player = state.arrayOfPlayers[Math.round(totalItems / 2)];
        player.x = getRandomNumber();
        player.y = getRandomNumber();

        assertExecutionTime(() => state.encode(), "encoding a single array item change", 5);
    });

    it("MapSchema", () => {
        const state = new State();
        state.mapOfPlayers = new MapSchema<Player>();

        const totalItems = 5000;

        assertExecutionTime(() => {
            for (let i = 0; i < totalItems; i++) {
                state.mapOfPlayers["player" + i] = new Player("Player " + i, getRandomNumber(), getRandomNumber());
            }
        }, `inserting ${totalItems} items to map`, 600); // TODO: improve this value!

        assertExecutionTime(() => state.encode(), `encoding ${totalItems} map entries`, 100);

        const player: Player = state.mapOfPlayers[`player${Math.floor(totalItems / 2)}`];
        player.x = getRandomNumber();
        player.y = getRandomNumber();

        // TODO: improve this value
        assertExecutionTime(() => state.encode(), "encoding a single map item change", 10);
    });
});