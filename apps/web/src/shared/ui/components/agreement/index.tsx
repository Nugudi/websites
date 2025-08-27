import { Box, Flex, Title } from "@nugudi/react-components-layout";
import Link from "next/link";
import type { MouseEvent, PropsWithChildren } from "react";
import * as styles from "./index.css";

const Agreement = ({ children }: PropsWithChildren) => {
  return (
    <Flex as="ul" direction="column" gap="16">
      {children}
    </Flex>
  );
};

const AgreementTitle = ({
  children,
  checked,
  onChange,
}: PropsWithChildren<{
  checked: boolean;
  onChange: (e: MouseEvent<HTMLElement>, checked: boolean) => void;
}>) => {
  return (
    <Flex
      as="li"
      onClick={(e) => onChange(e, !checked)}
      gap="8"
      align="center"
      className={styles.agreementItem}
    >
      <IconCheck checked={checked} />
      <Title fontSize="t3" color="zinc">
        {children}
      </Title>
    </Flex>
  );
};

const AgreementDescription = ({
  children,
  checked,
  onChange,
  link,
}: PropsWithChildren<{
  checked: boolean;
  onChange: (e: MouseEvent<HTMLElement>, checked: boolean) => void;
  link?: string;
}>) => {
  return (
    <Flex
      as="li"
      justify="between"
      align="center"
      className={styles.agreementItem}
    >
      <Flex
        onClick={(e) => {
          onChange(e, !checked);
        }}
        gap="8"
        align="center"
        style={{ flex: 1 }}
      >
        <IconCheck checked={checked} />
        <Title fontSize="t3" color="zinc">
          {children}
        </Title>
      </Flex>
      {link && (
        <Link href={link} target="_blank" onClick={(e) => e.stopPropagation()}>
          <Box className={styles.arrowIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-label="상세보기"
            >
              <title>상세보기</title>
              <path
                d="M9 6L15 12L9 18"
                stroke="#999"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
        </Link>
      )}
    </Flex>
  );
};

Agreement.Title = AgreementTitle;
Agreement.Description = AgreementDescription;

function IconCheck({ checked }: { checked: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label={checked ? "선택됨" : "선택되지 않음"}
      style={{ flexShrink: 0 }}
    >
      <title>{checked ? "선택됨" : "선택되지 않음"}</title>
      {checked ? (
        <>
          <rect width="24" height="24" rx="4" fill="#10b981" />
          <path
            d="M6 12L10 16L18 8"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <rect
            x="0.5"
            y="0.5"
            width="23"
            height="23"
            rx="3.5"
            stroke="#e4e4e7"
            strokeWidth="1"
          />
          <path
            d="M6 12L10 16L18 8"
            stroke="#e4e4e7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

export default Agreement;
