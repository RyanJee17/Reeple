import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState } from "react";
import logoReeple from 'figma:asset/c71e2c6b7b9368dfe5d8a1f334d3ba6e7407f51f.png';
import { Search, QrCode, Users, TrendingUp, AlertTriangle, ChevronUp, ChevronDown, Globe, Tablet } from "lucide-react";

const sellerProfile = {
  name: "Sophie Martin",
  role: "Conseillère jeux",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
  stats: {
    todayClients: 12,
    topRecommendations: [
      "7 Wonders",
      "Wingspan",
      "Azul",
      "Ticket to Ride",
      "Splendor"
    ]
  }
};

interface HomePageProps {
  onNavigate: (page: string, playerId?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [showStockAlerts, setShowStockAlerts] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D1B1E] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header - Seller Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-36 h-12">
              <img src={logoReeple} alt="Reeple Logo" className="h-full object-contain" />
            </div>
            <div className="h-12 w-px bg-[#E09891]/20"></div>
            <img
              src={sellerProfile.avatar}
              alt={sellerProfile.name}
              className="w-12 h-12 rounded-full border-2 border-[#FFDA6B]"
            />
            <div>
              <h1 className="text-[#F8F7ED]">
                {sellerProfile.name}
              </h1>
              <p className="text-[#F8F7ED]/60 text-sm">
                {sellerProfile.role}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onNavigate("landing")}
              className="bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E]"
            >
              <Globe className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="p-6 bg-[#FFDA6B] border-0 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onNavigate("search")}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#0D1B1E] rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-[#FFDA6B]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#0D1B1E] text-xl mb-1">
                  Rechercher un jeu ou un client
                </h3>
                <p className="text-[#0D1B1E]/70">
                  BoardGameGeek ou profil client
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 bg-[#E09891] border-0 cursor-pointer hover:scale-105 transition-transform"
            onClick={() =>
              alert("Scanner QR Code - Fonctionnalité simulée")
            }
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#0D1B1E] rounded-2xl flex items-center justify-center">
                <QrCode className="w-8 h-8 text-[#E09891]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#0D1B1E] text-xl mb-1">
                  Scanner QR Code
                </h3>
                <p className="text-[#0D1B1E]/70">
                  Accès rapide au profil
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Client View Card */}
        <Card
          className="p-6 bg-gradient-to-r from-[#E09891]/30 to-[#FFDA6B]/30 border-[#FFDA6B]/40 cursor-pointer hover:scale-105 transition-transform backdrop-blur"
          onClick={() => onNavigate("client-view")}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FFDA6B] rounded-2xl flex items-center justify-center">
              <Tablet className="w-8 h-8 text-[#0D1B1E]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#F8F7ED] text-xl mb-1">
                Vue Client
              </h3>
              <p className="text-[#F8F7ED]/70">
                Interface tablette pour les clients en boutique
              </p>
            </div>
            <div className="bg-[#FFDA6B]/20 text-[#FFDA6B] px-4 py-2 rounded-lg text-sm">
              Nouveau
            </div>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FFDA6B]/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#FFDA6B]" />
              </div>
              <h3 className="text-[#F8F7ED]/60">
                Clients conseillés aujourd'hui
              </h3>
            </div>
            <p className="text-[#F8F7ED] text-3xl">
              {sellerProfile.stats.todayClients}
            </p>
          </Card>

          <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#E09891]/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#E09891]" />
              </div>
              <h3 className="text-[#F8F7ED]/60">
                Top recommandation
              </h3>
            </div>
            <p className="text-[#F8F7ED] text-xl">
              {sellerProfile.stats.topRecommendations[0]}
            </p>
          </Card>
        </div>

        {/* Jeux les plus recommandés */}
        <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#E09891]/20">
          <h2 className="text-[#F8F7ED] text-xl mb-4">
            Jeux les plus recommandés récemment
          </h2>
          <div className="space-y-2">
            {sellerProfile.stats.topRecommendations.map(
              (game, index) => (
                <div
                  key={game}
                  className="flex items-center gap-3 bg-[#E09891]/10 p-3 rounded-lg"
                >
                  <span className="text-[#FFDA6B] text-xl w-6">
                    #{index + 1}
                  </span>
                  <span className="text-[#F8F7ED] flex-1">
                    {game}
                  </span>
                  <span className="text-[#F8F7ED]/60 text-sm">
                    {15 - index * 3} fois
                  </span>
                </div>
              ),
            )}
          </div>
        </Card>

        {/* Alerts */}
        <div>
          <Button
            onClick={() => setShowStockAlerts(!showStockAlerts)}
            className="w-full bg-[#E09891]/20 hover:bg-[#E09891]/30 text-[#F8F7ED] border border-[#E09891]/30 mb-4"
          >
            <AlertTriangle className="w-5 h-5 mr-2 text-[#E09891]" />
            Voir les ruptures de stock
            {showStockAlerts ? (
              <ChevronUp className="w-5 h-5 ml-auto" />
            ) : (
              <ChevronDown className="w-5 h-5 ml-auto" />
            )}
          </Button>

          {showStockAlerts && (
            <Card className="p-6 bg-[#E09891]/10 backdrop-blur border-[#E09891]/30">
              <h2 className="text-[#F8F7ED] text-xl mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#E09891]" />
                Ruptures de stock
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-[#E09891]/20 p-3 rounded-lg">
                  <span className="text-[#F8F7ED]">Splendor</span>
                  <span className="text-[#E09891] text-sm">
                    Rupture
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#FFDA6B]/20 p-3 rounded-lg">
                  <span className="text-[#F8F7ED]">Root</span>
                  <span className="text-[#FFDA6B] text-sm">
                    Stock faible (2)
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
