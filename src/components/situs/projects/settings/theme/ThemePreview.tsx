import React from 'react';
import { ThemeConfig } from '../../../../../types/theme';

type Device = 'desktop' | 'tablet' | 'mobile';

interface Props {
  theme: ThemeConfig;
  device: Device;
  onDeviceChange: (d: Device) => void;
}

const DeviceButton: React.FC<{ id: Device; current: Device; onClick: (d: Device) => void; label: string }> = ({ id, current, onClick, label }) => (
  <button
    className={`px-3 py-1 text-sm rounded-lg border ${current === id ? 'border-primary text-primary' : 'border-stroke dark:border-dark-3'}`}
    onClick={() => onClick(id)}
  >
    {label}
  </button>
);

const frameClass: Record<Device, string> = {
  desktop: 'w-full h-[420px]',
  tablet: 'w-[768px] max-w-full h-[420px]',
  mobile: 'w-[360px] max-w-full h-[420px]',
};

const ThemePreview: React.FC<Props> = ({ device, onDeviceChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <DeviceButton id="desktop" current={device} onClick={onDeviceChange} label="Desktop" />
        <DeviceButton id="tablet" current={device} onClick={onDeviceChange} label="Tablet" />
        <DeviceButton id="mobile" current={device} onClick={onDeviceChange} label="Mobile" />
      </div>
      <div className={`border border-stroke dark:border-dark-3 rounded-xl overflow-hidden bg-[var(--color-background)] ${frameClass[device]}`}>
        <div className="p-4 space-y-4">
          <div className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Заголовок</div>
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Небольшой текст для проверки контраста.</div>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--color-primary)' }}>Кнопка</button>
            <button className="px-3 py-2 rounded-lg" style={{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}>Обводка</button>
          </div>
          <input className="w-full rounded-lg px-3 py-2" placeholder="Поле ввода" style={{ background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }} />
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;

