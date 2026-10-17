// app/[locale]/(shop)/product/[slug]/components/ColorSelector.tsx
'use client';

import Image from 'next/image';
import { Color } from '../types';

interface ColorSelectorProps {
  colors: Color[];
  selected: number;
  onSelect: (colorId: number) => void;
  locale:string
}

export default function ColorSelector({
  colors,
  selected,
  onSelect,
  locale
}: ColorSelectorProps) {
  const selectedColor = colors.find((c) => c.id === selected);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">{locale=='en'?'Color':'اللون'}</span>
        <span className="text-sm text-gray-600">{selectedColor?.name}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = selected === color.id;
          const hasValidColor = color.hex && color.hex !== '#000000' && color.hex !== '#ffffff';

          return (
            <button
              key={color.id}
              onClick={() => onSelect(color.id)}
              className={`relative w-12 h-12 rounded-lg border-1 transition-all hover:scale-110 ${
                isSelected
                  ? 'border-black '
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select ${color.name} color`}
              aria-pressed={isSelected}
            >
              {
                color.images[0]?
                  <Image src={color.images[0]} alt={color.name} fill className='rounded-lg' onError={(e) => {
                    e.currentTarget.src = '/No_Image.png';
                  }} />
                  :
                  <Image src='/No_Image.png' alt={color.name} fill className='rounded-lg' onError={(e) => {
                    e.currentTarget.src = '/No_Image.png';
                  }} />
              }
             
             
            </button>
          );
        })}
      </div>
    </div>
  );
}