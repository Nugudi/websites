"use client";

import { type ReactNode, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import * as styles from "./index.css";

import "swiper/css";

interface SwiperWithCounterProps {
  children: ReactNode[];
  spaceBetween?: number;
  slidesPerView?: number;
  showCounter?: boolean;
  touchStartPreventDefault?: boolean;
  allowTouchMove?: boolean;
  simulateTouch?: boolean;
  slideHeight?: string;
  maxWidth?: string;
  counterPosition?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
}

const SwiperWithCounter = ({
  children,
  spaceBetween = 16,
  slidesPerView = 1,
  showCounter = true,
  touchStartPreventDefault = false,
  allowTouchMove = true,
  simulateTouch = true,
  slideHeight = "440px",
  maxWidth = "600px",
  counterPosition = "top-right",
}: SwiperWithCounterProps) => {
  const [currentSlide, setCurrentSlide] = useState(1);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.activeIndex + 1);
  };

  const containerStyle = {
    maxWidth,
  };

  const slideStyle = {
    height: slideHeight,
  };

  const counterClassName = styles.slideCounter[counterPosition];

  return (
    <div className={styles.container} style={containerStyle}>
      <Swiper
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        onSlideChange={handleSlideChange}
        touchStartPreventDefault={touchStartPreventDefault}
        allowTouchMove={allowTouchMove}
        simulateTouch={simulateTouch}
        className={styles.swiperContainer}
      >
        {children.map((child, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Children array represents slide order and lacks unique identifiers
          <SwiperSlide key={index} style={slideStyle}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
      {showCounter && (
        <div className={counterClassName}>
          {currentSlide}/{children.length}
        </div>
      )}
    </div>
  );
};

export default SwiperWithCounter;
