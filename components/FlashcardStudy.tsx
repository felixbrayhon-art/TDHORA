import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';

interface FlashcardStudyProps {
  flashcards: Flashcard[];
  onBack: () => void;
}

interface StudySession {
  cardId: string;
  reviewedAt: number;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: number;
  interval: number;
  repetitions: number;
}

const FlashcardStudy: React.FC<FlashcardStudyProps> = ({ flashcards, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    remaining: 0
  });
  const [isComplete, setIsComplete] = useState(false);

  // Carregar sessões de estudo anteriores
  useEffect(() => {
    const saved = localStorage.getItem('flashcardStudySessions');
    if (saved) {
      setStudySessions(JSON.parse(saved));
    }
  }, []);

  // Salvar sessões de estudo
  useEffect(() => {
    localStorage.setItem('flashcardStudySessions', JSON.stringify(studySessions));
  }, [studySessions]);

  // Calcular cards para revisão usando algoritmo SM-2 simplificado
  const getCardsForReview = () => {
    const now = Date.now();
    return flashcards.filter(card => {
      const session = studySessions.find(s => s.cardId === card.id);
      if (!session) return true; // Cards nunca estudados
      
      return now >= session.nextReview;
    });
  };

  const cardsToReview = getCardsForReview();

  useEffect(() => {
    setSessionStats({
      total: studySessions.filter(s => s.reviewedAt > Date.now() - 24 * 60 * 60 * 1000).length,
      easy: studySessions.filter(s => s.difficulty === 'easy' && s.reviewedAt > Date.now() - 24 * 60 * 60 * 1000).length,
      medium: studySessions.filter(s => s.difficulty === 'medium' && s.reviewedAt > Date.now() - 24 * 60 * 60 * 1000).length,
      hard: studySessions.filter(s => s.difficulty === 'hard' && s.reviewedAt > Date.now() - 24 * 60 * 60 * 1000).length,
      remaining: cardsToReview.length
    });
  }, [studySessions, cardsToReview]);

  const calculateNextReview = (session: StudySession, difficulty: 'easy' | 'medium' | 'hard') => {
    let { interval, repetitions } = session;
    let newInterval = interval;
    let newRepetitions = repetitions;

    if (difficulty === 'easy') {
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * 2.5);
      }
      newRepetitions = repetitions + 1;
    } else if (difficulty === 'medium') {
      if (repetitions === 0) {
        newInterval = 1;
      } else {
        newInterval = Math.round(interval * 1.3);
      }
      newRepetitions = repetitions + 1;
    } else { // hard
      newInterval = 1;
      newRepetitions = 0;
    }

    return {
      nextReview: Date.now() + newInterval * 24 * 60 * 60 * 1000, // Convert to milliseconds
      interval: newInterval,
      repetitions: newRepetitions
    };
  };

  const handleDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    const currentCard = cardsToReview[currentIndex];
    const existingSession = studySessions.find(s => s.cardId === currentCard.id);
    
    const newSession: StudySession = {
      cardId: currentCard.id,
      reviewedAt: Date.now(),
      difficulty,
      nextReview: Date.now(),
      interval: 1,
      repetitions: 0
    };

    if (existingSession) {
      const { nextReview, interval, repetitions } = calculateNextReview(existingSession, difficulty);
      newSession.nextReview = nextReview;
      newSession.interval = interval;
      newSession.repetitions = repetitions;
    }

    setStudySessions([...studySessions.filter(s => s.cardId !== currentCard.id), newSession]);
    setShowAnswer(false);

    if (currentIndex < cardsToReview.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsComplete(false);
  };

  if (cardsToReview.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Parabéns!</h2>
          <p className="text-gray-600 mb-6">Você não tem cards para revisar agora. Volte mais tarde!</p>
          <button
            onClick={onBack}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sessão Completa!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-gray-600">Fácil: <span className="font-semibold text-green-600">{sessionStats.easy}</span></p>
            <p className="text-gray-600">Médio: <span className="font-semibold text-yellow-600">{sessionStats.medium}</span></p>
            <p className="text-gray-600">Difícil: <span className="font-semibold text-red-600">{sessionStats.hard}</span></p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={resetSession}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Estudar Novamente
            </button>
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cardsToReview[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Estudo com Flashcards</h1>
            <p className="text-gray-600">Card {currentIndex + 1} de {cardsToReview.length}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Sessão de hoje</div>
            <div className="text-lg font-semibold text-blue-600">{sessionStats.total} cards</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cardsToReview.length) * 100}%` }}
          />
        </div>

        {/* Flashcard */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {currentCard.topic || 'Geral'}
            </span>
          </div>
          
          <div 
            onClick={() => setShowAnswer(!showAnswer)}
            className={`min-h-[200px] flex flex-col items-center justify-center text-center cursor-pointer rounded-xl p-8 transition-all duration-500 ${
              showAnswer 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200' 
                : 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200'
            }`}
          >
            <div className={`text-sm font-semibold mb-4 uppercase tracking-wider ${
              showAnswer ? 'text-green-600' : 'text-blue-600'
            }`}>
              {showAnswer ? 'RESPOSTA' : 'PERGUNTA'}
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
              {showAnswer ? currentCard.answer : currentCard.question}
            </h2>
            
            <div className="mt-6 text-sm text-gray-500">
              {showAnswer ? 'Clique para ver a pergunta' : 'Clique para ver a resposta'}
            </div>
          </div>
        </div>

        {/* Difficulty Buttons */}
        {showAnswer && (
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleDifficulty('hard')}
              className="bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="text-2xl mb-1">😰</div>
              <div>Difícil</div>
              <div className="text-xs opacity-75">Rever em 1 dia</div>
            </button>
            
            <button
              onClick={() => handleDifficulty('medium')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="text-2xl mb-1">🤔</div>
              <div>Médio</div>
              <div className="text-xs opacity-75">Rever em poucos dias</div>
            </button>
            
            <button
              onClick={() => handleDifficulty('easy')}
              className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="text-2xl mb-1">😊</div>
              <div>Fácil</div>
              <div className="text-xs opacity-75">Rever em mais dias</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardStudy;
