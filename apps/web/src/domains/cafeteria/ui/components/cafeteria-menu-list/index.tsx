import type { MenuItem } from "@nugudi/react-components-menu-card";
import { MenuCard } from "@nugudi/react-components-menu-card";
import SwiperWithCounter from "@/src/shared/interface-adapters/components/swiper-with-counter";

// TODO: Phase 4 - Replace with proper OpenAPI types
type Cafeteria = {
  id: string;
  name: string;
  subtitle: string;
  timeRange: string;
  isPackagingAvailable?: boolean;
  items: MenuItem[];
};

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
