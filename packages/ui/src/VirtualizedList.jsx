import React, { useRef, useState, useEffect } from "react";

/**
 * VirtualizedList
 *
 * Composant très léger de virtualisation verticale pour de longues listes.
 * Il ne couvre pas tous les cas d'usage mais fournit une base suffisante
 * pour les écrans de transactions, comptes ou audit.
 */
export function VirtualizedList({
  items,
  itemHeight = 40,
  overscan = 5,
  renderItem,
  className = "",
}) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const total = items.length;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      setScrollTop(el.scrollTop);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const viewportHeight =
    containerRef.current?.clientHeight != null
      ? containerRef.current.clientHeight
      : itemHeight * 10;

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan,
  );
  const endIndex = Math.min(
    total - 1,
    Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan,
  );

  const offsetY = startIndex * itemHeight;
  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ maxHeight: viewportHeight }}
    >
      <div style={{ height: total * itemHeight, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: offsetY,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) =>
            renderItem(item, startIndex + index),
          )}
        </div>
      </div>
    </div>
  );
}

