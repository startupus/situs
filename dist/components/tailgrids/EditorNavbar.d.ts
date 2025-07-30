import React from "react";
interface EditorNavbarProps {
    currentPage?: string;
    onSave?: () => void;
    autosaveEnabled?: boolean;
    isSaving?: boolean;
    lastSaved?: Date | null;
    saveError?: string | null;
}
declare const EditorNavbar: React.FC<EditorNavbarProps>;
export default EditorNavbar;
//# sourceMappingURL=EditorNavbar.d.ts.map