import { GoogleIcon, KakaoIcon, NaverIcon } from "@nugudi/assets-icons";
import { Flex } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import Link from "next/link";

export default function SocialLoginButtons() {
  return (
    <Flex gap={vars.box.spacing[4]}>
      <Link href="/login/google">
        <GoogleIcon />
      </Link>
      <Link href="/login/kakao">
        <KakaoIcon />
      </Link>
      <Link href="/login/naver">
        <NaverIcon />
      </Link>
    </Flex>
  );
}
