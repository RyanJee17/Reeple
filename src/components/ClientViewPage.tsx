import { useState } from "react";
import {
  Search,
  Sparkles,
  ArrowLeft,
  Users,
  Clock,
  Zap,
  Grid3x3,
  Brain,
  Baby,
  Heart,
  ShoppingBag,
  Filter,
  X,
} from "lucide-react";
import logoReeple from "figma:asset/c71e2c6b7b9368dfe5d8a1f334d3ba6e7407f51f.png";
import qrCodeWishlist from "figma:asset/933f7240d294fe965dd46b8ffb3dbbf506115c39.png";
import img7Wonders from "figma:asset/a8743c728111aecc5937fe606fee51581fc4d598.png";
import imgWingspan from "figma:asset/f5326c40bc684b450537293116a7bd0397608780.png";
import imgAzul from "figma:asset/b2bd4f64a313a1cb6f1f1e1e7d438c4ebf0d1e50.png";
import imgTicketToRide from "figma:asset/980adf31a92f831a153e982ac267b3c800fa62ec.png";
import imgCatan from "figma:asset/6a0c109107753623f0484140844bf08fa14f2454.png";

// Mock data simplifié
const mockPlayers = [
  {
    pseudo: "Sunreez",
    clientNumber: "12345",
    preferredCategories: ["Stratégie", "Famille"],
  },
];

const mockGames = [
  {
    id: "1",
    title: "Catan",
    category: "Stratégie",
    players: "3-4",
    duration: "60-90 min",
    age: "10+",
    owned: false,
    price: 39.99,
    image: imgCatan,
  },
  {
    id: "2",
    title: "Ticket to Ride",
    category: "Famille",
    players: "2-5",
    duration: "30-60 min",
    age: "8+",
    owned: false,
    price: 44.99,
    image: imgTicketToRide,
  },
  {
    id: "3",
    title: "Azul",
    category: "Famille",
    players: "2-4",
    duration: "30-45 min",
    age: "8+",
    owned: false,
    price: 39.9,
    image: imgAzul,
  },
];

// Composants UI
const Card = ({ className = "", children, ...props }: any) => (
  <div className={`rounded-xl border ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({
  className = "",
  variant = "default",
  children,
  ...props
}: any) => {
  const baseClass =
    "px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center";
  const variants = {
    default:
      "bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E]",
    outline:
      "bg-[#A50104] border border-[#A50104] text-[#F8F7ED] hover:bg-[#A50104]/80",
    ghost: "text-[#F8F7ED] hover:bg-[#A50104]/20",
  };
  return (
    <button
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: any) => (
  <input
    className={`w-full px-3 py-2 rounded-lg ${className}`}
    {...props}
  />
);

const Badge = ({ className = "", children, ...props }: any) => (
  <span
    className={`inline-block px-2 py-1 rounded text-xs font-medium ${className}`}
    {...props}
  >
    {children}
  </span>
);

type ViewMode =
  | "welcome"
  | "discovery"
  | "myludo-results"
  | "search-results"
  | "wishlist";

interface FilterState {
  playerCount: string;
  minAge: string;
  duration: string;
  gameType: string;
  spaceRequired: string;
  concentrationLevel: string;
}

interface ClientViewPageProps {
  onNavigate: (page: string, playerId?: string) => void;
}

export function ClientViewPage({
  onNavigate,
}: ClientViewPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("welcome");
  const [myLudoId, setMyLudoId] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    playerCount: "",
    minAge: "",
    duration: "",
    gameType: "",
    spaceRequired: "",
    concentrationLevel: "",
  });
  const [recommendations, setRecommendations] = useState<any[]>(
    [],
  );
  const [playerProfile, setPlayerProfile] = useState<any>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showWishlistToast, setShowWishlistToast] =
    useState(false);
  const [animatingHeart, setAnimatingHeart] = useState<
    string | null
  >(null);

  const staffFavorites = [
    {
      id: "fav1",
      title: "7 Wonders",
      category: "Stratégie",
      players: "2-7",
      duration: "30-45 min",
      age: "10+",
      price: 44.9,
      image: img7Wonders,
      description:
        "Construisez votre civilisation à travers les âges",
    },
    {
      id: "fav2",
      title: "Wingspan",
      category: "Stratégie",
      players: "1-5",
      duration: "40-70 min",
      age: "10+",
      price: 54.9,
      image: imgWingspan,
      description: "Créez votre réserve ornithologique",
    },
    {
      id: "fav3",
      title: "Azul",
      category: "Famille",
      players: "2-4",
      duration: "30-45 min",
      age: "8+",
      price: 39.9,
      image: imgAzul,
      description: "Décorez les murs du palais royal",
    },
  ];

  const toggleWishlist = (gameId: string) => {
    setAnimatingHeart(gameId);
    setTimeout(() => setAnimatingHeart(null), 600);

    if (wishlist.includes(gameId)) {
      setWishlist(wishlist.filter((id) => id !== gameId));
    } else {
      setWishlist([...wishlist, gameId]);
      setShowWishlistToast(true);
      setTimeout(() => setShowWishlistToast(false), 3000);
    }
  };

  const handleMyLudoSearch = () => {
    if (!myLudoId.trim()) {
      alert("Veuillez entrer votre identifiant MyLudo");
      return;
    }

    const player = mockPlayers.find(
      (p) =>
        p.pseudo.toLowerCase() === myLudoId.toLowerCase() ||
        p.clientNumber === myLudoId,
    );

    if (player) {
      setPlayerProfile(player);
      const playerRecs = mockGames
        .filter(
          (g) =>
            !g.owned &&
            player.preferredCategories.includes(g.category),
        )
        .map((g) => ({
          ...g,
          matchReason: `Correspond à votre passion pour les jeux de ${g.category.toLowerCase()}`,
        }));
      setRecommendations(playerRecs);
      setViewMode("myludo-results");
    } else {
      alert("Identifiant MyLudo non trouvé");
    }
  };

  const handleFilterSearch = () => {
    const hasFilters = Object.values(filters).some(
      (v) => v !== "",
    );
    if (!hasFilters) {
      // Afficher tous les jeux si aucun filtre
      setRecommendations(
        mockGames.map((g) => ({
          ...g,
          matchReason: "Recommandation générale",
        })),
      );
    } else {
      let filtered = mockGames.filter((g) => !g.owned);

      if (filters.playerCount) {
        filtered = filtered.filter((g) => {
          const maxPlayers = parseInt(g.players.split("-")[1]);
          return maxPlayers >= parseInt(filters.playerCount);
        });
      }

      if (filters.gameType) {
        filtered = filtered.filter(
          (g) => g.category === filters.gameType,
        );
      }

      setRecommendations(
        filtered.map((g) => ({
          ...g,
          matchReason: "Correspond à vos critères",
        })),
      );
    }

    setViewMode("search-results");
    setShowFilters(false);
  };

  const generateQRCodeData = () => {
    return JSON.stringify({
      type: "wishlist",
      games: wishlist,
    });
  };

  const allGames = [...staffFavorites, ...mockGames];
  const wishlistGames = allGames.filter((g) =>
    wishlist.includes(g.id),
  );

  return (
    <div className="h-screen w-screen bg-[#0D1B1E] overflow-hidden flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col p-4">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate("home")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <button
              onClick={() => onNavigate("home")}
              className="w-32 h-10 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                src={logoReeple}
                alt="Reeple Logo"
                className="h-full object-contain"
              />
            </button>
          </div>

          <Button
            variant="outline"
            onClick={() => setViewMode("wishlist")}
            className="relative"
          >
            <Heart
              className="w-5 h-5 mr-2"
              fill={wishlist.length > 0 ? "#F8F7ED" : "none"}
            />
            Ma sélection{" "}
            {wishlist.length > 0 && `(${wishlist.length})`}
          </Button>
        </div>

        {/* Toast Wishlist */}
        {showWishlistToast && (
          <div className="fixed top-20 right-4 bg-[#FFDA6B] text-[#0D1B1E] px-4 py-2 rounded-lg shadow-lg animate-bounce z-50">
            💡 Cliquez sur les ❤️ pour créer votre sélection !
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex-1 min-h-0 flex flex-col overflow-auto">
          {/* Welcome View - Deux colonnes */}
          {viewMode === "welcome" && (
            <div className="flex items-center justify-center h-full p-4">
              <div className="grid grid-cols-2 gap-6 w-full max-w-6xl">
                {/* Colonne gauche - MyLudo */}
                <Card className="p-8 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 flex flex-col justify-center">
                  <div className="w-20 h-20 bg-[#FFDA6B]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-[#FFDA6B]" />
                  </div>
                  <h2 className="text-[#F8F7ED] text-2xl mb-4 text-center">
                    Vous avez un compte MyLudo ?
                  </h2>
                  <p className="text-[#F8F7ED]/60 mb-6 text-center">
                    Connectez-vous pour des recommandations
                    personnalisées basées sur votre ludothèque
                  </p>

                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Pseudo ou numéro client MyLudo"
                      value={myLudoId}
                      onChange={(e: any) =>
                        setMyLudoId(e.target.value)
                      }
                      className="h-12 bg-[#0D1B1E] border border-[#A50104]/20 text-[#F8F7ED] placeholder:text-[#F8F7ED]/40"
                      onKeyPress={(e: any) =>
                        e.key === "Enter" &&
                        handleMyLudoSearch()
                      }
                    />
                    <Button
                      onClick={handleMyLudoSearch}
                      className="w-full h-12 text-base"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Lancer l'analyse
                    </Button>
                  </div>
                </Card>

                {/* Colonne droite - Découverte */}
                <Card className="p-8 bg-[#A50104]/10 backdrop-blur border-[#A50104]/30 flex flex-col justify-center">
                  <div className="w-20 h-20 bg-[#A50104]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-[#A50104]" />
                  </div>
                  <h2 className="text-[#F8F7ED] text-2xl mb-4 text-center">
                    Pas de compte MyLudo ?
                  </h2>
                  <p className="text-[#F8F7ED]/60 mb-6 text-center">
                    Découvrez nos coups de cœur et trouvez le
                    jeu parfait grâce à nos filtres
                  </p>

                  <Button
                    onClick={() => setViewMode("discovery")}
                    variant="outline"
                    className="w-full h-12 text-base"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Découvrez nos recommandations
                  </Button>
                </Card>
              </div>
            </div>
          )}

          {/* Discovery View - Coups de cœur avec filtres */}
          {viewMode === "discovery" && (
            <div className="h-full flex flex-col relative">
              {/* Barre de recherche discrète */}
              <div className="shrink-0 mb-4 flex gap-3 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F8F7ED]/40" />
                  <input
                    type="text"
                    placeholder="Rechercher un jeu..."
                    className="w-full h-10 pl-10 pr-4 bg-[#0D1B1E]/80 border border-[#A50104]/20 rounded-lg text-[#F8F7ED] text-sm placeholder:text-[#F8F7ED]/40"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-10 px-4 rounded-lg font-medium transition-colors inline-flex items-center justify-center bg-transparent border-2 border-[#A50104] text-[#F8F7ED] hover:bg-[#A50104]/20"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </button>
                <Button
                  onClick={handleFilterSearch}
                  className="h-10"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
              </div>

              {/* Modal de filtres flottant */}
              {showFilters && (
                <>
                  {/* Overlay */}
                  <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setShowFilters(false)}
                  />

                  {/* Fenêtre flottante */}
                  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl">
                    <Card className="p-6 bg-[#0D1B1E] backdrop-blur border-[#A50104]/40 shadow-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#F8F7ED] text-lg">
                          Affiner la recherche
                        </h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="text-[#F8F7ED]/60 hover:text-[#F8F7ED] transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="text-[#F8F7ED]/80 flex items-center gap-2 mb-2 text-sm">
                            <Users className="w-4 h-4 text-[#FFDA6B]" />
                            Nombre de joueurs
                          </label>
                          <select
                            value={filters.playerCount}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                playerCount: e.target.value,
                              })
                            }
                            className="w-full bg-[#0D1B1E] border border-[#A50104]/20 rounded-lg px-3 py-2 text-[#F8F7ED] text-sm"
                          >
                            <option value="">Tous</option>
                            <option value="2">2 joueurs</option>
                            <option value="3">3 joueurs</option>
                            <option value="4">4 joueurs</option>
                            <option value="5">
                              5+ joueurs
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[#F8F7ED]/80 flex items-center gap-2 mb-2 text-sm">
                            <Baby className="w-4 h-4 text-[#FFDA6B]" />
                            Âge minimum
                          </label>
                          <select
                            value={filters.minAge}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                minAge: e.target.value,
                              })
                            }
                            className="w-full bg-[#0D1B1E] border border-[#A50104]/20 rounded-lg px-3 py-2 text-[#F8F7ED] text-sm"
                          >
                            <option value="">Tous</option>
                            <option value="6">6 ans+</option>
                            <option value="8">8 ans+</option>
                            <option value="10">10 ans+</option>
                            <option value="12">12 ans+</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[#F8F7ED]/80 flex items-center gap-2 mb-2 text-sm">
                            <Zap className="w-4 h-4 text-[#FFDA6B]" />
                            Type de jeu
                          </label>
                          <select
                            value={filters.gameType}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                gameType: e.target.value,
                              })
                            }
                            className="w-full bg-[#0D1B1E] border border-[#A50104]/20 rounded-lg px-3 py-2 text-[#F8F7ED] text-sm"
                          >
                            <option value="">Tous</option>
                            <option value="Famille">
                              Famille
                            </option>
                            <option value="Stratégie">
                              Stratégie
                            </option>
                            <option value="Ambiance">
                              Ambiance
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[#F8F7ED]/80 flex items-center gap-2 mb-2 text-sm">
                            <Clock className="w-4 h-4 text-[#FFDA6B]" />
                            Durée de jeu
                          </label>
                          <select
                            value={filters.duration}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                duration: e.target.value,
                              })
                            }
                            className="w-full bg-[#0D1B1E] border border-[#A50104]/20 rounded-lg px-3 py-2 text-[#F8F7ED] text-sm"
                          >
                            <option value="">Toutes</option>
                            <option value="15">Moins de 15 min</option>
                            <option value="30">15-30 min</option>
                            <option value="60">30-60 min</option>
                            <option value="90">1h-1h30</option>
                            <option value="120">Plus de 1h30</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[#F8F7ED]/80 flex items-center gap-2 mb-2 text-sm">
                            <Brain className="w-4 h-4 text-[#FFDA6B]" />
                            Niveau de concentration
                          </label>
                          <select
                            value={filters.concentrationLevel}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                concentrationLevel: e.target.value,
                              })
                            }
                            className="w-full bg-[#0D1B1E] border border-[#A50104]/20 rounded-lg px-3 py-2 text-[#F8F7ED] text-sm"
                          >
                            <option value="">Tous</option>
                            <option value="leger">Léger</option>
                            <option value="moyen">Moyen</option>
                            <option value="intense">Intense</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[#F8F7ED]/80 flex items-center gap-2 mb-2 text-sm">
                            <Grid3x3 className="w-4 h-4 text-[#FFDA6B]" />
                            Place disponible
                          </label>
                          <select
                            value={filters.spaceRequired}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                spaceRequired: e.target.value,
                              })
                            }
                            className="w-full bg-[#0D1B1E] border border-[#A50104]/20 rounded-lg px-3 py-2 text-[#F8F7ED] text-sm"
                          >
                            <option value="">Toutes</option>
                            <option value="petite">Petite table</option>
                            <option value="moyenne">Table moyenne</option>
                            <option value="grande">Grande table</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setFilters({
                              playerCount: "",
                              minAge: "",
                              duration: "",
                              gameType: "",
                              spaceRequired: "",
                              concentrationLevel: "",
                            });
                          }}
                          variant="ghost"
                          className="flex-1 h-11"
                        >
                          Réinitialiser
                        </Button>
                        <Button
                          onClick={handleFilterSearch}
                          className="flex-1 h-11"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Appliquer les filtres
                        </Button>
                      </div>
                    </Card>
                  </div>
                </>
              )}

              {/* Coups de cœur - Hauteur fixe */}
              <div className="flex-1 min-h-0 flex flex-col">
                <h2 className="text-[#F8F7ED] text-xl mb-3 shrink-0">
                  Les coups de cœur de nos vendeurs
                </h2>
                <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
                  {staffFavorites.map((game) => (
                    <div key={game.id} className="h-full">
                      <GameCard
                        game={game}
                        isInWishlist={wishlist.includes(
                          game.id,
                        )}
                        onToggleWishlist={toggleWishlist}
                        animating={animatingHeart === game.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MyLudo Results */}
          {viewMode === "myludo-results" && (
            <ResultsView
              title={`Recommandations pour ${playerProfile?.pseudo}`}
              subtitle="Basées sur votre ludothèque MyLudo"
              games={recommendations}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              animatingHeart={animatingHeart}
              onBack={() => setViewMode("welcome")}
            />
          )}

          {/* Search Results */}
          {viewMode === "search-results" && (
            <ResultsView
              title="Résultats de recherche"
              subtitle={`${recommendations.length} jeu(x) trouvé(s)`}
              games={recommendations}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              animatingHeart={animatingHeart}
              onBack={() => setViewMode("discovery")}
            />
          )}

          {/* Wishlist View */}
          {viewMode === "wishlist" && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#F8F7ED] text-2xl">
                  Ma sélection
                </h2>
                <Button
                  onClick={() => setViewMode("welcome")}
                  variant="ghost"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour
                </Button>
              </div>

              {wishlistGames.length > 0 ? (
                <div className="flex-1 grid grid-cols-2 gap-6">
                  {/* Liste des jeux */}
                  <div className="overflow-auto space-y-3">
                    {wishlistGames.map((game) => (
                      <Card
                        key={game.id}
                        className="p-4 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 flex gap-4"
                      >
                        <img
                          src={game.image}
                          alt={game.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-[#F8F7ED] mb-1">
                            {game.title}
                          </h3>
                          <p className="text-[#A50104] text-sm mb-2">
                            {game.category}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[#F8F7ED]/60">
                            <span>{game.players} joueurs</span>
                            <span>{game.duration}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() =>
                              toggleWishlist(game.id)
                            }
                            className="text-[#A50104] hover:text-[#F8F7ED] transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <p className="text-[#FFDA6B] font-semibold">
                            {game.price.toFixed(2)} €
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* QR Code */}
                  <Card className="p-6 bg-[#F8F7ED] flex flex-col items-center justify-center text-center">
                    <h3 className="text-[#0D1B1E] text-xl mb-4">
                      Montrez ce QR Code à un vendeur
                    </h3>
                    <p className="text-[#0D1B1E]/60 text-sm mb-6">
                      Il pourra vous conseiller sur votre
                      sélection
                    </p>
                    <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-4 border-[#0D1B1E]">
                      <img
                        src={qrCodeWishlist}
                        alt="QR Code Wishlist"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[#0D1B1E]/40 text-xs mt-4">
                      Code: {wishlist.join("-")}
                    </p>
                  </Card>
                </div>
              ) : (
                <Card className="flex-1 flex items-center justify-center bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20">
                  <div className="text-center">
                    <Heart className="w-16 h-16 text-[#F8F7ED]/20 mx-auto mb-4" />
                    <p className="text-[#F8F7ED] text-lg mb-2">
                      Votre sélection est vide
                    </p>
                    <p className="text-[#F8F7ED]/60 text-sm">
                      Cliquez sur les ❤️ pour ajouter des jeux
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant GameCard
function GameCard({
  game,
  isInWishlist,
  onToggleWishlist,
  animating,
}: any) {
  return (
    <Card className="p-3 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 hover:border-[#FFDA6B]/40 transition-all flex flex-col h-full overflow-hidden">
      <div className="relative mb-2 shrink-0">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-32 object-cover rounded-lg"
        />
        <button
          onClick={() => onToggleWishlist(game.id)}
          className={`absolute top-2 right-2 w-10 h-10 rounded-full bg-[#0D1B1E]/80 backdrop-blur flex items-center justify-center transition-all ${
            animating ? "animate-ping" : ""
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isInWishlist
                ? "text-[#A50104] fill-[#A50104]"
                : "text-[#F8F7ED]"
            }`}
          />
        </button>
        <Badge className="absolute top-2 left-2 bg-[#A50104] text-[#F8F7ED] border-0 text-xs">
          Coup de ❤️
        </Badge>
      </div>

      <h3 className="text-[#F8F7ED] text-[15px] mb-0.5 shrink-0 line-clamp-1">
        {game.title}
      </h3>
      <p className="text-[#A50104] text-sm mb-2 shrink-0">
        {game.category}
      </p>
      <p className="text-[#F8F7ED]/70 text-sm mb-2 flex-1 line-clamp-2 overflow-hidden">
        {game.description}
      </p>

      <div className="space-y-0.5 text-sm mb-2 shrink-0">
        <div className="flex justify-between">
          <span className="text-[#F8F7ED]/60">Joueurs</span>
          <span className="text-[#F8F7ED]">{game.players}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#F8F7ED]/60">Durée</span>
          <span className="text-[#F8F7ED]">
            {game.duration}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#F8F7ED]/60">Âge</span>
          <span className="text-[#F8F7ED]">{game.age}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#A50104]/20 shrink-0">
        <p className="text-[#FFDA6B] text-center font-semibold text-[15px]">
          {game.price.toFixed(2)} €
        </p>
      </div>
    </Card>
  );
}

// Composant ResultsView
function ResultsView({
  title,
  subtitle,
  games,
  wishlist,
  onToggleWishlist,
  animatingHeart,
  onBack,
}: any) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[#F8F7ED] text-xl">{title}</h2>
          <p className="text-[#F8F7ED]/60 text-sm">
            {subtitle}
          </p>
        </div>
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Button>
      </div>

      {games.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 flex-1 overflow-auto pb-4">
          {games.map((game: any, index: number) => (
            <Card
              key={game.id}
              className="p-3 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 hover:border-[#FFDA6B]/40 transition-all flex flex-col h-full"
            >
              <div className="relative mb-2">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-36 object-cover rounded-lg"
                />
                <button
                  onClick={() => onToggleWishlist(game.id)}
                  className={`absolute top-2 right-2 w-10 h-10 rounded-full bg-[#0D1B1E]/80 backdrop-blur flex items-center justify-center transition-all ${
                    animatingHeart === game.id
                      ? "animate-ping"
                      : ""
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      wishlist.includes(game.id)
                        ? "text-[#A50104] fill-[#A50104]"
                        : "text-[#F8F7ED]"
                    }`}
                  />
                </button>
                <Badge className="absolute top-2 left-2 bg-[#FFDA6B] text-[#0D1B1E] border-0">
                  #{index + 1}
                </Badge>
              </div>

              <h3 className="text-[#F8F7ED] text-sm mb-1">
                {game.title}
              </h3>
              <p className="text-[#A50104] text-xs mb-2">
                {game.category}
              </p>

              <div className="space-y-1 text-xs mb-2">
                <div className="flex justify-between">
                  <span className="text-[#F8F7ED]/60">
                    Joueurs
                  </span>
                  <span className="text-[#F8F7ED]">
                    {game.players}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F8F7ED]/60">
                    Durée
                  </span>
                  <span className="text-[#F8F7ED]">
                    {game.duration}
                  </span>
                </div>
              </div>

              <div className="bg-[#FFDA6B]/10 border border-[#FFDA6B]/20 rounded-lg p-2 mb-2">
                <p className="text-[#F8F7ED]/80 text-xs">
                  {game.matchReason}
                </p>
              </div>

              <div className="pt-2 border-t border-[#A50104]/20 mt-auto">
                <p className="text-[#FFDA6B] text-center font-semibold">
                  {game.price.toFixed(2)} €
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex-1 flex items-center justify-center bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20">
          <p className="text-[#F8F7ED]">Aucun jeu trouvé</p>
        </Card>
      )}
    </div>
  );
}