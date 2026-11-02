import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Download, FileSpreadsheet, Upload, Check } from 'lucide-react';
import { StockButton as Button } from './StockButton';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../components/ui/dialog';
import { downloadFile, entry, useWorkspace } from './store';
import { makeStockSnapshot, parseStockExport, STOCK_CSV_TEMPLATE } from './stock-import';
import type { StockReference } from './stock';

export function StockImportPanel({ onComplete }: { onComplete?: () => void }) {
  const { data, update } = useWorkspace();
  const [references, setReferences] = useState<StockReference[] | null>(null);
  const [fileName, setFileName] = useState('');
  const [exportedAt, setExportedAt] = useState('');
  const [frequency, setFrequency] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [reading, setReading] = useState(false);

  async function readFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setReading(true);
    setError('');
    setReferences(null);
    setConfirmed(false);
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('Le fichier dépasse la limite de 2 Mo.');
      const parsed = parseStockExport(await file.text());
      setReferences(parsed);
      setFileName(file.name);
      setExportedAt('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Impossible de lire ce fichier.');
    } finally {
      setReading(false);
    }
  }

  function commit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!references || !confirmed) return;
    try {
      const snapshot = makeStockSnapshot(references, fileName, exportedAt, frequency ? Number(frequency) : undefined);
      update(previous => ({
        ...previous,
        stockSnapshot: snapshot,
        logs: [entry(`Export de stock importé : ${references.length} références · ${fileName}`), ...previous.logs].slice(0, 500),
      }), 'Le nouvel export est prêt à être consulté');
      setReferences(null);
      setConfirmed(false);
      onComplete?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'L’import n’a pas abouti.');
    }
  }

  return <div className="stock-import-panel">
    <p>Importez un instantané de votre stock. Reeple l’analyse sur cet appareil ; les quantités de votre logiciel de caisse restent sous votre contrôle.</p>
    <div className="stock-import-tools">
      <Button className="stock-button" variant="ghost" onClick={() => downloadFile('reeple-modele-stock.csv', STOCK_CSV_TEMPLATE, 'text/csv;charset=utf-8')}><Download size={16} />Modèle CSV</Button>
      <Button className="stock-button" variant="ghost" onClick={() => downloadFile('reeple-sauvegarde.json', JSON.stringify(data, null, 2), 'application/json')}><Download size={16} />Sauvegarder mon espace</Button>
    </div>
    <label className="stock-file-drop">
      <FileSpreadsheet size={30} aria-hidden="true" />
      <strong>{reading ? 'Lecture du fichier…' : 'Choisir un export CSV'}</strong>
      <span>UTF-8 · virgule ou point-virgule · 2 Mo maximum</span>
      <input type="file" accept=".csv,text/csv" onChange={readFile} disabled={reading} aria-label="Choisir un export de stock CSV" />
    </label>
    {error && <p className="stock-message error" role="alert">{error}</p>}
    {references && <form onSubmit={commit}>
      <Card className="stock-import-preview">
        <strong>{fileName}</strong>
        <span>{references.length.toLocaleString('fr-FR')} références · {references.filter(reference => reference.weeklySales).length} historiques de ventes renseignés</span>
        <ul>{references.slice(0, 3).map(reference => <li key={reference.id}><span>{reference.title}</span><span>{reference.stock} en stock</span></li>)}</ul>
      </Card>
      <div className="stock-import-fields">
        <label>Date de génération de l’export<input type="datetime-local" required value={exportedAt} onChange={event => setExportedAt(event.target.value)} /><small>La date du stock dans votre logiciel, distincte de la date d’import.</small></label>
        <label>Fréquence d’export prévue<select value={frequency} onChange={event => setFrequency(event.target.value)}><option value="">Non définie</option><option value="1">Chaque jour</option><option value="7">Chaque semaine</option><option value="30">Chaque mois</option></select><small>Sert à signaler un export ancien. Aucun import automatique n’est programmé.</small></label>
      </div>
      <label className="stock-confirm"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />Remplacer l’instantané de stock affiché par cet export. Les références absentes ne figureront plus dans la vue actuelle.</label>
      <Button type="submit" className="stock-button" data-tone="primary" disabled={!confirmed || !exportedAt}><Check size={16} />Confirmer l’import</Button>
    </form>}
    <details className="stock-import-help"><summary>Quelles colonnes sont utilisées ?</summary><p><strong>Obligatoires :</strong> id, titre, stock. Utilisez un identifiant stable entre deux exports.</p><p><strong>Pour analyser :</strong> date_entree, derniere_vente, couverture_cible_semaines et ventes_s01 à ventes_s12 (12 semaines complètes, de la plus ancienne à la plus récente). Une donnée absente reste inconnue.</p><p><strong>Facultatives :</strong> editeur, famille, prix_achat, prix_vente, commande_habituelle et seuil_ventes_semaine. Aucun profil de joueur n’est nécessaire.</p><p>Ce format est l’hypothèse d’import du prototype ; son raccordement à votre export de caisse reste à valider. Les ventes moyennes sont calculées sur les 4 dernières semaines.</p></details>
  </div>;
}

export function StockImportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Dialog open={open} onOpenChange={(value: boolean) => { if (!value) onClose(); }}>
    <DialogContent className="reeple-stock-dialog stock-import-dialog">
      <DialogTitle><Upload size={20} />Importer un export de stock</DialogTitle>
      <DialogDescription>Un export périodique pour voir ce qui mérite votre attention.</DialogDescription>
      <StockImportPanel onComplete={onClose} />
    </DialogContent>
  </Dialog>;
}
