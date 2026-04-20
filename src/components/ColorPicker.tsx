import { COLOR_PALETTE } from '../types';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_PALETTE.map(c => (
        <button
          key={c.value}
          type="button"
          title={c.name}
          onClick={() => onChange(c.value)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform"
          style={{
            backgroundColor: c.value,
            transform: value === c.value ? 'scale(1.15)' : 'scale(1)',
            boxShadow: value === c.value ? `0 0 0 3px white, 0 0 0 5px ${c.value}` : 'none',
          }}
        >
          {value === c.value && <Check size={14} color="white" strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}
