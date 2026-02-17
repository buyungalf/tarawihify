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

export default function HomePageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedSurahIds, setSelectedSurahIds] = useState<number[]>([]);
  const [selectedSide, setSelectedSide] = useState<"MUHAMMADIYAH" | "NU">("NU");
  const [rakaat, setRakaat] = useState<number>(8);
  const [creatorName, setCreatorName] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [theme, setTheme] = useState<"classic" | "thermal">("classic");
  const previewRef = useRef<HTMLDivElement | null>(null);

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
    const currentList = searchParams.get("list") || "";
    const nextList = serializeListToUrl(selectedSurahIds);

    if (currentList !== nextList) {
      const nextParams = new URLSearchParams();
      if (selectedSurahIds.length > 0 || currentList) {
        nextParams.set("list", nextList);
      }
      const query = nextParams.toString();
      router.replace(query ? `?${query}` : "", { scroll: false });
    }
  }, [selectedSurahIds, router, searchParams]);

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

  const handleDelete = (index: number) => {
    setSelectedSurahIds((prev) => {
      if (index < 0 || index >= prev.length) {
        return prev;
      }
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleRakaatChange = (option: (typeof RAKAAT_OPTIONS)[number]) => {
    if (option === rakaat) return;
    setRakaat(option);
    setSelectedSurahIds([]);
  };

  const handleDownload = async () => {
    if (selectedSurahIds.length !== rakaat) {
      alert(`Please select exactly ${rakaat} surahs first.`);
      return;
    }

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

  const isComplete = selectedSurahIds.length === rakaat;

  return (
    <main className="min-h-screen w-full px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <h1 className="text-center text-2xl font-semibold">
          Tarawih Setlist Generator
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Controls section - appears first in JSX for correct mobile stacking */}
          <div className="lg:w-1/3 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              BY
              <input
                type="text"
                value={creatorName}
                onChange={(event) => setCreatorName(event.target.value)}
                placeholder="Imam's name"
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              />
            </label>

            <section className="space-y-3">
              <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-600">
                Select Your Side
              </p>
              <div className="mx-auto grid max-w-[390px] grid-cols-2 gap-3">
                {(["MUHAMMADIYAH", "NU"] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setSelectedSide(side)}
                    className={`rounded border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                      selectedSide === side
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </section>

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
                  Clear
                </button>
              </div>
            </section>

            <div className="flex justify-center lg:block">
              <div className="w-[390px] max-w-full lg:w-full">
                <SurahPicker
                  selectedSurahIds={selectedSurahIds}
                  rakaat={rakaat}
                  onToggleSurah={handleToggleSurah}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="w-full rounded border border-gray-300 px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100"
            >
              Theme: {theme === "classic" ? "Light" : "Dark"}
            </button>
          </div>

          {/* Preview section - appears second in JSX for correct mobile stacking */}
          <div className="lg:w-2/3 space-y-6">
            <div className="flex justify-center">
              <div className="max-h-[85vh] overflow-y-auto">
                <div className="w-[390px] max-w-full">
                  <SetlistDisplay
                    selectedSurahIds={selectedSurahIds}
                    selectedSide={selectedSide}
                    moveUp={moveUp}
                    moveDown={moveDown}
                    handleDelete={handleDelete}
                    theme={theme}
                    creatorName={creatorName}
                  />

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isExporting || !isComplete}
                    className={`w-full mt-4 text-center py-2 rounded border border-gray-300 px-4 text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                      !isComplete
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:-translate-y-0.5 hover:bg-gray-100"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {isExporting ? "Generating image..." : "Download PNG"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-[9999px] top-0">
        <SetlistDisplay
          ref={previewRef}
          selectedSurahIds={selectedSurahIds}
          selectedSide={selectedSide}
          moveUp={moveUp}
          moveDown={moveDown}
          handleDelete={handleDelete}
          isExportMode
          forceFixedLayout
          theme={theme}
          creatorName={creatorName}
        />
      </div>
    </main>
  );
}
