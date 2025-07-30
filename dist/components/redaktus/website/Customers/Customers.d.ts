import * as types from 'redaktus/types';
import { Size } from '../layout/Container';
import { Border } from '../layout/Section';
export interface CustomersProps {
    bg?: {
        color: string;
        className: string;
    };
    borderTop?: Border;
    borderBottom?: Border;
    size?: 'medium' | 'large';
    width?: Size;
    grayscale?: boolean;
}
declare const Customers: types.Brick<CustomersProps>;
export default Customers;
//# sourceMappingURL=Customers.d.ts.map