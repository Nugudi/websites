import { Badge } from "@nugudi/react-components-badge";
import { ImageCard } from "@nugudi/react-components-image-card";
import {
  Body,
  Box,
  Emphasis,
  HStack,
  VStack,
} from "@nugudi/react-components-layout";
import { clsx } from "clsx";
import React from "react";
import { cardContainer, imageStyle } from "./style.css";
import type { ReviewCardProps } from "./types";

export const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  function ReviewCard(props, ref) {
    const {
      imageUrl,
      imageAs,
      reviewText: review,
      badges = [],
      className,
      onClick,
      date,
      // Extract color to prevent conflict with Box's color prop
      color: _color,
      ...rest
    } = props;

    return (
      <Box
        {...rest}
        ref={ref}
        className={clsx([cardContainer, className])}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        <VStack gap={16} p="4">
          <VStack gap={8}>
            {imageUrl && (
              <ImageCard
                className={imageStyle}
                as={imageAs}
                src={imageUrl}
                alt="메뉴 사진"
              />
            )}
            <Emphasis fontSize="e1" color="zinc" colorShade={500} as="span">
              {date}
            </Emphasis>
            <Body fontSize="b3" color="zinc" colorShade={700}>
              {review}
            </Body>
          </VStack>

          {badges.length > 0 && (
            <HStack gap={4}>
              {badges.map((badgeItem) => (
                <Badge
                  key={badgeItem.label}
                  icon={<span>{badgeItem.emoji}</span>}
                >
                  {badgeItem.label}
                </Badge>
              ))}
            </HStack>
          )}
        </VStack>
      </Box>
    );
  },
);
