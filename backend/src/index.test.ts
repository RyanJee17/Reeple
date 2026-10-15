import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { createApp } from "./index";

const originalFetch = globalThis.fetch;

afterEach(() => {
    globalThis.fetch = originalFetch;
});

async function requestWithBggResponse(
    path: string,
    createBggResponse: () => Response,
): Promise<{ status: number; body: unknown; bggCalls: number }> {
    let bggCalls = 0;
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        if (String(input).startsWith("https://boardgamegeek.com/")) {
            bggCalls += 1;
            return createBggResponse();
        }

        return originalFetch(input, init);
    }) as typeof fetch;

    const server = createApp().listen(0);
    try {
        const address = server.address();
        assert.ok(address && typeof address !== "string");
        const response = await originalFetch(`http://127.0.0.1:${address.port}${path}`);
        const body: unknown = await response.json();
        return { status: response.status, body, bggCalls };
    } finally {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
        });
    }
}

test("GET /api/bgg/search validates the query before calling BGG", async () => {
    for (const path of ["/api/bgg/search", "/api/bgg/search?query=%20%20"]) {
        const result = await requestWithBggResponse(path, () => {
            throw new Error("BGG should not be called for an empty query");
        });

        assert.equal(result.status, 400);
        assert.deepEqual(result.body, { error: "Le paramètre query est requis." });
        assert.equal(result.bggCalls, 0);
    }
});

test("GET /api/bgg/search returns typed boardgame results", async () => {
    const result = await requestWithBggResponse(
        "/api/bgg/search?query=Catan",
        () =>
            new Response(
                '<items total="2"><item type="boardgame" id="13"><name type="primary" value="Catan"/><yearpublished value="1995"/></item><item type="boardgameexpansion" id="14"><name type="primary" value="Catan: Seafarers"/></item></items>',
                { status: 200 },
            ),
    );

    assert.equal(result.status, 200);
    assert.deepEqual(result.body, {
        query: "Catan",
        total: 1,
        games: [{ id: 13, title: "Catan", yearPublished: 1995 }],
    });
    assert.equal(result.bggCalls, 1);
});

test("GET /api/bgg/search returns an empty success response for no matches", async () => {
    const result = await requestWithBggResponse(
        "/api/bgg/search?query=Unknown",
        () => new Response('<items total="0"/>', { status: 200 }),
    );

    assert.equal(result.status, 200);
    assert.deepEqual(result.body, { query: "Unknown", total: 0, games: [] });
});

test("GET /api/bgg/search maps BGG pending and failure responses", async (t) => {
    await t.test("pending response", async () => {
        const result = await requestWithBggResponse(
            "/api/bgg/search?query=Catan",
            () => new Response("", { status: 202 }),
        );

        assert.equal(result.status, 503);
        assert.deepEqual(result.body, {
            error: "BoardGameGeek prépare les résultats. Réessaie dans quelques secondes.",
        });
    });

    await t.test("upstream failure", async () => {
        const result = await requestWithBggResponse(
            "/api/bgg/search?query=Catan",
            () => new Response("unavailable", { status: 503 }),
        );

        assert.equal(result.status, 502);
        assert.deepEqual(result.body, {
            error: "La recherche BoardGameGeek est temporairement indisponible.",
        });
    });
});
