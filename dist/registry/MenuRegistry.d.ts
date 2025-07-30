import React from 'react';
import { MenuSection, MenuItem, RouteConfig } from '../types/menu';
declare class SitusMenuRegistry {
    private sections;
    private routes;
    constructor();
    private initializeDefaultMenu;
    private createPlaceholderComponent;
    addSection(section: MenuSection): void;
    addMenuItem(sectionId: string, item: MenuItem & {
        component?: React.ComponentType;
    }): void;
    getSections(): MenuSection[];
    getRoutes(): RouteConfig[];
    private generateRoutes;
    getMenuByPath(path: string): MenuItem | null;
    getActiveMenu(currentPath: string): MenuItem | null;
    getSidebarMenu(): {
        items: {
            divider: boolean;
            link: string;
            text: string;
            icon: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
            hasSubmenu: boolean;
            submenu: never[];
        }[];
        id: string;
        title: string;
        permission?: string;
        collapsed?: boolean;
    }[];
}
export declare const menuRegistry: SitusMenuRegistry;
export default menuRegistry;
//# sourceMappingURL=MenuRegistry.d.ts.map