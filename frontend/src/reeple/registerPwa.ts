import { toast } from 'sonner';

export function registerPwa() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      const offerUpdate = () => {
        if (!registration.waiting) return;
        toast('Une nouvelle version de Reeple est disponible.', { id: 'reeple-update', duration: Infinity, action: { label: 'Mettre à jour', onClick: () => { const waiting = registration.waiting; if (!waiting) return; navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true }); waiting.postMessage('ACTIVATE_UPDATE'); } } });
      };
      offerUpdate();
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed') {
            if (navigator.serviceWorker.controller) offerUpdate();
            else toast.success('Reeple est prête pour une utilisation hors ligne.');
          }
        });
      });
    }).catch(() => toast.error('Le mode hors ligne n’a pas pu être préparé. L’application reste accessible en ligne.'));
  });
}
