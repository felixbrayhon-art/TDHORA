
import React, { useState } from 'react';
import { generateStudyContent } from '../services/geminiService';
import LoadingFish from './LoadingFish';
import SaveToFolderModal from './SaveToFolderModal';
import { QuizFolder, QuizQuestion, StudyProfile } from '../types';

interface AIViewProps {
  onBack: () => void;
  folders: QuizFolder[];
  onNewContent: (content: any) => void;
  onSaveToNotebook: (folderId: string, notebookName: string, questions: QuizQuestion[], summary?: string) => void;
  studyProfile: StudyProfile;
}

const AIView: React.FC<AIViewProps> = ({ onBack, onNewContent, onSaveToNotebook, folders, studyProfile }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const handleGenerate = async (targetTopic?: string) => {
    const finalTopic = targetTopic || topic;
    if (!finalTopic.trim()) return;
    
    setLoading(true);
    if (!targetTopic) setResult(null); // Reset total se for busca nova
    setSaved(false);
    
    try {
      const content = await generateStudyContent(finalTopic, "Dossiê Expandido", numQuestions, studyProfile);
      setResult(content);
      if (!targetTopic) setTopic(finalTopic); // Atualiza o input se foi por sugestão
      onNewContent(content);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("Erro ao mergulhar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = (folderId: string, notebookName: string) => {
    if (result) {
      onSaveToNotebook(folderId, notebookName, result.quiz, result.executiveSummary);
      setSaved(true);
      setShowSaveModal(false);
    }
  };

  if (loading) {
    return <LoadingFish message="Mergulhando mais fundo..." submessage="IA está extraindo o néctar do conhecimento" />;
  }

  return (
    <div className="animate-in fade-in duration-500">
      {!result ? (
        <div className="max-w-3xl mx-auto py-20">
          <button 
            onClick={onBack} 
            className="mb-8 text-gray-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
            VOLTAR AO HUB
          </button>
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4 tracking-tighter italic uppercase">Exploração <span className="text-blue-500">Ilimitada</span></h1>
            <p className="text-gray-400 font-medium italic">
              Gerando dossiê de alta performance para <span className="text-yellow-600 uppercase">{studyProfile}</span>
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-gray-50 space-y-8">
            <div className="relative group">
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Qual o tema do seu mergulho hoje?"
                className="w-full bg-gray-50 border-2 border-transparent rounded-[30px] px-8 py-7 text-2xl focus:outline-none focus:border-blue-400 transition-all placeholder:text-gray-200 font-black italic"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex-1 w-full bg-gray-50/50 p-6 rounded-[30px]">
                <div className="flex justify-between mb-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Questions no Caderno</label>
                   <span className="text-blue-600 font-black">{numQuestions}</span>
                </div>
                <input 
                  type="range" min="3" max="15" 
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full accent-blue-500 cursor-pointer"
                />
              </div>
              <button 
                onClick={() => handleGenerate()}
                className="w-full md:w-auto bg-[#0A0F1E] text-white px-12 py-7 rounded-[30px] font-black text-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl"
              >
                INICIAR DOSSIÊ
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-6">
          <div className="flex justify-between items-center mb-10">
            <button 
              onClick={() => setResult(null)} 
              className="text-gray-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
              NOVA PESQUISA
            </button>
            <div className="flex gap-4">
               <span className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-100">
                 TEMA: {topic}
               </span>
               <button 
                 onClick={onBack} 
                 className="bg-gray-100 text-gray-500 px-6 py-2 rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-gray-200 transition-colors"
               >
                 SAIR
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-10">
              
              {/* RESUMO EXPANDIDO */}
              <div className="bg-white rounded-[60px] p-10 md:p-16 shadow-2xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-3 h-full bg-blue-500"></div>
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div>
                    <h2 className="text-blue-600 font-black uppercase text-xs tracking-[0.3em]">Resumo Executivo Expandido</h2>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase">{topic}</h3>
                  </div>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <p className="text-[#1E293B] text-2xl leading-relaxed font-medium mb-12 whitespace-pre-wrap">
                    {result.executiveSummary}
                  </p>
                </div>

                <div className="mt-16 p-10 bg-gray-50 rounded-[40px] border border-gray-100">
                  <h4 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Mergulho Profundo: O Ponto de Elite
                  </h4>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">
                    {result.deepDive}
                  </p>
                </div>
              </div>

              {/* COMPARAÇÃO BIZURADA */}
              {result.comparison && (
                <div className="bg-[#FFFCF0] rounded-[50px] border-2 border-dashed border-yellow-200 p-10 md:p-14 relative shadow-xl">
                  <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-yellow-100 -translate-x-1/2 hidden md:block"></div>
                  <div className="absolute left-1/2 top-10 -translate-x-1/2 bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center font-black italic hidden md:flex text-xl shadow-lg ring-4 ring-white">VS</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
                    <div className="space-y-6 text-center md:text-left">
                      <h4 className="text-2xl font-black text-[#EA580C] uppercase italic tracking-tighter">{result.comparison.leftConcept}</h4>
                      <p className="text-base text-gray-700 font-medium">{result.comparison.leftData?.desc}</p>
                      {result.comparison.leftData?.example && (
                        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl text-xs italic text-gray-400 border border-yellow-50 shadow-sm">
                          <span className="font-black text-orange-500 block mb-1 uppercase">EXEMPLO PRÁTICO:</span>
                          {result.comparison.leftData.example}
                        </div>
                      )}
                    </div>
                    <div className="space-y-6 text-center md:text-right">
                      <h4 className="text-2xl font-black text-black uppercase italic tracking-tighter">{result.comparison.rightConcept}</h4>
                      <p className="text-base text-gray-700 font-medium">{result.comparison.rightData?.desc}</p>
                      {result.comparison.rightData?.example && (
                        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl text-xs italic text-gray-400 border border-yellow-50 shadow-sm">
                          <span className="font-black text-black block mb-1 uppercase">EXEMPLO PRÁTICO:</span>
                          {result.comparison.rightData.example}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 sticky top-24 space-y-8">
              
              {/* MENU DE EXPLORAÇÃO DINÂMICA */}
              <div className="bg-white rounded-[45px] p-8 border border-gray-100 shadow-xl">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                   ESCOLHA SEU PRÓXIMO MERGULHO
                </h3>
                <div className="space-y-4">
                  {result.explorationMenu?.map((item: any, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => handleGenerate(item.topic)}
                      className="w-full text-left p-5 rounded-[25px] bg-gray-50 hover:bg-blue-500 hover:text-white transition-all group border border-transparent hover:border-blue-400 shadow-sm"
                    >
                      <p className="font-black text-xs uppercase tracking-tight mb-1 group-hover:text-white transition-colors">{item.topic}</p>
                      <p className="text-[10px] text-gray-400 font-bold group-hover:text-blue-100 leading-tight transition-colors line-clamp-2">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* SALVAR E PRATICAR */}
              <div className="bg-[#0A0F1E] rounded-[45px] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/20 blur-[100px] rounded-full"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4 leading-tight italic uppercase">CONSOLIDAR <span className="text-yellow-400">foco</span></h3>
                  <p className="text-gray-400 text-sm mb-10 leading-relaxed">Transforme este dossiê em um caderno de questões para sua revisão futura.</p>
                  
                  <button 
                    onClick={() => setShowSaveModal(true)}
                    disabled={saved}
                    className={`w-full py-6 rounded-[30px] font-black text-base flex items-center justify-center gap-3 transition-all shadow-xl ${saved ? 'bg-green-500 text-white shadow-green-900/20' : 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-yellow-400/20'}`}
                  >
                    {saved ? (
                      <>
                        CADERNO SALVO!
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </>
                    ) : (
                      <>
                        SALVAR CADERNO
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <SaveToFolderModal 
          folders={folders}
          suggestedName={topic}
          onConfirm={handleConfirmSave}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
};

export default AIView;
