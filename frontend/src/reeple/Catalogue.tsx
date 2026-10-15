import { useState } from 'react';
import { Archive, Sparkles, Gift, TrendingUp, Check, Clock3, Undo2, Search, SlidersHorizontal, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/ui/card';
import { GameVisual } from './Advice';
import { categories, daysSince, eligibleGames, money, type Category, type Game } from './model';
import { entry, useWorkspace } from './store';
import { BggCredit, BggImport } from './BggImport';

const icons = { dormant: Archive, new: Sparkles, bundle: Gift, trend: TrendingUp };
export function Catalogue({ openImport }: { openImport: () => void }) {
  const { data, update } = useWorkspace();
  const [category, setCategory] = useState<Category>('trend');
  const [query, setQuery] = useState('');
  const [minimumStock, setMinimumStock] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>('bomb-busters');
  const [showBgg, setShowBgg] = useState(false);
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const games = eligibleGames(data, category).filter(g => normalize(g.title).includes(normalize(query)) && g.stock >= minimumStock);
  const game = games.find(g => g.id === selectedId) ?? games[0];
  const type = categories.find(c => c.id === category)!;
  const Icon = icons[category];
  const dormant = eligibleGames(data, 'dormant');
  const dormantValue = dormant.reduce((total, g) => total + g.stock * (g.costPrice ?? 0), 0);
  const valued = dormant.filter(g => g.costPrice !== undefined).length;
  const bundle = game ? data.games.find(other => other.id !== game.id && other.stock > 0 && other.moods.some(m => game.moods.includes(m))) : undefined;
  function complete(game: Game, status: 'done' | 'later') {
    const key = `${category}:${game.id}`, oldAction = data.actions.find(a => a.key === key);
    const at = new Date().toISOString();
    update(d => ({ ...d, actions: [...d.actions.filter(a => a.key !== key), { key, gameId: game.id, category, status, at, ...(status === 'later' ? { until: new Date(Date.now() + 86400000).toISOString() } : {}) }], logs: [entry(`${game.title} · ${type.title} : ${status === 'done' ? 'traité' : 'reporté de 24 h'}`), ...d.logs].slice(0, 500) }));
    toast.success(status === 'done' ? 'Traitement enregistré' : 'Suggestion reportée de 24 h', { action: { label: 'Annuler', onClick: () => update(d => ({ ...d, actions: [...d.actions.filter(a => a.key !== key), ...(oldAction ? [oldAction] : [])], logs: [entry(`Action annulée : ${game.title}`), ...d.logs].slice(0, 500) })) } });
  }
  return <section className="reeple-catalogue" aria-label="Catalogue vivant"><BggImport open={showBgg} onClose={() => setShowBgg(false)} />
    <div className="reeple-filters"><button className="reeple-filter-toggle" aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={20} />Filtres</button><div className="reeple-category-tabs" role="group" aria-label="Types de suggestions">{categories.map(c => { const TabIcon = icons[c.id]; return <button key={c.id} className={category === c.id ? 'active' : ''} onClick={() => { setCategory(c.id); setSelectedId(null); }} aria-pressed={category === c.id}><TabIcon size={16} /><span>{c.title}</span><b>{eligibleGames(data, c.id).length}</b></button>; })}</div></div>
    {showFilters && <div className="reeple-search-filters"><label><Search size={18} /><input aria-label="Chercher un jeu" placeholder="Chercher dans ces suggestions…" value={query} onChange={e => setQuery(e.target.value)} /></label><label>Stock minimum<input type="number" min="1" max="1000000" value={minimumStock} onChange={e => setMinimumStock(Math.min(1000000, Math.max(1, Number(e.target.value))))} /></label><button className="reeple-text-button" onClick={() => { setQuery(''); setMinimumStock(1); }}>Réinitialiser</button></div>}
    <div className="reeple-catalogue-summary"><span>{games.length} suggestion{games.length !== 1 ? 's' : ''} à parcourir</span><div className="reeple-catalogue-tools"><button onClick={() => setShowBgg(true)}><Search size={14} />Chercher sur BGG</button><button onClick={openImport}>Importer mon catalogue<ArrowRight size={14} /></button></div></div>
    {game ? <div className="reeple-catalogue-grid"><aside className="reeple-context-column">
      <Card className="reeple-panel"><h2>Contexte boutique</h2><dl className="reeple-context-list"><div><dt>Dernière vente</dt><dd>{daysSince(game.lastSold) !== null ? `Il y a ${daysSince(game.lastSold)} jours` : 'Non renseignée'}</dd></div><div><dt>Volume conseillé</dt><dd>{game.recommended} fois enregistrées</dd></div><div><dt>Saisonnalité</dt><dd>{game.season}</dd></div></dl></Card>
      <Card className="reeple-panel"><h2>Ce que Reeple suggère</h2>
        {category === 'trend' && <><h3>Remettre en avant les jeux conseillés</h3><p>{game.title} a été conseillé {game.recommended} fois dans cet espace. Présentez-le en rayon et observez les retours.</p><div className="reeple-note">Ce compteur reflète les conseils enregistrés, pas des achats clients. Aucune donnée de caisse n’est connectée.</div></>}
        {category === 'dormant' && <><h3>Redonner sa chance à {game.title}</h3><p>Aucune vente renseignée depuis {daysSince(game.lastSold)} jours. Essayez une mise en avant ou une démonstration avant de commander à nouveau.</p><div className="reeple-note">Seuil : {data.preferences.dormantDays} jours sans vente. Un stock dormant n’est pas automatiquement une perte.</div></>}
        {category === 'new' && <><h3>Découvrir avant de recommander</h3><p>Entré au catalogue il y a {daysSince(game.receivedAt)} jours. Prenez quelques minutes pour vérifier les règles, le public et sa place dans votre sélection.</p><div className="reeple-note">Nouveauté dans la boutique, selon la date d’entrée. Cela ne renseigne pas la date de sortie nationale.</div></>}
        {category === 'bundle' && <><h3>{bundle ? `À côté de ${bundle.title}` : 'Une association à explorer'}</h3><p>Une ambiance en commun peut donner une idée de présentation en rayon. Vérifiez que les deux jeux se complètent pour votre clientèle.</p>{bundle && <div className="reeple-note">Prix séparés cumulés : {money(game.price + bundle.price)}. Aucune remise ni offre commerciale créée automatiquement.</div>}</>}
      </Card>
      <Card className="reeple-panel reeple-other-games"><h2>Dans cette sélection</h2>{games.map(g => <button key={g.id} className={g.id === game.id ? 'active' : ''} onClick={() => setSelectedId(g.id)}><span>{g.title}</span><span>{g.stock} en stock</span></button>)}</Card>
    </aside><div className="reeple-suggestion-column"><Card className="reeple-suggestion-card"><span className="reeple-type-pill"><Icon size={16} />{type.label}</span><GameVisual game={game} />
      <h2>{category === 'dormant' ? `${daysSince(game.lastSold)} jours sans vente renseignée` : category === 'new' ? `Entré au catalogue il y a ${daysSince(game.receivedAt)} jours` : category === 'bundle' ? 'Une association à explorer dans votre stock' : 'Un jeu qui revient dans vos conseils'}</h2>
      <p>{game.note || 'Une référence de votre catalogue à examiner. Les critères renseignés servent de point de départ ; le choix reste entre vos mains.'}</p>
      <div className="reeple-game-stats"><div><span>{game.rating ? game.bgg ? 'Note BGG' : 'Note BGG · démo' : 'Prix de vente'}</span><strong>{game.rating ? `${game.rating.toFixed(2)} / 10` : money(game.price)}</strong></div><div><span>Stock</span><strong>{game.stock}</strong></div><div><span>Conseils enregistrés</span><strong>{game.recommended}</strong></div></div><BggCredit game={game} />
    </Card><div className="reeple-decision-actions"><button className="reeple-button" onClick={() => complete(game, 'later')}><Clock3 size={16} />Traiter plus tard</button><button className="reeple-button navy" onClick={() => complete(game, 'done')}>Traitement terminé<Check size={18} /></button></div><p className="reeple-method-note">« Terminé » archive la suggestion dans ce filtre. Aucun message client n’est envoyé et le stock reste inchangé.</p></div></div> : <Card className="reeple-empty"><Package size={44} /><h1>Tout est à jour dans cette sélection.</h1><p>Les suggestions traitées sont dans le journal. Celles reportées réapparaîtront après 24 heures.</p><div className="reeple-inline-actions"><button className="reeple-button" onClick={() => { setQuery(''); setMinimumStock(1); }}>Effacer les filtres</button><button className="reeple-button navy" onClick={() => update(d => ({ ...d, actions: d.actions.filter(a => a.category !== category), logs: [entry(`Suggestions réouvertes : ${type.title}`), ...d.logs].slice(0, 500) }), 'Suggestions réouvertes')}><Undo2 size={16} />Revoir les suggestions</button></div></Card>}
    {category === 'dormant' && <p className="reeple-method-note">{dormant.length} références en stock dépassent le seuil. {valued ? `Valeur au prix d’achat renseigné : ${money(dormantValue)} (${valued}/${dormant.length} références chiffrées).` : 'Le prix d’achat manque : la valeur immobilisée n’est pas calculée à partir du prix de vente.'}</p>}
  </section>;
}
