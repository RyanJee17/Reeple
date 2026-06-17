// Mock data for the board game store assistant

export interface Game {
  id: string;
  title: string;
  image: string;
  category: string;
  mechanics: string[];
  duration: string;
  players: string;
  complexity: number;
  inStock: boolean;
  price: number;
  owned?: boolean;
}

export interface Player {
  id: string;
  pseudo: string;
  avatar: string;
  clientNumber: string;
  totalGames: number;
  avgRating: number;
  preferredCategories: string[];
  lastPurchase?: Game;
  lastLibraryAddition?: Game;
  profile: {
    complexity: number;
    avgDuration: number;
    topMechanics: string[];
    topCategories: { category: string; count: number }[];
  };
}

export const mockGames: Game[] = [
  {
    id: '1',
    title: 'Wingspan',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400',
    category: 'Stratégie',
    mechanics: ['Collection', 'Placement d\'ouvriers'],
    duration: '40-70 min',
    players: '1-5',
    complexity: 2.4,
    inStock: true,
    price: 59.90,
  },
  {
    id: '2',
    title: '7 Wonders Duel',
    image: 'https://images.unsplash.com/photo-1611891487736-900bad3e03e0?w=400',
    category: '2 joueurs',
    mechanics: ['Draft', 'Civilisation'],
    duration: '30 min',
    players: '2',
    complexity: 2.2,
    inStock: true,
    price: 24.90,
  },
  {
    id: '3',
    title: 'Azul',
    image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400',
    category: 'Famille',
    mechanics: ['Pattern building', 'Draft'],
    duration: '30-45 min',
    players: '2-4',
    complexity: 1.8,
    inStock: true,
    price: 39.90,
  },
  {
    id: '4',
    title: 'Splendor',
    image: 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=400',
    category: 'Famille',
    mechanics: ['Collection de ressources', 'Développement'],
    duration: '30 min',
    players: '2-4',
    complexity: 1.8,
    inStock: false,
    price: 32.90,
  },
  {
    id: '5',
    title: 'Pandemic',
    image: 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=400',
    category: 'Coopératif',
    mechanics: ['Gestion de main', 'Déplacement'],
    duration: '45 min',
    players: '2-4',
    complexity: 2.4,
    inStock: true,
    price: 42.90,
  },
  {
    id: '6',
    title: 'Carcassonne',
    image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400',
    category: 'Famille',
    mechanics: ['Placement de tuiles', 'Zone control'],
    duration: '35 min',
    players: '2-5',
    complexity: 1.9,
    inStock: true,
    price: 29.90,
  },
  {
    id: '7',
    title: 'Ticket to Ride Europe',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400',
    category: 'Famille',
    mechanics: ['Collection', 'Routes'],
    duration: '60 min',
    players: '2-5',
    complexity: 1.9,
    inStock: true,
    price: 44.90,
  },
  {
    id: '8',
    title: 'Dixit',
    image: 'https://images.unsplash.com/photo-1611891487736-900bad3e03e0?w=400',
    category: 'Ambiance',
    mechanics: ['Storytelling', 'Simultané'],
    duration: '30 min',
    players: '3-8',
    complexity: 1.2,
    inStock: true,
    price: 29.90,
  },
  {
    id: '9',
    title: 'Gloomhaven',
    image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400',
    category: 'Expert',
    mechanics: ['Dungeon crawler', 'Campagne', 'Coopératif'],
    duration: '120 min',
    players: '1-4',
    complexity: 3.8,
    inStock: true,
    price: 139.90,
  },
  {
    id: '10',
    title: 'Codenames',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400',
    category: 'Ambiance',
    mechanics: ['Association', 'Équipes'],
    duration: '15 min',
    players: '2-8',
    complexity: 1.3,
    inStock: true,
    price: 19.90,
  },
];

export const mockPlayers: Player[] = [
  {
    id: '1',
    pseudo: 'Ryan Jeewooth',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    clientNumber: '1726043106',
    totalGames: 47,
    avgRating: 8.2,
    preferredCategories: ['Stratégie', 'Expert', 'Coopératif'],
    lastPurchase: mockGames[0],
    lastLibraryAddition: mockGames[5],
    profile: {
      complexity: 2.8,
      avgDuration: 90,
      topMechanics: ['Placement d\'ouvriers', 'Gestion de ressources', 'Deckbuilding'],
      topCategories: [
        { category: 'Stratégie', count: 18 },
        { category: 'Expert', count: 12 },
        { category: 'Coopératif', count: 8 },
        { category: 'Famille', count: 6 },
        { category: '2 joueurs', count: 3 },
      ],
    },
  },
  {
    id: '2',
    pseudo: 'Anatole Saint-Yves',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
    clientNumber: '1726043201',
    totalGames: 32,
    avgRating: 7.8,
    preferredCategories: ['Famille', 'Ambiance', 'Coopératif'],
    profile: {
      complexity: 2.0,
      avgDuration: 45,
      topMechanics: ['Collection', 'Draft', 'Pattern building'],
      topCategories: [
        { category: 'Famille', count: 15 },
        { category: 'Ambiance', count: 10 },
        { category: 'Coopératif', count: 5 },
        { category: 'Stratégie', count: 2 },
      ],
    },
  },
  {
    id: '3',
    pseudo: 'Nicolas Serbource',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100',
    clientNumber: '1726043302',
    totalGames: 68,
    avgRating: 8.5,
    preferredCategories: ['Expert', 'Stratégie', '2 joueurs'],
    profile: {
      complexity: 3.2,
      avgDuration: 120,
      topMechanics: ['Deckbuilding', 'Placement d\'ouvriers', 'Zone control'],
      topCategories: [
        { category: 'Expert', count: 25 },
        { category: 'Stratégie', count: 22 },
        { category: '2 joueurs', count: 12 },
        { category: 'Coopératif', count: 6 },
        { category: 'Famille', count: 3 },
      ],
    },
  },
  {
    id: '4',
    pseudo: 'Kone Stella',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100',
    clientNumber: '1726043403',
    totalGames: 15,
    avgRating: 7.5,
    preferredCategories: ['Ambiance', 'Famille', 'Enfants'],
    profile: {
      complexity: 1.5,
      avgDuration: 30,
      topMechanics: ['Storytelling', 'Simultané', 'Collection'],
      topCategories: [
        { category: 'Ambiance', count: 8 },
        { category: 'Famille', count: 5 },
        { category: 'Enfants', count: 2 },
      ],
    },
  },
  {
    id: '5',
    pseudo: 'Saimati Soufou',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
    clientNumber: '1726043504',
    totalGames: 41,
    avgRating: 8.0,
    preferredCategories: ['Coopératif', 'Stratégie', 'Famille'],
    profile: {
      complexity: 2.3,
      avgDuration: 60,
      topMechanics: ['Coopératif', 'Gestion de main', 'Collection'],
      topCategories: [
        { category: 'Coopératif', count: 18 },
        { category: 'Stratégie', count: 12 },
        { category: 'Famille', count: 8 },
        { category: 'Ambiance', count: 3 },
      ],
    },
  },
  {
    id: '6',
    pseudo: 'Carole Lymer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    clientNumber: '1726043605',
    totalGames: 28,
    avgRating: 7.9,
    preferredCategories: ['2 joueurs', 'Stratégie', 'Famille'],
    profile: {
      complexity: 2.1,
      avgDuration: 45,
      topMechanics: ['Draft', 'Civilisation', 'Collection'],
      topCategories: [
        { category: '2 joueurs', count: 14 },
        { category: 'Stratégie', count: 8 },
        { category: 'Famille', count: 6 },
      ],
    },
  },
];

export const sellerProfile = {
  name: 'Sophie',
  role: 'Vendeuse',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  stats: {
    avgClientTime: '12 min',
    topRecommendations: ['Wingspan', 'Azul', '7 Wonders Duel'],
    todayClients: 8,
  },
};

export const recentScans = mockPlayers.slice(0, 4);
