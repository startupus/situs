// Redaktus Inline Edit Machine - заглушка без xstate
const getInlineEditMachine = (config) => {
    return {
        initial: 'idle',
        states: {
            idle: {
                on: { EDIT: 'editing' }
            },
            editing: {
                on: { SAVE: 'idle', CANCEL: 'idle' }
            }
        }
    };
};
export default getInlineEditMachine;
//# sourceMappingURL=machine.js.map