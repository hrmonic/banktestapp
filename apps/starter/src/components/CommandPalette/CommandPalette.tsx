/**
 * Palette de commandes (Ctrl+K / Cmd+K) : recherche et navigation vers les modules.
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

export type CommandPaletteItem = {
  to: string;
  label: string;
};

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  items: CommandPaletteItem[];
  onSelect: (to: string) => void;
};

export function CommandPalette({
  open,
  onClose,
  items,
  onSelect,
}: CommandPaletteProps): React.ReactElement | null {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q)
    );
  }, [items, query]);

  const clampedIndex = Math.min(
    Math.max(0, selectedIndex),
    Math.max(0, filtered.length - 1)
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    const child = el.children[clampedIndex] as HTMLElement | undefined;
    child?.scrollIntoView({ block: 'nearest' });
  }, [open, clampedIndex, filtered.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          return;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
          return;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          return;
        case 'Enter':
          e.preventDefault();
          if (filtered[clampedIndex]) {
            onSelect(filtered[clampedIndex].to);
            onClose();
          }
          return;
        default:
          break;
      }
    },
    [open, onClose, onSelect, filtered, clampedIndex]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('commandPalette.ariaLabel', 'Rechercher et naviguer')}
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-lg border border-slate-200 bg-white shadow-xl dark:border-cursor-border dark:bg-cursor-surface">
        <div className="flex items-center border-b border-slate-200 dark:border-cursor-border px-3">
          <span
            className="text-slate-400 dark:text-cursor-text-muted"
            aria-hidden="true"
          >
            ⌘K
          </span>
          <input
            ref={inputRef}
            type="search"
            className="flex-1 border-0 bg-transparent py-3 px-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0 dark:text-cursor-text dark:placeholder:text-cursor-text-muted"
            placeholder={t('commandPalette.placeholder', 'Rechercher…')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('commandPalette.searchLabel', 'Recherche')}
            aria-controls="command-palette-list"
            aria-expanded="true"
            aria-activedescendant={
              filtered[clampedIndex]
                ? `command-palette-item-${clampedIndex}`
                : undefined
            }
          />
        </div>
        <div
          id="command-palette-list"
          ref={listRef}
          className="max-h-72 overflow-y-auto py-2"
          role="listbox"
          aria-label={t('commandPalette.navigation', 'Navigation')}
        >
          {filtered.length === 0 ? (
            <p
              className="px-4 py-3 text-sm text-slate-500 dark:text-cursor-text-muted"
              role="status"
            >
              {t('commandPalette.noResults', 'Aucun résultat')}
            </p>
          ) : (
            filtered.map((item, index) => (
              <button
                key={`${item.to}-${item.label}`}
                id={`command-palette-item-${index}`}
                type="button"
                role="option"
                aria-selected={index === clampedIndex}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  index === clampedIndex
                    ? 'bg-blue-50 text-blue-900 dark:bg-cursor-bg dark:text-cursor-accent'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-cursor-text dark:hover:bg-cursor-bg'
                }`}
                onClick={() => {
                  onSelect(item.to);
                  onClose();
                }}
              >
                {item.label}
              </button>
            ))
          )}
        </div>
        <p className="border-t border-slate-100 dark:border-cursor-border px-4 py-2 text-xs text-slate-500 dark:text-cursor-text-muted">
          {t(
            'commandPalette.shortcutHint',
            '↑↓ pour naviguer, Entrée pour ouvrir, Échap pour fermer'
          )}
        </p>
      </div>
    </div>
  );
}
