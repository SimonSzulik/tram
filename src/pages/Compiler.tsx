import { useParams, Link } from "react-router-dom";
import { BookOpen, ArrowRight, Check, GraduationCap } from "lucide-react";
import { Header } from "@/components/Header";
import { BookLayout } from "@/components/book/BookLayout";
import { PipelineDiagram } from "@/components/book/PipelineDiagram";
import { CHAPTERS, PARTS, getChapter } from "@/content/book";
import { Callout } from "@/components/learn";
import { cn } from "@/lib/utils";

const BookHome = () => (
  <main className="mx-auto max-w-5xl px-4 py-10">
    {/* Hero */}
    <div className="animate-fade-in text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
        <BookOpen className="h-4 w-4" />
        An interactive compiler course
      </span>
      <h1 className="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl">The Compiler Book</h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
        A side-by-side companion for a compiler-construction lecture. Start with the universal ideas, then
        watch them come alive on <strong>TRIPLA</strong> and the <strong>TRAM</strong> — the very language and
        machine you can run in the Workspace.
      </p>
    </div>

    <div className="mt-10">
      <PipelineDiagram caption="The journey this book takes, from source text to a running program." />
    </div>

    <Callout variant="tip" title="How to read this book">
      <p>
        Chapters build on each other, but each opens with its own goals and worked examples, so you can also
        jump straight to whatever your lecture is covering this week. Wherever you see{" "}
        <strong>Try in Workspace</strong>, the code opens in the live editor so you can step through it.
      </p>
    </Callout>

    {/* Table of contents */}
    <div className="mt-10 space-y-10">
      {PARTS.map((part) => {
        const chapters = CHAPTERS.filter((c) => c.part === part.id);
        return (
          <section key={part.id}>
            <div className="mb-4">
              <h2 className="font-display text-2xl font-bold text-foreground">{part.title}</h2>
              <p className="text-muted-foreground">{part.blurb}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {chapters.map((c) => (
                <Link
                  key={c.id}
                  to={`/compiler/${c.id}`}
                  className="group flex flex-col rounded-xl border border-border bg-card/60 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-muted-foreground">Chapter {c.number}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        c.status === "complete"
                          ? "bg-stack-push/15 text-stack-push"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {c.status === "complete" ? (
                        <span className="inline-flex items-center gap-1">
                          <Check className="h-3 w-3" /> Ready
                        </span>
                      ) : (
                        "Outline"
                      )}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-lg font-semibold text-foreground group-hover:text-primary">
                    {c.title}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{c.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Read <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>

    <div className="mt-12 flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
      <GraduationCap className="h-5 w-5 shrink-0 text-primary" />
      <p>
        Based on <em>Übersetzung und Analyse von Programmen</em>, Prof. Dr. Stephan Diehl, Universität Trier.
        Chapter references (UAP…) point back to the matching lecture and project.
      </p>
    </div>
  </main>
);

const Compiler = () => {
  const { chapterId } = useParams();
  const chapter = getChapter(chapterId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {chapterId ? (
        chapter ? (
          <BookLayout chapter={chapter} />
        ) : (
          <div className="mx-auto max-w-2xl px-4 py-24 text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Chapter not found</h1>
            <p className="mt-2 text-muted-foreground">That chapter doesn't exist yet.</p>
            <Link to="/compiler" className="mt-4 inline-block font-medium text-primary hover:underline">
              ← Back to the Compiler Book
            </Link>
          </div>
        )
      ) : (
        <BookHome />
      )}
    </div>
  );
};

export default Compiler;
