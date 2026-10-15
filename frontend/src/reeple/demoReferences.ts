// Static, manually checked references, separate from authenticated API imports.
// Durations use the upper end of BGG's range for the existing advice filters.
export interface DemoReference {
  id: number; title: string; year: number; checkedAt: string;
  minPlayers: number; maxPlayers: number; minAge: number; minutes: number;
  durationLabel: string;
}
const ref = (id: number, title: string, year: number, minPlayers: number, maxPlayers: number, minAge: number, minutes: number, durationLabel: string): DemoReference =>
  ({ id, title, year, minPlayers, maxPlayers, minAge, minutes, durationLabel, checkedAt: '2026-10-15' });

export const demoReferences: Record<string, DemoReference> = {
  'bomb-busters': ref(413246, 'Bomb Busters', 2024, 2, 5, 10, 30, '30 min'),
  'order-overload': ref(361214, 'Order Overload: Cafe', 2022, 2, 6, 6, 20, '20 min'),
  'the-crew': ref(284083, 'The Crew: The Quest for Planet Nine', 2019, 2, 5, 10, 20, '20 min'),
  azul: ref(230802, 'Azul', 2017, 2, 4, 8, 45, '30–45 min'),
  'just-one': ref(254640, 'Just One', 2018, 3, 7, 8, 60, '20–60 min'),
  dixit: ref(39856, 'Dixit', 2008, 3, 6, 8, 30, '30 min'),
  duel: ref(173346, '7 Wonders Duel', 2015, 2, 2, 10, 30, '30 min'),
  cartographers: ref(263918, 'Cartographers', 2019, 1, 100, 10, 45, '30–45 min'),
  dobble: ref(63268, 'Spot it! / Dobble', 2009, 2, 8, 6, 15, '15 min'),
  'micro-macro': ref(318977, 'MicroMacro: Crime City', 2020, 1, 4, 12, 45, '15–45 min'),
  cascadia: ref(295947, 'Cascadia', 2021, 1, 4, 10, 45, '30–45 min'),
  dune: ref(316554, 'Dune: Imperium', 2020, 1, 4, 14, 120, '60–120 min'),
  wingspan: ref(266192, 'Wingspan', 2019, 1, 5, 10, 70, '40–70 min'),
  splendor: ref(148228, 'Splendor', 2014, 2, 4, 10, 30, '30 min'),
  carcassonne: ref(822, 'Carcassonne', 2000, 2, 5, 7, 45, '30–45 min'),
};
