import { act, renderHook } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import {
  BREAKPOINTS,
  useDeviceType,
  useIs2xl,
  useIsLg,
  useIsMd,
  useIsSm,
  useIsXl,
  useIsXs,
  useMediaQuery,
} from "./useMediaQuery";

describe("useMediaQuery", () => {
  let matchMediaMock: Mock;
  let addEventListenerMock: Mock;
  let removeEventListenerMock: Mock;
  let addListenerMock: Mock;
  let removeListenerMock: Mock;

  beforeEach(() => {
    addEventListenerMock = vi.fn();
    removeEventListenerMock = vi.fn();
    addListenerMock = vi.fn();
    removeListenerMock = vi.fn();

    matchMediaMock = vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      addListener: addListenerMock,
      removeListener: removeListenerMock,
      onchange: null,
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("매칭되지 않는 쿼리에 대해 false를 반환해야 한다", () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      media: "(min-width: 768px)",
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    });

    const { result } = renderHook(() =>
      useMediaQuery({ query: "(min-width: 768px)" }),
    );

    expect(result.current.matches).toBe(false);
    expect(result.current.query).toBe("(min-width: 768px)");
  });

  it("매칭되는 쿼리에 대해 true를 반환해야 한다", () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: "(min-width: 768px)",
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    });

    const { result } = renderHook(() =>
      useMediaQuery({ query: "(min-width: 768px)" }),
    );

    expect(result.current.matches).toBe(true);
    expect(result.current.query).toBe("(min-width: 768px)");
  });

  it("defaultMatches 값을 사용해야 한다", () => {
    matchMediaMock.mockReturnValue({
      matches: false,
      media: "(min-width: 768px)",
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    });

    const { result } = renderHook(() =>
      useMediaQuery({
        query: "(min-width: 768px)",
        defaultMatches: true,
      }),
    );

    // 초기값은 defaultMatches를 사용
    expect(result.current.matches).toBe(false); // matchMedia의 값으로 업데이트됨
  });

  it("미디어 쿼리가 변경될 때 matches를 업데이트해야 한다", () => {
    let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

    matchMediaMock.mockReturnValue({
      matches: false,
      media: "(min-width: 768px)",
      addEventListener: vi.fn((event, handler) => {
        if (event === "change") {
          changeHandler = handler;
        }
      }),
      removeEventListener: removeEventListenerMock,
    });

    const { result } = renderHook(() =>
      useMediaQuery({ query: "(min-width: 768px)" }),
    );

    expect(result.current.matches).toBe(false);

    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current.matches).toBe(true);
  });

  it("matches가 변경될 때 onChange 콜백을 호출해야 한다", () => {
    const onChangeMock = vi.fn();
    let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

    matchMediaMock.mockReturnValue({
      matches: false,
      media: "(min-width: 768px)",
      addEventListener: vi.fn((event, handler) => {
        if (event === "change") {
          changeHandler = handler;
        }
      }),
      removeEventListener: removeEventListenerMock,
    });

    renderHook(() =>
      useMediaQuery({
        query: "(min-width: 768px)",
        onChange: onChangeMock,
      }),
    );

    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  it("구형 브라우저를 위해 addListener를 사용해야 한다", () => {
    const mediaQueryObject = {
      matches: false,
      media: "(min-width: 768px)",
      addEventListener: undefined,
      removeEventListener: undefined,
      addListener: addListenerMock,
      removeListener: removeListenerMock,
    };

    matchMediaMock.mockReturnValue(mediaQueryObject);

    const { unmount } = renderHook(() =>
      useMediaQuery({ query: "(min-width: 768px)" }),
    );

    expect(addListenerMock).toHaveBeenCalled();

    unmount();

    expect(removeListenerMock).toHaveBeenCalled();
  });

  it("언마운트 시 이벤트 리스너를 정리해야 한다", () => {
    const { unmount } = renderHook(() =>
      useMediaQuery({ query: "(min-width: 768px)" }),
    );

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("query prop이 변경될 때 업데이트되어야 한다", () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === "(min-width: 1024px)",
      media: query,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    }));

    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery({ query }),
      {
        initialProps: { query: "(min-width: 768px)" },
      },
    );

    expect(result.current.matches).toBe(false);
    expect(result.current.query).toBe("(min-width: 768px)");

    rerender({ query: "(min-width: 1024px)" });

    expect(result.current.matches).toBe(true);
    expect(result.current.query).toBe("(min-width: 1024px)");
  });

  it("matchMedia가 지원되지 않는 경우를 처리해야 한다", () => {
    const originalMatchMedia = window.matchMedia;

    // @ts-ignore
    window.matchMedia = undefined;

    const { result } = renderHook(() =>
      useMediaQuery({
        query: "(min-width: 768px)",
        defaultMatches: true,
      }),
    );

    expect(result.current.matches).toBe(true);

    window.matchMedia = originalMatchMedia;
  });
});

describe("Breakpoint Hooks", () => {
  let matchMediaMock: Mock;

  beforeEach(() => {
    matchMediaMock = vi.fn((query: string) => ({
      matches: query.includes("768"), // md 브레이크포인트만 true
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("useIsXs는 모든 화면에서 true를 반환해야 한다", () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      media: BREAKPOINTS.xs,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useIsXs());
    expect(result.current.matches).toBe(true);
    expect(matchMediaMock).toHaveBeenCalledWith(BREAKPOINTS.xs);
  });

  it("useIsSm은 640px 이상에서 true를 반환해야 한다", () => {
    const { result } = renderHook(() => useIsSm());
    expect(result.current.matches).toBe(false);
    expect(matchMediaMock).toHaveBeenCalledWith(BREAKPOINTS.sm);
  });

  it("useIsMd는 768px 이상에서 true를 반환해야 한다", () => {
    const { result } = renderHook(() => useIsMd());
    expect(result.current.matches).toBe(true);
    expect(matchMediaMock).toHaveBeenCalledWith(BREAKPOINTS.md);
  });

  it("useIsLg는 1024px 이상에서 true를 반환해야 한다", () => {
    const { result } = renderHook(() => useIsLg());
    expect(result.current.matches).toBe(false);
    expect(matchMediaMock).toHaveBeenCalledWith(BREAKPOINTS.lg);
  });

  it("useIsXl은 1280px 이상에서 true를 반환해야 한다", () => {
    const { result } = renderHook(() => useIsXl());
    expect(result.current.matches).toBe(false);
    expect(matchMediaMock).toHaveBeenCalledWith(BREAKPOINTS.xl);
  });

  it("useIs2xl은 1536px 이상에서 true를 반환해야 한다", () => {
    const { result } = renderHook(() => useIs2xl());
    expect(result.current.matches).toBe(false);
    expect(matchMediaMock).toHaveBeenCalledWith(BREAKPOINTS["2xl"]);
  });
});

describe("useDeviceType", () => {
  let matchMediaMock: Mock;

  beforeEach(() => {
    matchMediaMock = vi.fn((query: string) => {
      // 모바일: max-width: 767px
      if (query.includes("max-width: 767px")) {
        return {
          matches: true,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
      }
      // 태블릿: min-width: 768px and max-width: 1023px
      if (query.includes("768px") && query.includes("1023px")) {
        return {
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
      }
      // 데스크톱: min-width: 1024px
      if (query.includes("1024px")) {
        return {
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
    });

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("모바일 디바이스를 올바르게 감지해야 한다", () => {
    const { result } = renderHook(() => useDeviceType());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it("태블릿 디바이스를 올바르게 감지해야 한다", () => {
    matchMediaMock.mockImplementation((query: string) => {
      if (query.includes("max-width: 767px")) {
        return {
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
      }
      if (query.includes("768px") && query.includes("1023px")) {
        return {
          matches: true,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
    });

    const { result } = renderHook(() => useDeviceType());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it("데스크톱 디바이스를 올바르게 감지해야 한다", () => {
    matchMediaMock.mockImplementation((query: string) => {
      if (query.includes("1024px")) {
        return {
          matches: true,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
    });

    const { result } = renderHook(() => useDeviceType());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });
});
