import { jsx as _jsx } from "react/jsx-runtime";
const InputType = ({ value, onChange, type = 'text', placeholder }) => {
    return (_jsx("input", { type: type, value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "redaktus-input-type" }));
};
export default InputType;
//# sourceMappingURL=InputType.js.map