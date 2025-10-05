import { Suspense } from "react";
import { AuthSocialSignUpInitializer } from "@/src/domains/auth/ui/components/auth-social-sign-up-initializer";
import { AuthSocialSignUpView } from "@/src/domains/auth/ui/views/auth-social-sign-up-view";

const SignUpSocialPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthSocialSignUpInitializer>
        <AuthSocialSignUpView />
      </AuthSocialSignUpInitializer>
    </Suspense>
  );
};

export default SignUpSocialPage;
