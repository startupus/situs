import React from 'react';
import * as types from 'redaktus/types';
interface PostListItemProps {
    title: string;
    href: string;
    content: string;
    author: any;
    date: string;
    featuredImg?: types.IImageSource;
}
declare const PostListItem: React.FC<PostListItemProps>;
export default PostListItem;
//# sourceMappingURL=PostListItem.d.ts.map