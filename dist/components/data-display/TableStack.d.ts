import React from 'react';
export interface TableStackItem {
    id: string | number;
    image?: string;
    name: string;
    position?: string;
    email?: string;
    status?: 'active' | 'inactive' | 'pending';
    actions?: React.ReactNode;
}
export interface TableStackProps {
    title?: string;
    items: TableStackItem[];
    className?: string;
    onItemClick?: (item: TableStackItem) => void;
}
declare const TableStack: React.FC<TableStackProps>;
export default TableStack;
//# sourceMappingURL=TableStack.d.ts.map