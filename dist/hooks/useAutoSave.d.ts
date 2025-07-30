interface UseAutoSaveOptions {
    delay?: number;
    onSave?: (data: any) => Promise<void> | void;
    enabled?: boolean;
}
interface UseAutoSaveReturn {
    isSaving: boolean;
    lastSaved: Date | null;
    saveError: string | null;
    saveNow: () => Promise<void>;
}
export declare const useAutoSave: <T>(data: T, options?: UseAutoSaveOptions) => UseAutoSaveReturn;
export {};
//# sourceMappingURL=useAutoSave.d.ts.map