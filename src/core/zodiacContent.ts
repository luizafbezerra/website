import type { WheelSign } from "./wheel";

export type Element = "fogo" | "terra" | "ar" | "água";
export type Modality = "cardinal" | "fixo" | "mutável";

export type ZodiacContent = {
  element: Element;
  modality: Modality;
  ruler: string;
  bodyPart: string;
  archetype: string;
  paragraph: string;
  _isPlaceholder: boolean;
};

export const ZODIAC_CONTENT: Record<WheelSign["id"], ZodiacContent> = {
  aries: {
    element: "fogo",
    modality: "cardinal",
    ruler: "Marte",
    bodyPart: "cabeça",
    archetype: "O iniciador",
    paragraph:
      "Áries marca o impulso que rompe a inércia — a coragem de começar antes de ter certeza. Na escuta analítica, costuma aparecer quando algo na vida pede um ato, não mais uma reflexão.",
    _isPlaceholder: true,
  },
  taurus: {
    element: "terra",
    modality: "fixo",
    ruler: "Vênus",
    bodyPart: "pescoço",
    archetype: "A guardiã",
    paragraph:
      "Touro encarna a fidelidade ao corpo, ao tempo e àquilo que se faz com as mãos. Aparece quando é preciso lembrar que o sentido também mora no peso das coisas — na permanência, no gozo, na lentidão.",
    _isPlaceholder: true,
  },
  gemini: {
    element: "ar",
    modality: "mutável",
    ruler: "Mercúrio",
    bodyPart: "braços e pulmões",
    archetype: "O mensageiro",
    paragraph:
      "Gêmeos é a inteligência que recolhe e devolve, a primeira a notar duas verdades onde se via apenas uma. Convida a sustentar a contradição em vez de resolvê-la depressa.",
    _isPlaceholder: true,
  },
  cancer: {
    element: "água",
    modality: "cardinal",
    ruler: "Lua",
    bodyPart: "peito",
    archetype: "A maternal",
    paragraph:
      "Câncer guarda a memória dos vínculos primeiros — o que nos foi dito, o que nos foi calado, a casa que carregamos por dentro. Surge quando há algo a recolher antes de seguir.",
    _isPlaceholder: true,
  },
  leo: {
    element: "fogo",
    modality: "fixo",
    ruler: "Sol",
    bodyPart: "coração",
    archetype: "O soberano",
    paragraph:
      "Leão é o coração que pede para ser visto, e a coragem de se oferecer sem desculpas. Na análise, marca o ponto em que a vida íntima procura forma própria, voz própria, gesto próprio.",
    _isPlaceholder: true,
  },
  virgo: {
    element: "terra",
    modality: "mutável",
    ruler: "Mercúrio",
    bodyPart: "intestinos",
    archetype: "A artesã",
    paragraph:
      "Virgem é o cuidado exercido no detalhe — a paciência de aparar, ordenar, distinguir o que serve do que apenas pesa. Aparece quando o trabalho interno pede artesania, não impulso.",
    _isPlaceholder: true,
  },
  libra: {
    element: "ar",
    modality: "cardinal",
    ruler: "Vênus",
    bodyPart: "rins",
    archetype: "A diplomata",
    paragraph:
      "Libra busca o ponto em que duas presenças cabem na mesma sala sem que nenhuma se anule. Sua escuta é a do encontro — o desejo de relação que não exige fusão.",
    _isPlaceholder: true,
  },
  scorpio: {
    element: "água",
    modality: "fixo",
    ruler: "Plutão",
    bodyPart: "órgãos íntimos",
    archetype: "O alquimista",
    paragraph:
      "Escorpião desce ao que costuma ficar fora da conversa — o desejo, a perda, o que arde sob a superfície. Aparece quando alguma verdade pede passagem e não admite mais rodeios.",
    _isPlaceholder: true,
  },
  sagittarius: {
    element: "fogo",
    modality: "mutável",
    ruler: "Júpiter",
    bodyPart: "quadris",
    archetype: "O peregrino",
    paragraph:
      "Sagitário caminha em direção ao horizonte — o que dá sentido à travessia, o que faz a vida valer o gesto de levantar-se. Aparece quando a alma reclama um norte, mesmo que provisório.",
    _isPlaceholder: true,
  },
  capricorn: {
    element: "terra",
    modality: "cardinal",
    ruler: "Saturno",
    bodyPart: "ossos e joelhos",
    archetype: "O arquiteto",
    paragraph:
      "Capricórnio constrói no tempo — o ofício, a estrutura, o que se sustenta quando o entusiasmo se cala. Aparece quando é preciso fundar, e não apenas imaginar.",
    _isPlaceholder: true,
  },
  aquarius: {
    element: "ar",
    modality: "fixo",
    ruler: "Urano",
    bodyPart: "tornozelos",
    archetype: "O visionário",
    paragraph:
      "Aquário olha o coletivo a certa distância, e dessa distância nasce a originalidade. Aparece quando algo singular dentro de si precisa de ar para não ser domesticado.",
    _isPlaceholder: true,
  },
  pisces: {
    element: "água",
    modality: "mutável",
    ruler: "Netuno",
    bodyPart: "pés",
    archetype: "A mística",
    paragraph:
      "Peixes dissolve as bordas para que algo maior atravesse — o sonho, a compaixão, o que não se diz em prosa. Aparece quando a vida psíquica pede entrega, não controle.",
    _isPlaceholder: true,
  },
};
