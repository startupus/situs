import React from 'react';
interface RichTextProps {
    propName: string;
    placeholder?: string;
    allowedFeatures?: string[];
    renderBlock?: (props: any) => React.ReactElement;
    renderHighlight?: (props: any) => React.ReactElement;
    renderLink?: (props: any) => React.ReactElement;
    renderCode?: (props: any) => React.ReactElement;
    value?: string;
    onChange?: (value: string) => void;
}
export declare const RichText: React.FC<RichTextProps>;
interface TextProps {
    propName: string;
    placeholder?: string;
    renderBlock?: (props: any) => React.ReactElement;
    value?: string;
    onChange?: (value: string) => void;
}
export declare const Text: React.FC<TextProps>;
interface ImageProps {
    propName: string;
    alt?: string;
    maxWidth?: number;
    aspectRatio?: number;
    imageClassName?: string;
    value?: string;
    onChange?: (value: string) => void;
}
export declare const Image: React.FC<ImageProps>;
interface RepeaterProps {
    propName: string;
    renderWrapper?: (items: React.ReactNode) => React.ReactElement;
    children?: React.ReactNode;
}
export declare const Repeater: React.FC<RepeaterProps>;
export {};
//# sourceMappingURL=editing-components.d.ts.map