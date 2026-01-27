import React, { useState } from 'react';
import { extractTextFromPDF } from '../services/pdfService';
import { generateQuestionsFromMaterial, generateMaterialSummary, generateMindMap, generateFlashcards } from '../services/geminiService';
import { saveMaterial } from '../services/studyMaterialService';
import { StudyMaterial } from '../types';
import LoadingFish from './LoadingFish';

interface MaterialUploadModalProps {
    onClose: () => void;
    onMaterialSaved: () => void;
}

const MaterialUploadModal: React.FC<MaterialUploadModalProps> = ({ onClose, onMaterialSaved }) => {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState<'upload' | 'processing' | 'preview'>('upload');
    const [material, setMaterial] = useState<Partial<StudyMaterial>>({});
    const [processingStatus, setProcessingStatus] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleProcess = async () => {
        if (!file) return;

        setProcessing(true);
        setStep('processing');

        try {
            // 1. Extrair texto
            setProcessingStatus('Extraindo texto do PDF...');
            const text = await extractTextFromPDF(file);

            // 2. Gerar resumo (REDUZIDO: 300 → 200 palavras)
            setProcessingStatus('Gerando resumo automático...');
            const summary = await generateMaterialSummary(text, 200);

            // 3. Gerar questões (REDUZIDO: 15 → 8 questões)
            setProcessingStatus('Criando questões personalizadas...');
            const questions = await generateQuestionsFromMaterial(text, 'médio', 8);

            // 4. Gerar mapa mental
            setProcessingStatus('Montando mapa mental...');
            const mindMap = await generateMindMap(text);

            // 5. Gerar flashcards (REDUZIDO: 25 → 12 flashcards)
            setProcessingStatus('Preparando flashcards...');
            const flashcards = await generateFlashcards(text, 12);

            const newMaterial: StudyMaterial = {
                id: `mat_${Date.now()}`,
                title: file.name.replace('.pdf', ''),
                fileName: file.name,
                uploadDate: new Date(),
                content: text,
                summary,
                questions,
                mindMap,
                flashcards,
                tags: [],
                subject: ''
            };

            setMaterial(newMaterial);
            setStep('preview');
        } catch (error) {
            console.error(error);
            alert('Erro ao processar material. Tente novamente.');
            setStep('upload');
        } finally {
            setProcessing(false);
        }
    };

    const mindMap = await generateMindMap(text);

    // 5. Gerar flashcards
    setProcessingStatus('Preparando flashcards...');
    const flashcards = await generateFlashcards(text, 25);

    const newMaterial: StudyMaterial = {
        id: `mat_${Date.now()}`,
        title: file.name.replace('.pdf', ''),
        fileName: file.name,
        uploadDate: new Date(),
        content: text,
        summary,
        questions,
        mindMap,
        flashcards,
        tags: [],
        subject: ''
    };

    setMaterial(newMaterial);
    setStep('preview');
} catch (error) {
    console.error(error);
    alert('Erro ao processar material. Tente novamente.');
    setStep('upload');
} finally {
    setProcessing(false);
}
    };

const handleSave = () => {
    if (material.id) {
        saveMaterial(material as StudyMaterial);
        onMaterialSaved();
    }
};

return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase">Adicionar Material</h2>
                        <p className="text-blue-100 text-sm font-medium mt-1">IA vai analisar e criar conteúdo automaticamente</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                {step === 'upload' && (
                    <div className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-blue-400 transition-all">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="material-upload"
                            />
                            <label htmlFor="material-upload" className="cursor-pointer">
                                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-black text-gray-800">Selecione um PDF</p>
                                <p className="text-sm text-gray-400 mt-1">Apostila, livro, resumo ou qualquer material de estudo</p>
                            </label>
                        </div>

                        {file && (
                            <div className="bg-blue-50 p-6 rounded-3xl">
                                <p className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">Arquivo Selecionado</p>
                                <p className="font-bold text-gray-800 mb-4">{file.name}</p>
                                <button
                                    onClick={handleProcess}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-black text-sm hover:shadow-xl transition-all"
                                >
                                    PROCESSAR COM IA →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 'processing' && (
                    <div className="text-center py-20">
                        <LoadingFish />
                        <p className="text-gray-800 font-black text-xl mt-6">{processingStatus}</p>
                        <p className="text-gray-400 text-sm mt-2">Isso pode levar alguns minutos...</p>
                    </div>
                )}

                {step === 'preview' && material && (
                    <div className="space-y-6">
                        <div className="bg-green-50 p-6 rounded-3xl">
                            <p className="text-sm font-black text-green-600 uppercase tracking-widest">✓ Processamento Concluído</p>
                            <p className="text-gray-800 font-bold mt-1">{material.title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-6 rounded-3xl">
                                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Questões</p>
                                <p className="text-3xl font-black text-gray-800">{material.questions?.length || 0}</p>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-3xl">
                                <p className="text-xs font-black text-purple-600 uppercase tracking-widest mb-2">Flashcards</p>
                                <p className="text-3xl font-black text-gray-800">{material.flashcards?.length || 0}</p>
                            </div>
                        </div>

                        {material.summary && (
                            <div className="bg-gray-50 p-6 rounded-3xl">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Resumo Automático</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{material.summary}</p>
                            </div>
                        )}

                        <button
                            onClick={handleSave}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-black text-sm hover:shadow-xl transition-all"
                        >
                            SALVAR MATERIAL
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
);
};

export default MaterialUploadModal;
