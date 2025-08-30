import { GoogleIcon, KakaoIcon, NaverIcon } from "@nugudi/assets-icons";
import { Flex } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import Link from "next/link";

export const LoginSocialButtons = () => {
  return (
    <Flex gap={vars.box.spacing[4]}>
      <Link href="/login/google" aria-label="Google 계정으로 로그인">
        <GoogleIcon />
      </Link>
      <Link href="/login/kakao" aria-label="Kakao 계정으로 로그인">
        <KakaoIcon />
      </Link>
      <Link href="/login/naver" aria-label="Naver 계정으로 로그인">
        <NaverIcon />
      </Link>
    </Flex>
  );
};
