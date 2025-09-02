import { CameraLineIcon } from "@nugudi/assets-icons";
import { Box } from "@nugudi/react-components-layout";
import * as styles from "./index.css";

// TODO: 이미지 업로드 패키지 설치 후 수정
export const ImageUploadPlaceholder = () => {
  return (
    <Box className={styles.container}>
      <Box className={styles.iconWrapper}>
        <CameraLineIcon />
      </Box>
    </Box>
  );
};
