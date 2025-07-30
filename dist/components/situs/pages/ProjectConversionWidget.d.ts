import React from "react";
interface ProjectConversion {
    id: number;
    name: string;
    conversionRate: number;
    visitors: number;
    orders: number;
    revenue: number;
    trend: "up" | "down" | "stable";
    trendValue: number;
}
interface ProjectConversionWidgetProps {
    projects: ProjectConversion[];
}
declare const ProjectConversionWidget: React.FC<ProjectConversionWidgetProps>;
export default ProjectConversionWidget;
//# sourceMappingURL=ProjectConversionWidget.d.ts.map