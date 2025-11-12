"use client";

import { PencilIcon } from "@nugudi/assets-icons";
import { Flex } from "@nugudi/react-components-layout";
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
      <div className="h-[60px] w-[60px] animate-pulse rounded-full bg-zinc-200" />
      <Flex className={styles.infoWrapper}>
        <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="h-7 w-24 animate-pulse rounded bg-zinc-200" />
      </Flex>
      <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-200" />
    </Flex>
  );
};

// Error Component
const UserProfileSectionError = () => {
  return (
    <Flex className={styles.container}>
      <Image
        priority
        src="/images/nuguri.webp"
        alt="profile"
        width={60}
        height={60}
        className={styles.profileImage}
      />
      <Flex className={styles.infoWrapper}>
        <span className={styles.levelText}>Lv.1 기본 너구리</span>
        <Flex gap={4} align="end">
          <h1 className={styles.nameText}>
            손님 <span className={styles.nameSuffix}>님</span>
          </h1>
        </Flex>
      </Flex>
      <Link href="/profile/edit" className={styles.editButton}>
        <PencilIcon />
      </Link>
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
        src={profileImageUrl ?? "/images/nuguri.webp"}
        alt="profile"
        width={60}
        height={60}
        className={styles.profileImage}
      />
      <Flex className={styles.infoWrapper}>
        <span className={styles.levelText}>Lv.1 기본 너구리</span>
        <Flex gap={4} align="end">
          <h1 className={styles.nameText}>
            {nickname} <span className={styles.nameSuffix}>님</span>
          </h1>
        </Flex>
      </Flex>
      <Link href="/profile/edit" className={styles.editButton}>
        <PencilIcon />
      </Link>
    </Flex>
  );
};
