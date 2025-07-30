import React from 'react';
interface StatsCardProps {
    icon: React.ReactNode;
    color: string;
    title: string;
    subtitle?: string;
    value: string | number;
    trend?: {
        value: string;
        direction: 'up' | 'down';
    };
    progress?: number;
}
declare const StatsCard: React.FC<StatsCardProps>;
interface StatsGridProps {
    children: React.ReactNode;
    className?: string;
}
export declare const StatsGrid: React.FC<StatsGridProps>;
export default StatsCard;
//# sourceMappingURL=StatsCard.d.ts.map