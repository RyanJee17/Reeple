import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Search, ExternalLink, Check, ArrowLeft, AlertCircle, LoaderCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { toast } from 'sonner';
import { useWorkspace, entry } from './store';
import type { Game } from './model';

interface SearchGame { id: number; title: string; yearPublished?: number; }
interface Details { id: number; title: string; yearPublished?: number; image?: string; thumbnail?: string; minPlayers?: number; maxPlayers?: number; minAge?: number; minutes?: number; complexity?: number; rating?: number; categories: string[]; mechanics: string[]; retrievedAt: string; }
async function api<T>(path: string, signal: AbortSignal): Promise<T> {
  let response: Response;
  try { response = await fetch(path, { signal }); }
  catch (e) { if (signal.aborted) throw e; throw new Error('Connexion indisponible. Lancez le backend Reeple, puis réessayez.'); }
  let body: any;
  try { body = await response.json(); } catch { throw new Error('L’API Reeple est indisponible. Vérifiez que le backend est démarré.'); }
  if (!response.ok) throw new Error(typeof body.error === 'string' ? body.error : 'BoardGameGeek est temporairement indisponible.');
  return body as T;
}
const moods = [{ id: 'party', name: 'Ambiance' }, { id: 'strategy', name: 'Stratégie' }, { id: 'story', name: 'Narratif' }, { id: 'bluff', name: 'Bluff / déduction' }, { id: 'explore', name: 'Exploration' }, { id: 'replay', name: 'Rejouabilité' }, { id: 'coop', name: 'Coopération' }];
export function BggCredit({ game }: { game: Game }) {
  if (!game.bgg && game.demoReference) return <p className="reeple-bgg-credit"><a href={`https://boardgamegeek.com/boardgame/${game.demoReference.id}`} target="_blank" rel="noopener noreferrer">Voir {game.demoReference.title} sur BoardGameGeek<ExternalLink size={12} /></a><span>{game.demoReference.year} · {game.demoReference.durationLabel} · Référence vérifiée manuellement, sans synchronisation API.</span></p>;
  if (!game.bgg) return null;
  return <p className="reeple-bgg-credit"><a href={`https://boardgamegeek.com/boardgame/${game.bgg.id}`} target="_blank" rel="noopener noreferrer">Powered by BoardGameGeek<ExternalLink size={12} /></a><span>Fiche récupérée le {new Date(game.bgg.retrievedAt).toLocaleDateString('fr-FR')}</span></p>;
}
export function BggImport({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, update } = useWorkspace();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchGame[] | null>(null);
  const [details, setDetails] = useState<Details | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'checking' | 'ready' | 'missing' | 'offline'>('checking');
  const [target, setTarget] = useState('new');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [age, setAge] = useState('');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [minutes, setMinutes] = useState('');
  const [complexity, setComplexity] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    if (!open) return;
    setStatus('checking'); setError('');
    const abort = new AbortController();
    api<{ configured: boolean }>('/api/bgg/status', abort.signal).then(s => setStatus(s.configured ? 'ready' : 'missing')).catch(() => { if (!abort.signal.aborted) setStatus('offline'); });
    return () => { abort.abort(); controller.current?.abort(); };
  }, [open]);
  async function search(e: FormEvent) {
    e.preventDefault(); if (!query.trim()) return;
    controller.current?.abort(); const abort = new AbortController(); controller.current = abort;
    setLoading(true); setError(''); setDetails(null); setResults(null);
    try { const response = await api<{ games: SearchGame[] }>(`/api/bgg/search?query=${encodeURIComponent(query.trim())}`, abort.signal); if (!Array.isArray(response.games)) throw new Error('Les résultats BGG sont illisibles.'); setResults(response.games); }
    catch (e) { if (!abort.signal.aborted) setError(e instanceof Error ? e.message : 'Recherche indisponible.'); }
    finally { if (!abort.signal.aborted) setLoading(false); }
  }
  function fillForGame(id: string, detail: Details) {
    const existing = data.games.find(g => g.id === id);
    setTarget(existing?.id ?? 'new'); setStock(existing ? String(existing.stock) : ''); setPrice(existing ? String(existing.price) : '');
    setMinPlayers(String(detail.minPlayers ?? existing?.minPlayers ?? '')); setMaxPlayers(String(detail.maxPlayers ?? existing?.maxPlayers ?? ''));
    setAge(String(detail.minAge ?? existing?.minAge ?? '')); setMinutes(String(detail.minutes ?? existing?.minutes ?? '')); setComplexity(String(detail.complexity ?? existing?.complexity ?? ''));
    setSelectedMoods(existing?.moods ?? []);
  }
  async function select(game: SearchGame) {
    controller.current?.abort(); const abort = new AbortController(); controller.current = abort; setLoading(true); setError('');
    try {
      const detail = await api<Details>(`/api/bgg/games/${game.id}`, abort.signal);
      if (!detail.id || !detail.title || !Array.isArray(detail.mechanics) || !Array.isArray(detail.categories)) throw new Error('La fiche BGG est illisible.');
      setDetails(detail);
      const sameGame = data.games.find(g => g.bgg?.id === detail.id || g.id === `bgg-${detail.id}` || g.title.toLocaleLowerCase() === detail.title.toLocaleLowerCase());
      fillForGame(sameGame?.id ?? 'new', detail);
    } catch (e) { if (!abort.signal.aborted) setError(e instanceof Error ? e.message : 'Fiche indisponible.'); }
    finally { if (!abort.signal.aborted) setLoading(false); }
  }
  function add(e: FormEvent) {
    e.preventDefault(); if (!details) return;
    const existingBgg = data.games.find(g => g.bgg?.id === details.id);
    if (existingBgg && target !== existingBgg.id) { toast.error('Cette fiche BGG est déjà liée à une référence. Sélectionnez-la pour la mettre à jour.'); return; }
    if (Number(maxPlayers) < Number(minPlayers)) { toast.error('Le maximum de joueurs doit être supérieur ou égal au minimum.'); return; }
    if (target === 'new' && data.games.length >= 10000) { toast.error('Votre catalogue contient déjà 10 000 références.'); return; }
    const old = data.games.find(g => g.id === target);
    const game: Game = { ...old, id: old?.id ?? `bgg-${details.id}`, title: details.title, image: details.image ?? details.thumbnail ?? old?.image, minPlayers: Number(minPlayers), maxPlayers: Number(maxPlayers), minAge: Number(age), minutes: Number(minutes), complexity: Number(complexity), stock: Number(stock), price: Number(price), moods: selectedMoods, recommended: old?.recommended ?? 0, season: old?.season ?? 'Non renseignée', rating: details.rating, note: undefined, bgg: { id: details.id, title: details.title, categories: details.categories, mechanics: details.mechanics, retrievedAt: details.retrievedAt } };
    update(d => ({ ...d, games: [...d.games.filter(g => g.id !== game.id), game], logs: [entry(`Fiche BGG ${details.id} ${old ? 'liée à' : 'ajoutée au'} catalogue : ${details.title}`), ...d.logs].slice(0,500) }), `${details.title} ${old ? 'mis à jour' : 'ajouté au catalogue'}`);
    setDetails(null); setResults(null); setQuery(''); onClose();
  }
  return <Dialog open={open} onOpenChange={value => { if (!value) { setLoading(false); onClose(); } }}><DialogContent className="reeple-modal reeple-bgg-modal"><DialogTitle>{details ? 'Ajouter une vraie fiche de jeu' : 'Rechercher sur BoardGameGeek'}</DialogTitle><DialogDescription>Les informations du jeu viennent de BGG. Les prix, stocks et dates de vente restent ceux de votre boutique.</DialogDescription>
    {status === 'missing' && <div className="reeple-note">La connexion BGG n’est pas encore configurée. Le développeur doit ajouter le jeton BGG côté serveur. <a href="https://boardgamegeek.com/applications" target="_blank" rel="noopener noreferrer">Gérer l’application BGG ↗</a></div>}
    {status === 'offline' && <div className="reeple-note">Le backend Reeple n’est pas accessible. Lancez-le pour utiliser la recherche BGG.</div>}
    {!details && <><form className="reeple-bgg-search" onSubmit={search}><input aria-label="Nom du jeu sur BGG" type="search" required maxLength={150} placeholder="Bomb Busters, Azul, Wingspan…" value={query} onChange={e => setQuery(e.target.value)} /><button type="submit" className="reeple-button navy" disabled={loading}><Search size={16} />Rechercher</button></form>{results && <div className="reeple-bgg-list"><p>{results.length} résultat{results.length !== 1 ? 's' : ''}{results.length > 50 ? ' · 50 premiers affichés, affinez votre recherche' : ''}</p>{results.slice(0,50).map(game => <button key={game.id} disabled={loading} onClick={() => select(game)}><span><strong>{game.title}</strong><small>{game.yearPublished ?? 'Année inconnue'} · BGG #{game.id}</small></span><span>Voir la fiche →</span></button>)}{!results.length && <p>Aucun jeu trouvé. Essayez son titre original ou un mot plus court.</p>}</div>}</>}
    {loading && <p role="status" className="reeple-loading"><LoaderCircle size={18} />Chargement depuis BoardGameGeek…</p>}
    {error && <p className="reeple-error" role="alert"><AlertCircle size={18} />{error}</p>}
    {details && <form onSubmit={add}><div className="reeple-bgg-detail">{(details.image || details.thumbnail) && <img src={details.image ?? details.thumbnail} alt={details.title} />}<div><h3>{details.title}</h3><p>{details.yearPublished ?? ''}{details.rating ? ` · Note BGG : ${details.rating.toFixed(2)} / 10` : ''}</p><a href={`https://boardgamegeek.com/boardgame/${details.id}`} target="_blank" rel="noopener noreferrer">Voir la fiche originale<ExternalLink size={13} /></a></div></div>
      <label className="reeple-field">Référence dans votre catalogue<select value={target} onChange={e => fillForGame(e.target.value, details)}><option value="new">Créer une nouvelle référence</option>{data.games.map(g => <option key={g.id} value={g.id}>Mettre à jour : {g.title}</option>)}</select></label>
      <div className="reeple-form-grid"><label>Stock boutique<input required type="number" min={0} max={1000000} step={1} value={stock} onChange={e => setStock(e.target.value)} /></label><label>Prix de vente (€)<input required type="number" min={0} step="0.01" value={price} onChange={e => setPrice(e.target.value)} /></label><label>Joueurs minimum<input required type="number" min={1} step={1} value={minPlayers} onChange={e => setMinPlayers(e.target.value)} /></label><label>Joueurs maximum<input required type="number" min={1} step={1} value={maxPlayers} onChange={e => setMaxPlayers(e.target.value)} /></label><label>Âge minimum<input required type="number" min={0} step={1} value={age} onChange={e => setAge(e.target.value)} /></label><label>Durée (min)<input required type="number" min={1} step={1} value={minutes} onChange={e => setMinutes(e.target.value)} /></label><label>Complexité / 5<input required type="number" min={1} max={5} step="0.0001" value={complexity} onChange={e => setComplexity(e.target.value)} /></label></div>
      <p className="reeple-method-note">Catégories BGG : {details.categories.join(', ') || 'non renseignées'}. Mécaniques : {details.mechanics.join(', ') || 'non renseignées'}. Complétez les informations manquantes.</p>
      <fieldset className="reeple-mood-picker"><legend>Ambiances de conseil · à qualifier en boutique</legend>{moods.map(m => <label key={m.id}><input type="checkbox" checked={selectedMoods.includes(m.id)} onChange={e => setSelectedMoods(old => e.target.checked ? [...old, m.id] : old.filter(id => id !== m.id))} />{m.name}</label>)}</fieldset><p className="reeple-method-note">Sans ambiance renseignée, le jeu n’apparaîtra pas si le client filtre sur une ambiance. Les photos BGG nécessitent une connexion. {data.demo ? 'Votre espace contient encore des références de démonstration.' : ''}</p>
      <div className="reeple-inline-actions"><button className="reeple-button" type="button" onClick={() => setDetails(null)}><ArrowLeft size={16} />Résultats</button><button className="reeple-button coral" type="submit"><Check size={16} />{target === 'new' ? 'Ajouter au catalogue' : 'Confirmer la mise à jour'}</button></div></form>}
    <p className="reeple-bgg-credit"><a href="https://boardgamegeek.com" target="_blank" rel="noopener noreferrer">Powered by BoardGameGeek<ExternalLink size={12} /></a></p>
  </DialogContent></Dialog>;
}
