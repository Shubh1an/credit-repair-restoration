import React from 'react';
import ScrollToTop from "react-scroll-to-top";


export const ScrollToTopComponent = (props: any) => {

    const getComponent = () => {
        return (
            <div>
                <i className="fa fa-arrow-up"></i>
                Top
            </div>
        );
    }

    return (
        <ScrollToTop smooth component={getComponent()} top={200} className={'scroll-to-top-button'} />
    );
}