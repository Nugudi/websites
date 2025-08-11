import EmailLoginForm from "../components/email-login-form";
import * as styles from "./email-login-section.css";

const EmailLoginSection = () => {
  return (
    <div className={styles.content}>
      <EmailLoginForm />
    </div>
  );
};

export default EmailLoginSection;
