import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSurahs } from "@/features/quran/hooks/useSurahs";
import { fetchSurahList } from "@/features/quran/api/quranApi";
import React from "react";

// Mock the API module
jest.mock("@/features/quran/api/quranApi");
const mockedFetchSurahList = fetchSurahList as jest.MockedFunction<typeof fetchSurahList>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useSurahs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading state initially", () => {
    mockedFetchSurahList.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useSurahs(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("returns surah list on success", async () => {
    const mockSurahs = [
      {
        number: 1,
        name: "الفاتحة",
        englishName: "Al-Fatiha",
        englishNameTranslation: "The Opening",
        numberOfAyahs: 7,
        revelationType: "Meccan" as const,
      },
    ];
    mockedFetchSurahList.mockResolvedValue(mockSurahs);

    const { result } = renderHook(() => useSurahs(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].englishName).toBe("Al-Fatiha");
  });

  it("returns error state on failure", async () => {
    mockedFetchSurahList.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useSurahs(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
