import axios, { CancelTokenSource } from "axios";
// @ts-ignore
import FileDownload from "js-file-download";

import { CommonUtils } from "../utils/common-utils";
import {
  ICustomerFilter,
  IScoringRound,
  IUpdateCustomerModel,
} from "../models/interfaces/customer-view";
import { getAction } from "./action";
import { CustomerActionTypes } from "./customers.action-types";
import { APIConstants } from "../shared/constants";
import { ToDoTargetTypes } from "../models/enums";

const path = require("path");

export const getCustomers = (
  filter: ICustomerFilter,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.getCustomers, filter, { cancelToken: source.token })
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

export const getCustomer = (
  cidOrText: string,
  source: CancelTokenSource,
  includeLeads?: boolean
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(APIConstants.getCustomer, cidOrText) +
            (includeLeads !== undefined ? "/" + includeLeads?.toString() : ""),
          { cancelToken: source.token }
        )
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
export const getCustomerMinimal = (
  cid: string,
  giveAccountsCount: boolean,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.getCustomerMinimaldetails,
            cid
          ) +
            "/" +
            giveAccountsCount,
          { cancelToken: source.token }
        )
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
export const UpdateCustomerdetails = (
  data: IUpdateCustomerModel,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(APIConstants.getCustomers, data, { cancelToken: source.token })
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
export const getFranchiseAgents = async (source: CancelTokenSource) => {
  return await axios
    .get(APIConstants.getFranchiseAgents, { cancelToken: source.token })
    .then((result: any) => result?.data);
};

export const getReferralAgents = async (source: CancelTokenSource) => {
  return await axios
    .get(APIConstants.getReferralAgents, { cancelToken: source.token })
    .then((result: any) => result?.data);
};

export const getScoringRoundStatuses = async (source: CancelTokenSource) => {
  return await axios
    .get(APIConstants.getScoringRoundStatuses, { cancelToken: source.token })
    .then((result: any) => result?.data);
};

export const loadStatuses = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      getScoringRoundStatuses(source)
        .then((result: any[]) => {
          dispatch(getAction(CustomerActionTypes.SET_STATUSES, result));
          resolve(result);
        })
        .catch((err: any) => {
          dispatch(getAction(CustomerActionTypes.SET_STATUSES, []));
          reject(err);
        });
    });
  };
};

export const checkAPIActive = (apiName: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(CommonUtils.formatString(APIConstants.checkAPIActive, apiName), {
          cancelToken: source.token,
        })
        .then((result: any) => result?.data)
        .then((result: any) => {
          dispatch(getAction(CustomerActionTypes.SET_API_ACTIVE, true));
          resolve(result);
        })
        .catch((err: any) => {
          dispatch(getAction(CustomerActionTypes.SET_API_ACTIVE, false));
          reject(err);
        });
    });
  };
};

export const setAPIActive = (
  apiname: string,
  activate: boolean,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(APIConstants.setAPIActive) +
            "/" +
            apiname +
            "/" +
            activate,
          null,
          { cancelToken: source.token }
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

export const updateAPIKey = (
  apiname: string,
  key: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(APIConstants.updateAPIKey) +
            "/" +
            apiname +
            "/" +
            key,
          null,
          { cancelToken: source.token }
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
export const getStates = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.getStates, { cancelToken: source.token })
        .then((result: any) => result?.data)
        .then((result: any) => {
          dispatch(getAction(CustomerActionTypes.SET_STATES, result));
          resolve(result);
        })
        .catch((err: any) => {
          dispatch(getAction(CustomerActionTypes.SET_STATES, null));
          reject(err);
        });
    });
  };
};

export const checkPartnerKey = (
  officeId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(CommonUtils.formatString(APIConstants.checkPartnerkey, officeId), {
          cancelToken: source.token,
        })
        .then((result: any) => result?.data)
        .then((result: any) => {
          dispatch(getAction(CustomerActionTypes.SET_PARTNER_KEY, result));
          resolve(result);
        })
        .catch((err: any) => {
          dispatch(getAction(CustomerActionTypes.SET_PARTNER_KEY, null));
          reject(err);
        });
    });
  };
};

export const getAPIIntegrations = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.getAPIIntegrations, { cancelToken: source.token })
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
export const getS3Files = async (
  customerId: string,
  size: number,
  folderName: string,
  source: CancelTokenSource,
  isLead?: boolean
) => {
  return await axios
    .post(
      APIConstants.checkS3Files,
      { customerId, size, folderName, isLead },
      { cancelToken: source.token }
    )
    .then((result: any) => result?.data);
};
export const getS3SingleFile = async (
  customerId: string,
  folderName: string,
  source: CancelTokenSource
) => {
  return await axios
    .post(
      APIConstants.getS3SingleFile,
      { customerId, folderName },
      { cancelToken: source.token }
    )
    .then((result: any) => result?.data);
};
export const checkS3Files = (
  customerId: string,
  size: number,
  folderName: string,
  source: CancelTokenSource,
  isLead?: boolean
) => {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      getS3Files(customerId, size, folderName, source, isLead)
        .then((result: any) => {
          dispatch(getAction(CustomerActionTypes.SET_S3_FILES, result));
          resolve(result);
        })
        .catch((err: any) => {
          dispatch(getAction(CustomerActionTypes.SET_S3_FILES, null));
          reject(err);
        });
    });
  };
};

export const checkSubscriberListsByEmail = async (
  email: string,
  source: CancelTokenSource
) => {
  return await axios
    .post(
      APIConstants.checkSubscriberListsByEmail,
      { email },
      { cancelToken: source.token }
    )
    .then((result: any) => result?.data)
    .catch((e) => {
      throw e;
    });
};

export const getMailchimpLists = async (source: CancelTokenSource) => {
  return await axios
    .post(APIConstants.getMailchimpLists, {}, { cancelToken: source.token })
    .then((result: any) => result?.data)
    .catch((e) => {
      throw e;
    });
};

export const checkSubscriberCampaignsByEmail = async (
  email: string,
  source: CancelTokenSource
) => {
  return await axios
    .post(
      APIConstants.checkSubscriberCampaignsByEmail,
      { email },
      { cancelToken: source.token }
    )
    .then((result: any) => result?.data)
    .catch((e) => {
      throw e;
    });
};

export const setMailchimpList = (
  ids: string[],
  email: string,
  fname: string,
  lname: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          APIConstants.setMailchimpList,
          { ids, email, fname, lname },
          { cancelToken: source.token }
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

export const saveFeeDetails = (
  CustomerId: string,
  SetupFee: string,
  MonthlyFee: string,
  MonthlyDueDate: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          APIConstants.saveFeeDetails,
          { CustomerId, SetupFee, MonthlyFee, MonthlyDueDate },
          { cancelToken: source.token }
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

export const saveCreditMonitoringDetails = (
  CustomerId: string,
  CreditMonitoringService: string,
  CreditMonitoringUserName: string,
  CreditMonitoringPassword: string,
  CreditMonitoringSecretWord: string,
  ReportPullDate: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          APIConstants.saveCreditMonitoring,
          {
            CustomerId,
            CreditMonitoringService,
            CreditMonitoringUserName,
            CreditMonitoringPassword,
            CreditMonitoringSecretWord,
            ReportPullDate,
          },
          { cancelToken: source.token }
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

export const saveGeneralNotes = (
  cid: string,
  Note: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          APIConstants.saveGeneralNotes,
          { cid, Note },
          { cancelToken: source.token }
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

export const updateUserName = (
  customerId: string,
  oldUsername: string,
  newUsername: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          APIConstants.updateUserName,
          { customerId, oldUsername, newUsername },
          { cancelToken: source.token }
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

export const updatePassword = (
  userId: string,
  oldPassword: string,
  newPassword: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          APIConstants.updatePassword,
          { userId, oldPassword, newPassword },
          { cancelToken: source.token }
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

export const resedWelcomeEmail = (cid: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(APIConstants.resendWelcomeEmail, cid),
          null,
          { cancelToken: source.token }
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

export const submitToProcessing = (cid: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(APIConstants.submitToProcessing, cid),
          null,
          { cancelToken: source.token }
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
export const PORNeededEmail = (cid: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(CommonUtils.formatString(APIConstants.sendPORneeded, cid), null, {
          cancelToken: source.token,
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

export const removeSpouse = (
  customerId: string,
  spouseId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          CommonUtils.formatString(
            APIConstants.removeSpouse,
            customerId,
            spouseId
          ),
          null,
          { cancelToken: source.token }
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

export const getAdminSettings = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.adminsettings, { cancelToken: source.token })
        .then((result: any) => result?.data)
        .then((result: any[]) => {
          dispatch(getAction(CustomerActionTypes.SET_ADMIN_SETTINGS, result));
          resolve(result);
        })
        .catch((err: any) => {
          dispatch(getAction(CustomerActionTypes.SET_ADMIN_SETTINGS, null));
          reject(err);
        });
    });
  };
};

export const getCustomerFranchAgents = async (source: CancelTokenSource) => {
  return await axios
    .get(APIConstants.customerFranchAgents, { cancelToken: source.token })
    .then((result: any) => result?.data);
};

export const getCustomerReferrAgents = async (source: CancelTokenSource) => {
  return await axios
    .get(APIConstants.customerReferAgents, { cancelToken: source.token })
    .then((result: any) => result?.data);
};
export const updateRound = (
  payload: IScoringRound,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(APIConstants.updateRound, payload, { cancelToken: source.token })
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

export const deleteRound = (id: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(CommonUtils.formatString(APIConstants.deleteRound, id), {
          cancelToken: source.token,
        })
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

export const submitRounds = (payload: any, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.submitRounds, payload, { cancelToken: source.token })
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

export const startRound = (payload: any, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(APIConstants.submitQuery, payload),
          null,
          { cancelToken: source.token }
        )
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

export const disputeProgress = (cid: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      dispatch(getAction(CustomerActionTypes.SET_DISPUTE_STATS_LOADING, true));
      await axios
        .get(CommonUtils.formatString(APIConstants.disputeProgress, cid), {
          cancelToken: source.token,
        })
        .then((result: any) => result?.data)
        .then((result: any[]) => {
          dispatch(getAction(CustomerActionTypes.SET_DISPUTE_STATS, result));
          dispatch(
            getAction(CustomerActionTypes.SET_DISPUTE_STATS_LOADING, false)
          );
          resolve(result);
        })
        .catch((err: any) => {
          dispatch(getAction(CustomerActionTypes.SET_DISPUTE_STATS, []));
          dispatch(
            getAction(CustomerActionTypes.SET_DISPUTE_STATS_LOADING, false)
          );
          reject(err);
        });
    });
  };
};

export const updateCustomerAgent = (
  customerId: string,
  franchiseAgent: string,
  referralAgent: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          APIConstants.updateCustomerAgent,
          { customerId, franchiseAgent, referralAgent },
          { cancelToken: source.token }
        )
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

export const addClientNote = (payload: any, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.saveClientNote, payload, {
          cancelToken: source.token,
        })
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

export const updateClientNote = (
  customerId: string,
  textContent: string,
  notesId: string,
  whoLeft: string,
  notesDate: string,
  source: CancelTokenSource,
  isLead: boolean
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          APIConstants.saveClientNote,
          { customerId, textContent, notesId, whoLeft, notesDate, isLead },
          { cancelToken: source.token }
        )
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

export const deleteClientNote = (
  notesId: string,
  source: CancelTokenSource,
  isLead = false
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(APIConstants.saveClientNote + "/" + notesId + "/" + isLead, {
          cancelToken: source.token,
        })
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

export const deleteInternalNote = (
  notesId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(APIConstants.processingNote + "/" + notesId, {
          cancelToken: source.token,
        })
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

export const addInternalNote = (
  customerId: string,
  noteContent: string,
  userIdForNotes: string,
  isSendMail: boolean,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          APIConstants.processingNote,
          { customerId, noteContent, userIdForNotes, isSendMail },
          { cancelToken: source.token }
        )
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

export const getCannedNotes = (noteType: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(CommonUtils.formatString(APIConstants.getCannedNotes, noteType), {
          cancelToken: source.token,
        })
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

export const deleteCannedNotes = (
  noteId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(CommonUtils.formatString(APIConstants.getCannedNotes, noteId), {
          cancelToken: source.token,
        })
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

export const createCannedNotes = (
  content: string,
  noteType: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(
            APIConstants.createCannedNote,
            content,
            noteType
          ),
          null,
          { cancelToken: source.token }
        )
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

export const removeAccounts = async (
  collectionAccountId: string,
  source: CancelTokenSource
) => {
  return await axios
    .delete(APIConstants.collectionAccount, {
      cancelToken: source.token,
      data: { ids: collectionAccountId },
    })
    .then((result: any) => result?.data);
};

export const removeAccount = async (
  accountId: string,
  cid: string,
  source: CancelTokenSource
) => {
  return await axios
    .delete(CommonUtils.formatString(APIConstants.account, accountId, cid), {
      cancelToken: source.token,
    })
    .then((result: any) => result?.data);
};

export const removeFiles = async (
  fileIds: string,
  source: CancelTokenSource,
  isLead: boolean = false,
  cid = ""
) => {
  return await axios
    .delete(APIConstants.file, {
      cancelToken: source.token,
      data: { ids: fileIds, isLead, cid },
    })
    .then((result: any) => result?.data);
};

export const updateFile = async (
  fileId: string,
  fileType: string,
  source: CancelTokenSource,
  isLead: boolean = false
) => {
  return await axios
    .put(
      CommonUtils.formatString(
        APIConstants.updateFile,
        fileId,
        fileType,
        isLead?.toString()
      ),
      {
        cancelToken: source.token,
      }
    )
    .then((result: any) => result?.data);
};
export const uploadFile = (
  customerId: string,
  name: string,
  type: string,
  overwriteExistingFiles: boolean,
  formData: FormData,
  description: string,
  fileName: string,
  operation: string,
  source: CancelTokenSource
) => {
  return axios
    .post(APIConstants.file, formData, {
      cancelToken: source.token,
      headers: {
        customerId,
        name,
        type,
        description,
        overwriteExistingFiles,
        fileName,
        operation,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((result: any) => result?.data);
};
export const downloadFileOrLetter = async (
  fullPath: string,
  source: CancelTokenSource
) => {
  return await axios({
    url: CommonUtils.formatString(APIConstants.downloadFileLetter, fullPath),
    method: "GET",
    responseType: "blob", // Important
    cancelToken: source.token,
  }).then((response) => {
    const fileName = path.basename(fullPath);
    FileDownload(response.data, fileName);
  });
};

export const removeLetters = async (
  fileIds?: string,
  source?: CancelTokenSource
) => {
  return await axios
    .delete(APIConstants.disputeletter, {
      cancelToken: source?.token,
      data: { ids: fileIds },
    })
    .then((result: any) => result?.data);
};
export const removeServiceAgreements = async (
  fileIds?: string,
  source?: CancelTokenSource
) => {
  return await axios
    .delete(`${APIConstants.createServiceAgreement}/${fileIds}`)
    .then((result: any) => result?.data);
};

export const getTodos = (
  cid: string,
  targetType: ToDoTargetTypes,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(CommonUtils.formatString(APIConstants.toDos, cid, targetType), {
          cancelToken: source.token,
        })
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

export const addTodo = (
  toDoText: string,
  dueDate: string,
  cid: string,
  targetType: ToDoTargetTypes,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(APIConstants.toDos, cid, targetType),
          { toDoText, dueDate },
          { cancelToken: source.token }
        )
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

export const updateTodo = (todoId: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(CommonUtils.formatString(APIConstants.toDoUpdate, todoId), null, {
          cancelToken: source.token,
        })
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
export const deleteTodo = (todoId: string, source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(CommonUtils.formatString(APIConstants.toDoUpdate, todoId), {
          cancelToken: source.token,
        })
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

export const deleteCustomer = (
  customerId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(
          CommonUtils.formatString(APIConstants.getCustomer, customerId),
          { cancelToken: source.token }
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

export const getCustomerReferralAgentsList = (
  cid: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(APIConstants.customerReferralAgents, cid),
          { cancelToken: source.token }
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

export const addCustomerReferralAgents = (
  cid: string,
  agentId: string,
  roleName: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(
            APIConstants.addUpdateCustomerReferralAgents,
            cid,
            agentId,
            roleName
          ),
          null,
          { cancelToken: source.token }
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

export const updateCustomerReferralAgents = (
  cid: string,
  agentId: string,
  roleName: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          CommonUtils.formatString(
            APIConstants.addUpdateCustomerReferralAgents,
            cid,
            agentId,
            roleName
          ),
          null,
          { cancelToken: source.token }
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

export const deleteCustomerReferralAgents = (
  cid: string,
  agentId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(
          CommonUtils.formatString(
            APIConstants.deleteCustomerReferralAgents,
            cid,
            agentId
          ),
          { cancelToken: source.token }
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
export const addNewRound = (
  payload: string,
  cid: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(APIConstants.addNewRound, cid),
          payload,
          { cancelToken: source.token }
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

export const subscribeToArrayCustomer = (
  customerId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          CommonUtils.formatString(
            APIConstants.submitToArrayReport,
            customerId
          ) + "/true",
          { cancelToken: source.token }
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

export const getSubscribeToArrayCustomer = (
  customerId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.submitToArrayReport,
            customerId
          ),
          { cancelToken: source.token }
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

export const subscribeToCMCustomer = (
  customerId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          CommonUtils.formatString(
            APIConstants.creditmonitoringsubscription,
            customerId
          ) + "/true",
          { cancelToken: source.token }
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

export const getSubscribeToCMCustomer = (
  customerId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.creditmonitoringsubscription,
            customerId
          ),
          { cancelToken: source.token }
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
