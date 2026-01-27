import React, { useState } from 'react';
import { StudyMaterial, Flashcard } from '../types';

interface MaterialViewerProps {
    material: StudyMaterial;
    onBack: () => void;
}

const MaterialViewer: React.FC<MaterialViewerProps> = ({ material, onBack }) => {
    const [activeTab, setActiveTab] = useState<'summary' | 'questions' | 'flashcards' | 'mindmap'>('summary');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
    const [flashcardFlipped, setFlashcardFlipped] = useState(false);

    const currentQuestion = material.questions?.[currentQuestionIdx];
    const currentFlashcard = material.flashcards?.[currentFlashcardIdx];

    const renderMindMap = (node: any, level: number = 0) => {
        return (
            <div key={node.id} className={`${level > 0 ? 'ml-8 mt-4' : ''}`}>
                <div className={`p-4 rounded-2xl ${level === 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' :
                        level === 1 ? 'bg-blue-50 border-2 border-blue-200' :
                            'bg-gray-50 border border-gray-200'
                    }`}>
                    <p className={`font-black ${level === 0 ? 'text-xl' : 'text-sm'}`}>{node.label}</p>
                    {node.description && (
                        <p className={`text-xs mt-1 ${level === 0 ? 'text-blue-100' : 'text-gray-600'}`}>{node.description}</p>
                    )}
                </div>
                {node.children && node.children.length > 0 && (
                    <div className="space-y-2">
                        {node.children.map((child: any) => renderMindMap(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-1 mx-6">
                        <h1 className="text-3xl font-black text-gray-800">{material.title}</h1>
                        <p className="text-sm text-gray-400 font-bold mt-1">{material.fileName}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-3xl p-2 shadow-sm mb-8 flex gap-2">
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all ${activeTab === 'summary' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        RESUMO
                    </button>
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all ${activeTab === 'questions' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        QUESTÕES ({material.questions?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('flashcards')}
                        className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all ${activeTab === 'flashcards' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        FLASHCARDS ({material.flashcards?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('mindmap')}
                        className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all ${activeTab === 'mindmap' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        MAPA MENTAL
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-[40px] p-10 shadow-sm">
                    {activeTab === 'summary' && (
                        <div className="prose max-w-none">
                            <h2 className="text-2xl font-black text-gray-800 mb-6">Resumo Automático</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{material.summary}</p>
                        </div>
                    )}

                    {activeTab === 'questions' && currentQuestion && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-black text-gray-400 uppercase">
                                    Questão {currentQuestionIdx + 1} de {material.questions?.length}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1));
                                            setSelectedAnswer(null);
                                            setShowAnswer(false);
                                        }}
                                        disabled={currentQuestionIdx === 0}
                                        className="px-4 py-2 bg-gray-100 rounded-xl font-bold text-sm disabled:opacity-30"
                                    >
                                        ← Anterior
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCurrentQuestionIdx(Math.min((material.questions?.length || 1) - 1, currentQuestionIdx + 1));
                                            setSelectedAnswer(null);
                                            setShowAnswer(false);
                                        }}
                                        disabled={currentQuestionIdx === (material.questions?.length || 1) - 1}
                                        className="px-4 py-2 bg-gray-100 rounded-xl font-bold text-sm disabled:opacity-30"
                                    >
                                        Próxima →
                                    </button>
                                </div>
                            </div>

                            <p className="text-lg font-bold text-gray-800">{currentQuestion.question}</p>

                            <div className="space-y-3">
                                {currentQuestion.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedAnswer(idx)}
                                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedAnswer === idx
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="font-bold text-gray-800">{String.fromCharCode(65 + idx)}) {opt}</span>
                                    </button>
                                ))}
                            </div>

                            {selectedAnswer !== null && (
                                <button
                                    onClick={() => setShowAnswer(true)}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all"
                                >
                                    VER RESPOSTA
                                </button>
                            )}

                            {showAnswer && (
                                <div className={`p-6 rounded-3xl ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50' : 'bg-red-50'
                                    }`}>
                                    <p className={`font-black mb-2 ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correto!' : '✗ Incorreto'}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Resposta correta:</strong> {String.fromCharCode(65 + currentQuestion.correctAnswer)}) {currentQuestion.options[currentQuestion.correctAnswer]}
                                    </p>
                                    {currentQuestion.commentary && (
                                        <p className="text-sm text-gray-600 mt-2">{currentQuestion.commentary}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'flashcards' && currentFlashcard && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-black text-gray-400 uppercase">
                                    Flashcard {currentFlashcardIdx + 1} de {material.flashcards?.length}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setCurrentFlashcardIdx(Math.max(0, currentFlashcardIdx - 1));
                                            setFlashcardFlipped(false);
                                        }}
                                        disabled={currentFlashcardIdx === 0}
                                        className="px-4 py-2 bg-gray-100 rounded-xl font-bold text-sm disabled:opacity-30"
                                    >
                                        ← Anterior
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCurrentFlashcardIdx(Math.min((material.flashcards?.length || 1) - 1, currentFlashcardIdx + 1));
                                            setFlashcardFlipped(false);
                                        }}
                                        disabled={currentFlashcardIdx === (material.flashcards?.length || 1) - 1}
                                        className="px-4 py-2 bg-gray-100 rounded-xl font-bold text-sm disabled:opacity-30"
                                    >
                                        Próximo →
                                    </button>
                                </div>
                            </div>

                            <div
                                onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                                className="min-h-[300px] bg-gradient-to-br from-purple-500 to-blue-500 rounded-[40px] p-10 flex items-center justify-center cursor-pointer hover:shadow-2xl transition-all"
                            >
                                <div className="text-center text-white">
                                    <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-70">
                                        {flashcardFlipped ? 'RESPOSTA' : 'PERGUNTA'}
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {flashcardFlipped ? currentFlashcard.answer : currentFlashcard.question}
                                    </p>
                                    <p className="text-xs mt-6 opacity-70">Clique para virar</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'mindmap' && material.mindMap && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-gray-800 mb-6">Mapa Mental</h2>
                            {renderMindMap(material.mindMap)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaterialViewer;
