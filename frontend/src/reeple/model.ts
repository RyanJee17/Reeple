import { demoReferences, type DemoReference } from './demoReferences';
import bombImage from './assets/bomb-busters.png';
import orderImage from './assets/order-overload.png';
import crewImage from './assets/the-crew.png';
import shopImage from './assets/break-out.png';

export type Category = 'dormant' | 'new' | 'bundle' | 'trend';
export interface Game {
  id: string; title: string; image?: string; minPlayers: number; maxPlayers: number;
  minAge: number; minutes: number; complexity: number; price: number; costPrice?: number;
  stock: number; moods: string[]; lastSold?: string; receivedAt?: string;
  recommended: number; rating?: number; season: string; note?: string;
  demoReference?: DemoReference;
  bgg?: { id: number; title: string; retrievedAt: string; categories: string[]; mechanics: string[] };
}
export interface Shop { name: string; address: string; city: string; postcode: string; description: string; firstName: string; email: string; logo: string; }
export interface Preferences { dormantDays: number; noveltyDays: number; onlyInStock: boolean; }
export interface Action { key: string; gameId: string; category: Category; status: 'done' | 'later'; at: string; until?: string; }
export interface LogEntry { id: string; at: string; text: string; }
export interface AppData { version: 1; demo: boolean; games: Game[]; shop: Shop; preferences: Preferences; actions: Action[]; logs: LogEntry[]; }
export const money = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
export const dateLabel = (value: string) => new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
export function daysSince(value?: string) {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? Math.max(0, Math.floor((Date.now() - time) / 86400000)) : null;
}
const ago = (days: number) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
export const categories: { id: Category; title: string; label: string }[] = [
  { id: 'dormant', title: 'Stock dormant', label: 'À remettre en lumière' },
  { id: 'new', title: 'Sorties à arbitrer', label: 'À faire découvrir' },
  { id: 'bundle', title: 'Bundles à pousser', label: 'À associer en rayon' },
  { id: 'trend', title: 'Tendances clients', label: 'Souvent conseillé' },
];
function referenceFields(id: string) {
  const reference = demoReferences[id];
  return reference ? { minPlayers: reference.minPlayers, maxPlayers: reference.maxPlayers, minAge: reference.minAge, minutes: reference.minutes, demoReference: reference } : {};
}
export function initialData(): AppData {
  const base = { recommended: 0, season: 'Toute l’année' };
  return {
    version: 1, demo: true,
    shop: { name: 'Break Out Grenoble', address: '', city: 'Grenoble', postcode: '38000', description: 'Boutique de jeux de société indépendante. Les bons jeux, les bons conseils.', firstName: '', email: '', logo: shopImage },
    preferences: { dormantDays: 90, noveltyDays: 60, onlyInStock: true }, actions: [], logs: [],
    games: [
      { ...base, id: 'bomb-busters', title: 'Bomb Busters', image: bombImage, minPlayers: 2, maxPlayers: 5, minAge: 12, minutes: 30, complexity: 2, price: 32, stock: 17, moods: ['coop', 'bluff', 'replay'], lastSold: ago(63), receivedAt: ago(11), recommended: 2, season: 'Noël et été', note: 'Une enquête coopérative fondée sur la déduction. Les missions permettent de rejouer ensemble, avec un défi différent.' },
      { ...base, id: 'order-overload', title: 'Order Overload', image: orderImage, minPlayers: 2, maxPlayers: 6, minAge: 6, minutes: 20, complexity: 1, price: 20, stock: 3, moods: ['coop', 'party', 'replay'], lastSold: ago(3), receivedAt: ago(18), recommended: 5, note: 'Un jeu de mémoire coopératif, rapide à expliquer. Une bonne occasion de rire ensemble autour de la table.' },
      { ...base, id: 'the-crew', title: 'The Crew', image: crewImage, minPlayers: 3, maxPlayers: 5, minAge: 10, minutes: 30, complexity: 2, price: 16, stock: 26, moods: ['coop', 'replay', 'strategy'], lastSold: ago(110), receivedAt: ago(180), recommended: 8, note: 'Un jeu de plis coopératif à missions. Il offre des parties courtes et une progression à découvrir en équipe.' },
      { ...base, id: 'azul', title: 'Azul', minPlayers: 2, maxPlayers: 4, minAge: 8, minutes: 40, complexity: 1.8, price: 39.90, stock: 8, moods: ['strategy', 'replay'], lastSold: ago(95), receivedAt: ago(190), recommended: 3, note: 'Des règles accessibles et de vrais choix tactiques pour composer sa mosaïque.' },
      { ...base, id: 'just-one', title: 'Just One', minPlayers: 3, maxPlayers: 7, minAge: 8, minutes: 20, complexity: 1, price: 21.90, stock: 6, moods: ['party', 'coop', 'replay'], lastSold: ago(8), receivedAt: ago(150), recommended: 12, note: 'Un jeu de mots coopératif qui se prend en main en quelques minutes.' },
      { ...base, id: 'dixit', title: 'Dixit', minPlayers: 3, maxPlayers: 8, minAge: 8, minutes: 30, complexity: 1.2, price: 34.90, stock: 4, moods: ['story', 'party', 'replay'], lastSold: ago(102), receivedAt: ago(200), recommended: 4, note: 'Des images à interpréter pour les groupes qui aiment raconter et imaginer.' },
      { ...base, id: 'duel', title: '7 Wonders Duel', minPlayers: 2, maxPlayers: 2, minAge: 10, minutes: 30, complexity: 2.2, price: 27.90, stock: 9, moods: ['strategy', 'replay'], lastSold: ago(5), receivedAt: ago(120), recommended: 6, note: 'Un face-à-face tactique avec plusieurs façons de remporter la partie.' },
      { ...base, id: 'cartographers', title: 'Cartographers', minPlayers: 1, maxPlayers: 100, minAge: 10, minutes: 40, complexity: 1.9, price: 24.90, stock: 5, moods: ['explore', 'strategy', 'replay'], lastSold: ago(130), receivedAt: ago(160), note: 'Une carte à dessiner, des objectifs à combiner, en solo comme en groupe.' },
      { ...base, id: 'dobble', title: 'Dobble', minPlayers: 2, maxPlayers: 8, minAge: 6, minutes: 15, complexity: 1, price: 14.90, stock: 12, moods: ['party', 'replay'], lastSold: ago(2), receivedAt: ago(100), recommended: 7, note: 'Observation et réflexes pour des parties très courtes, faciles à lancer.' },
      { ...base, id: 'micro-macro', title: 'MicroMacro : Crime City', minPlayers: 1, maxPlayers: 4, minAge: 12, minutes: 30, complexity: 1.5, price: 29.90, stock: 0, moods: ['explore', 'story', 'coop'], lastSold: ago(45), receivedAt: ago(80), note: 'Une enquête visuelle à résoudre ensemble en explorant une grande carte.' },
      { ...base, id: 'cascadia', title: 'Cascadia', minPlayers: 1, maxPlayers: 4, minAge: 10, minutes: 45, complexity: 1.9, price: 39.90, stock: 7, moods: ['strategy', 'explore', 'replay'], lastSold: ago(6), receivedAt: ago(20), recommended: 4, note: 'Composer des habitats et accueillir la faune, avec des objectifs qui changent à chaque partie.' },
      { ...base, id: 'dune', title: 'Dune : Imperium', minPlayers: 1, maxPlayers: 4, minAge: 14, minutes: 120, complexity: 3, price: 59.90, stock: 2, moods: ['strategy', 'story', 'replay'], lastSold: ago(98), receivedAt: ago(190), recommended: 1, note: 'Une longue session de stratégie, avec construction de deck et placement d’agents.' },
      { ...base, id: 'wingspan', title: 'Wingspan', minPlayers: 1, maxPlayers: 5, minAge: 10, minutes: 70, complexity: 2.5, price: 59.90, costPrice: 35, stock: 6, moods: ['strategy', 'explore', 'replay'], lastSold: ago(105), receivedAt: ago(180), recommended: 5, note: 'Attirez des oiseaux dans votre réserve et combinez leurs effets pour développer votre moteur de jeu.' },
      { ...base, id: 'splendor', title: 'Splendor', minPlayers: 2, maxPlayers: 4, minAge: 10, minutes: 30, complexity: 1.8, price: 32.90, costPrice: 19, stock: 10, moods: ['strategy', 'replay'], lastSold: ago(4), receivedAt: ago(15), recommended: 7, note: 'Collectez des gemmes et développez votre réseau de cartes pour attirer les nobles.' },
      { ...base, id: 'carcassonne', title: 'Carcassonne', minPlayers: 2, maxPlayers: 5, minAge: 7, minutes: 45, complexity: 1.9, price: 29.90, costPrice: 17, stock: 8, moods: ['strategy', 'explore', 'replay'], lastSold: ago(96), receivedAt: ago(200), recommended: 4, note: 'Construisez un paysage médiéval tuile après tuile et placez vos partisans pour marquer des points.' },
    ].map(game => ({ ...game, ...referenceFields(game.id) })),
  };
}
export function eligibleGames(data: AppData, category: Category): Game[] {
  return data.games.filter(game => {
    if (game.stock <= 0) return false;
    const action = data.actions.find(a => a.key === `${category}:${game.id}`);
    if (action?.status === 'done' || (action?.until && Date.parse(action.until) > Date.now())) return false;
    if (category === 'dormant') { const days = daysSince(game.lastSold); return days !== null && days >= data.preferences.dormantDays; }
    if (category === 'new') { const days = daysSince(game.receivedAt); return days !== null && days <= data.preferences.noveltyDays; }
    if (category === 'trend') return game.recommended >= 2;
    return data.games.some(other => other.id !== game.id && other.stock > 0 && other.moods.some(m => game.moods.includes(m)));
  }).sort((a, b) => category === 'trend' ? b.recommended - a.recommended : category === 'dormant' ? (daysSince(b.lastSold) ?? 0) - (daysSince(a.lastSold) ?? 0) : (daysSince(a.receivedAt) ?? 9999) - (daysSince(b.receivedAt) ?? 9999));
}

// Vite hashes local asset URLs at each build. Rebind seed imagery after updates
// while retaining user-uploaded data URLs and all business values.
export function refreshAssets(data: AppData): AppData {
  const seed = initialData();
  const legacyDemo = data.demo && data.games.some(g => !g.bgg && !g.demoReference && seed.games.some(s => s.id === g.id && s.title === g.title));
  const games = data.games.map(g => {
    const original = seed.games.find(s => s.id === g.id);
    const image = g.image?.startsWith('/') ? original?.image : g.image;
    // Keep local shop values and API imports. Upgrade only known demo records.
    if (data.demo && !g.bgg && original && original.title === g.title) {
      return { ...g, ...referenceFields(g.id), image, rating: undefined };
    }
    return { ...g, image };
  });
  if (legacyDemo) {
    for (const game of seed.games.filter(g => ['wingspan', 'splendor', 'carcassonne'].includes(g.id))) {
      if (!games.some(g => g.id === game.id)) games.push(game);
    }
  }
  return { ...data, shop: { ...data.shop, logo: data.shop.logo.startsWith('/') ? seed.shop.logo : data.shop.logo }, games };
}
