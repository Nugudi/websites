import { Chip } from "@nugudi/react-components-chip";
import { Box, HStack } from "@nugudi/react-components-layout";
import type { ReviewRating } from "../../../types/review-rating";
import * as styles from "./index.css";

interface RatingOption {
  value: ReviewRating;
  label: string;
  emoji: string;
}

interface RatingSelectorProps {
  options: readonly RatingOption[];
  selectedRatings: Array<ReviewRating>;
  onRatingToggle: (rating: ReviewRating) => void;
}

export const RatingSelector = ({
  options,
  selectedRatings,
  onRatingToggle,
}: RatingSelectorProps) => {
  return (
    <Box className={styles.scrollContainer}>
      <HStack gap={8} className={styles.scrollContent}>
        {options.map((option) => (
          <Chip
            icon={option.emoji}
            label={option.label}
            key={option.value}
            variant={
              selectedRatings.includes(option.value) ? "primary" : "default"
            }
            onClick={() => onRatingToggle(option.value)}
            className={styles.ratingChip}
          />
        ))}
      </HStack>
    </Box>
  );
};
