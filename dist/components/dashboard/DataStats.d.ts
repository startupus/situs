import React from 'react';
export interface DataStatsCardProps {
    title: string;
    subtitle?: string;
    value: string | number;
    change?: {
        value: string;
        type: 'increase' | 'decrease';
    };
    percent?: number;
    icon?: React.ReactNode;
    color?: string;
    className?: string;
}
export interface DataStatsProps {
    cards: DataStatsCardProps[];
    className?: string;
}
declare const DataStats: React.FC<DataStatsProps>;
export default DataStats;
//# sourceMappingURL=DataStats.d.ts.map