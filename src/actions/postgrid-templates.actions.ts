import axios, { CancelTokenSource } from "axios";
import { APIConstants } from "../shared/constants";
import { getAction } from "./action";
import { getAllPostGridLetterTemplates } from "./email-templates.actions";
import { PostgridActionTypes } from "./postgrid.action-types";
export const BASE_URL = `https://api.postgrid.com/print-mail`;

export const createPostGridLetter = (
  payload: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(BASE_URL + APIConstants.PostGridLetter, payload)
        .then((result: any) => {
          console.log("from-resulttt", result.data);
          resolve(result?.data);
          return result?.data;
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const getPostGridLetter = (id: any) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(BASE_URL + APIConstants.PostGridLetter + "/" + id)
        .then((result: any) => {
          console.log("from-resulttt", result.data);
          resolve(result?.data);
          return result?.data;
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const cancelPostGridLetter = (id: any) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(BASE_URL + APIConstants.PostGridLetter + "/" + id)
        .then((result: any) => {
          resolve(result?.data);
          return result?.data;
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const getAllPostGridTemplates = (
  skip: number = 0,
  limit: number = 10,
  search: string = "",
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          BASE_URL +
            APIConstants.PostGridTemplates +
            `?skip=${skip}&limit=${limit}&search=${search}`
        )
        .then((result: any) => {
          console.log("from-resulttt", result.data);
          const respList = result?.data?.data;
          const modifiedListArr =
            Array.isArray(respList) &&
            respList.map((item: any) => {
              return {
                value: item?.id,
                label: item?.description,
              };
            });
          dispatch(
            getAction(PostgridActionTypes.SET_TEMPLATE_LIST, modifiedListArr)
          );
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const getAllPostGridContacts = (
  skip: number = 0,
  limit: number = 10,
  search: string = "",
  source: CancelTokenSource
) => {
  console.log("contact props", skip, limit, search);
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          BASE_URL +
            APIConstants.PostGridContacts +
            `?skip=${skip}&limit=${limit}&search=${search}`
          // {
          //   cancelToken: source?.token,
          // }
        )
        .then((result: any) => {
          const respList = result?.data?.data;
          const modifiedListArr =
            Array.isArray(respList) &&
            respList.map((item: any) => {
              return {
                value: item,
                label: item?.firstName + " " + item?.lastName,
              };
            });
          dispatch(
            getAction(PostgridActionTypes.SET_CONTACT_LIST, modifiedListArr)
          );
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
