import React from 'react';
import { ThemeConfig } from '../../../../../types/theme';

interface ThemeCardProps {
  theme: ThemeConfig;
  onSelect?: (themeId: string) => void;
  onPreview?: (theme: ThemeConfig) => void;
  actions?: React.ReactNode;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onSelect, onPreview, actions }) => {
  return (
    <div className="border border-stroke dark:border-dark-3 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-stroke dark:border-dark-3 flex items-center justify-between">
        <div className="font-medium text-dark dark:text-white">{theme.name}</div>
        <div className="flex items-center gap-2">
          {onPreview && (
            <button className="text-sm px-2 py-1 border rounded-lg" onClick={() => onPreview(theme)}>Превью</button>
          )}
          {onSelect && (
            <button className="text-sm px-2 py-1 bg-primary text-white rounded-lg" onClick={() => onSelect(theme.id)}>Выбрать</button>
          )}
          {actions}
        </div>
      </div>
      <div className="p-4 grid grid-cols-5 gap-2">
        {(['primary','secondary','accent','success','warning'] as const).map(key => (
          <div key={key} className="rounded-lg h-10 border" style={{ background: theme.colors.light[key], borderColor: theme.colors.light.border }} />
        ))}
        <div className="col-span-5 text-xs text-body-color dark:text-dark-6">Light</div>
        {(['primary','secondary','accent','success','warning'] as const).map(key => (
          <div key={`d-${key}`} className="rounded-lg h-10 border" style={{ background: theme.colors.dark[key], borderColor: theme.colors.dark.border }} />
        ))}
        <div className="col-span-5 text-xs text-body-color dark:text-dark-6">Dark</div>
      </div>
    </div>
  );
};

export default ThemeCard;

