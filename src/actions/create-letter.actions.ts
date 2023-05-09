import axios, { CancelTokenSource } from "axios";

import { LetterSearchTypes } from "../models/enums";
import {
  ICreateCredCCBCCTempLetterRequest,
  ICreateLetterSource,
  ICreatePDFLetterPayload,
  ICreateSingleTempLetterRequest,
  ICreateTempLetterRequest,
  IRestartRoundPayload,
  ISelectedAccounts,
  ISendNoticePayload,
  ISetRoundsPayload,
  ITempLetterQueue,
} from "../models/interfaces/create-letter";
import { IFastEditAccount } from "../models/interfaces/fast-edit-accounts";
import { IDropdown } from "../models/interfaces/shared";
import { APIConstants } from "../shared/constants";
import { CommonUtils } from "../utils/common-utils";
import { getAction } from "./action";

import { CreateLetterActionTypes } from "./create-letter.action-types";

export const saveLetterSource = (letterSource: ICreateLetterSource) => {
  return (dispatch: any) => {
    dispatch(
      getAction(CreateLetterActionTypes.SET_LETTER_SOURCE, letterSource)
    );
  };
};
export const saveSelectedAccounts = (accounts: ISelectedAccounts) => {
  return (dispatch: any) => {
    dispatch(
      getAction(CreateLetterActionTypes.SET_SELECTED_ACCOUNTS, accounts)
    );
  };
};
export const saveAccounts = (accounts: IFastEditAccount[]) => {
  return (dispatch: any) => {
    dispatch(getAction(CreateLetterActionTypes.SET_LETTER_ACCOUNTS, accounts));
  };
};
export const saveSearchedLetter = (
  value: IDropdown,
  bureau: LetterSearchTypes
) => {
  return (dispatch: any) => {
    dispatch(
      getAction(CreateLetterActionTypes.SET_LETTER_TEMPLATE, { value, bureau })
    );
  };
};
export const saveAdvanceOption = (advanced: boolean) => {
  return (dispatch: any) => {
    dispatch(getAction(CreateLetterActionTypes.SET_LETTER_ADVANCED, advanced));
  };
};
export const saveActiveTabNumber = (tabNumber: number) => {
  return (dispatch: any) => {
    dispatch(
      getAction(CreateLetterActionTypes.SET_LETTER_ACTIVETAB, tabNumber)
    );
  };
};

export const getPDFDisputeLetters = (
  cid: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(CommonUtils.formatString(APIConstants.getPDFDisputeLetters, cid), {
          cancelToken: source.token,
        })
        .then((result: any) => result?.data)
        .then((result: any[]) => {
          if (result) {
            resolve(result);
          } else {
            reject(null);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const getServiceAgreementLetters = (
  cid: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(`${APIConstants.createServiceAgreement}/getbyuser?userid=${cid}`, {
          cancelToken: source.token,
        })
        .then((result: any) => result?.data)
        .then((result: any[]) => {
          if (result) {
            console.log("from-api=>>", result);
            resolve(result);
          } else {
            reject(null);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const getTempLetterQueue = async (
  cid: string,
  source: CancelTokenSource
) => {
  return await axios
    .get(CommonUtils.formatString(APIConstants.getTempLetterQueue, cid), {
      cancelToken: source.token,
    })
    .then((result: any) => result?.data);
};

export const letterSearch = async (
  searchType: LetterSearchTypes,
  text: string,
  source: CancelTokenSource
) => {
  return await axios
    .get(
      CommonUtils.formatString(APIConstants.letterSearch, searchType, text),
      { cancelToken: source.token }
    )
    .then((result: any) => result?.data);
};

export const createCRALetter = (
  payload: ICreateSingleTempLetterRequest,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.createCRALetter, payload, {
          cancelToken: source.token,
        })
        .then((result: any) => result?.data)
        .then((result: any[]) => {
          if (result) {
            resolve(result);
          } else {
            reject(null);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const createCredBCCLetter = (
  payload: ICreateCredCCBCCTempLetterRequest,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.createCredBCCLetter, payload, {
          cancelToken: source.token,
        })
        .then((result: any) => result?.data)
        .then((result: any[]) => {
          if (result) {
            resolve(result);
          } else {
            reject(null);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const createBureauLetter = (
  payload: ICreateTempLetterRequest,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.createBureauLetter, payload, {
          cancelToken: source.token,
        })
        .then((result: any) => result?.data)
        .then((result: any[]) => {
          if (result) {
            resolve(result);
          } else {
            reject(null);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const removeTempLetters = async (
  fileIds?: string,
  source?: CancelTokenSource
) => {
  return await axios
    .delete(APIConstants.deleteTempLetter, {
      cancelToken: source?.token,
      data: { ids: fileIds },
    })
    .then((result: any) => result?.data);
};

export const saveTempLetter = async (
  payload: any,
  source?: CancelTokenSource
) => {
  return await axios
    .post(APIConstants.saveTempLetter, payload, {
      cancelToken: source?.token,
    })
    .then((result: any) => result?.data);
};

export const reloadTempLetter = (reload: boolean) => {
  return (dispatch: any) => {
    dispatch(getAction(CreateLetterActionTypes.SET_TEMP_LETTER_RELOAD, reload));
  };
};
export const reloadDisputeLetters = (reload: boolean) => {
  return (dispatch: any) => {
    dispatch(
      getAction(CreateLetterActionTypes.SET_DISPUTE_LETTERS_RELOAD, reload)
    );
  };
};
export const lettersCreatedSuccessfully = (created: boolean) => {
  return (dispatch: any) => {
    dispatch(getAction(CreateLetterActionTypes.SET_LETTERS_CREATED, created));
  };
};

export const updateRoundInfo = (info: any) => {
  return (dispatch: any) => {
    dispatch(getAction(CreateLetterActionTypes.SET_CUSTOMER_ROUND_INFO, info));
  };
};
export const getCCList = async (cid: string, source: CancelTokenSource) => {
  return await axios
    .get(CommonUtils.formatString(APIConstants.ccList, cid), {
      cancelToken: source.token,
    })
    .then((result: any) => result?.data);
};
export const setTempLettersList = (letters: ITempLetterQueue[]) => {
  return (dispatch: any) => {
    dispatch(getAction(CreateLetterActionTypes.SET_TEMP_LETTERS, letters));
  };
};
export const createPDFLetter = async (
  payload: ICreatePDFLetterPayload[],
  source: CancelTokenSource
) => {
  return await axios
    .post(APIConstants.createPDFLetter, payload, { cancelToken: source.token })
    .then((result: any) => result?.data);
};
export const restartRound = async (
  payload: IRestartRoundPayload,
  source: CancelTokenSource
) => {
  return await axios
    .post(APIConstants.restartRound, payload, { cancelToken: source.token })
    .then((result: any) => result?.data);
};
export const setRounds = async (
  payload: ISetRoundsPayload,
  source: CancelTokenSource
) => {
  return await axios
    .put(APIConstants.setRounds, payload, { cancelToken: source.token })
    .then((result: any) => result?.data);
};
export const sendNoticeAccUpdate = async (
  payload: ISendNoticePayload,
  source: CancelTokenSource
) => {
  return await axios
    .put(APIConstants.sendNoticeAccUpdate, payload, {
      cancelToken: source.token,
    })
    .then((result: any) => result?.data);
};
export const regernateNoticeAccountUpdate = async (
  cid: string,
  tempLetters: any[],
  source: CancelTokenSource
) => {
  return await axios
    .post(
      CommonUtils.formatString(APIConstants.regenerateNoticeAccountUpdate, cid),
      { tempLetters },
      { cancelToken: source.token }
    )
    .then((result: any) => result?.data);
};
