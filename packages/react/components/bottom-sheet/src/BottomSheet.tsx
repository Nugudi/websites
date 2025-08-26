"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as styles from "./style.css";
import type { BottomSheetProps } from "./types";

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  initialHeight = 50,
  snapPoints = [20, 50, 90],
  defaultSnapPoint = 0,
  containerId = "mobile-layout-container",
}: BottomSheetProps) => {
  const defaultHeight = snapPoints[defaultSnapPoint] || initialHeight;
  const [sheetHeight, setSheetHeight] = useState(defaultHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragStartY = useRef<number>(0);
  const initialHeightRef = useRef<number>(defaultHeight);

  // Client-side only mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset height when opening
  useEffect(() => {
    if (isOpen) {
      setSheetHeight(defaultHeight);
    }
  }, [isOpen, defaultHeight]);

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    initialHeightRef.current = sheetHeight;

    // Prevent text selection during drag
    e.preventDefault();
    // Capture pointer for smooth dragging
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDragMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const deltaY = dragStartY.current - e.clientY;
      const container = document.getElementById(containerId);
      const containerHeight = container?.clientHeight || window.innerHeight;
      const deltaPercentage = (deltaY / containerHeight) * 100;
      const newHeight = Math.min(
        90, // Max 90% to keep handle visible
        Math.max(0, initialHeightRef.current + deltaPercentage),
      );

      setSheetHeight(newHeight);
    },
    [isDragging, containerId],
  );

  const handleDragEnd = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      setIsDragging(false);
      // Release pointer capture
      e.currentTarget.releasePointerCapture(e.pointerId);

      // Find closest snap point
      const sortedSnapPoints = [...snapPoints].sort((a, b) => a - b);

      // If below the lowest snap point, close
      if (sheetHeight < sortedSnapPoints[0] * 0.5) {
        onClose();
        return;
      }

      // Find the closest snap point
      let closestSnapPoint = sortedSnapPoints[0];
      let minDistance = Math.abs(sheetHeight - closestSnapPoint);

      for (const snapPoint of sortedSnapPoints) {
        const distance = Math.abs(sheetHeight - snapPoint);
        if (distance < minDistance) {
          minDistance = distance;
          closestSnapPoint = snapPoint;
        }
      }

      setSheetHeight(closestSnapPoint);
    },
    [isDragging, sheetHeight, onClose, snapPoints],
  );

  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const bottomSheetContent = (
    <div
      className={styles.modalContent({
        dragging: isDragging,
        visible: isOpen,
      })}
      style={{ height: `${sheetHeight}%` }}
      role="presentation"
    >
      <div className={styles.modalHeader}>
        {/* biome-ignore lint/a11y/useSemanticElements: div with role="button" needed for proper pointer event handling */}
        <div
          className={styles.dragIcon({ dragging: isDragging })}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          role="button"
          tabIndex={0}
          aria-label="Drag handle to resize bottom sheet"
        >
          <div className={styles.dragIconLine} />
        </div>
      </div>
      <div className={styles.modalBody}>{children}</div>
    </div>
  );

  // Always render directly without portal to ensure proper positioning
  return bottomSheetContent;
};
