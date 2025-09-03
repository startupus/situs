// Redaktus Inline Edit Machine - заглушка без xstate

interface MachineConfig {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const getInlineEditMachine = (config: MachineConfig) => {
  return {
    initial: 'idle',
    states: {
      idle: {
        on: { EDIT: 'editing' },
      },
      editing: {
        on: { SAVE: 'idle', CANCEL: 'idle' },
      },
    },
  };
};

export default getInlineEditMachine;
