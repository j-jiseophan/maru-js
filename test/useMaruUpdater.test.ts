import { renderHook } from "@testing-library/react-hooks";
import { clearStore, useMaru, useMaruInit, useMaruUpdater } from "../lib";

const mockFetcher = jest.fn(async () => {
  return 1;
});

describe("useMaruUpdater", () => {
  afterEach(() => {
    clearStore();
    mockFetcher.mockClear();
  });

  test("should be updated by updater - empty dependency", async () => {
    renderHook(() => useMaruInit({ count: 0 }));
    const { result, waitForNextUpdate } = renderHook(() => useMaru("count"));
    renderHook(() => useMaruUpdater("count", mockFetcher, []));
    await waitForNextUpdate();
    expect(result.current[0]).toBe(1);
  });

  test("should call updater once - empty dependency", async () => {
    renderHook(() => useMaruInit({ count: 0 }));
    const { result, waitForNextUpdate } = renderHook(() => useMaru("count"));

    const state = result.current[0];
    const setState = result.current[1];

    renderHook(() => useMaruUpdater("count", mockFetcher, []));
    await waitForNextUpdate();

    setState(0);
    await waitForNextUpdate();

    expect(mockFetcher).toBeCalledTimes(1);
  });

  test("should call updater once - with non variable dependency", async () => {
    const id = 0;
    renderHook(() => useMaruInit({ count: 0 }));
    const { waitForNextUpdate } = renderHook(() => useMaru("count"));

    const { rerender } = renderHook(() =>
      useMaruUpdater("count", mockFetcher, [id])
    );
    await waitForNextUpdate();
    rerender();
    expect(mockFetcher).toBeCalledTimes(1);
  });

  test("should call updater once - with variable dependency", async () => {
    let id = 0;
    renderHook(() => useMaruInit({ count: 0 }));
    const { waitForNextUpdate } = renderHook(() => useMaru("count"));

    const { rerender } = renderHook(() =>
      useMaruUpdater("count", mockFetcher, [id])
    );
    await waitForNextUpdate();
    id = 1;
    rerender();
    expect(mockFetcher).toBeCalledTimes(2);
  });

  test("should throw on trying update for uninitialized key", async () => {
    renderHook(() => useMaruInit({ count: 0 }));
    renderHook(() => useMaru("count"));
    const { result } = renderHook(() => useMaruUpdater("ant", mockFetcher, []));
    expect(result.error).toBe(
      "The state for key 'ant' has not been initialized."
    );
  });
});
