export type Language = 'ru' | 'en';
interface UseLanguageReturn {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: (key: string, options?: any) => string;
    isRussian: boolean;
    isEnglish: boolean;
}
/**
 * Хук для управления языком интерфейса
 * Поддерживает переключение между русским и английским языками
 * Сохраняет выбор пользователя в localStorage
 */
export declare const useLanguage: () => UseLanguageReturn;
export {};
//# sourceMappingURL=useLanguage.d.ts.map