import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Metadata } from "next";
import { Footer } from "@/components/public/Footer";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post não encontrado | Clínica de Podologia" };
  }

  return {
    title: `${post.title} | Blog da Clínica`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.image ? [post.image] : [],
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Clínica de Podologia",
    },
    description: post.description,
  };

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="grow px-4 pb-20 pt-32 md:px-12 relative z-20">
        <article className="mx-auto max-w-4xl">
          <Link
            href="/blog"
            className="group mb-12 flex w-fit items-center gap-2 text-xs font-black uppercase text-pink-500 transition-colors hover:text-black"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              {"<-"}
            </span>
            Voltar para o blog
          </Link>

          <header className="mb-12 border-b-4 border-pink-500 pb-12">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="border-2 border-pink-500 bg-pink-500 px-2 py-1 text-xs font-black uppercase text-white">
                Artigo
              </span>
              <span className="text-xs font-bold uppercase text-gray-700">
                Data: {post.date}
              </span>
            </div>

            <h1 className="mb-6 text-4xl md:text-6xl font-black uppercase leading-none text-black">
              {post.title}
            </h1>

            <p className="max-w-2xl text-base md:text-lg font-bold leading-relaxed text-gray-700">
              {post.description}
            </p>
          </header>

          {post.image && (
            <div className="mb-16 aspect-video w-full overflow-hidden border-4 border-black bg-white shadow-brutal">
              <img
                src={post.image}
                alt={`Imagem de capa do post ${post.title}`}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div
            className="
              prose max-w-none
              prose-headings:uppercase
              prose-headings:text-black
              prose-headings:font-black
              prose-p:text-gray-800
              prose-p:leading-relaxed
              prose-strong:text-black
              prose-a:text-pink-600
              prose-a:font-bold
              prose-blockquote:border-l-4
              prose-blockquote:border-pink-500
              prose-blockquote:bg-yellow-100
              prose-blockquote:px-4
              prose-blockquote:py-2
              prose-blockquote:text-black
              prose-li:text-gray-800
              prose-code:text-pink-600
              prose-pre:border-4
              prose-pre:border-black
              prose-pre:bg-[#111]
              prose-pre:shadow-brutal
            "
          >
            <MDXRemote source={post.content} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}