"use client";

import { Button } from "@nugudi/react-components-button";
import * as styles from "./index.css";

const LogoutButton = () => {
  return (
    <Button
      variant="neutral"
      size="sm"
      color={"whiteAlpha"}
      onClick={() => {
        console.log("logout");
      }}
      className={styles.buttonBox}
    >
      로그아웃
    </Button>
  );
};

export default LogoutButton;
