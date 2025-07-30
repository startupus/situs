import * as types from 'redaktus/types';
export type layoutType = 'base' | 'small' | 'small-3cols';
export interface FeatureItemProps {
    screenLayout: layoutType;
    isTextCenter: boolean;
}
declare const FeatureItem: types.Brick<FeatureItemProps>;
export default FeatureItem;
//# sourceMappingURL=FeatureItem.d.ts.map