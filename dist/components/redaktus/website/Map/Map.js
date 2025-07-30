import { jsx as _jsx } from "react/jsx-runtime";
import * as types from 'redaktus/types';
import { Map, Marker } from 'pigeon-maps';
import blockNames from '../blockNames';
import Section from '../layout/Section';
import Container from '../layout/Container';
import { BackgroundColorsSideEditProps } from 'website/LayoutSideProps';
const MAPTILER_ACCESS_TOKEN = 'zGVHxdSZR3rlLBsL6hUv#0.5';
const MAP_ID = 'streets';
const mapTilerProvider = (x, y, z, dpr) => {
    return `https://api.maptiler.com/maps/${MAP_ID}/256/${z}/${x}/${y}${dpr && dpr >= 2 ? '@2x' : ''}.png?key=${MAPTILER_ACCESS_TOKEN}`;
};
export const MapBrick = ({ width, bg, lat = '45.6782509', lng = '9.5669407', zoom = '10', }) => {
    return (_jsx(Section, { bg: bg, children: _jsx(Container, { size: width, children: _jsx(Map, { center: [parseFloat(lat), parseFloat(lng)], height: 350, metaWheelZoom: true, zoom: 10, provider: mapTilerProvider, dprs: [1, 2], metaWheelZoomWarning: "Use ctrl + wheel to zoom!", children: _jsx(Marker, { anchor: [parseFloat(lat), parseFloat(lng)] }) }) }) }));
};
MapBrick.schema = {
    name: blockNames.Map,
    label: 'Map',
    category: 'rb-ui website',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Map/Map.tsx',
    getDefaultProps: () => ({
        bg: {
            color: '#fff',
            className: 'bg-white dark:bg-gray-900',
        },
        borderTop: 'none',
        borderBottom: 'none',
        width: 'sm',
        lat: 45.6782509,
        lng: 9.5669407,
    }),
    sideEditProps: [
        BackgroundColorsSideEditProps,
        {
            name: 'zoom',
            label: 'Zoom',
            type: types.SideEditPropType.Number,
        },
        {
            name: 'lat',
            label: 'Latitude',
            type: types.SideEditPropType.Number,
        },
        {
            name: 'lng',
            label: 'Longitude',
            type: types.SideEditPropType.Number,
        }
    ],
};
export default MapBrick;
//# sourceMappingURL=Map.js.map