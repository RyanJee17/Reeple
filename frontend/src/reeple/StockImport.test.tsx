import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StockImportPanel } from './StockImport';
import { WorkspaceProvider } from './store';

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function csvFile(contents: string): File {
  const file = new File([contents], 'stock-boutique.csv', { type: 'text/csv' });
  Object.defineProperty(file, 'text', { value: async (): Promise<string> => contents });
  return file;
}

describe('stock import confirmation', () => {
  it('previews the file and requires a dated, explicit confirmation before replacing stock', async () => {
    const onComplete = vi.fn();
    render(<WorkspaceProvider><StockImportPanel onComplete={onComplete} /></WorkspaceProvider>);
    fireEvent.change(screen.getByLabelText('Choisir un export de stock CSV'), { target: { files: [csvFile('id;titre;stock\nshop-1;Jeu boutique;7')] } });
    await screen.findByText('stock-boutique.csv');
    expect(JSON.parse(localStorage.getItem('reeple.workspace.v1')!).stockSnapshot.source).toBe('demo');
    expect(screen.getByRole('button', { name: 'Confirmer l’import' })).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/Date de génération de l’export/), { target: { value: '2026-10-01T10:00' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /Remplacer l’instantané/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmer l’import' }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
    const saved = JSON.parse(localStorage.getItem('reeple.workspace.v1')!);
    expect(saved.stockSnapshot.source).toBe('csv');
    expect(saved.stockSnapshot.references).toEqual([{ id: 'shop-1', title: 'Jeu boutique', stock: 7 }]);
    expect(saved.games.length).toBeGreaterThan(0);
  });

  it('shows an invalid row and leaves the current snapshot untouched', async () => {
    render(<WorkspaceProvider><StockImportPanel /></WorkspaceProvider>);
    const previous = JSON.parse(localStorage.getItem('reeple.workspace.v1')!).stockSnapshot;
    fireEvent.change(screen.getByLabelText('Choisir un export de stock CSV'), { target: { files: [csvFile('id;titre;stock\na;Valide;3\nb;Invalide;-1')] } });
    expect(await screen.findByRole('alert')).toHaveTextContent('Ligne 3');
    expect(screen.queryByRole('button', { name: 'Confirmer l’import' })).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('reeple.workspace.v1')!).stockSnapshot).toEqual(previous);
  });
});
