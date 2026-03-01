import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, BookOpen, TrendingUp, BarChart3, Lightbulb } from "lucide-react";
import { mockBlogPosts, blogCategories, type BlogPost } from "@/data/blogData";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const categoryIcons: Record<string, React.ReactNode> = {
  'ipo-analysis': <TrendingUp className="h-4 w-4" />,
  'paper-trading': <BarChart3 className="h-4 w-4" />,
  'education': <Lightbulb className="h-4 w-4" />,
  'market-insights': <BookOpen className="h-4 w-4" />,
};

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`}>
      <Card className="group overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className={cn("h-40 sm:h-52 bg-gradient-to-br", post.coverGradient, "flex items-end p-5 sm:p-6 relative")}>
          <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs">Featured</Badge>
          <div>
            <Badge variant="secondary" className="mb-2 text-xs">{blogCategories.find(c => c.value === post.category)?.label}</Badge>
            <h2 className="text-lg sm:text-2xl font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
          </div>
        </div>
        <CardContent className="p-4 sm:p-6">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{post.author}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime} min</span>
            </div>
            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`}>
      <Card className="group h-full hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5">
        <div className={cn("h-28 sm:h-32 bg-gradient-to-br rounded-t-lg", post.coverGradient, "flex items-end p-4")}>
          <Badge variant="secondary" className="text-xs">{blogCategories.find(c => c.value === post.category)?.label}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm sm:text-base leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {post.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime} min</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const isMobile = useIsMobile();

  const featured = mockBlogPosts.filter(p => p.featured);
  const filtered = activeCategory === 'all'
    ? mockBlogPosts.filter(p => !p.featured)
    : mockBlogPosts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Hero */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Live<span className="text-primary">GMP</span> Blog
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">IPO analysis, trading guides, and market insights</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {blogCategories.map(cat => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.value)}
              className="shrink-0 text-xs sm:text-sm gap-1.5"
            >
              {categoryIcons[cat.value]}
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Featured Posts */}
        {activeCategory === 'all' && featured.length > 0 && (
          <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2")}>
            {featured.map(post => (
              <FeaturedCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* All Posts Grid */}
        <div>
          {activeCategory !== 'all' && (
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {categoryIcons[activeCategory]}
              {blogCategories.find(c => c.value === activeCategory)?.label}
              <Badge variant="secondary" className="text-xs">{filtered.length}</Badge>
            </h2>
          )}
          {activeCategory === 'all' && (
            <h2 className="text-lg font-semibold mb-4">Latest Articles</h2>
          )}
          <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3")}>
            {filtered.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No posts in this category yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
