import { Link, Redirect } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { bindActionCreators } from "redux";
// @ts-ignore
import confirm from "reactstrap-confirm";
import { connect } from "react-redux";
import InputMask from "react-input-mask";
import moment from "moment";
import toastr from "toastr";
import { validate as uuidValidate } from "uuid";

import {
  addLead,
  resedLeadWelcomeEmail,
  updateLead,
} from "../../../../../actions/leads.actions";
import AuthService from "../../../../../core/services/auth.service";
import { ButtonComponent } from "../../../../../shared/components/button";
import { Checkbox } from "../../../../../shared/components/checkbox";
import { CommonUtils } from "../../../../../utils/common-utils";
import { ConvertToCustomerComponent } from "./convert-to-customer";
import { CustomerContactDetailsComponent } from "../../../../customer/customer-form/tabs/notes/customer-contacts";
import { DashboardWidget } from "../../../../dashboard/components/dashboard-widget";
import { EnumComponentMode, EnumScreens } from "../../../../../models/enums";
import { ModalComponent } from "../../../../../shared/components/modal";
import { PublicLeadSuccessComponent } from "./public-lead-success";
import { getStates } from "../../../../../actions/customers.actions";
import {
  ClientRoutesConstants,
  Messages,
  Variables,
} from "../../../../../shared/constants";
import {
  ICustomerFullDetails,
  IUpdateLeadModel,
} from "../../../../../models/interfaces/customer-view";
import { IDropdown, IValueText } from "../../../../../models/interfaces/shared";
import {
  getAddress,
  getZipCode,
} from "../../../../../core/services/address.validator";
import "../../../../../shared/components/AddSuggestion.css";

const mapStateToProps = (state: any) => {
  return {
    statuses: state.customerViewModel?.statuses,
    states: state.customerViewModel?.states,
    AuthRules: AuthService.getScreenOject(
      state.sharedModel?.AuthRules,
      EnumScreens.CustomerDetails
    ),
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      addLead,
      updateLead,
      getStates,
      resedLeadWelcomeEmail,
    },
    dispatch
  );
};
export const LeadPersonalDetailsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)((props: any) => {
  const [formData, setFormData] = useState({} as ICustomerFullDetails);
  const [axiosSource] = useState(axios.CancelToken.source());
  const [isUpdating, setIsUpdating] = useState(false);
  const [resendMailing, setResendMailing] = useState(false);
  const [redirectToNewPage, setRedirectToNewPage] = useState(false);
  const [franchise, setFranchise] = useState(null as any);
  const [referral, setReferral] = useState(null as any);
  const [openConvertModal, setOpenConvertModal] = useState(false);
  const [redirectToCustomer, setRedirectToCustomer] = useState(false);
  const [publicRecordSaved, setPublicRecordSaved] = useState(false);

  const [addSuggestion, setAddSuggestion] = useState([]);

  useEffect(() => {
    return () => {
      axiosSource?.cancel(Messages.APIAborted);
    };
  }, []);
  useEffect(() => {
    if (props?.customer) {
      setFormData(props?.customer);
    }
  }, [props?.customer]);

  const getAllSuggestion = async (value: any) => {
    const data: any = await getAddress({ add: value });
    console.log("from-address", data);
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
      ["stateCode"]: props.state,
      ["city"]: props.city,
      ["zipCode"]: props.pin,
    });
    setAddSuggestion([]);
  };

  const handleChange = (evt: any) => {
    const value = evt.target.value;
    if (evt.target.name == "streetAddress") {
      getAllSuggestion(value);
    }
    setFormData({
      ...formData,
      [evt.target.name]: value,
    });
  };

  const openModal = async () => {
    if (
      !formData?.franchiseAgent ||
      (formData?.franchiseAgent as any)?.id === Variables.EMPTY_GUID
    ) {
      await confirm({
        title: "No Company Agent Set",
        bodyComponent: () => (
          <div className="text-danger">
            This Lead does not have franchise agent set. Please set and try
            again.
          </div>
        ),
        confirmText: "OK",
        confirmColor: "danger",
        cancelText: null,
      });
    } else {
      setOpenConvertModal(true);
    }
  };
  const onAddUpdate = () => {
    if (
      props?.addMode ||
      !formData?.firstName ||
      !formData?.lastName ||
      !formData?.email ||
      (props?.isPublic ? !formData?.cellPhone : false)
    ) {
      const options = {
        screenName: EnumScreens.ViewLeads,
        isPublic: props?.isPublic,
        screenMode: props?.addMode
          ? EnumComponentMode.Add
          : EnumComponentMode.Edit,
      };
      const cloneObj = { ...formData, franchise };
      const msg = CommonUtils.formErrors(cloneObj, options);
      if (msg) {
        toastr.warning(msg);
        return;
      }
    }
    const repaceExp = /[^\d]/g;
    const MMDDYYYY = "MM/DD/YYYY";
    const data = {
      lead: {
        ...formData,
        userId: formData?.userName,
        dateOfBirth: formData?.dateOfBirth
          ? moment(formData?.dateOfBirth)?.format(MMDDYYYY)
          : null,
        telephone: formData?.telephone?.replace(repaceExp, ""),
        cellPhone: formData?.cellPhone?.replace(repaceExp, ""),
        ssn: formData?.ssn?.replace(repaceExp, ""),
        referralAgent: props?.addMode ? { id: referral?.id || null } : null,
        franchiseAgent: props?.addMode
          ? { id: props?.isPublic ? props?.fAgent?.id : franchise?.id }
          : null,
        leadType: props?.isPublic ? "Active" : formData?.leadType,
        isPublicLeadCreation: props?.isPublic,
      },
      sendAgentEmail: !!formData?.emailToAgent,
    } as IUpdateLeadModel;

    setIsUpdating(true);
    const promise = props?.addMode
      ? props?.addLead(data, axiosSource)
      : props?.updateLead(data, axiosSource);
    promise
      .then((result: any) => {
        setIsUpdating(false);
        if (uuidValidate(result?.leadId)) {
          if (props?.isPublic) {
            setPublicRecordSaved(true);
          } else {
            toastr.success(result?.status);
            afterSave(result?.leadId);
          }
          if (props?.onReloadLeadsList) {
            props?.onReloadLeadsList();
          }
        } else {
          toastr.error(Messages.GenericError);
        }
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setIsUpdating(false);
          toastr.error(err?.response?.data);
        }
      });
  };
  const afterSave = (id: string) => {
    if (props?.addMode) {
      setFormData({
        ...formData,
        id,
      });
      setTimeout(() => {
        // redirect to customer form to edit further details
        setRedirectToNewPage(true);
      }, 0);
    } else {
      setFormData({
        ...formData,
      });
    }
  };
  const onConvert = () => {
    setOpenConvertModal(false);
    setRedirectToNewPage(true);
    setRedirectToCustomer(true);
    props.onReloadLeadsList();
  };
  const onResendWelcomeEmail = () => {
    setResendMailing(true);
    props
      ?.resedLeadWelcomeEmail(formData?.id, axiosSource)
      .then((result: any) => {
        setResendMailing(false);
        if (result) {
          toastr.success("Welcome email resent successfully!!");
        } else {
          toastr.error(Messages.GenericError);
        }
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setResendMailing(false);
          toastr.error(err?.response?.data);
        }
      });
  };
  return !redirectToNewPage ? (
    <div className="tab-personal-details">
      {publicRecordSaved ? (
        <PublicLeadSuccessComponent />
      ) : (
        <>
          {(!props?.addMode ? !!props?.customer : true) && (
            <DashboardWidget
              hideHeader={props?.isPublic}
              rootClassName={props?.isPublic ? "nostyle-public" : ""}
              title={"Personal Details"}
              allowFullscreen={true}
              allowMaximize={true}
              allowMinimize={true}
              reload={false}
            >
              <form className="top-form">
                <div className="row">
                  <div className="col-6 col-sm-3 for-public">
                    <div className="form-group">
                      <label className="text-orange-red">First Name*</label>
                      <input
                        type="text"
                        onChange={handleChange}
                        value={formData?.firstName || ""}
                        name="firstName"
                        className="form-control"
                        placeholder="Enter First Name"
                        required={true}
                      />
                    </div>
                  </div>
                  {!props?.isPublic && (
                    <div className="col-6 col-sm-3 for-public">
                      <div className="form-group">
                        <label>Middle Name</label>
                        <input
                          type="text"
                          onChange={handleChange}
                          value={formData?.middleName || ""}
                          name="middleName"
                          className="form-control"
                          placeholder="Enter Middle Name"
                          required={true}
                        />
                      </div>
                    </div>
                  )}
                  <div className="col-6 col-sm-3 for-public">
                    <div className="form-group">
                      <label className="text-orange-red">Last Name*</label>
                      <input
                        type="text"
                        onChange={handleChange}
                        value={formData?.lastName || ""}
                        name="lastName"
                        className="form-control"
                        placeholder="Enter Last Name"
                        required={true}
                      />
                    </div>
                  </div>
                  {!props?.isPublic && (
                    <div className="col-6 col-sm-3 for-public">
                      <div className="form-group">
                        <label>Suffix</label>
                        <select
                          onChange={handleChange}
                          value={formData?.suffix || ""}
                          className="form-control input-sm"
                          name="suffix"
                          required={true}
                        >
                          <option value={""}>- Select -</option>
                          <option value={"II"}>II</option>
                          <option value={"III"}>III</option>
                          <option value={"IV"}>IV</option>
                          <option value={"Jr."}>Jr.</option>
                          <option value={"Sr."}>Sr.</option>
                        </select>
                      </div>
                    </div>
                  )}
                  {!props?.isPublic &&
                    !AuthService.isFieldHidden(props.AuthRules, "SSN") && (
                      <div className="col-6 col-sm-3 for-public">
                        <div className="form-group">
                          <label>SSN</label>
                          <InputMask
                            disabled={AuthService.isFieldReadOnly(
                              props.AuthRules,
                              "SSN"
                            )}
                            onChange={handleChange}
                            value={formData?.ssn || ""}
                            type="text"
                            name="ssn"
                            className="form-control"
                            placeholder="___-__-____"
                            required={true}
                            mask="999-99-9999"
                            maskChar="_"
                          />
                        </div>
                      </div>
                    )}
                  {!props?.isPublic &&
                    !AuthService.isFieldHidden(props.AuthRules, "DOB") && (
                      <div className="col-6 col-sm-3 for-public">
                        <div className="form-group">
                          <label>DOB</label>
                          <InputMask
                            disabled={AuthService.isFieldReadOnly(
                              props.AuthRules,
                              "DOB"
                            )}
                            onChange={handleChange}
                            value={CommonUtils.getDateInMMDDYYYY(
                              formData?.dateOfBirth || ""
                            )}
                            name="dateOfBirth"
                            type="text"
                            className="form-control"
                            placeholder="MM/dd/yyyy"
                            required={true}
                            mask="99/99/9999"
                            maskChar="_"
                          />
                        </div>
                      </div>
                    )}
                  {!props?.isPublic && (
                    <>
                      <div className="col-6 col-sm-3 for-public">
                        <div className="form-group">
                          <label>Address</label>
                          <input
                            type="text"
                            value={formData?.streetAddress || ""}
                            onChange={handleChange}
                            name="streetAddress"
                            className="form-control"
                            placeholder="Address"
                            required={true}
                            autoComplete={"none"}
                          />
                          {addSuggestion?.length > 0 && (
                            <div className="suggestionDiv">
                              {addSuggestion?.map((d: any, i: any) => {
                                return (
                                  <p
                                    key={i}
                                    className="suggestionText"
                                    onClick={() => {
                                      setAllSuggestion({
                                        id: d.place_id,
                                        data: d.structured_formatting.main_text,
                                        state:
                                          d.terms[d.terms.length - 2].value,
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
                      <div className="col-6 col-sm-3 for-public">
                        <div className="form-group">
                          <label>Address 2</label>
                          <input
                            type="text"
                            value={formData?.secondaryAddress || ""}
                            onChange={handleChange}
                            name="secondaryAddress"
                            className="form-control"
                            placeholder="Secondary Address"
                            required={true}
                          />
                        </div>
                      </div>
                      <div className="col-6 col-sm-3 for-public">
                        <div className="form-group">
                          <label>City</label>
                          <input
                            value={formData?.city || ""}
                            onChange={handleChange}
                            type="text"
                            name="city"
                            className="form-control"
                            placeholder="City"
                            required={true}
                          />
                        </div>
                      </div>
                      <div className="col-6 col-sm-3 for-public">
                        <div className="form-group">
                          <label>State</label>
                          <select
                            value={formData?.stateCode || ""}
                            onChange={handleChange}
                            className="form-control input-sm"
                            name="stateCode"
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
                      <div className="col-6 col-sm-3 for-public">
                        <div className="form-group">
                          <label>Zip Code</label>
                          <input
                            value={formData?.zipCode || ""}
                            onChange={handleChange}
                            type="text"
                            name="zipCode"
                            className="form-control"
                            placeholder="Zip Code"
                            required={true}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-6 col-sm-3 for-public">
                    <div className="form-group">
                      <label className="text-orange-red">Email*</label>
                      <input
                        value={formData?.email || ""}
                        onChange={handleChange}
                        type="text"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        required={true}
                      />
                    </div>
                  </div>
                  {!props?.isPublic && (
                    <div className="col-6 col-sm-3 for-public">
                      <div className="form-group">
                        <label>Home Phone</label>
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
                  )}
                  <div className="col-6 col-sm-3 for-public">
                    <div className="form-group">
                      <label
                        className={props?.isPublic ? "text-orange-red" : ""}
                      >
                        Cell Phone{props?.isPublic ? "*" : ""}
                      </label>
                      <InputMask
                        value={formData?.cellPhone || ""}
                        onChange={handleChange}
                        name="cellPhone"
                        type="text"
                        className="form-control"
                        placeholder="(999) 999-9999"
                        required={true}
                        mask="(999) 999-9999"
                        maskChar="X"
                      />
                    </div>
                  </div>
                  <div className="col-6 col-sm-3 for-public">
                    <div className="form-group">
                      <label>Best Time to Call</label>
                      <select
                        value={formData?.bestTimeToCall || ""}
                        onChange={handleChange}
                        name="bestTimeToCall"
                        className="form-control input-sm"
                        required={true}
                      >
                        {props?.addMode && <option value={""}>-Select-</option>}
                        {CommonUtils.CallingTimes()?.map(
                          (item: IValueText, index: number) => (
                            <option key={index} value={item?.value}>
                              {item?.text}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                  {!props?.isPublic && (
                    <div className="col-6 col-sm-3 for-public">
                      <div className="form-group">
                        <label>Lead Type</label>
                        <select
                          value={formData?.leadType || ""}
                          onChange={handleChange}
                          name="leadType"
                          className="form-control input-sm"
                          required={true}
                        >
                          {props?.addMode && (
                            <option value={""}>-Select-</option>
                          )}
                          {CommonUtils.LeadTypes()?.map(
                            (item: IValueText, index: number) => (
                              <option key={index} value={item?.value}>
                                {item?.text}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                  {!props?.isPublic && (
                    <>
                      <div className="col-6 col-sm-3 for-public">
                        <div className="form-group">
                          <label>Credit Goal</label>
                          <select
                            value={formData?.transactionType || ""}
                            onChange={handleChange}
                            name="transactionType"
                            className="form-control input-sm"
                            required={true}
                          >
                            {props?.addMode && (
                              <option value={""}>-Select-</option>
                            )}
                            {CommonUtils.TransactionTypes()?.map(
                              (item: IValueText, index: number) => (
                                <option key={index} value={item?.value}>
                                  {item?.text}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="col-6 col-sm-3 for-public">
                        <div className="form-group">
                          <label>Target Score</label>
                          <input
                            value={formData?.targetScore || ""}
                            onChange={handleChange}
                            type="text"
                            name="targetScore"
                            className="form-control"
                            placeholder="Target Score"
                            required={true}
                          />
                        </div>
                      </div>
                      <div className="col-6 col-sm-3 for-public">
                        <div className="form-group">
                          <label>Mid Score Target</label>
                          <input
                            value={formData?.midScore || ""}
                            onChange={handleChange}
                            type="text"
                            name="midScore"
                            className="form-control"
                            placeholder="Mid Score"
                            required={true}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {!props?.isPublic && (
                  <div
                    className={
                      props?.isPublic ? "row mb-5 mt-1" : "row mb-3 mt-2"
                    }
                  >
                    <div className="col-12">&nbsp;</div>
                    <div className="col-12 col-sm-9">
                      <div className="row">
                        {props?.addMode && (
                          <div className="col-12 col-sm-6">
                            <div className="form-group">
                              <Checkbox
                                text="Send Agent Email Upon Adding?"
                                title="Send Agent Email Upon Adding?"
                                checked={formData?.emailToAgent || false}
                                onChange={(data: any) =>
                                  handleChange({
                                    target: {
                                      value: data.checked,
                                      name: "emailToAgent",
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                        {!props?.addMode && (
                          <>
                            {!AuthService.isFieldHidden(
                              props.AuthRules,
                              "ResendLeadWelcomeEmail"
                            ) && (
                              <div className="col-12 col-sm-3 pr-sm-0">
                                <ButtonComponent
                                  text="Resend Welcome Email"
                                  className="btn-secondary pl-sm-2 w-100 w-sm-auto"
                                  loading={resendMailing}
                                  onClick={onResendWelcomeEmail}
                                >
                                  <i className="fa fa-retweet mr-2"></i>
                                </ButtonComponent>
                              </div>
                            )}
                            <div className="col-12 col-sm-3 pr-sm-0 mt-1 mt-sm-0">
                              <ButtonComponent
                                text="Convert To Client"
                                className="btn-success w-100 w-sm-auto"
                                onClick={openModal}
                              >
                                <i className="fa fa-exchange mr-2"></i>
                              </ButtonComponent>
                            </div>
                            <div className="col-12 col-sm-3 text-left mt-1 mt-sm-0"></div>
                          </>
                        )}
                      </div>
                    </div>
                    {!props?.addMode &&
                      !AuthService.isFieldHidden(
                        props.AuthRules,
                        "SaveButton"
                      ) && (
                        <div className="col-12 col-sm-3 text-right  mt-3 mt-sm-0">
                          <ButtonComponent
                            text="Save Details"
                            className="btn-primary w-100 w-sm-auto"
                            loading={isUpdating}
                            onClick={onAddUpdate}
                          >
                            <i className="fa fa-floppy-o mr-2"></i>
                          </ButtonComponent>
                        </div>
                      )}
                  </div>
                )}
              </form>
            </DashboardWidget>
          )}
          {props?.addMode && (
            <div
              className={
                "row mb-3 mt-2" + (props?.isPublic ? " for-public-button " : "")
              }
            >
              {!props?.isPublic && (
                <div className="col-12">
                  <CustomerContactDetailsComponent
                    fAgentId={props?.fAgent?.id}
                    isPublic={props?.isPublic}
                    hideROffice={props?.isPublic}
                    onFranchiseSelect={setFranchise}
                    onReferralSelect={setReferral}
                    addMode={props?.addMode}
                    onChange={handleChange}
                  />
                </div>
              )}
              <div
                className={
                  props?.isPublic
                    ? "col-12 text-right"
                    : "col-12 text-right mt-4"
                }
              >
                <ButtonComponent
                  text={props?.isPublic ? "Submit" : "Save Details"}
                  className="btn-primary for-public w-100 w-sm-auto"
                  loading={isUpdating}
                  onClick={onAddUpdate}
                >
                  <i className="fa fa-floppy-o mr-2"></i>
                </ButtonComponent>
              </div>
            </div>
          )}
          <ModalComponent
            halfFullScreen={true}
            title={`Converting Lead "${formData?.fullName}" to Client`}
            isVisible={openConvertModal}
            onClose={() => {
              setOpenConvertModal(false);
            }}
          >
            {openConvertModal && (
              <ConvertToCustomerComponent
                leadId={formData?.id}
                onConvert={onConvert}
                onClose={() => {
                  setOpenConvertModal(false);
                }}
              />
            )}
          </ModalComponent>
        </>
      )}
    </div>
  ) : redirectToCustomer ? (
    <Redirect to={ClientRoutesConstants.customers + "/" + formData?.id} />
  ) : (
    <Redirect to={ClientRoutesConstants.leads + "/" + formData?.id} />
  );
});
