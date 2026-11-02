import { parseCsvRows } from './csv';
import type { StockReference, StockSnapshot } from './stock';

const SALES_COLUMNS = Array.from({ length: 12 }, (_, index) => `ventes_s${String(index + 1).padStart(2, '0')}`);
const normalize = (value: string) => value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');

export function parseStockExport(text: string): StockReference[] {
  const [rawHeaders, ...rows] = parseCsvRows(text);
  if (!rawHeaders || !rows.length) throw new Error('Ajoutez un en-tête et au moins une référence dans le fichier.');
  if (rows.length > 10000) throw new Error('L’export est limité à 10 000 références.');
  const headers = rawHeaders.map(normalize);
  if (new Set(headers).size !== headers.length) throw new Error('Deux colonnes portent le même nom.');
  const missing = ['id', 'titre', 'stock'].filter(name => !headers.includes(name));
  if (missing.length) throw new Error(`Colonnes obligatoires manquantes : ${missing.join(', ')}.`);
  const salesHeaders = SALES_COLUMNS.filter(name => headers.includes(name));
  if (salesHeaders.length && salesHeaders.length !== 12) throw new Error('L’historique doit contenir les 12 colonnes ventes_s01 à ventes_s12, de la plus ancienne à la plus récente.');
  const ids = new Set<string>();

  return rows.map((row, index) => {
    const line = `Ligne ${index + 2}`;
    if (row.length !== headers.length) throw new Error(`${line} : nombre de colonnes incorrect.`);
    const get = (name: string) => row[headers.indexOf(name)]?.trim() ?? '';
    const number = (name: string, integer = false): number | undefined => {
      const raw = get(name);
      if (!raw) return undefined;
      const parsed = Number(raw.replace(',', '.'));
      if (!Number.isFinite(parsed) || parsed < 0 || (integer && !Number.isInteger(parsed))) throw new Error(`${line} : ${name} doit être un ${integer ? 'entier' : 'nombre'} positif ou nul.`);
      return parsed;
    };
    const date = (name: string): string | undefined => {
      const raw = get(name);
      if (!raw) return undefined;
      const timestamp = Date.parse(raw);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || !Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== raw) throw new Error(`${line} : ${name} doit être une date valide au format AAAA-MM-JJ.`);
      return raw;
    };
    const id = get('id');
    const title = get('titre');
    if (!id || !title) throw new Error(`${line} : identifiant et titre obligatoires.`);
    if (ids.has(id)) throw new Error(`${line} : l’identifiant « ${id} » apparaît plusieurs fois.`);
    ids.add(id);
    const stock = number('stock', true);
    if (stock === undefined) throw new Error(`${line} : stock obligatoire. Une case vide n’est pas un stock nul.`);
    const filledSales = SALES_COLUMNS.filter(name => get(name) !== '');
    if (filledSales.length && filledSales.length !== 12) throw new Error(`${line} : renseignez les 12 semaines, ou laissez tout l’historique vide.`);
    const targetWeeks = number('couverture_cible_semaines');
    if (targetWeeks === 0) throw new Error(`${line} : la cible de couverture doit être supérieure à zéro.`);
    return {
      id, title, stock,
      publisher: get('editeur') || undefined,
      family: get('famille') || undefined,
      price: number('prix_vente') ?? number('prix'),
      costPrice: number('prix_achat'),
      receivedAt: date('date_entree'),
      lastSold: date('derniere_vente'),
      weeklySales: filledSales.length ? SALES_COLUMNS.map(name => number(name, true)!) : undefined,
      usualOrder: number('commande_habituelle', true),
      targetWeeks,
      minimumWeeklySales: number('seuil_ventes_semaine'),
    };
  });
}

export function makeStockSnapshot(references: StockReference[], fileName: string, exportedAt: string, frequency?: number): StockSnapshot {
  const timestamp = Date.parse(exportedAt);
  if (!Number.isFinite(timestamp) || timestamp > Date.now()) throw new Error('La date de l’export doit être une date valide passée ou actuelle.');
  if (frequency !== undefined && (!Number.isInteger(frequency) || frequency < 1 || frequency > 365)) throw new Error('La fréquence prévue doit être comprise entre 1 et 365 jours.');
  // Compare date-only transactions with the export's entered calendar day.
  // Converting a local export just after midnight to UTC can change that day.
  const day = exportedAt.match(/^(\d{4}-\d{2}-\d{2})T/)?.[1] ?? new Date(timestamp).toISOString().slice(0, 10);
  const invalid = references.find(reference => [reference.receivedAt, reference.lastSold].some(date => date && date > day));
  if (invalid) throw new Error(`${invalid.title} : une date de vente ou d’entrée est postérieure à l’export.`);
  return { id: crypto.randomUUID(), source: 'csv', fileName, exportedAt: new Date(timestamp).toISOString(), importedAt: new Date().toISOString(), expectedFrequencyDays: frequency, references };
}

export const STOCK_CSV_TEMPLATE = '\uFEFF' + [
  ['id', 'titre', 'stock', 'editeur', 'famille', 'prix_achat', 'prix_vente', 'date_entree', 'derniere_vente', ...SALES_COLUMNS, 'commande_habituelle', 'couverture_cible_semaines', 'seuil_ventes_semaine'].join(';'),
  ['reference-001', 'Exemple de jeu', '8', 'Exemple éditeur', 'Famille', '15', '29,90', '', '', ...Array(12).fill(''), '4', '3', '2'].join(';'),
].join('\n') + '\n';
