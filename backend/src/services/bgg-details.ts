import { BggApiError, fetchBggXml } from './bgg-client';

export interface BggDetails {
  id: number; title: string; yearPublished?: number; image?: string; thumbnail?: string;
  minPlayers?: number; maxPlayers?: number; minAge?: number; minutes?: number;
  complexity?: number; rating?: number; categories: string[]; mechanics: string[];
  url: string; retrievedAt: string;
}
const asArray = (value: any) => value == null ? [] : Array.isArray(value) ? value : [value];
function number(value: any): number | undefined { const n = Number(value?.['@_value'] ?? value); return Number.isFinite(n) && n > 0 ? n : undefined; }
function image(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  try { const url = new URL(value); return url.protocol === 'https:' && ['cf.geekdo-images.com', 'cf.geekdo-static.com'].includes(url.hostname) ? url.href : undefined; } catch { return; }
}
export async function getBggDetails(id: number): Promise<BggDetails> {
  const parsed = await fetchBggXml(`thing?id=${id}&type=boardgame&stats=1`, 86400000);
  const item = asArray(parsed.items.item).find((item: any) => Number(item['@_id']) === id && item['@_type'] === 'boardgame');
  if (!item) throw new BggApiError('Cette fiche de jeu est introuvable sur BGG.', 'BGG_NOT_FOUND', 404);
  const names = asArray(item.name), name = names.find((n: any) => n['@_type'] === 'primary') ?? names[0];
  const title = name?.['@_value'];
  if (typeof title !== 'string' || !title) throw new BggApiError('La fiche BGG ne contient pas de titre.', 'BGG_INVALID_RESPONSE');
  const links = asArray(item.link);
  const linkValues = (type: string): string[] => links.filter((l: any) => l['@_type'] === type && typeof l['@_value'] === 'string').map((l: any) => l['@_value']);
  return { id, title, yearPublished: number(item.yearpublished), image: image(item.image), thumbnail: image(item.thumbnail), minPlayers: number(item.minplayers), maxPlayers: number(item.maxplayers), minAge: number(item.minage), minutes: number(item.playingtime), complexity: number(item.statistics?.ratings?.averageweight), rating: number(item.statistics?.ratings?.average), categories: linkValues('boardgamecategory'), mechanics: linkValues('boardgamemechanic'), url: `https://boardgamegeek.com/boardgame/${id}`, retrievedAt: new Date().toISOString() };
}
