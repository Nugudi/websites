import EmailLoginForm from "../../components/email-sign-in-form";
import * as styles from "./index.css";

const EmailSignInSection = () => {
  return (
    <div className={styles.content}>
      <EmailLoginForm />
    </div>
  );
};

export default EmailSignInSection;
