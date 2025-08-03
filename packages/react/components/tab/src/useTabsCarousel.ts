import AutoHeight from "embla-carousel-auto-height";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTabsContext } from "./TabsContext";

export interface UseTabsCarouselProps {
  loop?: boolean;
  dragThreshold?: number;
  onSettle?: () => void;
}

export interface UseTabsCarouselReturn {
  carouselRef: ((node: HTMLDivElement | null) => void) | undefined;
  updateTabIndex: (value: string, index: number) => void;
  rootProps: Record<string, unknown>;
}

export const useTabsCarousel = (
  props: UseTabsCarouselProps = {},
): UseTabsCarouselReturn => {
  const api = useTabsContext({ strict: false });
  const isInitialScroll = useRef(true);

  const plugins = useMemo(() => [AutoHeight()], []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: props.loop,
      dragThreshold: props.dragThreshold || 5,
      duration: 20,
      watchDrag: true,
      axis: "x",
      dragFree: false,
      containScroll: "trimSnaps",
      skipSnaps: false,
      startIndex: 0,
    },
    plugins,
  );

  // embla select 이벤트 처리
  useEffect(() => {
    if (!emblaApi || !api) return;

    const onSelect = () => {
      const contentIndex = emblaApi.selectedScrollSnap();
      api.setContentIndex(contentIndex);
    };

    const onSettle = () => {
      props.onSettle?.();
    };

    const onPointerDown = () => {};

    emblaApi.on("select", onSelect);
    emblaApi.on("settle", onSettle);
    emblaApi.on("pointerDown", onPointerDown);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("settle", onSettle);
      emblaApi.off("pointerDown", onPointerDown);
    };
  }, [emblaApi, api, props.onSettle]);

  useEffect(() => {
    if (emblaApi && api && api.contentIndex !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(api.contentIndex);

      if (isInitialScroll.current) {
        isInitialScroll.current = false;
      }
    }
  }, [emblaApi, api]);

  const updateTabIndex = useCallback(
    (tabValue: string, index: number) => {
      if (api && tabValue === api.value) {
        api.setContentIndex(index);
      }
    },
    [api],
  );

  if (!api) {
    return {
      carouselRef: undefined,
      updateTabIndex: () => {},
      rootProps: {},
    };
  }

  return {
    carouselRef: emblaRef,
    updateTabIndex,
    rootProps: {
      "data-carousel": "",
      "data-auto-height": "",
    },
  };
};
