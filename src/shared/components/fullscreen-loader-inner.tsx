import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state: any) => {
    return {
        sharedModel: state.sharedModel
    };
}

export const FullScreenLoaderInner = connect(mapStateToProps)((props: any) => {
    return (
        props?.sharedModel?.isLoaderShownInner ?
            <>
                <div className="back-overlay">
                </div>
                <div className="loader-body">
                    <i className="fa fa-spinner fa-spin fa-3x"></i>
                    <div className="message-section pl-2">
                        {
                            props?.sharedModel?.loaderInnerMessage || 'Please Wait!!'
                        }
                    </div>
                </div>
            </>
            : null
    );
})