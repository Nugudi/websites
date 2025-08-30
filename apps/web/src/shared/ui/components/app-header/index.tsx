"use client";

import { LogoTextIcon, NotiIcon } from "@nugudi/assets-icons";
import { Box, HStack } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import Link from "next/link";
import * as styles from "./index.css";

export const AppHeader = () => {
  return (
    <Box as="header" className={styles.container}>
      <HStack pX="4" justify="space-between" align="center">
        <Link href="/" aria-label="너구디 홈으로 이동">
          <LogoTextIcon width={59} height={40} />
        </Link>

        <Link href="/notification" aria-label="알림 페이지로 이동">
          <NotiIcon
            width={24}
            height={24}
            color={vars.colors.$static.light.color.black}
          />
        </Link>
      </HStack>
    </Box>
  );
};
