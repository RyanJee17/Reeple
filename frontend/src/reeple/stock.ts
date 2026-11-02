export type StockStatus = 'dormant' | 'overstock' | 'watch' | 'ok' | 'unavailable';
export type StockAction = 'order' | 'display' | 'advice';
export const STOCK_ACTION: Record<StockAction, string> = { order: 'Ajuster la prochaine commande', display: 'Remettre en avant en rayon', advice: 'Remettre dans mes conseils' };

export interface StockReference {
  id: string;
  title: string;
  publisher?: string;
  family?: string;
  stock: number;
  price?: number;
  costPrice?: number;
  receivedAt?: string;
  lastSold?: string;
  /** Twelve completed weeks, oldest first. No history is different from twelve zeroes. */
  weeklySales?: number[];
  usualOrder?: number;
  targetWeeks?: number;
  minimumWeeklySales?: number;
}

export interface StockSnapshot {
  id: string;
  source: 'demo' | 'csv' | 'legacy';
  fileName: string;
  exportedAt?: string;
  importedAt?: string;
  expectedFrequencyDays?: number;
  references: StockReference[];
}

export interface StockDecision {
  snapshotId: string;
  referenceId: string;
  status: 'accepted' | 'ignored' | 'later';
  quantity: number;
  action?: StockAction;
  at: string;
  until?: string;
}

export interface StockAnalysis {
  reference: StockReference;
  status: StockStatus;
  averageSales: number | null;
  coverage: number | null;
  age: number | null;
  daysWithoutSale: number | null;
  suggestedOrder: number | null;
  explanation: string;
  missing: string[];
}

export const STOCK_STATUS: Record<StockStatus, { label: string; symbol: string }> = {
  dormant: { label: 'Dormant', symbol: '◆' },
  overstock: { label: 'Surstock', symbol: '■' },
  watch: { label: 'À surveiller', symbol: '▲' },
  ok: { label: 'OK', symbol: '●' },
  unavailable: { label: 'Données partielles', symbol: '○' },
};

export function elapsedDays(value: string | undefined, at: string | undefined): number | null {
  if (!value || !at) return null;
  const start = Date.parse(value);
  const end = Date.parse(at);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) return null;
  return Math.floor((end - start) / 86_400_000);
}

export function analyseStock(reference: StockReference, exportedAt: string | undefined, dormantDays: number): StockAnalysis {
  const history = reference.weeklySales;
  const averageSales = history?.length === 12
    ? history.slice(-4).reduce((sum, value) => sum + value, 0) / 4
    : null;
  const coverage = averageSales !== null && averageSales > 0 ? reference.stock / averageSales : null;
  const age = elapsedDays(reference.receivedAt, exportedAt);
  const daysWithoutSale = elapsedDays(reference.lastSold, exportedAt);
  const suggestedOrder = averageSales !== null && reference.targetWeeks !== undefined
    ? Math.max(0, Math.ceil(averageSales * reference.targetWeeks) - reference.stock)
    : null;
  const missing = [
    ...(!exportedAt ? ['date de l’export'] : []),
    ...(averageSales === null ? ['historique de ventes'] : []),
    ...(age === null ? ['date d’entrée en stock'] : []),
    ...(reference.targetWeeks === undefined ? ['cible de couverture'] : []),
  ];
  let status: StockStatus = 'unavailable';
  let explanation = 'Complétez les données de cette référence pour qualifier sa situation.';

  if (reference.stock > 0 && daysWithoutSale !== null && daysWithoutSale >= dormantDays) {
    status = 'dormant';
    explanation = `${daysWithoutSale} jours sans vente à la date de l’export. Une mise en avant en rayon ou dans vos conseils peut lui redonner sa chance.`;
  } else if (coverage !== null && reference.targetWeeks !== undefined && coverage > reference.targetWeeks) {
    status = 'overstock';
    explanation = `Le stock couvre ${coverage.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} semaines, pour une cible renseignée de ${reference.targetWeeks} semaines. Vous pouvez réduire la prochaine commande.`;
  } else if (averageSales !== null && reference.minimumWeeklySales !== undefined && averageSales < reference.minimumWeeklySales && reference.stock > 0) {
    status = 'watch';
    explanation = `Les ventes moyennes des 4 dernières semaines sont sous le seuil renseigné de ${reference.minimumWeeklySales} par semaine. Vérifiez sa visibilité et votre prochaine commande.`;
  } else if (averageSales !== null && averageSales > 0 && reference.targetWeeks !== undefined) {
    status = 'ok';
    explanation = 'Aucun signal selon les seuils renseignés dans cet export. Votre expertise reste nécessaire pour décider de la suite.';
  } else if (averageSales === 0) {
    explanation = 'Aucune vente sur les 4 dernières semaines renseignées. Sans date de dernière vente suffisante, la dormance n’est pas confirmée.';
  }

  return { reference, status, averageSales, coverage, age, daysWithoutSale, suggestedOrder, explanation, missing };
}

export function activeDecision(decisions: StockDecision[], snapshotId: string, referenceId: string, now = Date.now()) {
  const decision = decisions.find(item => item.snapshotId === snapshotId && item.referenceId === referenceId);
  return decision?.status === 'later' && decision.until && Date.parse(decision.until) <= now ? undefined : decision;
}

const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const validDate = (value: unknown) => value === undefined || (typeof value === 'string' && Number.isFinite(Date.parse(value)));

export function isStockSnapshot(value: unknown): value is StockSnapshot {
  if (!value || typeof value !== 'object') return false;
  const snapshot = value as StockSnapshot;
  return typeof snapshot.id === 'string' && !!snapshot.id && ['demo', 'csv', 'legacy'].includes(snapshot.source)
    && typeof snapshot.fileName === 'string' && validDate(snapshot.exportedAt) && validDate(snapshot.importedAt)
    && (snapshot.expectedFrequencyDays === undefined || (Number.isInteger(snapshot.expectedFrequencyDays) && snapshot.expectedFrequencyDays >= 1))
    && Array.isArray(snapshot.references) && snapshot.references.length <= 10000
    && new Set(snapshot.references.map(reference => reference?.id)).size === snapshot.references.length
    && snapshot.references.every(reference => reference && typeof reference.id === 'string' && !!reference.id && typeof reference.title === 'string' && !!reference.title.trim()
      && finite(reference.stock) && Number.isInteger(reference.stock)
      && [reference.price, reference.costPrice, reference.usualOrder, reference.minimumWeeklySales].every(number => number === undefined || finite(number))
      && (reference.usualOrder === undefined || Number.isInteger(reference.usualOrder))
      && (reference.targetWeeks === undefined || (finite(reference.targetWeeks) && reference.targetWeeks > 0))
      && [reference.publisher, reference.family].every(text => text === undefined || typeof text === 'string')
      && validDate(reference.receivedAt) && validDate(reference.lastSold)
      && (reference.weeklySales === undefined || (Array.isArray(reference.weeklySales) && reference.weeklySales.length === 12 && reference.weeklySales.every(number => finite(number) && Number.isInteger(number)))));
}

export function isStockDecision(value: unknown): value is StockDecision {
  if (!value || typeof value !== 'object') return false;
  const decision = value as StockDecision;
  return typeof decision.snapshotId === 'string' && typeof decision.referenceId === 'string'
    && ['accepted', 'ignored', 'later'].includes(decision.status) && finite(decision.quantity)
    && (decision.action === undefined || ['order', 'display', 'advice'].includes(decision.action))
    && Number.isInteger(decision.quantity) && typeof decision.at === 'string' && validDate(decision.at)
    && validDate(decision.until);
}

/** Explicitly fictional shop data. Game names are real; these are not BGG sales statistics. */
export function demoStockSnapshot(now = new Date()): StockSnapshot {
  const exported = new Date(now);
  exported.setDate(exported.getDate() - 1);
  exported.setHours(7, 0, 0, 0);
  const ago = (days: number) => new Date(exported.getTime() - days * 86_400_000).toISOString().slice(0, 10);
  const reference = (id: string, title: string, publisher: string, family: string, stock: number, weeklySales: number[], age: number, sold: number, usualOrder: number, targetWeeks = 3, minimumWeeklySales = 2): StockReference => ({
    id, title, publisher, family, stock, weeklySales, receivedAt: ago(age), lastSold: ago(sold), usualOrder, targetWeeks, minimumWeeklySales,
  });
  return {
    id: 'demo-stock-v1', source: 'demo', fileName: 'Exemple de stock boutique.csv', exportedAt: exported.toISOString(), importedAt: now.toISOString(), expectedFrequencyDays: 7,
    references: [
      reference('takenoko', 'Takenoko', 'Matagot', 'Famille', 22, [2, 8, 4, 5, 4, 3, 4, 2, 4, 3, 4, 3], 70, 2, 6),
      reference('concept', 'Concept', 'Repos Production', 'Ambiance', 6, [7, 5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0], 250, 110, 3, 3, 1),
      reference('happy-city', 'Happy City', 'Cocktail Games', 'Famille', 6, [6, 5, 5, 4, 4, 4, 3, 3, 2, 2, 3, 2], 160, 4, 3, 3, 3),
      reference('skyjo', 'Skyjo', 'Magilano', 'Ambiance', 12, [6, 7, 9, 7, 8, 6, 9, 8, 7, 6, 8, 7], 40, 1, 6),
      reference('flip-7', 'Flip 7', 'Catch Up Games', 'Ambiance', 8, [0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 5, 5], 22, 1, 4),
      reference('bomb-busters', 'Bomb Busters', 'Cocktail Games', 'Coopératif', 9, [2, 3, 4, 2, 5, 4, 3, 4, 5, 3, 4, 4], 115, 3, 3),
      reference('azul', 'Azul', 'Plan B Games', 'Famille', 26, [4, 4, 3, 2, 4, 5, 3, 4, 3, 3, 4, 3], 190, 4, 6),
      reference('the-crew', 'The Crew', 'IELLO', 'Coopératif', 12, [3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 220, 100, 4),
      reference('dixit', 'Dixit', 'Libellud', 'Ambiance', 4, [3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 290, 98, 4),
      reference('wingspan', 'Wingspan', 'Matagot', 'Expert', 6, [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 310, 105, 3),
      reference('cartographers', 'Cartographers', 'Intrafin', 'Famille', 5, [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 360, 130, 2),
      reference('carcassonne', 'Carcassonne', 'Z-Man Games', 'Famille', 8, [3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 330, 96, 4),
      reference('splendor', 'Splendor', 'Space Cowboys', 'Famille', 18, [5, 4, 4, 3, 3, 4, 4, 3, 3, 3, 4, 3], 130, 3, 4),
      reference('cascadia', 'Cascadia', 'Lucky Duck Games', 'Famille', 4, [5, 4, 4, 3, 3, 2, 2, 2, 1, 2, 1, 2], 85, 5, 3, 3, 2),
      reference('just-one', 'Just One', 'Repos Production', 'Ambiance', 3, [6, 5, 5, 4, 4, 3, 3, 2, 1, 2, 1, 1], 180, 6, 4, 3, 2),
    ],
  };
}
