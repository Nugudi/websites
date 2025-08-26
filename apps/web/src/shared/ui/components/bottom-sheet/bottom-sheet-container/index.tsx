"use client";

import { Backdrop } from "@nugudi/react-components-backdrop";
import { BottomSheet } from "@nugudi/react-components-bottom-sheet";
import { Button } from "@nugudi/react-components-button";
import { useState } from "react";

export const BottomSheetContainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="brand" color="main" size="lg" onClick={handleOpen}>
        Show Bottom Sheet
      </Button>

      {/* Backdrop - covers entire screen */}
      {isOpen && <Backdrop onClick={handleClose} />}

      {/* Bottom Sheet - renders within mobile layout */}
      {isOpen && (
        <BottomSheet
          isOpen={isOpen}
          onClose={handleClose}
          snapPoints={[20, 50, 90]}
        >
          <h3>Bottom Sheet Content</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
            nesciunt, voluptatem expedita cupiditate corporis explicabo velit
            soluta nihil!
          </p>
          <p>
            This bottom sheet can be dragged up and down. Drag it to the bottom
            to close, or click on the backdrop.
          </p>
        </BottomSheet>
      )}
    </>
  );
};
