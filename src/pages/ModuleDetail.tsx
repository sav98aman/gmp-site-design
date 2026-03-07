import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Lock, PlayCircle, CheckCircle2, GraduationCap } from "lucide-react";
import { getModuleBySlug, learningModules } from "@/data/learningData";
import { cn } from "@/lib/utils";

const difficultyColor = {
  Beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function ModuleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const module = slug ? getModuleBySlug(slug) : undefined;

  if (!module) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <h1 className="text-2xl font-bold mb-2">Module Not Found</h1>
          <p className="text-muted-foreground mb-6">This learning module doesn't exist.</p>
          <Button onClick={() => navigate("/learning")}>Back to Learning</Button>
        </div>
      </div>
    );
  }

  const currentIndex = learningModules.findIndex(m => m.slug === module.slug);
  const prevModule = currentIndex > 0 ? learningModules[currentIndex - 1] : null;
  const nextModule = currentIndex < learningModules.length - 1 ? learningModules[currentIndex + 1] : null;
  const totalDuration = module.chapterList.reduce((acc, ch) => acc + parseInt(ch.duration), 0);
  const freeCount = module.chapterList.filter(ch => ch.isFree).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10">
        {/* Back */}
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5 text-muted-foreground" onClick={() => navigate("/learning")}>
          <ArrowLeft className="h-4 w-4" /> Back to Learning
        </Button>

        {/* Hero */}
        <div className={cn("rounded-2xl bg-gradient-to-br border border-border/50 p-6 sm:p-8 mb-6", module.gradient)}>
          <div className="flex items-start gap-4">
            <span className="text-4xl sm:text-5xl">{module.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="secondary" className="text-xs">Module {module.id}</Badge>
                <Badge variant="outline" className={cn("text-[10px] px-2", difficultyColor[module.difficulty])}>
                  {module.difficulty}
                </Badge>
              </div>
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight mb-2">{module.title}</h1>
              <p className="text-sm text-muted-foreground max-w-2xl">{module.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" /> {module.chapters} chapters
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {totalDuration} min total
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {freeCount} free chapters
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold mb-4">Chapters</h2>
          <div className="space-y-2">
            {module.chapterList.map((chapter) => (
              <Card
                key={chapter.id}
                className={cn(
                  "group transition-all duration-200 hover:border-primary/30",
                  chapter.isFree ? "hover:shadow-sm" : "opacity-80 hover:opacity-100"
                )}
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 sm:gap-4 px-4 py-3">
                    {/* Number */}
                    <div className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold shrink-0",
                      chapter.isFree
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {String(chapter.id).padStart(2, "0")}
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "text-sm font-medium truncate",
                        chapter.isFree ? "group-hover:text-primary transition-colors" : ""
                      )}>
                        {chapter.title}
                      </h3>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {chapter.duration}
                      </span>
                      {chapter.isFree ? (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Free</Badge>
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-3xl mt-8 flex items-center justify-between gap-4">
          {prevModule ? (
            <Link to={`/learning/${prevModule.slug}`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{prevModule.title}</span>
                <span className="sm:hidden">Previous</span>
              </Button>
            </Link>
          ) : <div />}
          {nextModule ? (
            <Link to={`/learning/${nextModule.slug}`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <span className="hidden sm:inline">{nextModule.title}</span>
                <span className="sm:hidden">Next</span>
                <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
              </Button>
            </Link>
          ) : <div />}
        </div>
      </main>
    </div>
  );
}
