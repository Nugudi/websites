import { Flex } from "@nugudi/react-components-layout";
import type { MenuItem } from "@nugudi/react-components-menu-card";
import MealList from "../../components/meal-list";
import ViewToggleButtons from "../../components/view-toggle-buttons";
import { MOCK_RESTAURANT_LIST } from "./mock-data";

export interface Restaurant {
  id: string;
  name: string;
  subtitle: string;
  timeRange: string;
  isPackagingAvailable?: boolean;
  items: MenuItem[];
}

const BrowseMealsSection = () => {
  return (
    <Flex direction="column" gap="12px" align="start">
      <ViewToggleButtons />
      <MealList restaurantList={MOCK_RESTAURANT_LIST} />
    </Flex>
  );
};

export default BrowseMealsSection;
