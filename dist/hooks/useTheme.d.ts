export type Theme = 'light' | 'dark' | 'system';
export declare const useTheme: () => {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    toggleTheme: () => void;
    setTheme: import("react").Dispatch<import("react").SetStateAction<Theme>>;
};
//# sourceMappingURL=useTheme.d.ts.map