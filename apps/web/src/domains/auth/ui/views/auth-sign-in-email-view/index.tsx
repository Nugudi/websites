import { NavBar } from "@/src/shared/interface-adapters/components/nav-bar";
import { AuthLoginWelcome } from "../../components/auth-login-welcome";
import { AuthSignInEmailSection } from "../../sections/auth-sign-in-email-section";
import * as styles from "./index.css";

export const AuthSignInEmailView = () => {
  return (
    <div className={styles.container}>
      <NavBar />
      <AuthLoginWelcome paddingLeft="0" marginTop="2rem" />
      <AuthSignInEmailSection />
    </div>
  );
};
