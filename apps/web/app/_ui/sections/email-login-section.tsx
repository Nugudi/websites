import EmailLoginForm from "../components/email-login-form";
import * as styles from "./email-login-section.css";

export default function EmailLoginSection() {
  return (
    <div className={styles.content}>
      <EmailLoginForm />
    </div>
  );
}
