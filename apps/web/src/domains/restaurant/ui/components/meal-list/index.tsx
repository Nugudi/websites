import { MenuCard } from "@nugudi/react-components-menu-card";
import SwiperWithCounter from "@/src/shared/ui/components/swiper-with-counter";
import type { Restaurant } from "../../sections/browse-meals-section";

interface MealListProps {
  restaurantList: Restaurant[];
}

const MealList = ({ restaurantList }: MealListProps) => {
  const menuCards = restaurantList.map((restaurant) => (
    <MenuCard
      key={restaurant.id}
      title={restaurant.name}
      subtitle={restaurant.subtitle}
      timeRange={restaurant.timeRange}
      isPackagingAvailable={restaurant.isPackagingAvailable}
      items={restaurant.items}
    />
  ));

  return (
    <SwiperWithCounter
      spaceBetween={16}
      slidesPerView={1}
      showCounter={true}
      touchStartPreventDefault={false}
      allowTouchMove={true}
      simulateTouch={true}
      slideHeight="440px"
      maxWidth="600px"
      counterPosition="top-right"
    >
      {menuCards}
    </SwiperWithCounter>
  );
};

export default MealList;
