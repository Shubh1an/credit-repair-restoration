import classnames from 'classnames';
import React from 'react';
import { Spinner } from 'reactstrap';

export const ButtonComponent = (props: {
    spinnerRight?: boolean, children?: any, title?: string,
    loading?: boolean, onClick?: any, text?: any, className?: string, disabled?: boolean,
    sizeClass?: string
}) => {
    return (
        <button type="button" title={props?.title ?? ''}
            disabled={props?.disabled || props?.loading}
            onClick={props?.onClick}
            className={classnames("btn position-relative", (props?.className || 'btn-default'), (props?.sizeClass || 'btn-sm'))}>
            {
                !props?.spinnerRight
                && (props?.loading ? <Spinner size="sm" className="ace-spinner mr-1" /> : props?.children)
            }
            {props?.text}
            {
                props?.spinnerRight && (props?.loading ? <Spinner size="sm" className="ace-spinner ml-1" /> : props?.children)
            }
        </button>

    );
}