import { Link, Redirect } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import axios from "axios";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import toastr from "toastr";
import InputMask from "react-input-mask";
import { validate as uuidValidate } from "uuid";
// @ts-ignore
import confirm from "reactstrap-confirm";

import AuthService from "../../../../../../core/services/auth.service";
import { ButtonComponent } from "../../../../../../shared/components/button";
import { CommonUtils } from "../../../../../../utils/common-utils";
import { CustomerContactDetailsComponent } from "../../notes/customer-contacts";
import { DashboardWidget } from "../../../../../dashboard/components/dashboard-widget";
import {
  EnumComponentMode,
  EnumRoles,
  EnumScreens,
} from "../../../../../../models/enums";
import {
  ClientRoutesConstants,
  Messages,
} from "../../../../../../shared/constants";
import {
  ICustomerFullDetails,
  ICustomerShort,
  IUpdateCustomerModel,
} from "../../../../../../models/interfaces/customer-view";
import {
  IDropdown,
  IValueText,
} from "../../../../../../models/interfaces/shared";
import {
  PORNeededEmail,
  UpdateCustomerdetails,
  removeSpouse,
  resedWelcomeEmail,
  submitToProcessing,
} from "../../../../../../actions/customers.actions";
import { ModalComponent } from "../../../../../../shared/components/modal";
import { SelectCustomerComponent } from "../../../../../../shared/components/select-customer";
import {
  getAddress,
  getZipCode,
} from "../../../../../../core/services/address.validator";
import "../../../../../../shared/components/AddSuggestion.css"

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
      resedWelcomeEmail,
      PORNeededEmail,
      UpdateCustomerdetails,
      removeSpouse,
      submitToProcessing,
    },
    dispatch
  );
};

export const CustomerPersonalDetailsComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)((props: any) => {
  const [ccValue, setCcValue] = useState("");
  const [ccMask, setCcMask] = useState("9999-9999-9999-9999");
  const [months] = useState(CommonUtils.getMonths());
  const [expirationYears] = useState(CommonUtils.getYears());

  const [spouse, setSpouse] = useState<ICustomerShort | null>(null);
  const [spouseModalClose, setSpouseModalClose] = useState(false);
  const [formData, setFormData] = useState({} as ICustomerFullDetails);
  const [axiosSource] = useState(axios.CancelToken.source());
  const [formChanged, setFormChanged] = useState(false);
  const [resendMailing, setResendMailing] = useState(false);
  const [sendPOR, setSendPOR] = useState(false);
  const [ccEXPMonth, setccEXPMonth] = useState("");
  const [ccEXPYear, setccEXPYear] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [spouseRemoving, setSpouseRemoving] = useState(false);
  const [redirectToNewPage, setRedirectToNewPage] = useState(false);
  const [franchise, setFranchise] = useState(null as any);
  const [referral, setReferral] = useState(null as any);
  const [isSiteOutsourced, setIsSiteOutsourced] = useState(false);
  const [sendingProcessing, setSendingProcessing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLast4SSNDigits, setShowLast4SSNDigits] = useState(true);
  const [last4SSNDigits, setLast4SSNDigits] = useState("");
  const [addSuggestion, setAddSuggestion] = useState([]);

  useEffect(() => {
    setIsSiteOutsourced(
      AuthService.getCurrentJWTPayload()?.isOutsourced?.toString() === "true"
    );
    setIsAdmin(
      AuthService.getCurrentJWTPayload()?.roles === EnumRoles.Administrator
    );
    return () => {
      axiosSource?.cancel(Messages.APIAborted);
    };
  }, []);
  useEffect(() => {
    setLast4SSNDigits("");
    if (props?.customer) {
      setFormData(props?.customer);
      setCcValue(props?.customer?.creditCardNumber);
      setSpouse(props?.customer?.spouse);
      setccEXPMonth(props?.ccExpMonth);
      setccEXPYear(props?.ccExpYear);
      setShowLast4SSNDigits(
        !(
          AuthService.isFieldReadOnly(props.AuthRules, "SSNLast4Digits") ||
          AuthService.isFieldHidden(props.AuthRules, "SSNLast4Digits")
        )
      );
      setLast4SSNDigits(props?.customer?.ssn?.slice(5));
    }
  }, [props?.customer]);

  useEffect(() => {
    if (props?.addMode) {
      setFormData({ ...(formData || {}), transactionType: "Active" });
    }
  }, [props?.addMOde]);

  const CCChange = (event: any) => {
    setCcValue(event.target.value);
    if (CommonUtils.isAMEXcard(event.target.value)) {
      // AMEX
      setCcMask("9999-999999-99999");
    } else {
      setCcMask("9999-9999-9999-9999");
    }
  };

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
    setFormChanged(true);
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
    setFormChanged(true);
    const value = evt.target.value;
    if (evt.target.name == "streetAddress") {
      getAllSuggestion(value);
    }
    setFormData({
      ...formData,
      [evt.target.name]: value,
    });
  };
  const onResendWelcomeEmail = () => {
    setResendMailing(true);
    props
      ?.resedWelcomeEmail(formData?.id, axiosSource)
      .then((result: any) => {
        setResendMailing(false);
        if (result) {
          toastr.success("Welcome email resent successfully!!");
          props.onReloadCustomer();
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
  const onPORNeedeEmail = () => {
    setSendPOR(true);
    props
      ?.PORNeededEmail(formData?.id, axiosSource)
      .then((result: any) => {
        setSendPOR(false);
        if (result) {
          toastr.success("POR needed email sent successfully!!");
        } else {
          toastr.error(Messages.GenericError);
        }
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setSendPOR(false);
          toastr.error(err?.response?.data);
        }
      });
  };
  const onAddUpdate = () => {
    if (
      props?.addMode ||
      !formData?.firstName ||
      !formData?.lastName ||
      !formData?.email ||
      !formData?.transactionType
    ) {
      const options = {
        screenName: EnumScreens.CustomerList,
        screenMode: props?.addMode
          ? EnumComponentMode.Add
          : EnumComponentMode.Edit,
      };
      let cloneObj = { ...formData, franchise };
      const msg = CommonUtils.formErrors(cloneObj, options);
      if (msg) {
        toastr.warning(msg);
        return;
      }
    }

    const { siteId } = AuthService.getCurrentJWTPayload() ?? {};
    const repaceExp = /[^\d]/g;
    const MMDDYYYY = "MM/DD/YYYY";
    let ssn =
      formData?.ssn?.replace(showLast4SSNDigits ? repaceExp : /-/g, "") || "";
    if (
      !props?.addMode &&
      ssn?.length > 5 &&
      last4SSNDigits?.length &&
      !showLast4SSNDigits
    ) {
      ssn = ssn.slice(0, 5) + last4SSNDigits;
    }
    const data = {
      creditCustomer: {
        ...formData,
        creditCardExpiration:
          ccEXPYear && ccEXPMonth
            ? moment(new Date(+ccEXPYear, +ccEXPMonth - 1, 1))
                ?.endOf("month")
                ?.format(MMDDYYYY)
            : null,
        websiteId: siteId,
        userId: formData?.userName,
        dateOfBirth: formData?.dateOfBirth
          ? moment(formData?.dateOfBirth)?.format(MMDDYYYY)
          : null,
        reportPullDate: formData?.reportPullDate
          ? moment(formData?.reportPullDate)?.format(MMDDYYYY)
          : null,
        creditCardNumber: formData?.creditCardNumber?.replace(repaceExp, ""),
        telephone: formData?.telephone?.replace(repaceExp, ""),
        cellPhone: formData?.cellPhone?.replace(repaceExp, ""),
        ssn,
        referralAgent: !props?.addMode
          ? formData?.referrer?.id && formData?.referrer?.membershipId
            ? formData?.referrer?.id + "|" + formData?.referrer?.membershipId
            : null
          : referral?.id && referral?.membershipId
          ? referral?.id + "|" + referral?.membershipId
          : null,
        franchiseAgent: !props?.addMode
          ? formData?.agent?.id && formData?.agent?.membershipId
            ? formData?.agent?.id + "|" + formData?.agent?.membershipId
            : null
          : franchise?.id && franchise?.membershipId
          ? franchise?.id + "|" + franchise?.membershipId
          : null,
      },
      newSpouseId: spouse?.id,
      isSendMail: "0",
      whoLeft: "",
    } as IUpdateCustomerModel;

    setIsUpdating(true);
    props
      ?.UpdateCustomerdetails(data, axiosSource)
      .then((result: any) => {
        setIsUpdating(false);
        if (uuidValidate(result)) {
          toastr.success(
            props?.addMode
              ? "Client added successfully!!"
              : "Client details updated successfully!!"
          );
          afterSave(result);
        } else {
          if (typeof result !== "string" && uuidValidate(result?.id)) {
            toastr.success(result?.message);
            afterSave(result.id);
          } else {
            toastr.error(result); // username already exists
          }
        }
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setIsUpdating(false);
          toastr.error(err?.response?.data);
        }
      });
  };
  const afterSave = (cid: string) => {
    if (props?.addMode) {
      setFormData({
        ...formData,
        id: cid,
      });
      setTimeout(() => {
        // redirect to customer form to edit further details
        setRedirectToNewPage(true);
      }, 0);
    } else {
      setFormData({
        ...formData,
        spouse,
      });
    }
    if (props?.onReloadCustomersList) {
      props?.onReloadCustomersList();
    }
  };
  const onSpouseRemove = () => {
    if (formData?.spouse?.id !== spouse?.id) {
      setSpouse(null);
      return;
    }
    if (spouse?.id) {
      setSpouseRemoving(true);
      props
        ?.removeSpouse(formData?.id, spouse?.id, axiosSource)
        .then((result: any) => {
          setSpouseRemoving(false);
          if (result) {
            toastr.success("Spouse removed successfully!!");
            setSpouse(null);
          } else {
            toastr.error(Messages.GenericError);
          }
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            setSpouseRemoving(false);
            toastr.error(err?.response?.data || Messages.GenericError);
          }
        });
    }
  };
  const onSubmitProcessingEmail = async () => {
    const isValid = await checkSubmitToProcessingValidations();
    if (!isValid) {
      return;
    }
    const result = await confirm({
      title: "Correct Credit Agent?",
      message:
        "Have you selected the correct agent for this client's program, currently set to (" +
        formData?.agent?.fullName +
        ")?",
      confirmText: "Yes, Confirmed!",
      confirmColor: "primary",
      cancelText: "Change",
    });
    if (!result) {
      if (props?.onTabChange) {
        props?.onTabChange(3);
        window.scrollBy(0, 600);
      }
      return;
    }
    setSendingProcessing(true);
    const msg =
      "There was an issue with your submission. The reason is because there is no Company Agent named Client Service in the portal. Please contact support to resolve this issue.";
    props
      ?.submitToProcessing(formData?.id, axiosSource)
      .then((result: any) => {
        setSendingProcessing(false);
        if (result) {
          props.onReloadCustomer();
          toastr.success("Submit To Processing email sent successfully!!");
        } else {
          toastr.error(msg);
        }
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setSendingProcessing(false);
          toastr.error(msg);
        }
      });
  };
  const BodyMesage = () => (
    <div className="">
      The following fields are required to enroll your client for service:
      <div className="text-danger">
        <span>First Name</span>,&nbsp;
        <span>Last Name</span>,&nbsp;
        <span>Email</span>,&nbsp;
        <span>Phone</span>,&nbsp;
        <span>Address</span>,&nbsp;
        <span>DOB</span>,&nbsp;
        <span>SSN</span>
      </div>
    </div>
  );
  const checkSubmitToProcessingValidations = async () => {
    let isValid = false;
    if (
      props?.customer?.firstName &&
      props?.customer?.lastName &&
      props?.customer?.email &&
      props?.customer?.cellPhone &&
      props?.customer?.streetAddress &&
      props?.customer?.ssn &&
      props?.customer?.dateOfBirth
    ) {
      isValid = true;
    } else {
      isValid = false;
      await confirm({
        title: "Data Missing!",
        bodyComponent: BodyMesage,
        confirmText: "OK",
        confirmColor: "primary",
        cancelText: null,
      });
    }
    return isValid;
  };
  return !redirectToNewPage ? (
    <div className="tab-personal-details">
      {(!props?.addMode ? !!props?.customer : true) && (
        <DashboardWidget
          title={"Personal Details"}
          allowFullscreen={true}
          allowMaximize={true}
          allowMinimize={true}
          reload={false}
        >
          <form className="top-form">
            <div className="row">
              <div className="col-6 col-sm-3">
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
              <div className="col-6 col-sm-3">
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
              <div className="col-6 col-sm-3">
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
              <div className="col-6 col-sm-3">
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
              {!AuthService.isFieldHidden(props.AuthRules, "SSN") && (
                <div className="col-6 col-sm-3">
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
                      mask={showLast4SSNDigits ? "999-99-9999" : "999-99-XXXX"}
                      maskChar="_"
                    />
                  </div>
                </div>
              )}
              {!AuthService.isFieldHidden(props.AuthRules, "DOB") && (
                <div className="col-6 col-sm-3">
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
              <div className="col-6 col-sm-3">
                <div className="form-group">
                  <label>Spouse Detail</label>
                  {!spouse ? (
                    <div>
                      <span
                        className="text-danger change-button f-12 font-weight-bold"
                        onClick={() => setSpouseModalClose(true)}
                      >
                        Set Spouse
                      </span>
                    </div>
                  ) : (
                    <div className="spouse-name d-flex justify-content-between pt-1 align-items-center">
                      <span className="text-danger f-12 font-weight-bold">
                        <Link
                          to={ClientRoutesConstants.customers + "/" + spouse.id}
                        >
                          {spouse?.fullName}
                        </Link>
                      </span>
                      <span className="position-relative">
                        {spouseRemoving ? (
                          <Spinner size="sm" />
                        ) : (
                          <i
                            title="Remove Spouse"
                            className="fa fa-trash pointer"
                            onClick={onSpouseRemove}
                          ></i>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-6 col-sm-3">
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
                            {d?.description}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="form-group">
                  <label>Address Type</label>
                  <div className="input-group">
                    <select
                      value={formData?.secondaryAddress || ""}
                      onChange={handleChange}
                      className="form-control input-sm"
                      name="secondaryAddress"
                      required={true}
                    >
                      <option>- Select -</option>
                      <option value="Apt.#">Apartment #</option>
                      <option value="Suite#">Suite #</option>
                    </select>
                    <input
                      value={formData?.apartmentNumber || ""}
                      onChange={handleChange}
                      type="text"
                      name="apartmentNumber"
                      className="form-control input-sm"
                      placeholder="Aprt./Suite no."
                    />
                  </div>
                </div>
              </div>
              <div className="col-6 col-sm-3">
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
              <div className="col-6 col-sm-3">
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
              <div className="col-6 col-sm-3">
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
              <div className="col-6 col-sm-3">
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
              <div className="col-6 col-sm-3">
                <div className="form-group">
                  <label>Previous Address</label>
                  <textarea
                    value={formData?.address2 || ""}
                    onChange={handleChange}
                    name="address2"
                    className="form-control"
                    placeholder="Previous Address"
                    required={true}
                  ></textarea>
                </div>
              </div>
              <div className="col-6 col-sm-3">
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
              <div className="col-6 col-sm-3">
                <div className="form-group">
                  <label>Cell Phone</label>
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
              {!AuthService.isFieldHidden(
                props.AuthRules,
                "ProcessingStatus"
              ) && (
                <div className="col-6 col-sm-3">
                  <div className="form-group">
                    <label className="text-orange-red">
                      Processing Status*
                    </label>
                    <select
                      disabled={AuthService.isFieldReadOnly(
                        props.AuthRules,
                        "ProcessingStatus"
                      )}
                      value={formData?.transactionType || ""}
                      onChange={handleChange}
                      name="transactionType"
                      className="form-control input-sm"
                      required={true}
                    >
                      {props?.addMode && <option value={""}>-Select-</option>}
                      <option value={"Active"}>Active</option>
                      {CommonUtils.ProcessingStatus()?.map(
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
              {!AuthService.isFieldHidden(
                props.AuthRules,
                "ProcessingType"
              ) && (
                <div className="col-6 col-sm-3">
                  <div className="form-group">
                    <label>Processing Type</label>
                    <select
                      disabled={AuthService.isFieldReadOnly(
                        props.AuthRules,
                        "ProcessingType"
                      )}
                      value={formData?.processingType || ""}
                      onChange={handleChange}
                      name="processingType"
                      className="form-control input-sm"
                      required={true}
                    >
                      <option value={""}>- Select -</option>
                      {CommonUtils.ProcessingTypes()?.map((item, index) => (
                        <option key={index} value={item?.value}>
                          {item?.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {!AuthService.isFieldHidden(props.AuthRules, "CreditCard") && (
                <>
                  <div className="col-6 col-sm-3">
                    <div className="form-group">
                      <label>Credit Card Type</label>
                      <select
                        disabled={AuthService.isFieldReadOnly(
                          props.AuthRules,
                          "CreditCard"
                        )}
                        value={formData?.creditCardType || ""}
                        onChange={handleChange}
                        name="creditCardType"
                        className="form-control input-sm"
                        required={true}
                      >
                        <option value={""}>- Select -</option>
                        {CommonUtils.CardTypes()?.map((item, index) => (
                          <option key={index} value={item?.value}>
                            {item?.text}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="form-group">
                      <label>Card Number</label>
                      <InputMask
                        disabled={AuthService.isFieldReadOnly(
                          props.AuthRules,
                          "CreditCard"
                        )}
                        name="creditCardNumber"
                        mask={ccMask}
                        value={ccValue || ""}
                        type="text"
                        onChange={(e) => {
                          CCChange(e);
                          handleChange(e);
                        }}
                        className="form-control"
                        placeholder="____-____-____-____"
                        required={true}
                      />
                    </div>
                  </div>
                </>
              )}
              {!AuthService.isFieldHidden(props.AuthRules, "CreditCard") && (
                <div className="col-6 col-sm-3">
                  <div className="form-group">
                    <label>Credit Card Expiration Date:</label>
                    <div className="input-group">
                      <select
                        disabled={AuthService.isFieldReadOnly(
                          props.AuthRules,
                          "CreditCard"
                        )}
                        value={ccEXPMonth || ""}
                        onChange={(e) => setccEXPMonth(e.target.value)}
                        name="setexp"
                        className="form-control input-sm"
                        required={true}
                      >
                        <option value={""}>- Month -</option>
                        {months.map((month: IDropdown) => {
                          return (
                            <option
                              key={month?.abbreviation}
                              value={month?.abbreviation}
                            >
                              {month?.name}
                            </option>
                          );
                        })}
                      </select>
                      <select
                        disabled={AuthService.isFieldReadOnly(
                          props.AuthRules,
                          "CreditCard"
                        )}
                        value={ccEXPYear || ""}
                        onChange={(e) => setccEXPYear(e.target.value)}
                        name="ccExpYear"
                        className="form-control input-sm"
                        required={true}
                      >
                        <option value={""}>- Year -</option>
                        {expirationYears.map((year: IDropdown) => {
                          return (
                            <option
                              key={year?.abbreviation}
                              value={year?.abbreviation}
                            >
                              {year?.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {!AuthService.isFieldHidden(props.AuthRules, "BankName") && (
                <div className="col-6 col-sm-3">
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      disabled={AuthService.isFieldReadOnly(
                        props.AuthRules,
                        "BankName"
                      )}
                      value={formData?.bankName || ""}
                      onChange={handleChange}
                      type="text"
                      name="bankName"
                      className="form-control"
                      placeholder="Bank Name"
                      required={true}
                    />
                  </div>
                </div>
              )}
              {!AuthService.isFieldHidden(props.AuthRules, "RoutingNumber") && (
                <div className="col-6 col-sm-3">
                  <div className="form-group">
                    <label>Routing Number</label>
                    <input
                      disabled={AuthService.isFieldReadOnly(
                        props.AuthRules,
                        "RoutingNumber"
                      )}
                      value={formData?.bankRoutingNumber || ""}
                      onChange={handleChange}
                      type="text"
                      name="bankRoutingNumber"
                      className="form-control"
                      placeholder="Routing Number"
                      required={true}
                    />
                  </div>
                </div>
              )}
              {!AuthService.isFieldHidden(props.AuthRules, "AccountNumber") && (
                <div className="col-6 col-sm-3">
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      disabled={AuthService.isFieldReadOnly(
                        props.AuthRules,
                        "AccountNumber"
                      )}
                      value={formData?.bankAccountNumber || ""}
                      onChange={handleChange}
                      type="text"
                      name="bankAccountNumber"
                      className="form-control"
                      placeholder="Account Number"
                      required={true}
                    />
                  </div>
                </div>
              )}
            </div>
            {!props?.addMode && (
              <div className="row mb-3 mt-2">
                <div className="col-12">&nbsp;</div>
                <div className="col-12 col-sm-3">
                  {!AuthService.isFieldHidden(
                    props.AuthRules,
                    "ResendWelcomeEmail"
                  ) && (
                    <ButtonComponent
                      text="Resend Welcome Email"
                      className="w-100 btn-secondary"
                      loading={resendMailing}
                      onClick={onResendWelcomeEmail}
                    >
                      <i className="fa fa-retweet mr-2"></i>
                    </ButtonComponent>
                  )}
                </div>
                <div className="col-12 col-sm-3">
                  {!AuthService.isFieldHidden(
                    props.AuthRules,
                    "SendPOREmail"
                  ) && (
                    <ButtonComponent
                      text="Send POR needed Email"
                      className="w-100 btn-secondary ml-sm-2 mt-1 mt-sm-0"
                      loading={sendPOR}
                      onClick={onPORNeedeEmail}
                    >
                      <i className="fa fa-envelope mr-2"></i>
                    </ButtonComponent>
                  )}
                </div>
                <div className="col-12 col-sm-3">
                  {isSiteOutsourced &&
                    !AuthService.isFieldHidden(
                      props.AuthRules,
                      "SubmitToProcessing"
                    ) && (
                      <div>
                        <ButtonComponent
                          text="Enroll Client"
                          className="w-100 btn-secondary ml-sm-2 mt-1 mt-sm-0"
                          loading={sendingProcessing}
                          disabled={
                            isAdmin ? false : !!formData?.isSubmitToProcessing
                          }
                          onClick={onSubmitProcessingEmail}
                        >
                          <i className="fa fa-tasks mr-2"></i>
                        </ButtonComponent>
                        {!!formData?.submitToProcessingBy && (
                          <div className="d-flex f-10 text-success ml-sm-2">
                            <span className="mr-2">
                              {formData?.submitToProcessingBy}
                            </span>
                            <span>
                              at{" "}
                              {moment(formData?.submitToProcessingOn).format(
                                "MM/DD/YYYY h:mm a"
                              )}
                            </span>{" "}
                          </div>
                        )}
                      </div>
                    )}
                </div>
                {!AuthService.isFieldHidden(props.AuthRules, "SaveButton") && (
                  <div className="col-12 col-sm-3 text-sm-right mt-2 mt-sm-0">
                    <ButtonComponent
                      text="Save Details"
                      className="btn-primary  w-100 w-sm-auto"
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
        <div className="row mb-3 mt-2">
          <div className="col-12">
            <CustomerContactDetailsComponent
              onFranchiseSelect={(e: any) => setFranchise(e)}
              onReferralSelect={(e: any) => setReferral(e)}
              addMode={props?.addMode}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 text-right mt-4">
            <ButtonComponent
              text="Save Details"
              className="btn-primary w-100 w-sm-auto"
              loading={isUpdating}
              onClick={onAddUpdate}
            >
              <i className="fa fa-floppy-o mr-2"></i>
            </ButtonComponent>
          </div>
        </div>
      )}
      <ModalComponent
        title={
          props?.addMode
            ? "Select Spouse"
            : "Select Spouse for " + props?.customer?.fullName
        }
        isVisible={spouseModalClose}
        onClose={() => setSpouseModalClose(false)}
      >
        <SelectCustomerComponent
          onSelect={(s: any) => setSpouse(s)}
          onClose={() => setSpouseModalClose(false)}
        />
      </ModalComponent>
    </div>
  ) : (
    <Redirect to={ClientRoutesConstants.customers + "/" + formData?.id} />
  );
});
