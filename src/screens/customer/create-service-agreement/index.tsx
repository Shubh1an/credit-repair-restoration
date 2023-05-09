import React, { useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import { ButtonComponent } from "../../../shared/components/button";
import SelectSearch from "../../../shared/components/SearchSelect";
import {
  getAllServiceAgreementTemplateList,
  deleteEmailTemplate,
  createServiceAgreement,
} from "../../../actions/service-agreement.actions";
import { ClientRoutesConstants, Messages } from "../../../shared/constants";
import { connect } from "react-redux";
import axios from "axios";
import { ServiceTempLetters } from "../../../models/interfaces/email-letters";
import { ModalComponent } from "../../../shared/components/modal";
import { HTMlTextAreaEditor } from "../../../shared/components/html-editor-textarea";
import toastr from "toastr";
import { Spinner } from "reactstrap";
type Props = {};
const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getAllServiceAgreementTemplateList,
      createServiceAgreement,
    },
    dispatch
  );
};
const mapStateToProps = (state: any) => {
  return {
    currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens,
  };
};
export const ServiceAgreementEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  (props: {
    // letterId?: string;
    agreementObject: any;
    getAllServiceAgreementTemplateList: any;
    setOpenEditor: any;
    createServiceAgreement: any;
    membershipId: any;
    customerId: any;
  }) => {
    const [agreement, setAgreement] = useState<any>({});
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [html, setHtml] = useState<string>("");
    const [agreementTemplate, setAgreementTemplate] = useState(
      [] as ServiceTempLetters[]
    );
    const [axiosSource] = useState(axios.CancelToken.source());
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (evt: any) => {
      console.log("evt", evt);
      let name = evt?.target?.name || evt?.name;

      let value = evt?.target?.value || evt?.value;
      setAgreement({ ...agreement, [name]: value });
      if (evt?.name === "template") {
        console.log("if called");
        setHtml(evt?.value);
      }
    };
    const onHTMLSave = (html: string) => {
      toastr.success("Agreement Updated successfully!!");
      setHtml(html);
      setShowModal(false);
    };

    const loadServiceAgreements = () => {
      setIsLoading(true);
      props
        .getAllServiceAgreementTemplateList(axiosSource)
        .then((data: ServiceTempLetters[]) => {
          setIsLoading(false);
          let ModifiedArr: any = data.map((item: any) => {
            return {
              id: item?.id,
              label: item?.name,
              name: "template",
              value: item?.template,
            };
          });
          setAgreementTemplate(ModifiedArr);
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            setAgreementTemplate([]);
            setIsLoading(false);
          }
        });
    };
    useEffect(() => {
      loadServiceAgreements();

      return () => {
        axiosSource.cancel(Messages.APIAborted);
      };
    }, []);
    const onSave = async () => {
      let fromData: any = {
        userId: props.membershipId,
        name: agreement?.name,
        template: agreement?.template,
      };
      {
      }
      console.log("formData=>>>>>>>>>>>>", fromData);
      for (let key in fromData) {
        if (!fromData[key]) {
          return toastr.error(`Please fill ${key}`);
        }
      }
      console.log("runnnn");
      setLoading(true);
      let res = await props.createServiceAgreement(fromData);
      toastr.success(res?.message);
      if (res) {
        setLoading(false);
      }

      props.setOpenEditor(false);
    };
    return (
      <div
        style={{ height: "300px" }}
        className="letter-editor  position-relative"
      >
        <div className="row">
          <div className="col-6 col-sm-5">
            <div className="form-group">
              <label className="text-orange-red">Name*</label>
              <input
                value={agreement?.name || ""}
                onChange={handleChange}
                type="text"
                name="name"
                className="form-control"
                placeholder="Letter Name"
                required={true}
              />
            </div>
          </div>
          <div className="col-6 col-sm-5">
            <div className="form-group">
              <label className="text-orange-red">Template*</label>

              <SelectSearch
                name="id"
                // value={getContact(formData?.to?.id)}
                value={agreementTemplate.find(function (option: any) {
                  if (agreement?.id) {
                    return option.id === agreement?.id;
                  } else return false;
                })}
                options={agreementTemplate}
                onChange={(data: any) => handleChange(data)}
              />
            </div>
          </div>
        </div>
        <ModalComponent
          title={"Service Agreement"}
          isVisible={showModal}
          onClose={() => {
            setShowModal(false);
          }}
        >
          <p dangerouslySetInnerHTML={{ __html: html }} />
          {/* {showModal && (
            <HTMlTextAreaEditor
              html={html}
              onSave={onHTMLSave}
              disableEdit={true}
            />
          )} */}
        </ModalComponent>
        <ButtonComponent
          text={<span className="login-text">View Agreement</span>}
          className="btn-secondary  mt-2 mt-sm-0 ml-sm-3 w-100 w-sm-auto"
          loading={isLoading}
          disabled={!html}
          onClick={() => setShowModal(true)}
        >
          <i className="fa fa-floppy-o mr-2"></i>
        </ButtonComponent>
        <ButtonComponent
          text={<span className="login-text">Create Agreement</span>}
          className="btn-primary  mt-2 mt-sm-0 ml-sm-3 w-100 w-sm-auto"
          loading={isLoading}
          onClick={onSave}
        >
          <i className="fa fa-floppy-o mr-2"></i>
        </ButtonComponent>
        <div className={"card-body position-relative "}>
          {loading && (
            <div className="section-spinner">
              <Spinner size="md" color="secondary" />
            </div>
          )}
        </div>
      </div>
    );
  }
);
