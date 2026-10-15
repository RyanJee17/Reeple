import { describe, expect, it } from 'vitest';
import { initialData, refreshAssets } from './model';

describe('static demo catalogue', () => {
  it('uses real references without claiming an API retrieval or a live rating', () => {
    const data = initialData();
    expect(data.games).toHaveLength(15);
    for (const game of data.games) {
      expect(game.demoReference?.id).toBeGreaterThan(0);
      expect(game.bgg).toBeUndefined();
      expect(game.rating).toBeUndefined();
    }
    expect(data.games.find(g => g.id === 'the-crew')).toMatchObject({ minPlayers: 2, minutes: 20 });
    expect(data.games.find(g => g.id === 'dixit')).toMatchObject({ maxPlayers: 6 });
  });

  it('upgrades an existing demo without losing shop values, imports or user edits', () => {
    const data = initialData();
    data.games = data.games.filter(g => !['wingspan', 'splendor', 'carcassonne'].includes(g.id)).map(({ demoReference, ...g }) => g);
    data.games[0] = { ...data.games[0], stock: 42, price: 19.50, rating: 8.81 };
    data.games[1] = { ...data.games[1], title: 'Ma référence personnalisée' };
    data.games[2] = { ...data.games[2], minPlayers: 3, bgg: { id: 284083, title: 'The Crew', retrievedAt: '2026-10-15T12:00:00Z', categories: [], mechanics: [] } };
    const updated = refreshAssets(data);
    expect(updated.games[0]).toMatchObject({ stock: 42, price: 19.50, minAge: 10 });
    expect(updated.games[0].rating).toBeUndefined();
    expect(updated.games[1].demoReference).toBeUndefined();
    expect(updated.games[2]).toMatchObject({ minPlayers: 3, bgg: { id: 284083 } });
    expect(updated.games).toHaveLength(15);
    expect(refreshAssets(updated)).toEqual(updated);
  });

  it('does not enrich or expand an imported shop catalogue', () => {
    const data = initialData();
    data.demo = false;
    data.games = [{ ...data.games[0], demoReference: undefined, minAge: 12, rating: 7 }];
    const updated = refreshAssets(data);
    expect(updated.games).toHaveLength(1);
    expect(updated.games[0]).toMatchObject({ minAge: 12, rating: 7 });
    expect(updated.games[0].demoReference).toBeUndefined();
  });
});
