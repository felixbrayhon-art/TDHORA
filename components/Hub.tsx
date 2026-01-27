
import React, { useState } from 'react';
import { AppView, TimerMode, UserStats, HubCategory } from '../types';

interface HubProps {
  setView: (view: AppView) => void;
  setTimerMode: (mode: TimerMode) => void;
  flashcardCount: number;
  stats: UserStats;
  activeChannel: 'RELAX' | 'MPB' | null;
  setActiveChannel: (ch: 'RELAX' | 'MPB' | null) => void;
  isPlayingRain: boolean;
  setIsPlayingRain: (p: boolean) => void;
}

const Hub: React.FC<HubProps> = ({ setView, setTimerMode, flashcardCount, stats, activeChannel, setActiveChannel, isPlayingRain, setIsPlayingRain }) => {
  const [activeTab, setActiveTab] = useState<HubCategory>('ESTUDO');
  const profileLabel = stats.studyProfile === 'CONCURSO' ? 'Foco: Concursos' : 'Foco: Vestibulares';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0A0F1E] tracking-tight uppercase italic leading-none">MEU HUB DE FOCO</h1>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            <p className="text-yellow-600 font-black text-xs uppercase tracking-[0.2em]">{profileLabel}</p>
          </div>
        </div>
        <button
          onClick={() => setView('COMMUNITY')}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-black text-sm hover:shadow-xl hover:bg-gray-800 transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          CARDUME SOCIAL
        </button>
      </div>

      <div className="flex p-2 bg-white rounded-[30px] shadow-sm border border-gray-100 max-w-2xl overflow-x-auto">
        <button onClick={() => setActiveTab('ESTUDO')} className={`flex-1 py-4 px-6 rounded-[22px] flex items-center justify-center gap-3 font-black text-xs transition-all ${activeTab === 'ESTUDO' ? 'bg-blue-500 text-white shadow-xl shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          ESTUDO
        </button>
        <button onClick={() => setActiveTab('ORGANIZACAO')} className={`flex-1 py-4 px-6 rounded-[22px] flex items-center justify-center gap-3 font-black text-xs transition-all ${activeTab === 'ORGANIZACAO' ? 'bg-yellow-400 text-white shadow-xl shadow-yellow-100' : 'text-gray-400 hover:bg-gray-50'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          ORGANIZAÇÃO
        </button>
        <button onClick={() => setActiveTab('RELAXE')} className={`flex-1 py-4 px-6 rounded-[22px] flex items-center justify-center gap-3 font-black text-xs transition-all ${activeTab === 'RELAXE' ? 'bg-orange-500 text-white shadow-xl shadow-orange-100' : 'text-gray-400 hover:bg-gray-50'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          RELAXE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        {activeTab === 'ESTUDO' && (
          <>
            <button onClick={() => setView('MATERIALS')} className="bg-white p-8 rounded-[40px] text-left border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
              <div className="mb-8 w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center relative z-10 shadow-sm"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
              <h2 className="text-2xl font-black mb-2 italic">MEUS <span className="text-blue-500">materiais</span></h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest text-[10px]">Resumos & Cadernos</p>
            </button>
            <button onClick={() => setView('TDH_QUESTOES')} className="bg-white p-8 rounded-[40px] text-left border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden animate-in zoom-in-95 duration-300 delay-75">
              <div className="mb-8 w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center relative z-10"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" /></svg></div>
              <h2 className="text-2xl font-black mb-2 relative z-10 uppercase italic">TDH<span className="text-blue-500">questoes</span></h2>
              <p className="text-gray-400 text-sm mb-4 relative z-10 font-bold uppercase tracking-widest text-[10px]">Batalha de Simulados</p>
            </button>
            <button onClick={() => setView('AI_DIRECT')} className="gradient-dark text-white p-8 rounded-[40px] text-left relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-xl animate-in zoom-in-95 duration-300 delay-150">
              <div className="mb-8 w-12 h-12 bg-white/10 text-yellow-400 rounded-2xl flex items-center justify-center backdrop-blur-md"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
              <h2 className="text-3xl font-black mb-2 italic uppercase">AULA DIRETA</h2>
              <p className="text-yellow-400/80 text-[10px] font-bold uppercase tracking-widest">IA Powered Bizu</p>
            </button>
            <button onClick={() => setView('STUDY_MATERIALS')} className="bg-gradient-to-br from-purple-500 to-blue-500 text-white p-8 rounded-[40px] text-left relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-xl animate-in zoom-in-95 duration-300 delay-200">
              <div className="mb-8 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
              <h2 className="text-2xl font-black mb-2 italic uppercase">MATERIAIS DE ESTUDO</h2>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Upload PDF • IA Gera Tudo</p>
            </button>
          </>
        )}

        {activeTab === 'ORGANIZACAO' && (
          <>
            <button onClick={() => { setTimerMode(TimerMode.POMODORO); setView('TIMER'); }} className="bg-white p-8 rounded-[40px] text-left border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="mb-8 w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <h2 className="text-2xl font-black mb-2 italic">POMODORO</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Gestão de Tempo</p>
            </button>
            <button onClick={() => setView('STUDY_PLAN')} className="bg-white p-8 rounded-[40px] text-left border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden animate-in zoom-in-95 duration-300 delay-75">
              <div className="mb-8 w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
              <h2 className="text-2xl font-black mb-2 italic uppercase">CRONOGRAMA</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-[10px]">Ciclo de Estudo</p>
            </button>
            <button onClick={() => setView('FOCUS_MODE')} className="gradient-yellow text-white p-8 rounded-[40px] text-left relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-xl animate-in zoom-in-95 duration-300 delay-150 shadow-yellow-200">
              <div className="mb-8 w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-sm"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
              <h2 className="text-2xl font-black mb-2 italic uppercase">MODO FOCO</h2>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Saúde & Blindagem</p>
            </button>
          </>
        )}

        {activeTab === 'RELAXE' && (
          <>
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 flex flex-col justify-between shadow-sm relative overflow-hidden h-full animate-in zoom-in-95 duration-300 lg:col-span-2">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2 leading-none">AMBIENTE <span className="text-yellow-400">SONORO</span></h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10">Controle o Lofi e os ruídos brancos</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActiveChannel(activeChannel === 'RELAX' ? null : 'RELAX')} className={`p-6 rounded-[30px] flex flex-col items-center gap-2 transition-all border-4 ${activeChannel === 'RELAX' ? 'bg-yellow-400 border-yellow-400 text-white shadow-xl shadow-yellow-100' : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200'}`}>
                  <span className="text-xs font-black uppercase tracking-widest italic">LOFI RELAX</span>
                </button>
                <button onClick={() => setIsPlayingRain(!isPlayingRain)} className={`p-6 rounded-[30px] flex items-center justify-center gap-4 transition-all border-4 ${isPlayingRain ? 'bg-blue-500 border-blue-500 text-white shadow-xl shadow-blue-100' : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                </button>
              </div>
            </div>

            <button onClick={() => { setTimerMode(TimerMode.EMERGENCY); setView('TIMER'); }} className="gradient-orange text-white p-8 rounded-[40px] text-left relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-xl animate-in zoom-in-95 duration-300 delay-150 h-full">
              <div className="mb-12"><svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <h2 className="text-3xl font-black leading-none uppercase italic">EMERGÊNCIA</h2>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-2">Dê o primeiro passo agora</p>
            </button>
          </>
        )}
      </div>

      <footer className="pt-12 mt-12 border-t border-gray-100 text-center animate-in fade-in duration-1000">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-gray-500 font-medium text-sm leading-relaxed px-6">
            Olá, eu sou o <span className="text-[#0A0F1E] font-black italic">Brayhon</span>. Desenvolvi este app como um <span className="text-blue-500 font-bold">cardume seguro</span> para nossas mentes neurodivergentes. Eu também tenho <span className="text-orange-500 font-bold">TDAH</span> e sei que o nosso foco não é quebrado, ele apenas funciona em uma frequência diferente.
          </p>
          <p className="text-gray-300 font-bold text-[10px] uppercase tracking-[0.3em]">
            Criado com propósito • TDAH ORA
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Hub;
