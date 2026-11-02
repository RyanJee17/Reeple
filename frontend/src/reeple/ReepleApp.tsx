import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Clock3, Download, ExternalLink, Sparkles, Upload, WifiOff } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { StockButton as Button } from './StockButton';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../components/ui/dialog';
import { WorkspaceProvider, useWorkspace } from './store';
import { Settings, type SettingsTab } from './Settings';
import { StockOverview } from './StockOverview';
import { StockImportDialog } from './StockImport';
import { elapsedDays } from './stock';
import logo from './assets/reeple-logo.png';
import './styles.css';
import './design-system/tokens.css';
import './stock.css';

const LegacyApp = lazy(() => import('../LegacyApp'));
type Route = 'catalogue' | 'reglages' | 'prototype';
type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
const getRoute = (): Route => ({ '#reglages': 'reglages', '#prototype': 'prototype' } as Record<string, Route>)[window.location.hash] ?? 'catalogue';
const timestamp = (value: string) => new Date(value).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function Application() {
  const { data, saved } = useWorkspace();
  const [route, setRoute] = useState<Route>(getRoute);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('shop');
  const [online, setOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [pluginOpen, setPluginOpen] = useState(window.location.hash === '#conseil');
  const main = useRef<HTMLElement>(null);
  const previousRoute = useRef(route);

  useEffect(() => {
    const hash = () => { setRoute(getRoute()); if (window.location.hash === '#conseil') setPluginOpen(true); };
    const connected = () => setOnline(navigator.onLine);
    const install = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPrompt); };
    const installed = () => setInstallPrompt(null);
    window.addEventListener('hashchange', hash);
    window.addEventListener('online', connected);
    window.addEventListener('offline', connected);
    window.addEventListener('beforeinstallprompt', install);
    window.addEventListener('appinstalled', installed);
    return () => {
      window.removeEventListener('hashchange', hash);
      window.removeEventListener('online', connected);
      window.removeEventListener('offline', connected);
      window.removeEventListener('beforeinstallprompt', install);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);
  useEffect(() => {
    document.title = `${route === 'catalogue' ? 'Catalogue vivant' : route === 'prototype' ? 'Ancien prototype' : 'Paramètres'} · Reeple`;
    if (previousRoute.current !== route) { main.current?.focus(); window.scrollTo({ top: 0 }); previousRoute.current = route; }
  }, [route]);

  function navigate(next: Route) { window.location.hash = next; setRoute(next); }
  async function install() {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') toast.success('Installation demandée');
      setInstallPrompt(null);
    } catch { toast.error('Installation indisponible. Utilisez le menu de votre navigateur.'); }
  }

  if (route === 'prototype') return <><div className="reeple-legacy-bar"><button onClick={() => navigate('catalogue')}><ArrowLeft size={16} />Revenir à Reeple</button><span>Ancien prototype conservé</span></div><Suspense fallback={<p>Chargement du prototype…</p>}><LegacyApp /></Suspense></>;

  const snapshot = data.stockSnapshot;
  const snapshotAge = elapsedDays(snapshot?.exportedAt, new Date().toISOString());
  const stale = snapshotAge !== null && snapshot?.expectedFrequencyDays !== undefined && snapshotAge >= snapshot.expectedFrequencyDays;
  const freshness = !snapshot?.exportedAt ? 'partial' : stale ? 'stale' : 'fresh';
  const initials = data.shop.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();

  return <div className="reeple-app reeple-stock-app">
    <a className="reeple-skip-link" href="#reeple-main" onClick={event => { event.preventDefault(); main.current?.focus(); main.current?.scrollIntoView(); }}>Aller au contenu</a>
    <header className="stock-header">
      <a href="#catalogue" className="stock-brand" aria-label="Reeple, catalogue vivant"><img src={logo} alt="Reeple" /></a>
      <nav className="stock-main-nav" aria-label="Navigation principale"><button aria-current={route === 'catalogue' ? 'page' : undefined} onClick={() => navigate('catalogue')}>Catalogue</button><button aria-current={route === 'reglages' ? 'page' : undefined} onClick={() => navigate('reglages')}>Paramètres</button></nav>
      <div className={`stock-freshness ${freshness}`} title={snapshot?.importedAt ? `Importé le ${timestamp(snapshot.importedAt)}. Données issues d’un export périodique.` : 'La date du stock n’est pas connue.'}><Clock3 size={14} /><span>{snapshot?.exportedAt ? <>Export du {timestamp(snapshot.exportedAt)}{stale && <b> · À actualiser</b>}</> : 'Date de l’export non renseignée'}</span></div>
      <Button className="stock-button stock-header-import" variant="ghost" aria-label="Importer un export" onClick={() => setImportOpen(true)}><Upload size={15} /><span>Importer un export</span></Button>
      <button className="stock-shop" onClick={() => { setSettingsTab('shop'); navigate('reglages'); }} aria-label={`Paramètres de ${data.shop.name}`}><span>{data.shop.name}</span><b aria-hidden="true">{initials}</b></button>
    </header>
    {!online && <div className="reeple-offline" role="status"><WifiOff size={16} />Hors ligne. Votre dernier export et vos décisions locales restent accessibles.</div>}
    {!saved && <div className="reeple-storage-warning" role="alert">Sauvegarde locale indisponible : exportez votre espace depuis Paramètres → Aide avant de fermer.</div>}
    <main id="reeple-main" tabIndex={-1} ref={main}>{route === 'catalogue' && <StockOverview onImport={() => setImportOpen(true)} />}{route === 'reglages' && <Settings tab={settingsTab} setTab={setSettingsTab} openLegacy={() => navigate('prototype')} />}</main>
    <footer className="stock-app-footer"><span>Reeple propose, vous décidez.<span> · Données sur cet appareil · Mise à jour par export</span></span><div><button onClick={() => setPluginOpen(true)}><Sparkles size={14} />Conseil Client · plugin à venir</button>{installPrompt && <button onClick={install}><Download size={14} />Installer l’app</button>}<button onClick={() => { setSettingsTab('help'); navigate('reglages'); }}>Aide<ExternalLink size={13} /></button></div></footer>
    <StockImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    <Dialog open={pluginOpen} onOpenChange={setPluginOpen}><DialogContent className="reeple-stock-dialog stock-plugin-dialog"><DialogTitle>Conseil Client : une évolution possible</DialogTitle><DialogDescription>Un plugin optionnel, payant séparément, envisagé pour accompagner le conseil en boutique.</DialogDescription><p>Le cœur de Reeple reste votre stock : repérer ce qui mérite attention, examiner les pistes et décider de vos actions.</p><p>Le plugin Conseil Client ne fait pas partie de la version actuelle. Aucun abonnement ni paiement n’est activé ici.</p><Button className="stock-button" data-tone="secondary" onClick={() => setPluginOpen(false)}>Revenir à mon stock</Button></DialogContent></Dialog>
  </div>;
}

export default function ReepleApp() {
  return <WorkspaceProvider><Application /><Toaster position="bottom-right" richColors closeButton toastOptions={{ style: { fontFamily: 'Montserrat, sans-serif' } }} /></WorkspaceProvider>;
}
