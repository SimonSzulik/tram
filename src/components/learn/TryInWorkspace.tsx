import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { workspaceHref } from "@/lib/workspaceLink";

/**
 * Sends a snippet to the real Workspace (/) instead of duplicating the IDE.
 * The code is encoded into ?code= and seeded into the editor on load.
 */
export const TryInWorkspace = ({
  code,
  label = "Try in Workspace",
  className,
}: {
  code: string;
  label?: string;
  className?: string;
}) => (
  <Link
    to={workspaceHref(code)}
    className={cn(
      "inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20",
      className
    )}
  >
    <Play className="h-3.5 w-3.5" />
    {label}
  </Link>
);
