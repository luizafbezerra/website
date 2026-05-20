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

export type NakshatraRef = {
  name: string;
  range?: string;
  deity: string;
  ruler: string;
  symbol: string;
  motif: string;
};

export type VedicContent = {
  nakshatras: NakshatraRef[];
  paragraph: string;
  _isPlaceholder: boolean;
};

export const VEDIC_CONTENT: Record<WheelSign["id"], VedicContent> = {
  aries: {
    nakshatras: [
      {
        name: "Ashwini",
        deity: "Ashwini Kumaras",
        ruler: "Ketu",
        symbol: "cabeça de cavalo",
        motif: "O início, a partida, a viagem que cura.",
      },
      {
        name: "Bharani",
        deity: "Yama",
        ruler: "Vênus",
        symbol: "yoni",
        motif: "O portal — o que carrega, sustém, dá passagem.",
      },
      {
        name: "Krittika",
        range: "primeiro pada",
        deity: "Agni",
        ruler: "Sol",
        symbol: "lâmina",
        motif: "A chama que separa e revela.",
      },
    ],
    paragraph:
      "A faixa de Áries acolhe o impulso ardente das Ashwini Kumaras, a passagem grave de Bharani e a primeira centelha de Krittika — três modos de inaugurar, antes que Touro assente o que foi começado.",
    _isPlaceholder: true,
  },
  taurus: {
    nakshatras: [
      {
        name: "Krittika",
        range: "padas 2–4",
        deity: "Agni",
        ruler: "Sol",
        symbol: "lâmina",
        motif: "A faísca que se faz brasa, lavrando o que dura.",
      },
      {
        name: "Rohini",
        deity: "Brahma",
        ruler: "Lua",
        symbol: "carruagem",
        motif: "O viço que floresce — beleza encarnada, presença sustentada.",
      },
      {
        name: "Mrigashira",
        range: "padas 1–2",
        deity: "Soma",
        ruler: "Marte",
        symbol: "cabeça de cervo",
        motif: "A busca delicada, o passo que fareja o caminho.",
      },
    ],
    paragraph:
      "Em Touro a chama de Krittika ganha terra, Rohini desabrocha em forma e Mrigashira começa a procurar — três gestos pelos quais o impulso ariano se aquieta em corpo, antes que Gêmeos o transforme em pergunta.",
    _isPlaceholder: true,
  },
  gemini: {
    nakshatras: [
      {
        name: "Mrigashira",
        range: "padas 3–4",
        deity: "Soma",
        ruler: "Marte",
        symbol: "cabeça de cervo",
        motif: "A busca que se afina, atenta a cada rastro.",
      },
      {
        name: "Ardra",
        deity: "Rudra",
        ruler: "Rahu",
        symbol: "gota",
        motif: "A lágrima que dissolve — o que se rompe para que algo novo passe.",
      },
      {
        name: "Punarvasu",
        range: "padas 1–3",
        deity: "Aditi",
        ruler: "Júpiter",
        symbol: "aljava",
        motif: "O retorno luminoso, a casa reencontrada.",
      },
    ],
    paragraph:
      "Gêmeos prolonga a busca de Mrigashira, atravessa a tempestade de Ardra e começa a refazer-se em Punarvasu — três tempos da inteligência que pergunta, perde e retorna, antes que Câncer recolha a resposta.",
    _isPlaceholder: true,
  },
  cancer: {
    nakshatras: [
      {
        name: "Punarvasu",
        range: "último pada",
        deity: "Aditi",
        ruler: "Júpiter",
        symbol: "aljava",
        motif: "O lar finalmente encontrado, antes da pausa.",
      },
      {
        name: "Pushya",
        deity: "Brihaspati",
        ruler: "Saturno",
        symbol: "flor de lótus",
        motif: "O alimento, o cuidado, a flor que se oferece.",
      },
      {
        name: "Ashlesha",
        deity: "Nagas",
        ruler: "Mercúrio",
        symbol: "serpente enrolada",
        motif: "O abraço que envolve — sabedoria sinuosa, profundidade da serpente.",
      },
    ],
    paragraph:
      "Em Câncer Punarvasu chega à casa, Pushya nutre o que ali habita e Ashlesha desce ao que mora abaixo — três modos de recolher, antes que Leão queira ser visto.",
    _isPlaceholder: true,
  },
  leo: {
    nakshatras: [
      {
        name: "Magha",
        deity: "Pitris",
        ruler: "Ketu",
        symbol: "trono",
        motif: "O trono dos ancestrais, a linhagem que sustenta o gesto.",
      },
      {
        name: "Purva Phalguni",
        deity: "Bhaga",
        ruler: "Vênus",
        symbol: "rede",
        motif: "O leito do prazer, o repouso após o triunfo.",
      },
      {
        name: "Uttara Phalguni",
        range: "primeiro pada",
        deity: "Aryaman",
        ruler: "Sol",
        symbol: "leito",
        motif: "A aliança que prossegue o que foi celebrado.",
      },
    ],
    paragraph:
      "Leão recebe a herança de Magha, o gozo de Purva Phalguni e o primeiro pacto de Uttara Phalguni — três tempos pelos quais o coração toma forma própria, antes que Virgem apare o que sobra.",
    _isPlaceholder: true,
  },
  virgo: {
    nakshatras: [
      {
        name: "Uttara Phalguni",
        range: "padas 2–4",
        deity: "Aryaman",
        ruler: "Sol",
        symbol: "leito",
        motif: "A aliança trabalhada no detalhe — fidelidade que se exerce.",
      },
      {
        name: "Hasta",
        deity: "Savitar",
        ruler: "Lua",
        symbol: "mão aberta",
        motif: "A mão hábil, o gesto que mede e oferece.",
      },
      {
        name: "Chitra",
        range: "padas 1–2",
        deity: "Tvashtar",
        ruler: "Marte",
        symbol: "joia",
        motif: "A joia que começa a brilhar — beleza que se faz ofício.",
      },
    ],
    paragraph:
      "Virgem continua a aliança de Uttara Phalguni, ganha a mão de Hasta e começa a polir a joia de Chitra — três modos de cuidar do que existe, antes que Libra o leve ao encontro.",
    _isPlaceholder: true,
  },
  libra: {
    nakshatras: [
      {
        name: "Chitra",
        range: "padas 3–4",
        deity: "Tvashtar",
        ruler: "Marte",
        symbol: "joia",
        motif: "A joia revelada — beleza que se mostra ao outro.",
      },
      {
        name: "Swati",
        deity: "Vayu",
        ruler: "Rahu",
        symbol: "junco ao vento",
        motif: "Autonomia leve — a dança do contato sem aderência.",
      },
      {
        name: "Vishakha",
        range: "padas 1–3",
        deity: "Indra-Agni",
        ruler: "Júpiter",
        symbol: "arco triunfal",
        motif: "A meta partilhada, o arco erguido entre dois.",
      },
    ],
    paragraph:
      "Libra desdobra o brilho de Chitra, abre o espaço de Swati e ergue o arco de Vishakha — três gestos pelos quais a relação se constitui, antes que Escorpião desça ao que ali pulsa.",
    _isPlaceholder: true,
  },
  scorpio: {
    nakshatras: [
      {
        name: "Vishakha",
        range: "último pada",
        deity: "Indra-Agni",
        ruler: "Júpiter",
        symbol: "arco triunfal",
        motif: "A meta que aprofunda — o arco já não basta.",
      },
      {
        name: "Anuradha",
        deity: "Mitra",
        ruler: "Saturno",
        symbol: "cajado florido",
        motif: "A amizade fiel, a devoção que persiste no escuro.",
      },
      {
        name: "Jyeshtha",
        deity: "Indra",
        ruler: "Mercúrio",
        symbol: "amuleto",
        motif: "A mais velha — autoridade nascida da travessia.",
      },
    ],
    paragraph:
      "Escorpião herda o arco de Vishakha, sustenta a devoção de Anuradha e atravessa a noite de Jyeshtha — três tempos pelos quais a intimidade chega ao fundo, antes que Sagitário procure um horizonte.",
    _isPlaceholder: true,
  },
  sagittarius: {
    nakshatras: [
      {
        name: "Mula",
        deity: "Nirriti",
        ruler: "Ketu",
        symbol: "raiz amarrada",
        motif: "A raiz arrancada — o que sobra quando nada mais se sustenta.",
      },
      {
        name: "Purva Ashadha",
        deity: "Apas",
        ruler: "Vênus",
        symbol: "leque",
        motif: "A primeira vitória, a peneira que separa o essencial.",
      },
      {
        name: "Uttara Ashadha",
        range: "primeiro pada",
        deity: "Vishvedevas",
        ruler: "Sol",
        symbol: "presa de elefante",
        motif: "A vitória definitiva começando a se firmar.",
      },
    ],
    paragraph:
      "Sagitário desentranha a raiz de Mula, conquista a passagem de Purva Ashadha e ergue o primeiro passo de Uttara Ashadha — três tempos da busca por sentido, antes que Capricórnio funde o que se descobriu.",
    _isPlaceholder: true,
  },
  capricorn: {
    nakshatras: [
      {
        name: "Uttara Ashadha",
        range: "padas 2–4",
        deity: "Vishvedevas",
        ruler: "Sol",
        symbol: "presa de elefante",
        motif: "A vitória que se faz obra — triunfo enraizado no tempo.",
      },
      {
        name: "Shravana",
        deity: "Vishnu",
        ruler: "Lua",
        symbol: "orelha",
        motif: "A escuta — três passos de Vishnu, o que se aprende ouvindo.",
      },
      {
        name: "Dhanishta",
        range: "padas 1–2",
        deity: "Vasus",
        ruler: "Marte",
        symbol: "tambor",
        motif: "O tambor que mede o trabalho, ritmo de quem constrói.",
      },
    ],
    paragraph:
      "Capricórnio funda a vitória de Uttara Ashadha, escuta em Shravana e marca o passo em Dhanishta — três modos de erguer no tempo, antes que Aquário olhe tudo de longe.",
    _isPlaceholder: true,
  },
  aquarius: {
    nakshatras: [
      {
        name: "Dhanishta",
        range: "padas 3–4",
        deity: "Vasus",
        ruler: "Marte",
        symbol: "tambor",
        motif: "O tambor que excede o ofício — ritmo do coletivo.",
      },
      {
        name: "Shatabhisha",
        deity: "Varuna",
        ruler: "Rahu",
        symbol: "círculo",
        motif: "Os mil remédios, o círculo dos que curam pela distância.",
      },
      {
        name: "Purva Bhadrapada",
        range: "padas 1–3",
        deity: "Aja Ekapada",
        ruler: "Júpiter",
        symbol: "espada dupla",
        motif: "A chama de dois gumes, o fogo que purifica.",
      },
    ],
    paragraph:
      "Aquário leva o tambor de Dhanishta ao coletivo, reúne os curadores de Shatabhisha e ergue a flama de Purva Bhadrapada — três modos de servir a um todo, antes que Peixes dissolva as bordas.",
    _isPlaceholder: true,
  },
  pisces: {
    nakshatras: [
      {
        name: "Purva Bhadrapada",
        range: "último pada",
        deity: "Aja Ekapada",
        ruler: "Júpiter",
        symbol: "espada dupla",
        motif: "A chama dupla, agora voltada para dentro.",
      },
      {
        name: "Uttara Bhadrapada",
        deity: "Ahirbudhnya",
        ruler: "Saturno",
        symbol: "serpente das águas",
        motif: "Sabedoria que repousa no fundo, o sono profundo das águas.",
      },
      {
        name: "Revati",
        deity: "Pushan",
        ruler: "Mercúrio",
        symbol: "peixe",
        motif: "O peixe que conduz à outra margem — última passagem do ciclo.",
      },
    ],
    paragraph:
      "Peixes recolhe a chama de Purva Bhadrapada, mergulha com Uttara Bhadrapada e atravessa a margem com Revati — três tempos pelos quais o ciclo se entrega, antes que Áries recomece.",
    _isPlaceholder: true,
  },
};
