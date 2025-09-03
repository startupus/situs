import React from 'react';
import { ThemeTemplate } from '../../../../../types/theme';

interface TemplateCardProps {
  template: ThemeTemplate;
  onInstall?: (templateId: string) => void;
  onPreview?: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onInstall, onPreview }) => {
  return (
    <div className="border border-stroke dark:border-dark-3 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-stroke dark:border-dark-3 flex items-center justify-between">
        <div className="font-medium text-dark dark:text-white">{template.name}</div>
        <div className="flex items-center gap-2">
          {onPreview && <button className="text-sm px-2 py-1 border rounded-lg" onClick={() => onPreview(template.id)}>Превью</button>}
          {onInstall && <button className="text-sm px-2 py-1 bg-primary text-white rounded-lg" onClick={() => onInstall(template.id)}>Установить</button>}
        </div>
      </div>
      <div className="p-4 grid grid-cols-5 gap-2">
        {(['primary','secondary','accent','success','warning'] as const).map(key => (
          <div key={key} className="rounded-lg h-10 border" style={{ background: template.config.colors.light[key], borderColor: template.config.colors.light.border }} />
        ))}
        <div className="col-span-5 text-xs text-body-color dark:text-dark-6">Light</div>
        {(['primary','secondary','accent','success','warning'] as const).map(key => (
          <div key={`d-${key}`} className="rounded-lg h-10 border" style={{ background: template.config.colors.dark[key], borderColor: template.config.colors.dark.border }} />
        ))}
        <div className="col-span-5 text-xs text-body-color dark:text-dark-6">Dark</div>
      </div>
    </div>
  );
};

export default TemplateCard;

