"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SurahPicker from "@/components/SurahPicker";
import SetlistDisplay from "@/components/SetlistDisplay";
import { parseListFromUrl, serializeListToUrl } from "@/utils/urlHelpers";

const PRESETS: Record<string, number[]> = {
  "11 Rakaat Short": [1, 112, 113, 114, 108, 109, 112, 113, 108, 109, 114],
  "Random 5 Short Surahs": [113, 114, 109, 112, 108],
};

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedSurahIds, setSelectedSurahIds] = useState<number[]>([]);
  const [header, setHeader] = useState("Community Mosque");
  const [isExporting, setIsExporting] = useState(false);
  const [isExportMode, setIsExportMode] = useState(false);
  const [theme, setTheme] = useState<"classic" | "thermal">("classic");
  const [exportSize, setExportSize] = useState<"receipt" | "story">("receipt");
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied">("idle");
  const receiptRef = useRef<HTMLDivElement | null>(null);
  const storyExportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listParam = searchParams.get("list");

    if (listParam) {
      const parsed = parseListFromUrl(listParam);

      setSelectedSurahIds((prev) => {
        // Prevent re-setting same value
        if (JSON.stringify(prev) === JSON.stringify(parsed)) {
          return prev;
        }
        return parsed;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const current = searchParams.get("list") || "";
    const next = serializeListToUrl(selectedSurahIds);

    if (current !== next) {
      router.replace(`?list=${next}`, { scroll: false });
    }
  }, [selectedSurahIds]);

  const handleToggleSurah = (id: number) => {
    setSelectedSurahIds((prev) =>
      prev.includes(id)
        ? prev.filter((surahId) => surahId !== id)
        : [...prev, id],
    );
  };

  const moveUp = (index: number) => {
    setSelectedSurahIds((prev) => {
      if (index <= 0 || index >= prev.length) {
        return prev;
      }
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    setSelectedSurahIds((prev) => {
      if (index < 0 || index >= prev.length - 1) {
        return prev;
      }
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const applyPreset = (ids: number[]) => {
    setSelectedSurahIds([...ids]);
  };

  const handleDownload = async () => {
    const targetNode =
      exportSize === "story" ? storyExportRef.current : receiptRef.current;
    if (!targetNode || isExporting) return;
    setIsExporting(true);
    setIsExportMode(true);

    try {
      const dataUrl = await toPng(targetNode, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const filename = `tarawih-setlist-${new Date().toISOString().split("T")[0]}.png`;
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export setlist", error);
    } finally {
      setIsExportMode(false);
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyFeedback("copied");
      setTimeout(() => setCopyFeedback("idle"), 1500);
    } catch (error) {
      console.error("Failed to copy link", error);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "classic" ? "thermal" : "classic"));
  };

  return (
    <main className="min-h-screen flex flex-col items-center gap-6 p-6">
      <h1 className="text-xl font-semibold">Tarawih Setlist Generator</h1>

      <section className="w-full max-w-md space-y-3">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-600">
          Quick Presets
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(PRESETS).map(([label, ids]) => (
            <button
              key={label}
              type="button"
              onClick={() => applyPreset(ids)}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <SurahPicker
        selectedSurahIds={selectedSurahIds}
        onToggleSurah={handleToggleSurah}
      />

      <div className="w-full max-w-md space-y-3 text-center">
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full rounded border border-gray-300 px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100"
        >
          Theme: {theme === "classic" ? "Classic" : "Thermal"}
        </button>
        <div className="w-full rounded border border-gray-200 px-4 py-3 text-sm">
          <p className="mb-2 font-semibold uppercase tracking-wide text-gray-600">
            Export Size
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[["receipt", "Receipt"] as const, ["story", "Story"] as const].map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setExportSize(value)}
                  className={`rounded border px-3 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                    exportSize === value
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <SetlistDisplay
        ref={receiptRef}
        selectedSurahIds={selectedSurahIds}
        moveUp={moveUp}
        moveDown={moveDown}
        isExportMode={isExportMode}
        theme={theme}
        header={header}
        onHeaderChange={setHeader}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="rounded border border-gray-300 px-6 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExporting ? "Generating image..." : "Download PNG"}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="rounded border border-gray-300 px-6 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50"
        >
          {copyFeedback === "copied" ? "Copied!" : "Copy Link"}
        </button>
      </div>

      <div className="sr-only absolute -left-[9999px]" aria-hidden="true">
        <div
          ref={storyExportRef}
          className="w-[1080px] h-[1920px] flex items-center justify-center bg-white"
        >
          <SetlistDisplay
            selectedSurahIds={selectedSurahIds}
            moveUp={moveUp}
            moveDown={moveDown}
            isExportMode
            theme={theme}
            header={header}
            onHeaderChange={() => {}}
          />
        </div>
      </div>
    </main>
  );
}
