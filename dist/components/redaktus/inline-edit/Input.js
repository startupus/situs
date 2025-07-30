import { jsx as _jsx } from "react/jsx-runtime";
const Input = ({ value, onChange, type = 'text', placeholder }) => {
    return (_jsx("input", { type: type, value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "redaktus-input" }));
};
export default Input;
//# sourceMappingURL=Input.js.map