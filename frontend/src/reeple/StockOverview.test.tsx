import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceProvider } from './store';
import { StockOverview } from './StockOverview';
import ReepleApp from './ReepleApp';

beforeEach(() => { localStorage.clear(); window.location.hash = ''; });
afterEach(cleanup);

describe('the stock page', () => {
  it('opens on the catalogue and presents client advice only as a future plugin', () => {
    render(<ReepleApp />);
    expect(screen.getByRole('heading', { name: /^Catalogue$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Conseil Client · plugin à venir/ })).toBeInTheDocument();
    expect(screen.queryByText('Mode conseil')).not.toBeInTheDocument();
  });
  it('records the seller’s quantity without changing stock, then allows reopening it', () => {
    render(<WorkspaceProvider><StockOverview onImport={() => {}} /></WorkspaceProvider>);
    const input = screen.getAllByRole('spinbutton', { name: 'Quantité envisagée pour Takenoko' })[0];
    fireEvent.change(input, { target: { value: '2' } });
    const suggestion = input.closest('.stock-suggestion')!;
    fireEvent.click(within(suggestion as HTMLElement).getByRole('button', { name: 'Valider' }));
    const saved = JSON.parse(localStorage.getItem('reeple.workspace.v1')!);
    expect(saved.stockDecisions[0]).toMatchObject({ referenceId: 'takenoko', quantity: 2, status: 'accepted' });
    expect(saved.stockSnapshot.references.find((reference: { id: string }) => reference.id === 'takenoko').stock).toBe(22);
    const row = screen.getByRole('row', { name: /Takenoko Matagot/ });
    expect(within(row).getByText('Validée')).toBeInTheDocument();
    fireEvent.click(within(row).getByRole('button', { name: 'Modifier' }));
    expect(JSON.parse(localStorage.getItem('reeple.workspace.v1')!).stockDecisions).toHaveLength(0);
  });
  it('applies the stock search to the chart, suggestions and table together', () => {
    render(<WorkspaceProvider><StockOverview onImport={() => {}} /></WorkspaceProvider>);
    fireEvent.change(screen.getByRole('textbox', { name: 'Rechercher dans le stock' }), { target: { value: 'Takenoko' } });
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /Takenoko : Surstock/ })).toBeInTheDocument();
    expect(screen.queryByRole('row', { name: /Concept Repos/ })).not.toBeInTheDocument();
  });
  it('records a dormant game’s display decision without creating an order', () => {
    render(<WorkspaceProvider><StockOverview onImport={() => {}} /></WorkspaceProvider>);
    const choice = screen.getByRole('combobox', { name: 'Piste à retenir pour Concept' });
    expect(choice).toHaveValue('display');
    expect(screen.queryByRole('spinbutton', { name: 'Quantité envisagée pour Concept' })).not.toBeInTheDocument();
    const suggestion = choice.closest('.stock-suggestion') as HTMLElement;
    fireEvent.click(within(suggestion).getByRole('button', { name: 'Valider' }));
    const saved = JSON.parse(localStorage.getItem('reeple.workspace.v1')!);
    expect(saved.stockDecisions[0]).toMatchObject({ referenceId: 'concept', action: 'display', quantity: 0, status: 'accepted' });
    expect(saved.stockSnapshot.references.find((reference: { id: string }) => reference.id === 'concept').stock).toBe(6);
    expect(screen.getByText(/0 ex. envisagés sur 1 réf. validées/)).toBeInTheDocument();
  });
  it('reveals the matching suggestion when a different chart point is selected', () => {
    render(<WorkspaceProvider><StockOverview onImport={() => {}} /></WorkspaceProvider>);
    fireEvent.click(screen.getByRole('button', { name: /The Crew : Dormant/ }));
    expect(screen.getByRole('combobox', { name: 'Piste à retenir pour The Crew' })).toBeInTheDocument();
  });
});
