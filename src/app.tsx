import './app.scss';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { Routes } from './routes';
import { checkLogin, setLogout, setLoginComplete, getPublicAuthToken } from "./actions/auth.actions";
import AuthService from './core/services/auth.service';
import { EnumScreens, GrantType } from './models/enums';
import { IAuthPayload } from './models/interfaces/auth';
import { FullScreenLoader } from './shared/components/fullscreen-loader';
import { getAuthRules } from './shared/actions/shared.actions';
import { IScreenProps } from './models/interfaces/shared';
import RoutingService from './core/services/routing-service';
import { FullScreenLoaderInner } from './shared/components/fullscreen-loader-inner';
import { AppUtils } from './utils/app-utils';
import { AppLevelOperations } from './core/components/app-level-operations.component';

class AppComponent extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      checkingLogin: true, axiousSource: axios.CancelToken.source(),
      currentRouteNotIsolate: !RoutingService.isIsolateRoutes(props?.location?.pathname),
      isLoginFromRemoteSite: (!!new URLSearchParams(props.location.search).get('officeid'))
    };
    this.checkRefreshToken = this.checkRefreshToken.bind(this);
    this.checkGuestUserToken = this.checkGuestUserToken.bind(this);
  }
  componentDidMount() {
    const tenant = (new URLSearchParams(this.props.location.search).get('tenant'));
    if (this.state.currentRouteNotIsolate) {
      this.checkRefreshToken();
    } else if (!this.state.currentRouteNotIsolate && tenant) {
      // public URL so get a guest token from BE
      this.checkGuestUserToken(tenant);
    }
  }
  componentDidUpdate() {
    AppUtils.checkAppLevelAccess(this.props.AuthRules);
  }
  checkRefreshToken() {
    const session = AuthService.getSession();
    if (session?.refresh_token) {
      this.props.checkLogin({
        refresh_token: session?.refresh_token,
        grant_type: GrantType.refresh_token
      } as IAuthPayload)
        .then((result: any) => {
          if (result?.access_token && result?.expires_in) {
            AuthService.setLogin(result);
            this.props?.getAuthRules(this.state?.axiousSource).then((mapping: IScreenProps[]) => {
              if (this.state.isLoginFromRemoteSite && window?.opener?.location) {
                AuthService.RedirectToRemoteLoginWindow();
              } else {
                this.props.setLoginComplete(result);
                this.setState({ checkingLogin: false });
              }
            }).catch(() => {
              this.setState({
                checkingLogin: false
              });
              this.redirectToLogout();
            })
          } else {
            this.redirectToLogout();
            this.setState({ checkingLogin: false });
          }
        }).catch((err: any) => {
          this.redirectToLogout();
          this.setState({ checkingLogin: false });
        });
    } else {
      this.setState({ checkingLogin: false });
    }
  }
  checkGuestUserToken(tenant: string) {
    this.props?.getPublicAuthToken(tenant)
      .then((result: any) => {
        if (result?.access_token && result?.expires_in) {
          AuthService.setLoginInMemory(result);
          this.props?.getAuthRules(this.state?.axiousSource).then((mapping: IScreenProps[]) => {
            this.props.setLoginComplete(result);
            this.setState({ checkingLogin: false });
          }).catch(() => {
            this.setState({
              checkingLogin: false
            });
            this.redirectToLogout();
          })
        } else {
          this.redirectToLogout();
          this.setState({ checkingLogin: false });
        }
      });

  }
  redirectToLogout() {
    this.props.setLogout();
    AuthService.setLogout();
  }
  render() {

    const { checkingLogin, currentRouteNotIsolate } = this.state;

    return (
      <>
        {checkingLogin && currentRouteNotIsolate ? <FullScreenLoader /> : null}
        <AppLevelOperations />
        <div className="App fixed">
          <div className="app-container">
            <Routes></Routes>
          </div>
          {currentRouteNotIsolate && <FullScreenLoaderInner />}
        </div>
      </>
    );
  }
}


const mapStateToProps = (state: any) => {
  return {
    auth: state.authModel,
    currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens,
    AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.Application)
  };
}
const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    checkLogin,
    setLogout,
    getAuthRules,
    setLoginComplete,
    getPublicAuthToken
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter((AppComponent)));
