import { Button } from "./ui/button";
import { Card } from "./ui/card";
import logoReeple from "figma:asset/c71e2c6b7b9368dfe5d8a1f334d3ba6e7407f51f.png";
import {
  Sparkles,
  Users,
  TrendingUp,
  Heart,
  Search,
  Tablet,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  Shield,
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0D1B1E] overflow-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #FFDA6B 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <div className="w-64 h-20">
              <img
                src={logoReeple}
                alt="Reeple Logo"
                className="h-full object-contain"
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center mb-16">
            <h1 className="text-[#F8F7ED] text-5xl md:text-6xl mb-6">
              L'assistant intelligent pour <br />
              <span className="text-[#FFDA6B]">
                boutiques de jeux de société
              </span>
            </h1>
            <p className="text-[#F8F7ED]/70 text-xl md:text-2xl max-w-3xl mx-auto mb-10">
              Analysez les profils MyLudo de vos clients et
              recommandez les jeux parfaits en quelques
              secondes.
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => onNavigate("home")}
                className="bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E] px-8 py-6 text-lg h-auto"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Adopter Reeple pour votre boutique !
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-[#A50104]/10 backdrop-blur border-[#A50104]/30 text-center">
              <div className="w-14 h-14 bg-[#FFDA6B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-[#FFDA6B]" />
              </div>
              <p className="text-[#F8F7ED] text-3xl mb-2">
                3 sec
              </p>
              <p className="text-[#F8F7ED]/60">
                Temps d'analyse moyen
              </p>
            </Card>

            <Card className="p-6 bg-[#A50104]/10 backdrop-blur border-[#A50104]/30 text-center">
              <div className="w-14 h-14 bg-[#FFDA6B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-[#FFDA6B]" />
              </div>
              <p className="text-[#F8F7ED] text-3xl mb-2">
                95%
              </p>
              <p className="text-[#F8F7ED]/60">
                Satisfaction client
              </p>
            </Card>

            <Card className="p-6 bg-[#A50104]/10 backdrop-blur border-[#A50104]/30 text-center">
              <div className="w-14 h-14 bg-[#FFDA6B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-[#FFDA6B]" />
              </div>
              <p className="text-[#F8F7ED] text-3xl mb-2">
                +40%
              </p>
              <p className="text-[#F8F7ED]/60">
                Ventes additionnelles
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-[#F8F7ED] text-4xl mb-4">
            Deux interfaces, un seul objectif
          </h2>
          <p className="text-[#F8F7ED]/60 text-xl">
            Optimiser l'expérience client et booster vos ventes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Vue Vendeur */}
          <Card className="p-8 bg-gradient-to-br from-[#FFDA6B]/20 to-[#A50104]/10 border-[#FFDA6B]/40 backdrop-blur">
            <div className="w-16 h-16 bg-[#FFDA6B] rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-[#0D1B1E]" />
            </div>

            <h3 className="text-[#F8F7ED] text-2xl mb-4">
              Vue Vendeur
            </h3>
            <p className="text-[#F8F7ED]/70 mb-6">
              Un tableau de bord complet pour analyser les
              profils MyLudo et générer des recommandations
              personnalisées instantanément.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FFDA6B] shrink-0 mt-0.5" />
                <p className="text-[#F8F7ED]/80">
                  <strong className="text-[#F8F7ED]">
                    Recherche rapide
                  </strong>{" "}
                  par pseudo ou numéro client MyLudo
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FFDA6B] shrink-0 mt-0.5" />
                <p className="text-[#F8F7ED]/80">
                  <strong className="text-[#F8F7ED]">
                    Analyse intelligente
                  </strong>{" "}
                  du profil et des préférences ludiques
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FFDA6B] shrink-0 mt-0.5" />
                <p className="text-[#F8F7ED]/80">
                  <strong className="text-[#F8F7ED]">
                    Recommandations triées
                  </strong>{" "}
                  par catégories (préférences, zone de confort,
                  découverte)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FFDA6B] shrink-0 mt-0.5" />
                <p className="text-[#F8F7ED]/80">
                  <strong className="text-[#F8F7ED]">
                    Scanner QR Code
                  </strong>{" "}
                  pour accès instantané à la wishlist créée en
                  amont
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FFDA6B] shrink-0 mt-0.5" />
                <p className="text-[#F8F7ED]/80">
                  <strong className="text-[#F8F7ED]">
                    Statistiques en temps réel
                  </strong>{" "}
                  sur vos ventes et recommandations
                </p>
              </div>
            </div>
          </Card>

          {/* Vue Client */}
          <Card className="p-8 bg-gradient-to-br from-[#A50104]/20 to-[#FFDA6B]/10 border-[#A50104]/40 backdrop-blur">
            <div className="w-16 h-16 bg-[#A50104] rounded-2xl flex items-center justify-center mb-6">
              <Tablet className="w-8 h-8 text-[#F8F7ED]" />
            </div>

            <h3 className="text-[#F8F7ED] text-2xl mb-4">
              Vue Client
            </h3>
            <p className="text-[#F8F7ED]/70 mb-6">
              Une interface tablette intuitive pour que vos
              clients découvrent leurs recommandations en toute
              autonomie.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#A50104] shrink-0 mt-0.5" />
                <p className="text-[#F8F7ED]/80">
                  <strong className="text-[#F8F7ED]">
                    Connexion MyLudo
                  </strong>{" "}
                  pour recommandations personnalisées
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#A50104] shrink-0 mt-0.5" />
                <p className="text-[#F8F7ED]/80">
                  <strong className="text-[#F8F7ED]">
                    Filtres avancés
                  </strong>{" "}
                  (joueurs, âge, durée, type, concentration)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#A50104] shrink-0 mt-0.5" />
                <p className="text-[#F8F7ED]/80">
                  <strong className="text-[#F8F7ED]">
                    Coups de cœur vendeurs
                  </strong>{" "}
                  mis en avant
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#A50104] shrink-0 mt-0.5" />
                <p className="text-[#F8F7ED]/80">
                  <strong className="text-[#F8F7ED]">
                    Wishlist interactive
                  </strong>{" "}
                  avec système de favoris
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#A50104] shrink-0 mt-0.5" />
                <p className="text-[#F8F7ED]/80">
                  <strong className="text-[#F8F7ED]">
                    QR Code générée
                  </strong>{" "}
                  pour partager la sélection avec un vendeur
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gradient-to-b from-[#A50104]/10 to-transparent py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[#F8F7ED] text-4xl mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-[#F8F7ED]/60 text-xl">
              Simple, rapide et efficace
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="p-8 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 text-center relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FFDA6B] rounded-full flex items-center justify-center">
                <span className="text-[#0D1B1E] text-xl">
                  1
                </span>
              </div>
              <div className="w-16 h-16 bg-[#FFDA6B]/20 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <Search className="w-8 h-8 text-[#FFDA6B]" />
              </div>
              <h3 className="text-[#F8F7ED] text-xl mb-3">
                Recherchez le client ou proposez vos favoris
              </h3>
              <p className="text-[#F8F7ED]/60">
                Saisissez le pseudo MyLudo ou proposez les coups
                de cœur de la boutique
              </p>
            </Card>

            {/* Step 2 */}
            <Card className="p-8 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 text-center relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FFDA6B] rounded-full flex items-center justify-center">
                <span className="text-[#0D1B1E] text-xl">
                  2
                </span>
              </div>
              <div className="w-16 h-16 bg-[#FFDA6B]/20 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <Sparkles className="w-8 h-8 text-[#FFDA6B]" />
              </div>
              <h3 className="text-[#F8F7ED] text-xl mb-3">
                Analyse automatique
              </h3>
              <p className="text-[#F8F7ED]/60">
                L'IA analyse la ludothèque et génère des
                recommandations personnalisées
              </p>
            </Card>

            {/* Step 3 */}
            <Card className="p-8 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 text-center relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FFDA6B] rounded-full flex items-center justify-center">
                <span className="text-[#0D1B1E] text-xl">
                  3
                </span>
              </div>
              <div className="w-16 h-16 bg-[#FFDA6B]/20 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                <Tablet className="w-8 h-8 text-[#FFDA6B]" />
              </div>
              <h3 className="text-[#F8F7ED] text-xl mb-3">
                Autonomie sur tablette
              </h3>
              <p className="text-[#F8F7ED]/60">
                Le client consulte en autonomie, qu'il soit
                réservé ou que vous soyez occupé
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-[#F8F7ED] text-4xl mb-4">
            Pourquoi choisir Reeple ?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 text-center">
            <div className="w-12 h-12 bg-[#FFDA6B]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-[#FFDA6B]" />
            </div>
            <h3 className="text-[#F8F7ED] mb-2">
              Gain de temps
            </h3>
            <p className="text-[#F8F7ED]/60 text-sm">
              Le client peut être conseillé même si vous êtes
              occupé ou qu'il n'ose pas, fini les descriptions
              douteuses de jeu
            </p>
          </Card>

          <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 text-center">
            <div className="w-12 h-12 bg-[#FFDA6B]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-[#FFDA6B]" />
            </div>
            <h3 className="text-[#F8F7ED] mb-2">
              Précision maximale
            </h3>
            <p className="text-[#F8F7ED]/60 text-sm">
              Recommandations basées sur des données réelles
            </p>
          </Card>

          <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 text-center">
            <div className="w-12 h-12 bg-[#FFDA6B]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-[#FFDA6B]" />
            </div>
            <h3 className="text-[#F8F7ED] mb-2">
              Autonomie client
            </h3>
            <p className="text-[#F8F7ED]/60 text-sm">
              Interface tablette pour les périodes d'affluence
            </p>
          </Card>

          <Card className="p-6 bg-[#0D1B1E]/80 backdrop-blur border-[#A50104]/20 text-center">
            <div className="w-12 h-12 bg-[#FFDA6B]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-[#FFDA6B]" />
            </div>
            <h3 className="text-[#F8F7ED] mb-2">
              Interface sobre
            </h3>
            <p className="text-[#F8F7ED]/60 text-sm">
              Design optimisé pour usage en boutique
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#A50104]/20 via-[#FFDA6B]/10 to-[#A50104]/20 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[#F8F7ED] text-4xl mb-6">
            Prêt à transformer votre boutique ?
          </h2>
          <p className="text-[#F8F7ED]/70 text-xl mb-10">
            Rejoignez les boutiques qui utilisent Reeple pour
            offrir une expérience client exceptionnelle.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => onNavigate("home")}
              className="bg-[#FFDA6B] hover:bg-[#FFDA6B]/90 text-[#0D1B1E] px-10 py-6 text-lg h-auto"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Démarrer maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#A50104]/20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-32 h-10 mx-auto mb-4">
            <img
              src={logoReeple}
              alt="Reeple Logo"
              className="h-full object-contain opacity-60"
            />
          </div>
          <p className="text-[#F8F7ED]/40 text-sm">
            © 2025 Reeple - L'assistant intelligent pour vos
            boutiques
          </p>
        </div>
      </div>
    </div>
  );
}