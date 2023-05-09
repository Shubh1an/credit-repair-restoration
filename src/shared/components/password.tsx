import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Options, passwordStrength } from 'check-password-strength'
import { PasswordStrengthIndicator } from './password-strength-indicator';
import { PASSWORDSTRENGTH } from '../constants';
import { CommonUtils } from '../../utils/common-utils';
export const PasswordComponent = (props: {
    defaultvalue?: string,
    onChange: any, disabled?: boolean, readOnly?: boolean, name: string,
    autoComplete?: string,
    disableStrengthMeter?: boolean,
}) => {
    const [viewPass, setViewPass] = useState(false);
    const [strengthMeter, setStrengthMeter] = useState({});
    const [password, setPassword] = useState('');
    useEffect(() => {
        let obj = {
            target: {
                name: props?.name,
                value: props?.defaultvalue
            }
        }
        onChangePassword(obj);
    }, [props?.defaultvalue])
    const onChangePassword = (e: any) => {
        setPassword(e?.target?.value);
        const calculatedStrength = passwordStrength(e?.target?.value, PASSWORDSTRENGTH as Options<string>)
        const isValid = calculatedStrength.id >= 2;
        setStrengthMeter(calculatedStrength);
        props.onChange({ event: e, isValid, strength: calculatedStrength });
    }

    return (
        <>
            <div className="input-group d-flex flex-1 align-items-center position-relative">
                <input autoComplete={props.autoComplete || props.name} disabled={props?.disabled} readOnly={props?.readOnly} defaultValue={props?.defaultvalue || ''}
                    value={password}
                    onChange={onChangePassword} name={props.name} type={viewPass ? 'text' : "password"} className="form-control" placeholder="Password" required={true} />
                <i title="Long press to view password" onMouseDown={() => setViewPass(true)} onMouseUp={() => setViewPass(false)}
                    className={classnames("fa  ml-1 pointer view-pass", { 'fa-eye': viewPass, 'fa-eye-slash': !viewPass })} aria-hidden="true"></i>
            </div>
            {!props?.readOnly && !props?.disableStrengthMeter &&
                <PasswordStrengthIndicator options={strengthMeter} value={password} />
            }
        </>
    );
}