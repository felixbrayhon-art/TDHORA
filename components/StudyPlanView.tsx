
import React, { useState, useMemo } from 'react';
import { StudyPlan, StudySubject, DailyHistory, StudySession, StudyProfile } from '../types';
import { ENEM_ROADMAP } from '../services/enemRoadmap';
import { CONCURSOS_ROADMAP } from '../services/concursosRoadmap';

interface StudyPlanViewProps {
  onBack: () => void;
  plan: StudyPlan;
  history: DailyHistory;
  onUpdatePlan: (newPlan: StudyPlan) => void;
  onStartTimer: (subject: StudySubject) => void;
  studyProfile: StudyProfile;
}

const StudyPlanView: React.FC<StudyPlanViewProps> = ({ onBack, plan, history, onUpdatePlan, onStartTimer, studyProfile }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SETUP' | 'GUIA'>('DASHBOARD');
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // States for form
  const [formName, setFormName] = useState('');
  const [formWeight, setFormWeight] = useState(3);

  const colors = ['#FACC15', '#3B82F6', '#10B981', '#F97316', '#8B5CF6', '#EC4899'];

  const cycleStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayMinutes = plan.sessions?.filter(s => new Date(s.date).toISOString().split('T')[0] === today)
      .reduce((acc, s) => acc + s.durationMinutes, 0) || 0;

    return { todayMinutes };
  }, [plan.sessions]);

  // Logic to find the next subject in cycle (the one with lowest progress percentage)
  const suggestedSubject = useMemo(() => {
    if (plan.subjects.length === 0) return null;
    return [...plan.subjects].sort((a, b) =>
      (a.completedMinutesTotal / a.targetMinutes) - (b.completedMinutesTotal / b.targetMinutes)
    )[0];
  }, [plan.subjects]);

  const handleSaveSubject = () => {
    if (!formName.trim()) return;

    if (editingSubjectId) {
      // Update existing
      const updatedSubjects = plan.subjects.map(s =>
        s.id === editingSubjectId
          ? { ...s, name: formName, weight: formWeight, targetMinutes: formWeight * 30 }
          : s
      );
      onUpdatePlan({ ...plan, subjects: updatedSubjects });
    } else {
      // Add new
      const newSubject: StudySubject = {
        id: Math.random().toString(36).substr(2, 9),
        name: formName,
        weight: formWeight,
        color: colors[plan.subjects.length % colors.length],
        targetMinutes: formWeight * 30,
        completedMinutesTotal: 0
      };
      onUpdatePlan({ ...plan, subjects: [...plan.subjects, newSubject] });
    }

    setFormName('');
    setFormWeight(3);
    setEditingSubjectId(null);
    setIsAdding(false);
  };

  const startEdit = (sub: StudySubject) => {
    setEditingSubjectId(sub.id);
    setFormName(sub.name);
    setFormWeight(sub.weight);
    setIsAdding(true);
  };

  const removeSubject = (id: string) => {
    onUpdatePlan({ ...plan, subjects: plan.subjects.filter(s => s.id !== id) });
  };

  const updateDailyGoal = (val: number) => {
    onUpdatePlan({ ...plan, dailyGoalMinutes: val });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-700">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <button onClick={onBack} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex bg-white shadow-xl shadow-gray-100/50 border border-gray-100 p-1.5 rounded-[22px]">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black tracking-widest transition-all ${activeTab === 'DASHBOARD' ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab('SETUP')}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black tracking-widest transition-all ${activeTab === 'SETUP' ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            AJUSTES
          </button>
          <button
            onClick={() => setActiveTab('GUIA')}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black tracking-widest transition-all ${activeTab === 'GUIA' ? 'bg-[#0A0F1E] text-white shadow-lg shadow-[#0A0F1E]/20' : 'text-gray-400 hover:text-gray-600'}`}
          >
            GUIA ENEM
          </button>
        </div>
        <div className="w-12 h-12" />
      </div>

      {activeTab === 'DASHBOARD' ? (
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between h-44">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Foco Hoje</span>
              <div>
                <span className="text-5xl font-black text-gray-800">{cycleStats.todayMinutes}</span>
                <span className="text-gray-400 font-bold ml-1 text-sm">min</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>Progresso Diário</span>
                  <span>{Math.round((cycleStats.todayMinutes / plan.dailyGoalMinutes) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full transition-all duration-1000"
                    style={{ width: `${Math.min((cycleStats.todayMinutes / plan.dailyGoalMinutes) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0A0F1E] p-8 rounded-[40px] shadow-2xl flex flex-col justify-between h-44 text-white relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-400/10 blur-[50px] rounded-full group-hover:bg-yellow-400/20 transition-all"></div>
              <span className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em]">Meta Diária</span>
              <div>
                <span className="text-5xl font-black">{Math.floor(plan.dailyGoalMinutes / 60)}h</span>
                <span className="text-blue-400 font-black ml-1 text-2xl">{plan.dailyGoalMinutes % 60}m</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ritmo TDAH ORA Ativo</p>
              </div>
            </div>
          </div>

          {/* Suggested Subject Banner */}
          {suggestedSubject && (
            <div className="bg-white border-2 border-yellow-400/30 rounded-[35px] p-6 flex items-center justify-between shadow-lg shadow-yellow-50 animate-in slide-in-from-top-4">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg uppercase" style={{ backgroundColor: suggestedSubject.color }}>
                  FOCO
                </div>
                <div>
                  <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">Sugestão do Ciclo</p>
                  <h3 className="text-xl font-black text-gray-800 uppercase italic leading-none">{suggestedSubject.name}</h3>
                </div>
              </div>
              <button
                onClick={() => onStartTimer(suggestedSubject)}
                className="bg-yellow-400 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-yellow-100 hover:scale-105 active:scale-95 transition-all"
              >
                ESTUDAR AGORA
              </button>
            </div>
          )}

          {/* Subject List */}
          <div className="bg-white rounded-[45px] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
              <div className="w-1 h-4 bg-yellow-400 rounded-full"></div>
              Minhas Disciplinas
            </h3>

            <div className="space-y-4">
              {plan.subjects.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-300 font-bold italic">Nenhuma matéria no seu ciclo ainda.</p>
                  <button onClick={() => setActiveTab('SETUP')} className="mt-4 text-yellow-500 font-black text-xs underline uppercase tracking-widest">Configurar Agora</button>
                </div>
              ) : (
                plan.subjects.map((sub, idx) => (
                  <div key={sub.id} className="group flex items-center gap-5 p-5 rounded-[28px] bg-gray-50/50 border border-transparent hover:border-yellow-100 hover:bg-white transition-all hover:shadow-md">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                      style={{ backgroundColor: sub.color }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-2">
                        <h4 className="font-black text-gray-800 uppercase text-sm tracking-tight">{sub.name}</h4>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                          {sub.completedMinutesTotal} / {sub.targetMinutes} MIN
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-700"
                          style={{
                            width: `${Math.min((sub.completedMinutesTotal / sub.targetMinutes) * 100, 100)}%`,
                            backgroundColor: sub.color
                          }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => onStartTimer(sub)}
                      className="w-12 h-12 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-yellow-500 hover:bg-yellow-400 hover:text-white transition-all"
                    >
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'SETUP' ? (
        <div className="space-y-6">
          {/* Daily Goal Adjuster */}
          {/* ... (existing setup code) ... */}
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest italic">Meta de Estudo Diária</h3>
              <span className="bg-yellow-50 text-yellow-600 px-4 py-1 rounded-full text-xs font-black">
                {Math.floor(plan.dailyGoalMinutes / 60)}h {plan.dailyGoalMinutes % 60}m
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="600"
              step="15"
              value={plan.dailyGoalMinutes}
              onChange={(e) => updateDailyGoal(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-full accent-yellow-400 cursor-pointer appearance-none"
            />
            <div className="flex justify-between mt-3 text-[9px] font-bold text-gray-300 uppercase tracking-widest">
              <span>30 min</span>
              <span>10 horas</span>
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-lg font-black text-gray-800 italic uppercase tracking-tighter">GERENCIAR CICLO</h3>
              {!isAdding && (
                <button
                  onClick={() => { setEditingSubjectId(null); setFormName(''); setFormWeight(3); setIsAdding(true); }}
                  className="bg-yellow-400 text-white px-8 py-3 rounded-2xl text-[10px] font-black shadow-xl shadow-yellow-100 transition-all hover:bg-yellow-500"
                >
                  + ADICIONAR NOVA
                </button>
              )}
            </div>

            {isAdding && (
              <div className="mb-10 p-8 bg-gray-50 rounded-[35px] border-2 border-dashed border-yellow-200 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xs font-black text-yellow-600 uppercase tracking-widest">
                    {editingSubjectId ? 'EDITAR MATÉRIA' : 'NOVA MATÉRIA'}
                  </h4>
                  <button onClick={() => setIsAdding(false)} className="text-gray-300 hover:text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <input
                  autoFocus
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nome da Disciplina..."
                  className="w-full bg-white rounded-2xl px-6 py-4 mb-6 text-base font-bold border border-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all shadow-sm"
                />

                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Importância (Peso)</span>
                  <span className="text-yellow-600 font-black text-lg">{formWeight}x</span>
                </div>
                <input
                  type="range" min="1" max="5"
                  value={formWeight}
                  onChange={(e) => setFormWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-full accent-yellow-400 cursor-pointer mb-8"
                />

                <div className="flex gap-4">
                  <button onClick={() => setIsAdding(false)} className="flex-1 py-4 text-gray-400 text-xs font-black uppercase tracking-widest hover:text-gray-600">CANCELAR</button>
                  <button onClick={handleSaveSubject} className="flex-1 bg-gray-800 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-black transition-all">
                    {editingSubjectId ? 'SALVAR ALTERAÇÕES' : 'CONFIRMAR ADIÇÃO'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {plan.subjects.map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-5 bg-gray-50/50 rounded-3xl group transition-all hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: sub.color }} />
                    <div>
                      <span className="font-black text-gray-700 uppercase text-sm tracking-tight">{sub.name}</span>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">PESO {sub.weight}</span>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">•</span>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">{sub.targetMinutes} MIN/CICLO</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(sub)}
                      className="p-2.5 text-blue-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeSubject(sub.id)}
                      className="p-2.5 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-[#0A0F1E] p-10 rounded-[50px] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h2 className="text-4xl font-black italic mb-4 uppercase">ROADMAP <span className="text-yellow-400">ENEM</span></h2>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xl">
              Este é o seu guia definitivo baseado no que mais cai no ENEM.
              Use os tópicos abaixo para orientar suas revisões ou gerar simulados com a IA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ENEM_ROADMAP.map((area, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-800 font-black text-xl">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-yellow-500 uppercase tracking-widest">{area.area}</h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{area.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {area.topics.map((topic, tIdx) => (
                    <div key={tIdx} className="p-5 bg-gray-50/50 rounded-3xl border border-transparent hover:border-yellow-200 hover:bg-white transition-all">
                      <h4 className="font-black text-gray-800 uppercase text-[11px] mb-1">{topic.title}</h4>
                      <p className="text-[10px] text-gray-400 font-medium leading-tight">{topic.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>)}
    </div>
  );
};

export default StudyPlanView;
