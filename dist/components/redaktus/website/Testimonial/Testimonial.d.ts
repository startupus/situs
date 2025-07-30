import * as types from 'redaktus/types';
export interface TestimonialProps {
    authorName: string;
    authorJobTitle: string;
    avatarImage: types.IImageSource;
    logoImage: types.IImageSource;
    small?: boolean;
    bg?: {
        color: string;
        className: string;
    };
}
declare const Testimonial: types.Brick<TestimonialProps>;
export default Testimonial;
//# sourceMappingURL=Testimonial.d.ts.map