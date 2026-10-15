import type { Game } from './model';

// Quoted fields, escaped quotes, CRLF, UTF-8 BOM and either common separator.
function rows(text: string): string[][] {
  text = text.replace(/^\uFEFF/, '');
  const first = text.split(/\r?\n/)[0];
  const separator = first.includes(';') ? ';' : ',';
  const result: string[][] = []; let row: string[] = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted; }
    else if (c === separator && !quoted) { row.push(field.trim()); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) { if (c === '\r' && text[i + 1] === '\n') i++; row.push(field.trim()); if (row.some(Boolean)) result.push(row); row = []; field = ''; }
    else field += c;
  }
  if (quoted) throw new Error('Un champ entre guillemets n’est pas fermé.');
  row.push(field.trim()); if (row.some(Boolean)) result.push(row);
  return result;
}
export function parseCatalogue(text: string): Game[] {
  const [headers, ...lines] = rows(text);
  if (!headers || !lines.length) throw new Error('Le fichier doit contenir un en-tête et au moins un jeu.');
  if (lines.length > 10000) throw new Error('Import limité à 10 000 références par fichier.');
  const normalized = headers.map(h => h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_'));
  const required = ['id', 'titre', 'stock', 'prix', 'joueurs_min', 'joueurs_max', 'age_min', 'duree'];
  const missing = required.filter(h => !normalized.includes(h));
  if (missing.length) throw new Error(`Colonnes manquantes : ${missing.join(', ')}. Téléchargez le modèle CSV.`);
  if (new Set(normalized).size !== normalized.length) throw new Error('Des colonnes portent le même nom.');
  const ids = new Set<string>();
  return lines.map((line, i) => {
    const at = `Ligne ${i + 2}`;
    if (line.length !== headers.length) throw new Error(`${at} : nombre de colonnes incorrect.`);
    const get = (key: string) => line[normalized.indexOf(key)] ?? '';
    const num = (key: string, fallback?: number) => { const raw = get(key); const n = raw === '' ? fallback : Number(raw.replace(',', '.')); if (n === undefined || !Number.isFinite(n) || n < 0) throw new Error(`${at} : ${key} doit être un nombre positif ou nul.`); return n; };
    const date = (key: string) => { const raw = get(key); if (!raw) return undefined; if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || !Number.isFinite(Date.parse(raw)) || new Date(raw).toISOString().slice(0,10) !== raw || raw > new Date().toISOString().slice(0,10)) throw new Error(`${at} : ${key} doit être une date valide passée ou du jour (AAAA-MM-JJ).`); return raw; };
    const id = get('id'), title = get('titre');
    if (!id || !title) throw new Error(`${at} : identifiant et titre obligatoires.`);
    if (ids.has(id)) throw new Error(`${at} : identifiant « ${id} » présent plusieurs fois.`);
    ids.add(id);
    const minPlayers = num('joueurs_min'), maxPlayers = num('joueurs_max'), stock = num('stock'), minAge = num('age_min'), minutes = num('duree'), complexity = num('complexite', 2);
    if (![stock, minPlayers, maxPlayers, minAge].every(Number.isInteger) || minPlayers < 1 || maxPlayers < minPlayers || minutes < 1 || complexity < 1 || complexity > 5) throw new Error(`${at} : vérifiez stock entier, joueurs, durée et complexité (1 à 5).`);
    const moods = get('ambiances').split('|').map(m => m.trim()).filter(Boolean);
    if (moods.some(m => !['party','strategy','story','bluff','explore','replay','coop'].includes(m))) throw new Error(`${at} : ambiance inconnue. Valeurs : party, strategy, story, bluff, explore, replay, coop.`);
    return { id, title, stock, price: num('prix'), costPrice: get('prix_achat') ? num('prix_achat') : undefined, minPlayers, maxPlayers, minAge, minutes, complexity, moods, lastSold: date('derniere_vente'), receivedAt: date('date_entree'), recommended: 0, season: get('saisonnalite') || 'Non renseignée' };
  });
}
export const CSV_TEMPLATE = '\uFEFFid;titre;stock;prix;prix_achat;joueurs_min;joueurs_max;age_min;duree;complexite;ambiances;derniere_vente;date_entree;saisonnalite\nmon-jeu;Mon premier jeu;5;29,90;15;2;4;8;30;2;coop|replay;;;Toute l’année\n';
const quote = (value: unknown) => {
  const text = String(value ?? '');
  const safe = typeof value === 'string' && /^[=+@\-\t\r]/.test(text) ? "'" + text : text;
  return `"${safe.replaceAll('"', '""')}"`;
};
export function exportCatalogue(games: Game[]) {
  const header = CSV_TEMPLATE.slice(1).split('\n')[0];
  return '\uFEFF' + header + '\n' + games.map(g => [g.id, g.title, g.stock, g.price, g.costPrice, g.minPlayers, g.maxPlayers, g.minAge, g.minutes, g.complexity, g.moods.join('|'), g.lastSold, g.receivedAt, g.season].map(quote).join(';')).join('\n');
}
