import { ArrowRightIcon, ClockIcon } from "@nugudi/assets-icons";
import { VStack } from "@nugudi/react-components-layout";
import Image from "next/image";
import Link from "next/link";
import * as styles from "./index.css";

interface RecommendRestaurantProps {
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantTime: string;
  availablePackaging: boolean;
}

const RecommendRestaurant = ({
  restaurantId,
  restaurantName,
  restaurantAddress,
  restaurantTime,
  availablePackaging,
}: RecommendRestaurantProps) => {
  return (
    <Link href={`/restaurant/${restaurantId}`} className={styles.container}>
      <VStack gap="3px" align="start">
        {availablePackaging && (
          <span className={styles.availablePackagingText}>
            포장 도시락 판매
          </span>
        )}
        <h1 className={styles.restaurantName}>{restaurantName}</h1>
        <span>{restaurantAddress}</span>
        <span className={styles.restaurantTime}>
          <ClockIcon />
          {restaurantTime}
        </span>
      </VStack>
      <ArrowRightIcon />
      <Image
        priority
        aria-hidden="true"
        className={styles.logoImage}
        src={"/images/sleep-nuguri.png"}
        alt={"sleep-nuguri"}
        width={150}
        height={100}
      />
    </Link>
  );
};

export default RecommendRestaurant;
