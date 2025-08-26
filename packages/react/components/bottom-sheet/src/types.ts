export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  initialHeight?: number;
  snapPoints?: number[];
  defaultSnapPoint?: number;
  containerRef?: React.RefObject<HTMLElement | null>;
  maxHeightPercentage?: number;
  closeThresholdRatio?: number;
}
