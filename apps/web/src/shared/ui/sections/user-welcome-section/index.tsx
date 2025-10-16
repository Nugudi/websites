"use client";

import { Box } from "@nugudi/react-components-layout";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { userProfileQueryClient } from "@/src/domains/user/hooks/queries/user-profile.query";
import * as styles from "./index.css";

// Main Section Component (with boundaries)
export const UserWelcomeSection = () => {
  return (
    <ErrorBoundary fallback={<UserWelcomeSectionError />}>
      <Suspense fallback={<UserWelcomeSectionSkeleton />}>
        <UserWelcomeSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};

// Skeleton Component
const UserWelcomeSectionSkeleton = () => {
  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <div className="flex flex-col gap-2">
          <div className="h-7 w-44 animate-pulse rounded bg-zinc-200" />
          <div className="h-7 w-52 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
      <div
        className="absolute right-[-4px] bottom-[-16px] h-[110px] w-[110px] animate-pulse rounded-lg bg-zinc-100"
        aria-hidden="true"
      />
    </Box>
  );
};

// Error Component
const UserWelcomeSectionError = () => {
  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>손님</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
      <Image
        src="/images/level-2-nuguri.png"
        alt="level-2 너구리"
        aria-hidden="true"
        className={styles.image}
        width={150}
        height={100}
        priority
      />
    </Box>
  );
};

// Content Component (actual data fetching)
const UserWelcomeSectionContent = () => {
  // Page에서 prefetch한 데이터를 동일한 query로 조회
  // HTTP 클라이언트가 자동으로 인증 토큰을 헤더에 추가합니다
  const { data } = useSuspenseQuery(userProfileQueryClient);

  const nickname = data.data.data?.profile?.nickname ?? "손님";
  const profileImageUrl = data.data.data?.profile?.profileImageUrl;

  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>{nickname}</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
      <Image
        src={profileImageUrl ?? "/images/level-2-nuguri.png"}
        alt="level-2 너구리"
        aria-hidden="true"
        className={styles.image}
        width={150}
        height={100}
        priority
      />
    </Box>
  );
};
