import classnames from 'classnames';
import React, { useEffect, useState } from 'react';


export const ToggleSwitch = (props: { defaultChecked: boolean, size?: string, onChange: any }) => {
    const [picked, setPicked] = useState(!!props.defaultChecked);
    useEffect(() => {
        setPicked(props.defaultChecked);
    }, [props.defaultChecked]);
    return (
        <label className={classnames("toggle-control", props?.size)}>
            <input type="checkbox" checked={picked} onChange={(e) => { setPicked(e.target.checked); props.onChange && props.onChange(e.target.checked); }} />
            <span className="control"></span>
        </label>
    );
}