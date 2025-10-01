"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSocialSignUpStore } from "@/src/domains/auth/sign-up/stores/use-social-sign-up-store";
import { SocialSignUpView } from "@/src/domains/auth/sign-up/ui/views/social-sign-up-view";

const SocialSignUpPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { setRegistrationToken } = useSocialSignUpStore();

  useEffect(() => {
    if (token) {
      setRegistrationToken(token);
    }
  }, [token, setRegistrationToken]);

  return <SocialSignUpView />;
};

export default SocialSignUpPage;
