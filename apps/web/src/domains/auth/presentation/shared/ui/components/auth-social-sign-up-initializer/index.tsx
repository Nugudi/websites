"use client";

import { useSocialSignUpStore } from "@auth/presentation/client/stores";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const AuthSocialSignUpInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setProvider, setRegistrationToken } = useSocialSignUpStore();

  useEffect(() => {
    const provider = searchParams.get("provider");
    const token = searchParams.get("token");

    if (!provider || !token) {
      alert("잘못된 접근입니다. 로그인 페이지로 이동합니다.");
      router.push("/auth/sign-in");
      return;
    }

    setProvider(provider);
    setRegistrationToken(token);
  }, [searchParams, router, setProvider, setRegistrationToken]);

  return <>{children}</>;
};
