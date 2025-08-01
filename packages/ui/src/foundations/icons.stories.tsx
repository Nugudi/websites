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
import ShardIcon from "@/assets/icons/shard.svg?react";
import SoupIcon from "@/assets/icons/soup.svg?react";
import SubDishIcon from "@/assets/icons/sub-dish.svg?react";
import TeaIcon from "@/assets/icons/tea.svg?react";

import {
  iconCode,
  iconContainer,
  iconGrid,
  iconLibraryContainer,
  iconLibraryTitle,
} from "./icons.css";

const icons = {
  Apple: AppleIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowUpCircle: ArrowUpCircleIcon,
  Bus: BusIcon,
  Calendar: CalendarIcon,
  Camera: CameraIcon,
  Etc: EtcIcon,
  Exit: ExitIcon,
  Folder: FolderIcon,
  Gift: GiftIcon,
  Google: GoogleIcon,
  Heart: HeartIcon,
  Home: HomeIcon,
  Kakao: KakaoIcon,
  MajorDish: MajorDishIcon,
  Naver: NaverIcon,
  Noodle: NoodleIcon,
  Noti: NotiIcon,
  Pen: PenIcon,
  Person: PersonIcon,
  Pickles: PicklesIcon,
  Rice: RiceIcon,
  Shard: ShardIcon,
  Soup: SoupIcon,
  SubDish: SubDishIcon,
  Tea: TeaIcon,
  FillHeart: FillHeartIcon,
};

export default {
  title: "Foundations/Icons",
};

export const Icons = () => (
  <div className={iconLibraryContainer}>
    <section>
      <h1 className={iconLibraryTitle}>너구디 Icon Library</h1>

      <div className={iconGrid}>
        {Object.entries(icons).map(([name, Icon]) => (
          <div key={name} className={iconContainer}>
            <Icon width={24} height={24} />
            <code className={iconCode}>{name}Icon</code>
          </div>
        ))}
      </div>
    </section>
  </div>
);
