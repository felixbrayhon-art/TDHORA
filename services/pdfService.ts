import * as pdfjsLib from 'pdfjs-dist';
import { RealQuestion } from './realQuestions';

// Configurar worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PDFMetadata {
    subject?: string;
    board?: string;
    year?: number;
    source?: string;
}

/**
 * Extrai texto de um arquivo PDF
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
        fullText += pageText + '\n\n';
    }

    return fullText;
};

/**
 * Limpa e formata o texto extraído
 */
export const cleanExtractedText = (text: string): string => {
    return text
        .replace(/\s+/g, ' ') // Remove espaços múltiplos
        .replace(/\n{3,}/g, '\n\n') // Remove quebras de linha excessivas
        .trim();
};

/**
 * Valida se o PDF contém questões
 */
export const validatePDFContent = (text: string): boolean => {
    // Procura por padrões comuns em provas
    const patterns = [
        /questão|questao/i,
        /\b[A-E]\)/g, // Alternativas
        /gabarito/i,
        /\d+\s*[-.)]/g // Numeração de questões
    ];

    return patterns.some(pattern => pattern.test(text));
};
