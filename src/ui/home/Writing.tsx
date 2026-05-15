import Link from "next/link";
import type { Blog } from "@/core";

const PT_BR_DATE = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type Props = {
  posts: Blog.Post[];
};

export function Writing({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="writing-heading"
      className="bg-parchment-deep px-6 py-28 sm:px-10 sm:py-36 lg:py-44"
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 sm:mb-20">
          <p className="tracked mb-5">Escrita</p>
          <h2
            id="writing-heading"
            className="display text-foreground text-balance text-[clamp(1.9rem,3.6vw,2.65rem)] leading-[1.14] tracking-[-0.008em]"
          >
            Algumas <span className="display-italic text-terracotta-deep">anotações</span> do
            consultório.
          </h2>
          <p className="text-quill mt-6 max-w-[58ch] text-[1.04rem] leading-[1.7]">
            Notas sobre sonhos, símbolos, leitura junguiana de questões da vida cotidiana. Não
            substituem o trabalho clínico — fazem companhia entre as sessões e fora delas.
          </p>
        </header>

        <ol className="divide-rule divide-y">
          {posts.map((post) => (
            <li key={post.slug} className="py-8 first:pt-0 sm:py-10">
              <Link href={`/blog/${post.slug}`} className="group block no-underline">
                <article className="grid gap-y-3 sm:grid-cols-[10rem_1fr] sm:gap-x-10">
                  <time
                    dateTime={post.date}
                    className="display-italic text-quill self-start text-[0.95rem] sm:pt-[0.4em]"
                  >
                    {PT_BR_DATE.format(new Date(post.date))}
                  </time>
                  <div>
                    <h3 className="display text-foreground decoration-terracotta/0 group-hover:decoration-terracotta/70 text-[clamp(1.35rem,2.2vw,1.7rem)] leading-[1.2] tracking-[-0.005em] underline decoration-1 underline-offset-[0.16em] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-ink mt-3 max-w-[58ch] text-[1.02rem] leading-[1.65]">
                      {post.description}
                    </p>
                    <p className="marginalia text-quill group-hover:text-terracotta mt-5 transition-colors">
                      Ler{" "}
                      <span aria-hidden="true" className="text-terracotta">
                        →
                      </span>{" "}
                      <span className="text-quill/80">{post.readingTime} min</span>
                    </p>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="display-italic text-foreground decoration-terracotta hover:text-terracotta inline-flex text-[1.1rem] underline decoration-1 underline-offset-[0.22em] transition-colors"
          >
            Ver todas as anotações
          </Link>
        </div>
      </div>
    </section>
  );
}
