import { useMemo } from "react";

export const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const useSearchTokens = (query: string): string[] => {
  return useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return trimmed.split(/\s+/).filter((t) => t.length > 0);
  }, [query]);
};

interface HighlightTextProps {
  text: string;
  tokens: string[];
  className?: string;
}

export const HighlightText = ({ text, tokens, className }: HighlightTextProps) => {
  if (tokens.length === 0) return <>{text}</>;

  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) =>
        tokens.some((t) => part.toLowerCase() === t) ? (
          <mark
            key={i}
            className={className ?? "bg-yellow-300/60 text-foreground rounded-sm px-0.5"}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export const matchesTokens = (text: string, tokens: string[]): boolean => {
  if (tokens.length === 0) return true;
  const lower = text.toLowerCase();
  return tokens.every((t) => lower.includes(t));
};
