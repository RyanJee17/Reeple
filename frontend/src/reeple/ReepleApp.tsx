import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Sparkle, Settings2, Download, WifiOff, ExternalLink } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { WorkspaceProvider, useWorkspace } from './store';
import { Advice } from './Advice';
import { Catalogue } from './Catalogue';
import { Settings, type SettingsTab } from './Settings';
import logo from './assets/reeple-logo.png';
import './styles.css';

const LegacyApp = lazy(() => import('../LegacyApp'));
type Route = 'conseil' | 'catalogue' | 'reglages' | 'prototype';
type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
const getRoute = (): Route => ({ '#catalogue': 'catalogue', '#reglages': 'reglages', '#prototype': 'prototype' } as Record<string, Route>)[window.location.hash] ?? 'conseil';

function Application() {
  const { data, saved } = useWorkspace();
  const [route, setRoute] = useState<Route>(getRoute);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('shop');
  const [online, setOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const main = useRef<HTMLElement>(null);
  const previousRoute = useRef(route);
  useEffect(() => {
    const hash = () => setRoute(getRoute());
    const connected = () => setOnline(navigator.onLine);
    const install = (e: Event) => { e.preventDefault(); setInstallPrompt(e as InstallPrompt); };
    const installed = () => setInstallPrompt(null);
    window.addEventListener('hashchange', hash); window.addEventListener('online', connected); window.addEventListener('offline', connected); window.addEventListener('beforeinstallprompt', install); window.addEventListener('appinstalled', installed);
    return () => { window.removeEventListener('hashchange', hash); window.removeEventListener('online', connected); window.removeEventListener('offline', connected); window.removeEventListener('beforeinstallprompt', install); window.removeEventListener('appinstalled', installed); };
  }, []);
  useEffect(() => { document.title = `${route === 'conseil' ? 'Mode conseil' : route === 'catalogue' ? 'Catalogue vivant' : route === 'prototype' ? 'Ancien prototype' : 'Réglages'} · Reeple`; if (previousRoute.current !== route) { main.current?.focus(); window.scrollTo({ top: 0 }); previousRoute.current = route; } }, [route]);
  function navigate(next: Route) { window.location.hash = next; setRoute(next); }
  async function install() { if (!installPrompt) return; try { await installPrompt.prompt(); const result = await installPrompt.userChoice; if (result.outcome === 'accepted') toast.success('Installation demandée'); setInstallPrompt(null); } catch { toast.error('Installation indisponible. Utilisez le menu de votre navigateur.'); } }
  if (route === 'prototype') return <><div className="reeple-legacy-bar"><button onClick={() => navigate('conseil')}><ArrowLeft size={16} />Revenir à Reeple</button><span>Ancien prototype conservé</span></div><Suspense fallback={<p>Chargement du prototype…</p>}><LegacyApp /></Suspense></>;
  return <div className="reeple-app"><a className="reeple-skip-link" href="#reeple-main" onClick={e => { e.preventDefault(); main.current?.focus(); main.current?.scrollIntoView(); }}>Aller au contenu</a>
    <header className="reeple-header"><a href="#conseil" className="reeple-brand" aria-label="Reeple, mode conseil"><img src={logo} alt="Reeple" /></a>
      {route === 'reglages' ? <button className="reeple-button reeple-hub-back" onClick={() => navigate('catalogue')}><ArrowLeft size={15} />Retour au hub</button> : <nav className="reeple-mode-switch" aria-label="Modes de Reeple"><button className={route === 'conseil' ? 'active advice' : ''} aria-current={route === 'conseil' ? 'page' : undefined} onClick={() => navigate('conseil')}><span className="reeple-mini-mark" aria-hidden="true">e</span>Mode conseil</button><button className={route === 'catalogue' ? 'active catalogue' : ''} aria-current={route === 'catalogue' ? 'page' : undefined} onClick={() => navigate('catalogue')}><Sparkle size={15} />Catalogue vivant</button></nav>}
      <button className="reeple-shop-link" onClick={() => { setSettingsTab('shop'); navigate('reglages'); }} title="Réglages de la boutique"><span>{data.shop.name}</span>{data.shop.logo ? <img src={data.shop.logo} alt="" /> : <Settings2 size={22} />}<Settings2 className="reeple-settings-icon" size={15} /></button>
    </header>
    {!online && <div className="reeple-offline" role="status"><WifiOff size={16} />Vous êtes hors ligne. Votre espace local reste accessible.</div>}
    {!saved && <div className="reeple-storage-warning" role="alert">Sauvegarde locale indisponible : exportez votre espace depuis Réglages → Aide et contact avant de fermer.</div>}
    {data.demo && <div className="reeple-demo-banner" role="note"><strong>De vrais jeux, une boutique simulée.</strong> Les fiches sont liées à BGG ; stocks, prix, dates de vente et conseils sont fictifs. La démo fonctionne sans connexion à l’API BGG.</div>}
    <main id="reeple-main" tabIndex={-1} ref={main}>{/* Keep quiz state when visiting the catalogue or settings. */}<div hidden={route !== 'conseil'}><Advice /></div>{route === 'catalogue' && <Catalogue openImport={() => { setSettingsTab('catalogue'); navigate('reglages'); }} />}{route === 'reglages' && <Settings tab={settingsTab} setTab={setSettingsTab} openLegacy={() => navigate('prototype')} />}</main>
    <footer className="reeple-app-footer"><span>{data.demo ? 'Espace de démonstration' : 'Espace local'}<i aria-hidden="true">·</i>Reeple propose, vous décidez.</span><div>{installPrompt && <button onClick={install}><Download size={14} />Installer l’app</button>}<button onClick={() => { setSettingsTab('help'); navigate('reglages'); }}>Aide<ExternalLink size={13} /></button><span>Données sur cet appareil</span></div></footer>
  </div>;
}
export default function ReepleApp() {
  return <WorkspaceProvider><Application /><Toaster position="bottom-right" richColors closeButton toastOptions={{ style: { fontFamily: 'Arial, sans-serif' } }} /></WorkspaceProvider>;
}
