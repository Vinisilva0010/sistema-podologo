import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Metadata } from "next";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Blog | Clínica de Podologia",
  description: "Artigos, dicas e conteúdos sobre podologia, cuidados com os pés e bem-estar.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <main className="grow px-4 pb-20 pt-32 md:px-12 relative z-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 border-b-4 border-pink-500 pb-8">
            <h1 className="text-4xl md:text-6xl font-black uppercase text-black leading-none">
              Blog da Clínica
            </h1>
            <p className="mt-4 text-sm md:text-base font-bold uppercase tracking-widest text-pink-500">
              Dicas, cuidados e conteúdos para a saúde dos seus pés
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="border-4 border-black bg-yellow-300 px-6 py-5 shadow-brutal max-w-xl">
              <p className="text-sm font-black uppercase text-black">
                Nenhum post encontrado na pasta content/posts
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group relative flex flex-col justify-between border-4 border-black bg-white p-6 shadow-brutal transition-all duration-200 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#0f0f0f]"
                >
                  <div>
                    {post.image && (
                      <div className="mb-4 h-48 w-full overflow-hidden border-4 border-black bg-gray-100">
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

                    <h2 className="mb-3 text-2xl font-black uppercase leading-tight text-black">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="mb-6 text-sm leading-relaxed text-gray-700">
                      {post.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-black pt-4 text-xs font-black uppercase text-black">
                    <span>Ler artigo</span>
                    <span className="text-pink-500 transition-transform group-hover:translate-x-1">
                      {"->"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}