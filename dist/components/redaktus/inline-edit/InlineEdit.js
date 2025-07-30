import { jsx as _jsx } from "react/jsx-runtime";
const InlineEdit = ({ value, onChange, type = 'text', placeholder }) => {
    return (_jsx("input", { type: type, value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "inline-edit-input" }));
};
export default InlineEdit;
//# sourceMappingURL=InlineEdit.js.map