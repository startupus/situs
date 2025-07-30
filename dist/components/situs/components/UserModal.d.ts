import React from 'react';
import { User } from '../../../types/users';
interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSave: (userData: any) => void;
}
declare const UserModal: React.FC<UserModalProps>;
export default UserModal;
//# sourceMappingURL=UserModal.d.ts.map