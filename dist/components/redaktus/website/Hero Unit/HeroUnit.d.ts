import * as types from 'redaktus/types';
import { GradientName } from '../colors';
export interface HeroUnitProps {
    bg?: {
        color: string;
        className: string;
    };
    size?: 'medium' | 'large';
    textGradient?: GradientName;
}
declare const HeroUnit: types.Brick<HeroUnitProps>;
export default HeroUnit;
//# sourceMappingURL=HeroUnit.d.ts.map