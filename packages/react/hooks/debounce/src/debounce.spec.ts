import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
  it("기본 동작 테스트", () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => debounce(mockCallback, 500));

    expect(result.current).toBeDefined();
    expect(result.current.cancel).toBeDefined();
    expect(result.current.flush).toBeDefined();
    expect(result.current.pending).toBeDefined();
  });

  it("지정된 시간 후에 함수가 호출되는지 테스트", async () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => debounce(mockCallback, 100));

    act(() => {
      result.current("test");
    });

    expect(mockCallback).not.toHaveBeenCalled();

    await waitFor(
      () => {
        expect(mockCallback).toHaveBeenCalledWith("test");
      },
      { timeout: 200 },
    );

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("연속 호출 시 마지막 호출만 실행되는지 테스트", async () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => debounce(mockCallback, 100));

    act(() => {
      result.current("first");
      result.current("second");
      result.current("third");
    });

    expect(mockCallback).not.toHaveBeenCalled();

    await waitFor(
      () => {
        expect(mockCallback).toHaveBeenCalledWith("third");
      },
      { timeout: 200 },
    );

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("cancel 메서드가 정상 동작하는지 테스트", async () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => debounce(mockCallback, 100));

    act(() => {
      result.current("test");
      result.current.cancel();
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("flush 메서드가 즉시 실행되는지 테스트", () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => debounce(mockCallback, 1000));

    act(() => {
      result.current("test");
    });

    expect(mockCallback).not.toHaveBeenCalled();

    act(() => {
      result.current.flush();
    });

    expect(mockCallback).toHaveBeenCalledWith("test");
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("pending 메서드가 대기 상태를 정확히 반환하는지 테스트", async () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => debounce(mockCallback, 100));

    expect(result.current.pending()).toBe(false);

    act(() => {
      result.current("test");
    });

    expect(result.current.pending()).toBe(true);

    await waitFor(
      () => {
        expect(result.current.pending()).toBe(false);
      },
      { timeout: 200 },
    );
  });

  it("leading 옵션이 정상 동작하는지 테스트", () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() =>
      debounce(mockCallback, 100, { leading: true, trailing: false }),
    );

    act(() => {
      result.current("test");
    });

    expect(mockCallback).toHaveBeenCalledWith("test");
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("maxWait 옵션이 정상 동작하는지 테스트", async () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() =>
      debounce(mockCallback, 100, { maxWait: 150 }),
    );

    const startTime = Date.now();

    act(() => {
      result.current("first");
    });

    // 50ms마다 호출하여 maxWait 시간 전에 계속 갱신
    const interval = setInterval(() => {
      act(() => {
        result.current("update");
      });
    }, 50);

    await waitFor(
      () => {
        expect(mockCallback).toHaveBeenCalled();
      },
      { timeout: 200 },
    );

    clearInterval(interval);

    const elapsedTime = Date.now() - startTime;
    expect(elapsedTime).toBeLessThan(200);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("여러 인자를 올바르게 전달하는지 테스트", async () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => debounce(mockCallback, 100));

    act(() => {
      result.current("arg1", "arg2", 123, { key: "value" });
    });

    await waitFor(
      () => {
        expect(mockCallback).toHaveBeenCalledWith("arg1", "arg2", 123, {
          key: "value",
        });
      },
      { timeout: 200 },
    );
  });

  it("콜백 함수가 변경되어도 정상 동작하는지 테스트", async () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ callback }) => debounce(callback, 100),
      { initialProps: { callback: mockCallback1 } },
    );

    act(() => {
      result.current("test1");
    });

    // 콜백 함수 변경
    rerender({ callback: mockCallback2 });

    act(() => {
      result.current("test2");
    });

    await waitFor(
      () => {
        expect(mockCallback2).toHaveBeenCalledWith("test2");
      },
      { timeout: 200 },
    );

    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });
});
