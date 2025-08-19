import { useMemo } from "react";
import { CATEGORY_CONFIG } from "./constants/category-config";
import { categoryGroupWrapper, categoryIcon, categoryLabel } from "./style.css";
import type { MenuCategory, MenuItem } from "./types";

interface CategoryGroupProps {
  category: MenuCategory;
  items: MenuItem[];
}

export const CategoryGroupComponent = ({
  category,
  items,
}: CategoryGroupProps) => {
  const config = CATEGORY_CONFIG[category];
  const IconComponent = config.Icon;
  const itemNames = useMemo(
    () => items.map((item) => item.name).join(", "),
    [items],
  );

  return (
    <div className={categoryGroupWrapper}>
      <div className={categoryIcon}>
        <IconComponent width={24} height={24} />
      </div>
      <span className={categoryLabel}>{itemNames}</span>
    </div>
  );
};
