import { XMLParser } from 'fast-xml-parser';

export class BggApiError extends Error {
  constructor(message: string, public code: string, public status: number = 502) { super(message); this.name = 'BggApiError'; }
}
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
const cache = new Map<string, { expires: number; value: unknown }>();
const inFlight = new Map<string, Promise<any>>();
let queue: Promise<void> = Promise.resolve();
let nextRequest = 0;
let queued = 0;

export function isBggConfigured() { return !!process.env.BGG_API_TOKEN?.trim(); }
export async function fetchBggXml(path: string, ttl = 300000): Promise<any> {
  const token = process.env.BGG_API_TOKEN?.trim();
  if (!token) throw new BggApiError('La connexion BGG nécessite un jeton. Configurez BGG_API_TOKEN dans backend/.env puis redémarrez l’API.', 'BGG_NOT_CONFIGURED', 503);
  const cached = cache.get(path);
  if (cached && cached.expires > Date.now()) return cached.value;
  const pending = inFlight.get(path); if (pending) return pending;
  if (queued >= 15) throw new BggApiError('Plusieurs demandes sont déjà en cours. Réessayez dans un instant.', 'BGG_BUSY', 429);
  queued++;
  const task = queue.then(async () => {
    const wait = Math.max(0, nextRequest - Date.now());
    if (wait) await new Promise(resolve => setTimeout(resolve, wait));
    nextRequest = Date.now() + 1500;
    let response: Response;
    try { response = await fetch(`https://boardgamegeek.com/xmlapi2/${path}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/xml' }, signal: AbortSignal.timeout(15000), redirect: 'error' }); }
    catch { throw new BggApiError('BoardGameGeek ne répond pas. Vérifiez la connexion puis réessayez.', 'BGG_UNAVAILABLE'); }
    if (response.status === 202) throw new BggApiError('BoardGameGeek prépare les résultats. Réessayez dans quelques secondes.', 'BGG_PENDING', 503);
    if (response.status === 401 || response.status === 403) throw new BggApiError('BoardGameGeek refuse l’accès. Vérifiez le jeton et l’approbation de l’application sur BGG.', 'BGG_UNAUTHORIZED', 503);
    if (response.status === 429) { nextRequest = Date.now() + 10000; throw new BggApiError('La limite de requêtes BGG est atteinte. Patientez avant de réessayer.', 'BGG_RATE_LIMITED', 429); }
    if (!response.ok) throw new BggApiError('BoardGameGeek est temporairement indisponible.', 'BGG_UNAVAILABLE');
    const xml = await response.text();
    if (xml.length > 3000000 || !xml.trimStart().startsWith('<')) throw new BggApiError('La réponse de BoardGameGeek est invalide.', 'BGG_INVALID_RESPONSE');
    let value: any;
    try { value = parser.parse(xml); } catch { throw new BggApiError('La réponse de BoardGameGeek est illisible.', 'BGG_INVALID_RESPONSE'); }
    if (!value?.items || value.items.error) throw new BggApiError('BoardGameGeek n’a pas fourni de données exploitables.', 'BGG_INVALID_RESPONSE');
    if (cache.size >= 200) cache.delete(cache.keys().next().value!);
    cache.set(path, { value, expires: Date.now() + ttl });
    return value;
  });
  queue = task.then(() => undefined, () => undefined);
  inFlight.set(path, task);
  try { return await task; } finally { queued--; inFlight.delete(path); }
}
