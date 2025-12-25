import { Header } from "@/components/Header";
import { BookOpen, Code, Terminal, Lightbulb, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const lessons = [
  {
    icon: BookOpen,
    title: "Introduction to Tripla",
    description: "Learn the basics of the Tripla programming language and its purpose.",
    topics: ["What is Tripla?", "Language philosophy", "Basic structure"],
    color: "text-primary",
  },
  {
    icon: Code,
    title: "Variables & Data Types",
    description: "Understand how to declare and use variables in Tripla.",
    topics: ["LET statements", "Numbers and strings", "Variable scope"],
    color: "text-stack-push",
  },
  {
    icon: Terminal,
    title: "Expressions & Operations",
    description: "Master arithmetic and logical operations in Tripla.",
    topics: ["Arithmetic operators", "Comparison operators", "Expression evaluation"],
    color: "text-execution",
  },
  {
    icon: Lightbulb,
    title: "Control Flow",
    description: "Learn how to control program execution with conditionals and loops.",
    topics: ["IF statements", "WHILE loops", "Program flow"],
    color: "text-primary",
  },
];

const Learn = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8 animate-fade-in">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Learn Tripla</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Master the Tripla programming language through interactive lessons and examples.
            Start from the basics and work your way up to advanced concepts.
          </p>
        </div>

        {/* Quick Start Section */}
        <section className="mb-10 p-6 rounded-2xl bg-accent border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary text-primary-foreground">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Quick Start</h2>
              <p className="text-muted-foreground mb-4">
                Tripla is a simple, educational programming language designed to teach
                compiler concepts. Here's your first Tripla program:
              </p>
              <div className="bg-editor rounded-lg p-4 font-mono text-sm text-editor-foreground">
                <div className="text-editor-line">// My first Tripla program</div>
                <div><span className="text-execution">LET</span> message = "Hello, World!";</div>
                <div><span className="text-execution">PRINT</span> message;</div>
              </div>
            </div>
          </div>
        </section>

        {/* Lessons Grid */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Lessons</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {lessons.map((lesson, idx) => {
              const Icon = lesson.icon;
              return (
                <Card
                  key={idx}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${lesson.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        <CardDescription>{lesson.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {lesson.topics.map((topic, topicIdx) => (
                        <li
                          key={topicIdx}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <ChevronRight className="h-3 w-3" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Coming Soon Notice */}
        <div className="mt-8 text-center py-8 text-muted-foreground">
          <p className="text-sm">
            More lessons and interactive content coming soon!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Learn;
