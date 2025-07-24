import GiftIcon from "@/assets/icons/gift.svg?react";
import HomeIcon from "@/assets/icons/home.svg?react";
import PersonIcon from "@/assets/icons/person.svg?react";
import {
  iconCode,
  iconContainer,
  iconGrid,
  iconLibraryContainer,
  iconLibraryTitle,
} from "./icons.css";

const icons = {
  Home: HomeIcon,
  Gift: GiftIcon,
  Person: PersonIcon,
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
