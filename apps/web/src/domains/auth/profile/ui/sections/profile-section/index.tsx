import { PencilIcon } from "@nugudi/assets-icons";
import { Flex } from "@nugudi/react-components-layout";
import Image from "next/image";
import Link from "next/link";
import * as styles from "./index.css";

const ProfileSection = () => {
  const username = "안애옹";

  return (
    <Flex className={styles.container}>
      <Image
        priority
        src="/images/nuguri.webp"
        alt="profile"
        width={60}
        height={60}
        className={styles.profileImage}
      />
      <Flex className={styles.infoWrapper}>
        <span className={styles.levelText}>Lv.1 기본 너구리</span>
        <Flex gap={1} align="end">
          <h1 className={styles.nameText}>
            {username} <span className={styles.nameSuffix}>님</span>
          </h1>
        </Flex>
      </Flex>
      <Link href="/profile/edit" className={styles.editButton}>
        <PencilIcon />
      </Link>
    </Flex>
  );
};

export default ProfileSection;
