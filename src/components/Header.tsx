import { Link, useLocation } from "react-router-dom";
import { Code2, BookOpen, Layers, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Workspace", icon: Play, disabled: false },
  { to: "/learn", label: "Learn TRIPLA", icon: BookOpen, disabled: false },
  { to: "/compiler", label: "Compiler Concepts", icon: Layers, disabled: false },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform duration-150 ease-out group-active:scale-[0.97]">
            <Code2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-semibold text-foreground tracking-tight leading-none">
              Tripla
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5 leading-none">
              Compiler Visualizer
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <span
                  key={item.to}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground/50 cursor-not-allowed"
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
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.98]",
                  isActive
                    ? "bg-primary text-primary-foreground"
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
