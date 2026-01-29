
import React, { useState, useEffect, useRef } from 'react';
import { AppView, TimerMode, Flashcard, UserStats, QuizFolder, Notebook, QuizAttempt, StudyPlan, DailyHistory, StudySubject, StudySession, Activity, QuizQuestion, StudyProfile, FocusSettings } from './types';
import Header from './components/Header';
import Hub from './components/Hub';
import TimerView from './components/TimerView';
import FlashcardView from './components/FlashcardView';
import FlashcardManager from './components/FlashcardManager';
import FlashcardStudy from './components/FlashcardStudy';
import AIView from './components/AIView';
import MaterialsManager from './components/MaterialsManager';
import QuizPlayer from './components/QuizPlayer';
import TDHQuestoes from './components/TDHQuestoes';
import StudyPlanView from './components/StudyPlanView';
import ProfileView from './components/ProfileView';
import CommunityView from './components/CommunityView';
import SplashScreen from './components/SplashScreen';
import FishCompanion from './components/FishCompanion';
import ProfileSelection from './components/ProfileSelection';
import FocusModeView from './components/FocusModeView';
import StudyMaterialHub from './components/StudyMaterialHub';
import MaterialViewer from './components/MaterialViewer';
import { StudyMaterial } from './types';

// URLs de Áudio
const LOFI_RELAX_URL = "https://stream.zeno.fm/0r0xa792kwzuv";
const MPB_LOFI_URL = "https://stream.zeno.fm/f978v6v6h0huv";
const RAIN_SOUND_URL = "https://www.soundjay.com/nature/rain-01.mp3";

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('HUB');
  const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.POMODORO);
  const [showGlobalBar, setShowGlobalBar] = useState(true);

  // Audio Global State
  const [activeChannel, setActiveChannel] = useState<'RELAX' | 'MPB' | null>(null);
  const [isPlayingRain, setIsPlayingRain] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.5);

  const relaxAudioRef = useRef<HTMLAudioElement | null>(null);
  const mpbAudioRef = useRef<HTMLAudioElement | null>(null);
  const rainAudioRef = useRef<HTMLAudioElement | null>(null);

  // Global Timer State
  const [globalTimerActive, setGlobalTimerActive] = useState(false);
  const [globalTimerSeconds, setGlobalTimerSeconds] = useState(1500);

  // States
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [folders, setFolders] = useState<QuizFolder[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [activeNotebookInfo, setActiveNotebookInfo] = useState<{ folderId: string, notebookId: string } | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentMaterial, setCurrentMaterial] = useState<StudyMaterial | null>(null);
  const [history, setHistory] = useState<DailyHistory>({});

  const [focusSettings, setFocusSettings] = useState<FocusSettings>({
    waterReminder: true,
    waterInterval: 45,
    medicationReminder: false,
    medicationTime: '08:00',
    workTransition: true,
    workStartTime: '09:00',
    prepTime: 15
  });

  const [studyPlan, setStudyPlan] = useState<StudyPlan>({
    subjects: [],
    dailyGoalMinutes: 120,
    sessions: []
  });

  const [stats, setStats] = useState<UserStats>({
    name: 'Peixe Focado',
    avatarColor: '#FACC15',
    level: 1,
    xp: 0,
    coins: 0,
    streak: 0,
    totalDaysStudied: 0,
    studyProfile: undefined
  });

  // Roteamento para views específicas via hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'FLASHCARD_MANAGER') {
        setCurrentView('FLASHCARD_MANAGER');
      } else if (hash === 'FLASHCARD_STUDY') {
        setCurrentView('FLASHCARD_STUDY');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Audio Effects
  useEffect(() => {
    if (relaxAudioRef.current) relaxAudioRef.current.pause();
    if (mpbAudioRef.current) mpbAudioRef.current.pause();

    if (activeChannel === 'RELAX' && relaxAudioRef.current) {
      relaxAudioRef.current.play().catch(() => { });
    } else if (activeChannel === 'MPB' && mpbAudioRef.current) {
      mpbAudioRef.current.play().catch(() => { });
    }
  }, [activeChannel]);

  useEffect(() => {
    if (rainAudioRef.current) {
      if (isPlayingRain) rainAudioRef.current.play().catch(() => { });
      else rainAudioRef.current.pause();
    }
  }, [isPlayingRain]);

  useEffect(() => {
    if (relaxAudioRef.current) relaxAudioRef.current.volume = audioVolume;
    if (mpbAudioRef.current) mpbAudioRef.current.volume = audioVolume;
    if (rainAudioRef.current) rainAudioRef.current.volume = audioVolume * 0.6;
  }, [audioVolume]);

  // Persistência - Carregar dados ao iniciar
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('tdh_stats');
      if (savedStats) setStats(JSON.parse(savedStats));

      const savedFolders = localStorage.getItem('tdh_folders');
      if (savedFolders) setFolders(JSON.parse(savedFolders));

      const savedFlashcards = localStorage.getItem('tdh_flashcards');
      if (savedFlashcards) setFlashcards(JSON.parse(savedFlashcards));

      const savedStudyPlan = localStorage.getItem('tdh_study_plan');
      if (savedStudyPlan) setStudyPlan(JSON.parse(savedStudyPlan));

      const savedHistory = localStorage.getItem('tdh_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const savedActivities = localStorage.getItem('tdh_activities');
      if (savedActivities) setActivities(JSON.parse(savedActivities));

      const savedFocusSettings = localStorage.getItem('tdh_focus_settings');
      if (savedFocusSettings) setFocusSettings(JSON.parse(savedFocusSettings));
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error);
    }
  }, []);

  // Persistência - Salvar dados em qualquer mudança
  useEffect(() => {
    if (stats.studyProfile) localStorage.setItem('tdh_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (folders.length > 0) localStorage.setItem('tdh_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (flashcards.length > 0) localStorage.setItem('tdh_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('tdh_study_plan', JSON.stringify(studyPlan));
  }, [studyPlan]);

  useEffect(() => {
    localStorage.setItem('tdh_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (activities.length > 0) localStorage.setItem('tdh_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('tdh_focus_settings', JSON.stringify(focusSettings));
  }, [focusSettings]);

  // Global Clock
  useEffect(() => {
    let interval: any;
    if (globalTimerActive && globalTimerSeconds > 0) {
      interval = setInterval(() => {
        setGlobalTimerSeconds(s => s - 1);
      }, 1000);
    } else if (globalTimerSeconds === 0 && globalTimerActive) {
      setGlobalTimerActive(false);
      logStudyMinutes(timerMode === TimerMode.EMERGENCY ? 5 : 25);
    }
    return () => clearInterval(interval);
  }, [globalTimerActive, globalTimerSeconds]);

  const addXP = (amount: number) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const logStudyMinutes = (minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    setHistory(prev => ({ ...prev, [today]: (prev[today] || 0) + minutes }));
    addXP(minutes * 2);

    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      userName: stats.name,
      avatarColor: stats.avatarColor,
      subject: activeSubjectId ? (studyPlan.subjects.find(s => s.id === activeSubjectId)?.name || 'Estudo') : 'Mergulho de Foco',
      duration: minutes,
      type: timerMode === TimerMode.EMERGENCY ? 'EMERGENCY' : 'POMODORO',
      timestamp: Date.now(),
      bubbles: 0
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleManualPost = (text: string) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      userName: stats.name,
      avatarColor: stats.avatarColor,
      subject: text,
      duration: 0,
      type: 'STATUS',
      timestamp: Date.now(),
      bubbles: 0
    };
    setActivities(prev => [newActivity, ...prev]);
    addXP(10);
  };

  const handleSaveToNotebook = (folderId: string, notebookName: string, questions: QuizQuestion[], summary?: string) => {
    setFolders(prev => prev.map(f => {
      if (f.id !== folderId) return f;
      const existingNotebook = f.notebooks.find(n => n.name.toLowerCase() === notebookName.toLowerCase());
      if (existingNotebook) {
        return { ...f, notebooks: f.notebooks.map(n => n.id === existingNotebook.id ? { ...n, questions: [...n.questions, ...questions], summary: summary || n.summary } : n) };
      } else {
        const newNotebook: Notebook = { id: Math.random().toString(36).substr(2, 9), name: notebookName, questions, summary, createdAt: Date.now() };
        return { ...f, notebooks: [...f.notebooks, newNotebook] };
      }
    }));
  };

  const handleCloseGlobalBar = () => {
    // Para tudo antes de fechar para garantir silêncio e economia de bateria
    setGlobalTimerActive(false);
    setActiveChannel(null);
    setIsPlayingRain(false);
    setShowGlobalBar(false);
  };

  if (isInitializing) return <SplashScreen onComplete={() => setIsInitializing(false)} />;
  if (!stats.studyProfile) return <ProfileSelection onSelect={(p) => setStats(prev => ({ ...prev, studyProfile: p }))} />;

  const formatMiniTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0F1E] pb-32">
      <audio ref={relaxAudioRef} src={LOFI_RELAX_URL} loop />
      <audio ref={mpbAudioRef} src={MPB_LOFI_URL} loop />
      <audio ref={rainAudioRef} src={RAIN_SOUND_URL} loop />

      <Header stats={stats} onProfileClick={() => setCurrentView('PROFILE')} onLogoClick={() => setCurrentView('HUB')} />

      {/* HUB DE COMANDO GLOBAL */}
      {showGlobalBar && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] w-[95%] max-w-2xl animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-[35px] p-2 flex items-center justify-between gap-3 relative">

            {/* Botão Fechar - Agora silencia o app e para o cronômetro */}
            <button
              onClick={handleCloseGlobalBar}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white shadow-md border border-gray-100 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 transition-all hover:scale-110 z-20"
              title="Parar atividades e fechar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Áudio */}
            <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-[25px]">
              <button onClick={() => setActiveChannel(activeChannel === 'RELAX' ? null : 'RELAX')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${activeChannel === 'RELAX' ? 'bg-yellow-400 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`} title="Lofi Relax">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
              </button>
              <button onClick={() => setIsPlayingRain(!isPlayingRain)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlayingRain ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`} title="Chuva de Fundo">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              </button>
            </div>

            {/* Cronômetro Compacto */}
            <div className="flex-1 flex items-center justify-center gap-4 bg-gray-50/50 p-1 rounded-[25px]">
              <button onClick={() => setCurrentView('TIMER')} className="flex flex-col items-center hover:opacity-70 transition-opacity">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">{timerMode}</span>
                <span className="text-xl font-black tabular-nums leading-none">{formatMiniTime(globalTimerSeconds)}</span>
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setGlobalTimerActive(!globalTimerActive)} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${globalTimerActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                  {globalTimerActive ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
                </button>
                {!globalTimerActive && (
                  <button
                    onClick={() => { setCurrentView('TIMER'); }}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-300 hover:text-yellow-500 border border-gray-100 transition-all"
                    title="Editar Duração"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
              </div>
            </div>

            <div className="pr-2">
              <input type="range" min="0" max="1" step="0.01" value={audioVolume} onChange={(e) => setAudioVolume(parseFloat(e.target.value))} className="w-12 h-1 accent-yellow-400 hidden sm:block opacity-40 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      )}

      {/* Botão Flutuante de Recuperação do Hub */}
      {!showGlobalBar && (
        <button
          onClick={() => setShowGlobalBar(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-yellow-400 text-white rounded-[20px] shadow-2xl flex items-center justify-center animate-in zoom-in duration-300 z-50 hover:scale-110 active:scale-95"
          title="Abrir Controles de Foco"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
        </button>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        {currentView === 'HUB' && (
          <Hub
            setView={setCurrentView}
            setTimerMode={(mode) => { setTimerMode(mode); setGlobalTimerSeconds(mode === TimerMode.EMERGENCY ? 300 : 1500); setShowGlobalBar(true); }}
            flashcardCount={flashcards.length}
            stats={stats}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            isPlayingRain={isPlayingRain}
            setIsPlayingRain={setIsPlayingRain}
          />
        )}

        {currentView === 'TIMER' && (
          <TimerView
            isActive={globalTimerActive}
            setIsActive={setGlobalTimerActive}
            seconds={globalTimerSeconds}
            setSeconds={setGlobalTimerSeconds}
            mode={timerMode}
            onBack={() => setCurrentView('HUB')}
            onComplete={() => logStudyMinutes(timerMode === TimerMode.EMERGENCY ? 5 : 25)}
          />
        )}

        {currentView === 'FLASHCARDS' && <FlashcardView flashcards={flashcards} setFlashcards={setFlashcards} onBack={() => setCurrentView('HUB')} />}
        {currentView === 'FLASHCARD_MANAGER' && <FlashcardManager onBack={() => setCurrentView('FLASHCARDS')} onFlashcardsChange={setFlashcards} />}
        {currentView === 'FLASHCARD_STUDY' && <FlashcardStudy flashcards={flashcards} onBack={() => setCurrentView('FLASHCARDS')} />}

        {currentView === 'AI_DIRECT' && <AIView onBack={() => setCurrentView('HUB')} folders={folders} onSaveToNotebook={handleSaveToNotebook} studyProfile={stats.studyProfile!} onNewContent={(c) => setFlashcards(prev => [...prev, ...c.flashcards.map((f: any) => ({ id: Math.random().toString(36).substr(2, 9), ...f }))])} />}
        {currentView === 'TDH_QUESTOES' && <TDHQuestoes onBack={() => setCurrentView('HUB')} folders={folders} onSaveToNotebook={handleSaveToNotebook} studyProfile={stats.studyProfile!} />}
        {currentView === 'MATERIALS' && <MaterialsManager folders={folders} attempts={attempts} onCreateFolder={name => setFolders(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name, topic: name, notebooks: [], createdAt: Date.now() }])} onCreateNotebook={(fid, name) => setFolders(prev => prev.map(f => f.id === fid ? { ...f, notebooks: [...f.notebooks, { id: Math.random().toString(36).substr(2, 9), name, questions: [], createdAt: Date.now() }] } : f))} onBack={() => setCurrentView('HUB')} onPlayQuiz={(fid, nid) => { setActiveNotebookInfo({ folderId: fid, notebookId: nid }); setCurrentView('QUIZ_PLAYER'); }} />}
        {currentView === 'QUIZ_PLAYER' && activeNotebookInfo && <QuizPlayer folder={folders.find(f => f.id === activeNotebookInfo.folderId)!} notebook={folders.find(f => f.id === activeNotebookInfo.folderId)!.notebooks.find(n => n.id === activeNotebookInfo.notebookId)!} onBack={() => setCurrentView('MATERIALS')} onComplete={(score, total) => { setAttempts(prev => [...prev, { folderId: activeNotebookInfo.folderId, notebookId: activeNotebookInfo.notebookId, date: Date.now(), score, total }]); addXP(score * 50); setCurrentView('MATERIALS'); }} />}
        {currentView === 'STUDY_PLAN' && <StudyPlanView onBack={() => setCurrentView('HUB')} plan={studyPlan} history={history} onUpdatePlan={setStudyPlan} onStartTimer={(s) => { setActiveSubjectId(s.id); setTimerMode(TimerMode.POMODORO); setGlobalTimerSeconds(1500); setShowGlobalBar(true); setCurrentView('TIMER'); }} />}
        {currentView === 'FOCUS_MODE' && <FocusModeView settings={focusSettings} onUpdate={setFocusSettings} onBack={() => setCurrentView('HUB')} />}
        {currentView === 'PROFILE' && <ProfileView stats={stats} onUpdate={setStats} onBack={() => setCurrentView('HUB')} />}
        {currentView === 'COMMUNITY' && <CommunityView activities={activities} onBack={() => setCurrentView('HUB')} onPostManual={handleManualPost} />}
        {currentView === 'STUDY_MATERIALS' && !currentMaterial && (
          <StudyMaterialHub
            onBack={() => setCurrentView('HUB')}
            onViewMaterial={(material) => setCurrentMaterial(material)}
          />
        )}
        {currentView === 'STUDY_MATERIALS' && currentMaterial && (
          <MaterialViewer
            material={currentMaterial}
            onBack={() => setCurrentMaterial(null)}
          />
        )}
      </main>

      <FishCompanion studyProfile={stats.studyProfile} />
    </div>
  );
};

export default App;
