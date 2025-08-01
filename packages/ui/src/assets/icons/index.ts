/**
 * 🔧 아이콘 시스템 사용 가이드
 *
 * ## 📝 새 아이콘 추가하기:
 * 1. SVG 파일을 assets/icons/ 폴더에 넣기
 * 2. 아래 import 섹션에 추가: import NewIcon from "@/assets/icons/new-icon.svg?react";
 * 3. iconRegistry에 등록:
 *    NewIcon: {
 *      component: NewIcon,
 *      tags: ["english", "한국어", "키워드"]
 *    }
 * 4. src/index.ts에도 추가: export { default as NewIcon } from "./assets/icons/new-icon.svg?react";
 *
 */

// Icon imports
import AppleIcon from "@/assets/icons/apple.svg?react";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import ArrowUpCircleIcon from "@/assets/icons/arrow-up-circle.svg?react";
import BusIcon from "@/assets/icons/bus.svg?react";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import CameraIcon from "@/assets/icons/camera.svg?react";
import EtcIcon from "@/assets/icons/etc.svg?react";
import ExitIcon from "@/assets/icons/exit.svg?react";
import FillHeartIcon from "@/assets/icons/fill-heart.svg?react";
import FolderIcon from "@/assets/icons/folder.svg?react";
import GiftIcon from "@/assets/icons/gift.svg?react";
import GoogleIcon from "@/assets/icons/google.svg?react";
import HeartIcon from "@/assets/icons/heart.svg?react";
import HomeIcon from "@/assets/icons/home.svg?react";
import KakaoIcon from "@/assets/icons/kakao.svg?react";
import MajorDishIcon from "@/assets/icons/major-dish.svg?react";
import NaverIcon from "@/assets/icons/naver.svg?react";
import NoodleIcon from "@/assets/icons/noodle.svg?react";
import NotiIcon from "@/assets/icons/noti.svg?react";
import PenIcon from "@/assets/icons/pen.svg?react";
import PersonIcon from "@/assets/icons/person.svg?react";
import PicklesIcon from "@/assets/icons/pickles.svg?react";
import RiceIcon from "@/assets/icons/rice.svg?react";
import ShareIcon from "@/assets/icons/share.svg?react";
import SoupIcon from "@/assets/icons/soup.svg?react";
import SubDishIcon from "@/assets/icons/sub-dish.svg?react";
import TeaIcon from "@/assets/icons/tea.svg?react";
import type { IconRegistry } from "@/types/icon";

// 아이콘 레지스트리
export const iconRegistry: IconRegistry = {
  Apple: {
    component: AppleIcon,
    tags: ["apple", "사과", "과일", "음식"],
  },
  Rice: {
    component: RiceIcon,
    tags: ["rice", "밥", "쌀", "음식"],
  },
  Noodle: {
    component: NoodleIcon,
    tags: ["noodle", "면", "국수", "라면", "파스타", "음식"],
  },
  Soup: {
    component: SoupIcon,
    tags: ["soup", "국", "탕", "찌개", "음식"],
  },
  MajorDish: {
    component: MajorDishIcon,
    tags: ["major", "dish", "주요리", "메인요리", "음식"],
  },
  SubDish: {
    component: SubDishIcon,
    tags: ["sub", "dish", "반찬", "부식", "음식"],
  },
  Pickles: {
    component: PicklesIcon,
    tags: ["pickles", "절임", "반찬", "김치", "음식"],
  },
  Tea: {
    component: TeaIcon,
    tags: ["tea", "차", "음료", "티"],
  },
  ArrowLeft: {
    component: ArrowLeftIcon,
    tags: ["arrow", "left", "화살표", "뒤로", "이전"],
  },
  ArrowUpCircle: {
    component: ArrowUpCircleIcon,
    tags: ["arrow", "up", "화살표", "위"],
  },
  Home: {
    component: HomeIcon,
    tags: ["home", "집", "홈", "메인"],
  },
  Exit: {
    component: ExitIcon,
    tags: ["exit", "나가기", "종료", "로그아웃"],
  },
  Google: {
    component: GoogleIcon,
    tags: ["google", "구글", "로그인", "소셜"],
  },
  Kakao: {
    component: KakaoIcon,
    tags: ["kakao", "카카오", "로그인", "소셜"],
  },
  Naver: {
    component: NaverIcon,
    tags: ["naver", "네이버", "로그인", "소셜"],
  },
  Heart: {
    component: HeartIcon,
    tags: ["heart", "하트", "좋아요", "즐겨찾기"],
  },
  FillHeart: {
    component: FillHeartIcon,
    tags: ["heart", "fill", "하트", "좋아요", "즐겨찾기"],
  },
  Etc: {
    component: EtcIcon,
    tags: ["etc", "기타", "더보기", "메뉴"],
  },
  Folder: {
    component: FolderIcon,
    tags: ["folder", "폴더", "파일"],
  },
  Pen: {
    component: PenIcon,
    tags: ["pen", "펜", "쓰기", "편집", "작성"],
  },
  Share: {
    component: ShareIcon,
    tags: ["share", "공유"],
  },
  Bus: {
    component: BusIcon,
    tags: ["bus", "버스", "교통", "대중교통"],
  },
  Camera: {
    component: CameraIcon,
    tags: ["camera", "카메라", "사진", "촬영"],
  },
  Calendar: {
    component: CalendarIcon,
    tags: ["calendar", "달력", "날짜", "일정", "스케줄"],
  },
  Noti: {
    component: NotiIcon,
    tags: ["notification", "알림", "메시지", "공지"],
  },
  Person: {
    component: PersonIcon,
    tags: ["person", "사람", "사용자", "프로필", "계정"],
  },
  Gift: {
    component: GiftIcon,
    tags: ["gift", "선물", "이벤트", "리워드"],
  },
};

// 유틸리티 함수
export const searchIcons = (searchTerm: string) => {
  const searchLower = searchTerm.toLowerCase();
  return Object.entries(iconRegistry).filter(
    ([name, data]) =>
      name.toLowerCase().includes(searchLower) ||
      data.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
  );
};

// 편의를 위한 별칭
export const icons = iconRegistry;
