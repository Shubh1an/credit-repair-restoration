import React, { useEffect, useRef, useState } from "react";
import { bindActionCreators } from "redux";
import AuthService from "../../../core/services/auth.service";
import { EnumScreens } from "../../../models/enums";
import { connect } from "react-redux";
import WebViewer from "@pdftron/webviewer";
import { withAuthorize } from "../../../shared/hoc/authorize";
import { Icon } from "../../../assets/img/Icon";
import SignatureCanvas from "react-signature-canvas";
import "./index.css";
import { HTMlTextAreaEditor } from "../../../shared/components/html-editor-textarea";
import { ButtonComponent } from "../../../shared/components/button";
import TLservice from "../../../core/service-interceptor";
import toastr from "toastr";
import {
  viewServiceAgreement,
  signServiceAgreement,
} from "../../../actions/service-agreement.actions";
import { useLocation } from "react-router-dom";

type Props = {};
const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      viewServiceAgreement,
      signServiceAgreement,
    },
    dispatch
  );
};

const mapStateToProps = (state: any) => {
  return {
    AuthRules: AuthService.getScreenOject(
      state.sharedModel?.AuthRules,
      EnumScreens.ViewServiceAgreement
    ),
  };
};
const ServiceAgreementViewComponent = (props: {
  // letterId?: string;
  viewServiceAgreement: any;
  signServiceAgreement: any;
}) => {
  const [htmlData, setHtmlData] = useState<any>();

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    getServiceAggr();
  }, []);
  const getServiceAggr = async () => {
    // const search = useLocation();
    let array = window.location.pathname.split("/");
    const res = await props.viewServiceAgreement(array[3]);
    if (res && !res?.isSigned) {
      const resIp = await TLservice.get("https://geolocation-db.com/json/");
      setFormData({
        ...formData,
        serviceagreementid: res?.id,
        template: res?.template,
        eSignedIPAddress: resIp.data.IPv4,
      });
    } else {
      toastr.success("Signature is Already Submitted");
    }
    setHtmlData(res);
  };
  //   useEffect(() => {
  //     WebViewer(
  //       {
  //         path: "/dist",
  //         initialDoc:
  //           "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  //       },
  //       viewerDiv.current as HTMLDivElement
  //     ).then((instance) => {
  //       const { documentViewer, annotationManager, Annotations } = instance.Core;
  //       const annotManager = documentViewer.getAnnotationManager();
  //       //   instance.UI.disableElements(["ribbons"]);
  //       instance.UI.setHeaderItems((header) => {
  //         header.push({
  //           type: "actionButton",
  //           img: "icon-header-zoom-in-line",
  //           title: "Action",
  //           onClick: async () => {
  //             // save the annotations
  //             console.log(
  //               await annotManager.exportAnnotations({
  //                 links: false,
  //                 widgets: false,
  //               })
  //             );
  //           },
  //         });
  //       });
  //       documentViewer.addEventListener("documentLoaded", async () => {
  //         const rectangleAnnot = new Annotations.RectangleAnnotation({
  //           PageNumber: 1,
  //           // values are in page coordinates with (0, 0) in the top left
  //           X: 100,
  //           Y: 150,
  //           Width: 200,
  //           Height: 50,
  //           Author: annotationManager.getCurrentUser(),
  //         });

  //         annotationManager.addAnnotation(rectangleAnnot);
  //         // need to draw the annotation otherwise it won't show up until the page is refreshed
  //         annotationManager.redrawAnnotation(rectangleAnnot);
  //         // let res = await annotManager.exportAnnotations({
  //         //   links: false,
  //         //   widgets: false,
  //         // });
  //         // console.log("from-manager", res);
  //       });
  //     });
  //   }, []);
  const viewerDiv = useRef<HTMLDivElement>(null);

  const sigRef = useRef<any>();
  const handleSignatureEnd = () => {
    setFormData({ ...formData, eSignatureBase64: sigRef.current.toDataURL() });
  };
  const clearSignature = () => {
    sigRef.current.clear();
    let formDataCopy = { ...formData };
    delete formDataCopy.eSignatureBase64;
    setFormData(formDataCopy);
  };
  const onHTMLSave = (html: string) => {
    console.log(html);
    // setHtml(html);
  };
  // const getData = async () => {
  //   const res = console.log(res.data);

  //   setFormData({ ...formData, eSignedIPAddress: res.data.IPv4 });
  // };
  const SubmitAgreement = async () => {
    let payload = {
      ...formData,
    };
    console.log("paylaod=>>>", payload);
    const res = await props?.signServiceAgreement(payload);
    if (res) {
      toastr.success(res?.message);
    }
    console.log(res);
  };
  return (
    <div className="px-2">
      <div className="d-flex align-items-center justify-content-between w-100 mt-3 mb-555555555555555555 px-3">
        <div className="header-title">
          <h3>View Service Agreement</h3>
        </div>
        {!htmlData?.isSigned && (
          <ButtonComponent
            text={<span className="login-text">Submit</span>}
            className="btn-primary  w-100 w-sm-auto "
            disabled={!formData?.eSignatureBase64}
            onClick={() => SubmitAgreement()}
          >
            <i className="fa fa-floppy-o mr-2"></i>
          </ButtonComponent>
        )}
      </div>
      <div className="mx-3 mt-5">
        {/* <HTMlTextAreaEditor html={html} onSave={onHTMLSave} /> */}
        <div dangerouslySetInnerHTML={{ __html: htmlData?.template }} />
      </div>
      <div className="col-lg-3 col-md-6  mx-auto d-flex flex-column justify-content-center align-items-center">
        <div>
          {!htmlData?.isSigned ? (
            <SignatureCanvas
              penColor="black"
              canvasProps={{ className: "signature bg-white mb-1 mt-3" }}
              ref={sigRef}
              onEnd={handleSignatureEnd}
            />
          ) : (
            <img src={htmlData?.eSignatureBase64} />
          )}
        </div>
        {!htmlData?.isSigned && (
          <button
            className="mx-auto btn btn-danger rounded my-2"
            onClick={clearSignature}
          >
            <small>Remove</small>
          </button>
        )}
      </div>
    </div>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withAuthorize(ServiceAgreementViewComponent, EnumScreens.ViewServiceAgreement)
);
