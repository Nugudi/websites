// Icon imports
import AppleIcon from "./svg/apple.svg?react";
import ArrowLeftIcon from "./svg/arrow-left.svg?react";
import ArrowRightIcon from "./svg/arrow-right.svg?react";
import ArrowUpCircleIcon from "./svg/arrow-up-circle.svg?react";
import BreadIcon from "./svg/bread.svg?react";
import BusIcon from "./svg/bus.svg?react";
import CalendarIcon from "./svg/calendar.svg?react";
import CameraIcon from "./svg/camera.svg?react";
import CameraLineIcon from "./svg/camera-line.svg?react";
import ClockIcon from "./svg/clock.svg?react";
import CoinIcon from "./svg/coin.svg?react";
import CommentIcon from "./svg/comment.svg?react";
import EtcIcon from "./svg/etc.svg?react";
import ExitIcon from "./svg/exit.svg?react";
import EyeIcon from "./svg/eye.svg?react";
import EyeOffIcon from "./svg/eye_off.svg?react";
import FailIcon from "./svg/failure.svg?react";
import FillHeartIcon from "./svg/fill-heart.svg?react";
import FolderIcon from "./svg/folder.svg?react";
import GiftIcon from "./svg/gift.svg?react";
import GoogleIcon from "./svg/google.svg?react";
import HeartIcon from "./svg/heart.svg?react";
import HomeIcon from "./svg/home.svg?react";
import KakaoIcon from "./svg/kakao.svg?react";
import LogoTextIcon from "./svg/logo_text.svg?react";
import MajorDishIcon from "./svg/major-dish.svg?react";
import NaverIcon from "./svg/naver.svg?react";
import NoodleIcon from "./svg/noodle.svg?react";
import NotiIcon from "./svg/noti.svg?react";
import PackagingIcon from "./svg/packaging.svg?react";
import PenIcon from "./svg/pen.svg?react";
import PencilIcon from "./svg/pencil.svg?react";
import PersonIcon from "./svg/person.svg?react";
import PicklesIcon from "./svg/pickles.svg?react";
import RiceIcon from "./svg/rice.svg?react";
import ShareIcon from "./svg/share.svg?react";
import SoupIcon from "./svg/soup.svg?react";
import SubDishIcon from "./svg/sub-dish.svg?react";
import SuccessIcon from "./svg/success.svg?react";
import TeaIcon from "./svg/tea.svg?react";
import type { IconRegistry } from "./types/icon";

// 아이콘 레지스트리
export const iconRegistry: IconRegistry = {
  LogoText: {
    component: LogoTextIcon,
    tags: ["logo", "text", "너구디", "로고"],
  },
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
  CameraLine: {
    component: CameraLineIcon,
    tags: ["camera", "line", "카메라"],
  },
  Comment: {
    component: CommentIcon,
    tags: ["comment", "댓글"],
  },
  Success: {
    component: SuccessIcon,
    tags: ["success", "성공"],
  },
  Fail: {
    component: FailIcon,
    tags: ["fail", "실패"],
  },
  Eye: {
    component: EyeIcon,
    tags: ["eye", "눈", "보기"],
  },
  EyeOff: {
    component: EyeOffIcon,
    tags: ["eye", "off", "눈"],
  },
  ArrowRight: {
    component: ArrowRightIcon,
    tags: ["arrow", "right", "화살표", "오른쪽"],
  },
  Coin: {
    component: CoinIcon,
    tags: ["coin", "코인", "point", "포인트"],
  },
  Pencil: {
    component: PencilIcon,
    tags: ["pencil", "펜", "쓰기", "편집", "작성"],
  },
  Bread: {
    component: BreadIcon,
    tags: ["bread", "빵", "토스트", "샌드위치"],
  },
  Clock: {
    component: ClockIcon,
    tags: ["clock", "시간", "시계"],
  },
  Packaging: {
    component: PackagingIcon,
    tags: ["packaging", "포장", "포장 가능"],
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
