export type TextColorName = 'gray900' | 'gray800' | 'gray700' | 'gray600' | 'gray500' | 'purple500';
export type BgColorName = 'white' | 'light' | 'gray' | 'lightBlue' | 'orange' | 'green' | 'darkBlue' | 'dark';
export type GradientName = 'none' | 'ocean' | 'violet' | 'sun';
export type BadgeColorName = 'gray' | 'pink' | 'green' | 'blue';
export type BulletColorName = 'pink' | 'pinkLight' | 'sky' | 'skyLight' | 'green' | 'greenLight';
type Color = {
    label: string;
    value: {
        color: string;
        className: string;
        className2?: string;
    };
};
type TextColors = {
    [key in TextColorName]: string;
};
type BgColors = {
    [key in BgColorName]: Color;
};
type BadgeColors = {
    [key in BadgeColorName]: Color;
};
type BulletColors = {
    [key in BulletColorName]: Color;
};
type Gradients = {
    [key in GradientName]: string;
};
export declare const textColors: TextColors;
export declare const bgColors: BgColors;
export declare const badgeColors: BadgeColors;
export declare const bulletColors: BulletColors;
export declare const gradients: Gradients;
export {};
//# sourceMappingURL=colors.d.ts.map