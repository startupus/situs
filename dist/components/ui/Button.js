import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../lib/utils';
const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center text-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
        primary: 'bg-primary border-primary border text-white hover:bg-primary-hover hover:border-primary-hover active:bg-primary-active active:border-primary-active',
        secondary: 'bg-secondary border-secondary border text-white hover:bg-[#6B7280] hover:border-[#6B7280] active:bg-[#6B7280] active:border-[#6B7280]',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };
    const sizes = {
        sm: 'h-9 px-3 text-sm',
        md: 'py-3 px-7 text-base',
        lg: 'h-11 px-8 text-lg',
    };
    return (_jsx("button", { className: cn(baseStyles, variants[variant], sizes[size], className), ref: ref, ...props, children: children }));
});
Button.displayName = 'Button';
export default Button;
//# sourceMappingURL=Button.js.map