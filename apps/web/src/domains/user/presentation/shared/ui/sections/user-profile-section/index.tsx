"use client";

import { PencilIcon } from "@nugudi/assets-icons";
import { Badge } from "@nugudi/react-components-badge";
import { Body, Flex, HStack, Title } from "@nugudi/react-components-layout";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useUserProfile } from "@/src/domains/user/presentation/client/hooks";
import * as styles from "./index.css";

// Main Section Component (with boundaries)
export const UserProfileSection = () => {
  return (
    <ErrorBoundary fallback={<UserProfileSectionError />}>
      <Suspense fallback={<UserProfileSectionSkeleton />}>
        <UserProfileSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

// Skeleton Component
const UserProfileSectionSkeleton = () => {
  return (
    <Flex className={styles.container}>
      <div className="h-[130px] w-[165px] animate-pulse bg-zinc-200" />
      <Flex className={styles.infoWrapper}>
        <div className="h-5 w-10 animate-pulse rounded bg-zinc-200" />
        <Flex direction="column" gap={4}>
          <div className="h-6 w-24 animate-pulse rounded bg-zinc-200" />
          <Flex gap={4} align="center">
            <div className="h-5 w-16 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-4 animate-pulse rounded bg-zinc-200" />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

// Error Component
const UserProfileSectionError = () => {
  return (
    <Flex className={styles.container}>
      <Image
        priority
        src="/images/intern-nuguri.png"
        alt="profile"
        width={165}
        height={130}
        className={styles.profileImage}
      />
      <Flex className={styles.infoWrapper}>
        <Badge tone="positive" size="xs" variant="weak">
          Lv.1
        </Badge>
        <Flex direction="column" gap={4}>
          <Title fontSize="t3" color="main" colorShade={800}>
            인턴 너구리
          </Title>
          <HStack gap={4} align="center">
            <Body fontSize="b3b" colorShade={700}>
              손님
            </Body>
            <Link href="/profile/edit" className={styles.editButton}>
              <PencilIcon width={16} height={16} />
            </Link>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
};

// Content Component (actual data fetching)
const UserProfileSectionContent = () => {
  const { data: profileData } = useUserProfile();

  const nickname = profileData.nickname ?? "손님";
  const profileImageUrl = profileData.profileImageUrl;

  return (
    <Flex className={styles.container}>
      <Image
        priority
        src={profileImageUrl ?? "/images/intern-nuguri.png"}
        alt="profile"
        width={165}
        height={130}
        className={styles.profileImage}
      />
      <Flex className={styles.infoWrapper}>
        <Badge tone="positive" size="xs" variant="weak">
          Lv.1
        </Badge>
        <Flex direction="column" gap={4}>
          <Title fontSize="t3" color="main" colorShade={800}>
            인턴 너구리
          </Title>
          <HStack gap={4} align="center">
            <Body fontSize="b3b" colorShade={700}>
              {nickname}
            </Body>
            <Link href="/profile/edit" className={styles.editButton}>
              <PencilIcon width={16} height={16} />
            </Link>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
};
