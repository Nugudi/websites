import { ArrowRightIcon, ClockIcon } from "@nugudi/assets-icons";
import { VStack } from "@nugudi/react-components-layout";
import Image from "next/image";
import Link from "next/link";
import * as styles from "./index.css";

interface CafeteriaRecommendCardProps {
  cafeteriaId: string;
  cafeteriaName: string;
  cafeteriaAddress: string;
  cafeteriaTime: string;
  availablePackaging: boolean;
}

const CafeteriaRecommendCard = ({
  cafeteriaId,
  cafeteriaName,
  cafeteriaAddress,
  cafeteriaTime,
  availablePackaging,
}: CafeteriaRecommendCardProps) => {
  return (
    <Link href={`/cafeterias/${cafeteriaId}`} className={styles.container}>
      <VStack gap="3px" align="start">
        {availablePackaging && (
          <span className={styles.availablePackagingText}>
            포장 도시락 판매
          </span>
        )}
        <h1 className={styles.cafeteriaName}>{cafeteriaName}</h1>
        <span>{cafeteriaAddress}</span>
        <span className={styles.cafeteriaTime}>
          <ClockIcon />
          {cafeteriaTime}
        </span>
      </VStack>

      <Image
        src="/images/sleep-nuguri.png"
        alt="자고 있는 너구리 이미지"
        aria-hidden="true"
        className={styles.logoImage}
        width={150}
        height={100}
        priority
      />
      <ArrowRightIcon />
    </Link>
  );
};

export default CafeteriaRecommendCard;
