import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import * as prism from 'prismjs';
import Styles from './Styles';
const PrismCode = ({ code, plugins, language, dataLine, }) => {
    const codeRef = React.useRef(null);
    const highlight = () => {
        if (codeRef && codeRef.current) {
            prism.highlightElement(codeRef.current);
        }
    };
    React.useEffect(() => {
        highlight();
    }, [dataLine]);
    const dataLineObj = dataLine ? { 'data-line': dataLine } : {};
    return (_jsxs(_Fragment, { children: [_jsx(Styles, {}), _jsx("pre", { className: `rounded-lg ${!plugins ? '' : plugins.join(' ')}`, ...dataLineObj, children: _jsx("code", { ref: codeRef, className: `language-${language}`, children: code.trim() }) })] }));
};
export default PrismCode;
//# sourceMappingURL=PrismCode.js.map