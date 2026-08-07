# Exportação de conteúdo — agosto de 2026

Snapshot textual do CMS **antes** da reconstrução CONCEPT v3 (`plan/architecture-site-restructure-1.md`,
TASK-001). Gerado por `pnpm export:content` a partir do banco conectado no momento da execução.

Serve a dois propósitos: preservar a cópia que a Luiza escreveu antes do `migrate:fresh` destrutivo
(RISK-003) e alimentar os defaults de seed dos novos globais de página (TASK-026).

Campos vazios, IDs, datas de sistema e derivados de upload são omitidos. Textos ricos aparecem
achatados em parágrafos.

> **Pendência manual:** valores editados apenas em produção vivem na conta Neon da Luiza, inacessível
> daqui. Antes da migração destrutiva, confira no `/admin` de produção os campos que sabemos divergir
> dos defaults do código (ex.: CRP gravado, seções ativas da home) e cole-os abaixo, em "Ajustes de
> produção".

## Ajustes de produção

_Preencher manualmente a partir do `/admin` de produção._

## Globais

### Configurações — `settings`

- **identity**
  - **fullName**: Luiza Fernandes Bezerra
  - **shortName**: Luiza Bezerra
  - **role**: Psicóloga clínica
  - **tradition**: Análise junguiana
- **nap**
  - **city**: Guarulhos
  - **region**: São Paulo
  - **country**: Brasil
  - **countryCode**: BR
- **contact**
  - **phoneE164**: +5511964158128
  - **phoneDisplay**: +55 11 96415-8128
  - **email**: luizafbezerra@gmail.com
  - **instagramUrl**: https://www.instagram.com/simbolos.do.self/
  - **instagramHandle**: @simbolos.do.self
- **siteName**: Luiza Fernandes Bezerra — Psicóloga
- **tagline**: Psicoterapia para adultos na tradição da psicologia analítica de C. G. Jung — presencial em Guarulhos e online em todo o Brasil.
- **chrome**
  - **headerByline**: psicóloga · análise junguiana
  - **footerByline**: psicóloga clínica
- **description**: Psicóloga clínica em Guarulhos. Análise junguiana para ansiedade, relações e propósito. Atendimento online e presencial.

### Estrutura da página — `home`

- **sections**
  - _1._
    - **type**: pillars
    - **enabled**: true
  - _2._
    - **type**: about
    - **enabled**: true
  - _3._
    - **type**: cosmos
    - **enabled**: true
  - _4._
    - **type**: voices
    - **enabled**: true
  - _5._
    - **type**: writing
    - **enabled**: true
  - _6._
    - **type**: symbols
    - **enabled**: true
  - _7._
    - **type**: contact
    - **enabled**: true
- **navExtraLinks**
  - _1._
    - **label**: Escrita
    - **href**: /blog

### Início (hero) — `home-hero`

- **subtitle**: Para a vida adulta
- **lead**: Atendo adultos em momentos em que a vida cotidiana já não dá conta do que está acontecendo: uma ansiedade que não passa, um luto recente, um trabalho que perdeu o sentido. Escuto o que insiste e o que ainda não encontrou palavras.
- **ctaPrimaryLabel**: marcar uma conversa
- **ctaSecondaryLabel**: conhecer a abordagem antes

### Como trabalho — `home-pillars`

- **eyebrow**: Como trabalho
- **heading**: O que se repete costuma ter algo a dizer.
- **intro**
  - Tomo a sério o que se manifesta em sonhos, fantasias, imagens e sintomas. Não são ruído: são as maneiras pelas quais a psique fala sobre o que ainda não cabe em palavras.
  - Não removo sintomas, trabalho o fortalecimento do seu ego para que esses sintomas não sejam necessários um dia. A clínica analítica não trabalha para eliminar sintomas, lidamos com a psicologia profunda.
  - Como fazemos isso? Através da conscientização das próprias emoções, da personalidade, do momento de vida, como se reage às tristezas e felicidades da própria existência. Aliado a isso, o trabalho de forma consistente, através de encontros semanais.
  - Gosto de dizer que a psicologia clínica é o trabalho mais “anti capitalista” que existe, pois o que é oferecido não traz uma solução rápida tampouco indolor. Por uma questão ética, o conteúdo dos encontros são ditados pelo paciente, de acordo com aquilo que ele está preparado para trazer.
  - Eu só farei pontuações daquilo que acredito que você esteja preparado para receber, respeitando o tempo do seu processo e a sua subjetividade. Não existe pressa no processo de individuação.
- **note**: Três frentes que costumam trazer alguém para a análise. Quase sempre se cruzam, e o trabalho começa por onde dói mais agora.
- **items**
  - _1._
    - **numeral**: I
    - **title**: Ansiedade & humor
    - **paragraph**: Ansiedade que aperta o peito, episódios de tristeza, medos que paralisam, uma melancolia que se instala sem nome. O trabalho começa por ouvir o que esses estados querem dizer.
  - _2._
    - **numeral**: II
    - **title**: Relações & vida
    - **paragraph**: Lutos, separações, conflitos com a família, solidão, carências antigas. Os vínculos formam quem somos; quando ruem ou pesam, vale voltar para dentro e distinguir o que é nosso do que é do outro.
  - _3._
    - **numeral**: III
    - **title**: Carreira & propósito
    - **paragraph**: Insatisfação profissional, estresse no trabalho, a sensação de estar no caminho errado, a busca por uma vocação que faça sentido. A análise abre espaço para escutar o que a psique já sabe.

### Sobre — `home-about`

- **heading**: Uma escuta cuidadosa, na tradição junguiana.
- **bio**
  - Sou psicóloga clínica. Atendo adultos que atravessam ansiedade, lutos, transições de carreira ou sofrimento nos vínculos.
  - O ritmo importa tanto quanto o conteúdo. Nada do que costuma trazer alguém à análise se entende com pressa: sintomas persistentes, sonhos que voltam, símbolos que tocam algo antes de termos palavras.
  - As primeiras sessões servem para vermos juntos se podemos seguir.
- **formacao**: Psicologia clínica
- **idiomas**: Português

### Vozes (título) — `home-voices`

- **heading**: Pacientes contam

### Escrita (bloco) — `home-writing`

- **heading**: Algumas anotações do consultório.
- **intro**: Notas sobre o que costuma ficar nas entrelinhas da vida adulta. Não substituem o trabalho clínico; fazem companhia entre uma sessão e outra.

### Contato — `home-contact`

- **eyebrow**: Para começar
- **heading**: Uma conversa breve costuma ser o suficiente para vermos se faz sentido.
- **body**: O caminho mais simples é o WhatsApp. Você me escreve uma mensagem curta (não precisa contar tudo de uma vez) e combinamos um horário para uma primeira conversa, sem compromisso. A partir dela decidimos juntos como seguir.
- **whatsappLabel**: Conversar pelo WhatsApp
- **faqLinkLabel**: Perguntas frequentes antes da primeira conversa

### Mandala dos signos — `mandala`

- **aries**
  - **paragraph**: Áries marca o impulso que rompe a inércia — a coragem de começar antes de ter certeza. Na escuta analítica, costuma aparecer quando algo na vida pede um ato, não mais uma reflexão.
  - **vedicParagraph**: A faixa de Áries acolhe o impulso ardente das Ashwini Kumaras, a passagem grave de Bharani e a primeira centelha de Krittika — três modos de inaugurar, antes que Touro assente o que foi começado.
- **leo**
  - **paragraph**: Leão é o coração que pede para ser visto, e a coragem de se oferecer sem desculpas. Na análise, marca o ponto em que a vida íntima procura forma própria, voz própria, gesto próprio.
  - **vedicParagraph**: Leão recebe a herança de Magha, o gozo de Purva Phalguni e o primeiro pacto de Uttara Phalguni — três tempos pelos quais o coração toma forma própria, antes que Virgem apare o que sobra.
- **sagittarius**
  - **paragraph**: Sagitário caminha em direção ao horizonte — o que dá sentido à travessia, o que faz a vida valer o gesto de levantar-se. Aparece quando a alma reclama um norte, mesmo que provisório.
  - **vedicParagraph**: Sagitário desentranha a raiz de Mula, conquista a passagem de Purva Ashadha e ergue o primeiro passo de Uttara Ashadha — três tempos da busca por sentido, antes que Capricórnio funde o que se descobriu.
- **taurus**
  - **paragraph**: Touro encarna a fidelidade ao corpo, ao tempo e àquilo que se faz com as mãos. Aparece quando é preciso lembrar que o sentido também mora no peso das coisas — na permanência, no gozo, na lentidão.
  - **vedicParagraph**: Em Touro a chama de Krittika ganha terra, Rohini desabrocha em forma e Mrigashira começa a procurar — três gestos pelos quais o impulso ariano se aquieta em corpo, antes que Gêmeos o transforme em pergunta.
- **virgo**
  - **paragraph**: Virgem é o cuidado exercido no detalhe — a paciência de aparar, ordenar, distinguir o que serve do que apenas pesa. Aparece quando o trabalho interno pede artesania, não impulso.
  - **vedicParagraph**: Virgem continua a aliança de Uttara Phalguni, ganha a mão de Hasta e começa a polir a joia de Chitra — três modos de cuidar do que existe, antes que Libra o leve ao encontro.
- **capricorn**
  - **paragraph**: Capricórnio constrói no tempo — o ofício, a estrutura, o que se sustenta quando o entusiasmo se cala. Aparece quando é preciso fundar, e não apenas imaginar.
  - **vedicParagraph**: Capricórnio funda a vitória de Uttara Ashadha, escuta em Shravana e marca o passo em Dhanishta — três modos de erguer no tempo, antes que Aquário olhe tudo de longe.
- **gemini**
  - **paragraph**: Gêmeos é a inteligência que recolhe e devolve, a primeira a notar duas verdades onde se via apenas uma. Convida a sustentar a contradição em vez de resolvê-la depressa.
  - **vedicParagraph**: Gêmeos prolonga a busca de Mrigashira, atravessa a tempestade de Ardra e começa a refazer-se em Punarvasu — três tempos da inteligência que pergunta, perde e retorna, antes que Câncer recolha a resposta.
- **libra**
  - **paragraph**: Libra busca o ponto em que duas presenças cabem na mesma sala sem que nenhuma se anule. Sua escuta é a do encontro — o desejo de relação que não exige fusão.
  - **vedicParagraph**: Libra desdobra o brilho de Chitra, abre o espaço de Swati e ergue o arco de Vishakha — três gestos pelos quais a relação se constitui, antes que Escorpião desça ao que ali pulsa.
- **aquarius**
  - **paragraph**: Aquário olha o coletivo a certa distância, e dessa distância nasce a originalidade. Aparece quando algo singular dentro de si precisa de ar para não ser domesticado.
  - **vedicParagraph**: Aquário leva o tambor de Dhanishta ao coletivo, reúne os curadores de Shatabhisha e ergue a flama de Purva Bhadrapada — três modos de servir a um todo, antes que Peixes dissolva as bordas.
- **cancer**
  - **paragraph**: Câncer guarda a memória dos vínculos primeiros — o que nos foi dito, o que nos foi calado, a casa que carregamos por dentro. Surge quando há algo a recolher antes de seguir.
  - **vedicParagraph**: Em Câncer Punarvasu chega à casa, Pushya nutre o que ali habita e Ashlesha desce ao que mora abaixo — três modos de recolher, antes que Leão queira ser visto.
- **scorpio**
  - **paragraph**: Escorpião desce ao que costuma ficar fora da conversa — o desejo, a perda, o que arde sob a superfície. Aparece quando alguma verdade pede passagem e não admite mais rodeios.
  - **vedicParagraph**: Escorpião herda o arco de Vishakha, sustenta a devoção de Anuradha e atravessa a noite de Jyeshtha — três tempos pelos quais a intimidade chega ao fundo, antes que Sagitário procure um horizonte.
- **pisces**
  - **paragraph**: Peixes dissolve as bordas para que algo maior atravesse — o sonho, a compaixão, o que não se diz em prosa. Aparece quando a vida psíquica pede entrega, não controle.
  - **vedicParagraph**: Peixes recolhe a chama de Purva Bhadrapada, mergulha com Uttara Bhadrapada e atravessa a margem com Revati — três tempos pelos quais o ciclo se entrega, antes que Áries recomece.

## Coleções

### Arquivos de mídia — `media` (0 documentos)

_Nenhum documento._

### Publicações — `posts` (0 documentos)

_Nenhum documento._

### Depoimentos — `testimonials` (0 documentos)

_Nenhum documento._

### Perguntas frequentes — `faq` (6 documentos)

#### 1. E em relação a valores?

- **question**: E em relação a valores?
- **answer**: Combinamos os valores antes da primeira sessão, conforme a modalidade e a frequência. Para saber o valor atual, é só me escrever no WhatsApp; respondo em até um dia útil.
- **order**: 5

#### 2. Vocês atendem adolescentes ou crianças?

- **question**: Vocês atendem adolescentes ou crianças?
- **answer**: Não. O consultório atende adultos. Para crianças e adolescentes, posso indicar colegas de confiança.
- **order**: 4

#### 3. Atendimento online ou presencial?

- **question**: Atendimento online ou presencial?
- **answer**: Presencial no consultório em Guarulhos e online por chamada de vídeo, para todo o Brasil. As sessões online seguem a mesma estrutura; pela tela, o trabalho não se faz menos.
- **order**: 3

#### 4. Com que frequência são as sessões?

- **question**: Com que frequência são as sessões?
- **answer**: Em geral, uma vez por semana. Em momentos mais intensos, pode haver duas. Definimos a frequência conforme o que o trabalho pede e o que cabe na sua semana.
- **order**: 2

#### 5. Quanto tempo dura uma análise?

- **question**: Quanto tempo dura uma análise?
- **answer**: Não há prazo fixo. Algumas pessoas procuram a análise para atravessar um momento específico, como um luto ou uma decisão difícil, e ficam alguns meses. Outras seguem por anos, porque o trabalho de individuação é longo por natureza. O ritmo é construído junto.
- **order**: 1

#### 6. O que acontece em uma primeira conversa?

- **question**: O que acontece em uma primeira conversa?
- **answer**: Uma conversa de cerca de cinquenta minutos, em geral por chamada de vídeo. Você me conta, sem precisar organizar nada antes, o que está acontecendo e o que te trouxe até aqui. Eu escuto, faço algumas perguntas e, ao final, decidimos juntos se vale marcar uma próxima sessão.
- **order**: 0
