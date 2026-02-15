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
  title: string;
  onTitleChange: (value: string) => void;
  creatorName: string;
};

const SetlistDisplay = forwardRef<HTMLDivElement, SetlistDisplayProps>(
  (
    {
      selectedSurahIds,
      moveUp,
      moveDown,
      isExportMode = false,
      theme,
      title,
      onTitleChange,
      creatorName,
    },
    ref
  ) => {
    const printedAt = useMemo(
      () =>
        new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(new Date()),
      []
    );
    const appUrl =
      typeof window !== 'undefined' ? window.location.origin : '';
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
    const itemCount = selectedSurahs.length;
    const isCompact = itemCount >= 16;
    const receiptPadding = isCompact ? 'p-2' : 'p-4';
    const receiptText = isCompact ? 'text-xs' : 'text-sm';
    const sectionGap = isCompact ? 'space-y-1' : 'space-y-3';
    const rowGap = isCompact ? 'gap-1' : 'gap-2';
    const listGap = isCompact ? 'space-y-0.5' : 'space-y-1';
    const verseWidth = isCompact ? 'w-16' : 'w-20';
    const containerTracking = isCompact ? 'tracking-normal' : 'tracking-wide';
    const headerSpacing = isCompact ? 'mb-1' : 'mb-3';

    return (
      <div className="mx-auto flex w-full justify-center">
        <div
          ref={ref}
          data-export={isExportMode ? 'true' : 'false'}
          className={`flex h-full w-[390px] aspect-[9/16] flex-col overflow-hidden border border-dashed font-mono ${containerTracking} ${receiptPadding} ${receiptText} ${sectionGap} ${themeClasses}`}
        >
          <label
            className={`block text-xs uppercase tracking-wide ${
              isExportMode ? 'hidden' : subtleText
            }`}
          >
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Tarawih Setlist Day-?"
              className={`mt-1 w-full rounded border border-dashed bg-transparent px-2 py-1 text-sm focus:outline-none ${
                theme === 'classic'
                  ? 'border-gray-300 focus:border-gray-500 placeholder:text-gray-400'
                  : 'border-neutral-700 focus:border-neutral-500 placeholder:text-neutral-500 text-neutral-100'
              }`}
            />
          </label>

          <div className={`text-center ${headerSpacing}`}>
            <h2
              className={`font-semibold uppercase tracking-[0.35em] ${
                isCompact ? 'text-base' : 'text-lg'
              }`}
            >
              {title}
            </h2>
            <p className={`mt-0.5 text-xs ${subtleText}`}>{printedAt}</p>
            {creatorName.trim().length > 0 && (
              <p className="mt-0.5 text-xs opacity-70">by {creatorName}</p>
            )}
          </div>

          <p className={`text-center text-xs ${separatorText}`}>
            -------------------------
          </p>

          {selectedSurahs.length === 0 ? (
            <div className={`py-6 text-center text-xs ${separatorText}`}>
              No surah selected yet
            </div>
          ) : (
            <>
              <ol className={listGap}>
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
                    <li
                      key={`${surah.id}-${index}`}
                      className={`${isCompact ? 'space-y-1' : 'space-y-2'} ${
                        isCompact ? 'py-0.5' : 'py-1'
                      }`}
                    >
                      <div className={`flex items-center justify-between ${rowGap}`}>
                        <span className={indexText}>{index + 1}.</span>
                        <span className="flex-1 px-2">{surah.name}</span>
                        <span className={`${verseWidth} text-right`}>
                          {surah.verses} ayat
                        </span>
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
                        <div className={`${isCompact ? 'my-0.5' : 'my-1'} border-t border-gray-300`} />
                      )}
                    </li>
                  );
                })}
              </ol>

              <p className={`text-center text-xs ${separatorText}`}>
                -------------------------
              </p>

              <div
                className={`border-t border-dashed ${isCompact ? 'pt-1' : 'pt-3'} text-xs font-semibold ${
                  theme === 'classic' ? 'text-gray-700' : 'text-neutral-200'
                }`}
              >
                <p>Total Surahs: {selectedSurahs.length}</p>
                <p>Total Verses: {totalVerses}</p>
              </div>
              <p className="mt-2 text-center text-xs opacity-70">
                (c) {appUrl}
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
);

SetlistDisplay.displayName = 'SetlistDisplay';

export default SetlistDisplay;
