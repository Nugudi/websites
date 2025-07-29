"use client";

import { Button } from "@nugudi/nugudi-ui/button";
import { Typography } from "@nugudi/nugudi-ui/typography";
import * as styles from "./page.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <Typography size="h1" color="main-800">
          Nugudi UI 컴포넌트 테스트
        </Typography>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Button variant="brand" size="lg">
            Primary Large
          </Button>
          <Button variant="neutral" size="md">
            Secondary Medium
          </Button>
          <Button variant="brand" size="sm">
            Outline Small
          </Button>
          <Button variant="brand" size="full">
            Ghost Button
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>색상 팔레트</h2>
        <div className={styles.colorPalette}>
          <div className={`${styles.colorBox} ${styles.zincLight}`} />
          <div className={`${styles.colorBox} ${styles.zincMedium}`} />
          <div className={`${styles.colorBox} ${styles.zincDark}`} />
          <div className={`${styles.colorBox} ${styles.mainColor}`} />
        </div>
      </div>
    </div>
  );
}
