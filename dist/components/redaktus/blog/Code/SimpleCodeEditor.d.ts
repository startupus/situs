import * as React from 'react';
type Props = JSX.LibraryManagedAttributes<'div', React.ComponentProps<'div'>> & {
    value: string;
    onValueChange: (value: string) => unknown;
    highlight: (value: string) => string | React.ReactNode;
    tabSize: number;
    insertSpaces: boolean;
    ignoreTabKey: boolean;
    padding: number | string;
    style?: {};
    textareaId?: string;
    textareaClassName?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    maxLength?: number;
    minLength?: number;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    onClick?: React.MouseEventHandler<HTMLTextAreaElement>;
    onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
    onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    preClassName?: string;
};
type State = {
    capture: boolean;
};
type Record = {
    value: string;
    selectionStart: number;
    selectionEnd: number;
};
type History = {
    stack: Array<Record & {
        timestamp: number;
    }>;
    offset: number;
};
export default class Editor extends React.Component<Props, State> {
    static defaultProps: {
        tabSize: number;
        insertSpaces: boolean;
        ignoreTabKey: boolean;
        padding: number;
    };
    state: {
        capture: boolean;
    };
    componentDidMount(): void;
    _recordCurrentState: () => void;
    _getLines: (text: string, position: number) => string[];
    _recordChange: (record: Record, overwrite?: boolean) => void;
    _updateInput: (record: Record) => void;
    _applyEdits: (record: Record) => void;
    _undoEdit: () => void;
    _redoEdit: () => void;
    _handleKeyDown: (e: any) => void;
    _handleChange: (e: any) => void;
    _history: History;
    _input: HTMLTextAreaElement | null | undefined;
    get session(): {
        history: History;
    };
    set session(session: {
        history: History;
    });
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};
//# sourceMappingURL=SimpleCodeEditor.d.ts.map