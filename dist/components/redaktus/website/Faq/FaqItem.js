import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import { Text, RichText } from 'redaktus/core';
import { textColors } from '../colors';
import blockNames from '../blockNames';
const FaqQuestion = () => {
    return (_jsxs("div", { className: "leading-6 mb-12", children: [_jsx(Text, { propName: "question", renderBlock: (props) => (_jsx("p", { className: classNames(textColors.gray900, 'font-extrabold mb-1'), ...props.attributes, children: props.children })), placeholder: "Answer..." }), _jsx(RichText, { propName: "answer", renderBlock: (props) => (_jsx("p", { className: textColors.gray800, ...props.attributes, children: props.children })), placeholder: "Answer..." })] }));
};
FaqQuestion.schema = {
    name: blockNames.Faq,
    label: 'Question',
    category: 'rb-ui website',
    hideFromAddMenu: true,
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Faq/FaqItem.tsx',
    getDefaultProps: () => ({
        question: 'Why you should change your CMS today?',
        answer: 'Because you want to have top user experience and top developer experience.',
    }),
};
export default FaqQuestion;
//# sourceMappingURL=FaqItem.js.map