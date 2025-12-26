import { useMemo } from "react";
import { RESERVED_WORDS } from "@/lib/tripla/tokens";

interface SyntaxHighlighterProps {
  code: string;
}

type TokenStyle = "keyword" | "number" | "boolean" | "operator" | "comment" | "punctuation" | "text";

interface HighlightToken {
  text: string;
  style: TokenStyle;
}

const OPERATORS = ['+', '-', '*', '/', '>', '<', '>=', '<=', '&&', '||', '==', '!=', '='];
const PUNCTUATION = ['{', '}', '(', ')', ',', ';'];

export const SyntaxHighlighter = ({ code }: SyntaxHighlighterProps) => {
  const highlightedLines = useMemo(() => {
    return code.split('\n').map((line, lineIdx) => {
      const tokens = tokenizeLine(line);
      return (
        <div key={lineIdx} className="leading-6">
          {tokens.map((token, tokenIdx) => (
            <span key={tokenIdx} className={getTokenClass(token.style)}>
              {token.text}
            </span>
          ))}
          {tokens.length === 0 && '\u00A0'}
        </div>
      );
    });
  }, [code]);

  return <>{highlightedLines}</>;
};

function tokenizeLine(line: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  let i = 0;

  while (i < line.length) {
    // Check for single-line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), style: "comment" });
      break;
    }

    // Check for multi-line comment start (just highlight till end of line for simplicity)
    if (line[i] === '/' && line[i + 1] === '*') {
      const endIdx = line.indexOf('*/', i + 2);
      if (endIdx !== -1) {
        tokens.push({ text: line.slice(i, endIdx + 2), style: "comment" });
        i = endIdx + 2;
        continue;
      } else {
        tokens.push({ text: line.slice(i), style: "comment" });
        break;
      }
    }

    // Check for whitespace
    if (/\s/.test(line[i])) {
      let j = i;
      while (j < line.length && /\s/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), style: "text" });
      i = j;
      continue;
    }

    // Check for two-character operators first
    const twoChar = line.slice(i, i + 2);
    if (OPERATORS.includes(twoChar)) {
      tokens.push({ text: twoChar, style: "operator" });
      i += 2;
      continue;
    }

    // Check for single-character operators
    if (OPERATORS.includes(line[i])) {
      tokens.push({ text: line[i], style: "operator" });
      i++;
      continue;
    }

    // Check for punctuation
    if (PUNCTUATION.includes(line[i])) {
      tokens.push({ text: line[i], style: "punctuation" });
      i++;
      continue;
    }

    // Check for numbers
    if (/\d/.test(line[i])) {
      let j = i;
      while (j < line.length && /\d/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), style: "number" });
      i = j;
      continue;
    }

    // Check for identifiers/keywords
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      
      if (word === 'true' || word === 'false') {
        tokens.push({ text: word, style: "boolean" });
      } else if (RESERVED_WORDS[word]) {
        tokens.push({ text: word, style: "keyword" });
      } else {
        tokens.push({ text: word, style: "text" });
      }
      i = j;
      continue;
    }

    // Unknown character, just add as text
    tokens.push({ text: line[i], style: "text" });
    i++;
  }

  return tokens;
}

function getTokenClass(style: TokenStyle): string {
  switch (style) {
    case "keyword":
      return "text-syntax-keyword font-medium";
    case "number":
      return "text-syntax-number";
    case "boolean":
      return "text-syntax-boolean font-medium";
    case "operator":
      return "text-syntax-operator";
    case "comment":
      return "text-syntax-comment italic";
    case "punctuation":
      return "text-syntax-punctuation";
    default:
      return "text-editor-foreground";
  }
}
