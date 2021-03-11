import { renderHook } from "@testing-library/react-hooks";
import { clearStore, useMaru, useMaruInit } from "../lib";

describe("useMaru", () => {
  afterEach(() => clearStore());

  test("should be initialized", () => {
    renderHook(() => useMaruInit({ count: 0 }));
    const { result } = renderHook(() => useMaru("count"));
    expect(result.current[0]).toBe(0);
  });

  test("should throw on multiple initialization", () => {
    renderHook(() => useMaruInit({ count: 0 }));
    const { result } = renderHook(() => useMaruInit({ count: 0 }));
    expect(result.error).toEqual("You called 'useMaruInit' more than once.");
  });

  test("should be updated on setState", async () => {
    renderHook(() => useMaruInit({ count: 0 }));
    const { result, waitForNextUpdate } = renderHook(() => useMaru("count"));

    result.current[1](1);
    await waitForNextUpdate();

    expect(result.current[0]).toBe(1);
  });

  test("should return same initialValue", () => {
    renderHook(() => useMaruInit({ count: 0 }));
    const { result: resultA } = renderHook(() => useMaru("count"));
    const { result: resultB } = renderHook(() => useMaru("count"));

    expect(resultB.current[0]).toEqual(resultA.current[0]);
  });

  test("should update other components on setState", async () => {
    renderHook(() => useMaruInit({ count: 0 }));
    const { result: resultA } = renderHook(() => useMaru("count"));
    const {
      result: resultB,
      waitForNextUpdate: waitForNextUpdateB,
    } = renderHook(() => useMaru("count"));

    resultA.current[1](1);
    await waitForNextUpdateB();

    expect(resultB.current[0]).toBe(1);
  });
});
