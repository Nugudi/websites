"use client";

import { Chip } from "@nugudi/react-components-chip";
import { useState } from "react";

export default function ChipContainer() {
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.id;
    setSelectedChips((prev) =>
      prev.includes(id)
        ? prev.filter((chipId) => chipId !== id)
        : [...prev, id],
    );
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Chip
        id="chip1"
        label="⭐️ 맛있어요"
        onClick={handleClick}
        variant={selectedChips.includes("chip1") ? "primary" : "default"}
      />
      <Chip
        id="chip2"
        label="🥵 매워요"
        onClick={handleClick}
        variant={selectedChips.includes("chip2") ? "primary" : "default"}
      />
      <Chip
        id="chip3"
        label="😆 짜요"
        onClick={handleClick}
        variant={selectedChips.includes("chip3") ? "primary" : "default"}
      />
    </div>
  );
}
