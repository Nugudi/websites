import { ArrowRightIcon, ClockIcon } from "@nugudi/assets-icons";
import { VStack } from "@nugudi/react-components-layout";
import Link from "next/link";
import OptimizedImage from "@/src/shared/ui/components/optimized-image";
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
      <OptimizedImage
        priority="high"
        src="/images/sleep-nuguri"
        alt="sleep-nuguri"
        className={styles.logoImage}
      />
      <ArrowRightIcon />
    </Link>
  );
};

export default RecommendRestaurant;
