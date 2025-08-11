import WelcomeText from "../components/welcome-text";
import EmailLoginSection from "../sections/email-login-section";
import * as styles from "./email-login-view.css";

export default function EmailLoginView() {
  return (
    <div className={styles.container}>
      <WelcomeText paddingLeft="0" marginTop="2rem" />
      <EmailLoginSection />
    </div>
  );
}
