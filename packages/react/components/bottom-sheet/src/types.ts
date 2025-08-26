export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  initialHeight?: number;
  snapPoints?: number[];
  defaultSnapPoint?: number;
  containerId?: string;
}
