import * as types from 'redaktus/types';
import { UseFormRegister } from 'react-hook-form';
export interface FormRadiobuttonsProps {
    register?: UseFormRegister<any>;
    fieldName?: string;
    fieldLabel?: string;
    isRequired: boolean;
    columns: 'one' | 'two';
}
declare const FormRadiobuttons: types.Brick<FormRadiobuttonsProps>;
export default FormRadiobuttons;
//# sourceMappingURL=FormRadiobuttons.d.ts.map