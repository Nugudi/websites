"use client";

import { Button } from "@nugudi/react-components-button";
import { VStack } from "@nugudi/react-components-layout";
import { Textarea } from "@nugudi/react-components-textarea";
import type { RatingOption, ReviewRating } from "../../../types/review-rating";
import { ImageUploadPlaceholder } from "../image-upload-placeholder";
import { RatingSelector } from "../rating-selector";

interface ReviewWriteFormProps {
  ratingOptions: RatingOption[];
  selectedRatings: ReviewRating[];
  content: string;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  onRatingToggle: (rating: ReviewRating) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
}

export const ReviewWriteForm = ({
  ratingOptions,
  selectedRatings,
  content,
  isSubmitDisabled,
  isSubmitting,
  onRatingToggle,
  onContentChange,
  onSubmit,
}: ReviewWriteFormProps) => {
  return (
    <VStack gap={16}>
      <RatingSelector
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
        <ImageUploadPlaceholder />
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
