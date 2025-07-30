import React from 'react';
export interface HeroBlockProps {
    title: string;
    subtitle: string;
    primaryButtonText: string;
    primaryButtonUrl: string;
    secondaryButtonText: string;
    secondaryButtonUrl: string;
    heroImage: string;
    clientLogos: string[];
    onUpdate: (updates: Partial<HeroBlockProps>) => void;
}
export declare const HeroBlock: React.FC<HeroBlockProps>;
export default HeroBlock;
//# sourceMappingURL=HeroBlock.d.ts.map