import { Backdrop } from "@nugudi/react-components-backdrop";
import { clsx } from "clsx";
import {
  type CSSProperties,
  forwardRef,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  containerStyle,
  contentStyle,
  handleContainerStyle,
  handleStyle,
} from "./style.css";
import type { BottomSheetProps } from "./types";

const BottomSheet = (props: BottomSheetProps, ref: Ref<HTMLDivElement>) => {
  const {
    isOpen,
    onClose,
    snapPoints = [50, 100],
    defaultSnapPoint = 0,
    children,
    showHandle = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    className,
    overlayClassName,
    contentClassName,
    style,
    ...restProps
  } = props;

  const [currentSnapIndex, setCurrentSnapIndex] = useState(defaultSnapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [animationState, setAnimationState] = useState<
    "entering" | "entered" | "exiting" | "exited"
  >("exited");
  const [shouldRender, setShouldRender] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Merge external ref with internal ref
  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

  const getCurrentHeight = useCallback(
    (snapIndex: number) => {
      const snapPoint = snapPoints[snapIndex];
      return `${snapPoint}vh`;
    },
    [snapPoints],
  );

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationState("entering");
      const clampedIndex = Math.max(
        0,
        Math.min(defaultSnapPoint, snapPoints.length - 1),
      );
      setCurrentSnapIndex(clampedIndex);
      // Reset scroll position when opening
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      const rafId = requestAnimationFrame(() => {
        setAnimationState("entered");
      });
      return () => cancelAnimationFrame(rafId);
    } else if (!isOpen && shouldRender) {
      setAnimationState("exiting");
      const timer = setTimeout(() => {
        setAnimationState("exited");
        setShouldRender(false);
        // Reset scroll position after closing
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, defaultSnapPoint, snapPoints.length, shouldRender]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  const handleDragStart = useCallback(
    (e: ReactMouseEvent | ReactTouchEvent) => {
      setIsDragging(true);
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      setStartY(clientY);
      setDragOffset(0);
    },
    [],
  );

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - startY;
      setDragOffset(deltaY);

      // Apply drag offset to container
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${Math.max(0, deltaY)}px)`;
      }
    },
    [isDragging, startY],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !containerRef.current) return;

    const threshold = 50;
    const velocity = dragOffset;

    // Determine next snap point based on drag direction and distance
    if (velocity > threshold) {
      // Dragging down
      if (currentSnapIndex < snapPoints.length - 1) {
        setCurrentSnapIndex(currentSnapIndex + 1);
      } else {
        // Close if dragging down from the lowest snap point
        onClose();
      }
    } else if (velocity < -threshold && currentSnapIndex > 0) {
      // Dragging up
      setCurrentSnapIndex(currentSnapIndex - 1);
    }

    // Reset transform
    containerRef.current.style.transform = "";
    setDragOffset(0);
    setIsDragging(false);
  }, [isDragging, dragOffset, currentSnapIndex, snapPoints.length, onClose]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchMove = (e: TouchEvent) => handleDragMove(e);
      const handleTouchEnd = () => handleDragEnd();

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  // Remove from DOM when fully closed
  if (!shouldRender) {
    return null;
  }

  const currentHeight = getCurrentHeight(currentSnapIndex);

  return (
    <>
      <Backdrop
        className={overlayClassName}
        onClick={closeOnOverlayClick ? handleOverlayClick : undefined}
        style={{
          opacity:
            animationState === "entered" || animationState === "entering"
              ? 1
              : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: animationState === "exited" ? "none" : "auto",
        }}
      />
      <div
        {...restProps}
        ref={containerRef}
        className={clsx(
          containerStyle({ state: animationState, isDragging }),
          className,
        )}
        style={
          {
            ...style,
            height: currentHeight,
            maxHeight: currentHeight,
          } as CSSProperties
        }
        role="dialog"
        aria-modal="true"
      >
        {showHandle && (
          <button
            type="button"
            className={handleContainerStyle}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            aria-label="Drag to resize bottom sheet"
            aria-roledescription="Drag handle"
          >
            <div className={handleStyle} />
          </button>
        )}
        <div ref={contentRef} className={clsx(contentStyle, contentClassName)}>
          {children}
        </div>
      </div>
    </>
  );
};

const _BottomSheet = forwardRef(BottomSheet);
export { _BottomSheet as BottomSheet };
