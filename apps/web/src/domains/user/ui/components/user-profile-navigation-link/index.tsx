import { ArrowRightIcon } from "@nugudi/assets-icons";
import { NavigationItem } from "@nugudi/react-components-navigation-item";
import Link from "next/link";
import type { ReactNode } from "react";
import * as styles from "./index.css";

interface UserProfileNavigationLinkProps {
  href: string;
  children: ReactNode;
  rightIcon?: ReactNode;
}

export const UserProfileNavigationLink = ({
  href,
  children,
  rightIcon = <ArrowRightIcon />,
}: UserProfileNavigationLinkProps) => {
  return (
    <Link href={href} className={styles.link}>
      <NavigationItem rightIcon={rightIcon}>{children}</NavigationItem>
    </Link>
  );
};
