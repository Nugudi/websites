"use client";

import { Button, GiftIcon, HomeIcon, PersonIcon } from "@nugudi/nugudi-ui";

export default function Home() {
  return (
    <div className="p-10">
      <h1 className="text-title1-semi28">너의 구로 디지털 단지</h1>
      <h1 className="font-bold text-green-500 text-title1-semi28">
        너의 구로 디지털 단지
      </h1>
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
