import React from 'react';
export interface TestimonialBlockProps {
    testimonials: Array<{
        image: string;
        name: string;
        position: string;
        details: string;
    }>;
    onUpdate: (updates: Partial<TestimonialBlockProps>) => void;
}
export declare const TestimonialBlock: React.FC<TestimonialBlockProps>;
export default TestimonialBlock;
//# sourceMappingURL=TestimonialBlock.d.ts.map