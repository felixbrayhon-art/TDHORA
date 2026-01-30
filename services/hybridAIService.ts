import { generateExamQuestions, generateStudyContent, chatWithFish } from './geminiService';
import { generateExamQuestionsWithOpenRouter, generateStudyContentWithOpenRouter, chatWithOpenRouter } from './openrouterService';
import { StudyProfile } from '../types';

export const generateExamQuestionsHybrid = async (topic: string, numQuestions: number, profile: StudyProfile = 'VESTIBULAR') => {
  try {
    console.log('Tentando gerar questões com Gemini...');
    return await generateExamQuestions(topic, numQuestions, profile);
  } catch (geminiError) {
    console.warn('Gemini falhou, tentando OpenRouter...', geminiError);
    try {
      return await generateExamQuestionsWithOpenRouter(topic, numQuestions, profile);
    } catch (openrouterError) {
      console.error('Ambas as APIs falharam:', openrouterError);
      throw new Error('Não foi possível gerar questões. Tente novamente mais tarde.');
    }
  }
};

export const generateStudyContentHybrid = async (topic: string, technique: string, numQuestions: number, profile: StudyProfile = 'VESTIBULAR') => {
  try {
    console.log('Tentando gerar conteúdo com Gemini...');
    return await generateStudyContent(topic, technique, numQuestions, profile);
  } catch (geminiError) {
    console.warn('Gemini falhou, tentando OpenRouter...', geminiError);
    try {
      return await generateStudyContentWithOpenRouter(topic, numQuestions, profile);
    } catch (openrouterError) {
      console.error('Ambas as APIs falharam:', openrouterError);
      throw new Error('Não foi possível gerar conteúdo. Tente novamente mais tarde.');
    }
  }
};

export const chatWithFishHybrid = async (message: string, history: { role: string, parts: { text: string }[] }[] = [], profile: StudyProfile = 'VESTIBULAR') => {
  try {
    console.log('Tentando chat com Gemini...');
    return await chatWithFish(message, history, profile);
  } catch (geminiError) {
    console.warn('Gemini falhou, tentando OpenRouter...', geminiError);
    try {
      // Converter formato do history para OpenRouter
      const openRouterHistory = history.map(msg => ({
        role: msg.role,
        content: msg.parts[0]?.text || ''
      }));
      return await chatWithOpenRouter(message, openRouterHistory, profile);
    } catch (openrouterError) {
      console.error('Ambas as APIs falharam:', openrouterError);
      throw new Error('Não foi possível processar sua mensagem. Tente novamente mais tarde.');
    }
  }
};
