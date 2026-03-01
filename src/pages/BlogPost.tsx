import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Share2, BookOpen } from "lucide-react";
import { getBlogBySlug, getRelatedPosts, blogCategories } from "@/data/blogData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getBlogBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  const related = getRelatedPosts(post);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.info("Share this article's URL from your browser.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5 text-muted-foreground" onClick={() => navigate("/blog")}>
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Button>

        <article className="max-w-3xl mx-auto">
          {/* Cover */}
          <div className={cn("h-40 sm:h-56 rounded-xl bg-gradient-to-br mb-6", post.coverGradient, "flex items-end p-6")}>
            <Badge variant="secondary">{blogCategories.find(c => c.value === post.category)?.label}</Badge>
          </div>

          {/* Title & Meta */}
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            <span className="font-medium text-foreground">{post.author}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime} min read</span>
            <Button variant="ghost" size="sm" className="ml-auto gap-1.5" onClick={handleShare}>
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>

          {/* Content */}
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none 
            prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground
            prose-a:text-primary prose-li:text-muted-foreground
            prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-foreground
            prose-td:p-3 prose-td:border-t prose-td:border-border prose-td:text-muted-foreground
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
            [&_table]:w-full [&_table]:border [&_table]:border-border [&_table]:rounded-lg [&_table]:overflow-hidden
            [&_thead]:bg-muted/50
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12">
            <h2 className="text-xl font-bold mb-4">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map(rp => (
                <Link key={rp.id} to={`/blog/${rp.slug}`}>
                  <Card className="group hover:border-primary/30 transition-all h-full">
                    <div className={cn("h-20 rounded-t-lg bg-gradient-to-br", rp.coverGradient)} />
                    <CardContent className="p-3">
                      <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{rp.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />{rp.readTime} min</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
