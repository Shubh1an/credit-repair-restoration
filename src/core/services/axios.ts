import axios from "axios";

axios.interceptors.response.use(
  (config: any) => {
    return config;
  },
  (error) => {
    if (error && error.response) {
      if (error.response.status === 401) {
        // initial call to whoami will get intercepted here and redirect, need to throw log event
        // TODO: Do something
      }
      // const { data } = error.response;
      // const errorPayload =
      //   data.error ||
      //   data.errors ||
      //   data.error_message ||
      //   data.error_type ||
      //   data.message;

      return Promise.reject(error.response);
    }

    return Promise.reject(error);
  }
);
/**
 *
 * @param {*} path api endpoint
 * @returns data
 */
export function apiGet(path: string) {
  let config = {
    headers: {
      "x-api-key": "test_sk_gREnmKjMYFq4GVj3qkT4LX",
      "Content-Type": "application/json",
    },
  };

  return axios.get(path, config);
}
/**
 *
 * @param {*} path api endpoint
 * @param {*} data body object for post request
 * @returns
 */
export function apiPost(path: string, data: any) {
  const authToken = localStorage.getItem("authToken");
  let config;
  if (authToken) {
    config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
  } else {
    config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return axios.post(path, data, config);
}
/**
 *
 * @param {*} path api endpoint
 * @param {*} data  body object for path request
 * @param {*} headers  header
 * @returns
 */
export function apiPatch(path: string, data: any, headers = {}) {
  const authToken = localStorage.getItem("authToken");
  let config;
  if (authToken) {
    config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        ...headers,
      },
    };
  } else {
    config = {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
  }

  return axios.patch(path, data, config);
}
/**
 *
 * @param {*} path api endpoint
 * @param {*} data body object for put request
 * @returns
 */

export function apiPut(path: string, data: any) {
  const authToken = localStorage.getItem("authToken");
  let config;
  if (authToken) {
    config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
  } else {
    config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return axios.put(path, data, config);
}
/**
 *
 * @param {*} path api endpoint
 * @param {*} data data for params
 * @returns
 */
export function apiDelete(path: string, data: any) {
  const authToken = localStorage.getItem("authToken");
  let config;
  if (authToken) {
    config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
  } else {
    config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return axios.delete(path, { ...config, ...data });
}

const instance = axios.create();

export default instance;
