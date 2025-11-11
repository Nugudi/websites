import { AuthSignInEmailForm } from "../../components/auth-sign-in-email-form";
import * as styles from "./index.css";

export const AuthSignInEmailSection = () => {
  return (
    <div className={styles.content}>
      <AuthSignInEmailForm />
    </div>
  );
};
