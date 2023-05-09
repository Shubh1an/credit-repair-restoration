import React, { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import toastr from "toastr";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { asyncComponent } from "../../../../shared/components/async-component";
import { Messages } from "../../../../shared/constants";
import {
  IEmailLetters,
  ServiceTempLetters,
} from "../../../../models/interfaces/email-letters";
import {
  getServiceTemplatesDetails,
  updateServiceTemplatesDetails,
  createServiceTemplates,
  getCustomerTokens,
  serviceTemplateFieldTokens,
} from "../../../../actions/service-agreement.actions";
import {
  getAllBureaus,
  getAllLetterTypes,
} from "../../../../shared/actions/shared.actions";
import { IDataItem } from "../../../../models/interfaces/fast-edit-accounts";
import { ILetterType } from "../../../../models/interfaces/create-letter";
import { CommonUtils } from "../../../../utils/common-utils";
import { INameValueSmall } from "../../../../models/interfaces/shared";

const AsyncHTMLEditor = asyncComponent(
  () => import("../../../../shared/components/service-html-editor")
);

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getServiceTemplatesDetails,
      updateServiceTemplatesDetails,
      getAllBureaus,
      getAllLetterTypes,
      createServiceTemplates,
      getCustomerTokens,
      serviceTemplateFieldTokens,
    },
    dispatch
  );
};
export const ServiceTemplateEditor = connect(
  null,
  mapDispatchToProps
)(
  (props: {
    onSave: any;
    letterId?: string;
    getServiceTemplatesDetails: any;
    updateServiceTemplatesDetails: any;
    getAllBureaus: any;
    getAllLetterTypes: any;
    createServiceTemplates: any;
    getCustomerTokens: any;
    serviceTemplateFieldTokens: any;
    letterObject?: ServiceTempLetters | null;
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [letter, setLetter] = useState(null as ServiceTempLetters | null);
    const [bureaus, setBureaus] = useState([] as IDataItem[]);
    const [fieldsTokens, setFieldsTokens] = useState([] as INameValueSmall[]);
    const [letterTypes, setLetterTypes] = useState([] as ILetterType[]);
    const [html, setHtml] = useState<any>("");

    const [axiosSource] = useState(
      axios.CancelToken.source() as CancelTokenSource
    );

    useEffect(() => {
      // debugger;
      if (props?.letterId) {
        getDetails(props?.letterId);
      } else {
        setLetter(props?.letterObject || {});
        setHtml(props?.letterObject?.template || "");
      }
      getBureaus();
      getLetterTypes();
      getFieldsTokens();

      return () => {
        if (axiosSource.cancel) {
          axiosSource.cancel(Messages.APIAborted);
        }
      };
    }, []);

    const isEnabled = () => {
      console.log(
        "data=>>>",
        letter?.name,
        letter?.serviceAgreementType?.typeId,
        letter?.bureau?.id,
        html,
        letter?.scoringRound
      );
      return !!(
        letter?.name &&
        letter?.serviceAgreementType?.typeId &&
        letter?.bureau?.id &&
        html?.length &&
        (letter?.scoringRound === undefined ||
          letter?.scoringRound === 0 ||
          letter?.scoringRound)
      );
    };
    const onSave = () => {
      let template = CommonUtils.ReplaceUnCloseIMGtags(html);
      template = CommonUtils.ReplaceUnCloseBRtags(template);
      const newLetter = {
        ...letter,
        template,
        isActive: !!letter?.id ? letter?.isActive : true,
      };

      const promise$ = !!letter?.id
        ? props?.updateServiceTemplatesDetails(newLetter, axiosSource)
        : props?.createServiceTemplates(newLetter, axiosSource);

      setIsLoading(true);
      promise$
        .then((result: any) => {
          setIsLoading(false);
          toastr.success(result?.message);
          props.onSave();
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            setIsLoading(false);
            toastr.error(err?.response?.data);
          }
        });
    };
    const onChange = (html: string) => {
      console.log("on_change=>>", html);
      setHtml(html);
    };
    const handleChange = (evt: any) => {
      const value = evt.target.value;
      let newForm = (letter || {}) as ServiceTempLetters;
      let propNames = evt.target.name?.split(".");

      if (propNames?.length == 2) {
        newForm = {
          ...newForm,
          [propNames[0]]: {
            [propNames[1]]: value,
          },
        };
      } else if (propNames?.length == 1) {
        newForm = {
          ...newForm,
          [propNames[0]]: value,
        };
      }

      setLetter(newForm);
    };
    const getDetails = async (id?: string) => {
      // debugger;
      setIsLoading(true);
      try {
        let result = await props?.getServiceTemplatesDetails(
          props?.letterId,
          axiosSource
        );

        setIsLoading(false);
        setLetter(result);
        console.log("heelo->>>>>>>>", result?.template);
        setHtml(result?.template || "");
      } catch (err: any) {
        return toastr.error(err?.response?.data);
      }
    };
    const getBureaus = () => {
      props
        ?.getAllBureaus(axiosSource)
        .then((result: IDataItem[]) => {
          setBureaus(result);
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            toastr.error(err?.response?.data);
          }
        });
    };
    const getLetterTypes = () => {
      props
        ?.getAllLetterTypes(axiosSource)
        .then((result: ILetterType[]) => {
          setLetterTypes(result);
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            toastr.error(err?.response?.data);
          }
        });
    };
    const getFieldsTokens = () => {
      props
        ?.serviceTemplateFieldTokens(axiosSource)
        .then((result: INameValueSmall[]) => {
          setFieldsTokens(result);
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            toastr.error(err?.response?.data);
          }
        });
    };
    console.log("html->>>>>>>", html);
    return (
      <div className="letter-editor position-relative">
        <div className="row">
          <div className="col-6 col-sm-5">
            <div className="form-group">
              <label className="text-orange-red">Name*</label>
              <input
                value={letter?.name || ""}
                onChange={handleChange}
                type="text"
                name="name"
                className="form-control"
                placeholder="Letter Name"
                required={true}
              />
            </div>
          </div>
          <div className="col-6 col-sm-2">
            <div className="form-group">
              <label className="text-orange-red">Agreement Type*</label>
              <select
                value={letter?.serviceAgreementType?.typeId || ""}
                onChange={handleChange}
                disabled={!letterTypes?.length}
                name="serviceAgreementType.typeId"
                className="form-control input-sm"
                required={true}
              >
                {!letter?.id && <option value={""}>-Select-</option>}
                {letterTypes?.map((item: ILetterType, index: number) => (
                  <option key={index} value={item?.typeId}>
                    {item?.type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-6 col-sm-2">
            <div className="form-group">
              <label className="text-orange-red">Agreement Source*</label>
              <select
                value={letter?.bureau?.id || ""}
                onChange={handleChange}
                disabled={!bureaus?.length}
                name="bureau.id"
                className="form-control input-sm"
                required={true}
              >
                {!letter?.id && <option value={""}>-Select-</option>}
                {bureaus?.map((item: IDataItem, index: number) => (
                  <option key={index} value={item?.id}>
                    {item?.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-6 col-sm-2">
            <div className="form-group">
              <label className="text-orange-red">Round*</label>
              <select
                value={letter?.scoringRound || 0}
                onChange={handleChange}
                name="scoringRound"
                className="form-control input-sm"
                required={true}
              >
                <option value={0}>All Rounds</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]?.map(
                  (item: number, index: number) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>
        <AsyncHTMLEditor
          allowPreview={true}
          allowHTMLEdit={true}
          allowAddFieldTokens={true}
          isSaveDisabled={!isEnabled()}
          fieldsTokens={fieldsTokens}
          isLoading={isLoading}
          onSave={onSave}
          content={html}
          onChange={onChange}
        />
      </div>
    );
  }
);
