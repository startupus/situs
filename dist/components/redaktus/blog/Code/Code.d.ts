import * as types from 'redaktus/types';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/show-language/prism-show-language.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
export interface CodeBrickProps {
    language: string;
    dataline?: string;
    showLineNumbers: boolean;
}
declare const CodeBrick: types.Brick<CodeBrickProps>;
export default CodeBrick;
//# sourceMappingURL=Code.d.ts.map