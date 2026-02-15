'use client';

import { useMemo, useState } from 'react';
import surahList from '@/data/surah.json';

type Surah = {
  id: number;
  name: string;
  verses: number;
};

type SurahPickerProps = {
  selectedSurahIds: number[];
  rakaat: number;
  onToggleSurah: (id: number) => void;
};

export default function SurahPicker({
  selectedSurahIds,
  rakaat,
  onToggleSurah,
}: SurahPickerProps) {
  const [filterText, setFilterText] = useState('');
  const hasReachedLimit = selectedSurahIds.length >= rakaat;

  const filteredSurahs = useMemo(() => {
    const normalizedFilter = filterText.toLowerCase().trim();

    return (surahList as Surah[])
      .filter((surah) =>
        surah.name.toLowerCase().includes(normalizedFilter)
      )
      .sort((a, b) => a.verses - b.verses);
  }, [filterText]);

  return (
    <div className="w-full max-w-md space-y-4">
      <input
        type="text"
        placeholder="Search surah..."
        className="w-full rounded border px-3 py-2 text-sm"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <ul className="divide-y rounded border max-h-80 overflow-y-auto">
        {filteredSurahs.map((surah) => {
          const isSelected = selectedSurahIds.includes(surah.id);
          const isAddDisabled = !isSelected && hasReachedLimit;
          return (
            <li
              key={surah.id}
              className={`flex items-center justify-between px-4 py-2 text-sm transition ${
                isSelected ? 'bg-green-50' : 'bg-white'
              }`}
            >
              <div>
                <p className="font-medium">{surah.name}</p>
                <p className="text-xs text-gray-500">{surah.verses} ayat</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleSurah(surah.id)}
                  disabled={isAddDisabled || isSelected}
                  className={`rounded border px-3 py-1 text-xs font-semibold transition ${
                    isAddDisabled || isSelected
                      ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500 opacity-50'
                      : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {isSelected ? 'Added' : 'Add'}
                </button>

                {isSelected && (
                  <button
                    type="button"
                    onClick={() => onToggleSurah(surah.id)}
                    className="rounded border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {hasReachedLimit && (
        <p className="text-xs text-gray-500">
          Maximum {rakaat} surahs selected
        </p>
      )}
    </div>
  );
}
