"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { RATING_OPTIONS } from "../../../constants/review";
import {
  type ReviewFormData,
  reviewSchema,
} from "../../../schemas/review-schema";
import type { ReviewRating } from "../../../types/review-rating";
import { CafeteriaReviewWriteForm } from "../../components/cafeteria-review-write-form";

interface CafeteriaReviewWriteSectionProps {
  cafeteriaId: string;
}

export const CafeteriaReviewWriteSection = ({
  cafeteriaId,
}: CafeteriaReviewWriteSectionProps) => {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    mode: "onChange",
    defaultValues: {
      ratings: [],
      content: "",
    },
  });

  const toggleRating = (
    currentRatings: ReviewRating[],
    rating: ReviewRating,
  ): ReviewRating[] => {
    if (currentRatings.includes(rating)) {
      return currentRatings.filter((r) => r !== rating);
    }
    return [...currentRatings, rating];
  };

  const onSubmit = async (_data: ReviewFormData) => {
    // TODO: API 호출 구현
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <Controller
      name="ratings"
      control={control}
      render={({ field: ratingsField }) => (
        <Controller
          name="content"
          control={control}
          render={({ field: contentField }) => (
            <CafeteriaReviewWriteForm
              ratingOptions={RATING_OPTIONS}
              selectedRatings={ratingsField.value}
              content={contentField.value}
              isSubmitDisabled={!isValid || isSubmitting}
              isSubmitting={isSubmitting}
              onRatingToggle={(rating: ReviewRating) => {
                ratingsField.onChange(toggleRating(ratingsField.value, rating));
              }}
              onContentChange={contentField.onChange}
              onSubmit={handleSubmit(onSubmit)}
            />
          )}
        />
      )}
    />
  );
};
