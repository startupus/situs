import React from 'react';
interface CanvasToolbarProps {
    currentDevice: 'mobile' | 'tablet' | 'desktop';
    onDeviceChange: (device: 'mobile' | 'tablet' | 'desktop') => void;
    onLanguageChange?: (languageCode: string) => void;
    onPreview?: () => void;
    onCode?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onSave?: () => void;
}
declare const CanvasToolbar: React.FC<CanvasToolbarProps>;
export default CanvasToolbar;
//# sourceMappingURL=CanvasToolbar.d.ts.map