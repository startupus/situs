interface MachineConfig {
    value: string;
    onSave: (value: string) => void;
    onCancel: () => void;
}
declare const getInlineEditMachine: (config: MachineConfig) => {
    initial: string;
    states: {
        idle: {
            on: {
                EDIT: string;
            };
        };
        editing: {
            on: {
                SAVE: string;
                CANCEL: string;
            };
        };
    };
};
export default getInlineEditMachine;
//# sourceMappingURL=machine.d.ts.map