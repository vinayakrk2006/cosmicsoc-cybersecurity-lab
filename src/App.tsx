import React, { useState, useEffect } from 'react';
import { NavSection, UserProgress } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AttackSimulator } from './components/AttackSimulator';
import { PasswordLab } from './components/PasswordLab';
import { PhishingLab } from './components/PhishingLab';
import { SqlInjectionLab } from './components/SqlInjectionLab';
import { XssLab } from './components/XssLab';
import { PortScannerLab } from './components/PortScannerLab';
import { CryptoLab } from './components/CryptoLab';
import { LearningPaths } from './components/LearningPaths';
import { AiMentor } from './components/AiMentor';
import { BadgesAndCert } from './components/BadgesAndCert';
import { sound } from './utils/audio';

const STORAGE_KEY = 'cosmicsoc_progress_v1';

const INITIAL_PROGRESS: UserProgress = {
  xp: 820,
  level: 5,
  lessonsMastered: 3,
  exercisesPassed: 17,
  badges: ['badge-initiate', 'badge-entropy', 'badge-phish-hunter', 'badge-sqli-buster'],
  completedLabs: {
    'password-lab': true,
    'phishing-lab': true,
    'sqli-lab': true,
  },
  solvedQuizzes: {
    'q-sql-1': true,
    'q-sql-2': true,
  },
  incidentsResolved: 2,
  userName: 'Vinayak K Putti',
};

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load progress from localStorage or use initial baseline
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROGRESS;
  });

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Fallback
    }
  }, [progress]);

  // Earn XP handler
  const handleEarnXp = (amount: number) => {
    setProgress((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.max(1, Math.floor(newXp / 200) + 1);
      const newPassed = prev.exercisesPassed + 1;
      const newBadges = [...prev.badges];

      if (newXp >= 800 && !newBadges.includes('badge-certified-analyst')) {
        newBadges.push('badge-certified-analyst');
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        exercisesPassed: newPassed,
        badges: newBadges,
      };
    });
  };

  const handleIncidentResolved = (xp: number) => {
    setProgress((prev) => {
      const newXp = prev.xp + xp;
      const newLevel = Math.max(1, Math.floor(newXp / 200) + 1);
      const newBadges = [...prev.badges];
      if (!newBadges.includes('badge-war-hero')) {
        newBadges.push('badge-war-hero');
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        incidentsResolved: prev.incidentsResolved + 1,
        badges: newBadges,
      };
    });
  };

  const handleSolveQuiz = (quizId: string) => {
    setProgress((prev) => ({
      ...prev,
      lessonsMastered: prev.lessonsMastered + 1,
      solvedQuizzes: {
        ...prev.solvedQuizzes,
        [quizId]: true,
      },
    }));
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all training progress to baseline?')) {
      setProgress(INITIAL_PROGRESS);
      localStorage.removeItem(STORAGE_KEY);
      sound.playAlert();
    }
  };

  const handleExportProgress = () => {
    const jsonStr = JSON.stringify(progress, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmicsoc-analyst-progress-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playSuccess();
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  const handleUpdateUserName = (name: string) => {
    setProgress((prev) => ({ ...prev, userName: name }));
  };

  return (
    <div className="min-h-screen bg-[#080d14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Bar Contract Header */}
      <Header
        progress={progress}
        onReset={handleResetProgress}
        onExport={handleExportProgress}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onNavigateToCert={() => setCurrentSection('certificates')}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          activeAttackCount={2}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090f18]/50">
          {currentSection === 'dashboard' && (
            <Dashboard
              progress={progress}
              onNavigate={setCurrentSection}
              activeAttackCount={2}
            />
          )}

          {currentSection === 'war-room' && (
            <AttackSimulator onIncidentResolved={handleIncidentResolved} />
          )}

          {currentSection === 'password-lab' && (
            <PasswordLab onEarnXp={handleEarnXp} />
          )}

          {currentSection === 'phishing-lab' && (
            <PhishingLab onEarnXp={handleEarnXp} />
          )}

          {currentSection === 'sqli-lab' && (
            <SqlInjectionLab onEarnXp={handleEarnXp} />
          )}

          {currentSection === 'xss-lab' && (
            <XssLab onEarnXp={handleEarnXp} />
          )}

          {currentSection === 'recon-lab' && (
            <PortScannerLab onEarnXp={handleEarnXp} />
          )}

          {currentSection === 'crypto-lab' && (
            <CryptoLab onEarnXp={handleEarnXp} />
          )}

          {currentSection === 'learning-paths' && (
            <LearningPaths
              onEarnXp={handleEarnXp}
              solvedQuizzes={progress.solvedQuizzes}
              onSolveQuiz={handleSolveQuiz}
            />
          )}

          {currentSection === 'ai-mentor' && <AiMentor />}

          {currentSection === 'certificates' && (
            <BadgesAndCert
              progress={progress}
              onUpdateUserName={handleUpdateUserName}
            />
          )}
        </main>
      </div>
    </div>
  );
}
