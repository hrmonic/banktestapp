/**
 * Liste virtualisée verticale pour longues listes (transactions, comptes, audit).
 */
import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  type ReactNode,
} from 'react';

export type VirtualizedListProps<T> = {
  items: T[];
  itemHeight?: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
};

export function VirtualizedList<T>({
  items,
  itemHeight = 40,
  overscan = 5,
  renderItem,
  className = '',
}: VirtualizedListProps<T>): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(itemHeight * 10);
  const total = items.length;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateViewportHeight = (): void => {
      const next = el.clientHeight || itemHeight * 10;
      setViewportHeight(next);
    };

    updateViewportHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateViewportHeight);
      observer.observe(el);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateViewportHeight);
    return () => window.removeEventListener('resize', updateViewportHeight);
  }, [itemHeight]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = (): void => {
      setScrollTop(el.scrollTop);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    total - 1,
    Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan
  );

  const offsetY = startIndex * itemHeight;
  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ maxHeight: viewportHeight }}
    >
      <div style={{ height: total * itemHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) =>
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
}
