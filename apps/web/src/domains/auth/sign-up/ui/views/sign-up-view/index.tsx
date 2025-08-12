import { Flex } from "@nugudi/react-components-layout";
import SignUpSection from "@/src/domains/auth/sign-up/ui/sections/sign-up-section";

const SignUpView = () => {
  return (
    <Flex direction="column" align="center" justify="center">
      <SignUpSection />
    </Flex>
  );
};

export default SignUpView;
