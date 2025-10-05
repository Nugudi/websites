import { Chip } from "@nugudi/react-components-chip";
import { Box, HStack } from "@nugudi/react-components-layout";
import type { RatingOption, ReviewRating } from "../../../types/review-rating";
import * as styles from "./index.css";

interface CafeteriaRatingSelectorProps {
  options: readonly RatingOption[];
  selectedRatings: ReviewRating[];
  onRatingToggle: (rating: ReviewRating) => void;
}

export const CafeteriaRatingSelector = ({
  options,
  selectedRatings,
  onRatingToggle,
}: CafeteriaRatingSelectorProps) => {
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
