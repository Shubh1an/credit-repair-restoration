import classNames from 'classnames';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import { ICheckbox } from '../../models/interfaces/shared';

export const Checkbox = (props: ICheckbox) => {

    const onDisabledLableClick = (e: any) => {
        e.stopPropagation();
        if (props?.enableClickOnDisabled && props?.disabled && props?.onChange) {
            props?.onChange({ value: props?.value, checked: false });
        }
    }

    return (
        <label className={classNames("ace-checkbox", props?.cssClass, { disabled: props?.disabled, disabled_overlay: props?.disabled })}
            title={props?.title || (typeof (props?.text) === 'string' ? props?.text : '')}
            onClick={onDisabledLableClick}
        >
            <input
                type={props?.circled ? "radio" : "checkbox"}
                checked={props?.checked}
                disabled={props?.disabled}
                name={props?.groupName}
                value={props?.value}
                onChange={(e) => props?.onChange && props.onChange({ value: props.value, checked: e.target.checked })}
            />
            <span className={"checkmark " + (!!props?.circled ? "circle" : "")} style={{ width: props?.width, height: props?.height }}></span>
            <span className="check-text" onClick={(e: any) => {
                if (props?.disableLabelClick) {
                    e.stopPropagation();
                    if (e.target.tagName !== 'A') {
                        e.preventDefault();
                    }
                }
            }}>
                {typeof (props.text) === 'function' ? <props.text {...props} ></props.text> : typeof (props.text) === 'object' ? props?.text : <span dangerouslySetInnerHTML={{ __html: props?.text || "" }}></span>}
            </span>
        </label >
    );
}