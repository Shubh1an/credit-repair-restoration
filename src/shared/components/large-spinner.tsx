import React from 'react';
import { Spinner } from 'reactstrap';


export const LargeSpinner = (props?: { className?: string }) => {
    return (
        <div className="large-overlay">
            <Spinner size="lg" className={"ace-spinner " + (props?.className)} />
        </div>
    );
}