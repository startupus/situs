import * as React from 'react';
export type Size = 'lg' | 'md' | 'sm' | 'full';
export interface ContainerProps {
    size?: Size;
    className?: string;
    children?: React.ReactNode;
}
declare const Container: React.FC<ContainerProps>;
export default Container;
//# sourceMappingURL=Container.d.ts.map