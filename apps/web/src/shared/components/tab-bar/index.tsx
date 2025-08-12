"use client";

import { GiftIcon, HomeIcon, PersonIcon } from "@nugudi/assets-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import * as styles from "./index.css";

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  path: string;
}

const tabs: TabItem[] = [
  { id: "benefits", label: "혜택", icon: GiftIcon, path: "/benefits" },
  { id: "home", label: "홈", icon: HomeIcon, path: "/" },
  { id: "my", label: "마이", icon: PersonIcon, path: "/auth/my" },
];

const TabBar = () => {
  const pathname = usePathname();

  const tabElements = useMemo(() => {
    return tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = pathname === tab.path;

      return (
        <Link
          key={tab.id}
          href={tab.path}
          className={`${styles.tab} ${isActive ? styles.active : ""}`}
          aria-label={tab.label}
        >
          <Icon />
          <span className={styles.label}>{tab.label}</span>
        </Link>
      );
    });
  }, [pathname]);

  return <footer className={styles.container}>{tabElements}</footer>;
};

export default TabBar;
