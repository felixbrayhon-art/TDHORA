
import React, { useState } from 'react';
import { Flashcard } from '../types';

interface FlashcardViewProps {
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  onBack: () => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ flashcards, onBack, setFlashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center animate-in fade-in duration-500">
        <div className="w-full flex justify-between items-center mb-12">
          <button onClick={onBack} className="text-gray-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            VOLTAR AO HUB
          </button>
          <span className="text-gray-300 font-bold tabular-nums">0 / 0</span>
        </div>

        <div className="w-full max-w-2xl aspect-[4/3] border-4 border-dashed border-gray-100 rounded-[60px] flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-black mb-4">Sem cards ainda!</h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm mb-12">
            Use a ferramenta de IA para gerar resumos e criar cards automaticamente.
          </p>
          <button className="bg-yellow-400 text-black px-10 py-5 rounded-[20px] font-black text-lg shadow-xl shadow-yellow-100 hover:scale-105 transition-all">
            GERAR CARDS COM IA
          </button>
        </div>
      </div>
    );
  }

  const current = flashcards[currentIndex];

  return (
    <div className="flex flex-col items-center animate-in fade-in duration-500">
      <div className="w-full flex justify-between items-center mb-12">
        <button onClick={onBack} className="text-gray-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          VOLTAR AO HUB
        </button>
        <span className="text-gray-300 font-bold tabular-nums">{currentIndex + 1} / {flashcards.length}</span>
      </div>

      <div className="w-full max-w-2xl">
        <div 
          onClick={() => setShowAnswer(!showAnswer)}
          className={`aspect-[4/3] rounded-[60px] p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 transform-gpu shadow-2xl ${showAnswer ? 'bg-white text-gray-800 rotate-y-180' : 'bg-blue-50 text-blue-900 border-2 border-blue-100'}`}
        >
          <span className={`uppercase font-bold text-xs tracking-[0.2em] mb-8 ${showAnswer ? 'text-gray-400' : 'text-blue-400'}`}>
            {showAnswer ? 'RESPOSTA' : 'PERGUNTA'}
          </span>
          <h2 className="text-3xl font-bold leading-tight">
            {showAnswer ? current.answer : current.question}
          </h2>
          <p className="mt-12 text-sm opacity-50 uppercase font-bold tracking-widest">
            Tocar para virar
          </p>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <button 
            disabled={currentIndex === 0}
            onClick={() => { setCurrentIndex(i => i - 1); setShowAnswer(false); }}
            className="w-16 h-16 bg-white border border-gray-100 rounded-3xl flex items-center justify-center text-gray-400 disabled:opacity-30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            disabled={currentIndex === flashcards.length - 1}
            onClick={() => { setCurrentIndex(i => i + 1); setShowAnswer(false); }}
            className="w-16 h-16 bg-white border border-gray-100 rounded-3xl flex items-center justify-center text-gray-400 disabled:opacity-30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardView;