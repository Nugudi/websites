import { MenuCard } from "@nugudi/react-components-menu-card";
import SwiperWithCounter from "@/src/shared/components/swiper-with-counter";
import type { Cafeteria } from "../../../types/cafeteria";

interface CafeteriaMenuListProps {
  cafeteriaList: Cafeteria[];
}

export const CafeteriaMenuList = ({
  cafeteriaList,
}: CafeteriaMenuListProps) => {
  const menuCards = cafeteriaList.map((cafeteria) => (
    <MenuCard
      key={cafeteria.id}
      title={cafeteria.name}
      subtitle={cafeteria.subtitle}
      timeRange={cafeteria.timeRange}
      isPackagingAvailable={cafeteria.isPackagingAvailable}
      items={cafeteria.items}
    />
  ));

  return <SwiperWithCounter>{menuCards}</SwiperWithCounter>;
};
