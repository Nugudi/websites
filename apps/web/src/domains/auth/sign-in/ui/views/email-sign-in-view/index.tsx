import NavBar from "@/src/shared/ui/components/nav-bar";
import WelcomeText from "../../components/welcome-text";
import EmailLoginSection from "../../sections/email-sign-in-section";
import * as styles from "./index.css";

const EmailSignInView = () => {
  return (
    <div className={styles.container}>
      <NavBar />
      <WelcomeText paddingLeft="0" marginTop="2rem" />
      <EmailLoginSection />
    </div>
  );
};

export default EmailSignInView;
