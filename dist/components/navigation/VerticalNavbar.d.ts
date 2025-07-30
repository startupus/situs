import React from 'react';
export interface NavItem {
    id: string;
    label: string;
    href?: string;
    icon?: React.ReactNode;
    submenu?: NavItem[];
    onClick?: () => void;
}
export interface UserProfile {
    name: string;
    email: string;
    avatar?: string;
}
export interface VerticalNavbarProps {
    logo?: {
        src: string;
        alt: string;
    };
    items: NavItem[];
    userProfile?: UserProfile;
    className?: string;
    onItemClick?: (item: NavItem) => void;
}
declare const VerticalNavbar: React.FC<VerticalNavbarProps>;
export default VerticalNavbar;
//# sourceMappingURL=VerticalNavbar.d.ts.map