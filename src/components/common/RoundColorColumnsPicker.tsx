import React from 'react';

export interface SwatchColor {
  color: string;
  label: string;
}

/**
 * Shared 10-column palette (base + 4 tonal steps) — zero hex shown in labels or DOM.
 * Matches Create Note's classic studio palette with strictly round swatches.
 */
export const UNIFIED_COLOR_COLUMNS: SwatchColor[][] = [
  [
    { color: '#ffffff', label: 'Pure Chalk' },
    { color: '#f2f2f2', label: 'Soft Ash' },
    { color: '#d8d8d8', label: 'Cool Stone' },
    { color: '#bfbfbf', label: 'Slate Silver' },
    { color: '#7f7f7f', label: 'Graphite Grey' },
  ],
  [
    { color: '#000000', label: 'True Ink' },
    { color: '#4d4d4d', label: 'Charcoal' },
    { color: '#333333', label: 'Espresso Slate' },
    { color: '#1a1a1a', label: 'Obsidian' },
    { color: '#140c08', label: 'Dark Chocolate' },
  ],
  [
    { color: '#eeece1', label: 'Warm Cream' },
    { color: '#ddd9c3', label: 'Parchment' },
    { color: '#c4bd97', label: 'Sandstone' },
    { color: '#938953', label: 'Antique Olive' },
    { color: '#494429', label: 'Deep Umber' },
  ],
  [
    { color: '#1f497d', label: 'Clinical Navy' },
    { color: '#c6d9f0', label: 'Ice Blue' },
    { color: '#8db3e2', label: 'Sky Blue' },
    { color: '#548dd4', label: 'Cerulean' },
    { color: '#17365d', label: 'Midnight Indigo' },
  ],
  [
    { color: '#4f81bd', label: 'Steel Blue' },
    { color: '#dbe5f1', label: 'Powder Blue' },
    { color: '#b8cce4', label: 'Mist Blue' },
    { color: '#95b3d7', label: 'Periwinkle' },
    { color: '#366092', label: 'Deep Cobalt' },
  ],
  [
    { color: '#c0504d', label: 'Arterial Rose' },
    { color: '#f2dcdb', label: 'Blush Tint' },
    { color: '#e5b9b7', label: 'Muted Rose' },
    { color: '#d99694', label: 'Terracotta Rose' },
    { color: '#953734', label: 'Crimson Brick' },
  ],
  [
    { color: '#9bbb59', label: 'Botanical Sage' },
    { color: '#ebf1dd', label: 'Mint Cream' },
    { color: '#d7e3bc', label: 'Soft Moss' },
    { color: '#c3d69b', label: 'Meadow Green' },
    { color: '#76923c', label: 'Forest Olive' },
  ],
  [
    { color: '#8064a2', label: 'Smoked Violet' },
    { color: '#e5e0ec', label: 'Lavender Mist' },
    { color: '#ccc1d9', label: 'Soft Iris' },
    { color: '#b2a2c7', label: 'Wisteria' },
    { color: '#5f497a', label: 'Plum Ink' },
  ],
  [
    { color: '#4bacc6', label: 'Venous Teal' },
    { color: '#dbeef3', label: 'Seafoam' },
    { color: '#b7dde8', label: 'Lagoon Aqua' },
    { color: '#92cddc', label: 'Glacier Teal' },
    { color: '#31859b', label: 'Deep Cyan' },
  ],
  [
    { color: '#f79646', label: 'Amber Ochre' },
    { color: '#fdeada', label: 'Apricot Glow' },
    { color: '#fbd5b5', label: 'Warm Peach' },
    { color: '#fac08f', label: 'Honey Gold' },
    { color: '#e36c09', label: 'Burnt Sienna' },
  ],
];

export const UNIFIED_STANDARD_COLORS: SwatchColor[] = [
  { color: '#c00000', label: 'Deep Carmine' },
  { color: '#ff0000', label: 'Vital Red' },
  { color: '#ffc000', label: 'Warm Marigold' },
  { color: '#ffff00', label: 'Canary Gold' },
  { color: '#92d050', label: 'Fresh Leaf' },
  { color: '#00b050', label: 'Clinical Emerald' },
  { color: '#00b0f0', label: 'Clear Sky' },
  { color: '#0070c0', label: 'Cobalt Blue' },
  { color: '#002060', label: 'Deep Sapphire' },
  { color: '#7030a0', label: 'Royal Violet' },
];

export const UNIFIED_HIGHLIGHT_COLUMNS: SwatchColor[][] = [
  [
    { color: '#fef08a', label: 'Buttercup' },
    { color: '#fde047', label: 'Sunburst' },
    { color: '#facc15', label: 'Goldenrod' },
  ],
  [
    { color: '#bbf7d0', label: 'Mint Leaf' },
    { color: '#86efac', label: 'Spring Sage' },
    { color: '#4ade80', label: 'Verdant' },
  ],
  [
    { color: '#bae6fd', label: 'Glacier Blue' },
    { color: '#7dd3fc', label: 'Horizon' },
    { color: '#38bdf8', label: 'Azure' },
  ],
  [
    { color: '#fbcfe8', label: 'Petal Pink' },
    { color: '#f9a8d4', label: 'Blossom' },
    { color: '#f472b6', label: 'Magenta Rose' },
  ],
  [
    { color: '#ddd6fe', label: 'Soft Lilac' },
    { color: '#c4b5fd', label: 'Lavender' },
    { color: '#a78bfa', label: 'Amethyst' },
  ],
  [
    { color: '#fed7aa', label: 'Warm Apricot' },
    { color: '#fdba74', label: 'Tangerine' },
    { color: '#fb923c', label: 'Amber Spark' },
  ],
  [
    { color: '#fecaca', label: 'Coral Tint' },
    { color: '#fca5a5', label: 'Soft Ruby' },
    { color: '#f87171', label: 'Rose Red' },
  ],
  [
    { color: '#e5e7eb', label: 'Pearl Mist' },
    { color: '#d1d5db', label: 'Cloud Silver' },
    { color: '#9ca3af', label: 'Slate Tint' },
  ],
];

interface RoundColorColumnsPickerProps {
  columns?: SwatchColor[][];
  selectedColor?: string;
  onSelectColor: (color: string) => void;
  showStandardRow?: boolean;
  swatchSizeClass?: string;
  className?: string;
}

export const RoundColorColumnsPicker: React.FC<RoundColorColumnsPickerProps> = ({
  columns = UNIFIED_COLOR_COLUMNS,
  selectedColor,
  onSelectColor,
  showStandardRow = false,
  swatchSizeClass = 'w-5 h-5',
  className = '',
}) => {
  const normalizedSelected = (selectedColor || '').trim().toLowerCase();

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col items-center gap-1.5">
            {col.map((sw, rowIdx) => {
              const isSelected = normalizedSelected === sw.color.toLowerCase();
              const isWhite = sw.color.toLowerCase() === '#ffffff';
              return (
                <button
                  key={`${colIdx}-${rowIdx}`}
                  type="button"
                  data-swatch="true"
                  onClick={() => onSelectColor(sw.color)}
                  title={sw.label}
                  aria-label={sw.label}
                  aria-pressed={isSelected}
                  className={`${swatchSizeClass} rounded-full transition-transform hover:scale-125 focus:outline-none cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-offset-1 ring-[#a47c43] dark:ring-[#e8be82] scale-115 shadow-sm'
                      : isWhite
                      ? 'ring-1 ring-stone-300 dark:ring-stone-600'
                      : 'ring-1 ring-black/10 dark:ring-white/15'
                  }`}
                  style={{ backgroundColor: sw.color }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {showStandardRow && (
        <div className="pt-2 border-t border-stone-200/80 dark:border-white/10">
          <div className="grid grid-cols-10 gap-1.5 justify-items-center">
            {UNIFIED_STANDARD_COLORS.map((sw) => {
              const isSelected = normalizedSelected === sw.color.toLowerCase();
              return (
                <button
                  key={sw.color}
                  type="button"
                  data-swatch="true"
                  onClick={() => onSelectColor(sw.color)}
                  title={sw.label}
                  aria-label={sw.label}
                  aria-pressed={isSelected}
                  className={`${swatchSizeClass} rounded-full transition-transform hover:scale-125 focus:outline-none cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-offset-1 ring-[#a47c43] dark:ring-[#e8be82] scale-115'
                      : 'ring-1 ring-black/15 dark:ring-white/15'
                  }`}
                  style={{ backgroundColor: sw.color }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
