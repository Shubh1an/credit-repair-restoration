import axios, { CancelTokenSource } from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { validate as uuidValidate } from "uuid";
import toastr from "toastr";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";
// @ts-ignore
import confirm from "reactstrap-confirm";
import InputMask from "react-input-mask";

import AuthService from "../../../../../../core/services/auth.service";
import { EnumComponentMode, EnumScreens } from "../../../../../../models/enums";
import {
  deleteReferralOffice,
  addUpdateReferralOffice,
} from "../../../../../../actions/referral.actions";
import {
  IFranchiseAgent,
  IReferralOffice,
} from "../../../../../../models/interfaces/franchise";
import { ButtonComponent } from "../../../../../../shared/components/button";
import {
  ClientRoutesConstants,
  Messages,
} from "../../../../../../shared/constants";
import { CommonUtils } from "../../../../../../utils/common-utils";
import { WindowUtils } from "../../../../../../utils/window-utils";
import {
  IDropdown,
  IValueText,
} from "../../../../../../models/interfaces/shared";
import { DashboardWidget } from "../../../../../dashboard/components/dashboard-widget";
import {
  getAddress,
  getZipCode,
} from "../../../../../../core/services/address.validator";
import "../../../../../../shared/components/AddSuggestion.css";

const mapStateToProps = (state: any) => {
  return {
    AuthRules: AuthService.getScreenOject(
      state.sharedModel?.AuthRules,
      EnumScreens.ViewReferralOffices
    ),
  };
};
const classifications = CommonUtils.ReferralOfficeTypes();
const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      addUpdateReferralOffice,
      deleteReferralOffice,
    },
    dispatch
  );
};
export const ReferralOfficeInfoComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  (props: {
    office: IReferralOffice | null;
    addMode?: boolean;
    addUpdateReferralOffice: any;
    deleteReferralOffice: any;
    onReloadOfficesList?: any;
    agents: IFranchiseAgent[];
    fAgents: IFranchiseAgent[];
    states: IDropdown[];
    AuthRules: any;
  }) => {
    const [formData, setFormData] = useState({} as IReferralOffice);
    const [axiosSource] = useState(axios.CancelToken.source());
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [redirectToNewPage, setRedirectToNewPage] = useState(false);
    const [redirectToList, setRedirectToList] = useState(false);

    const [addSuggestion, setAddSuggestion] = useState([]);

    useEffect(() => {
      if (props?.addMode) {
        const payload = AuthService.getCurrentJWTPayload();
        setFormData({
          ...formData,
          agent: {
            id: payload?.id,
          },
        });
      }
      return () => {
        axiosSource?.cancel(Messages.APIAborted);
      };
    }, []);

    useEffect(() => {
      if (props?.office) {
        setFormData(props?.office);
      }
    }, [props?.office]);

    const getAllSuggestion = async (value: any) => {
      const data: any = await getAddress({ add: value });
      setAddSuggestion(data);
    };
    const setAllSuggestion = async (props: any) => {
      const { id, data, state, city } = props;
      const zip: any = await getZipCode({ id, data, state, city });
      setAddress(zip);
    };
    const setAddress = (props: any) => {
      setFormData({
        ...formData,
        ["streetAddress"]: props.data,
        ["state"]: props.state,
        ["city"]: props.city,
        ["zipCode"]: props.pin,
      });
      setAddSuggestion([]);
    };

    const handleAddChange = (evt: any) => {
      const value = evt.target.value;
      if (evt.target.name == "streetAddress") {
        getAllSuggestion(value);
      }
      setFormData({
        ...formData,
        [evt.target.name]: value,
      });
    };

    const handleChange = (evt: any) => {
      const value = evt.target.value;
      let newForm = (formData || {}) as IReferralOffice;
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
      setFormData(newForm);
    };
    const onAddUpdate = () => {
      if (
        !formData?.name ||
        !formData?.agent?.id ||
        !formData?.classification
      ) {
        const options = {
          screenName: EnumScreens.ViewReferralOffices,
          screenMode: props?.addMode
            ? EnumComponentMode.Add
            : EnumComponentMode.Edit,
        };
        let cloneObj = { ...formData };
        const msg = CommonUtils.formErrors(cloneObj, options);
        if (msg) {
          toastr.warning(msg);
          return;
        }
      }
      setIsSaving(true);
      props
        ?.addUpdateReferralOffice(formData, axiosSource)
        .then((result: any) => {
          setIsSaving(false);
          if (props?.addMode) {
            if (typeof result !== "string" && uuidValidate(result?.id)) {
              toastr.success(result?.message);
              afterSave(result.id);
            } else {
              toastr.error(result); // username already exists
            }
          } else {
            toastr.success(result?.message);
            afterSave(formData.id);
          }
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            setIsSaving(false);
            toastr.error(err?.response?.data);
          }
        });
    };
    const afterSave = (id: string) => {
      if (props?.onReloadOfficesList) {
        props?.onReloadOfficesList();
      }
      if (props?.addMode) {
        setFormData({
          ...formData,
          id,
        });
        setTimeout(() => {
          // redirect to customer form to edit further details
          setRedirectToNewPage(true);
        }, 0);
      }
    };
    const onDeleteOffice = async () => {
      if (props?.agents?.length) {
        toastr.error(
          `This office has ${props?.agents?.length} agents so cant be deleted. Remove all the agents first and then try again.`
        );
        return;
      }
      let result = await confirm({
        title: "Remove Record",
        message: "Are you sure you want to delete this Affiliate Office?",
        confirmText: "YES",
        confirmColor: "danger",
        cancelColor: "link text-secondary",
      });
      if (result) {
        setIsDeleting(true);
        props
          ?.deleteReferralOffice(formData.id, axiosSource)
          .then((result: any) => {
            setIsDeleting(false);
            toastr.success(result);
            setRedirectToList(true);
            if (props?.onReloadOfficesList) {
              props?.onReloadOfficesList();
            }
            WindowUtils.ScrollToTop();
          })
          .catch((err: any) => {
            if (!axios.isCancel(err)) {
              setIsDeleting(false);
              toastr.error(err?.response?.data);
            }
          });
      }
    };

    return (
      <>
        {redirectToList && (
          <Redirect to={ClientRoutesConstants.referralOffices} />
        )}
        {redirectToNewPage && (
          <Redirect
            to={ClientRoutesConstants.referralOffices + "/" + formData.id}
          />
        )}
        <div className="tab-personal-details">
          {(!props?.addMode ? !!props?.office : true) && (
            <DashboardWidget
              title={"Office Info"}
              allowFullscreen={true}
              allowMaximize={true}
              allowMinimize={true}
              reload={false}
            >
              <form className="top-form">
                <div className="row">
                  <div className="col-12 col-sm-3">
                    <div className="form-group">
                      <label className="text-orange-red">Credit Agent*</label>
                      <select
                        onChange={handleChange}
                        value={formData?.agent?.id || ""}
                        className="form-control input-sm"
                        name="agent.id"
                        required={true}
                      >
                        <option value={""}>- Select -</option>
                        {props?.fAgents?.map((ag: IFranchiseAgent) => {
                          return (
                            <option key={ag?.id} value={ag?.id}>
                              {ag?.fullName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3">
                    <div className="form-group">
                      <label className="text-orange-red">Office Name*</label>
                      <input
                        type="text"
                        onChange={handleChange}
                        value={formData?.name || ""}
                        name="name"
                        className="form-control"
                        placeholder="Enter Office Full Name"
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-3">
                    <div className="form-group">
                      <label className="text-orange-red">Office Type*</label>
                      <select
                        onChange={handleChange}
                        value={formData?.classification || ""}
                        className="form-control input-sm"
                        name="classification"
                        required={true}
                      >
                        <option value={""}>- Select -</option>
                        {classifications?.map((ag: IValueText) => {
                          return (
                            <option key={ag?.value} value={ag?.value}>
                              {ag?.text}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        value={formData?.streetAddress || ""}
                        onChange={handleAddChange}
                        name="streetAddress"
                        className="form-control"
                        placeholder="Address"
                        required={true}
                        autoComplete={"none"}
                      />
                      {addSuggestion.length > 0 && (
                        <div className="suggestionDiv">
                          {addSuggestion.map((d: any, i: any) => {
                            return (
                              <p
                              key={i}
                              className="suggestionText"
                                onClick={() => {
                                  setAllSuggestion({
                                    id: d.place_id,
                                    data: d.structured_formatting.main_text,
                                    state: d.terms[d.terms.length - 2].value,
                                    city: d.terms[d.terms.length - 3].value,
                                  });
                                }}
                              >
                                {d.description}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-sm-3">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        onChange={handleChange}
                        value={formData?.city || ""}
                        name="city"
                        className="form-control"
                        placeholder="Enter City"
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-3">
                    <div className="form-group">
                      <label>State</label>
                      <select
                        onChange={handleChange}
                        value={formData?.state || ""}
                        className="form-control input-sm"
                        name="state"
                        required={true}
                      >
                        <option value={""}>- Select -</option>
                        {props?.states?.map((state: IDropdown) => {
                          return (
                            <option
                              key={state?.abbreviation}
                              value={state?.abbreviation}
                            >
                              {state?.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3">
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input
                        type="number"
                        onChange={handleChange}
                        value={formData?.zipCode || ""}
                        name="zipCode"
                        className="form-control"
                        placeholder="Enter City"
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-3">
                    <div className="form-group">
                      <label>Phone</label>
                      <InputMask
                        value={formData?.telephone || ""}
                        onChange={handleChange}
                        name="telephone"
                        type="text"
                        className="form-control"
                        placeholder="(999) 999-9999"
                        required={true}
                        mask="(999) 999-9999"
                        maskChar="X"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-3">
                    <div className="form-group">
                      <label>Fax</label>
                      <InputMask
                        value={formData?.fax || ""}
                        onChange={handleChange}
                        name="fax"
                        type="text"
                        className="form-control"
                        placeholder="(999) 999-9999"
                        required={true}
                        mask="(999) 999-9999"
                        maskChar="X"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-3 mt-5">
                  <div className="col-12 d-flex flex-column flex-sm-row justify-content-between">
                    <div>
                      {!props?.addMode &&
                        !AuthService.isFieldHidden(
                          props.AuthRules,
                          "ReferralOfficeRemoveButton"
                        ) && (
                          <ButtonComponent
                            text="Remove Office"
                            className="btn-danger w-100 w-sm-auto"
                            loading={isDeleting}
                            onClick={onDeleteOffice}
                          >
                            <i className="fa fa-trash mr-2"></i>
                          </ButtonComponent>
                        )}
                    </div>
                    <div></div>
                    <ButtonComponent
                      text="Save Details"
                      className="btn-primary w-100 w-sm-auto mt-3 mt-sm-0"
                      loading={isSaving}
                      onClick={onAddUpdate}
                    >
                      <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                  </div>
                </div>
              </form>
            </DashboardWidget>
          )}
        </div>
      </>
    );
  }
);
