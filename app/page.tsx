"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useRouter, useSearchParams } from "next/navigation";
import SurahPicker from "@/components/SurahPicker";
import SetlistDisplay from "@/components/SetlistDisplay";
import { parseListFromUrl, serializeListToUrl } from "@/utils/urlHelpers";
import surahList from "@/data/surah.json";

const RAKAAT_OPTIONS = [8, 20] as const;

type Surah = {
  id: number;
  name: string;
  verses: number;
};

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedSurahIds, setSelectedSurahIds] = useState<number[]>([]);
  const [rakaat, setRakaat] = useState<number>(8);
  const [title, setTitle] = useState("Tarawih Setlist Day-?");
  const [creatorName, setCreatorName] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [theme, setTheme] = useState<"classic" | "thermal">("classic");
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied">("idle");
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listParam = searchParams.get("list");
    const titleParam = searchParams.get("title");

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
    if (titleParam) {
      setTitle(titleParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentList = searchParams.get("list") || "";
    const nextList = serializeListToUrl(selectedSurahIds);
    const currentTitle = searchParams.get("title") || "";

    if (currentList !== nextList || currentTitle !== title) {
      const nextParams = new URLSearchParams();
      if (selectedSurahIds.length > 0 || currentList) {
        nextParams.set("list", nextList);
      }
      if (title) {
        nextParams.set("title", title);
      }
      const query = nextParams.toString();
      router.replace(query ? `?${query}` : "", { scroll: false });
    }
  }, [selectedSurahIds, title]);

  const handleToggleSurah = (id: number) => {
    setSelectedSurahIds((prev) => {
      const isSelected = prev.includes(id);
      if (!isSelected && prev.length >= rakaat) {
        return prev;
      }
      return isSelected
        ? prev.filter((surahId) => surahId !== id)
        : [...prev, id];
    });
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

  const handleRakaatChange = (option: (typeof RAKAAT_OPTIONS)[number]) => {
    if (option === rakaat) return;
    setRakaat(option);
    setSelectedSurahIds([]);
  };

  const handleDownload = async () => {
    const targetNode = previewRef.current;
    if (!targetNode || isExporting) return;
    setIsExporting(true);

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

  const handleRandomize = () => {
    const uniqueSurahs = Array.from(
      new Map((surahList as Surah[]).map((surah) => [surah.id, surah])).values(),
    );
    const desiredCount = Math.min(rakaat, uniqueSurahs.length);
    const shuffled = [...uniqueSurahs];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const randomIds = shuffled.slice(0, desiredCount).map((surah) => surah.id);
    setSelectedSurahIds(randomIds);
  };

  return (
    <main className="min-h-screen w-full px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <h1 className="text-center text-2xl font-semibold">
          Tarawih Setlist Generator
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Controls section - appears first in JSX for correct mobile stacking */}
          <div className="lg:w-1/3 space-y-4">
            <section className="space-y-3">
              <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-600">
                Rakaat Count
              </p>
              <div className="grid grid-cols-2 gap-3">
                {RAKAAT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleRakaatChange(option)}
                    className={`rounded border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                      rakaat === option
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {option} Rakaat
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100"
                >
                  Random
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSurahIds([])}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100"
                >
                  Reset
                </button>
              </div>
            </section>

            <SurahPicker
              selectedSurahIds={selectedSurahIds}
              rakaat={rakaat}
              onToggleSurah={handleToggleSurah}
            />

            <label className="block text-sm font-medium text-gray-700">
              Creator Name
              <input
                type="text"
                value={creatorName}
                onChange={(event) => setCreatorName(event.target.value)}
                placeholder="Your name"
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              />
            </label>

            <button
              type="button"
              onClick={toggleTheme}
              className="w-full rounded border border-gray-300 px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100"
            >
              Theme: {theme === "classic" ? "Classic" : "Thermal"}
            </button>
          </div>

          {/* Preview section - appears second in JSX for correct mobile stacking */}
          <div className="lg:w-2/3 space-y-6">
            <div className="flex flex-col items-center">
              <SetlistDisplay
                ref={previewRef}
                selectedSurahIds={selectedSurahIds}
                moveUp={moveUp}
                moveDown={moveDown}
                isExportMode={isExporting}
                theme={theme}
                title={title}
                onTitleChange={setTitle}
                creatorName={creatorName}
              />
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isExporting}
                className="flex-1 rounded border border-gray-300 px-6 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isExporting ? "Generating image..." : "Download PNG"}
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 rounded border border-gray-300 px-6 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50"
              >
                {copyFeedback === "copied" ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
