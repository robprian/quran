import { render, screen } from "@testing-library/react";
import { SurahCard } from "@/features/quran/components/SurahCard";
import type { Surah } from "@/features/quran/types";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      require("react").createElement("div", props, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

const mockSurah: Surah = {
  number: 1,
  name: "الفاتحة",
  englishName: "Al-Fatiha",
  englishNameTranslation: "The Opening",
  numberOfAyahs: 7,
  revelationType: "Meccan",
};

describe("SurahCard", () => {
  it("renders the English name", () => {
    render(<SurahCard surah={mockSurah} index={0} />);
    expect(screen.getByText("Al-Fatiha")).toBeInTheDocument();
  });

  it("renders the translation", () => {
    render(<SurahCard surah={mockSurah} index={0} />);
    expect(screen.getByText("The Opening")).toBeInTheDocument();
  });

  it("renders ayah count", () => {
    render(<SurahCard surah={mockSurah} index={0} />);
    expect(screen.getByText(/7 ayahs/i)).toBeInTheDocument();
  });

  it("renders revelation type badge", () => {
    render(<SurahCard surah={mockSurah} index={0} />);
    expect(screen.getByText("Meccan")).toBeInTheDocument();
  });

  it("renders surah number", () => {
    render(<SurahCard surah={mockSurah} index={0} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
