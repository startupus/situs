import { jsx as _jsx } from "react/jsx-runtime";
import * as types from 'redaktus/types';
import blockNames from '../blockNames';
import Container from '../layout/Container';
import Section from '../layout/Section';
const videoUrlPrefix = Object.freeze({
    youtube: 'https://www.youtube.com/embed/',
    vimeo: 'https://player.vimeo.com/video/',
});
const Video = ({ platform, url }) => {
    return (_jsx(Section, { children: _jsx(Container, { children: _jsx("div", { className: "aspect-video", children: _jsx("iframe", { width: "100%", height: "100%", src: `${videoUrlPrefix[platform]}${url}?rel=0` }, "video iframe") }) }) }));
};
Video.schema = {
    name: blockNames.Video,
    label: 'Video',
    category: 'rb-ui blog',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/blog/Video/Video.tsx',
    getDefaultProps: () => ({
        url: 'A60xWr-nqv0',
        platform: 'youtube',
    }),
    sideEditProps: [
        {
            name: 'platform',
            label: 'Video platform',
            type: types.SideEditPropType.Select,
            selectOptions: {
                display: types.OptionsDisplay.Radio,
                options: [
                    { value: 'youtube', label: 'YouTube' },
                    { value: 'vimeo', label: 'Vimeo' },
                ],
            },
        },
        {
            name: 'url',
            label: 'Video ID (i.e. "A60xWr-nqv0")',
            type: types.SideEditPropType.Text,
        },
    ],
};
export default Video;
//# sourceMappingURL=Video.js.map