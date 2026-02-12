'use client';

import { forwardRef, useMemo } from 'react';
import surahList from '@/data/surah.json';

type Surah = {
  id: number;
  name: string;
  verses: number;
};

type SetlistDisplayProps = {
  selectedSurahIds: number[];
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  isExportMode?: boolean;
  theme: 'classic' | 'thermal';
  header: string;
  onHeaderChange: (value: string) => void;
};

const SetlistDisplay = forwardRef<HTMLDivElement, SetlistDisplayProps>(
  (
    {
      selectedSurahIds,
      moveUp,
      moveDown,
      isExportMode = false,
      theme,
      header,
      onHeaderChange,
    },
    ref
  ) => {
    const printedAt = useMemo(
      () =>
        new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date()),
      []
    );
    const selectedSurahs = selectedSurahIds
      .map((id) => (surahList as Surah[]).find((surah) => surah.id === id))
      .filter((surah): surah is Surah => Boolean(surah));
    const totalVerses = selectedSurahs.reduce((sum, surah) => sum + surah.verses, 0);

    const themeClasses =
      theme === 'classic'
        ? `bg-white text-black border-gray-300 ${
            isExportMode ? '' : 'shadow-sm'
          }`
        : 'bg-neutral-900 text-neutral-100 border-neutral-700';
    const subtleText =
      theme === 'classic' ? 'text-gray-500' : 'text-neutral-400';
    const separatorText =
      theme === 'classic' ? 'text-gray-400' : 'text-neutral-500';
    const indexText =
      theme === 'classic' ? 'text-gray-600' : 'text-neutral-300';

    return (
      <div
        ref={ref}
        data-export={isExportMode ? 'true' : 'false'}
        className={`w-[390px] mx-auto space-y-4 border border-dashed p-4 font-mono text-sm tracking-wide ${themeClasses}`}
      >
        <label
          className={`block text-xs uppercase tracking-wide ${
            isExportMode ? 'hidden' : subtleText
          }`}
        >
          Mosque Name
          <input
            type="text"
            value={header}
            onChange={(e) => onHeaderChange(e.target.value)}
            placeholder="Masjid Name"
            className={`mt-1 w-full rounded border border-dashed bg-transparent px-2 py-1 text-sm focus:outline-none ${
              theme === 'classic'
                ? 'border-gray-300 focus:border-gray-500 placeholder:text-gray-400'
                : 'border-neutral-700 focus:border-neutral-500 placeholder:text-neutral-500 text-neutral-100'
            }`}
          />
        </label>

        <div className="text-center">
          <p className="text-lg font-semibold uppercase tracking-[0.35em]">
            {header || 'Setlist'}
          </p>
          <p className={`text-xs ${subtleText}`}>{printedAt}</p>
        </div>

        <p className={`text-center text-xs ${separatorText}`}>
          -------------------------
        </p>

        {selectedSurahs.length === 0 ? (
          <div className={`py-8 text-center text-xs ${separatorText}`}>
            No surah selected yet
          </div>
        ) : (
          <>
            <ol className="space-y-2">
              {selectedSurahs.map((surah, index) => {
                const isFirst = index === 0;
                const isLast = index === selectedSurahs.length - 1;
                const activeButtonClasses =
                  theme === 'classic'
                    ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    : 'border-neutral-700 text-neutral-200 hover:bg-neutral-800';
                const disabledButtonClasses =
                  theme === 'classic'
                    ? 'cursor-not-allowed border-gray-200 text-gray-300'
                    : 'cursor-not-allowed border-neutral-700 text-neutral-600';
                const shouldShowDivider =
                  (index + 1) % 4 === 0 && index !== selectedSurahs.length - 1;
                return (
                  <li key={`${surah.id}-${index}`} className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={indexText}>{index + 1}.</span>
                      <span className="flex-1 px-2">{surah.name}</span>
                      <span className="w-20 text-right">{surah.verses} ayat</span>
                      <div className={`flex gap-1 ${isExportMode ? 'hidden' : ''}`}>
                        <button
                          type="button"
                          onClick={() => moveUp(index)}
                          disabled={isFirst}
                          className={`rounded border px-2 py-1 text-xs transition-all duration-200 ${
                            isFirst ? disabledButtonClasses : activeButtonClasses
                          }`}
                          aria-label={`Move ${surah.name} up`}
                        >
                          &uarr;
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDown(index)}
                          disabled={isLast}
                          className={`rounded border px-2 py-1 text-xs transition-all duration-200 ${
                            isLast ? disabledButtonClasses : activeButtonClasses
                          }`}
                          aria-label={`Move ${surah.name} down`}
                        >
                          &darr;
                        </button>
                      </div>
                    </div>
                    {shouldShowDivider && (
                      <div className="border-t border-gray-300" />
                    )}
                  </li>
                );
              })}
            </ol>

            <p className={`text-center text-xs ${separatorText}`}>
              -------------------------
            </p>

            <div
              className={`border-t border-dashed pt-4 text-xs font-semibold ${
                theme === 'classic' ? 'text-gray-700' : 'text-neutral-200'
              }`}
            >
              <p>Total Surahs: {selectedSurahs.length}</p>
              <p>Total Verses: {totalVerses}</p>
            </div>
          </>
        )}
      </div>
    );
  }
);

SetlistDisplay.displayName = 'SetlistDisplay';

export default SetlistDisplay;
