import axios, { CancelTokenSource } from "axios";

import { APIConstants } from "../constants";
import { getAction } from "../../actions/action";
import { SharedActionTypes } from "./action-types";
import AuthService from "../../core/services/auth.service";
import { IScreenProps } from "../../models/interfaces/shared";
import { IToDo } from "../../models/interfaces/customer-view";
import { CommonUtils } from "../../utils/common-utils";

export const getAuthRules = (source: CancelTokenSource) => {
  console.log("cancel_token_source", source);
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.getAuthRules, { cancelToken: source.token })
        .then((result: any) => result?.data)
        .then((result: IScreenProps[]) => {
          const screens = AuthService.getAllAccessibleScreens(result);
          console.log("from get auth", screens);
          dispatch(getAction(SharedActionTypes.SET_AUTH_RULES, result));
          dispatch(
            getAction(SharedActionTypes.SET_ACCESSIBLE_SCREENS, screens)
          );
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
          dispatch(getAction(SharedActionTypes.SET_AUTH_RULES, null));
        });
    });
  };
};

export const getALLAuthRules = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.allAuthRules, { cancelToken: source.token })
        .then((result: any) => result?.data)
        .then((result: IScreenProps[]) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const setCurrentAccessibleScreens = (payload: any) => {
  return (dispatch: any) => {
    dispatch(getAction(SharedActionTypes.SET_ACCESSIBLE_SCREENS, payload));
  };
};
export const setInnerSpinner = (loading: boolean, message?: string) => {
  return (dispatch: any) => {
    dispatch(
      getAction(SharedActionTypes.SHOW_INNER_SPINNER, { loading, message })
    );
  };
};
export const getStates = async (source: CancelTokenSource) => {
  return await axios
    .get(APIConstants.getStates, { cancelToken: source.token })
    .then((result: any) => result?.data);
};
export const saveAuthRules = (payload: any, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.allAuthRules, payload, { cancelToken: source.token })
        .then((result: any) => result?.data)
        .then((result: any) => {
          resolve(true);
        })
        .catch((err: any) => {
          reject(false);
        });
    });
  };
};

export const getAllBureaus = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.getAllBureaus, { cancelToken: source.token })
        .then((result: any) => result?.data)
        .then((result: any[]) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const getAllLetterTypes = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.getAllLetterTypes, { cancelToken: source.token })
        .then((result: any) => result?.data)
        .then((result: any[]) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const addTodosShared = (todos: IToDo[]) => {
  return (dispatch: any) => {
    dispatch(getAction(SharedActionTypes.USER_TODOS, todos));
  };
};
export const toggleToDoShared = () => {
  return (dispatch: any) => {
    dispatch(getAction(SharedActionTypes.TOGGLE_TODOS));
  };
};
export const leftMenuOpened = (opened: boolean) => {
  return (dispatch: any) => {
    dispatch(getAction(SharedActionTypes.LEFT_MENU_OPEN, opened));
  };
};
export const deleteScreen = (name: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(CommonUtils.formatString(APIConstants.useraccessDelete, name), {
          cancelToken: source.token,
        })
        .then((result: any) => result?.data)
        .then((result: IScreenProps[]) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const updateScreen = (
  name: string,
  oldName: string,
  description: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          APIConstants.useraccessUpdate,
          { oldName, name, description },
          {
            cancelToken: source.token,
          }
        )
        .then((result: any) => result?.data)
        .then((result: IScreenProps[]) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const deleteField = (id: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(
          CommonUtils.formatString(APIConstants.useraccessFieldDelete, id),
          {
            cancelToken: source.token,
          }
        )
        .then((result: any) => result?.data)
        .then((result: IScreenProps[]) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const updateField = (
  id: string,
  name: string,
  description: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          APIConstants.useraccessFieldUpdate,
          { id, name, description },
          {
            cancelToken: source.token,
          }
        )
        .then((result: any) => result?.data)
        .then((result: IScreenProps[]) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const passwordNotStrong = (flag: boolean) => {
  return (dispatch: any) => {
    dispatch(getAction(SharedActionTypes.PASSWORD_NOT_STRONG, flag));
  };
};
