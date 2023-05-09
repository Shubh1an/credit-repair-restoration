import "./login.scss";

import React, { createRef } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios, { CancelTokenSource } from "axios";
import classnames from "classnames";

import AuthService from "../../../core/services/auth.service";
import {
  checkLogin,
  setLoginComplete,
  setLogout,
} from "../../../actions/auth.actions";
import {
  IAuthPayload,
  ILoginResponse,
  ILoginState,
} from "../../../models/interfaces/auth";
import { ClientRoutesConstants, Messages } from "../../../shared/constants";
import { GrantType } from "../../../models/enums";
import { ButtonComponent } from "../../../shared/components/button";
import {
  getAuthRules,
  passwordNotStrong,
} from "../../../shared/actions/shared.actions";
import { IScreenProps } from "../../../models/interfaces/shared";
import { CommonUtils } from "../../../utils/common-utils";

class LoginComponent extends React.PureComponent<any, ILoginState> {
  uPass: React.RefObject<HTMLInputElement>;
  uName: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    const search = new URLSearchParams(props.location.search);
    const isLoginFromRemoteSite = !!search.get("officeid");
    this.uName = createRef();
    this.uPass = createRef();
    const source = axios.CancelToken.source();
    this.state = {
      isLoading: false,
      isError: false,
      password: "",
      username: "",
      noValues: false,
      redirectToReferrer: false,
      viewPass: false,
      axiousSource: source,
      isLoginFromRemoteSite,
    };
    this.onLoginHandler = this.onLoginHandler.bind(this);
    this.onkeyDown = this.onkeyDown.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.performLogin = this.performLogin.bind(this);
  }
  onLoginHandler() {
    this.setState({
      isError: false,
      noValues: false,
    });
    if (this.uName?.current?.value && this.uPass?.current?.value) {
      this.setState({
        isLoading: true,
      });
      this.performLogin(
        this.uName?.current?.value,
        this.uPass?.current?.value,
        this.state.axiousSource
      );
    } else {
      this.setState({
        noValues: true,
      });
    }
  }
  componentDidMount() {
    this.props.setLogout();
  }
  performLogin(
    username?: string,
    password?: string,
    axiousSource?: CancelTokenSource
  ) {
    this.props
      .setLogin({
        username,
        password,
        grant_type: GrantType.password,
      } as IAuthPayload)
      .then((result: ILoginResponse) => {
        console.log("from_login", result);
        if (result?.access_token && result?.expires_in) {
          AuthService.setLogin(result);
          this.props?.passwordNotStrong(
            !CommonUtils.isPasswordStrong(password || "")
          );
          this.props
            ?.getAuthRules(axiousSource)
            .then((mapping: IScreenProps[]) => {
              console.log("from_new_places", this.state.isLoginFromRemoteSite);
              if (this.state.isLoginFromRemoteSite && window?.opener) {
                AuthService.RedirectToRemoteLoginWindow();
              } else {
                this.setState({ redirectToReferrer: true });
                this.props.setLoginComplete(result);
              }
            })
            .catch((err: any) => {
              if (!axios.isCancel(err)) {
                this.resetFields();
                AuthService.setLogout();
                this.setState({
                  isError: true,
                  isLoading: false,
                });
              }
            });
        } else {
          this.setState({
            isError: true,
          });
          this.resetFields();
        }
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          this.resetFields();
          this.setState({
            isError: true,
            isLoading: false,
          });
        }
      });
  }
  resetFields() {
    if (this.uName?.current && this.uPass?.current) {
      this.uName.current.value = "";
      this.uPass.current.value = "";
    }
    this.uName?.current?.focus();
  }
  onkeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      this.onLoginHandler();
    }
  }
  componentWillUnmount() {
    if (this.state.axiousSource?.cancel)
      this.state.axiousSource?.cancel(Messages.APIAborted);
  }
  render() {
    const { isLoading, isError, noValues, redirectToReferrer, viewPass } =
      this.state;
    if (redirectToReferrer) {
      const from = this.props?.location?.state || { from: { pathname: "/" } };
      return <Redirect to={from} />;
    }
    return (
      <div className="container-center">
        {
          <div className="login-area">
            <div className="card panel-custom">
              <div className="card-heading custom_head">
                <div className="view-header">
                  <div className="header-icon">
                    <i className="pe-7s-unlock"></i>
                  </div>
                  <div className="header-title">
                    <h3>Login</h3>
                    <small>
                      <strong>Please enter your credentials to login.</strong>
                    </small>
                  </div>
                </div>
              </div>
              <div className="card-body login-card">
                <form id="loginForm">
                  {isError ? (
                    <div className="messages">
                      <i className="fa fa fa-exclamation-circle mr-1"></i>{" "}
                      Invalid Credentials!
                    </div>
                  ) : null}
                  {noValues ? (
                    <div className="messages">
                      Please enter username/email and password
                    </div>
                  ) : null}
                  <div className="form-group">
                    <label className="control-label" htmlFor="username">
                      Username/Email
                    </label>
                    <input
                      disabled={isLoading}
                      ref={this.uName}
                      autoFocus
                      onKeyDown={(e: any) => this.onkeyDown(e)}
                      type="text"
                      title="Please enter you username/email"
                      id="username"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="control-label" htmlFor="password">
                      Password
                    </label>
                    <div className="input-group d-flex align-items-center position-relative">
                      <input
                        type={viewPass ? "text" : "password"}
                        disabled={isLoading}
                        ref={this.uPass}
                        onKeyDown={(e: any) => this.onkeyDown(e)}
                        title="Please enter your password"
                        id="password"
                        className="form-control"
                      />
                      <i
                        title="Long press to view password"
                        onMouseDown={() => this.setState({ viewPass: true })}
                        onMouseUp={() => this.setState({ viewPass: false })}
                        className={classnames("fa  ml-1 pointer view-pass", {
                          "fa-eye": viewPass,
                          "fa-eye-slash": !viewPass,
                        })}
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                  <div className="login-buttons">
                    <div>
                      <ButtonComponent
                        text={<span className="login-text">Login</span>}
                        className="btn-primary"
                        loading={isLoading}
                        onClick={this.onLoginHandler}
                      />
                      <Link
                        className="forget-link"
                        to={ClientRoutesConstants.forgetPassword}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    {/* <Link className="btn btn-warning register" to={ClientRoutesConstants.register}>Register</Link> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
const mapStateToProps = (state: any) => {
  return {
    auth: state.authModel,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      setLogin: checkLogin,
      getAuthRules,
      setLoginComplete,
      passwordNotStrong,
      setLogout,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginComponent));
