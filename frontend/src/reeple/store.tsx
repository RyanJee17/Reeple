import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { initialData, refreshAssets, type AppData, type Game, type LogEntry } from './model';

const KEY = 'reeple.workspace.v1';
export function isGame(value: unknown): value is Game {
  if (!value || typeof value !== 'object') return false;
  const g = value as Game;
  return typeof g.id === 'string' && !!g.id && typeof g.title === 'string' && !!g.title.trim() &&
    [g.minPlayers, g.maxPlayers, g.minAge, g.minutes, g.complexity, g.price, g.stock, g.recommended].every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0) &&
    Number.isInteger(g.stock) && g.minPlayers >= 1 && g.maxPlayers >= g.minPlayers && g.minutes > 0 && g.complexity >= 1 && g.complexity <= 5 &&
    Array.isArray(g.moods) && g.moods.every(m => typeof m === 'string') && typeof g.season === 'string' &&
    (!g.image || /^(data:image\/(png|jpeg|webp);base64,|\/(?!\/)|https:\/\/cf\.geekdo-(images|static)\.com\/)/.test(g.image)) &&
    (!g.demoReference || (Number.isInteger(g.demoReference.id) && g.demoReference.id > 0 && typeof g.demoReference.title === 'string' && Number.isInteger(g.demoReference.year) && typeof g.demoReference.durationLabel === 'string' && Number.isFinite(Date.parse(g.demoReference.checkedAt)) && [g.demoReference.minPlayers, g.demoReference.maxPlayers, g.demoReference.minAge, g.demoReference.minutes].every(n => Number.isFinite(n) && n >= 0) && g.demoReference.minPlayers >= 1 && g.demoReference.maxPlayers >= g.demoReference.minPlayers && g.demoReference.minutes > 0)) &&
    (!g.bgg || (Number.isInteger(g.bgg.id) && g.bgg.id > 0 && typeof g.bgg.title === 'string' && Number.isFinite(Date.parse(g.bgg.retrievedAt)) && Array.isArray(g.bgg.categories) && g.bgg.categories.every(c => typeof c === 'string') && Array.isArray(g.bgg.mechanics) && g.bgg.mechanics.every(m => typeof m === 'string'))) &&
    [g.lastSold, g.receivedAt].every(d => d === undefined || (typeof d === 'string' && Number.isFinite(Date.parse(d))));
}
export function validateData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false;
  const d = value as AppData;
  return d.version === 1 && typeof d.demo === 'boolean' && Array.isArray(d.games) && d.games.length <= 10000 && d.games.every(isGame) && new Set(d.games.map(g => g.id)).size === d.games.length &&
    !!d.shop && ['name', 'address', 'city', 'postcode', 'description', 'firstName', 'email', 'logo'].every(k => typeof d.shop[k as keyof typeof d.shop] === 'string') &&
    (!!d.shop.name.trim()) && (!d.shop.logo || /^(data:image\/(png|jpeg|webp);base64,|\/)/.test(d.shop.logo)) &&
    !!d.preferences && [d.preferences.dormantDays, d.preferences.noveltyDays].every(n => Number.isInteger(n) && n >= 1 && n <= 730) && typeof d.preferences.onlyInStock === 'boolean' &&
    Array.isArray(d.actions) && d.actions.every(a => typeof a.key === 'string' && typeof a.gameId === 'string' && ['dormant','new','bundle','trend'].includes(a.category) && ['done','later'].includes(a.status) && Number.isFinite(Date.parse(a.at)) && (!a.until || Number.isFinite(Date.parse(a.until)))) &&
    Array.isArray(d.logs) && d.logs.every(l => typeof l.id === 'string' && typeof l.text === 'string' && Number.isFinite(Date.parse(l.at)));
}
function loadData(): AppData {
  try { const raw = localStorage.getItem(KEY); if (raw) { const parsed: unknown = JSON.parse(raw); if (validateData(parsed)) return refreshAssets(parsed); localStorage.setItem(`${KEY}.recovery`, raw); } } catch { /* Private mode or damaged backup: start an isolated demo. */ }
  return initialData();
}
type Context = { data: AppData; update: (change: (previous: AppData) => AppData, message?: string) => void; saved: boolean };
const Workspace = createContext<Context | null>(null);
export const entry = (text: string): LogEntry => ({ id: crypto.randomUUID(), at: new Date().toISOString(), text });
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(loadData);
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); setSaved(true); }
    catch { setSaved(false); toast.error('La sauvegarde locale est indisponible ou pleine. Exportez vos données depuis les réglages.', { id: 'storage-error', duration: 10000 }); }
  }, [data]);
  const update: Context['update'] = (change, message) => { setData(change); if (message) toast.success(message); };
  return <Workspace.Provider value={{ data, update, saved }}>{children}</Workspace.Provider>;
}
export function useWorkspace() { const value = useContext(Workspace); if (!value) throw new Error('Workspace manquant'); return value; }
export function downloadFile(name: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
