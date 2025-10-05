import { Box } from "@nugudi/react-components-layout";
import Image from "next/image";
import { auth } from "@/src/domains/auth";
import * as styles from "./index.css";

const UserWelcomeBanner = async () => {
  // Middleware에서 이미 토큰 갱신을 처리하므로 여기서는 읽기만
  const session = await auth.getSession({ refresh: false });
  const nickname = session?.user.nickname;

  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>{nickname}</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
      <Image
        src="/images/level-2-nuguri.png"
        alt="level-2 너구리"
        aria-hidden="true"
        className={styles.image}
        width={150}
        height={100}
        priority
      />
    </Box>
  );
};

export default UserWelcomeBanner;
