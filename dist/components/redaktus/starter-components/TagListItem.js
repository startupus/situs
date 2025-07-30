import { jsx as _jsx } from "react/jsx-runtime";
import Link from 'next/link';
import { useTheme } from '../../../hooks/useTheme';
const TagListItem = ({ tag }) => {
    const { resolvedTheme } = useTheme();
    return (_jsx(Link, { href: `/blog/tag/${tag}`, className: `inline-block text-sm mr-2 mb-2 transform transition-all duration-200 hover:-translate-y-0.5 rounded-md py-1.5 px-2.5 ${resolvedTheme === 'dark'
            ? '!text-gray-100 !bg-white/20 hover:!bg-sky-500/40 hover:!text-white'
            : '!text-sky-900 !bg-sky-100 hover:!bg-sky-200'}`, children: tag }));
};
export default TagListItem;
//# sourceMappingURL=TagListItem.js.map