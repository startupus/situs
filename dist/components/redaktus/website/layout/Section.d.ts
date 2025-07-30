import * as React from 'react';
export type Border = 'none' | 'full' | 'boxed';
interface SectionProps {
    bg?: {
        color: string;
        className: string;
    };
    borderTop?: Border;
    borderBottom?: Border;
    className?: string;
    children?: React.ReactNode;
}
declare const Section: React.FC<SectionProps>;
export default Section;
//# sourceMappingURL=Section.d.ts.map