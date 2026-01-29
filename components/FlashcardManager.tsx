import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';

interface FlashcardManagerProps {
  onBack: () => void;
  onFlashcardsChange: (flashcards: Flashcard[]) => void;
}

const FlashcardManager: React.FC<FlashcardManagerProps> = ({ onBack, onFlashcardsChange }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [newCard, setNewCard] = useState({ question: '', answer: '', topic: '' });
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('todos');

  // Carregar flashcards do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('flashcards');
    if (saved) {
      setFlashcards(JSON.parse(saved));
    }
  }, []);

  // Salvar flashcards no localStorage
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
      onFlashcardsChange(flashcards);
    }
  }, [flashcards, onFlashcardsChange]);

  const topics = Array.from(new Set(flashcards.map(card => card.topic))).filter(Boolean);

  const filteredCards = flashcards.filter(card => {
    const matchesSearch = card.question.toLowerCase().includes(filter.toLowerCase()) ||
                         card.answer.toLowerCase().includes(filter.toLowerCase());
    const matchesTopic = selectedTopic === 'todos' || card.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const addCard = () => {
    if (newCard.question && newCard.answer) {
      const card: Flashcard = {
        id: `card_${Date.now()}`,
        question: newCard.question,
        answer: newCard.answer,
        topic: newCard.topic || 'Geral'
      };
      setFlashcards([...flashcards, card]);
      setNewCard({ question: '', answer: '', topic: '' });
    }
  };

  const updateCard = (id: string, updates: Partial<Flashcard>) => {
    setFlashcards(flashcards.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
    setEditingCard(null);
  };

  const deleteCard = (id: string) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  };

  const importCards = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imported = JSON.parse(e.target?.result as string);
            setFlashcards([...flashcards, ...imported]);
          } catch (error) {
            alert('Erro ao importar arquivo. Verifique o formato.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const exportCards = () => {
    const dataStr = JSON.stringify(filteredCards, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `flashcards_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Flashcards</h1>
          <div className="flex gap-2">
            <button
              onClick={importCards}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Importar
            </button>
            <button
              onClick={exportCards}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Exportar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Total de Cards</h3>
            <p className="text-3xl font-bold text-blue-600">{flashcards.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Tópicos</h3>
            <p className="text-3xl font-bold text-purple-600">{topics.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Filtrados</h3>
            <p className="text-3xl font-bold text-green-600">{filteredCards.length}</p>
          </div>
        </div>

        {/* Add New Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Adicionar Novo Flashcard</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Pergunta"
              value={newCard.question}
              onChange={(e) => setNewCard({...newCard, question: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Resposta"
              value={newCard.answer}
              onChange={(e) => setNewCard({...newCard, answer: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Tópico (opcional)"
              value={newCard.topic}
              onChange={(e) => setNewCard({...newCard, topic: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addCard}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Adicionar Card
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Buscar cards..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os tópicos</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              {editingCard === card.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={card.question}
                    onChange={(e) => updateCard(card.id, { question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={card.answer}
                    onChange={(e) => updateCard(card.id, { answer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={card.topic}
                    onChange={(e) => updateCard(card.id, { topic: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCard(null)}
                      className="flex-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingCard(null)}
                      className="flex-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {card.topic || 'Geral'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{card.question}</h3>
                  <p className="text-gray-600 text-sm mb-4">{card.answer}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCard(card.id)}
                      className="flex-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="flex-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum flashcard encontrado</p>
            <p className="text-gray-400 mt-2">Adicione novos cards ou ajuste os filtros</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardManager;
