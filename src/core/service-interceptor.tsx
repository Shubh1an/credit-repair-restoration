import axios from "axios";
import { setLogout } from "../actions/auth.actions";
import { UrlUtils } from "../utils/http-url.util";
import AuthService from "./services/auth.service";
import { withRouter } from "react-router";
import history from "./services/history";
import { ClientRoutesConstants } from "../shared/constants";
let BASE_URL = UrlUtils.getBaseUrl();
const TLservice = axios.create({
  baseURL: BASE_URL,
});
TLservice.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error && error.response.status == 400) {
      AuthService.setLogout();
      setLogout();
      history.push({
        pathname: ClientRoutesConstants.login,
      });
      return Promise.reject(error);
    }
  }
);
TLservice.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
export default TLservice;
