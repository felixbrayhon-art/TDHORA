export interface RoadmapTopic {
    title: string;
    description: string;
}

export interface RoadmapArea {
    area: string;
    description: string;
    topics: RoadmapTopic[];
}

export const CONCURSOS_ROADMAP: RoadmapArea[] = [
    {
        area: "O Quarteto Fantástico",
        description: "As matérias que caem em quase 90% das provas de concursos.",
        topics: [
            { title: "Língua Portuguesa", description: "Foco em Gramática (Crase, Concordância e Regência) e Interpretação." },
            { title: "Raciocínio Lógico", description: "Proposições, conectivos (E, OU, SE... ENTÃO) e diagramas lógicos." },
            { title: "Direito Administrativo", description: "Atos administrativos, Licitações e Poderes do Estado." },
            { title: "Direito Constitucional", description: "Direitos e Garantias Fundamentais (Artigo 5º da CF)." }
        ]
    },
    {
        area: "Informática",
        description: "Essencial para provas administrativas e de tribunais.",
        topics: [
            { title: "Segurança da Informação", description: "Vírus, Phishing, Firewall e ataques comuns." },
            { title: "Pacote Office/LibreOffice", description: "Fórmulas de Excel/Calc e formatação de texto." },
            { title: "Navegadores e Correio Eletrônico", description: "Funcionalidades e protocolos de e-mail." }
        ]
    },
    {
        area: "Matérias Específicas",
        description: "Conteúdo focado na área de atuação do cargo.",
        topics: [
            { title: "Área Administrativa", description: "Redação Oficial e Arquivologia." },
            { title: "Área de Tribunais", description: "Processo Civil e Processo Penal." },
            { title: "Área Bancária", description: "Conhecimentos Bancários e Matemática Financeira." }
        ]
    }
];
