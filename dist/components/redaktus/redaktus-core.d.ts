import React from 'react';
export declare const Admin: React.FC<{
    children: React.ReactNode;
    isLogin?: boolean;
}>;
export declare const Editor: React.FC;
export declare const Login: React.FC;
export declare const Playground: React.FC;
export declare const AppSettings: React.FC;
export declare const MediaLibrary: React.FC;
export declare const Text: React.FC<any>;
export declare const RichText: React.FC<any>;
export declare const RichTextExt: React.FC<any>;
export declare const Image: React.FC<any>;
export declare const File: React.FC<any>;
export declare const Icon: React.FC<any>;
export declare const Meta: React.FC<any>;
export declare const PageViewer: React.FC<any>;
export declare const Preview: React.FC<any>;
export declare const Repeater: React.FC<any>;
export declare const Slot: React.FC<any>;
export declare const Link: React.FC<any>;
export declare const useRedaktus: () => {
    isDarkColorMode: boolean;
    toggleColorMode: () => void;
};
export declare const useVisualEdit: (initialValue?: string) => readonly [string, (newValue: string) => void, false];
export declare const RedaktusContext: React.Context<{
    isDarkColorMode: boolean;
}>;
export declare const SsoLogin: React.FC;
export declare const SsoLoginSuccess: React.FC;
export declare const SsoLoginFailure: React.FC;
export declare const useAdminContext: () => {
    isAdmin: boolean;
    isLogin: boolean;
};
export declare const usePage: () => {
    page: null;
    loading: boolean;
};
export declare const usePagePublic: () => {
    page: null;
    loading: boolean;
};
export declare const usePageValues: () => {
    values: {};
    setValues: () => void;
};
export declare const usePages: () => {
    pages: never[];
    loading: boolean;
};
export declare const usePagesPublic: () => {
    pages: never[];
    loading: boolean;
};
export declare const useRedaktusContext: () => {
    isDarkColorMode: boolean;
    toggleColorMode: () => void;
};
export declare const useTagsPublic: () => {
    tags: never[];
    loading: boolean;
};
export declare const fetchPage: () => Promise<null>;
export declare const fetchPages: () => Promise<never[]>;
export declare const fetchTags: () => Promise<never[]>;
export declare const renderJsonLd: () => null;
export declare const renderMeta: () => null;
export declare const cleanPage: () => null;
export declare const getPagePlainText: () => string;
export declare const getSchemaOrgData: () => null;
export declare const blockPluginConstructor: () => null;
export declare const blockWithModalPluginConstructor: () => null;
export declare const markPluginConstructor: () => null;
export declare const plugins: never[];
export declare const JsonLd: React.FC;
export declare const Plain: React.FC;
export declare const useAuth: () => {
    isAuthenticated: boolean;
    user: null;
};
export declare const uuid: () => string;
export declare const Redaktus: React.FC<any>;
//# sourceMappingURL=redaktus-core.d.ts.map