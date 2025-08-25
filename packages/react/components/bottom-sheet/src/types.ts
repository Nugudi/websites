export type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: number[];
  defaultSnapPoint?: number;
  children?: React.ReactNode;
  showHandle?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;