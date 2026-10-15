import { Button } from './ui/button';
import { Input } from './ui/input';
import logoReeple from 'figma:asset/c71e2c6b7b9368dfe5d8a1f334d3ba6e7407f51f.png';
import { useState, type FormEvent } from 'react';
import { Card } from './ui/card';
import { ArrowLeft, Search, QrCode, X, User, Gamepad2, ShoppingCart, Package } from 'lucide-react';
import { mockPlayers, mockGames, type Player } from '../data/mockData';

interface SearchPageProps {
  onNavigate: (page: string, playerId?: string) => void;
}

interface BggSearchGame {
  id: number;
  title: string;
  yearPublished?: number;
}

interface BggSearchResponse {
  query: string;
  total: number;
  games: BggSearchGame[];
}

interface BggSearchErrorResponse {
  error: string;
}

type BggSearchState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

function isBggSearchResponse(value: unknown): value is BggSearchResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const response = value as Partial<BggSearchResponse>;
  return (
    typeof response.query === 'string' &&
    typeof response.total === 'number' &&
    Array.isArray(response.games) &&
    response.games.every(
      (game) =>
        typeof game.id === 'number' &&
        typeof game.title === 'string' &&
        (game.yearPublished === undefined || typeof game.yearPublished === 'number'),
    )
  );
}

function getApiErrorMessage(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  const response = value as Partial<BggSearchErrorResponse>;
  return typeof response.error === 'string' ? response.error : undefined;
}

export function SearchPage({ onNavigate }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedWishlist, setScannedWishlist] = useState<string | null>(null);
  const [bggQuery, setBggQuery] = useState('');
  const [bggResponse, setBggResponse] = useState<BggSearchResponse | null>(null);
  const [bggSearchState, setBggSearchState] = useState<BggSearchState>('idle');
  const [bggError, setBggError] = useState('');

  const filteredPlayers = searchQuery
    ? mockPlayers.filter((p) =>
        p.pseudo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientNumber.includes(searchQuery)
      )
    : mockPlayers;

  const handleQRScan = () => {
    // Simuler le scan d'un QR code wishlist
    const mockWishlistData = JSON.stringify({ 
      type: "wishlist", 
      games: ["fav1", "fav2", "1"] 
    });
    setScannedWishlist(mockWishlistData);
    setShowQRScanner(false);
  };

  const handleBggSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = bggQuery.trim();

    if (!query) {
      setBggResponse(null);
      setBggError('Saisissez le nom d’un jeu pour lancer la recherche.');
      setBggSearchState('error');
      return;
    }

    setBggResponse(null);
    setBggError('');
    setBggSearchState('loading');

    try {
      const response = await fetch(
        `/api/bgg/search?query=${encodeURIComponent(query)}`,
        { headers: { Accept: 'application/json' } },
      );
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(payload) ?? 'La recherche n’a pas abouti. Réessayez.',
        );
      }

      if (!isBggSearchResponse(payload)) {
        throw new Error('La réponse du serveur est invalide. Réessayez.');
      }

      setBggResponse(payload);
      setBggSearchState(payload.games.length > 0 ? 'success' : 'empty');
    } catch (error) {
      setBggError(
        error instanceof Error
          ? error.message
          : 'Une erreur inattendue est survenue. Réessayez.',
      );
      setBggSearchState('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B1E] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => onNavigate('home')}
            variant="ghost"
            className="text-[#F8F7ED] hover:bg-[#E09891]/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-32 h-10">
            <img src={logoReeple} alt="Reeple Logo" className="h-full object-contain" />
          </div>
          <h1 className="text-[#F8F7ED] text-2xl">Rechercher un joueur</h1>
        </div>

        <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#FFDA6B]/20">
          <h2 className="text-[#F8F7ED] text-lg mb-4">
            Rechercher un jeu dans BoardGameGeek
          </h2>
          <form
            aria-label="Recherche BoardGameGeek"
            onSubmit={handleBggSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1">
              <label htmlFor="bgg-game-query" className="sr-only">
                Nom du jeu
              </label>
              <Input
                id="bgg-game-query"
                type="search"
                placeholder="Nom du jeu…"
                value={bggQuery}
                onChange={(event) => {
                  setBggQuery(event.target.value);
                  setBggResponse(null);
                  setBggError('');
                  setBggSearchState('idle');
                }}
                disabled={bggSearchState === 'loading'}
                className="h-14 bg-[#0D1B1E]/80 border-[#E09891]/20 text-[#F8F7ED] placeholder:text-[#F8F7ED]/40 text-lg"
              />
            </div>
            <Button
              type="submit"
              disabled={bggSearchState === 'loading'}
              className="h-14 px-6 bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E]"
            >
              <Search className="w-5 h-5 mr-2" />
              {bggSearchState === 'loading' ? 'Recherche…' : 'Rechercher un jeu'}
            </Button>
          </form>

          {bggSearchState === 'loading' && (
            <p role="status" className="mt-4 text-[#F8F7ED]">
              Recherche des jeux sur BoardGameGeek…
            </p>
          )}
          {bggSearchState === 'error' && (
            <Card role="alert" className="mt-4 p-4 bg-[#A50104]/20 border-[#A50104]/40">
              <p className="text-[#F8F7ED]">{bggError}</p>
            </Card>
          )}
          {bggSearchState === 'empty' && (
            <p role="status" className="mt-4 text-[#F8F7ED]">
              Aucun jeu trouvé pour « {bggResponse?.query} ».
            </p>
          )}
          {bggSearchState === 'success' && bggResponse && (
            <div className="mt-5">
              <h3 className="text-[#F8F7ED] text-lg mb-3">
                {bggResponse.total} jeu{bggResponse.total > 1 ? 'x' : ''} trouvé
                {bggResponse.total > 1 ? 's' : ''}
              </h3>
              <ul className="space-y-3" aria-label="Résultats BoardGameGeek">
                {bggResponse.games.map((game) => (
                  <li
                    key={game.id}
                    className="flex items-center justify-between gap-4 p-4 bg-[#E09891]/10 rounded-xl"
                  >
                    <span className="text-[#F8F7ED]">{game.title}</span>
                    {game.yearPublished !== undefined && (
                      <span className="text-[#F8F7ED]/60 text-sm">
                        {game.yearPublished}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F8F7ED]/40" />
            <Input
              type="text"
              placeholder="Pseudo MyLudo ou numéro client..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedPlayer(null);
              }}
              className="pl-12 h-14 bg-[#0D1B1E]/80 border-[#E09891]/20 text-[#F8F7ED] placeholder:text-[#F8F7ED]/40 text-lg"
            />
          </div>
          <Button 
            onClick={() => setShowQRScanner(true)}
            className="h-14 px-6 bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E]"
          >
            <QrCode className="w-6 h-6" />
          </Button>
        </div>

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20">
              <h3 className="text-[#F8F7ED] text-lg mb-4">Scanner QR Code</h3>
              <div className="flex items-center justify-center">
                <QrCode className="w-24 h-24 text-[#FFDA6B]" />
              </div>
              <p className="text-[#F8F7ED]/60 text-sm mb-4">Simulez le scan d'un QR Code wishlist</p>
              <Button 
                onClick={handleQRScan}
                className="w-full bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E] h-12"
              >
                Scanner
              </Button>
            </Card>
          </div>
        )}

        {/* Selected Player Card */}
        {selectedPlayer && (
          <div className="space-y-4">
            <Card className="p-6 bg-[#E09891]/20 border-[#E09891]/30 backdrop-blur">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <img 
                  src={selectedPlayer.avatar} 
                  alt={selectedPlayer.pseudo}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-[#FFDA6B] mx-auto md:mx-0"
                />
                <div className="flex-1 w-full">
                  <h2 className="text-[#F8F7ED] text-2xl mb-1">{selectedPlayer.pseudo}</h2>
                  <p className="text-[#F8F7ED]/60 mb-4">Client N° {selectedPlayer.clientNumber}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#0D1B1E]/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Gamepad2 className="w-4 h-4 text-[#FFDA6B]" />
                        <span className="text-[#F8F7ED]/60 text-sm">Jeux</span>
                      </div>
                      <p className="text-[#F8F7ED] text-xl">{selectedPlayer.totalGames}</p>
                    </div>
                    <div className="bg-[#0D1B1E]/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-[#E09891]" />
                        <span className="text-[#F8F7ED]/60 text-sm">Catégories</span>
                      </div>
                      <p className="text-[#F8F7ED] text-xl">{selectedPlayer.profile.topCategories.length}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[#F8F7ED]/60 text-sm mb-2">Catégories dominantes :</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlayer.preferredCategories.map((cat) => (
                        <span 
                          key={cat} 
                          className="bg-[#E09891]/20 text-[#E09891] px-3 py-1 rounded-full text-sm"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => onNavigate('results', selectedPlayer.id)}
                    className="w-full bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E] h-12"
                  >
                    Analyser la ludothèque
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Purchases */}
            {(selectedPlayer.lastPurchase || selectedPlayer.lastLibraryAddition) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPlayer.lastPurchase && (
                  <Card className="p-4 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20">
                    <h3 className="text-[#F8F7ED] mb-3 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-[#FFDA6B]" />
                      Dernier jeu acheté ici
                    </h3>
                    <div className="flex gap-3">
                      <img 
                        src={selectedPlayer.lastPurchase.image} 
                        alt={selectedPlayer.lastPurchase.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F8F7ED] text-sm mb-1 truncate">{selectedPlayer.lastPurchase.title}</p>
                        <p className="text-[#F8F7ED]/60 text-xs mb-2">{selectedPlayer.lastPurchase.category}</p>
                        <div className="flex gap-1 text-xs text-[#E09891]">
                          <span>{selectedPlayer.lastPurchase.players}</span>
                          <span>•</span>
                          <span>{selectedPlayer.lastPurchase.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {selectedPlayer.lastLibraryAddition && (
                  <Card className="p-4 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20">
                    <h3 className="text-[#F8F7ED] mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#FFDA6B]" />
                      Dernier ajout ludothèque
                    </h3>
                    <div className="flex gap-3">
                      <img 
                        src={selectedPlayer.lastLibraryAddition.image} 
                        alt={selectedPlayer.lastLibraryAddition.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F8F7ED] text-sm mb-1 truncate">{selectedPlayer.lastLibraryAddition.title}</p>
                        <p className="text-[#F8F7ED]/60 text-xs mb-2">{selectedPlayer.lastLibraryAddition.category}</p>
                        <div className="flex gap-1 text-xs text-[#E09891]">
                          <span>{selectedPlayer.lastLibraryAddition.players}</span>
                          <span>•</span>
                          <span>{selectedPlayer.lastLibraryAddition.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results List */}
        {searchQuery && !selectedPlayer && (
          <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20">
            <h3 className="text-[#F8F7ED] text-lg mb-4">
              {filteredPlayers.length} résultat{filteredPlayers.length > 1 ? 's' : ''}
            </h3>
            <div className="space-y-3">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 p-4 bg-[#E09891]/10 rounded-xl cursor-pointer hover:bg-[#E09891]/20 transition-all"
                  onClick={() => setSelectedPlayer(player)}
                >
                  <img 
                    src={player.avatar} 
                    alt={player.pseudo}
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-[#F8F7ED] text-lg">{player.pseudo}</p>
                    <p className="text-[#F8F7ED]/60 text-sm">N° {player.clientNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-[#FFDA6B]/20 text-[#FFDA6B] px-3 py-1 rounded-full text-sm">
                      {player.totalGames} jeux
                    </span>
                    <span className="bg-[#E09891]/20 text-[#E09891] px-3 py-1 rounded-full text-sm">
                      ⭐ {player.avgRating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Players */}
        {!searchQuery && !selectedPlayer && (
          <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20">
            <h3 className="text-[#F8F7ED] text-lg mb-4">Recherches récentes</h3>
            <div className="space-y-3">
              {mockPlayers.slice(0, 6).map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 p-4 bg-[#E09891]/10 rounded-xl cursor-pointer hover:bg-[#E09891]/20 transition-all group"
                  onClick={() => setSelectedPlayer(player)}
                >
                  <div className="w-10 h-10 bg-[#E09891]/20 rounded-full flex items-center justify-center text-[#E09891] group-hover:bg-[#FFDA6B] group-hover:text-[#0D1B1E] transition-all">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#F8F7ED]">{player.pseudo}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Help Card */}
        <Card className="p-6 bg-[#FFDA6B]/10 backdrop-blur border-[#FFDA6B]/20">
          <h3 className="text-[#F8F7ED] text-lg mb-3">💡 Astuce</h3>
          <p className="text-[#F8F7ED]/80">
            Scannez le QR Code du client pour un accès instantané  son profil MyLudo, 
            ou recherchez par pseudo pour retrouver rapidement ses préférences et son historique.
          </p>
        </Card>
      </div>
    </div>
  );
}
