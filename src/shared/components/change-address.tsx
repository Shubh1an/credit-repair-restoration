import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios, { CancelTokenSource } from "axios";
import React, { useEffect, useState } from "react";
import { ICollectorAddress } from "../../models/interfaces/fast-edit-accounts";
import { getStates } from "../../actions/customers.actions";
import { Messages } from "../constants";
import { IDropdown } from "../../models/interfaces/shared";
import { ButtonComponent } from "./button";
import AuthService from "../../core/services/auth.service";
import { updateCollectorAddress } from "../../actions/fast-edit.actions";
import { getAddress, getZipCode } from "../../core/services/address.validator";
import "../components/AddSuggestion.css";

const mapStateToProps = (state: any) => {
  return {
    states: state.customerViewModel?.states,
  };
};

const matDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getStates,
      updateCollectorAddress,
    },
    dispatch
  );
};

export const ChangeAddressComponent = connect(
  mapStateToProps,
  matDispatchToProps
)((props: any) => {
  const [formData, setFormData] = useState(
    props?.addressView as ICollectorAddress
  );
  const [axiosSource] = useState(
    axios.CancelToken.source() as CancelTokenSource
  );
  const [saving, setSaving] = useState(false);

  const [addSuggestion, setAddSuggestion] = useState([]);

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
      ["address"]: props.data,
      ["state"]: props.state,
      ["city"]: props.city,
      ["zip"]: props.pin,
    });
    setAddSuggestion([]);
  };

  const handleChange = (evt: any) => {
    const value = evt.target.value;
    if (evt.target.name == "address") {
      getAllSuggestion(value);
    }
    setFormData({
      ...formData,
      [evt.target.name]: value,
    });
  };
  const onSave = () => {
    setSaving(true);
    props
      ?.updateCollectorAddress(formData, axiosSource)
      .then(() => {
        setSaving(false);
        if (props.onSave) {
          props.onSave(true);
          props.onClose();
        }
      })
      .catch((e: any) => {
        if (!axios.isCancel(e)) {
          setSaving(false);
        }
      });
  };

  useEffect(() => {
    const payload = AuthService.getCurrentJWTPayload();
    if (!props?.states?.length) {
      props?.getStates(axiosSource);
    }
    setFormData({
      ...formData,
      modifierAgentId: payload.membershipId,
    });
    return () => {
      if (axiosSource?.cancel) axiosSource?.cancel(Messages.APIAborted);
    };
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <form className="form-horizontal">
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="control-label">
                  Creditor/Collector Name:
                </label>
                <span className="f-11"> {formData?.collectorName} </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 form-group">
                <label className="control-label">Address</label>
                <br />
                <textarea
                  value={formData?.address}
                  onChange={handleChange}
                  name="address"
                  className="form-control f-11"
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
            <div className="row">
              <div className="col-md-4 form-group">
                <label className="control-label">City</label>
                <input
                  type="text"
                  value={formData?.city}
                  onChange={handleChange}
                  name="city"
                  className="form-control f-11"
                  placeholder="City"
                  required={true}
                />
              </div>
              <div className="col-md-4 form-group">
                <label className="control-label">State</label>
                <div className="input-group">
                  <select
                    value={formData?.state || ""}
                    onChange={handleChange}
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
              <div className="col-md-4 form-group">
                <label className="control-label">Zip Code</label>
                <input
                  type="text"
                  value={formData?.zip}
                  onChange={handleChange}
                  name="zip"
                  className="form-control f-11"
                  placeholder="ZipCode"
                  required={true}
                />
              </div>
              <div className="col-md-12 form-group user-form-group">
                <div className="float-right">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm mr-2"
                    onClick={() => props.onClose()}
                  >
                    Cancel
                  </button>
                  <ButtonComponent
                    disabled={!props?.states?.length}
                    text="Save"
                    loading={saving}
                    className="btn-primary"
                    onClick={onSave}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
});
