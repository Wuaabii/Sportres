/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { SportProvider } from './context/SportContext';
import { PhoneShell } from './components/PhoneShell';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { StaffAuthScreen } from './components/StaffAuthScreen';
import { HomeTab } from './components/HomeTab';
import { BookingTab } from './components/BookingTab';
import { MatchmakingTab } from './components/MatchmakingTab';
import { MessagesTab } from './components/MessagesTab';
import { EventsTab } from './components/EventsTab';
import { ProfileTab } from './components/ProfileTab';
import { ManagementTab } from './components/ManagementTab';
import { AdminTab } from './components/AdminTab';
import { AiAssistant } from './components/AiAssistant';
import { LandingPage } from './pages/LandingPage';
import { SportType } from './types';

const AUTH_FORM_PATHS = ['/login', '/register', '/staff-login'];

function SportResApp() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [sportFilter, setSportFilter] = useState<SportType>('soccer');
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !AUTH_FORM_PATHS.includes(window.location.pathname));
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'staff'>(() => {
    if (window.location.pathname === '/register') return 'register';
    if (window.location.pathname === '/staff-login') return 'staff';
    return 'login';
  });

  const syncAuthRouteState = (path: string) => {
    if (path === '/login') {
      setShowWelcome(false);
      setAuthMode('login');
    } else if (path === '/register') {
      setShowWelcome(false);
      setAuthMode('register');
    } else if (path === '/staff-login') {
      setShowWelcome(false);
      setAuthMode('staff');
    } else {
      setShowWelcome(true);
      setAuthMode('login');
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      syncAuthRouteState(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.title = 'SportRes';
  }, [currentPath]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowAiAssistant(false);
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    syncAuthRouteState(path);
  };

  if (!isAuthenticated) {
     if (currentPath === '/') {
       return <LandingPage onNavigate={navigateTo} />;
     }

     return (
       <div className="flex items-center justify-center min-h-screen bg-[#36393f] p-4">
         <div className="w-full max-w-[900px] min-h-[650px] bg-[#2f3136] rounded-2xl shadow-2xl overflow-hidden flex">
            <div className="flex-1 flex flex-col justify-center p-2 sm:p-8">
                {showWelcome ? (
                    <WelcomeScreen 
                      onNext={() => navigateTo('/register')} 
                      onLogin={() => navigateTo('/login')} 
                      onStaffLogin={() => navigateTo('/staff-login')}
                    />
                ) : authMode === 'staff' ? (
                    <StaffAuthScreen onLogin={(role) => { setIsAuthenticated(true); setActiveTab('home'); }} onBack={() => navigateTo('/auth')} />
                ) : (
                    <AuthScreen initialMode={authMode} onLogin={() => { setIsAuthenticated(true); setActiveTab('home'); }} onBack={() => navigateTo('/auth')} />
                )}
            </div>
         </div>
       </div>
     );
  }

  return (
    <PhoneShell
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      onOpenAi={() => setShowAiAssistant(true)}
    >
      {/* Conditionally show AI assistant drawer as an overlay within app viewport */}
      {showAiAssistant && (
        <AiAssistant onClose={() => setShowAiAssistant(false)} />
      )}

      {/* Primary Nav tab bodies */}
      {!showAiAssistant && (() => {
        switch (activeTab) {
          case 'home':
            return (
              <HomeTab
                setActiveTab={handleTabChange}
                setSportFilter={setSportFilter}
                onOpenAi={() => setShowAiAssistant(true)}
              />
            );
          case 'booking':
            return (
              <BookingTab
                sportFilter={sportFilter}
                setSportFilter={setSportFilter}
              />
            );
          case 'matchmaking':
            return <MatchmakingTab />;
          case 'messages':
            return <MessagesTab />;
          case 'events':
            return <EventsTab />;
          case 'profile':
            return <ProfileTab onLogout={() => { setIsAuthenticated(false); setShowWelcome(true); }} />;
          case 'management':
            return <ManagementTab />;
          case 'admin':
            return <AdminTab />;
          default:
            return <HomeTab setActiveTab={setActiveTab} setSportFilter={setSportFilter} onOpenAi={() => setShowAiAssistant(true)} />;
        }
      })()}
    </PhoneShell>
  );
}

export default function App() {
  return (
    <SportProvider>
      <SportResApp />
    </SportProvider>
  );
}
