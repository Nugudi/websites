"use client";

import type {
  RatingOption,
  ReviewRating,
} from "@cafeteria/presentation/shared/types";
import { Button } from "@nugudi/react-components-button";
import { VStack } from "@nugudi/react-components-layout";
import { Textarea } from "@nugudi/react-components-textarea";
import { CafeteriaImageUploadPlaceholder } from "../cafeteria-image-upload-placeholder";
import { CafeteriaRatingSelector } from "../cafeteria-rating-selector";

interface CafeteriaReviewWriteFormProps {
  ratingOptions: RatingOption[];
  selectedRatings: ReviewRating[];
  content: string;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  onRatingToggle: (rating: ReviewRating) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
}

export const CafeteriaReviewWriteForm = ({
  ratingOptions,
  selectedRatings,
  content,
  isSubmitDisabled,
  isSubmitting,
  onRatingToggle,
  onContentChange,
  onSubmit,
}: CafeteriaReviewWriteFormProps) => {
  return (
    <VStack gap={16}>
      <CafeteriaRatingSelector
        options={ratingOptions}
        selectedRatings={selectedRatings}
        onRatingToggle={onRatingToggle}
      />
      <VStack gap={12}>
        <Textarea
          placeholder="오늘의 메뉴 어떠셨나요?"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={10}
        />
        <CafeteriaImageUploadPlaceholder />
      </VStack>
      <Button
        color="main"
        variant="brand"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        isLoading={isSubmitting}
      >
        작성 완료
      </Button>
    </VStack>
  );
};
