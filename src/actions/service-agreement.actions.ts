import axios, { CancelTokenSource } from "axios";
import TLservice from "../core/service-interceptor";
import { IEmailLetters } from "../models/interfaces/email-letters";

import { APIConstants } from "../shared/constants";
import { CommonUtils } from "../utils/common-utils";

export const getAllServiceAgreementTemplateList = (
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.getAllServiceTemplates, { cancelToken: source.token })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const getAllServiceAgreementList = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.getAllServiceAgreements, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const createServiceAgreement = (payload: any) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.createServiceAgreement, payload)
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
export const viewServiceAgreement = (id: any) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await TLservice.get(
        `${APIConstants.createServiceAgreement}/${id}?tenant=CreditRepairDemo`
      )
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
export const signServiceAgreement = (payload: any) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await TLservice.put(
        `${APIConstants.createServiceAgreement}/updateesignature?tenant=CreditRepairDemo`,
        payload
      )
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
export const serviceTemplateGenerateHTMLPreview = (
  payload: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.serviceTemplateGenerateHTMLPreview, payload, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const getEmailTemplatesDetails = (
  letterId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(CommonUtils.formatString(APIConstants.emailTemplate, letterId), {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const GetServiceAgreementSavedSampleTemplates = (
  letteridType: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.getServiceAgreementSampleTemplates,
            letteridType
          ),
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const updateOfcServiceTemplate = (
  payload: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.updateOfcServiceTemplate, payload, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const getServiceTemplatesDetails = (
  letterId: string,
  source: CancelTokenSource
) => {
  // debugger;
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.getserviceAgreementTemplate,
            letterId
          ),
          {
            cancelToken: source.token,
          }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const deleteEmailTemplate = (
  letterId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(
          CommonUtils.formatString(APIConstants.emailTemplate, letterId),
          {
            cancelToken: source.token,
          }
        )
        .then((result: any) => {
          resolve(result.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const updateEmailTemplatesDetails = (
  letter: IEmailLetters,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(APIConstants.emailTemplateUpdate, letter, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const updateServiceTemplatesDetails = (
  letter: IEmailLetters,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(APIConstants.serviceTemplateUpdate, letter, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const createEmailTemplates = (
  letter: IEmailLetters,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.emailTemplateUpdate, letter, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const createServiceTemplates = (
  letter: IEmailLetters,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.serviceTemplateUpdate, letter, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const getCustomerTokens = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.emailTemplateCustomerTokens, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const emailTemplateFieldTokens = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.emailTemplateFieldTokens, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const serviceTemplateFieldTokens = (source: CancelTokenSource) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(APIConstants.serviceTemplateFieldTokens, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const emailTemplateGenerateHTMLPreview = (
  payload: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.emailTemplateGenerateHTMLPreview, payload, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const getEmailTemplatesByOfficeId = (
  officeId: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.getEmailTemplatesByOfficeId,
            officeId
          ),
          { cancelToken: source.token }
        )
        .then((result: any) => {
          let data = (result?.data || []).map(
            (x: any) =>
              ({
                id: x?.emailTemplateId,
                name: x?.emailTemplateName,
                template: x?.Template,
                isActive: x?.active,
                letterType: x?.templateType,
                dateEntered: x?.dateEntered,
                officeId: x?.franchiseOfficeId,
                bcc: x?.bcc,
                cc: x?.cc,
                sender: x?.sender,
              } as IEmailLetters)
          );
          resolve(data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const setEmailTemplateActive = (
  officeId: string,
  letterid: any,
  active: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          CommonUtils.formatString(
            APIConstants.setEmailTemplateActive,
            officeId,
            letterid,
            active
          ),
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const getEmailTemplatesById = (
  letterid: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.getEmailTemplatesById,
            letterid
          ),
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
export const getServiceTemplatesById = (
  letterid: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.getEmailTemplatesById,
            letterid
          ),
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const GetSavedSampleTemplates = (
  letteridType: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.getSavedSampleTemplates,
            letteridType
          ),
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const getOfficeLeadFormOptions = (
  ofcid: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.getOfficeLeadFormOptions,
            ofcid
          ),
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const updateOfficeLeadFormOptions = (
  ofcid: string,
  payload: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(
          CommonUtils.formatString(
            APIConstants.updateOfficeLeadFormOptions,
            ofcid
          ),
          payload,
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const createOfficeLeadFormOptions = (
  ofcid: string,
  payload: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(
            APIConstants.createOfficeLeadFormOptions,
            ofcid
          ),
          payload,
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const getAllSubFieldsForSection = (
  section: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.getAllSubFieldsForSection,
            section
          ),
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const getFinalCollectionToken = (
  payload: any,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(APIConstants.getFinalCollectionToken, payload, {
          cancelToken: source.token,
        })
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const getemailTemplateOptions = (
  templateId: string,
  type: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          CommonUtils.formatString(
            APIConstants.emailTemplateOptions,
            templateId,
            type
          ),
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const saveEmailTemplateOptions = (
  payload: string,
  templateId: string,
  type: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(
          CommonUtils.formatString(
            APIConstants.emailTemplateOptions,
            templateId,
            type
          ),
          payload,
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};

export const deleteEmailTemplateOptions = (
  id: string,
  source: CancelTokenSource
) => {
  return (dispatch: any) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(
          CommonUtils.formatString(APIConstants.removeEmailTemplateOptions, id),
          { cancelToken: source.token }
        )
        .then((result: any) => {
          resolve(result?.data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
};
