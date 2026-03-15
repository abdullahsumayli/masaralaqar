"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/supabase";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  Loader2,
  MessageCircle,
  Share2,
  User,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

const BLOG_BASE = "/knowledge/blog";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  reading_time: number;
  image?: string;
  published: boolean;
}

export default function KnowledgeBlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      try {
        const post = await getBlogPostBySlug(slug);
        if (post) {
          setArticle(post);
          const allPosts = await getAllBlogPosts(true);
          const related = allPosts
            .filter((p: BlogPost) => p.slug !== slug)
            .slice(0, 3);
          setRelatedArticles(related);
        } else {
          const savedPosts = localStorage.getItem("blogPosts");
          if (savedPosts) {
            const posts = JSON.parse(savedPosts);
            const found = posts.find((p: any) => p.slug === slug);
            if (found) {
              setArticle({
                ...found,
                reading_time: found.readingTime || found.reading_time || 5,
              });
              const related = posts
                .filter((p: any) => p.slug !== slug && p.published)
                .slice(0, 3);
              setRelatedArticles(related);
            } else {
              setError("المقال غير موجود");
            }
          } else {
            setError("المقال غير موجود");
          }
        }
      } catch {
        const savedPosts = localStorage.getItem("blogPosts");
        if (savedPosts) {
          const posts = JSON.parse(savedPosts);
          const found = posts.find((p: any) => p.slug === slug);
          if (found) {
            setArticle({
              ...found,
              reading_time: found.readingTime || found.reading_time || 5,
            });
          } else {
            setError("المقال غير موجود");
          }
        } else {
          setError("المقال غير موجود");
        }
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">المقال غير موجود</h1>
          <p className="text-text-secondary mb-8">عذراً، لم نتمكن من العثور على المقال المطلوب.</p>
          <Link href={BLOG_BASE} className="btn-primary">
            العودة للمدونة
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const shareUrl = `https://masaralaqar.com${BLOG_BASE}/${slug}`;
  const shareText = encodeURIComponent(article.title);

  return (
    <div className="min-h-screen bg-background text-text-primary" dir="rtl">
      <Navbar />
      <div className="pt-24 pb-4 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/knowledge" className="hover:text-primary transition-colors">المعرفة</Link>
            <span>/</span>
            <Link href={BLOG_BASE} className="hover:text-primary transition-colors">المدونة</Link>
            <span>/</span>
            <span className="text-text-secondary">{article.category}</span>
          </div>
        </div>
      </div>
      <section className="py-8 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-text-muted">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>فريق مسار العقار</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.reading_time} دقائق قراءة</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          {article.image ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden -mt-4">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl -mt-4 flex items-center justify-center">
              <Building2 className="w-16 h-16 text-primary/40" />
            </div>
          )}
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[1fr_200px] gap-12">
            <article
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(article.content),
              }}
            />
            <aside className="space-y-6">
              <div className="bg-surface rounded-xl p-6 sticky top-28">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  شارك المقالة
                </h4>
                <div className="flex flex-col gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    X (تويتر)
                  </a>
                  <a
                    href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4" />
                    واتساب
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    لينكدإن
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      {relatedArticles.length > 0 && (
        <section className="py-12 px-4 bg-surface">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-8">مقالات ذات صلة</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related, index) => (
                <Link
                  key={index}
                  href={`${BLOG_BASE}/${related.slug}`}
                  className="bg-[#111E35] border border-[rgba(79,142,247,0.12)] rounded-xl overflow-hidden hover:shadow-lg hover:bg-[#162444] transition-shadow group"
                >
                  {related.image ? (
                    <div className="aspect-video relative">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary/30" />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-sm text-primary mb-2 block">{related.category}</span>
                    <h4 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="py-8 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={BLOG_BASE}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للمدونة
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
