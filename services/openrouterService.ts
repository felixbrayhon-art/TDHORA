import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY
});

export const generateContentWithOpenRouter = async (prompt: string, systemPrompt?: string) => {
  try {
    const messages = [];
    
    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt
      });
    }
    
    messages.push({
      role: "user",
      content: prompt
    });

    const response = await (openrouter as any).chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages,
      temperature: 0.7,
      max_tokens: 4000
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Erro na OpenRouter:', error);
    throw error;
  }
};

export const generateExamQuestionsWithOpenRouter = async (topic: string, numQuestions: number, profile: string = 'VESTIBULAR') => {
  const profileStyle = profile === 'CONCURSO'
    ? "estilo Concursos Públicos de alto nível (FCC/CESPE/FGV), complexas, baseadas em doutrina, jurisprudência e lei seca."
    : "estilo ENEM/FUVEST, baseadas em interpretação, contextualização e conceitos fundamentais.";

  const prompt = `Gere EXATAMENTE ${numQuestions} questões ${profileStyle} sobre "${topic}". As questões devem ser de múltipla escolha (A a E).

IMPORTANTE: O array "questions" DEVE conter exatamente ${numQuestions} questões, nem mais nem menos.

Não use emojis. Não use formatação de texto com asteriscos.
Inclua obrigatoriamente um "commentary" detalhado explicando por que a alternativa correta é a certa e por que as outras estão erradas.

Responda APENAS com o JSON no seguinte formato:
{
  "questions": [
    {
      "question": "texto da questão",
      "options": ["alternativa A", "alternativa B", "alternativa C", "alternativa D", "alternativa E"],
      "correctAnswer": 0,
      "commentary": "explicação detalhada"
    }
  ]
}`;

  try {
    const response = await generateContentWithOpenRouter(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Resposta não contém JSON válido');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.questions || parsed.questions.length !== numQuestions) {
      throw new Error(`Número incorreto de questões. Esperado: ${numQuestions}, Recebido: ${parsed.questions?.length || 0}`);
    }
    
    return parsed;
  } catch (error) {
    console.error('Erro ao gerar questões com OpenRouter:', error);
    throw error;
  }
};

export const generateStudyContentWithOpenRouter = async (topic: string, numQuestions: number, profile: string = 'VESTIBULAR') => {
  const profileContext = profile === 'CONCURSO'
    ? "Foco em concursos públicos, com linguagem formal e técnica."
    : "Foco em vestibulares, com linguagem acessível e didática.";

  const prompt = `Gere um DOSSIÊ COMPLETO de estudo sobre "${topic}" com exatamente ${numQuestions} questões no quiz.
${profileContext}

REQUISITOS DE CONTEÚDO:
1. executiveSummary: Deve ser longo (mínimo 4 parágrafos), detalhado e estruturado.
2. deepDive: Uma análise técnica profunda sobre o ponto mais complexo do tema.
3. explorationMenu: 3 a 4 tópicos específicos relacionados a este tema para o usuário escolher explorar depois.
4. quiz: DEVE conter exatamente ${numQuestions} questões.
5. flashcards: Gere ${Math.max(8, numQuestions * 2)} flashcards para revisão.

IMPORTANTE: O array "quiz" deve ter EXATAMENTE ${numQuestions} questões, nem mais nem menos.

Não use emojis. Não use formatação com asteriscos.

Responda APENAS com o JSON no seguinte formato:
{
  "executiveSummary": "resumo executivo detalhado",
  "deepDive": "análise profunda",
  "explorationMenu": ["tópico 1", "tópico 2", "tópico 3"],
  "quiz": [
    {
      "question": "texto da questão",
      "options": ["A", "B", "C", "D", "E"],
      "correctAnswer": 0,
      "commentary": "explicação"
    }
  ],
  "flashcards": [
    {
      "question": "pergunta",
      "answer": "resposta"
    }
  ]
}`;

  try {
    const response = await generateContentWithOpenRouter(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Resposta não contém JSON válido');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.quiz || parsed.quiz.length !== numQuestions) {
      throw new Error(`Número incorreto de questões. Esperado: ${numQuestions}, Recebido: ${parsed.quiz?.length || 0}`);
    }
    
    return parsed;
  } catch (error) {
    console.error('Erro ao gerar conteúdo com OpenRouter:', error);
    throw error;
  }
};

export const chatWithOpenRouter = async (message: string, history: { role: string, content: string }[] = [], profile: string = 'VESTIBULAR') => {
  const profileTone = profile === 'CONCURSO'
    ? "Você é um especialista em concursos públicos, com linguagem formal e técnica."
    : "Você é um especialista em vestibulares, com linguagem acessível e didática.";

  const messages = [
    {
      role: "system",
      content: `${profileTone} Responda de forma clara, objetiva e útil. Use formatação markdown quando necessário.`
    },
    ...history.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: "user",
      content: message
    }
  ];

  try {
    const response = await (openrouter as any).chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Erro no chat com OpenRouter:', error);
    throw error;
  }
};
