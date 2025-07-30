import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import jsonp from 'jsonp';
import { validate } from 'email-validator';
import classNames from 'classnames';
import { Text } from 'redaktus/core';
import * as types from 'redaktus/types';
import blockNames from '../blockNames';
var NewsletterProvider;
(function (NewsletterProvider) {
    NewsletterProvider["MailChimp"] = "MAILCHIMP";
    NewsletterProvider["ConvertKit"] = "CONVERTKIT";
})(NewsletterProvider || (NewsletterProvider = {}));
const NewsletterSubscribe = ({ centered = false, provider, mailchimpUrl, buttonText, resultOkText = `Thank you, we'll keep in touch with you!`, }) => {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState({
        status: 'IDLE',
        message: '',
    });
    const sendData = (url) => {
        setStatus({ status: 'SENDING', message: '' });
        jsonp(url, { param: 'c', timeout: 3500 }, (err, data) => {
            if (err) {
                setStatus({
                    status: 'ERROR',
                    message: 'An error occurred. Please, try again.',
                });
            }
            else if (data.msg.includes('already subscribed')) {
                setStatus({ status: 'ERROR', message: 'You were already subscribed' });
            }
            else if (data.result !== 'success') {
                setStatus({
                    status: 'ERROR',
                    message: 'An error occurred. Please, try again.',
                });
            }
            else {
                setStatus({ status: 'SUCCESS', message: '' });
            }
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (provider !== NewsletterProvider.MailChimp) {
            setStatus({
                status: 'ERROR',
                message: 'Provider not implemented',
            });
            return;
        }
        const isEmailValid = validate(email);
        if (!isEmailValid) {
            setStatus({
                status: 'ERROR',
                message: 'Please, enter a valid email address',
            });
            return;
        }
        if (!mailchimpUrl ||
            mailchimpUrl.length < 10 ||
            mailchimpUrl.indexOf('post') === -1) {
            setStatus({
                status: 'ERROR',
                message: 'Invalid Mailchimp URL',
            });
            return;
        }
        const emailEncoded = encodeURIComponent(email);
        const endpoint = mailchimpUrl.replace(/\/post/g, '/post-json');
        const url = `${endpoint}?EMAIL=${emailEncoded}`;
        sendData(url);
    };
    return (_jsx("section", { className: "py-12", style: { backgroundColor: '#deeffc', color: '#113d5f' }, children: _jsxs("div", { className: classNames('max-w-xl mx-auto flex flex-col', {
                'items-center': centered,
            }), children: [_jsx(Text, { renderBlock: (props) => (_jsx("h1", { className: "text-2xl mb-4 font-extrabold", ...props.attributes, children: props.children })), placeholder: "Type a title...", propName: "title" }), _jsx(Text, { renderBlock: (props) => (_jsx("p", { className: "mb-2", ...props.attributes, children: props.children })), placeholder: "Call to action...", propName: "description" }), _jsxs("form", { className: "flex", onSubmit: handleSubmit, children: [_jsx("input", { className: "bg-white focus:outline-none border-t-2 border-l-2 border-b-2 border-transparent focus:border-sky-500 rounded-l-lg py-2 px-4 appearance-none leading-normal", type: "text", placeholder: "jane@example.com", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("button", { type: "submit", disabled: status.status === 'SENDING', className: "bg-sky-500 px-8 rounded-r-lg text-white font-bold py-2", children: buttonText })] }), status.status === 'SUCCESS' && (_jsx("div", { className: "text-xl mt-4", children: resultOkText })), status.status === 'ERROR' && (_jsx("div", { className: "mt-4", style: { color: '#c00' }, children: status.message }))] }) }));
};
NewsletterSubscribe.schema = {
    name: blockNames.NewsletterSubscribe,
    label: 'Newsletter Subscribe',
    category: 'rb-ui website',
    playgroundLinkLabel: 'View source code on Github',
    playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/NewsletterSubscribe/NewsletterSubscribe.tsx',
    getDefaultProps: () => ({
        title: 'Want to receive updates from us?',
        description: 'Leave your e-mail',
        provider: NewsletterProvider.MailChimp,
        buttonText: 'Keep me updated',
        resultOkText: `Thank you, we'll keep in touch with you!`,
    }),
    sideEditProps: [
        {
            name: 'centered',
            label: 'Centered',
            type: types.SideEditPropType.Boolean,
        },
        {
            name: 'mailchimpUrl',
            label: 'Mailchimp Form URL',
            type: types.SideEditPropType.Text,
            // validate: (value: any) =>
            //   value && value.length > 10 && value.indexOf('https://') !== -1,
            //   //&& value.indexOf('list-manage.com/subscribe/post?') !== -1,
        },
        {
            name: 'buttonText',
            label: 'Button text',
            type: types.SideEditPropType.Text,
        },
        {
            name: 'resultOkText',
            label: 'Result OK text',
            type: types.SideEditPropType.Text,
        }
    ],
};
export default NewsletterSubscribe;
//# sourceMappingURL=NewsletterSubscribe.js.map