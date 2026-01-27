import React, { useState } from 'react';
import { extractTextFromPDF, validatePDFContent, PDFMetadata } from '../services/pdfService';
import { extractQuestionsFromPDF } from '../services/geminiService';
import { RealQuestion } from '../services/realQuestions';
import LoadingFish from './LoadingFish';

interface PDFUploadModalProps {
    onClose: () => void;
    onQuestionsExtracted: (questions: RealQuestion[]) => void;
}

const PDFUploadModal: React.FC<PDFUploadModalProps> = ({ onClose, onQuestionsExtracted }) => {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [extractedQuestions, setExtractedQuestions] = useState<RealQuestion[]>([]);
    const [metadata, setMetadata] = useState<PDFMetadata>({
        subject: '',
        board: '',
        year: new Date().getFullYear(),
        source: ''
    });
    const [step, setStep] = useState<'upload' | 'metadata' | 'preview'>('upload');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleProcess = async () => {
        if (!file) return;

        setProcessing(true);
        try {
            const text = await extractTextFromPDF(file);

            if (!validatePDFContent(text)) {
                alert('Este PDF não parece conter questões de prova. Tente outro arquivo.');
                setProcessing(false);
                return;
            }

            const questions = await extractQuestionsFromPDF(text, metadata);
            setExtractedQuestions(questions);
            setStep('preview');
        } catch (error) {
            console.error(error);
            alert('Erro ao processar PDF. Verifique se o arquivo está correto.');
        } finally {
            setProcessing(false);
        }
    };

    const handleConfirm = () => {
        onQuestionsExtracted(extractedQuestions);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-black italic uppercase">Importar PDF</h2>
                            <p className="text-blue-100 text-sm font-medium mt-1">Extraia questões automaticamente com IA</p>
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
                    {processing ? (
                        <div className="text-center py-20">
                            <LoadingFish />
                            <p className="text-gray-600 font-bold mt-4">Processando PDF com IA...</p>
                            <p className="text-gray-400 text-sm mt-2">Isso pode levar alguns segundos</p>
                        </div>
                    ) : step === 'upload' ? (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-blue-400 transition-all">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                                <label htmlFor="pdf-upload" className="cursor-pointer">
                                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-black text-gray-800">Clique para selecionar PDF</p>
                                    <p className="text-sm text-gray-400 mt-1">ou arraste e solte aqui</p>
                                </label>
                            </div>

                            {file && (
                                <div className="bg-blue-50 p-6 rounded-3xl">
                                    <p className="text-sm font-black text-blue-600 uppercase tracking-widest mb-2">Arquivo Selecionado</p>
                                    <p className="font-bold text-gray-800">{file.name}</p>
                                    <button
                                        onClick={() => setStep('metadata')}
                                        className="mt-4 w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all"
                                    >
                                        CONTINUAR →
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : step === 'metadata' ? (
                        <div className="space-y-6">
                            <p className="text-gray-600 font-medium">Adicione informações sobre a prova (opcional)</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Matéria</label>
                                    <input
                                        type="text"
                                        value={metadata.subject || ''}
                                        onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                                        placeholder="Ex: Matemática"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Banca</label>
                                    <input
                                        type="text"
                                        value={metadata.board || ''}
                                        onChange={(e) => setMetadata({ ...metadata, board: e.target.value })}
                                        placeholder="Ex: ENEM, FCC"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Ano</label>
                                    <input
                                        type="number"
                                        value={metadata.year || ''}
                                        onChange={(e) => setMetadata({ ...metadata, year: parseInt(e.target.value) })}
                                        placeholder="2024"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Fonte</label>
                                    <input
                                        type="text"
                                        value={metadata.source || ''}
                                        onChange={(e) => setMetadata({ ...metadata, source: e.target.value })}
                                        placeholder="Ex: Prova Oficial"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep('upload')}
                                    className="flex-1 py-4 text-gray-400 font-black text-sm hover:text-gray-600 transition-all"
                                >
                                    ← VOLTAR
                                </button>
                                <button
                                    onClick={handleProcess}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-black text-sm hover:shadow-xl transition-all"
                                >
                                    PROCESSAR COM IA
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-green-50 p-6 rounded-3xl">
                                <p className="text-sm font-black text-green-600 uppercase tracking-widest">✓ Extração Concluída</p>
                                <p className="text-gray-800 font-bold mt-1">{extractedQuestions.length} questões encontradas</p>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {extractedQuestions.map((q, idx) => (
                                    <div key={q.id} className="bg-gray-50 p-6 rounded-3xl">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Questão {idx + 1}</p>
                                        <p className="font-bold text-gray-800 mb-3">{q.question.substring(0, 100)}...</p>
                                        <div className="flex gap-2 text-xs">
                                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold">{q.subject}</span>
                                            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-bold">{q.board}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep('metadata')}
                                    className="flex-1 py-4 text-gray-400 font-black text-sm hover:text-gray-600 transition-all"
                                >
                                    ← VOLTAR
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-black text-sm hover:shadow-xl transition-all"
                                >
                                    ADICIONAR {extractedQuestions.length} QUESTÕES
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PDFUploadModal;
