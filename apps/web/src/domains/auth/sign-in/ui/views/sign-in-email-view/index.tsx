import LoginWelcome from "@/src/domains/auth/login/ui/components/login-welcome";
import NavBar from "@/src/shared/ui/components/nav-bar";
import SignInEmailSection from "../../sections/sign-in-email-section";
import * as styles from "./index.css";

const SignInEmailView = () => {
  return (
    <div className={styles.container}>
      <NavBar />
      <LoginWelcome paddingLeft="0" marginTop="2rem" />
      <SignInEmailSection />
    </div>
  );
};

export default SignInEmailView;
