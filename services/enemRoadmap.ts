export interface RoadmapTopic {
    title: string;
    description: string;
}

export interface RoadmapArea {
    area: string;
    description: string;
    topics: RoadmapTopic[];
}

export const ENEM_ROADMAP: RoadmapArea[] = [
    {
        area: "Matemática e suas Tecnologias",
        description: "O peso da Matemática costuma ser o que mais alavanca a nota final junto com a Redação.",
        topics: [
            { title: "Razão, Proporção e Porcentagem", description: "Regra de três é a rainha da prova." },
            { title: "Estatística", description: "Leitura de gráficos, média, moda e mediana." },
            { title: "Geometria (Plana e Espacial)", description: "Cálculo de áreas e volumes." },
            { title: "Funções", description: "Principalmente 1º e 2º graus." }
        ]
    },
    {
        area: "Linguagens e Códigos",
        description: "Foco total em leitura e interpretação.",
        topics: [
            { title: "Leitura e Interpretação de Texto", description: "Representa 80% da prova." },
            { title: "Variação Linguística", description: "Como a língua muda conforme a região e classe social." },
            { title: "Figuras de Linguagem", description: "Metáfora, antítese, ironia, etc." }
        ]
    },
    {
        area: "Ciências da Natureza",
        description: "Ecologia e Química Orgânica são fundamentais.",
        topics: [
            { title: "Ecologia", description: "É o tema que mais cai em Biologia." },
            { title: "Genética e Fisiologia Humana", description: "Temas recorrentes em Biologia." },
            { title: "Química Orgânica e Estequiometria", description: "Cálculos e estruturas químicas." },
            { title: "Meio Ambiente (Química)", description: "Impactos e reações ambientais." },
            { title: "Mecânica, Óptica e Ondulatória", description: "Os pilares da Física no ENEM." }
        ]
    },
    {
        area: "Ciências Humanas",
        description: "Brasil Colônia e Era Vargas são chaves em História.",
        topics: [
            { title: "Brasil Colônia, Era Vargas e Ditadura", description: "Principais períodos da História do Brasil." },
            { title: "Questões Ambientais e Urbanização", description: "Foco principal em Geografia." },
            { title: "Agronegócio", description: "Impactos econômicos e sociais na Geografia." },
            { title: "Ética e Direitos Humanos", description: "Base da Filosofia e Sociologia." },
            { title: "Contratualismo", description: "Teoria política essencial." }
        ]
    }
];
