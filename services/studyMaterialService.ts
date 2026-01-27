import { StudyMaterial, Flashcard } from '../types';

const STORAGE_KEY = 'studyMaterials';

/**
 * Salva um material de estudo no localStorage
 */
export const saveMaterial = (material: StudyMaterial): void => {
    const materials = getAllMaterials();
    const index = materials.findIndex(m => m.id === material.id);

    if (index >= 0) {
        materials[index] = material;
    } else {
        materials.push(material);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
};

/**
 * Recupera todos os materiais salvos
 */
export const getAllMaterials = (): StudyMaterial[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
        const materials = JSON.parse(stored);
        // Converter strings de data de volta para Date objects
        return materials.map((m: any) => ({
            ...m,
            uploadDate: new Date(m.uploadDate)
        }));
    } catch {
        return [];
    }
};

/**
 * Recupera um material específico por ID
 */
export const getMaterialById = (id: string): StudyMaterial | null => {
    const materials = getAllMaterials();
    return materials.find(m => m.id === id) || null;
};

/**
 * Remove um material
 */
export const deleteMaterial = (id: string): void => {
    const materials = getAllMaterials();
    const filtered = materials.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Busca materiais por tag ou título
 */
export const searchMaterials = (query: string): StudyMaterial[] => {
    const materials = getAllMaterials();
    const lowerQuery = query.toLowerCase();

    return materials.filter(m =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        m.subject?.toLowerCase().includes(lowerQuery)
    );
};

/**
 * Atualiza apenas as questões de um material
 */
export const updateMaterialQuestions = (id: string, questions: any[]): void => {
    const material = getMaterialById(id);
    if (material) {
        material.questions = questions;
        saveMaterial(material);
    }
};

/**
 * Atualiza apenas o mapa mental de um material
 */
export const updateMaterialMindMap = (id: string, mindMap: any): void => {
    const material = getMaterialById(id);
    if (material) {
        material.mindMap = mindMap;
        saveMaterial(material);
    }
};

/**
 * Atualiza apenas os flashcards de um material
 */
export const updateMaterialFlashcards = (id: string, flashcards: Flashcard[]): void => {
    const material = getMaterialById(id);
    if (material) {
        material.flashcards = flashcards;
        saveMaterial(material);
    }
};
