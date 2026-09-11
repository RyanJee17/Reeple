import { XMLParser } from "fast-xml-parser";

const BGG_BASE_URL = "https://boardgamegeek.com/xmlapi2";

export interface BggGame {
    id: number;
    title: string;
    yearPublished?: number;
    thumbnail?: string;
    image?: string;
    rating?: number;
    owned: boolean;
}

export async function getBggCollection(username: string): Promise<BggGame[]> {
    const url =
        `${BGG_BASE_URL}/collection?` +
        `username=${encodeURIComponent(username)}` +
        `&stats=1&excludesubtype=boardgameexpansion`;

    const response = await fetch(url);

    if (response.status === 202) {
        throw new Error(
            "La collection BoardGameGeek est en cours de préparation. Réessaie dans quelques secondes.",
        );
    }

    if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
            `BoardGameGeek a répondu avec le statut ${response.status} : ${responseText}`,
        );
    }

    const xml = await response.text();

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
    });

    const parsed = parser.parse(xml);
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