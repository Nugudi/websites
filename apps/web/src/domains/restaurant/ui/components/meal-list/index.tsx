"use client";

import { MenuCard } from "@nugudi/react-components-menu-card";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Restaurant } from "../../sections/browse-meals-section";
import * as styles from "./swiper-styles.css";

import "swiper/css";

interface MealListProps {
  restaurantList: Restaurant[];
}

const MealList = ({ restaurantList }: MealListProps) => {
  const [currentSlide, setCurrentSlide] = useState(1);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.activeIndex + 1);
  };

  return (
    <div className={styles.container}>
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
        touchStartPreventDefault={false}
        allowTouchMove={true}
        simulateTouch={true}
        className={styles.swiperContainer}
      >
        {restaurantList.map((restaurant) => (
          <SwiperSlide key={restaurant.id}>
            <MenuCard
              title={restaurant.name}
              subtitle={restaurant.subtitle}
              timeRange={restaurant.timeRange}
              isPackagingAvailable={restaurant.isPackagingAvailable}
              items={restaurant.items}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.slideCounter}>
        {currentSlide}/{restaurantList.length}
      </div>
    </div>
  );
};

export default MealList;
