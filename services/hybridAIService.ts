import { generateExamQuestionsWithOpenRouter, generateStudyContentWithOpenRouter, chatWithOpenRouter } from './openrouterService';
import { StudyProfile } from '../types';

export const generateExamQuestionsHybrid = async (topic: string, numQuestions: number, profile: StudyProfile = 'VESTIBULAR') => {
  try {
    console.log('Gerando questões com OpenRouter...');
    return await generateExamQuestionsWithOpenRouter(topic, numQuestions, profile);
  } catch (openrouterError) {
    console.error('OpenRouter falhou:', openrouterError);
    throw new Error('Não foi possível gerar questões. Tente novamente mais tarde.');
  }
};

export const generateStudyContentHybrid = async (topic: string, technique: string, numQuestions: number, profile: StudyProfile = 'VESTIBULAR') => {
  try {
    console.log('Gerando conteúdo com OpenRouter...');
    return await generateStudyContentWithOpenRouter(topic, numQuestions, profile);
  } catch (openrouterError) {
    console.error('OpenRouter falhou:', openrouterError);
    throw new Error('Não foi possível gerar conteúdo. Tente novamente mais tarde.');
  }
};

export const chatWithFishHybrid = async (message: string, history: { role: string, parts: { text: string }[] }[] = [], profile: StudyProfile = 'VESTIBULAR') => {
  try {
    console.log('Chat com OpenRouter...');
    // Converter formato do history para OpenRouter
    const openRouterHistory = history.map(msg => ({
      role: msg.role,
      content: msg.parts[0]?.text || ''
    }));
    return await chatWithOpenRouter(message, openRouterHistory, profile);
  } catch (openrouterError) {
    console.error('OpenRouter falhou:', openrouterError);
    throw new Error('Não foi possível processar sua mensagem. Tente novamente mais tarde.');
  }
};
