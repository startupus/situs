import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Image } from 'redaktus/frontend';
import dayjs from 'dayjs';
import { useTheme } from '../../../hooks/useTheme';
const PostListItem = ({ title, href, content, author, date, featuredImg, }) => {
    const { resolvedTheme } = useTheme();
    return (_jsxs("div", { className: "flex flex-col hover:-translate-y-2 transition-transform duration-300", children: [_jsx(Image, { readonly: true, source: featuredImg, alt: "Blog article featured image", imageClassName: "aspect-video object-cover rounded-xs" }), _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "my-6", children: [_jsx("h3", { className: `font-bold text-xl transition-colors duration-200 ${resolvedTheme === 'dark' ? '!text-gray-100' : '!text-gray-900'}`, children: title }), _jsx("p", { className: `mt-2 leading-6 transition-colors duration-200 ${resolvedTheme === 'dark' ? '!text-gray-100' : '!text-gray-800'}`, children: content })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("img", { src: author.avatarUrl, alt: author.firstName + ' ' + author.lastName, className: "w-8 rounded-full" }), _jsxs("div", { children: [_jsxs("div", { className: `text-sm transition-colors duration-200 ${resolvedTheme === 'dark' ? '!text-gray-100' : '!text-gray-800'}`, children: [author.firstName, " ", author.lastName] }), _jsx("div", { className: `text-xs transition-colors duration-200 ${resolvedTheme === 'dark' ? '!text-gray-400' : '!text-gray-500'}`, children: dayjs(date).format('DD MMM YYYY') })] })] })] })] }));
};
export default PostListItem;
//# sourceMappingURL=PostListItem.js.map