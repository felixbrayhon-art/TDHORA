import { REAL_QUESTIONS } from './services/realQuestions';

console.log('=== TESTE DO BANCO DE QUESTÕES REAIS ===');
console.log('Total de questões:', REAL_QUESTIONS.length);
console.log('\nMatérias disponíveis:');
const subjects = [...new Set(REAL_QUESTIONS.map(q => q.subject))];
subjects.forEach(s => {
    const count = REAL_QUESTIONS.filter(q => q.subject === s).length;
    console.log(`  - ${s}: ${count} questões`);
});

console.log('\nBancas disponíveis:');
const boards = [...new Set(REAL_QUESTIONS.map(q => q.board))];
boards.forEach(b => {
    const count = REAL_QUESTIONS.filter(q => q.board === b).length;
    console.log(`  - ${b}: ${count} questões`);
});

console.log('\n=== TESTE DE FILTRAGEM ===');
const testFilter = (subject: string, board: string) => {
    const filtered = REAL_QUESTIONS.filter(q => {
        const matchSubject = subject === 'Todas' || q.subject === subject;
        const matchBoard = board === 'Todas' || q.board === board;
        return matchSubject && matchBoard;
    });
    console.log(`Filtro: ${subject} + ${board} = ${filtered.length} questões`);
};

testFilter('Todas', 'Todas');
testFilter('Matemática', 'ENEM');
testFilter('Direito Administrativo', 'VUNESP');
