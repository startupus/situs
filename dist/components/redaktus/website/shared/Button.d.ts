import * as types from 'redaktus/types';
export interface ButtonProps {
    text: string;
    href: string;
    isTargetBlank: boolean;
    isBigButton: boolean;
    variant?: 'pink' | 'sky';
    type?: 'solid' | 'outline';
    padding: 'normal' | 'small';
    className?: string;
}
declare const Button: types.Brick<ButtonProps>;
export default Button;
//# sourceMappingURL=Button.d.ts.map