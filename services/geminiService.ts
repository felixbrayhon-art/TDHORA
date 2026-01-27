
import { GoogleGenAI, Type } from "@google/genai";
import { StudyProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const generateStudyContent = async (topic: string, technique: string, numQuestions: number, profile: StudyProfile = 'VESTIBULAR') => {
  const profileContext = profile === 'CONCURSO'
    ? "Foco em editais públicos, doutrina pesada, jurisprudência recente e lei seca. Linguagem técnica e formal."
    : "Foco em ENEM e grandes vestibulares. Relacione com atualidades, use linguagem didática e interdisciplinar.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gere um DOSSIÊ COMPLETO de estudo sobre "${topic}". 
    ${profileContext} 
    
    REQUISITOS DE CONTEÚDO:
    1. executiveSummary: Deve ser longo (mínimo 4 parágrafos), detalhado e estruturado.
    2. deepDive: Uma análise técnica profunda sobre o ponto mais complexo do tema.
    3. explorationMenu: 3 a 4 tópicos específicos relacionados a este tema para o usuário escolher explorar depois.
    
    Não use emojis. Não use formatação com asteriscos.
    
    ESTRUTURA JSON:
    {
      "executiveSummary": "string",
      "deepDive": "string",
      "comparison": {
        "leftConcept": "string",
        "rightConcept": "string",
        "leftData": { "desc": "string", "example": "string" },
        "rightData": { "desc": "string", "example": "string" }
      },
      "explorationMenu": [{"topic": "string", "description": "string"}],
      "quiz": [{"question": "string", "options": ["string"], "correctAnswer": number, "commentary": "string"}],
      "flashcards": [{"question": "string", "answer": "string"}]
    }`,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          deepDive: { type: Type.STRING },
          comparison: {
            type: Type.OBJECT,
            properties: {
              leftConcept: { type: Type.STRING },
              rightConcept: { type: Type.STRING },
              leftData: {
                type: Type.OBJECT,
                properties: { desc: { type: Type.STRING }, example: { type: Type.STRING } },
                required: ["desc", "example"]
              },
              rightData: {
                type: Type.OBJECT,
                properties: { desc: { type: Type.STRING }, example: { type: Type.STRING } },
                required: ["desc", "example"]
              }
            },
            required: ["leftConcept", "rightConcept", "leftData", "rightData"]
          },
          explorationMenu: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["topic", "description"]
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER },
                commentary: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "commentary"]
            }
          },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } },
              required: ["question", "answer"]
            }
          }
        },
        required: ["executiveSummary", "deepDive", "comparison", "explorationMenu", "quiz", "flashcards"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateExamQuestions = async (topic: string, numQuestions: number, profile: StudyProfile = 'VESTIBULAR') => {
  const profileStyle = profile === 'CONCURSO'
    ? "estilo Concursos Públicos de alto nível (FCC/CESPE/FGV), complexas, baseadas em doutrina, jurisprudência e lei seca."
    : "estilo ENEM/FUVEST, baseadas em interpretação, contextualização e conceitos fundamentais.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gere um simulado de questões ${profileStyle} sobre "${topic}". As questões devem ser de múltipla escolha (A a E). 
    Não use emojis. Não use formatação de texto com asteriscos.
    Inclua obrigatoriamente um "commentary" detalhado explicando por que a alternativa correta é a certa e por que as outras estão erradas.`,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 5, maxItems: 5 },
                correctAnswer: { type: Type.INTEGER },
                commentary: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "commentary"]
            }
          }
        },
        required: ["questions"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const chatWithFish = async (message: string, history: { role: string, parts: { text: string }[] }[], profile: StudyProfile = 'VESTIBULAR') => {
  const profileTone = profile === 'CONCURSO'
    ? "O usuário está estudando para concursos. Use referências a editais e carreira pública quando apropriado."
    : "O usuário está estudando para vestibulares/ENEM. Use referências a universidade e futuro acadêmico quando apropriado.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: `Você é o 'Peixe de Estudo' do app TDAH ORA. Sua missão é ser um companheiro de estudos amigável, incentivador e direto para estudantes com TDAH. ${profileTone} Regras: 1. Explique conceitos complexos de forma visual e simples (usando analogias). 2. Seja conciso; evite blocos gigantes de texto. 3. NÃO use emojis em hipótese alguma. 4. NÃO use asteriscos (*** ou **) para formatar o texto. 5. Se o usuário disser que esqueceu algo, explique em 3 pontos rápidos. 6. Ajude com revisões relâmpago. 7. Mantenha o tom de 'estamos juntos nessa'.`,
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
    }
  });
  return response.text;
};

/**
 * Extrai questões estruturadas de texto de PDF
 */
export const extractQuestionsFromPDF = async (
  pdfText: string,
  metadata: { subject?: string; board?: string; year?: number; source?: string }
) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `Você é um especialista em extrair questões de provas. Analise o texto abaixo e extraia TODAS as questões de múltipla escolha encontradas.

TEXTO DA PROVA:
${pdfText}

Para cada questão encontrada, retorne um JSON com:
- question: o enunciado completo da questão
- options: array com as 5 alternativas (A, B, C, D, E)
- correctAnswer: índice da resposta correta (0-4), ou null se não souber
- subject: matéria/assunto da questão (ex: "Matemática", "Português")

Retorne APENAS um array JSON válido, sem explicações adicionais.
Formato: [{"question": "...", "options": [...], "correctAnswer": 0, "subject": "..."}]`,
    config: {
      temperature: 0.3,
      responseMimeType: 'application/json'
    }
  });

  const questions = JSON.parse(response.text);

  // Adiciona metadata e IDs únicos
  return questions.map((q: any, idx: number) => ({
    id: `pdf_${Date.now()}_${idx}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer ?? 0,
    commentary: '',
    subject: q.subject || metadata.subject || 'Geral',
    board: metadata.board || 'Importado',
    source: metadata.source || 'PDF Importado',
    year: metadata.year || new Date().getFullYear()
  }));
};

/**
 * Gera questões personalizadas a partir de material de estudo
 */
export const generateQuestionsFromMaterial = async (
  materialText: string,
  difficulty: 'fácil' | 'médio' | 'difícil' = 'médio',
  quantity: number = 10
) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `Você é um professor especialista. Analise o material de estudo abaixo e crie ${quantity} questões de múltipla escolha de nível ${difficulty}.

MATERIAL:
${materialText.substring(0, 15000)}

Para cada questão, retorne um JSON com:
- question: enunciado claro e direto
- options: array com 5 alternativas
- correctAnswer: índice da resposta correta (0-4)
- explanation: breve explicação da resposta

Retorne APENAS um array JSON válido.
Formato: [{"question": "...", "options": [...], "correctAnswer": 0, "explanation": "..."}]`,
    config: {
      temperature: 0.4,
      responseMimeType: 'application/json'
    }
  });

  const questions = JSON.parse(response.text);
  return questions.map((q: any, idx: number) => ({
    id: `mat_${Date.now()}_${idx}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    commentary: q.explanation || ''
  }));
};

/**
 * Gera resumo automático do material
 */
export const generateMaterialSummary = async (materialText: string, maxLength: number = 500) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `Crie um resumo conciso e objetivo do seguinte material de estudo. O resumo deve ter no máximo ${maxLength} palavras e destacar os pontos principais.

MATERIAL:
${materialText.substring(0, 20000)}

RESUMO:`,
    config: {
      temperature: 0.3
    }
  });

  return response.text;
};

/**
 * Gera mapa mental hierárquico do conteúdo
 */
export const generateMindMap = async (materialText: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `Analise o material abaixo e crie um mapa mental hierárquico dos conceitos principais.

MATERIAL:
${materialText.substring(0, 15000)}

Retorne um JSON com a estrutura do mapa mental:
- id: identificador único
- label: nome do conceito
- description: breve descrição (1 linha)
- children: array de sub-conceitos (mesma estrutura)
- level: nível hierárquico (0 = raiz)

Crie no máximo 3 níveis de profundidade.
Retorne APENAS o JSON, sem explicações.
Formato: {"id": "root", "label": "Tema Principal", "description": "...", "level": 0, "children": [...]}`,
    config: {
      temperature: 0.3,
      responseMimeType: 'application/json'
    }
  });

  return JSON.parse(response.text);
};

/**
 * Gera flashcards para revisão rápida
 */
export const generateFlashcards = async (materialText: string, quantity: number = 20) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `Crie ${quantity} flashcards para revisão do seguinte material. Cada flashcard deve ter uma pergunta direta e uma resposta concisa.

MATERIAL:
${materialText.substring(0, 15000)}

Retorne um array JSON com:
- question: pergunta objetiva
- answer: resposta clara e direta (máximo 2 linhas)

Retorne APENAS o array JSON.
Formato: [{"question": "...", "answer": "..."}]`,
    config: {
      temperature: 0.4,
      responseMimeType: 'application/json'
    }
  });

  const flashcards = JSON.parse(response.text);
  return flashcards.map((f: any, idx: number) => ({
    id: `flash_${Date.now()}_${idx}`,
    question: f.question,
    answer: f.answer
  }));
};

export const generateQuestionCommentary = async (question: string, options: string[], correctAnswer: number, profile: StudyProfile = 'VESTIBULAR') => {
  const profileTone = profile === 'CONCURSO'
    ? "Foco em concursos (doutrina, lei seca, técnica)."
    : "Foco em vestibulares/ENEM (contextualização, didática).";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Comente esta questão real de prova. 
    QUESTÃO: ${question}
    ALTERNATIVAS: ${options.join(' | ')}
    RESPOSTA CORRETA: Opção ${correctAnswer} (${options[correctAnswer]})

    ${profileTone}
    Explique por que a resposta está correta e por que as outras estão erradas de forma clara e direta para um estudante com TDAH. Não use emojis. Não use asteriscos.`,
    config: {
      temperature: 0.5,
    }
  });
  return response.text;
};
