import React, { useState, useEffect } from 'react';
import { StudyMaterial } from '../types';
import { getAllMaterials, deleteMaterial } from '../services/studyMaterialService';
import MaterialUploadModal from './MaterialUploadModal';

interface StudyMaterialHubProps {
    onBack: () => void;
    onViewMaterial: (material: StudyMaterial) => void;
}

const StudyMaterialHub: React.FC<StudyMaterialHubProps> = ({ onBack, onViewMaterial }) => {
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = () => {
        setMaterials(getAllMaterials());
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este material?')) {
            deleteMaterial(id);
            loadMaterials();
        }
    };

    const filteredMaterials = materials.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={onBack}
                        className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-4xl font-black italic uppercase text-gray-800">Meus Materiais</h1>
                    <div className="w-12 h-12" />
                </div>

                {/* Search and Upload */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar materiais..."
                        className="flex-1 bg-white rounded-3xl px-6 py-4 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                    />
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-3xl font-black text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        ADICIONAR MATERIAL
                    </button>
                </div>
            </div>

            {/* Materials Grid */}
            <div className="max-w-7xl mx-auto">
                {filteredMaterials.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-bold text-lg">Nenhum material encontrado</p>
                        <p className="text-gray-300 text-sm mt-2">Adicione seu primeiro PDF de estudo!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMaterials.map((material) => (
                            <div
                                key={material.id}
                                className="bg-white rounded-[40px] p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                                onClick={() => onViewMaterial(material)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(material.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 w-10 h-10 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center text-red-500 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                <h3 className="font-black text-gray-800 text-lg mb-2 line-clamp-2">{material.title}</h3>
                                <p className="text-xs text-gray-400 font-bold mb-4">{material.fileName}</p>

                                {material.summary && (
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{material.summary}</p>
                                )}

                                <div className="flex gap-2 flex-wrap">
                                    {material.questions && material.questions.length > 0 && (
                                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                                            {material.questions.length} questões
                                        </span>
                                    )}
                                    {material.flashcards && material.flashcards.length > 0 && (
                                        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold">
                                            {material.flashcards.length} flashcards
                                        </span>
                                    )}
                                    {material.mindMap && (
                                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                                            Mapa mental
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showUploadModal && (
                <MaterialUploadModal
                    onClose={() => setShowUploadModal(false)}
                    onMaterialSaved={() => {
                        loadMaterials();
                        setShowUploadModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default StudyMaterialHub;
