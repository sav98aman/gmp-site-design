import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, Languages, ChevronRight, GraduationCap } from "lucide-react";
import { learningModules } from "@/data/learningData";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const difficultyColor = {
  Beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function Learning() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-6 sm:p-10">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <Badge variant="secondary" className="text-xs">Free Learning</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Live<span className="text-primary">GMP</span> Learning
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground mt-2 max-w-2xl">
              Master the stock market from scratch. Free modules covering everything from basics to advanced trading strategies, designed for Indian markets.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {learningModules.length} Modules
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-primary font-semibold">
                  {learningModules.reduce((a, m) => a + m.chapters, 0)}+
                </span>
                Chapters
              </span>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-5 -bottom-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        </div>

        {/* Modules */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Modules</h2>
          <div className="space-y-3">
            {learningModules.map((module) => (
              <Card
                key={module.id}
                className="group hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className={cn("flex", isMobile ? "flex-col" : "items-center")}>
                    {/* Number & Icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center shrink-0 bg-gradient-to-br",
                        module.gradient,
                        isMobile ? "h-14 w-full" : "h-full w-20 min-h-[120px]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{module.icon}</span>
                        {isMobile && (
                          <span className="text-xs font-medium text-muted-foreground">
                            Module {module.id}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            {!isMobile && (
                              <span className="text-xs font-bold text-muted-foreground/60">
                                {String(module.id).padStart(2, "0")}
                              </span>
                            )}
                            <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                              {module.title}
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">
                            {module.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={cn("text-[10px] px-2", difficultyColor[module.difficulty])}
                            >
                              {module.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-2">
                              {module.chapters} chapters
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className={cn("flex shrink-0", isMobile ? "flex-row gap-1.5" : "flex-col gap-1.5")}>
                          <Button
                            variant="default"
                            size="sm"
                            className="text-xs gap-1 h-8"
                          >
                            <BookOpen className="h-3 w-3" />
                            {isMobile ? "" : "View module"}
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                          {module.hasVideos && (
                            <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
                              <PlayCircle className="h-3 w-3" />
                              {isMobile ? "" : "Videos"}
                            </Button>
                          )}
                          {module.hasHindi && (
                            <Button variant="ghost" size="sm" className="text-xs gap-1 h-8 text-muted-foreground">
                              <Languages className="h-3 w-3" />
                              हिंदी
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
