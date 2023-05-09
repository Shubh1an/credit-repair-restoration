import React, { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import toastr from "toastr";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import { asyncComponent } from "../../../../shared/components/async-component";
// import { Messages } from "../../../../shared/constants";
// import { IEmailLetters } from "../../../../models/interfaces/email-letters";

// import { IDataItem } from "../../../../models/interfaces/fast-edit-accounts";
// import { ILetterType } from "../../../../models/interfaces/create-letter";
// import { CommonUtils } from "../../../../utils/common-utils";
// import { INameValueSmall } from "../../../../models/interfaces/shared";
import SelectSearch from "../../../../../shared/components/SearchSelect";
import { asyncComponent } from "../../../../../shared/components/async-component";
import { HTMlTextAreaEditor } from "../../../../../shared/components/html-editor-textarea";
import { ModalComponent } from "../../../../../shared/components/modal";
import { ButtonComponent } from "../../../../../shared/components/button";
import {
  getAllPostGridContacts,
  getAllPostGridTemplates,
  createPostGridLetter,
} from "../../../../../actions/postgrid-templates.actions";
const AsyncHTMLEditor = asyncComponent(
  () => import("../../../../../shared/components/html-editor")
);

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getAllPostGridContacts,
      createPostGridLetter,
    },
    dispatch
  );
};
const mapStateToProps = (state: any) => {
  return {
    contactList: state?.postGridModel?.contactList,
    currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens,
  };
};
export const PostGridEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  (props: {
    // letterId?: string;
    letterObject: any;
    getAllPostGridContacts: any;
    createPostGridLetter: any;
    loadPostGridLetters: any;
    setOpenEditor: any;
    contactList: any;
    skip: any;
    pageSize: any;
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false as boolean);

    const [html, setHtml] = useState("" as string);
    const [formData, setFormData] = useState<any>({});
    const [axiosSource] = useState(
      axios.CancelToken.source() as CancelTokenSource
    );
    const onHTMLSave = (newhtml: string) => {
      setHtml(newhtml);
      setShowModal(false);
    };
    useEffect(() => {
      if (props.letterObject) {
      }
      //   if (props?.letterId) {
      //     getDetails(props?.letterId);
      //   } else {
      //     setLetter(props?.letterObject || {});
      //     setHtml(props?.letterObject?.template || "");
      //   }
      //   getBureaus();
      //   getLetterTypes();
      //   getFieldsTokens();
      //   return () => {
      //     if (axiosSource.cancel) {
      //       axiosSource.cancel(Messages.APIAborted);
      //     }
      //   };
      getContactList();
    }, []);
    const getContactList = async () => {
      const resp = await props.getAllPostGridContacts();
    };
    const handleChange = (evt: any) => {
      console.log("value->>>>>", evt);
      if (evt?.name === "to" || evt?.name === "from") {
        let value = evt?.data?.value;
        // getAllSuggestion(value);

        let contactObj = {
          addressLine1: value?.addressLine1,
          addressLine2: value?.addressLine2,
          city: value?.city,
          companyName: value?.companyName,
          firstName: value?.firstName,
        };
        return setFormData({
          ...formData,
          [evt?.name]: contactObj,
        });
      } else {
        const value = evt?.name ? evt?.value : evt.target.value;
        setFormData({
          ...formData,
          [evt.target.name]: value,
        });
      }
    };

    const onSave = () => {
      if (!formData?.to || !formData?.from) {
        return toastr.error("Please fill all Details");
      }
      let newFormData = {
        ...formData,
        html: `${html},${formData?.to?.firstName}`,
      };
      props.createPostGridLetter(newFormData).then(() => {
        props.loadPostGridLetters(props?.skip, props?.pageSize);
        props.setOpenEditor(false);
      });
    };

    const onChange = (html: string) => {
      setHtml(html);
    };
    // const handleChange = (evt: any) => {
    //   const value = evt.target.value;
    //   let newForm = (letter || {}) as IEmailLetters;
    //   let propNames = evt.target.name?.split(".");
    //   if (propNames?.length == 2) {
    //     newForm = {
    //       ...newForm,
    //       [propNames[0]]: {
    //         [propNames[1]]: value,
    //       },
    //     };
    //   } else if (propNames?.length == 1) {
    //     newForm = {
    //       ...newForm,
    //       [propNames[0]]: value,
    //     };
    //   }

    //   setLetter(newForm);
    // };
    console.log("html->>>>>>>>>>>>>>>>>", html);
    return (
      <div
        style={{ height: "300px" }}
        className="letter-editor  position-relative"
      >
        <div className="row">
          <div className="col-6 col-sm-5">
            <div className="form-group">
              <label className="text-orange-red">From Contact*</label>

              <SelectSearch
                name="from"
                value={props?.contactList?.find(function (option: any) {
                  if (formData?.from?.id) {
                    return option.id === formData?.from?.id;
                  } else return false;
                })}
                options={props?.contactList}
                onChange={(e: any) => handleChange({ name: "from", data: e })}
              />
            </div>
          </div>
          <div className="col-6 col-sm-5">
            <div className="form-group">
              <label className="text-orange-red">To Contact*</label>

              <SelectSearch
                name="to"
                // value={getContact(formData?.to?.id)}
                value={props?.contactList.find(function (option: any) {
                  if (formData?.to?.id) {
                    return option.id === formData?.to?.id;
                  } else return false;
                })}
                options={props?.contactList}
                onChange={(e: any) => handleChange({ name: "to", data: e })}
              />
            </div>
          </div>
        </div>
        <ButtonComponent
          className="btn btn-dark btn-sm mr-sm-4 w-100 w-sm-auto mt-1 mt-sm-0"
          text="Show HTML"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <i className="fa fa-code mr-2"></i>
        </ButtonComponent>
        <ModalComponent
          title={"add HTML"}
          isVisible={showModal}
          onClose={() => {
            setShowModal(false);
          }}
        >
          {showModal && <HTMlTextAreaEditor html={html} onSave={onHTMLSave} />}
        </ModalComponent>
        <ButtonComponent
          text={<span className="login-text">Save Letter</span>}
          className="btn-primary  mt-2 mt-sm-0 ml-sm-3 w-100 w-sm-auto"
          loading={isLoading}
          onClick={onSave}
        >
          <i className="fa fa-floppy-o mr-2"></i>
        </ButtonComponent>
      </div>
    );
  }
);
