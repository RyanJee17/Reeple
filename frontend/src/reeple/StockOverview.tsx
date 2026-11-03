import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Check, ChevronLeft, ChevronRight, Download, Info, Search, Undo2 } from 'lucide-react';
import { StockButton as Button } from './StockButton';
import { Card } from '../components/ui/card';
import { downloadFile, entry, useWorkspace } from './store';
import { activeDecision, analyseStock, STOCK_ACTION, STOCK_STATUS, type StockAction, type StockAnalysis, type StockDecision, type StockSnapshot, type StockStatus } from './stock';
import { StockChart, StockSparkline } from './StockChart';

const decimal = (value: number | null) => value === null ? '—' : value.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const isSignal = (item: StockAnalysis) => ['dormant', 'overstock', 'watch'].includes(item.status);
type StockSort = 'suggestions' | 'title' | 'age' | 'stock' | 'sales';

export function StockStatusLabel({ status }: { status: StockStatus }) {
  return <span className={`stock-status ${status}`}><span aria-hidden="true">{STOCK_STATUS[status].symbol}</span>{STOCK_STATUS[status].label}</span>;
}

function QuantityControl({ title, quantity, onChange }: { title: string; quantity: number; onChange: (value: number) => void }) {
  return <div className="stock-quantity"><Button className="stock-step" variant="ghost" aria-label={`Diminuer la quantité pour ${title}`} onClick={() => onChange(Math.max(0, quantity - 1))} disabled={quantity === 0}>−</Button><input type="number" min="0" max="1000000" step="1" aria-label={`Quantité envisagée pour ${title}`} value={quantity} onChange={event => { const value = Number(event.target.value); if (Number.isFinite(value)) onChange(Math.min(1000000, Math.max(0, Math.floor(value)))); }} /><Button className="stock-step" variant="ghost" aria-label={`Augmenter la quantité pour ${title}`} onClick={() => onChange(Math.min(1000000, quantity + 1))}>+</Button></div>;
}

interface OverviewProps { onImport: () => void }

export function StockOverview({ onImport }: OverviewProps) {
  const { data, update } = useWorkspace();
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('all');
  const [publisher, setPublisher] = useState('all');
  const [status, setStatus] = useState<StockStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [suggestionView, setSuggestionView] = useState<'list' | 'cards'>('list');
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [actionChoices, setActionChoices] = useState<Record<string, StockAction>>({});
  const [showHidden, setShowHidden] = useState(false);
  const [pageSize, setPageSize] = useState(6);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<StockSort>('suggestions');
  const [now, setNow] = useState(Date.now);
  const tableRows = useRef<Record<string, HTMLTableRowElement | null>>({});
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60_000); return () => window.clearInterval(timer); }, []);

  const snapshot: StockSnapshot = useMemo(() => data.stockSnapshot ?? {
    id: 'legacy-stock', source: 'legacy', fileName: 'Catalogue local précédent',
    references: data.games.map(game => ({ id: game.id, title: game.title, stock: game.stock, price: game.price, costPrice: game.costPrice, receivedAt: game.receivedAt, lastSold: game.lastSold })),
  }, [data.stockSnapshot, data.games]);
  const analyses = useMemo(() => snapshot.references.map(reference => analyseStock(reference, snapshot.exportedAt, data.preferences.dormantDays)), [snapshot, data.preferences.dormantDays]);
  const decisions = useMemo(() => {
    const byReference = new Map<string, StockDecision>();
    for (const decision of data.stockDecisions ?? []) {
      if (decision.snapshotId === snapshot.id && activeDecision([decision], snapshot.id, decision.referenceId, now)) {
        byReference.set(decision.referenceId, decision);
      }
    }
    return byReference;
  }, [data.stockDecisions, snapshot.id, now]);
  const families = useMemo(() => [...new Set(snapshot.references.flatMap(reference => reference.family ? [reference.family] : []))].sort((a, b) => a.localeCompare(b, 'fr')), [snapshot]);
  const publishers = useMemo(() => [...new Set(snapshot.references.flatMap(reference => reference.publisher ? [reference.publisher] : []))].sort((a, b) => a.localeCompare(b, 'fr')), [snapshot]);
  const scoped = useMemo(() => analyses.filter(item => (family === 'all' || item.reference.family === family) && (publisher === 'all' || item.reference.publisher === publisher) && normalize(item.reference.title).includes(normalize(query))), [analyses, family, publisher, query]);
  const filtered = scoped.filter(item => status === 'all' || (status === 'unavailable' ? item.missing.length > 0 : item.status === status));
  const suggestions = filtered.filter(item => isSignal(item) && !decisions.get(item.reference.id));
  const markers = useMemo(() => new Map(suggestions.map((item, index) => [item.reference.id, index + 1])), [suggestions]);
  const selected = filtered.find(item => item.reference.id === selectedId) ?? suggestions[0] ?? filtered[0];
  const selectedSuggestion = suggestions.find(item => item.reference.id === selected?.reference.id) ?? suggestions[0];
  const visibleSuggestions = selectedSuggestion && suggestions.indexOf(selectedSuggestion) >= 3
    ? [...suggestions.slice(0, 2), selectedSuggestion]
    : suggestions.slice(0, 3);
  const chartMarkers = new Map([...markers].filter(([id]) => visibleSuggestions.some(item => item.reference.id === id)));
  const hiddenCount = filtered.filter(item => ['ignored', 'later'].includes(decisions.get(item.reference.id)?.status ?? '')).length;
  const table = filtered.filter(item => showHidden || !['ignored', 'later'].includes(decisions.get(item.reference.id)?.status ?? '')).sort((a, b) => {
    if (sort === 'title') return a.reference.title.localeCompare(b.reference.title, 'fr');
    if (sort === 'age') return (b.age ?? -1) - (a.age ?? -1);
    if (sort === 'stock') return b.reference.stock - a.reference.stock;
    if (sort === 'sales') return (b.averageSales ?? -1) - (a.averageSales ?? -1);
    return Number(isSignal(b)) - Number(isSignal(a)) || a.reference.title.localeCompare(b.reference.title, 'fr');
  });
  const lastPage = Math.max(0, Math.ceil(table.length / pageSize) - 1);
  const currentPage = Math.min(page, lastPage);
  const rows = table.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const accepted = (data.stockDecisions ?? []).filter(decision => decision.snapshotId === snapshot.id && decision.status === 'accepted');
  const acceptedUnits = accepted.filter(decision => !decision.action || decision.action === 'order').reduce((total, decision) => total + decision.quantity, 0);
  const incomplete = analyses.filter(item => item.missing.length > 0).length;

  function quantity(item: StockAnalysis) {
    return drafts[`${snapshot.id}:${item.reference.id}`] ?? decisions.get(item.reference.id)?.quantity ?? item.suggestedOrder ?? item.reference.usualOrder ?? 0;
  }
  function setQuantity(item: StockAnalysis, value: number) { setDrafts(previous => ({ ...previous, [`${snapshot.id}:${item.reference.id}`]: value })); }
  function actionFor(item: StockAnalysis): StockAction { return actionChoices[`${snapshot.id}:${item.reference.id}`] ?? decisions.get(item.reference.id)?.action ?? (item.status === 'dormant' ? 'display' : 'order'); }
  function decide(item: StockAnalysis, decisionStatus: StockDecision['status']) {
    setSelectedId(decisionStatus === 'accepted' ? item.reference.id : suggestions.find(other => other.reference.id !== item.reference.id)?.reference.id ?? null);
    const at = new Date().toISOString();
    const action = actionFor(item);
    const decision: StockDecision = { snapshotId: snapshot.id, referenceId: item.reference.id, action, quantity: action === 'order' ? quantity(item) : 0, status: decisionStatus, at, ...(decisionStatus === 'later' ? { until: new Date(Date.now() + 86_400_000).toISOString() } : {}) };
    update(previous => ({ ...previous, stockDecisions: [...(previous.stockDecisions ?? []).filter(old => old.snapshotId !== snapshot.id || old.referenceId !== item.reference.id), decision], logs: [entry(`${item.reference.title} · ${decisionStatus === 'accepted' ? action === 'order' ? `quantité envisagée validée : ${decision.quantity} ex. (commande non transmise)` : `piste retenue : ${STOCK_ACTION[action]} (à réaliser en boutique)` : decisionStatus === 'ignored' ? 'suggestion ignorée' : 'suggestion reportée de 24 h'}`), ...previous.logs].slice(0, 500) }), decisionStatus === 'accepted' ? 'Décision enregistrée. L’action reste à réaliser en boutique.' : decisionStatus === 'ignored' ? 'Suggestion ignorée' : 'Suggestion reportée de 24 h');
  }
  function reopen(item: StockAnalysis) {
    update(previous => ({ ...previous, stockDecisions: (previous.stockDecisions ?? []).filter(old => old.snapshotId !== snapshot.id || old.referenceId !== item.reference.id), logs: [entry(`Décision rouverte : ${item.reference.title}`), ...previous.logs].slice(0, 500) }), 'Vous pouvez modifier votre décision');
  }
  function viewRow(id: string) {
    setSelectedId(id);
    const index = table.findIndex(item => item.reference.id === id);
    if (index >= 0) setPage(Math.floor(index / pageSize));
    window.setTimeout(() => { tableRows.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); tableRows.current[id]?.focus({ preventScroll: true }); }, 0);
  }
  function resetFilters() { setQuery(''); setFamily('all'); setPublisher('all'); setStatus('all'); setPage(0); }
  function exportDecisions() {
    const quote = (value: unknown) => { const text = String(value ?? ''); return `"${(/^[=+@\-\t\r]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`; };
    const lines = accepted.map(decision => [decision.referenceId, snapshot.references.find(reference => reference.id === decision.referenceId)?.title, STOCK_ACTION[decision.action ?? 'order'], !decision.action || decision.action === 'order' ? decision.quantity : '', snapshot.exportedAt, decision.at].map(quote).join(';'));
    downloadFile('reeple-decisions-stock.csv', '\uFEFFid;titre;piste_retenue;quantite_envisagee;date_export;date_decision\n' + lines.join('\n'), 'text/csv;charset=utf-8');
  }
  function renderSuggestion(item: StockAnalysis, expanded = false) {
    return <Card key={item.reference.id} className={`stock-suggestion ${selected?.reference.id === item.reference.id ? 'selected' : ''} ${expanded ? 'expanded' : ''}`}>
      <button className="stock-suggestion-title" onClick={() => { setSelectedId(item.reference.id); if (!expanded) setSuggestionView('cards'); }}><span><b className="stock-marker-number">{markers.get(item.reference.id)}</b><strong>{item.reference.title}</strong></span><StockStatusLabel status={item.status} /></button>
      <div className="stock-suggestion-metrics"><span>Stock<strong>{item.reference.stock}</strong></span><span>Ventes / sem.<strong>{decimal(item.averageSales)}</strong></span><span>{item.status === 'dormant' ? 'Dernière vente' : 'Couverture'}<strong>{item.status === 'dormant' ? `${item.daysWithoutSale} j` : `${decimal(item.coverage)} sem.`}</strong></span></div>
      {expanded ? <p>{item.explanation}</p> : <p className="stock-suggestion-short">{item.status === 'dormant' ? `${item.daysWithoutSale ?? '—'} jours sans vente` : item.status === 'overstock' ? `Cible : ${item.reference.targetWeeks ?? '—'} sem. de couverture` : `Seuil : ${item.reference.minimumWeeklySales ?? '—'} ventes / sem.`}</p>}
      {expanded && <><StockSparkline values={item.reference.weeklySales} /><dl className="stock-reference-details"><div><dt>Famille</dt><dd>{item.reference.family ?? 'Non renseignée'}</dd></div><div><dt>Éditeur</dt><dd>{item.reference.publisher ?? 'Non renseigné'}</dd></div><div><dt>Cible de couverture</dt><dd>{item.reference.targetWeeks !== undefined ? `${item.reference.targetWeeks} semaines` : 'Non renseignée'}</dd></div></dl><p className="stock-method">Une piste : {item.status === 'dormant' ? 'remettre cette référence en avant dans vos conseils ou dans l’agencement du magasin.' : item.status === 'overstock' ? 'réduire votre prochaine quantité commandée et laisser le stock se résorber.' : 'examiner la visibilité de ce jeu avant votre prochaine commande.'}</p></>}
      {expanded && <label className="stock-action-choice"><span>Piste à retenir</span><select aria-label={`Piste à retenir pour ${item.reference.title}`} value={actionFor(item)} onChange={event => setActionChoices(previous => ({ ...previous, [`${snapshot.id}:${item.reference.id}`]: event.target.value as StockAction }))}>{Object.entries(STOCK_ACTION).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>}
      {actionFor(item) === 'order' ? <div className="stock-suggestion-quantity"><QuantityControl title={item.reference.title} quantity={quantity(item)} onChange={value => setQuantity(item, value)} /><span>{item.suggestedOrder !== null ? `${item.suggestedOrder} proposé` : 'À décider'}{item.reference.usualOrder !== undefined && ` · habituellement ${item.reference.usualOrder}`}</span></div> : <p className="stock-method stock-action-note">Le vendeur choisit comment et quand réaliser cette mise en avant.</p>}
      <div className="stock-suggestion-actions"><Button className="stock-button stock-small" onClick={() => decide(item, 'later')}>Plus tard</Button><Button className="stock-button stock-small" onClick={() => decide(item, 'ignored')}>Ignorer</Button><Button className="stock-button stock-small" onClick={() => decide(item, 'accepted')}><Check size={13} />Valider</Button></div>
    </Card>;
  }

  return <section className="stock-overview" aria-label="Catalogue vivant et décisions de stock">
    <div className="stock-page-heading"><h1>Catalogue</h1><div className="stock-filters"><label><span>Famille</span><select value={family} onChange={event => { setFamily(event.target.value); setPage(0); }}><option value="all">Toutes</option>{families.map(value => <option key={value}>{value}</option>)}</select></label><label><span>Éditeur</span><select value={publisher} onChange={event => { setPublisher(event.target.value); setPage(0); }}><option value="all">Tous</option>{publishers.map(value => <option key={value}>{value}</option>)}</select></label><label className="stock-search"><Search size={16} /><input aria-label="Rechercher dans le stock" placeholder="Rechercher un jeu" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} /></label></div></div>
    {snapshot.source === 'demo' && <p className="stock-demo-note"><Info size={15} /><span><strong>Démonstration.</strong> Jeux réels, stocks et historiques de ventes fictifs. <button onClick={onImport}>Importer les données de ma boutique</button></span></p>}
    {snapshot.source === 'legacy' && <p className="stock-message partial"><Info size={16} />Votre catalogue local est conservé. Importez un export daté avec l’historique de ventes pour analyser sa situation.</p>}
    <div className="stock-kpis" aria-label="Références par situation">{(['dormant', 'overstock', 'watch', 'ok'] as const).map(value => {
      const items = scoped.filter(item => item.status === value);
      const units = items.reduce((sum, item) => sum + item.reference.stock, 0);
      return <button key={value} className={`stock-kpi ${status === value ? 'active' : ''}`} aria-pressed={status === value} onClick={() => { setStatus(status === value ? 'all' : value); setPage(0); }}><StockStatusLabel status={value} /><div><strong>{items.length.toLocaleString('fr-FR')}</strong><span>références</span></div><small>{value === 'dormant' ? `${units} exemplaires en stock` : value === 'overstock' ? 'Couverture au-delà de la cible' : value === 'watch' ? 'Ventes sous le seuil renseigné' : 'Selon les seuils disponibles'}</small></button>;
    })}</div>
    <div className="stock-context-line"><span>{snapshot.references.length.toLocaleString('fr-FR')} références dans cet instantané{incomplete > 0 && <> · <button onClick={() => { setStatus(status === 'unavailable' ? 'all' : 'unavailable'); setPage(0); }}>{incomplete} avec des données à compléter</button></>}</span>{(status !== 'all' || family !== 'all' || publisher !== 'all' || query) && <button onClick={resetFilters}>Effacer les filtres</button>}</div>
    {filtered.length ? <div className="stock-analysis-layout"><Card className="stock-panel stock-graph-card"><StockChart analyses={filtered} selected={selected} markers={chartMarkers} onSelect={setSelectedId} onViewRow={viewRow} /></Card><aside className="stock-suggestions" aria-label="Suggestions de stock"><div className="stock-suggestions-heading"><h2>Suggestions en attente <span>· {suggestions.length}</span></h2><div className="stock-view-switch" aria-label="Affichage des suggestions"><button aria-pressed={suggestionView === 'list'} onClick={() => setSuggestionView('list')}>Liste</button><button aria-pressed={suggestionView === 'cards'} onClick={() => setSuggestionView('cards')}>Cartes</button></div></div><p className="stock-suggestion-guidance">Vous choisissez. Valider retient votre piste ; l’action reste à réaliser en boutique.</p>{suggestions.length ? suggestionView === 'list' ? <div className="stock-suggestion-list">{visibleSuggestions.map(item => renderSuggestion(item))}</div> : <>{selectedSuggestion && renderSuggestion(selectedSuggestion, true)}<div className="stock-card-navigation"><Button className="stock-button stock-small" variant="ghost" onClick={() => { const index = suggestions.findIndex(item => item.reference.id === selectedSuggestion?.reference.id); setSelectedId(suggestions[(index - 1 + suggestions.length) % suggestions.length].reference.id); }} aria-label="Suggestion précédente"><ChevronLeft size={16} /></Button><span>{Math.max(0, suggestions.findIndex(item => item.reference.id === selectedSuggestion?.reference.id)) + 1} / {suggestions.length}</span><Button className="stock-button stock-small" variant="ghost" onClick={() => { const index = suggestions.findIndex(item => item.reference.id === selectedSuggestion?.reference.id); setSelectedId(suggestions[(index + 1) % suggestions.length].reference.id); }} aria-label="Suggestion suivante"><ChevronRight size={16} /></Button></div></> : <Card className="stock-suggestion stock-no-suggestion"><Check size={24} /><h3>Aucune suggestion en attente</h3><p>{filtered.some(item => item.status === 'unavailable') ? 'Certaines références ont besoin de données complémentaires.' : 'Les références disponibles ne déclenchent pas de nouveau signal.'}</p><p>Vos décisions restent dans le tableau et le journal.</p></Card>}</aside></div> : <Card className="stock-panel stock-filter-empty"><h2>Aucune référence pour ces filtres</h2><Button className="stock-button" onClick={resetFilters}>Effacer les filtres</Button></Card>}
    <Card className="stock-panel stock-reference-panel"><div className="stock-table-heading"><div><h2>Références</h2><span>{suggestions.length} signalées</span>{hiddenCount > 0 && <button aria-pressed={showHidden} onClick={() => { setShowHidden(!showHidden); setPage(0); }}>{hiddenCount} masquée{hiddenCount > 1 ? 's' : ''} · {showHidden ? 'masquer' : 'afficher'}</button>}<label className="stock-sort"><span>Trier par</span><select aria-label="Trier les références" value={sort} onChange={event => { setSort(event.target.value as StockSort); setPage(0); }}><option value="suggestions">Suggestions d’abord</option><option value="title">Nom du jeu</option><option value="age">Entrée en stock</option><option value="stock">Quantité en stock</option><option value="sales">Ventes hebdomadaires</option></select></label></div><span className="stock-table-legend"><i />Ventes / semaine · 12 semaines</span></div>
      <div className="stock-table-scroll"><table className="stock-reference-table"><caption className="sr-only">Stock de la boutique et décisions du vendeur, selon l’export importé.</caption><thead><tr><th>Jeu</th><th>Entrée en stock</th><th>Ventes · 12 sem.</th><th>Stock</th><th>Couverture</th><th>Statut</th><th>Suggestion</th><th>Quantité</th><th>Décision</th></tr></thead><tbody>{rows.map(item => {
        const decision = decisions.get(item.reference.id);
        const agePercent = item.age === null ? null : Math.min(100, item.age / 365 * 100);
        return <tr key={item.reference.id} ref={node => { tableRows.current[item.reference.id] = node; }} tabIndex={-1} className={`${selected?.reference.id === item.reference.id ? 'selected' : ''} ${decision ? `decided ${decision.status}` : ''}`} onClick={() => setSelectedId(item.reference.id)}><th scope="row"><button onClick={() => setSelectedId(item.reference.id)}>{item.reference.title}</button><span>{item.reference.publisher ?? 'Éditeur non renseigné'}</span></th><td>{agePercent === null ? <span className="stock-age-unknown">Non renseignée</span> : <div className="stock-age-bar" role="img" aria-label={`Entrée en stock il y a ${item.age} jours`} title={`Entrée en stock il y a ${item.age} jours`}><span style={{ width: `${agePercent}%` }} /><small>{item.age} j</small></div>}</td><td><StockSparkline values={item.reference.weeklySales} /></td><td className="stock-cell-strong">{item.reference.stock}</td><td>{item.coverage !== null ? `${decimal(item.coverage)} sem.` : '—'}</td><td><StockStatusLabel status={item.status} /></td><td><div className="stock-table-suggestion">{markers.has(item.reference.id) && <b className="stock-marker-number">{markers.get(item.reference.id)}</b>}<span>{item.suggestedOrder !== null ? <strong>{actionFor(item) !== 'order' ? 'Remettre en avant' : isSignal(item) ? `${item.suggestedOrder} proposé` : 'À votre appréciation'}</strong> : <strong>Données à compléter</strong>}{item.reference.usualOrder !== undefined && <small>Habituellement {item.reference.usualOrder}</small>}</span></div></td><td>{actionFor(item) !== 'order' ? <span className="stock-method">{actionFor(item) === 'display' ? 'Mise en rayon' : 'Conseil vendeur'}</span> : decision ? <strong>{decision.quantity} ex.</strong> : <QuantityControl title={item.reference.title} quantity={quantity(item)} onChange={value => setQuantity(item, value)} />}</td><td>{decision ? <div className="stock-decision-state"><span>{decision.status === 'accepted' ? 'Validée' : decision.status === 'ignored' ? 'Ignorée' : 'Reportée 24 h'}</span><Button className="stock-button stock-small" variant="ghost" onClick={() => reopen(item)}><Undo2 size={12} />Modifier</Button></div> : <div className="stock-row-actions"><Button className="stock-button stock-small" variant="ghost" onClick={() => decide(item, 'ignored')}>Ignorer</Button><Button className="stock-button stock-small" variant="ghost" onClick={() => decide(item, 'accepted')}>Valider</Button></div>}</td></tr>;
      })}</tbody></table></div>
      {!table.length && <p className="stock-method">Aucune référence visible. Vérifiez les filtres ou affichez les suggestions masquées.</p>}
      <div className="stock-table-footer"><strong>{acceptedUnits} ex. envisagés sur {accepted.length} réf. validées <span>· Aucune commande transmise</span></strong><div>{accepted.length > 0 && <Button className="stock-button stock-small" variant="ghost" onClick={exportDecisions}><Download size={14} />Exporter les décisions</Button>}{pageSize === 6 && table.length > 6 ? <Button className="stock-button stock-small" variant="ghost" onClick={() => { setPageSize(25); setPage(0); }}>Afficher toutes les références<ArrowDown size={14} /></Button> : pageSize > 6 && <Button className="stock-button stock-small" variant="ghost" onClick={() => { setPageSize(6); setPage(0); }}>Réduire<ArrowUp size={14} /></Button>}</div></div>
      {lastPage > 0 && <nav className="stock-pagination" aria-label="Pages des références"><Button className="stock-button stock-small" variant="ghost" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={15} />Précédent</Button><span>{currentPage + 1} / {lastPage + 1} · {table.length} références</span><Button className="stock-button stock-small" variant="ghost" disabled={currentPage === lastPage} onClick={() => setPage(currentPage + 1)}>Suivant<ChevronRight size={15} /></Button></nav>}
    </Card>
    <details className="stock-method-details"><summary><Info size={15} />Comprendre les repères et les suggestions</summary><p>Le graphique utilise l’ancienneté à la date de l’export et la moyenne des 4 dernières semaines complètes. Le volume du repère représente la quantité en stock. Les 12 semaines restent visibles dans les mini-graphiques.</p><p>Dormance : dernière vente connue dépassant {data.preferences.dormantDays} jours. Surstock : couverture supérieure à la cible renseignée. À surveiller : ventes sous le seuil renseigné. Aucune suggestion ne modifie le stock ou les commandes de votre boutique.</p><p>La quantité proposée correspond à la cible de couverture multipliée par les ventes moyennes, arrondie au supérieur, moins le stock disponible (minimum zéro). Les commandes en cours, délais fournisseurs, lots et saisonnalités ne sont pas intégrés : ajustez-la avant de décider.</p><p>Les données décrivent l’export, pas la situation en temps réel. « Plus tard » reporte la suggestion de 24 h. Un nouvel export constitue un nouvel instantané : les décisions de l’ancien restent dans le journal.</p></details>
  </section>;
}
