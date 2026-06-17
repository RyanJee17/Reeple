import { Badge } from './ui/badge';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import logoReeple from 'figma:asset/c71e2c6b7b9368dfe5d8a1f334d3ba6e7407f51f.png';
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Clock, Zap, Filter, ChevronUp, ChevronDown, Target, Sparkles, Compass, Users, Timer, AlertCircle } from 'lucide-react';
import { mockPlayers, mockGames, type Player, type Game } from '../data/mockData';

interface ResultsPageProps {
  onNavigate: (page: string, playerId?: string) => void;
  playerId: string;
}

export function ResultsPage({ onNavigate, playerId }: ResultsPageProps) {
  const player = mockPlayers.find((p) => p.id === playerId);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPlayers, setMaxPlayers] = useState<string>('all');
  const [maxDuration, setMaxDuration] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeRecoTab, setActiveRecoTab] = useState<'similar' | 'stretch' | 'new'>('similar');

  if (!player) {
    return <div className="min-h-screen bg-[#0D1B1E] flex items-center justify-center text-[#F8F7ED]">Joueur non trouvé</div>;
  }

  // Prepare radar chart data
  const radarData = player.profile.topCategories.map((cat) => ({
    category: cat.category,
    value: cat.count,
  }));

  // Mock recommendations
  const similarGames = mockGames.filter((g) => 
    player.preferredCategories.includes(g.category) && 
    !g.owned &&
    (selectedCategory === 'all' || g.category === selectedCategory) &&
    (maxPlayers === 'all' || parseInt(g.players.split('-')[1]) >= parseInt(maxPlayers)) &&
    (maxDuration === 'all' || parseInt(g.duration.split('-')[0]) <= parseInt(maxDuration))
  ).slice(0, 4);

  const stretchGames = mockGames.filter((g) => 
    !player.preferredCategories.includes(g.category) &&
    g.complexity <= player.profile.complexity + 0.5 &&
    !g.owned &&
    (selectedCategory === 'all' || g.category === selectedCategory)
  ).slice(0, 4);

  const newGames = mockGames.filter((g) => 
    g.complexity > player.profile.complexity + 0.5 &&
    !g.owned &&
    (selectedCategory === 'all' || g.category === selectedCategory)
  ).slice(0, 4);

  const displayGames = activeRecoTab === 'similar' ? similarGames : activeRecoTab === 'stretch' ? stretchGames : newGames;

  return (
    <div className="min-h-screen bg-[#0D1B1E] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => onNavigate('search')}
            variant="ghost"
            className="text-[#F8F7ED] hover:bg-[#E09891]/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-32 h-10">
            <img src={logoReeple} alt="Reeple Logo" className="h-full object-contain" />
          </div>
          <div className="flex-1">
            <h1 className="text-[#F8F7ED] text-2xl">Recommandations pour {player.pseudo}</h1>
            <p className="text-[#F8F7ED]/60">Client N° {player.clientNumber}</p>
          </div>
        </div>

        {/* Player Profile Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="p-6 bg-[#E09891]/20 border-[#E09891]/30 backdrop-blur">
            <div className="flex flex-col items-center text-center mb-6">
              <img 
                src={player.avatar} 
                alt={player.pseudo}
                className="w-24 h-24 rounded-full border-4 border-[#FFDA6B] mb-4"
              />
              <h2 className="text-[#F8F7ED] text-xl mb-1">{player.pseudo}</h2>
              <p className="text-[#F8F7ED]/60 text-sm mb-4">{player.totalGames} jeux dans sa ludothèque</p>
              <div className="flex gap-2 justify-center">
                <Badge className="bg-[#FFDA6B]/20 text-[#FFDA6B] border-[#FFDA6B]/30">
                  ⭐ {player.avgRating}/10
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#F8F7ED]/60" />
                  <span className="text-[#F8F7ED]/60 text-sm">Durée moyenne</span>
                </div>
                <p className="text-[#F8F7ED] text-xl">{player.profile.avgDuration} min</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-[#F8F7ED]/60" />
                  <span className="text-[#F8F7ED]/60 text-sm">Mécaniques préférées</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {player.profile.topMechanics.slice(0, 3).map((mech) => (
                    <span key={mech} className="bg-[#E09891]/20 text-[#E09891] px-2 py-1 rounded text-xs">
                      {mech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Radar Chart */}
          <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20 lg:col-span-2">
            <h3 className="text-[#F8F7ED] text-lg mb-4">Profil ludique</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E09891" strokeOpacity={0.3} />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#F8F7ED', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 25]} tick={{ fill: '#F8F7ED', opacity: 0.6 }} />
                <Radar name="Jeux possédés" dataKey="value" stroke="#FFDA6B" fill="#FFDA6B" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-5 gap-2 mt-4">
              {player.profile.topCategories.map((cat) => (
                <div key={cat.category} className="bg-[#E09891]/10 rounded-lg p-2 text-center">
                  <p className="text-[#F8F7ED] text-sm">{cat.count}</p>
                  <p className="text-[#F8F7ED]/60 text-xs">{cat.category}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#F8F7ED] text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres de recommandation
            </h3>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              className="text-[#F8F7ED]"
            >
              {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[#F8F7ED]/60 text-sm mb-2 block">Catégorie</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#0D1B1E] border border-[#E09891]/20 rounded-lg px-3 py-2 text-[#F8F7ED]"
                >
                  <option value="all">Toutes</option>
                  <option value="Famille">Famille</option>
                  <option value="Expert">Expert</option>
                  <option value="Stratégie">Stratégie</option>
                  <option value="Ambiance">Ambiance</option>
                  <option value="Coopératif">Coopératif</option>
                  <option value="2 joueurs">2 joueurs</option>
                </select>
              </div>

              <div>
                <label className="text-[#F8F7ED]/60 text-sm mb-2 block">Nombre de joueurs max</label>
                <select 
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(e.target.value)}
                  className="w-full bg-[#0D1B1E] border border-[#E09891]/20 rounded-lg px-3 py-2 text-[#F8F7ED]"
                >
                  <option value="all">Tous</option>
                  <option value="2">2+</option>
                  <option value="4">4+</option>
                  <option value="6">6+</option>
                </select>
              </div>

              <div>
                <label className="text-[#F8F7ED]/60 text-sm mb-2 block">Durée max (min)</label>
                <select 
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  className="w-full bg-[#0D1B1E] border border-[#E09891]/20 rounded-lg px-3 py-2 text-[#F8F7ED]"
                >
                  <option value="all">Toutes</option>
                  <option value="30">30 min</option>
                  <option value="60">60 min</option>
                  <option value="120">120 min</option>
                </select>
              </div>
            </div>
          )}
        </Card>

        {/* Recommendations Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <Button
            onClick={() => setActiveRecoTab('similar')}
            className={`${
              activeRecoTab === 'similar'
                ? 'bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E]'
                : 'bg-[#E09891]/20 hover:bg-[#E09891]/30 text-[#F8F7ED]'
            }`}
          >
            <Target className="w-4 h-4 mr-2" />
            Dans ses préférences
          </Button>
          <Button
            onClick={() => setActiveRecoTab('stretch')}
            className={`${
              activeRecoTab === 'stretch'
                ? 'bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E]'
                : 'bg-[#E09891]/20 hover:bg-[#E09891]/30 text-[#F8F7ED]'
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Zone de confort élargie
          </Button>
          <Button
            onClick={() => setActiveRecoTab('new')}
            className={`${
              activeRecoTab === 'new'
                ? 'bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E]'
                : 'bg-[#E09891]/20 hover:bg-[#E09891]/30 text-[#F8F7ED]'
            }`}
          >
            <Compass className="w-4 h-4 mr-2" />
            Découverte élargie
          </Button>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayGames.map((game) => (
            <GameCard key={game.id} game={game} player={player} tab={activeRecoTab} />
          ))}
        </div>

        {displayGames.length === 0 && (
          <Card className="p-12 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20 text-center">
            <AlertCircle className="w-12 h-12 text-[#E09891] mx-auto mb-4" />
            <p className="text-[#F8F7ED] text-lg mb-2">Aucune recommandation trouvée</p>
            <p className="text-[#F8F7ED]/60">Essayez de modifier les filtres</p>
          </Card>
        )}
      </div>
    </div>
  );
}

interface GameCardProps {
  game: Game;
  player: Player;
  tab: 'similar' | 'stretch' | 'new';
}

function GameCard({ game, player, tab }: GameCardProps) {
  const getRecommendationReason = () => {
    if (tab === 'similar') {
      return `Correspond à son goût pour les jeux de ${game.category.toLowerCase()}`;
    } else if (tab === 'stretch') {
      return `Introduce une nouvelle catégorie (${game.category}) tout en restant accessible`;
    } else {
      return `Élargit ses horizons vers des jeux plus complexes`;
    }
  };

  const getBadgeColor = () => {
    if (tab === 'similar') return 'bg-[#FFDA6B]/20 text-[#FFDA6B] border-[#FFDA6B]/30';
    if (tab === 'stretch') return 'bg-[#E09891]/20 text-[#E09891] border-[#E09891]/30';
    return 'bg-[#FFDA6B]/20 text-[#FFDA6B] border-[#FFDA6B]/30';
  };

  const getBadgeText = () => {
    if (tab === 'similar') return 'Très similaire';
    if (tab === 'stretch') return 'Progression logique';
    return 'Nouvelle découverte';
  };

  return (
    <Card className="p-4 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20 hover:border-[#E09891]/40 transition-all group">
      <div className="relative mb-4">
        <img 
          src={game.image} 
          alt={game.title}
          className="w-full h-48 object-cover rounded-lg"
        />
        <Badge className={`absolute top-2 right-2 ${getBadgeColor()}`}>
          {getBadgeText()}
        </Badge>
        {!game.inStock && (
          <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
            <span className="text-[#E09891] bg-[#E09891]/20 px-3 py-1 rounded">Rupture</span>
          </div>
        )}
      </div>

      <h4 className="text-[#F8F7ED] mb-2">{game.title}</h4>
      <p className="text-[#F8F7ED]/60 text-sm mb-3">{game.category}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-[#E09891]" />
          <span className="text-[#F8F7ED]/80">{game.players} joueurs</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Timer className="w-4 h-4 text-[#E09891]" />
          <span className="text-[#F8F7ED]/80">{game.duration}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[#F8F7ED]/60 text-xs mb-2">Mécaniques :</p>
        <div className="flex flex-wrap gap-1">
          {game.mechanics.slice(0, 2).map((mech) => (
            <span key={mech} className="bg-[#E09891]/10 text-[#E09891] px-2 py-1 rounded text-xs">
              {mech}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-[#FFDA6B]/10 border border-[#FFDA6B]/20 rounded-lg p-3 mb-4">
        <p className="text-[#F8F7ED]/80 text-xs leading-relaxed">{getRecommendationReason()}</p>
      </div>

      <div className="flex gap-2">
        <Button 
          className="flex-1 bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E]"
          onClick={() => alert(`Vérification du stock pour ${game.title}...`)}
        >
          Voir en rayon
        </Button>
      </div>

      <p className="text-center text-[#FFDA6B] mt-2">{game.price.toFixed(2)} €</p>
    </Card>
  );
}