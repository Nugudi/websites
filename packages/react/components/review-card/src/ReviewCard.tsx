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
import {
  badgeScrollContainer,
  cardContainer,
  imageStyle,
  rightIconContainer,
} from "./style.css";
import type { ReviewCardProps } from "./types";

export const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  function ReviewCard(props, ref) {
    const {
      username,
      userLevel,
      imageUrl,
      imageAs,
      imageAlt = "리뷰 이미지",
      reviewText: review,
      badges = [],
      className,
      onClick,
      date,
      rightIcon,
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
          {/* User Header */}
          <HStack justify="space-between" align="center" width="100%">
            <HStack gap={8} align="center">
              <Body fontSize="b3" color="zinc" colorShade={800}>
                {username}
              </Body>
              <Badge tone="positive" variant="weak" size="xs">
                Lv.{userLevel}
              </Badge>
            </HStack>
            <Emphasis fontSize="e1" color="zinc" colorShade={500} as="span">
              {date}
            </Emphasis>
          </HStack>

          {/* Main Content */}
          <VStack gap={8}>
            {imageUrl && (
              <ImageCard
                className={imageStyle}
                as={imageAs}
                src={imageUrl}
                alt={imageAlt}
              />
            )}
            <Body fontSize="b3" color="zinc" colorShade={700}>
              {review}
            </Body>
          </VStack>

          {/* Badges and Right Icon */}
          {(badges.length > 0 || rightIcon) && (
            <HStack
              justify="space-between"
              align="center"
              width="100%"
              gap={32}
            >
              {badges.length > 0 ? (
                <Box className={badgeScrollContainer}>
                  {badges.map((badgeItem) => (
                    <Badge
                      key={`${badgeItem.emoji}-${badgeItem.label}`}
                      icon={<span>{badgeItem.emoji}</span>}
                    >
                      {badgeItem.label}
                    </Badge>
                  ))}
                </Box>
              ) : (
                <div />
              )}
              {rightIcon && (
                <Box className={rightIconContainer}>{rightIcon}</Box>
              )}
            </HStack>
          )}
        </VStack>
      </Box>
    );
  },
);
