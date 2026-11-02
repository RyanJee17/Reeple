import { describe, expect, it } from 'vitest';
import { activeDecision, analyseStock, demoStockSnapshot, isStockSnapshot, type StockReference } from './stock';
import { makeStockSnapshot, parseStockExport } from './stock-import';
import { initialData, refreshAssets } from './model';
import { validateData } from './store';

const base: StockReference = { id: 'azul', title: 'Azul', stock: 20, receivedAt: '2026-01-01', lastSold: '2026-10-30', weeklySales: Array(12).fill(2), targetWeeks: 3 };

describe('stock analysis from a dated export', () => {
  it('calculates coverage and a proposed quantity from the four most recent weeks', () => {
    const result = analyseStock({ ...base, stock: 5, weeklySales: [...Array(8).fill(9), 2, 2, 2, 2] }, '2026-11-01T07:00:00Z', 90);
    expect(result.averageSales).toBe(2);
    expect(result.coverage).toBe(2.5);
    expect(result.suggestedOrder).toBe(1);
    expect(result.status).toBe('ok');
  });
  it('does not infer overstock from quantity alone or treat missing sales as zero', () => {
    const result = analyseStock({ ...base, stock: 100, weeklySales: undefined, lastSold: undefined }, '2026-11-01T07:00:00Z', 90);
    expect(result.status).toBe('unavailable');
    expect(result.averageSales).toBeNull();
    expect(result.suggestedOrder).toBeNull();
    expect(result.missing).toContain('historique de ventes');
  });
  it('detects overstock against an explicit target and dormancy at the export date', () => {
    expect(analyseStock(base, '2026-11-01T07:00:00Z', 90).status).toBe('overstock');
    const dormant = analyseStock({ ...base, lastSold: '2026-06-01' }, '2026-10-01T07:00:00Z', 90);
    expect(dormant.status).toBe('dormant');
    expect(dormant.daysWithoutSale).toBe(122);
  });
  it('keeps decisions scoped to one snapshot and expires a postponement', () => {
    const decisions = [{ snapshotId: 'one', referenceId: 'azul', status: 'later' as const, quantity: 0, at: '2026-10-01T07:00:00Z', until: '2026-10-02T07:00:00Z' }];
    expect(activeDecision(decisions, 'two', 'azul', Date.parse('2026-10-01T08:00:00Z'))).toBeUndefined();
    expect(activeDecision(decisions, 'one', 'azul', Date.parse('2026-10-01T08:00:00Z'))?.status).toBe('later');
    expect(activeDecision(decisions, 'one', 'azul', Date.parse('2026-10-03T08:00:00Z'))).toBeUndefined();
  });
});

describe('stock CSV import', () => {
  it('accepts stock data without quiz fields and preserves missing information', () => {
    const [reference] = parseStockExport('id;titre;stock\nref-1;"Jeu; exemple";0');
    expect(reference.title).toBe('Jeu; exemple');
    expect(reference.stock).toBe(0);
    expect(reference.weeklySales).toBeUndefined();
    expect(reference.costPrice).toBeUndefined();
  });
  it('distinguishes twelve real zeroes from an incomplete history', () => {
    const columns = Array.from({ length: 12 }, (_, index) => `ventes_s${String(index + 1).padStart(2, '0')}`).join(';');
    const header = `id;titre;stock;${columns}\n`;
    expect(parseStockExport(header + 'a;Azul;3;' + Array(12).fill('0').join(';'))[0].weeklySales).toEqual(Array(12).fill(0));
    expect(() => parseStockExport(header + 'a;Azul;3;' + [...Array(11).fill('0'), ''].join(';'))).toThrow(/12 semaines/);
  });
  it('rejects duplicate references and invalid quantities instead of importing partially', () => {
    expect(() => parseStockExport('id;titre;stock\na;Azul;3\na;Autre;2')).toThrow(/plusieurs fois/);
    expect(() => parseStockExport('id;titre;stock\na;Azul;3\nb;Autre;-2')).toThrow(/positif ou nul/);
  });
  it('rejects an export dated before its transactions', () => {
    expect(() => makeStockSnapshot([{ ...base, lastSold: '2026-10-30' }], 'stock.csv', '2020-01-01T07:00:00Z')).toThrow(/postérieure/);
  });
  it('keeps date-only transactions on the export’s calendar day across time zones', () => {
    const result = makeStockSnapshot([{ ...base, lastSold: '2026-10-30' }], 'stock.csv', '2026-10-30T00:30:00+02:00');
    expect(result.exportedAt).toBe('2026-10-29T22:30:00.000Z');
  });
  it('validates the demo and refuses malformed backups without throwing', () => {
    expect(isStockSnapshot(demoStockSnapshot(new Date('2026-11-02T08:00:00Z')))).toBe(true);
    expect(isStockSnapshot({ ...demoStockSnapshot(), references: [null] })).toBe(false);
  });
});

describe('existing local workspaces', () => {
  it('preserves a real catalogue without replacing it with demo stock', () => {
    const previous = { ...initialData(), demo: false, stockSnapshot: undefined, stockDecisions: undefined };
    previous.games[0] = { ...previous.games[0], stock: 47, price: 28 };
    expect(validateData(previous)).toBe(true);
    const upgraded = refreshAssets(previous);
    expect(upgraded.stockSnapshot).toBeUndefined();
    expect(upgraded.games[0]).toMatchObject({ stock: 47, price: 28 });
    expect(upgraded.actions).toEqual(previous.actions);
  });
});
