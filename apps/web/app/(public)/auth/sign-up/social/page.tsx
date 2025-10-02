import { Suspense } from "react";
import { SocialSignUpInitializer } from "@/src/domains/auth/social-sign-up/ui/components/social-sign-up-initializer";
import { SocialSignUpView } from "@/src/domains/auth/social-sign-up/ui/views/social-sign-up-view";

const SignUpSocialPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialSignUpInitializer>
        <SocialSignUpView />
      </SocialSignUpInitializer>
    </Suspense>
  );
};

export default SignUpSocialPage;
