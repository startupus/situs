export type CanvasTheme = 'light' | 'dark' | 'system';
export declare const useCanvasTheme: () => {
    theme: CanvasTheme;
    resolvedTheme: "light" | "dark";
    toggleTheme: () => void;
    setTheme: import("react").Dispatch<import("react").SetStateAction<CanvasTheme>>;
};
//# sourceMappingURL=useCanvasTheme.d.ts.map