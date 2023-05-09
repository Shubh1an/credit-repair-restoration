import axios from "axios";
import { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { parse } from "querystring";
import { withRouter } from "react-router-dom";

import { GrantType } from "../models/enums";
import { IAuthPayload } from "../models/interfaces/auth";
import { UrlUtils } from "../utils/http-url.util";
import AuthService from "./services/auth.service";
import { checkLogin } from "../actions/auth.actions";
import {
  APIConstants,
  ClientRoutesConstants,
  POSTGRID_API_KEY,
} from "../shared/constants";
import { setLogout } from "../actions/auth.actions";
import { BASE_URL } from "../actions/postgrid-templates.actions";

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      setLogin: checkLogin,
      setLogout,
    },
    dispatch
  );
};

const mapStateToProps = (state: any) => {
  return {
    auth: state.authModel?.auth,
  };
};
export const HTTPInterceptor = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter((props: any) => {
    useEffect(() => {
      // request interceptor
      axios.interceptors.request.use(
        (config) => {
          if (
            !config?.url?.startsWith("http") &&
            !config?.url?.startsWith("https")
          ) {
            config.url = UrlUtils.getBaseUrl() + config.url;
          }
          // const invalidPartnerKey = UrlUtils.isPartnerKeyInvalid();
          // if (!invalidPartnerKey && !config.headers["tenant"]) {
          //   config.headers["tenant"] = UrlUtils.getPartnerKey();
          // }
          config.headers["tenant"] = "CreditRepairDemo";
          // in memory token for public pages
          const token =
            AuthService.getSession()?.access_token ||
            AuthService.inMemorySesssion?.access_token ||
            "";
          const isRefreshTokenCall =
            config.data &&
            typeof config?.data === "string" &&
            parse(config?.data)?.grant_type === GrantType.refresh_token;
          if (!config.url.includes(BASE_URL)) {
            if (token && !isRefreshTokenCall) {
              config.headers["Authorization"] = "Bearer " + token;
              if (!config.headers["Content-Type"]) {
                config.headers["Content-Type"] = "application/json";
              }
            }
          }
          if (config.url.includes(BASE_URL)) {
            config.headers["x-api-key"] = POSTGRID_API_KEY.testKey;
            if (!config.headers["Content-Type"]) {
              config.headers["Content-Type"] = "application/json";
            }
          }
          return config;
        },
        (error) => {
          Promise.reject(error);
        }
      );
      //response interceptor
      axios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error: any) => {
          const originalRequest = error?.config;
          const loginAPIUrl = APIConstants.auth;
          if (error?.response?.status === 400) {
            // refresh token and login API failure response
            AuthService.setLogout();
            props.setLogout();
            props.history.push({
              pathname: ClientRoutesConstants.login,
              state: props?.location,
            });
            return Promise.reject(error);
          }

          if (error?.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;

            const refreshToken = props?.auth?.refresh_token;
            return props
              .setLogin({
                refresh_token: refreshToken,
                grant_type: GrantType.refresh_token,
              } as IAuthPayload)
              .then((result: any) => {
                if (result?.access_token && result?.expires_in) {
                  AuthService.setLogin(result);
                  const session = AuthService.getSession();
                  const token = session?.access_token || "";
                  axios.defaults.headers.common["Authorization"] =
                    "Bearer " + token;
                  return axios(originalRequest);
                }
              });
          }
          return Promise.reject(error);
        }
      );
    }, [props]);
    return null;
  })
);
