import { ClockIcon, PackagingIcon } from "@nugudi/assets-icons";
import { CategoryGroupComponent } from "./category-group";
import useMenuGrouping from "./hooks/use-menu-grouping";
import * as styles from "./style.css";
import type { MenuCardProps } from "./types";

const MenuCard = ({
  title,
  subtitle,
  timeRange,
  items,
  isPackagingAvailable,
}: MenuCardProps) => {
  const groupedItems = useMenuGrouping(items);

  return (
    <div className={styles.menuCardWrapper}>
      <div className={styles.menuCardHeader}>
        <div className={styles.menuCardTitleContainer}>
          <h2 className={styles.menuCardTitle}>{title}</h2>
          {isPackagingAvailable && (
            <div className={styles.menuCardPackagingAvailable}>
              <PackagingIcon width={16} height={16} />
              포장 도시락 판매
            </div>
          )}
        </div>
        {subtitle && (
          <span className={styles.menuCardSubtitle}>{subtitle}</span>
        )}
        {timeRange && (
          <div className={styles.menuCardTimeRange}>
            <ClockIcon width={16} height={16} />
            <span>{timeRange}</span>
          </div>
        )}
      </div>

      <div className={styles.menuItemsContainer}>
        {Array.from(groupedItems.entries()).map(([category, categoryItems]) => (
          <CategoryGroupComponent
            key={category}
            category={category}
            items={categoryItems}
          />
        ))}
      </div>
    </div>
  );
};

export { MenuCard };
