import { fetchBggXml } from './bgg-client';

const BGG_BASE_URL = "https://boardgamegeek.com/xmlapi2";

export interface BggSearchGame {
    id: number;
    title: string;
    yearPublished?: number;
}

export interface BggSearchResponse {
    query: string;
    total: number;
    games: BggSearchGame[];
}

export class BggSearchPendingError extends Error {
    constructor() {
        super("BoardGameGeek prépare les résultats. Réessaie dans quelques secondes.");
        this.name = "BggSearchPendingError";
    }
}

export interface BggGame {
    id: number;
    title: string;
    yearPublished?: number;
    thumbnail?: string;
    image?: string;
    rating?: number;
    owned: boolean;
}

function getPrimaryName(rawName: unknown): string | undefined {
    const names = Array.isArray(rawName) ? rawName : [rawName];
    const primaryName = names.find(
        (name) =>
            typeof name === "object" &&
            name !== null &&
            (name as Record<string, unknown>)["@_type"] === "primary",
    );
    const candidate = primaryName ?? names[0];

    if (typeof candidate === "string") {
        return candidate;
    }

    if (typeof candidate === "object" && candidate !== null) {
        const value = (candidate as Record<string, unknown>)["@_value"];
        return typeof value === "string" ? value : undefined;
    }

    return undefined;
}

export async function searchBggGames(query: string): Promise<BggSearchGame[]> {
    const params = new URLSearchParams({ query, type: "boardgame" });
    const parsed = await fetchBggXml(`search?${params.toString()}`);


    if (!parsed?.items || typeof parsed.items !== "object") {
        throw new Error("La réponse de recherche BoardGameGeek est invalide.");
    }

    const rawItems = parsed.items.item ?? [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    return items.flatMap((item: unknown): BggSearchGame[] => {
        if (typeof item !== "object" || item === null) {
            return [];
        }

        const attributes = item as Record<string, unknown>;
        if (attributes["@_type"] !== "boardgame") {
            return [];
        }

        const id = Number(attributes["@_id"]);
        const title = getPrimaryName(attributes.name);
        if (!Number.isFinite(id) || !title) {
            return [];
        }

        const rawYear = attributes.yearpublished;
        const yearValue =
            typeof rawYear === "object" && rawYear !== null
                ? (rawYear as Record<string, unknown>)["@_value"]
                : undefined;
        const year = Number(yearValue);

        return [
            {
                id,
                title,
                ...(Number.isFinite(year) ? { yearPublished: year } : {}),
            },
        ];
    });
}

export async function getBggCollection(username: string): Promise<BggGame[]> {
    const url =
        `${BGG_BASE_URL}/collection?` +
        `username=${encodeURIComponent(username)}` +
        `&stats=1&excludesubtype=boardgameexpansion`;

    const parsed = await fetchBggXml(url.slice(BGG_BASE_URL.length + 1));
    const rawItems = parsed?.items?.item ?? [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    return items.map((item: any): BggGame => {
        const rawName = item.name;

        return {
            id: Number(item["@_objectid"]),
            title:
                typeof rawName === "object" ? rawName["#text"] : rawName ?? "Jeu sans nom",
            yearPublished: item.yearpublished
                ? Number(item.yearpublished)
                : undefined,
            thumbnail: item.thumbnail,
            image: item.image,
            rating: item.stats?.rating?.["@_value"]
                ? Number(item.stats.rating["@_value"])
                : undefined,
            owned: item.status?.["@_own"] === "1",
        };
    });
}
