import { Link, useLocation } from "react-router-dom";
import { Code2, BookOpen, Layers, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Workspace", icon: Play, disabled: false },
  { to: "/learn", label: "Learn Tripla", icon: BookOpen, disabled: true },
  { to: "/compiler", label: "Compiler Concepts", icon: Layers, disabled: true },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow transition-transform group-hover:scale-105">
            <Code2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-foreground tracking-tight">
              Tripla
            </span>
            <span className="text-xs text-muted-foreground -mt-0.5">
              Compiler Visualizer
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            
            if (item.disabled) {
              return (
                <span
                  key={item.to}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
                  title="Coming soon"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              );
            }
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
