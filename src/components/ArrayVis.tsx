"use client";

import { Highlight } from "@/lib/types";
import { escapeHTML } from "@/lib/utils";

interface ArrayVisProps {
  array: (string | number)[];
  highlights?: Highlight[];
  showIndices?: boolean;
  clickable?: boolean;
  onCellClick?: (index: number) => void;
}

export default function ArrayVis({
  array,
  highlights,
  showIndices = true,
  clickable = false,
  onCellClick,
}: ArrayVisProps) {
  // Build color map
  const colorMap: Record<number, string> = {};
  (highlights || []).forEach((hl) => {
    (hl.indices || []).forEach((i) => {
      if (i >= 0 && i < array.length) colorMap[i] = hl.color || "blue";
    });
  });

  return (
    <div className="array-vis">
      {array.map((v, i) => {
        const hlClass = colorMap[i] ? ` highlight-${colorMap[i]}` : "";
        const ckClass = clickable ? " clickable" : "";
        return (
          <div
            key={i}
            className={`arr-cell${hlClass}${ckClass}`}
            data-idx={i}
            onClick={clickable ? () => onCellClick?.(i) : undefined}
          >
            {escapeHTML(String(v))}
            {showIndices && <span className="idx">{i}</span>}
          </div>
        );
      })}
    </div>
  );
}
