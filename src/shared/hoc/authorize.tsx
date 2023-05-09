import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { EnumScreens } from '../../models/enums';
import { ClientRoutesConstants } from '../constants';

export const withAuthorize = (OriginalComponent: any, screenId: EnumScreens) => {

    const WrappedComponent = (props: any) => {
        if (!props?.availableScreens || props?.availableScreens?.includes(screenId)) {
            return <OriginalComponent {...props} />;
        } else {
            return <Redirect to={ClientRoutesConstants.unauthorized} />
        }
    }
    const mapStateToProps = (state: any) => {
        return {
            availableScreens: state?.sharedModel?.currentAccessibleScreens
        };
    }
    return connect(mapStateToProps)(WrappedComponent);
}