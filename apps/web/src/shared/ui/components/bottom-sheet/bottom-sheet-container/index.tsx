"use client";

import { Backdrop } from "@nugudi/react-components-backdrop";
import { BottomSheet } from "@nugudi/react-components-bottom-sheet";
import { Button } from "@nugudi/react-components-button";
import { useRef, useState } from "react";

export const BottomSheetContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ height: "100vh", position: "relative" }}>
      <Button variant="brand" color="main" size="lg" onClick={handleOpen}>
        Show Bottom Sheet
      </Button>

      {/* Backdrop - covers entire screen */}
      {isOpen && <Backdrop onClick={handleClose} />}

      {/* Bottom Sheet - internal isOpen check handles rendering */}
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        snapPoints={[20, 50, 90]}
        containerRef={containerRef}
      >
        <h2>너구링 혜택</h2>
        <p>
          오늘 맘스터치를 갔는데, 스모크 햄버거가 매진되어 먹을 수 없었어요.
          너무 너무 슬펐어요
        </p>
        <p>너구링 혜택을 확인해보세요.</p>
      </BottomSheet>
    </div>
  );
};
