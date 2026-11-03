import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Store, Archive, SlidersHorizontal, LifeBuoy, History, Upload, Download, Check, Save, Undo2, Search, Dices, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { dateLabel, initialData, refreshAssets, money, type Game, type Shop } from './model';
import { CSV_TEMPLATE, exportCatalogue, parseCatalogue } from './csv';
import { BggImport } from './BggImport';
import { downloadFile, entry, useWorkspace, validateData } from './store';
import { StockImportPanel } from './StockImport';
import { STOCK_ACTION, type StockReference } from './stock';

export type SettingsTab = 'shop' | 'catalogue' | 'preferences' | 'help' | 'journal';
const sections = [ { id: 'shop', name: 'Boutique', icon: Store }, { id: 'catalogue', name: 'Catalogue', icon: Archive }, { id: 'preferences', name: 'Préférences', icon: SlidersHorizontal }, { id: 'help', name: 'Aide et contact', icon: LifeBuoy }, { id: 'journal', name: 'Journal', icon: History } ] as const;
function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <Card className="reeple-settings-panel"><div className="reeple-panel-heading"><h2>{title}</h2>{description && <p>{description}</p>}</div>{children}</Card>;
}
function ShopForm() {
  const { data, update } = useWorkspace();
  const [shop, setShop] = useState(data.shop);
  const dirty = JSON.stringify(shop) !== JSON.stringify(data.shop);
  const file = useRef<HTMLInputElement>(null);
  const field = (key: keyof Shop, value: string) => setShop(s => ({ ...s, [key]: value }));
  async function logo(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; e.target.value = ''; if (!f) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(f.type) || f.size > 512000) { toast.error('Choisissez une image PNG, JPEG ou WebP de moins de 500 Ko.'); return; }
    const reader = new FileReader(); reader.onload = () => field('logo', String(reader.result)); reader.onerror = () => toast.error('Impossible de lire cette image.'); reader.readAsDataURL(f);
  }
  function save(e: FormEvent) {
    e.preventDefault();
    if (!shop.name.trim()) return;
    update(d => ({ ...d, shop: { ...shop, name: shop.name.trim() }, logs: [entry('Informations de la boutique mises à jour'), ...d.logs].slice(0,500) }), 'Informations enregistrées sur cet appareil');
  }
  return <form onSubmit={save}><Panel title="La boutique" description="Ce que vos clients reconnaissent au premier coup d’œil.">
    <div className="reeple-form-body"><div className="reeple-logo-upload"><img src={shop.logo || data.shop.logo} alt="Logo de votre boutique" /><div><strong>Votre logo</strong><p>PNG, JPEG ou WebP · 500 Ko maximum. Conservé sur cet appareil.</p></div><button type="button" className="reeple-button" onClick={() => file.current?.click()}>Choisir un fichier</button><input ref={file} type="file" hidden accept="image/png,image/jpeg,image/webp" onChange={logo} /></div>
      <div className="reeple-form-grid"><label>Nom de la boutique<input value={shop.name} required maxLength={100} onChange={e => field('name', e.target.value)} autoComplete="organization" /></label><label>Ville<input value={shop.city} maxLength={100} onChange={e => field('city', e.target.value)} autoComplete="address-level2" /></label><label className="full">Adresse<input value={shop.address} maxLength={200} onChange={e => field('address', e.target.value)} autoComplete="street-address" placeholder="Adresse de votre boutique" /></label><label>Code postal<input value={shop.postcode} maxLength={12} onChange={e => field('postcode', e.target.value)} autoComplete="postal-code" /></label><label>Votre prénom<input value={shop.firstName} maxLength={100} onChange={e => field('firstName', e.target.value)} autoComplete="given-name" /></label><label className="full">Quelques mots sur la boutique <span>(facultatif)</span><textarea value={shop.description} maxLength={600} onChange={e => field('description', e.target.value)} rows={3} /></label></div>
    </div><div className="reeple-form-footer"><span>{dirty ? 'Modifications non enregistrées' : <><Check size={16} />À jour</>}</span><div><button type="button" className="reeple-button" disabled={!dirty} onClick={() => setShop(data.shop)}>Annuler</button><button type="submit" className="reeple-button coral" disabled={!dirty}>Enregistrer<Save size={16} /></button></div></div>
  </Panel><Panel title="Votre profil local" description="Ces informations restent dans ce navigateur. Aucun compte de connexion n’est créé."><div className="reeple-form-body"><label className="reeple-field">Email professionnel<input type="email" value={shop.email} maxLength={150} onChange={e => field('email', e.target.value)} autoComplete="email" placeholder="vous@boutique.fr" /></label><p className="reeple-method-note">L’authentification et la synchronisation entre appareils ne sont pas encore connectées. Aucun mot de passe n’est demandé dans cette version.</p></div></Panel></form>;
}
function CatalogueSettings() {
  const { data, update } = useWorkspace();
  const [showBgg, setShowBgg] = useState(false);
  const [preview, setPreview] = useState<Game[] | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Game | null>(null);
  const [error, setError] = useState('');
  const csvInput = useRef<HTMLInputElement>(null);
  async function importCSV(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; e.target.value = ''; if (!file) return;
    setError('');
    if (file.size > 2_000_000) { setError('Le fichier dépasse 2 Mo. Réduisez-le avant l’import.'); return; }
    try { setPreview(parseCatalogue(await file.text())); setImportMode('replace'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Impossible de lire le catalogue.'); }
  }
  function commitImport() {
    if (!preview) return;
    const resultingSize = importMode === 'replace' ? preview.length : new Set([...data.games.map(g => g.id), ...preview.map(g => g.id)]).size;
    if (resultingSize > 10000) { toast.error('Cette fusion dépasserait 10 000 références. Utilisez un fichier plus petit ou le mode remplacement.'); return; }
    update(d => {
      const imported = preview.map(g => { const previous = d.games.find(old => old.id === g.id); return { ...g, ...(previous?.image ? { image: previous.image } : {}), recommended: d.demo ? 0 : previous?.recommended ?? 0, note: previous?.note, bgg: previous?.bgg, rating: previous?.bgg ? previous.rating : undefined }; });
      const games = importMode === 'replace' ? imported : [...d.games.filter(g => !imported.some(n => n.id === g.id)), ...imported];
      return { ...d, demo: importMode === 'merge' && d.demo, games, actions: [], logs: [entry(`Import CSV : ${imported.length} références · ${importMode === 'replace' ? 'remplacement' : 'fusion'}`), ...d.logs].slice(0,500) };
    }, `${preview.length} références importées`);
    setPreview(null);
  }
  const filtered = data.games.filter(g => g.title.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')));
  return <><BggImport open={showBgg} onClose={() => setShowBgg(false)} /><div className="reeple-bgg-intro"><div><strong>Un vrai jeu à ajouter ?</strong><p>Retrouvez sa fiche et sa photo sur BoardGameGeek.</p></div><button className="reeple-button navy" onClick={() => setShowBgg(true)}><Search size={16} />Chercher sur BGG</button></div><Panel title="Votre catalogue" description={`${data.games.length} références · ${data.games.reduce((n,g) => n+g.stock,0)} exemplaires en stock${data.demo ? ' · données de démonstration' : ''}`}>
    <div className="reeple-form-body"><p>Importez un export adapté de votre caisse. Lisez le modèle : une ligne par jeu, identifiant stable et dates au format AAAA-MM-JJ. Aucun nom ni paiement client n’est nécessaire.</p>
      <div className="reeple-inline-actions"><button className="reeple-button coral" onClick={() => csvInput.current?.click()}><Upload size={17} />Importer un CSV</button><button className="reeple-button" onClick={() => downloadFile('reeple-modele-catalogue.csv', CSV_TEMPLATE, 'text/csv;charset=utf-8')}>Modèle CSV<Download size={16} /></button><button className="reeple-button" onClick={() => downloadFile('reeple-catalogue.csv', exportCatalogue(data.games), 'text/csv;charset=utf-8')}>Exporter le catalogue<Download size={16} /></button><input ref={csvInput} hidden type="file" accept=".csv,text/csv" onChange={importCSV} /></div>
      {error && <p role="alert" className="reeple-error"><AlertCircle size={18} />{error}</p>}
      <div className="reeple-note">Les imports mettent à jour les suggestions ; ils n’envoient rien à votre caisse. Un jeu sans date de dernière vente n’est pas classé dormant par défaut. Les catégories « tendances » utilisent les conseils enregistrés ici.</div>
      <label className="reeple-table-search"><Search size={18} /><input aria-label="Rechercher dans le catalogue" placeholder="Rechercher une référence…" value={query} onChange={e => setQuery(e.target.value)} /></label>
      <div className="reeple-table-scroll"><table className="reeple-table"><thead><tr><th>Jeu</th><th>Stock</th><th>Prix</th><th>Dernière vente</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filtered.slice(0,100).map(g => <tr key={g.id}><td><strong>{g.title}</strong></td><td>{g.stock}</td><td>{money(g.price)}</td><td>{g.lastSold ? new Date(g.lastSold).toLocaleDateString('fr-FR') : 'Non renseignée'}</td><td><button className="reeple-text-button" onClick={() => setEditing({ ...g })} aria-label={`Modifier ${g.title}`}>Modifier</button></td></tr>)}</tbody></table></div>{!filtered.length && <p>Aucune référence ne correspond à cette recherche.</p>}{filtered.length > 100 && <p className="reeple-method-note">100 premières références affichées sur {filtered.length}. Affinez la recherche.</p>}
    </div></Panel>
    <Dialog open={!!preview} onOpenChange={(open: boolean) => { if (!open) setPreview(null); }}><DialogContent className="reeple-modal"><DialogTitle>Vérifier l’import avant d’enregistrer</DialogTitle><DialogDescription>{preview?.length} références valides détectées. Vérifiez leur contenu et choisissez le mode d’import.</DialogDescription><ul className="reeple-preview-list">{preview?.slice(0,5).map(g => <li key={g.id}><strong>{g.title}</strong><span>{g.stock} en stock · {money(g.price)}</span></li>)}</ul><label className="reeple-field">Mode d’import<select value={importMode} onChange={e => setImportMode(e.target.value as typeof importMode)}><option value="replace">Remplacer tout le catalogue actuel</option><option value="merge">Fusionner par identifiant</option></select></label><p>{importMode === 'replace' ? 'Les références absentes du fichier seront retirées. Exportez votre espace avant de poursuivre si vous souhaitez les conserver.' : 'Les identifiants existants seront mis à jour. Les autres références seront conservées ; si la démo est conservée, l’espace reste signalé comme démonstration.'} Les suggestions traitées seront réinitialisées.</p><button className="reeple-button coral" onClick={commitImport}>Confirmer l’import<Check size={16} /></button></DialogContent></Dialog>
    <Dialog open={!!editing} onOpenChange={(open: boolean) => { if (!open) setEditing(null); }}><DialogContent className="reeple-modal"><DialogTitle>Modifier {editing?.title}</DialogTitle><DialogDescription>Ces données sont enregistrées uniquement dans votre espace local.</DialogDescription>{editing && <form onSubmit={e => { e.preventDefault(); const game = editing; update(d => ({ ...d, games: d.games.map(g => g.id === game.id ? game : g), logs: [entry(`Référence mise à jour : ${game.title}`), ...d.logs].slice(0,500) }), 'Référence mise à jour'); setEditing(null); }}><div className="reeple-form-grid"><label>Titre<input required maxLength={150} value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></label><label>Stock<input required type="number" min={0} step={1} max={1000000} value={editing.stock} onChange={e => setEditing({ ...editing, stock: Number(e.target.value) })} /></label><label>Prix de vente (€)<input required type="number" min={0} step="0.01" value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} /></label><label>Prix d’achat (€)<input type="number" min={0} step="0.01" value={editing.costPrice ?? ''} onChange={e => setEditing({ ...editing, costPrice: e.target.value === '' ? undefined : Number(e.target.value) })} /></label><label>Dernière vente<input type="date" max={new Date().toISOString().slice(0,10)} value={editing.lastSold ?? ''} onChange={e => setEditing({ ...editing, lastSold: e.target.value || undefined })} /></label><label>Date d’entrée<input type="date" max={new Date().toISOString().slice(0,10)} value={editing.receivedAt ?? ''} onChange={e => setEditing({ ...editing, receivedAt: e.target.value || undefined })} /></label></div><button className="reeple-button coral" type="submit">Enregistrer<Save size={16} /></button></form>}</DialogContent></Dialog>
  </>;
}
function Preferences() {
  const { data, update } = useWorkspace();
  const [preferences, setPreferences] = useState(data.preferences);
  return <Panel title="Les repères de votre boutique" description="Des règles explicites, adaptées à votre stock."><form onSubmit={e => { e.preventDefault(); update(d => ({ ...d, preferences, logs: [entry('Seuil de dormance modifié'), ...d.logs].slice(0,500) }), 'Préférences enregistrées'); }}><div className="reeple-form-body reeple-form-grid"><label>Stock dormant après (jours)<input type="number" required min={1} max={730} step={1} value={preferences.dormantDays} onChange={e => setPreferences({ ...preferences, dormantDays: Number(e.target.value) })} /><small>Dernière vente connue, comparée à la date de l’export.</small></label><p>La cible de couverture et le seuil de ventes sont renseignés par référence dans l’export CSV. Aucun seuil manquant n’est inventé.</p></div><div className="reeple-form-footer"><span>Les décisions restent sous votre contrôle</span><button className="reeple-button coral" type="submit">Enregistrer<Save size={16} /></button></div></form></Panel>;
}
function Journal() {
  const { data, update } = useWorkspace();
  return <><Panel title="Décisions de stock" description="Enregistrées localement. Aucune commande n’est transmise."><div className="reeple-form-body">{data.stockDecisions?.length ? <ul className="reeple-journal">{[...data.stockDecisions].reverse().map(decision => <li key={`${decision.snapshotId}:${decision.referenceId}`}><div><strong>{data.stockSnapshot?.references.find(reference => reference.id === decision.referenceId)?.title ?? decision.referenceId}</strong><p>{decision.status === 'accepted' ? decision.action && decision.action !== 'order' ? `${STOCK_ACTION[decision.action]} · piste retenue` : `${decision.quantity} exemplaires envisagés · décision validée` : decision.status === 'ignored' ? 'Suggestion ignorée' : `Reportée jusqu’au ${decision.until ? dateLabel(decision.until) : 'lendemain'}`}</p><small>{dateLabel(decision.at)}{decision.snapshotId !== data.stockSnapshot?.id && ' · instantané précédent'}</small></div>{decision.snapshotId === data.stockSnapshot?.id && <button className="reeple-text-button" onClick={() => update(previous => ({ ...previous, stockDecisions: (previous.stockDecisions ?? []).filter(item => item.snapshotId !== decision.snapshotId || item.referenceId !== decision.referenceId), logs: [entry(`Décision rouverte : ${decision.referenceId}`), ...previous.logs].slice(0,500) }), 'Décision rouverte')}><Undo2 size={15} />Rouvrir</button>}</li>)}</ul> : <p>Aucune décision enregistrée pour le moment.</p>}</div></Panel><Panel title="Journal d’activité" description="Les 500 dernières actions de cet espace, enregistrées sur cet appareil."><div className="reeple-form-body">{data.logs.length ? <ul className="reeple-journal">{data.logs.map(log => <li key={log.id}><span>{log.text}</span><time dateTime={log.at}>{dateLabel(log.at)}</time></li>)}</ul> : <p>Vos imports et vos décisions apparaîtront ici.</p>}</div></Panel></>;
}
function Help({ openLegacy }: { openLegacy: () => void }) {
  const { data, update } = useWorkspace();
  const [confirmation, setConfirmation] = useState<'demo' | 'restore' | null>(null);
  const [backup, setBackup] = useState<unknown>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  async function restore(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; e.target.value = ''; if (!f) return;
    try { if (f.size > 8_000_000) throw new Error('Fichier limité à 8 Mo.'); const parsed: unknown = JSON.parse(await f.text()); if (!validateData(parsed)) throw new Error('Ce fichier n’est pas une sauvegarde Reeple valide.'); setBackup(refreshAssets(parsed)); setConfirmation('restore'); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Sauvegarde illisible.'); }
  }
  return <><Panel title="Reeple propose, vous décidez" description="Les réponses aux premières questions."><div className="reeple-form-body reeple-help"><details open><summary>Où sont mes données ?</summary><p>Dans le stockage local de ce navigateur. Elles ne sont pas synchronisées entre appareils. Effacer les données du navigateur peut les supprimer : exportez régulièrement votre espace.</p></details><details><summary>Comment fonctionne la page principale ?</summary><p>Reeple relie le stock, les ventes renseignées et des seuils explicites. Le graphique, les suggestions et le tableau consultent le même export. Vous pouvez ajuster une quantité envisagée, reporter ou ignorer une piste ; aucune commande ni modification de caisse n’est exécutée.</p></details><details><summary>Qu’est devenu le Conseil Client ?</summary><p>Il est envisagé comme un plugin optionnel, payant séparément, hors de la version actuelle de la page principale.</p></details><details><summary>Quelles données sont réelles ?</summary><p>La démonstration utilise des jeux réels et des stocks, ventes, dates et seuils fictifs. Importez un export de votre boutique pour afficher vos données. Les valeurs sont celles du fichier, elles ne sont pas synchronisées en temps réel.</p></details><details><summary>Est-ce que ça fonctionne sans connexion ?</summary><p>La version de production peut être installée depuis un navigateur compatible. Après un premier chargement en ligne, son interface et ses données locales restent accessibles hors ligne. Les services externes du prototype précédent nécessitent Internet.</p></details><details><summary>Comment contacter l’équipe ?</summary><p><a href="mailto:hello.reeple@gmail.com">hello.reeple@gmail.com</a>. Ce lien ouvre votre messagerie ; aucun message n’est envoyé par l’application.</p></details><details><summary>Retrouver mon ancien prototype</summary><p>Les anciens écrans et la recherche BoardGameGeek ont été conservés.</p><button className="reeple-button" onClick={openLegacy}>Ouvrir l’ancien prototype</button></details></div></Panel>
    <Panel title="Sauvegarder votre espace" description="Le JSON conserve les instantanés, les décisions de stock, le catalogue précédent, les réglages et le journal."><div className="reeple-form-body"><div className="reeple-inline-actions"><button className="reeple-button navy" onClick={() => downloadFile(`reeple-espace-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(data, null, 2), 'application/json')}><Download size={17} />Exporter mon espace</button><button className="reeple-button" onClick={() => fileInput.current?.click()}><Upload size={17} />Restaurer une sauvegarde</button><button className="reeple-button" onClick={() => setConfirmation('demo')}><Dices size={17} />Recharger la démo</button><input type="file" hidden ref={fileInput} accept=".json,application/json" onChange={restore} /></div></div></Panel>
    <Dialog open={!!confirmation} onOpenChange={(open: boolean) => { if (!open) { setConfirmation(null); setBackup(null); } }}><DialogContent className="reeple-modal"><DialogTitle>{confirmation === 'demo' ? 'Recharger les données de démonstration ?' : 'Restaurer cet espace ?'}</DialogTitle><DialogDescription>Cette action remplacera le catalogue, les réglages et le journal actuels sur cet appareil. Exportez votre espace avant de confirmer si vous souhaitez le conserver.</DialogDescription><div className="reeple-inline-actions"><button className="reeple-button" onClick={() => { setConfirmation(null); setBackup(null); }}>Annuler</button><button className="reeple-button coral" onClick={() => { if (confirmation === 'demo') update(() => initialData(), 'Démonstration rechargée'); else if (validateData(backup)) update(() => backup, 'Espace restauré'); setConfirmation(null); setBackup(null); }}>Confirmer le remplacement</button></div></DialogContent></Dialog>
  </>;
}
export function Settings({ tab, setTab, openLegacy }: { tab: SettingsTab; setTab: (tab: SettingsTab) => void; openLegacy: () => void }) {
  if (tab === 'shop') return <SettingsOverview setTab={setTab} />;
  return <div className="reeple-settings"><aside className="reeple-settings-sidebar"><h2>Réglages</h2><nav aria-label="Sections des réglages">{sections.map(s => <button className={tab === s.id ? 'active' : ''} key={s.id} onClick={() => setTab(s.id)} aria-current={tab === s.id ? 'page' : undefined}><s.icon size={19} /><span>{s.name}</span></button>)}</nav><div><strong>Besoin d’un coup de main ?</strong><p>Une question sur Reeple ou votre catalogue ?</p><a href="mailto:hello.reeple@gmail.com">Écrire à Reeple →</a></div></aside><section className="reeple-settings-content" key={tab} aria-labelledby="settings-title"><header><h1 id="settings-title">{sections.find(s => s.id === tab)?.name}</h1><p>Votre espace, vos repères, votre façon de travailler.</p></header>{tab === 'catalogue' && <Panel title="Importer un export de stock" description="Un instantané périodique de votre boutique."><div className="reeple-form-body"><StockImportPanel /></div></Panel>}{tab === 'preferences' && <Preferences />}{tab === 'journal' && <Journal />}{tab === 'help' && <Help openLegacy={openLegacy} />}</section></div>;
}

function SettingsOverview({ setTab }: { setTab: (tab: SettingsTab) => void }) {
  const { data, update } = useWorkspace();
  const [shopName, setShopName] = useState(data.shop.name);
  const [familyPage, setFamilyPage] = useState(0);
  const [undo, setUndo] = useState<{ label: string; references: StockReference[] } | null>(null);
  const snapshot = data.stockSnapshot;
  const families = [...new Set((snapshot?.references ?? []).map(reference => reference.family).filter((name): name is string => Boolean(name)))].sort((a, b) => a.localeCompare(b, 'fr'));
  const exportDate = snapshot?.exportedAt ? new Date(snapshot.exportedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : null;
  function saveShop() {
    const name = shopName.trim();
    if (!name || name === data.shop.name) return;
    update(previous => ({ ...previous, shop: { ...previous.shop, name }, logs: [entry('Nom de la boutique modifié'), ...previous.logs].slice(0, 500) }), 'Nom de la boutique enregistré localement');
  }
  function changeThreshold(family: string, key: 'minimumWeeklySales' | 'targetWeeks', delta: number) {
    if (!snapshot) return;
    const references = snapshot.references;
    const first = references.find(reference => reference.family === family);
    if (!first) return;
    const value = Math.max(key === 'targetWeeks' ? 1 : 0, Math.min(52, (first[key] ?? (key === 'targetWeeks' ? 3 : 2)) + delta));
    setUndo({ label: `${family} : ${key === 'targetWeeks' ? 'cible de couverture' : 'seuil de ventes'}`, references });
    update(previous => ({ ...previous, stockSnapshot: previous.stockSnapshot && {
      ...previous.stockSnapshot,
      references: previous.stockSnapshot.references.map(reference => reference.family === family ? { ...reference, [key]: value } : reference),
    }, logs: [entry(`Seuil local modifié pour ${family} : ${value}`), ...previous.logs].slice(0, 500) }), 'Seuil appliqué aux références de cette famille');
  }
  function revert() {
    if (!undo) return;
    update(previous => ({ ...previous, stockSnapshot: previous.stockSnapshot && { ...previous.stockSnapshot, references: undo.references } }), 'Modification annulée');
    setUndo(null);
  }
  return <section className="stock-settings" aria-labelledby="settings-title">
    <div className="stock-settings-heading"><h1 id="settings-title">Paramètres</h1>{undo && <div className="stock-settings-undo">{undo.label} modifiée <button onClick={revert}><Undo2 size={14} />Annuler</button></div>}</div>
    <div className="stock-settings-row">
      <Card className="stock-settings-card"><h2>Synchronisation</h2><div className="stock-settings-line"><span>Source des données</span><strong>Export CSV périodique</strong></div><div className="stock-settings-line"><span>Dernier export</span><strong>{exportDate ?? 'Non renseigné'}</strong></div><button className="stock-settings-link" onClick={() => setTab('catalogue')}>Importer un nouvel export →</button></Card>
      <Card className="stock-settings-card"><h2>Boutique</h2><label className="stock-settings-shop">Nom de la boutique<input value={shopName} maxLength={100} onChange={event => setShopName(event.target.value)} onBlur={saveShop} onKeyDown={event => { if (event.key === 'Enter') { event.currentTarget.blur(); } }} /></label><span className="stock-settings-hint">Enregistré sur cet appareil</span></Card>
    </div>
    <Card className="stock-settings-card stock-settings-families"><h2>Familles de jeux</h2><p>Les seuils locaux s’appliquent aux références de chaque famille dans cet instantané.</p><div className="stock-settings-table-wrap"><table><thead><tr><th>Famille</th><th>Seuil de réassort</th><th>Cible de couverture</th><th>Références</th></tr></thead><tbody>{families.slice(familyPage * 2, familyPage * 2 + 2).map(family => { const matches = snapshot!.references.filter(reference => reference.family === family); const first = matches[0]; return <tr key={family}><th>{family}</th><td><div className="stock-settings-stepper"><button aria-label={`Réduire le seuil de ventes pour ${family}`} onClick={() => changeThreshold(family, 'minimumWeeklySales', -1)}>−</button><strong>{first.minimumWeeklySales ?? '—'}</strong><button aria-label={`Augmenter le seuil de ventes pour ${family}`} onClick={() => changeThreshold(family, 'minimumWeeklySales', 1)}>+</button><span>ventes/sem.</span></div></td><td><div className="stock-settings-stepper"><button aria-label={`Réduire la cible pour ${family}`} onClick={() => changeThreshold(family, 'targetWeeks', -1)}>−</button><strong>{first.targetWeeks ?? '—'}</strong><button aria-label={`Augmenter la cible pour ${family}`} onClick={() => changeThreshold(family, 'targetWeeks', 1)}>+</button><span>sem.</span></div></td><td>{matches.length.toLocaleString('fr-FR')}</td></tr>; })}</tbody></table></div>{!families.length && <p>Aucune famille dans l’export actuel.</p>}<div className="stock-settings-family-footer"><button className="stock-settings-link" onClick={() => setTab('catalogue')}>Gérer les familles dans l’export →</button>{families.length > 2 && <button className="stock-settings-link" onClick={() => setFamilyPage((familyPage + 1) % Math.ceil(families.length / 2))}>{familyPage + 1} / {Math.ceil(families.length / 2)} · {familyPage + 1 < Math.ceil(families.length / 2) ? 'Familles suivantes →' : 'Revenir au début ↶'}</button>}</div></Card>
    <div className="stock-settings-row stock-settings-last-row">
      <Card className="stock-settings-card"><h2>Règles de suggestion</h2><div className="stock-settings-line"><span>Dormant après</span><div className="stock-settings-stepper"><button aria-label="Réduire le délai de dormance" onClick={() => update(previous => ({ ...previous, preferences: { ...previous.preferences, dormantDays: Math.max(7, previous.preferences.dormantDays - 7) } }), 'Délai de dormance modifié')}>−</button><strong>{Math.round(data.preferences.dormantDays / 7)}</strong><button aria-label="Augmenter le délai de dormance" onClick={() => update(previous => ({ ...previous, preferences: { ...previous.preferences, dormantDays: Math.min(728, previous.preferences.dormantDays + 7) } }), 'Délai de dormance modifié')}>+</button><span>sem. sans vente</span></div></div><div className="stock-settings-line"><span>Après une commande</span><strong>Non disponible</strong></div><p>Reeple enregistre une décision, mais ne sait pas si la commande a été passée.</p></Card>
      <Card className="stock-settings-card"><h2>Compte</h2><div className="stock-settings-line"><span>Connexion et mot de passe</span><strong>Non disponibles</strong></div><div className="stock-settings-line"><span>Données</span><strong>Sur cet appareil</strong></div><a href="mailto:hello.reeple@gmail.com">Écrire à Reeple →</a><button className="stock-settings-link" onClick={() => setTab('help')}>Aide et sauvegarde →</button><button className="stock-settings-link" onClick={() => setTab('journal')}>Journal des décisions →</button></Card>
    </div>
  </section>;
}
