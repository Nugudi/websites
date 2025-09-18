"use client";

import {
  BreadIcon,
  CoinIcon,
  CommentIcon,
  GiftIcon,
  NotiIcon,
} from "@nugudi/assets-icons";
import { Avatar } from "@nugudi/react-components-avatar";
import { Box, Flex, HStack } from "@nugudi/react-components-layout";
import type { NotificationItem } from "../../../types/notification";
import * as styles from "./index.css";

interface NotificationItemProps {
  notification: NotificationItem;
  onClick?: (notification: NotificationItem) => void;
}

export function NotificationItemCard({
  notification,
  onClick,
}: NotificationItemProps) {
  const handleClick = () => onClick?.(notification);
  const isUnread = !notification.isRead;

  return (
    <Box
      className={`${styles.notificationItem} ${isUnread ? styles.unread : styles.read}`}
      onClick={handleClick}
    >
      <HStack gap={24} align="center" justify="center">
        <NotificationItemAvatar notification={notification} />
        <Flex direction="column" className={styles.contentWrapper}>
          <NotificationItemHeader notification={notification} />
          <NotificationItemContent notification={notification} />
          <NotificationItemAction notification={notification} />
        </Flex>
      </HStack>
    </Box>
  );
}

interface NotificationItemAvatarProps
  extends Pick<NotificationItemProps, "notification"> {}

function NotificationItemAvatar({ notification }: NotificationItemAvatarProps) {
  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "point":
        return <CoinIcon className={styles.iconStyle} />;
      case "review":
        return <CommentIcon className={styles.iconStyle} />;
      case "menu":
        return <BreadIcon className={styles.iconStyle} />;
      case "event":
        return <GiftIcon className={styles.iconStyle} />;
      case "notice":
        return <NotiIcon className={styles.iconStyle} />;
      default:
        return <NotiIcon className={styles.iconStyle} />;
    }
  };

  if (notification.icon) {
    return <Avatar src={notification.icon} size="sm" />;
  }

  return <Box className={styles.iconWrapper}>{getIcon(notification.type)}</Box>;
}

interface NotificationItemHeaderProps
  extends Pick<NotificationItemProps, "notification"> {}

function NotificationItemHeader({ notification }: NotificationItemHeaderProps) {
  return (
    <HStack justify="space-between" align="flex-start">
      <span className={styles.title}>{notification.title}</span>
      <span className={styles.timestamp}>{notification.timestamp}</span>
    </HStack>
  );
}

interface NotificationItemContentProps
  extends Pick<NotificationItemProps, "notification"> {}

function NotificationItemContent({
  notification,
}: NotificationItemContentProps) {
  return <span className={styles.content}>{notification.content}</span>;
}

interface NotificationItemActionProps
  extends Pick<NotificationItemProps, "notification"> {}

function NotificationItemAction({ notification }: NotificationItemActionProps) {
  if (!notification.link) {
    return null;
  }

  return <span className={styles.linkText}>35건 더보기</span>;
}
