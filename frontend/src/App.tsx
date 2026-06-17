import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { SearchPage } from './components/SearchPage';
import { ResultsPage } from './components/ResultsPage';
import { ClientViewPage } from './components/ClientViewPage';
import { LandingPage } from './components/LandingPage';

type Page = 'landing' | 'home' | 'search' | 'results' | 'client-view';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('1');

  const handleNavigate = (page: string, playerId?: string) => {
    setCurrentPage(page as Page);
    if (playerId) {
      setSelectedPlayerId(playerId);
    }
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'search' && <SearchPage onNavigate={handleNavigate} />}
      {currentPage === 'results' && <ResultsPage onNavigate={handleNavigate} playerId={selectedPlayerId} />}
      {currentPage === 'client-view' && <ClientViewPage onNavigate={handleNavigate} />}
    </div>
  );
}