import React from 'react';

export const ModalComponent = (props: { bodyClass?: string, fullscreen?: boolean, halfFullScreen?: boolean, fullscreen100W?: boolean, isSmall?: boolean, hideClose?: boolean, isVisible: boolean, title: any, children: any, onClose: () => void }) => {
    return (
        props.isVisible ?
            <div className={"ace-modal " + (props?.fullscreen ? " ace-modal-fullscreen " : '') + (props?.fullscreen100W ? "ace-modal-fullscreen100W" : "") + (props?.halfFullScreen ? ' ace-modal-half-fullscreen ' : '') + (props?.isSmall ? ' ace-modal-small ' : '')}>
                <div className="ace-modal-sandbox"></div>
                <div className="ace-modal-box">
                    <div className="ace-modal-header position-relative f-16">
                        {!props?.hideClose && <div className="pointer close f-16" onClick={props.onClose}>&#10006;</div>}
                        <h4 className=' f-16'>{props.title}</h4>
                    </div>
                    <div className={"ace-modal-body " + (props?.bodyClass ? ' ' + props?.bodyClass : '')}>
                        {props.children}
                    </div>
                </div>
            </div>
            : null
    );
}