import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "mandala" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"aries_paragraph" varchar DEFAULT 'Áries marca o impulso que rompe a inércia — a coragem de começar antes de ter certeza. Na escuta analítica, costuma aparecer quando algo na vida pede um ato, não mais uma reflexão.',
  	"aries_vedic_paragraph" varchar DEFAULT 'A faixa de Áries acolhe o impulso ardente das Ashwini Kumaras, a passagem grave de Bharani e a primeira centelha de Krittika — três modos de inaugurar, antes que Touro assente o que foi começado.',
  	"taurus_paragraph" varchar DEFAULT 'Touro encarna a fidelidade ao corpo, ao tempo e àquilo que se faz com as mãos. Aparece quando é preciso lembrar que o sentido também mora no peso das coisas — na permanência, no gozo, na lentidão.',
  	"taurus_vedic_paragraph" varchar DEFAULT 'Em Touro a chama de Krittika ganha terra, Rohini desabrocha em forma e Mrigashira começa a procurar — três gestos pelos quais o impulso ariano se aquieta em corpo, antes que Gêmeos o transforme em pergunta.',
  	"gemini_paragraph" varchar DEFAULT 'Gêmeos é a inteligência que recolhe e devolve, a primeira a notar duas verdades onde se via apenas uma. Convida a sustentar a contradição em vez de resolvê-la depressa.',
  	"gemini_vedic_paragraph" varchar DEFAULT 'Gêmeos prolonga a busca de Mrigashira, atravessa a tempestade de Ardra e começa a refazer-se em Punarvasu — três tempos da inteligência que pergunta, perde e retorna, antes que Câncer recolha a resposta.',
  	"cancer_paragraph" varchar DEFAULT 'Câncer guarda a memória dos vínculos primeiros — o que nos foi dito, o que nos foi calado, a casa que carregamos por dentro. Surge quando há algo a recolher antes de seguir.',
  	"cancer_vedic_paragraph" varchar DEFAULT 'Em Câncer Punarvasu chega à casa, Pushya nutre o que ali habita e Ashlesha desce ao que mora abaixo — três modos de recolher, antes que Leão queira ser visto.',
  	"leo_paragraph" varchar DEFAULT 'Leão é o coração que pede para ser visto, e a coragem de se oferecer sem desculpas. Na análise, marca o ponto em que a vida íntima procura forma própria, voz própria, gesto próprio.',
  	"leo_vedic_paragraph" varchar DEFAULT 'Leão recebe a herança de Magha, o gozo de Purva Phalguni e o primeiro pacto de Uttara Phalguni — três tempos pelos quais o coração toma forma própria, antes que Virgem apare o que sobra.',
  	"virgo_paragraph" varchar DEFAULT 'Virgem é o cuidado exercido no detalhe — a paciência de aparar, ordenar, distinguir o que serve do que apenas pesa. Aparece quando o trabalho interno pede artesania, não impulso.',
  	"virgo_vedic_paragraph" varchar DEFAULT 'Virgem continua a aliança de Uttara Phalguni, ganha a mão de Hasta e começa a polir a joia de Chitra — três modos de cuidar do que existe, antes que Libra o leve ao encontro.',
  	"libra_paragraph" varchar DEFAULT 'Libra busca o ponto em que duas presenças cabem na mesma sala sem que nenhuma se anule. Sua escuta é a do encontro — o desejo de relação que não exige fusão.',
  	"libra_vedic_paragraph" varchar DEFAULT 'Libra desdobra o brilho de Chitra, abre o espaço de Swati e ergue o arco de Vishakha — três gestos pelos quais a relação se constitui, antes que Escorpião desça ao que ali pulsa.',
  	"scorpio_paragraph" varchar DEFAULT 'Escorpião desce ao que costuma ficar fora da conversa — o desejo, a perda, o que arde sob a superfície. Aparece quando alguma verdade pede passagem e não admite mais rodeios.',
  	"scorpio_vedic_paragraph" varchar DEFAULT 'Escorpião herda o arco de Vishakha, sustenta a devoção de Anuradha e atravessa a noite de Jyeshtha — três tempos pelos quais a intimidade chega ao fundo, antes que Sagitário procure um horizonte.',
  	"sagittarius_paragraph" varchar DEFAULT 'Sagitário caminha em direção ao horizonte — o que dá sentido à travessia, o que faz a vida valer o gesto de levantar-se. Aparece quando a alma reclama um norte, mesmo que provisório.',
  	"sagittarius_vedic_paragraph" varchar DEFAULT 'Sagitário desentranha a raiz de Mula, conquista a passagem de Purva Ashadha e ergue o primeiro passo de Uttara Ashadha — três tempos da busca por sentido, antes que Capricórnio funde o que se descobriu.',
  	"capricorn_paragraph" varchar DEFAULT 'Capricórnio constrói no tempo — o ofício, a estrutura, o que se sustenta quando o entusiasmo se cala. Aparece quando é preciso fundar, e não apenas imaginar.',
  	"capricorn_vedic_paragraph" varchar DEFAULT 'Capricórnio funda a vitória de Uttara Ashadha, escuta em Shravana e marca o passo em Dhanishta — três modos de erguer no tempo, antes que Aquário olhe tudo de longe.',
  	"aquarius_paragraph" varchar DEFAULT 'Aquário olha o coletivo a certa distância, e dessa distância nasce a originalidade. Aparece quando algo singular dentro de si precisa de ar para não ser domesticado.',
  	"aquarius_vedic_paragraph" varchar DEFAULT 'Aquário leva o tambor de Dhanishta ao coletivo, reúne os curadores de Shatabhisha e ergue a flama de Purva Bhadrapada — três modos de servir a um todo, antes que Peixes dissolva as bordas.',
  	"pisces_paragraph" varchar DEFAULT 'Peixes dissolve as bordas para que algo maior atravesse — o sonho, a compaixão, o que não se diz em prosa. Aparece quando a vida psíquica pede entrega, não controle.',
  	"pisces_vedic_paragraph" varchar DEFAULT 'Peixes recolhe a chama de Purva Bhadrapada, mergulha com Uttara Bhadrapada e atravessa a margem com Revati — três tempos pelos quais o ciclo se entrega, antes que Áries recomece.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "mandala" CASCADE;`);
}
