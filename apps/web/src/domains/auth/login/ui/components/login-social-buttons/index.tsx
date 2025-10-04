import { GoogleIcon, KakaoIcon, NaverIcon } from "@nugudi/assets-icons";
import { Flex } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";

export const LoginSocialButtons = () => {
  return (
    <Flex gap={vars.box.spacing[4]}>
      <a href="/api/auth/google/login" aria-label="Google 계정으로 로그인">
        <GoogleIcon />
      </a>
      <a href="/api/auth/kakao/login" aria-label="Kakao 계정으로 로그인">
        <KakaoIcon />
      </a>
      <a href="/api/auth/naver/login" aria-label="Naver 계정으로 로그인">
        <NaverIcon />
      </a>
    </Flex>
  );
};
