"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RATING_OPTIONS } from "../../../constants/review";
import {
  type ReviewFormData,
  reviewSchema,
} from "../../../schemas/review-schema";
import type { ReviewRating } from "../../../types/review-rating";
import { ReviewWriteForm } from "../../components/review-write-form";

interface ReviewWriteSectionProps {
  cafeteriaId: string;
}

export const ReviewWriteSection = ({
  cafeteriaId,
}: ReviewWriteSectionProps) => {
  const {
    watch,
    setValue,
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

  const ratings = watch("ratings");
  const content = watch("content");

  const handleRatingToggle = (rating: ReviewRating) => {
    const currentRatings = ratings || [];
    if (currentRatings.includes(rating)) {
      setValue(
        "ratings",
        currentRatings.filter((r) => r !== rating),
        {
          shouldValidate: true,
        },
      );
    } else {
      setValue("ratings", [...currentRatings, rating], {
        shouldValidate: true,
      });
    }
  };

  const handleContentChange = (value: string) => {
    setValue("content", value, { shouldValidate: true });
  };

  const onSubmit = async (data: ReviewFormData) => {
    // TODO: API 호출 구현
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Submitting review:", { cafeteriaId, ...data });
  };

  return (
    <ReviewWriteForm
      ratingOptions={RATING_OPTIONS}
      selectedRatings={ratings}
      content={content}
      isSubmitDisabled={!isValid || isSubmitting}
      isSubmitting={isSubmitting}
      onRatingToggle={handleRatingToggle}
      onContentChange={handleContentChange}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};
