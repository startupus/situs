import { useEffect, useMemo, useState } from 'react';
import { ThemeConfig, ThemeColors } from '../types/theme';
import { useTheme } from '../contexts/ThemeContext';

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

export interface UseThemePreviewResult {
  device: PreviewDevice;
  setDevice: (d: PreviewDevice) => void;
  applyPreview: (config: ThemeConfig) => void;
  clearPreview: () => void;
  activeColors: ThemeColors;
}

const useThemePreview = (): UseThemePreviewResult => {
  const { isDarkMode, updateThemeVariant, currentColors } = useTheme();
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [backup, setBackup] = useState<{ light: ThemeColors; dark: ThemeColors } | null>(null);

  const applyPreview = (config: ThemeConfig) => {
    try {
      if (!backup) {
        setBackup({ light: currentColors as any, dark: currentColors as any });
      }
      updateThemeVariant('light', config.colors.light);
      updateThemeVariant('dark', config.colors.dark);
    } catch {}
  };

  const clearPreview = () => {
    try {
      if (backup) {
        updateThemeVariant('light', backup.light);
        updateThemeVariant('dark', backup.dark);
      }
    } catch {}
    setBackup(null);
  };

  useEffect(() => {
    return () => {
      clearPreview();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeColors = useMemo(() => currentColors, [currentColors, isDarkMode]);

  return { device, setDevice, applyPreview, clearPreview, activeColors };
};

export default useThemePreview;

