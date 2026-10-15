import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
    BggSearchPendingError,
    searchBggGames,
} from "./bgg.service";

const originalFetch = globalThis.fetch;

afterEach(() => {
    globalThis.fetch = originalFetch;
});

test("searchBggGames requests boardgames and maps the XML results", async () => {
    let requestedUrl = "";
    globalThis.fetch = (async (input: RequestInfo | URL) => {
        requestedUrl = String(input);
        return new Response(
            '<items total="2"><item type="boardgame" id="13"><name type="primary" value="Catan"/><yearpublished value="1995"/></item><item type="boardgameexpansion" id="14"><name type="primary" value="Catan: Seafarers"/><yearpublished value="1997"/></item></items>',
            { status: 200 },
        );
    }) as typeof fetch;

    const games = await searchBggGames("Catan & friends");

    assert.match(requestedUrl, /\/search\?/);
    assert.match(requestedUrl, /type=boardgame/);
    assert.match(requestedUrl, /query=Catan\+%26\+friends/);
    assert.deepEqual(games, [{ id: 13, title: "Catan", yearPublished: 1995 }]);
});

test("searchBggGames returns an empty list when BGG has no matches", async () => {
    globalThis.fetch = (async () =>
        new Response('<items total="0"/>', { status: 200 })) as typeof fetch;

    assert.deepEqual(await searchBggGames("No such game"), []);
});

test("searchBggGames reports a pending BGG response separately", async () => {
    globalThis.fetch = (async () =>
        new Response("", { status: 202 })) as typeof fetch;

    await assert.rejects(searchBggGames("Catan"), BggSearchPendingError);
});

test("searchBggGames rejects upstream and malformed responses", async (t) => {
    await t.test("upstream failure", async () => {
        globalThis.fetch = (async () =>
            new Response("unavailable", { status: 503 })) as typeof fetch;

        await assert.rejects(searchBggGames("Catan"), /BoardGameGeek/);
    });

    await t.test("malformed XML document", async () => {
        globalThis.fetch = (async () =>
            new Response("<unexpected/>", { status: 200 })) as typeof fetch;

        await assert.rejects(searchBggGames("Catan"), /réponse.*invalide/i);
    });
});
