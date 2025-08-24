import { Box } from "@nugudi/react-components-layout";
import OptimizedImage from "../optimized-image";
import * as styles from "./index.css";

const UserWelcomeBanner = () => {
  // 추후 shared/hooks에서 유저 정보를 가져와 수정한다.
  const name = "애옹";

  return (
    <Box borderRadius="xl" className={styles.container}>
      <div className={styles.textWrapper}>
        <span className={styles.name}>{name}</span>님 오늘도 <br />
        맛난 점심식사다 너굴
      </div>
      <OptimizedImage
        priority="high"
        src="/images/level-2-nuguri"
        alt="level-2 너구리"
        className={styles.image}
      />
    </Box>
  );
};

export default UserWelcomeBanner;
