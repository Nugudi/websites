import { UserFillIcon } from "@nugudi/assets-icons";
import { vars } from "@nugudi/themes";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { clsx } from "clsx";
import React, { useCallback, useState } from "react";
import * as styles from "./style.css";
import type { AvatarProps } from "./types";

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      alt,
      src,
      size = "md",
      showBadge = false,
      badgeColor = "main",
      onError,
      icon,
      borderRadius = "full",
      className,
      style,
      imgElement,
      imgProps,
      ...restProps
    },
    ref,
  ) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = useCallback(() => {
      setImageError(true);
      onError?.();
    }, [onError]);

    const showImage = (src || imgElement || imgProps) && !imageError;
    const showIcon = !showImage;

    // 뱃지 색상 CSS 변수 값 설정 - 500 shade 사용 (중간 톤)
    const badgeColorValue = showBadge
      ? vars.colors.$scale[badgeColor][500]
      : vars.colors.$scale.zinc[200];

    const renderImage = () => {
      if (imgElement) {
        const element = imgElement as React.ReactElement<
          React.ImgHTMLAttributes<HTMLImageElement>
        >;
        return React.cloneElement(element, {
          className: styles.avatarImage,
          onError: handleImageError,
          alt: alt || element.props?.alt || "아바타 이미지",
        });
      }

      if (imgProps) {
        return (
          // biome-ignore lint/performance/noImgElement: This component supports Next.js Image through imgElement prop
          <img
            {...imgProps}
            alt={alt || imgProps.alt || "아바타 이미지"}
            onError={handleImageError}
            className={styles.avatarImage}
          />
        );
      }

      // src만 사용하는 경우
      return (
        // biome-ignore lint/performance/noImgElement: This component supports Next.js Image through imgElement prop
        <img
          src={src}
          alt={alt || "아바타 이미지"}
          onError={handleImageError}
          className={styles.avatarImage}
        />
      );
    };

    return (
      <span
        ref={ref}
        className={clsx(
          styles.avatarContainer({
            size,
            borderRadius,
            showBadge,
          }),
          className,
        )}
        style={{
          ...assignInlineVars({
            [styles.badgeBorderColorVar]: badgeColorValue,
            [styles.badgeBackgroundColorVar]: badgeColorValue,
          }),
          ...style,
        }}
        {...restProps}
      >
        <span className={styles.avatarInner({ borderRadius })}>
          {showImage && renderImage()}

          {showIcon && (
            <span
              className={styles.avatarFallback}
              role="img"
              aria-label={alt || "아바타 이미지"}
            >
              {icon || (
                <UserFillIcon
                  className={styles.avatarIcon}
                  aria-hidden="true"
                />
              )}
            </span>
          )}
        </span>

        {showBadge && (
          <span className={styles.avatarBadge({ size })} aria-hidden="true" />
        )}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";
