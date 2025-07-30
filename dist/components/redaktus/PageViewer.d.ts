import React from 'react';
interface RedaktusPageViewerProps {
    page: any;
    main?: boolean;
    className?: string;
    onBlockUpdate?: (blockId: string, newProps: any) => void;
    onBlockDelete?: (blockId: string) => void;
}
declare const RedaktusPageViewer: React.FC<RedaktusPageViewerProps>;
export default RedaktusPageViewer;
//# sourceMappingURL=PageViewer.d.ts.map