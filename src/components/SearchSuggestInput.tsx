import { useMemo, useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { escapeRegExp } from "@/components/SearchHighlight";

interface SearchSuggestInputProps {
  value: string;
  onChange: (value: string) => void;
  /** All searchable text on the page; suggestions are derived from it. */
  corpus: string[];
  placeholder?: string;
}

const MIN_LEN = 2;
const MAX_SUGGESTIONS = 8;

/** Extract unique words (3+ letters) from the corpus. */
const buildWordList = (corpus: string[]): string[] => {
  const words = new Set<string>();
  const re = /[A-Za-zÀ-ÿ]{3,}/g;
  for (const text of corpus) {
    for (const m of text.matchAll(re)) {
      words.add(m[0].toLowerCase());
    }
  }
  return Array.from(words);
};

export const SearchSuggestInput = ({ value, onChange, corpus, placeholder }: SearchSuggestInputProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const wordList = useMemo(() => buildWordList(corpus), [corpus]);

  // Suggest based on the last token being typed.
  const suggestions = useMemo(() => {
    const tokens = value.trim().toLowerCase().split(/\s+/);
    const last = tokens[tokens.length - 1] ?? "";
    if (last.length < MIN_LEN) return [];
    return wordList
      .filter((w) => w.startsWith(last) && w !== last)
      .sort((a, b) => a.length - b.length || a.localeCompare(b))
      .slice(0, MAX_SUGGESTIONS);
  }, [value, wordList]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const applySuggestion = (word: string) => {
    const tokens = value.trim().split(/\s+/);
    tokens[tokens.length - 1] = word;
    onChange(tokens.join(" "));
    setOpen(false);
  };

  const highlight = (word: string) => {
    const tokens = value.trim().toLowerCase().split(/\s+/);
    const last = tokens[tokens.length - 1] ?? "";
    const idx = word.toLowerCase().indexOf(last);
    if (idx < 0) return word;
    return (
      <>
        {word.slice(0, idx)}
        <span className="font-semibold">{word.slice(idx, idx + last.length)}</span>
        {word.slice(idx + last.length)}
      </>
    );
  };

  // escapeRegExp imported to keep parity if extended; referenced to avoid lint noise
  void escapeRegExp;

  return (
    <div ref={containerRef} className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder ?? "Zoek in uitleg, contexten, voorbeelden en oefeningen…"}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" && suggestions.length > 0) {
            e.preventDefault();
            applySuggestion(suggestions[0]);
          }
        }}
        className="pl-9"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-autocomplete="list"
      />
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full rounded-md border border-border bg-popover shadow-md overflow-hidden"
        >
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                role="option"
                aria-selected="false"
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer"
                onClick={() => applySuggestion(s)}
              >
                {highlight(s)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
