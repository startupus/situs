import * as types from 'redaktus/types';
import { Size } from '../layout/Container';
export interface MapProps {
    bg?: {
        color: string;
        className: string;
    };
    size?: 'medium' | 'large';
    width?: Size;
    zoom: string;
    lat: string;
    lng: string;
}
export declare const MapBrick: types.Brick<MapProps>;
export default MapBrick;
//# sourceMappingURL=Map.d.ts.map