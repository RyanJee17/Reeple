import { useEffect, useRef, useState, type ComponentType } from 'react';
import { ArrowLeft, ArrowRight, Check, Users, UserRound, Sprout, Dices, Trophy, Zap, Timer, Hourglass, Moon, Laugh, Brain, BookOpen, VenetianMask, Map, Repeat2, Handshake, Coins, Banknote, Sparkle, RotateCcw } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { useWorkspace, entry } from './store';
import { money, type Game } from './model';
import { BggCredit } from './BggImport';

type Icon = ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
type Choice = { value: string; title: string; subtitle: string; icon: Icon; numeral?: string };
const questions: { label: string; title: string; choices: Choice[] }[] = [
  { label: 'Pour qui ?', title: 'Combien de joueurs\nautour de la table ?', choices: [
    { value: '1', title: '1 joueur', subtitle: 'Un moment pour soi', icon: UserRound },
    { value: '2', title: '2 joueurs', subtitle: 'Pour les équipes en duo', icon: Users },
    { value: '3-4', title: '3 - 4 joueurs', subtitle: 'Famille et petits groupes', icon: Users },
    { value: '5-6', title: '5 - 6 joueurs', subtitle: 'Une grande tablée', icon: Users },
    { value: '7', title: '7 ou plus', subtitle: 'Pour les grandes tablées', icon: Users },
  ] },
  { label: 'Le plus jeune ?', title: 'L’âge du plus jeune joueur ?', choices: [
    { value: '5', title: '5 - 7 ans', subtitle: 'Adapté au plus jeune', icon: UserRound, numeral: '5' },
    { value: '8', title: '8 - 10 ans', subtitle: 'Âmes en formation', icon: UserRound, numeral: '8' },
    { value: '11', title: '11 - 13 ans', subtitle: 'Pour les plus grands', icon: UserRound, numeral: '11' },
    { value: '14', title: '14 et +', subtitle: 'Ados et adultes', icon: UserRound, numeral: '14' },
  ] },
  { label: 'Format de partie', title: 'Ont-ils l’habitude\ndes jeux de société ?', choices: [
    { value: 'novice', title: 'Plutôt novices', subtitle: 'Habitués du Monopoly et du Uno', icon: Sprout },
    { value: 'regular', title: 'Amateurs réguliers', subtitle: 'Une dizaine de jeux à la maison', icon: Dices },
    { value: 'expert', title: 'Joueurs avertis', subtitle: 'À l’aise avec les jeux exigeants', icon: Trophy },
  ] },
  { label: 'Format de partie', title: 'On vise une partie de quelle durée ?', choices: [
    { value: 'short', title: 'Moins de 20 min', subtitle: 'Court et dynamique', icon: Zap },
    { value: 'medium', title: '30 - 45 min', subtitle: 'La valeur sûre', icon: Timer },
    { value: 'hour', title: '1 heure', subtitle: 'Une vraie session de jeu', icon: Hourglass },
    { value: 'long', title: '2 h et plus', subtitle: 'Une soirée dédiée', icon: Moon },
  ] },
  { label: 'L’envie du moment', title: 'On cherche quelle ambiance ?', choices: [
    { value: 'party', title: 'Rire sans faille', subtitle: 'Party game et ambiance', icon: Laugh },
    { value: 'strategy', title: 'Faire chauffer la tête', subtitle: 'Stratégie et gestion', icon: Brain },
    { value: 'story', title: 'Raconter une histoire', subtitle: 'Narratif et immersif', icon: BookOpen },
    { value: 'bluff', title: 'Se piéger', subtitle: 'Bluff et déduction', icon: VenetianMask },
    { value: 'explore', title: 'Découvrir', subtitle: 'Exploration', icon: Map },
    { value: 'replay', title: 'Rejouer souvent', subtitle: 'Le goût du reviens-y', icon: Repeat2 },
    { value: 'coop', title: 'Coopérer', subtitle: 'Coopération et entraide', icon: Handshake },
  ] },
  { label: 'Et côté budget ?', title: 'Une fourchette à respecter ?', choices: [
    { value: 'small', title: 'Moins de 25 €', subtitle: 'Les petits budgets', icon: Coins },
    { value: 'medium', title: '25 € - 45 €', subtitle: 'La tranche moyenne', icon: Coins },
    { value: 'large', title: '45 € - 70 €', subtitle: 'Les grands jeux', icon: Banknote },
    { value: 'any', title: 'Le bon jeu', subtitle: 'Peu importe le prix', icon: Sparkle },
  ] },
];
type Answers = (string | null)[];
function matches(game: Game, a: Answers, onlyInStock: boolean) {
  if (onlyInStock && game.stock === 0) return false;
  if (a[0]) {
    const [low, high = low] = a[0].split('-').map(Number);
    if (a[0] === '7' ? game.maxPlayers < 7 : game.minPlayers > high || game.maxPlayers < low) return false;
  }
  if (a[1] && game.minAge > Number(a[1])) return false;
  if ((a[2] === 'novice' && game.complexity > 2) || (a[2] === 'regular' && game.complexity > 3.2)) return false;
  if (a[3] === 'short' && game.minutes >= 20) return false;
  if (a[3] === 'medium' && (game.minutes < 30 || game.minutes > 45)) return false;
  if (a[3] === 'hour' && (game.minutes < 46 || game.minutes > 90)) return false;
  if (a[3] === 'long' && game.minutes < 120) return false;
  if (a[4] && !game.moods.includes(a[4])) return false;
  if (a[5] === 'small' && game.price >= 25) return false;
  if (a[5] === 'medium' && (game.price < 25 || game.price > 45)) return false;
  if (a[5] === 'large' && (game.price <= 45 || game.price > 70)) return false;
  return true;
}
export function GameVisual({ game, className = '' }: { game: Game; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [game.image]);
  return <div className={`reeple-game-visual ${className}`}>
    {game.image && !failed ? <img src={game.image} alt={`Jeu ${game.title}`} onError={() => setFailed(true)} referrerPolicy="no-referrer" /> : <div className="reeple-cover-placeholder"><Dices size={52} aria-hidden="true" /><span>{game.title}</span></div>}
    <h3>{game.title}</h3>
  </div>;
}
function GameCard({ game, onAdvise }: { game: Game; onAdvise: (game: Game) => void }) {
  return <Card className="reeple-game-card">
    <GameVisual game={game} />
    <div className="reeple-game-meta"><span>{game.minPlayers}-{game.maxPlayers} joueurs · {game.minAge}+ · {game.demoReference && !game.bgg ? game.demoReference.durationLabel : `${game.minutes} min`}</span><strong>{money(game.price)}</strong></div>
    <div className="reeple-game-reason"><h4>Pourquoi ce jeu ?</h4><p>{game.note || `Un jeu de votre catalogue compatible avec les critères renseignés. Vérifiez les règles et les préférences du client avant de le proposer.`}</p></div>
    <div className="reeple-card-actions"><span className="reeple-stock">En stock <strong>{game.stock}</strong></span><button className="reeple-button coral" onClick={() => onAdvise(game)}>Conseiller</button></div><BggCredit game={game} />
  </Card>;
}
export function Advice() {
  const { data, update } = useWorkspace();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(Array(6).fill(null));
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showAll, setShowAll] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  useEffect(() => { if (previousStep.current !== step) { heading.current?.focus(); previousStep.current = step; } }, [step]);
  const question = questions[step];
  const choose = (value: string | null) => { setAnswers(old => old.map((a, i) => i === step ? value : a)); setStep(step + 1); setShowAll(false); };
  const restart = () => { setAnswers(Array(6).fill(null)); setStep(0); setShowAll(false); };
  const results = data.games.filter(g => matches(g, answers, data.preferences.onlyInStock));
  const activeCriteria = answers.flatMap((a, i) => { const c = questions[i].choices.find(c => c.value === a); return c ? [{ text: c.title, index: i }] : []; });
  return <>
    {step < 6 ? <section className={`reeple-quiz ${step === 4 ? 'mood-step' : ''}`} aria-labelledby="question-title" key={step}>
      <div className="reeple-progress" aria-label={`Question ${step + 1} sur 6`}><span>Question {step + 1} / 6</span><div>{questions.map((_, i) => <span key={i} className={i === step ? 'current' : i < step ? 'complete' : ''} />)}</div></div>
      <div className="reeple-question-heading"><p className="reeple-eyebrow"><Sparkle size={18} aria-hidden="true" />{question.label}</p><h1 ref={heading} id="question-title" tabIndex={-1}>{question.title}</h1></div>
      <div className={`reeple-choices count-${question.choices.length}`}>
        {question.choices.map(choice => <button key={choice.value} className={`reeple-choice ${answers[step] === choice.value ? 'selected' : ''}`} onClick={() => choose(choice.value)} aria-label={`${choice.title}. ${choice.subtitle}`}>
          <span className="reeple-choice-check" aria-hidden="true">{answers[step] === choice.value && <Check size={13} />}</span>
          {choice.numeral ? <span className="reeple-numeral">{choice.numeral}</span> : <choice.icon className="reeple-choice-icon" size={36} aria-hidden={true} />}
          <strong>{choice.title}</strong><span>{choice.subtitle}</span>
        </button>)}
      </div>
      <div className="reeple-quiz-footer">{step > 0 ? <button className="reeple-button" onClick={() => setStep(step - 1)}><ArrowLeft size={16} />Précédent</button> : <span />}<button className="reeple-button" onClick={() => choose(null)}>Passer cette question<ArrowRight size={16} /></button></div>
      <p className="reeple-choice-hint">Choisissez une réponse pour continuer. Chaque question peut être passée.</p>
    </section> : <section className="reeple-results" aria-labelledby="results-title">
      <p className="reeple-eyebrow"><Sparkle size={18} />Recommandations Reeple</p>
      <h1 ref={heading} tabIndex={-1} id="results-title">Ceux qui matchent bien</h1>
      <div className="reeple-criteria">{activeCriteria.map(c => <button key={c.index} onClick={() => setStep(c.index)} title="Modifier ce critère">{c.text}<ArrowLeft size={12} /></button>)}</div>
      {results.length > 0 ? <><div className="reeple-results-grid">{(showAll ? results : results.slice(0, 3)).map(game => <GameCard key={game.id} game={game} onAdvise={setSelectedGame} />)}</div>{results.length > 3 && !showAll && <button className="reeple-button reeple-more" onClick={() => setShowAll(true)}>Voir les {results.length} jeux compatibles</button>}</> : <Card className="reeple-empty"><Dices size={42} /><h2>Aucun jeu ne réunit tous ces critères.</h2><p>Changez un critère ci-dessus ou reprenez les questions. Aucun jeu incompatible n’est proposé comme une correspondance.</p><button className="reeple-button navy" onClick={() => setStep(0)}>Revoir les réponses</button></Card>}
      <div className="reeple-quiz-footer"><button className="reeple-button" onClick={() => setStep(5)}><ArrowLeft size={16} />Précédent</button><button className="reeple-button navy" onClick={restart}>Recommencer<RotateCcw size={16} /></button></div>
      <p className="reeple-method-note">Correspondances calculées à partir des critères du catalogue. Reeple propose, le vendeur décide. Les tranches de joueurs correspondent à une intersection : confirmez le nombre exact avec le client.</p>
    </section>}
    <Dialog open={!!selectedGame} onOpenChange={open => { if (!open) setSelectedGame(null); }}>
      <DialogContent className="reeple-modal"><DialogTitle>Conseiller {selectedGame?.title}</DialogTitle><DialogDescription>Enregistrer ce conseil dans votre journal ? Cela ne crée aucune vente et ne modifie pas le stock.</DialogDescription>{selectedGame && <><p>{selectedGame.note || 'Vérifiez les règles et les préférences du client avant de proposer ce jeu.'}</p><button className="reeple-button coral" onClick={() => { const g = selectedGame; update(d => ({ ...d, games: d.games.map(item => item.id === g.id ? { ...item, recommended: item.recommended + 1 } : item), logs: [entry(`Conseil enregistré : ${g.title}`), ...d.logs].slice(0, 500) }), 'Conseil enregistré'); setSelectedGame(null); }}><Check size={17} />Enregistrer le conseil</button></>}</DialogContent>
    </Dialog>
  </>;
}
