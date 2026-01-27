import { QuizQuestion } from "../types";

export interface RealQuestion extends QuizQuestion {
    source: string;
    year: number;
    subject: string;
    board: string;
}

export const REAL_QUESTIONS: RealQuestion[] = [
    // --- MATEMÁTICA E SUAS TECNOLOGIAS ---
    {
        id: "en_mat_1",
        question: "(ENEM) Um produtor de sucos utiliza 2 kg de polpa para cada 5 litros de água. Para produzir 25 litros de suco, mantendo a mesma proporção, quantos kg de polpa ele precisará?",
        options: ["8 kg", "10 kg", "12 kg", "15 kg", "20 kg"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2023,
        subject: "Matemática",
        board: "ENEM"
    },
    {
        id: "en_mat_2",
        question: "(ENEM) Em um gráfico de setores que representa o desempenho de uma turma, a média de notas foi 7.5, a moda foi 8.0 e a mediana 7.0. Isso indica que:",
        options: [
            "A maioria dos alunos tirou nota 7.5.",
            "A nota mais frequente entre os alunos foi 8.0.",
            "O valor central da lista de notas organizada é 7.5.",
            "Não houve notas menores que 7.0.",
            "A soma das notas dividida pelo número de alunos é 8.0."
        ],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2022,
        subject: "Matemática",
        board: "ENEM"
    },
    {
        id: "en_mat_3",
        question: "(ENEM) Um reservatório em formato de cilindro reto possui raio da base igual a 2m e altura de 5m. Qual o volume aproximado de água que ele pode comportar? (Use π = 3)",
        options: ["20 m³", "40 m³", "60 m³", "80 m³", "100 m³"],
        correctAnswer: 2,
        commentary: "",
        source: "ENEM",
        year: 2021,
        subject: "Matemática",
        board: "ENEM"
    },

    // --- LINGUAGENS E CÓDIGOS ---
    {
        id: "en_ling_1",
        question: "(ENEM) Quando um falante utiliza a expressão 'nóis vai' em vez de 'nós vamos', estamos diante de um fenômeno de:",
        options: [
            "Erro gramatical imperdoável.",
            "Variação linguística social ou regional.",
            "Falta de conhecimento da língua portuguesa.",
            "Evolução natural para a extinção do plural.",
            "Metáfora linguística."
        ],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2023,
        subject: "Linguagens",
        board: "ENEM"
    },
    {
        id: "en_ling_2",
        question: "(ENEM) 'O amor é um fogo que arde sem se ver'. Nesta frase de Camões, a principal figura de linguagem presente é:",
        options: ["Antítese", "Metáfora", "Ironia", "Hipérbole", "Eufemismo"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2022,
        subject: "Linguagens",
        board: "ENEM"
    },

    // --- CIÊNCIAS DA NATUREZA ---
    {
        id: "en_nat_1",
        question: "(ENEM) O conceito biológico que define a relação entre seres vivos e o ambiente, focando no fluxo de energia e ciclo de matéria, é:",
        options: ["Genética", "Ecologia", "Fisiologia", "Evolução", "Citologia"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2023,
        subject: "Biologia",
        board: "ENEM"
    },
    {
        id: "en_nat_2",
        question: "(ENEM) Durante a digestão humana, o órgão responsável pela maior parte da absorção de nutrientes para a corrente sanguínea é o:",
        options: ["Estômago", "Intestino Grosso", "Intestino Delgado", "Esôfago", "Fígado"],
        correctAnswer: 2,
        commentary: "",
        source: "ENEM",
        year: 2022,
        subject: "Biologia",
        board: "ENEM"
    },
    {
        id: "en_nat_3",
        question: "(ENEM) Na Química Orgânica, os compostos formados exclusivamente por carbono e hidrogênio são chamados de:",
        options: ["Álcoois", "Hidrocarbonetos", "Ésteres", "Cetonas", "Fenóis"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2021,
        subject: "Química",
        board: "ENEM"
    },
    {
        id: "en_nat_4",
        question: "(ENEM) Um motorista freia bruscamente e os passageiros são jogados para a frente. Esse fenômeno é explicado pela primeira Lei de Newton, também conhecida como:",
        options: ["Ação e Reação", "Inércia", "Princípio Fundamental da Dinâmica", "Gravitação Universal", "Conservação de Energia"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2022,
        subject: "Física",
        board: "ENEM"
    },

    // --- CIÊNCIAS HUMANAS ---
    {
        id: "en_hum_1",
        question: "(ENEM) A Era Vargas (1930-1945) foi marcada por um forte processo de:",
        options: [
            "Descentralização política.",
            "Industrialização e leis trabalhistas.",
            "Retorno ao modelo agrário exportador.",
            "Abertura total ao capital estrangeiro.",
            "Extinção do exército nacional."
        ],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2023,
        subject: "História",
        board: "ENEM"
    },
    {
        id: "en_hum_2",
        question: "(ENEM) O crescimento desordenado das cidades, sem infraestrutura adequada, gerando áreas de risco e desigualdade, é um processo de:",
        options: ["Urbanização planejada", "Macrocefalia urbana", "Gentrificação positiva", "Ruralização moderna", "Sustentabilidade urbana"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2022,
        subject: "Geografia",
        board: "ENEM"
    },
    {
        id: "en_hum_3",
        question: "(ENEM) O conceito de 'Contratualismo' na Filosofia Política busca explicar:",
        options: [
            "A origem divina do poder dos reis.",
            "O acordo racional que fundamenta a sociedade civil e o Estado.",
            "A negação total de qualquer autoridade política.",
            "A superioridade biológica de alguns governantes.",
            "A impossibilidade de viver em comunidade."
        ],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2023,
        subject: "Filosofia",
        board: "ENEM"
    },
    // --- CONCURSOS - QUARTETO FANTÁSTICO ---
    {
        id: "cn_log_1",
        question: "(FCC) Se o gato mia, então o cachorro late. Ora, o cachorro não late. Portanto:",
        options: [
            "O gato mia.",
            "O gato não mia.",
            "O cachorro mia.",
            "O gato late.",
            "O cachorro não late e o gato mia."
        ],
        correctAnswer: 1,
        commentary: "",
        source: "Simulado Geral",
        year: 2023,
        subject: "Raciocínio Lógico",
        board: "FCC"
    },
    {
        id: "cn_adm_1",
        question: "(VUNESP) O atributo do ato administrativo que permite a sua execução direta pela Administração Pública, sem necessidade de intervenção do Judiciário, é a:",
        options: ["Imperatividade", "Tipicidade", "Autoexecutoriedade", "Presunção de legitimidade", "Razoabilidade"],
        correctAnswer: 2,
        commentary: "",
        source: "PC-SP",
        year: 2022,
        subject: "Direito Administrativo",
        board: "VUNESP"
    },
    {
        id: "cn_const_1",
        question: "(FGV) De acordo com o Artigo 5º da Constituição Federal, é CORRETO afirmar que:",
        options: [
            "Ninguém pode ser obrigado a fazer nada, senão em virtude de lei.",
            "A casa é asilo inviolável, mas a polícia pode entrar a qualquer hora sem ordem judicial.",
            "O direito de propriedade é absoluto e nunca pode ser limitado.",
            "A prática do racismo é crime afiançável.",
            "O Estado prestará assistência jurídica gratuita a todos, independente de comprovação de renda."
        ],
        correctAnswer: 0,
        commentary: "",
        source: "OAB/FGV",
        year: 2023,
        subject: "Direito Constitucional",
        board: "FGV"
    },
    {
        id: "cn_info_1",
        question: "(CESPE) O malware que se replica automaticamente em redes de computadores, explorando vulnerabilidades sem a necessidade de interação humana, é o:",
        options: ["Vírus", "Worm", "Trojan", "Spyware", "Ransomware"],
        correctAnswer: 1,
        commentary: "",
        source: "PF",
        year: 2021,
        subject: "Informática",
        board: "CESPE"
    },
    // --- DIREITO PENAL ---
    {
        id: "cn_penal_1",
        question: "(FCC) O crime é considerado consumado quando:",
        options: [
            "O agente apenas pensa em cometer o delito.",
            "O agente inicia a execução, mas não consegue concluir por circunstâncias alheias à sua vontade.",
            "Nele se reúnem todos os elementos de sua definição legal.",
            "O agente desiste voluntariamente de prosseguir na execução.",
            "A vítima perdoa o agente."
        ],
        correctAnswer: 2,
        commentary: "",
        source: "TJ-SP",
        year: 2023,
        subject: "Direito Penal",
        board: "FCC"
    },
    {
        id: "cn_penal_2",
        question: "(VUNESP) A excludente de ilicitude que permite a prática de crime para salvar de perigo atual, que não provocou por sua vontade, direito próprio ou alheio, é o:",
        options: ["Estado de necessidade", "Legítima defesa", "Estrito cumprimento do dever legal", "Exercício regular de direito", "Arrependimento posterior"],
        correctAnswer: 0,
        commentary: "",
        source: "PC-SP",
        year: 2022,
        subject: "Direito Penal",
        board: "VUNESP"
    },
    // --- DIREITO PROCESSUAL PENAL ---
    {
        id: "cn_procpenal_1",
        question: "(CESPE) De acordo com o Código de Processo Penal, a prisão em flagrante pode ocorrer quando o agente:",
        options: [
            "É encontrado, logo depois, com instrumentos que façam presumir ser ele autor da infração.",
            "Apenas é suspeito de ter cometido crime há mais de 30 dias.",
            "Confessa o crime espontaneamente na delegacia.",
            "É denunciado anonimamente.",
            "Está sendo investigado há mais de 6 meses."
        ],
        correctAnswer: 0,
        commentary: "",
        source: "PF",
        year: 2023,
        subject: "Direito Processual Penal",
        board: "CESPE"
    },
    {
        id: "cn_procpenal_2",
        question: "(FGV) O princípio que garante que ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória é o:",
        options: [
            "Princípio da legalidade",
            "Princípio da presunção de inocência",
            "Princípio da ampla defesa",
            "Princípio do contraditório",
            "Princípio da publicidade"
        ],
        correctAnswer: 1,
        commentary: "",
        source: "OAB",
        year: 2023,
        subject: "Direito Processual Penal",
        board: "FGV"
    },
    // --- CONTABILIDADE ---
    {
        id: "cn_cont_1",
        question: "(FCC) O patrimônio líquido de uma empresa é calculado pela diferença entre:",
        options: [
            "Receitas e Despesas",
            "Ativo e Passivo",
            "Capital Social e Reservas",
            "Lucro e Prejuízo",
            "Caixa e Bancos"
        ],
        correctAnswer: 1,
        commentary: "",
        source: "TCE-SP",
        year: 2023,
        subject: "Contabilidade",
        board: "FCC"
    },
    {
        id: "cn_cont_2",
        question: "(CESPE) Na contabilidade, o regime de competência determina que:",
        options: [
            "As receitas e despesas devem ser registradas apenas quando há movimentação financeira.",
            "As receitas e despesas devem ser reconhecidas no período em que ocorrem, independentemente do pagamento.",
            "Apenas as receitas devem ser registradas no momento do recebimento.",
            "As despesas só são reconhecidas após o pagamento efetivo.",
            "O lucro é calculado apenas no final do exercício."
        ],
        correctAnswer: 1,
        commentary: "",
        source: "TCU",
        year: 2022,
        subject: "Contabilidade",
        board: "CESPE"
    },
    // === MAIS QUESTÕES ENEM ===
    {
        id: "en_mat_4",
        question: "(ENEM) Uma loja oferece 20% de desconto em um produto que custa R$ 150,00. Após o desconto, há um acréscimo de 10% de imposto. O valor final do produto é:",
        options: ["R$ 120,00", "R$ 132,00", "R$ 135,00", "R$ 140,00", "R$ 145,00"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2022,
        subject: "Matemática",
        board: "ENEM"
    },
    {
        id: "en_mat_5",
        question: "(ENEM) A probabilidade de, ao lançar um dado comum de 6 faces, obter um número par é:",
        options: ["1/6", "1/3", "1/2", "2/3", "5/6"],
        correctAnswer: 2,
        commentary: "",
        source: "ENEM",
        year: 2023,
        subject: "Matemática",
        board: "ENEM"
    },
    {
        id: "en_ling_3",
        question: "(ENEM) Assinale a alternativa em que a palavra destacada é um pronome relativo: 'A casa QUE comprei é grande.'",
        options: ["Pronome pessoal", "Pronome relativo", "Pronome demonstrativo", "Conjunção", "Advérbio"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2022,
        subject: "Linguagens",
        board: "ENEM"
    },
    {
        id: "en_bio_3",
        question: "(ENEM) A fotossíntese é um processo realizado por plantas que:",
        options: [
            "Consome oxigênio e libera gás carbônico",
            "Consome gás carbônico e libera oxigênio",
            "Não envolve trocas gasosas",
            "Ocorre apenas à noite",
            "Produz energia sem luz"
        ],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2023,
        subject: "Biologia",
        board: "ENEM"
    },
    {
        id: "en_quim_2",
        question: "(ENEM) O número de prótons de um átomo é chamado de:",
        options: ["Número de massa", "Número atômico", "Massa atômica", "Valência", "Eletronegatividade"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2022,
        subject: "Química",
        board: "ENEM"
    },
    {
        id: "en_fis_2",
        question: "(ENEM) A velocidade da luz no vácuo é aproximadamente:",
        options: ["300 m/s", "3.000 m/s", "30.000 km/s", "300.000 km/s", "3.000.000 km/s"],
        correctAnswer: 3,
        commentary: "",
        source: "ENEM",
        year: 2023,
        subject: "Física",
        board: "ENEM"
    },
    {
        id: "en_hist_2",
        question: "(ENEM) A Proclamação da República no Brasil ocorreu em:",
        options: ["1822", "1888", "1889", "1891", "1930"],
        correctAnswer: 2,
        commentary: "",
        source: "ENEM",
        year: 2022,
        subject: "História",
        board: "ENEM"
    },
    {
        id: "en_geo_2",
        question: "(ENEM) O clima predominante na região Norte do Brasil é:",
        options: ["Tropical", "Equatorial", "Subtropical", "Semiárido", "Temperado"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2023,
        subject: "Geografia",
        board: "ENEM"
    },
    {
        id: "en_filo_2",
        question: "(ENEM) O filósofo grego que foi mestre de Platão é:",
        options: ["Aristóteles", "Sócrates", "Tales", "Pitágoras", "Heráclito"],
        correctAnswer: 1,
        commentary: "",
        source: "ENEM",
        year: 2022,
        subject: "Filosofia",
        board: "ENEM"
    },
    // === MAIS QUESTÕES CONCURSOS ===
    {
        id: "cn_port_1",
        question: "(FCC) Assinale a alternativa em que há ERRO de concordância verbal:",
        options: [
            "Fazem dois anos que não o vejo.",
            "Deve haver soluções para o problema.",
            "Houve muitas reclamações.",
            "Existem várias opções.",
            "Aconteceram fatos estranhos."
        ],
        correctAnswer: 0,
        commentary: "",
        source: "TRT",
        year: 2023,
        subject: "Português",
        board: "FCC"
    },
    {
        id: "cn_port_2",
        question: "(CESPE) A crase é OBRIGATÓRIA em:",
        options: [
            "Vou a pé.",
            "Refiro-me a ela.",
            "Fui à praia.",
            "Estou a esperar.",
            "Vou a São Paulo."
        ],
        correctAnswer: 2,
        commentary: "",
        source: "TCU",
        year: 2023,
        subject: "Português",
        board: "CESPE"
    },
    {
        id: "cn_log_2",
        question: "(FCC) Se 'Todo A é B' e 'Algum B é C', então:",
        options: [
            "Todo A é C",
            "Algum A pode ser C",
            "Nenhum A é C",
            "Todo C é A",
            "Nenhuma das alternativas"
        ],
        correctAnswer: 1,
        commentary: "",
        source: "TJ-SP",
        year: 2023,
        subject: "Raciocínio Lógico",
        board: "FCC"
    },
    {
        id: "cn_log_3",
        question: "(CESPE) A negação de 'Todos os alunos passaram' é:",
        options: [
            "Nenhum aluno passou",
            "Todos os alunos reprovaram",
            "Algum aluno não passou",
            "Nenhum aluno reprovou",
            "Alguns alunos passaram"
        ],
        correctAnswer: 2,
        commentary: "",
        source: "PF",
        year: 2022,
        subject: "Raciocínio Lógico",
        board: "CESPE"
    },
    {
        id: "cn_const_2",
        question: "(FCC) São direitos sociais previstos na Constituição Federal:",
        options: [
            "Educação, saúde e lazer",
            "Apenas educação e saúde",
            "Apenas trabalho e moradia",
            "Liberdade e propriedade",
            "Voto e nacionalidade"
        ],
        correctAnswer: 0,
        commentary: "",
        source: "TRF",
        year: 2023,
        subject: "Direito Constitucional",
        board: "FCC"
    },
    {
        id: "cn_const_3",
        question: "(CESPE) O prazo de mandato do Presidente da República é de:",
        options: ["3 anos", "4 anos", "5 anos", "6 anos", "8 anos"],
        correctAnswer: 1,
        commentary: "",
        source: "TCU",
        year: 2022,
        subject: "Direito Constitucional",
        board: "CESPE"
    },
    {
        id: "cn_adm_2",
        question: "(VUNESP) O princípio da impessoalidade na Administração Pública significa que:",
        options: [
            "O administrador pode favorecer amigos",
            "Os atos devem visar o interesse público",
            "A administração pode agir sem transparência",
            "Não há necessidade de concurso público",
            "O servidor pode escolher quem atender"
        ],
        correctAnswer: 1,
        commentary: "",
        source: "TJ-SP",
        year: 2023,
        subject: "Direito Administrativo",
        board: "VUNESP"
    },
    {
        id: "cn_adm_3",
        question: "(FCC) São poderes da Administração Pública:",
        options: [
            "Legislativo, Executivo e Judiciário",
            "Hierárquico, Disciplinar e Regulamentar",
            "Federal, Estadual e Municipal",
            "Público e Privado",
            "Direto e Indireto"
        ],
        correctAnswer: 1,
        commentary: "",
        source: "TCE-SP",
        year: 2022,
        subject: "Direito Administrativo",
        board: "FCC"
    },
    {
        id: "cn_info_2",
        question: "(FCC) No Microsoft Excel, a função SOMA serve para:",
        options: [
            "Multiplicar valores",
            "Dividir valores",
            "Somar valores de células",
            "Subtrair valores",
            "Calcular média"
        ],
        correctAnswer: 2,
        commentary: "",
        source: "TRT",
        year: 2023,
        subject: "Informática",
        board: "FCC"
    },
    {
        id: "cn_info_3",
        question: "(CESPE) A tecla de atalho Ctrl+C no Windows serve para:",
        options: ["Colar", "Copiar", "Recortar", "Salvar", "Imprimir"],
        correctAnswer: 1,
        commentary: "",
        source: "TCU",
        year: 2022,
        subject: "Informática",
        board: "CESPE"
    },
    {
        id: "cn_penal_3",
        question: "(FCC) A pena de reclusão é cumprida em regime:",
        options: [
            "Apenas aberto",
            "Apenas fechado",
            "Fechado, semiaberto ou aberto",
            "Apenas semiaberto",
            "Domiciliar"
        ],
        correctAnswer: 2,
        commentary: "",
        source: "MP-SP",
        year: 2023,
        subject: "Direito Penal",
        board: "FCC"
    },
    {
        id: "cn_penal_4",
        question: "(CESPE) A tentativa de crime ocorre quando:",
        options: [
            "O crime é consumado",
            "Iniciada a execução, não se consuma por circunstâncias alheias à vontade do agente",
            "O agente desiste voluntariamente",
            "Não há dolo",
            "A vítima perdoa"
        ],
        correctAnswer: 1,
        commentary: "",
        source: "PF",
        year: 2022,
        subject: "Direito Penal",
        board: "CESPE"
    },
    {
        id: "cn_procpenal_3",
        question: "(FGV) O habeas corpus é uma garantia constitucional que protege:",
        options: [
            "A propriedade",
            "A liberdade de locomoção",
            "O direito de voto",
            "A liberdade de expressão",
            "O direito à educação"
        ],
        correctAnswer: 1,
        commentary: "",
        source: "OAB",
        year: 2023,
        subject: "Direito Processual Penal",
        board: "FGV"
    },
    {
        id: "cn_cont_3",
        question: "(FCC) O Balanço Patrimonial é composto por:",
        options: [
            "Receitas e Despesas",
            "Ativo, Passivo e Patrimônio Líquido",
            "Apenas Ativo",
            "Apenas Passivo",
            "Lucros e Prejuízos"
        ],
        correctAnswer: 1,
        commentary: "",
        source: "TCM-SP",
        year: 2023,
        subject: "Contabilidade",
        board: "FCC"
    },
    {
        id: "cn_cont_4",
        question: "(CESPE) Depreciação é:",
        options: [
            "Aumento do valor de um bem",
            "Perda de valor de um bem pelo uso ou tempo",
            "Compra de um ativo",
            "Venda de um passivo",
            "Aumento do patrimônio"
        ],
        correctAnswer: 1,
        commentary: "",
        source: "TCU",
        year: 2022,
        subject: "Contabilidade",
        board: "CESPE"
    }
];
