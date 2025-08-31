export interface Badge {
  emoji: string;
  label: string;
}

export interface ReviewCardProps {
  // Optional props for next Image
  imageUrl?: string;
  imageAs?: React.ElementType;
  date: string;
  reviewText: string;
  badges?: Badge[];
  className?: string;
  onClick?: () => void;
}
