import * as types from 'redaktus/types';
declare enum NewsletterProvider {
    MailChimp = "MAILCHIMP",
    ConvertKit = "CONVERTKIT"
}
export interface NewsletterSubscribeProps {
    centered?: boolean;
    provider: NewsletterProvider;
    mailchimpUrl: string;
    buttonText: string;
    resultOkText: string;
}
declare const NewsletterSubscribe: types.Brick<NewsletterSubscribeProps>;
export default NewsletterSubscribe;
//# sourceMappingURL=NewsletterSubscribe.d.ts.map