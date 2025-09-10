import clsx from "clsx";
import React, { Children, cloneElement, isValidElement } from "react";
import { Avatar } from "./Avatar";
import * as styles from "./style.css";
import type { AvatarGroupProps } from "./types";

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max = 3, size = "md", children, className, style, ...restProps }, ref) => {
    // children 중 Avatar 컴포넌트만 필터링
    const validChildren = Children.toArray(children).filter(
      (child) => isValidElement(child) && child.type === Avatar,
    );

    const excess = validChildren.length - max;
    const childrenToShow =
      excess > 0 ? validChildren.slice(0, max) : validChildren;

    return (
      <div
        ref={ref}
        className={clsx(styles.avatarGroup, className)}
        style={style}
        {...restProps}
      >
        {childrenToShow.map((child, index) => {
          if (!isValidElement(child)) return null;

          const avatarChild = child as React.ReactElement<
            React.ComponentProps<typeof Avatar>
          >;
          const childKey = avatarChild.key || `avatar-${index}`;
          const childSize = avatarChild.props.size || size;

          return cloneElement(avatarChild, {
            key: childKey,
            size: childSize,
            className: clsx(
              styles.avatarGroupItem({ size: childSize }),
              avatarChild.props.className,
            ),
            style: {
              ...avatarChild.props.style,
              zIndex: validChildren.length - index,
            },
          });
        })}

        {excess > 0 && (
          <span
            className={clsx(
              styles.avatarContainer({
                size,
                borderRadius: "full",
                showBadge: false,
              }),
              styles.avatarGroupExcess({ size }),
              styles.avatarGroupItem({ size }),
            )}
          >
            +{excess}
          </span>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
