import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { ClientRoutesConstants } from '../../shared/constants';
import AuthService from '../services/auth.service';
import { setLogout } from '../../actions/auth.actions';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        setLogout
    }, dispatch);
}

const mapStateToProps = (state: any) => {
    return {
        auth: state.authModel
    };
}
export const PrivateRoute = connect(mapStateToProps, mapDispatchToProps)(({ component: Component, ...rest }: any) => {
    const [isLoggedIn, setIsLogin] = useState(AuthService.isLoggedIn());
    useEffect(() => {
        const login = AuthService.isLoggedIn();
        setIsLogin(login);
        if (!login) {
            rest?.setLogout();
        }
    });
    return (
        <Route {...rest} render={(props: any) => (
            isLoggedIn
                ? <Component {...props} {...rest} />
                : <Redirect to={{
                    pathname: ClientRoutesConstants.login,
                    state: props.location
                }} />
        )} />
    );
});