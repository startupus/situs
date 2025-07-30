import React from 'react';
export interface ServiceItem {
    title: string;
    details: string;
    icon: string;
}
export interface ServicesBlockProps {
    sectionTitle: string;
    sectionSubtitle: string;
    sectionDescription: string;
    services: ServiceItem[];
    onUpdate: (updates: Partial<ServicesBlockProps>) => void;
}
export declare const ServicesBlock: React.FC<ServicesBlockProps>;
export default ServicesBlock;
//# sourceMappingURL=ServicesBlock.d.ts.map