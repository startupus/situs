export declare const projectOrdersData: {
    projectName: string;
    orders: number;
}[];
export declare const projectTrafficData: {
    projectName: string;
    traffic: number[];
}[];
export declare const timeLabels: string[];
export declare const projectConversionData: ({
    id: number;
    name: string;
    conversionRate: number;
    visitors: number;
    orders: number;
    revenue: number;
    trend: "up";
    trendValue: number;
} | {
    id: number;
    name: string;
    conversionRate: number;
    visitors: number;
    orders: number;
    revenue: number;
    trend: "down";
    trendValue: number;
} | {
    id: number;
    name: string;
    conversionRate: number;
    visitors: number;
    orders: number;
    revenue: number;
    trend: "stable";
    trendValue: number;
})[];
//# sourceMappingURL=dashboardData.d.ts.map