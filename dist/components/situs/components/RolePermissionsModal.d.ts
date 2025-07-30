import React from 'react';
interface RolePermissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSave: (permissions: string[]) => void;
}
declare const RolePermissionsModal: React.FC<RolePermissionsModalProps>;
export default RolePermissionsModal;
//# sourceMappingURL=RolePermissionsModal.d.ts.map