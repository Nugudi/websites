import type { HTMLAttributes, PropsWithChildren } from "react";

export type BottomSheetProps = PropsWithChildren<
  {
    isOpen: boolean;
    onClose: () => void;
    snapPoints?: number[];
    defaultSnapPoint?: number;
    showHandle?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    overlayClassName?: string;
    contentClassName?: string;
  } & HTMLAttributes<HTMLDivElement>
>;
