import axios, { CancelTokenSource } from "axios";
import { stringify } from "querystring";

import { getAction } from "./action";
import { AuthActionTypes } from "./auth.action-types";
import { IAuthPayload, ILoginResponse } from "../models/interfaces/auth";
import AuthService from "../core/services/auth.service";
import { APIConstants } from "../shared/constants";
import { UrlUtils } from "../utils/http-url.util";
import { CommonUtils } from "../utils/common-utils";

export const checkLogin = (params: IAuthPayload) => {
  console.log("from check login", params);
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      let headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      } as any;
      axios
        .post(
          UrlUtils.getBaseUrl() + APIConstants.auth,
          stringify(params as any),
          {
            headers,
          }
        )
        .then((result: any) => result?.data)
        .then((result: ILoginResponse) => {
          if (result) {
            resolve(result);
          } else {
            dispatch(getAction(AuthActionTypes.CHECK_LOGIN_FAILURE));
            reject(null);
          }
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            if (err.response?.data?.error === "user_locked") {
              dispatch(
                getAction(AuthActionTypes.PORTAL_LOCKED, {
                  isLocked: true,
                  lockedMessage: err?.response?.data?.error_description,
                })
              );
              reject(null);
            } else {
              dispatch(getAction(AuthActionTypes.CHECK_LOGIN_FAILURE));
              reject(null);
            }
          }
        });
    });
  };
};

export const setLoginComplete = (result: any) => {
  console.log("from_login_complete", result);
  return (dispatch: any) => {
    dispatch(getAction(AuthActionTypes.CHECK_LOGIN_SUCCESS, result));
  };
};
export const setLogout = () => {
  return (dispatch: any) => {
    AuthService.setLogout();
    dispatch(getAction(AuthActionTypes.SET_LOGOUT));
  };
};

export const setPasswordResetLink = (
  payload: any,
  source?: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          UrlUtils.getBaseUrl() + APIConstants.forgotPasswordLInk,
          payload,
          { cancelToken: source?.token }
        )
        .then((result: any) => result?.data)
        .then((result: any) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const resetPassword = (payload: any, source?: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      axios
        .put(UrlUtils.getBaseUrl() + APIConstants.resetPassword, payload, {
          cancelToken: source?.token,
        })
        .then((result: any) => result?.data)
        .then((result: any) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const checkLinkExpiry = (payload: any, source?: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      axios
        .put(UrlUtils.getBaseUrl() + APIConstants.verifyResetLink, payload, {
          cancelToken: source?.token,
        })
        .then((result: any) => result?.data)
        .then((result: any) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const getPublicAuthToken = (tenant: string) => {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      dispatch(getAction(AuthActionTypes.SET_GETTING_GUEST_TOKEN, true));
      axios
        .get(
          CommonUtils.formatString(
            UrlUtils.getBaseUrl() + APIConstants.getPublicToken,
            tenant
          )
        )
        .then((result: any) => result?.data)
        .then((result: ILoginResponse) => {
          dispatch(getAction(AuthActionTypes.SET_GETTING_GUEST_TOKEN, false));
          resolve(result);
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            dispatch(getAction(AuthActionTypes.SET_GETTING_GUEST_TOKEN, false));
            reject(null);
          }
        });
    });
  };
};
