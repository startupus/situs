import * as types from 'redaktus/types';
import { Size } from '../layout/Container';
export interface TextImageProps {
    bg?: {
        color: string;
        className: string;
    };
    width?: Size;
    heroTitle?: boolean;
    mobileTextCenter?: boolean;
    multiple?: boolean;
    imageSide?: 'left' | 'right';
    mobileImageTop?: boolean;
    mobileIcon?: boolean;
    hasShadow?: boolean;
    isRounded?: boolean;
    bulletsVariant?: {
        color: string;
        className: string;
    };
}
declare const TextImage: types.Brick<TextImageProps>;
export default TextImage;
//# sourceMappingURL=TextImage.d.ts.map