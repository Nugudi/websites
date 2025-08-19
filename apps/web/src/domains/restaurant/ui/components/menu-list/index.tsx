import { MenuCard } from "@nugudi/react-components-menu-card";
import SwiperWithCounter from "@/src/shared/ui/components/swiper-with-counter";
import type { Restaurant } from "../../sections/browse-menu-section";

interface MenuListProps {
  restaurantList: Restaurant[];
}

const MenuList = ({ restaurantList }: MenuListProps) => {
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

  return <SwiperWithCounter>{menuCards}</SwiperWithCounter>;
};

export default MenuList;
