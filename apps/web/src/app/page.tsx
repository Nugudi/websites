"use client";

import {
  Button,
  GiftIcon,
  HomeIcon,
  PersonIcon,
  Typography,
} from "@nugudi/nugudi-ui";

export default function Home() {
  return (
    <div className="h-screen bg-gray-300 p-10">
      <Typography size="t1" color="main-500">
        Typography T1 - 너의 구로 디지털 단지
      </Typography>

      <Typography size="b1" color="main-500">
        Typography B1 - 본문 텍스트
      </Typography>
      <Typography size="b3b" color="zinc-50">
        Typography B3-BOLD - 볼드 텍스트
      </Typography>
      <Typography size="b4b" color="zinc-50">
        Typography B4-BOLD - 각주 텍스트
      </Typography>
      <Typography size="e1" color="zinc-50">
        Typography E1 - 캡션 텍스트
      </Typography>
      <Typography size="e2" color="zinc-50">
        Typography E2 - 캡션 텍스트
      </Typography>
      <Typography size="h1">Typography H1 - 메인 헤더 텍스트</Typography>

      <Button variant="brand" size="md">
        너구디 버튼
      </Button>
      <div className="flex flex-col gap-4 ">
        <h2>아이콘 라이브러리</h2>
        <HomeIcon className="text-gray-400" />
        <GiftIcon color="#00b23e" />
        <PersonIcon />
      </div>
    </div>
  );
}
