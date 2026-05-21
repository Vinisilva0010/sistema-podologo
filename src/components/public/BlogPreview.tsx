import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <section className="relative z-20 w-full overflow-hidden border-b-4 border-black bg-brutal-bg py-20 pl-4 md:pl-12">
      <div className="mx-auto max-w-7xl pr-4 md:pr-12">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-none text-black">
              Nosso Blog
            </h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-widest text-pink-500">
              Dicas, cuidados e conteúdos para a saúde dos seus pés
            </p>
          </div>

          <Link
            href="/blog"
            aria-label="Acessar todos os artigos do blog"
            className="w-full md:w-auto text-center border-4 border-black bg-yellow-400 px-6 py-3 text-sm font-black uppercase text-black shadow-brutal transition-all hover:-translate-y-1 hover:bg-pink-500 hover:text-white active:translate-y-0 active:shadow-none"
          >
            Ver todos os posts [›]
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        {posts.length === 0 ? (
          <div className="pr-4 md:pr-12">
            <div className="max-w-xl border-4 border-black bg-yellow-300 px-6 py-5 shadow-brutal">
              <p className="text-sm font-black uppercase text-black">
                Nenhum post encontrado em content/posts
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex gap-8 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scroll-smooth pr-4 md:pr-12 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group relative flex w-[85vw] flex-shrink-0 snap-start flex-col justify-between border-4 border-black bg-white p-6 shadow-brutal transition-all duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#0f0f0f] md:w-[400px]"
              >
                <div>
                  {post.image && (
                    <div className="relative mb-4 h-48 w-full overflow-hidden border-4 border-black bg-gray-100">
                      <img
                        src={post.image}
                        alt={`Imagem de capa do post ${post.title}`}
                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}

                  <span className="mb-2 block text-[11px] font-black uppercase tracking-wider text-pink-500">
                    Publicado em: {post.date}
                  </span>

                  <h3 className="mb-3 text-xl md:text-2xl font-black uppercase leading-tight text-black">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="mb-6 text-sm leading-relaxed text-gray-700">
                    {post.description}
                  </p>
                </div>

                <div className="relative z-10 flex w-full items-center justify-between border-t-2 border-black pt-4 text-xs font-black uppercase text-black transition-colors group-hover:text-pink-500">
                  <span>Ler post</span>
                  <span className="text-pink-500 transition-transform group-hover:translate-x-1">
                    {"->"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `,
        }}
      />
    </section>
  );
}