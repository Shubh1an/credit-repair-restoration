import React, { useEffect, useState } from "react";
// @ts-ignore
// import Editor from 'custom-ckeditor5/build/ckeditor';
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
// @ts-ignore
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios, { CancelTokenSource } from "axios";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
} from "reactstrap";
import { asyncComponent } from "./async-component";
import { ButtonComponent } from "./button";
import { ModalComponent } from "./modal";
import { HTMlTextAreaEditor } from "./html-editor-textarea";
import { INameValueSmall } from "../../models/interfaces/shared";
import { SearchCustomersComponent } from "./search-customers";
import { AutoCompleteSearchTypes } from "../../models/enums";
import { ICustomerShort } from "../../models/interfaces/customer-view";

import {
  serviceTemplateGenerateHTMLPreview,
  GetServiceAgreementSavedSampleTemplates,
} from "../../actions/service-agreement.actions";
const AsyncHTMLEditorTokenWizardComponent = asyncComponent(
  () => import("./html-editor-token-wizard")
);

const colorCodes = [
  { color: "#000000", label: "Black" },
  { color: "#FF0000", label: "Red" },
  {
    color: "#00FF00",
    label: "Green",
  },
  { color: "#cac407", label: "Yellow" },
  { color: "#FFA500", label: "Orange" },
  {
    color: "#CCCCCC",
    label: "Grey",
  },
  { color: "#FFFFFF", label: "White", hasBorder: true },
  {
    color: "#0000FF",
    label: "Blue",
  },
];
const collectionTypeTokens = [
  "Addresses",
  "Names",
  "Accounts",
  "Inquiries",
  "Letter Names",
];
const ServiceHTMLEditor = (props: {
  allowHTMLEdit: boolean;
  isLoading: boolean;
  onSave: any;
  content?: string;
  isSaveDisabled?: boolean;
  onChange?: (data: any) => string;
  fieldsTokens: INameValueSmall[];
  allowAddFieldTokens?: boolean;
  allowPreview?: boolean;
  serviceTemplateGenerateHTMLPreview: any;
  hideSaveButton?: boolean;
  allowSampleDownload?: boolean;
  sampleName?: string;
  GetServiceAgreementSavedSampleTemplates: any;
}) => {
  const [html, setHTML] = useState<any>(props?.content);
  const [previewHTML, setPreviewHTML] = useState(props?.content);
  const [showModal, setShowModal] = useState(false as boolean);
  const [showingPreview, setShowingPreview] = useState(false as boolean);
  const [creatingPreview, setCreatingPreview] = useState(false as boolean);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenPreview, setDropdownOpenPreview] = useState(false);
  const [downloadSample, setDownloadSample] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null as any);
  const [selectedField, setSelectedField] = useState("" as string);
  const [showingFieldsWizard, setShowingFieldsWizard] = useState(
    false as boolean
  );
  const [startEditor, setStartEditor] = useState<boolean>(false);
  const [axiosSource] = useState(
    axios.CancelToken.source() as CancelTokenSource
  );

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const togglePreview = () => setDropdownOpenPreview((prevState) => !prevState);

  useEffect(() => {
    setHTML(props?.content);
  }, [props?.content]);

  const onHTMLSave = (newhtml: string | undefined, e?: any) => {
    e?.preventDefault();
    if (props?.onChange) {
      props.onChange(newhtml);

      // setHTML(newhtml);
    }
    setShowModal(false);
  };
  const onFieldTokenClick = (obj: INameValueSmall) => {
    setStartEditor(true);
    if (collectionTypeTokens.includes(obj.name)) {
      setShowingFieldsWizard(true);
      setSelectedField(obj.name);
    } else {
      editorInstance.model.change((writer: any) => {
        const insertPosition =
          editorInstance.model.document.selection.getFirstPosition();
        writer.insertText(obj?.value, insertPosition);
      });
    }
  };
  const onPreviewCustomerSelect = (val: any) => {
    togglePreview();
    getPreviewHTML(val);
  };
  const getPreviewHTML = (val: ICustomerShort) => {
    setCreatingPreview(true);
    props
      ?.serviceTemplateGenerateHTMLPreview(
        { customerId: val?.id, html },
        axiosSource
      )
      .then((htmlResult: string) => {
        setCreatingPreview(false);
        setPreviewHTML(htmlResult);
        setShowingPreview(true);
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setCreatingPreview(false);
        }
      });
  };
  const downloadSampleTemplates = () => {
    setDownloadSample(true);
    props
      ?.GetServiceAgreementSavedSampleTemplates(props?.sampleName, axiosSource)
      .then((newhtml: string) => {
        setDownloadSample(false);
        setHTML(newhtml);
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setDownloadSample(false);
        }
      });
  };
  const onFieldWizardSelect = (t: string) => {
    t = t.replace(/\<br \/\>/g, "\n");
    editorInstance.model.change((writer: any) => {
      const insertPosition =
        editorInstance.model.document.selection.getFirstPosition();
      writer.insertText(t, insertPosition);
    });
    setShowingFieldsWizard(false);
  };
  return (
    <div className="html-editor">
      <div className="d-flex flex-column flex-sm-row justify-content-between mb-2">
        <div className="d-flex flex-column flex-sm-row ">
          {props?.allowAddFieldTokens && (
            <div>
              <Dropdown
                size="sm"
                className="mr-2 mr-sm-4 w-100 w-sm-auto"
                isOpen={dropdownOpen}
                toggle={toggle}
                disabled={!props?.fieldsTokens?.length}
              >
                <DropdownToggle caret className=" w-100 w-sm-auto">
                  <span className="mr-1">
                    <i className="fa fa-plus mr-1"></i> Add Field
                  </span>
                </DropdownToggle>
                <DropdownMenu className="shadow rounded custom-dropdown-field custom-scrollbar  w-100 w-sm-auto">
                  {props?.fieldsTokens?.map((field: INameValueSmall) => (
                    <DropdownItem
                      key={field?.value}
                      className=" f-12 pl-3 pr-3 lh-12"
                      onClick={() => onFieldTokenClick(field)}
                    >
                      {field?.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
          {props?.allowPreview && (
            <div>
              <Dropdown
                size="sm"
                className="btn-primary rounded mr-2 mr-sm-4 w-100 w-sm-auto mt-1 mt-sm-0"
                isOpen={dropdownOpenPreview}
                toggle={togglePreview}
              >
                <DropdownToggle
                  caret={!creatingPreview}
                  className="btn-info  w-100 w-sm-auto "
                >
                  <span className="mr-1">
                    {creatingPreview ? (
                      <>
                        <Spinner size="sm mr-1" /> Generating Preview...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-play-circle mr-1"></i> Preview With
                      </>
                    )}
                  </span>
                </DropdownToggle>
                <DropdownMenu className="shadow rounded custom-dropdown-field-autosearch custom-scrollbar p-2 w-100 w-sm-400">
                  <SearchCustomersComponent
                    showSubmitArrow={false}
                    autoFocus={true}
                    searchTypes={AutoCompleteSearchTypes.CUSTOMER}
                    minSearchLength={3}
                    onSelectedData={onPreviewCustomerSelect}
                    placeholder="search clients ..."
                    defaultValue={""}
                  />
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
          {props?.allowHTMLEdit && (
            <ButtonComponent
              className="btn btn-dark btn-sm mr-sm-4 w-100 w-sm-auto mt-1 mt-sm-0"
              text="Show HTML"
              onClick={() => {
                setShowModal(true);
              }}
            >
              <i className="fa fa-code mr-2"></i>
            </ButtonComponent>
          )}
          {props?.allowSampleDownload && (
            <ButtonComponent
              loading={downloadSample}
              className="btn btn-light  mt-1 mt-sm-0 shadow btn-sm w-100 w-sm-auto"
              text="Get Sample"
              onClick={downloadSampleTemplates}
            >
              <i className="fa fa-download mr-2"></i>
            </ButtonComponent>
          )}
        </div>
        {!props?.hideSaveButton && (
          <div>
            <ButtonComponent
              text={<span className="login-text">Save Letter</span>}
              className="btn-primary  mt-2 mt-sm-0 ml-sm-3 w-100 w-sm-auto"
              loading={props?.isLoading}
              disabled={props?.isSaveDisabled}
              onClick={props?.onSave}
            >
              <i className="fa fa-floppy-o mr-2"></i>
            </ButtonComponent>
          </div>
        )}
      </div>
      <CKEditor
        id={"custom-ckeditor"}
        editor={ClassicEditor}
        initData={html}
        config={{
          fontColor: {
            colors: colorCodes,
          },
          fontBackgroundColor: {
            column: 3,
            colors: colorCodes,
          },
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "|",
              "alignment",
              "fontcolor",
              "fontbackgroundcolor",
              "fontsize",
              "fontfamily",
              "indent",
              "|",
              "blockQuote",
              "link",
              "numberedList",
              "bulletedList",
              "|",
              "|",
              "insertTable",
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "|",
              "undo",
              "redo",
              "wordcount",
              "|",
              "horizontalline",
            ],
            shouldNotGroupWhenFull: true,
          },
          link: {
            addTargetToExternalLinks: true,
          },
        }}
        onReady={(editor: any) => {
          setEditorInstance(editor);
          // console.log('Editor is ready to use!', editor);
        }}
        onChange={(event: any, editor: any) => {
          if (props?.onChange) {
            console.log("editor onChange->>>>>>>>>>", editor.getData());
            const data = editor.getData();
            props?.onChange(html + data);
          }
        }}
      />
      <ModalComponent
        title={"Edit HTML"}
        isVisible={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        {showModal && <HTMlTextAreaEditor html={html} onSave={onHTMLSave} />}
      </ModalComponent>
      <ModalComponent
        title={"Preview"}
        isVisible={showingPreview}
        onClose={() => {
          setShowingPreview(false);
        }}
      >
        <div
          className="full-html p-3"
          dangerouslySetInnerHTML={{ __html: previewHTML || "" }}
        ></div>
      </ModalComponent>
      <ModalComponent
        title={"Select Fields"}
        halfFullScreen={true}
        isVisible={showingFieldsWizard}
        onClose={() => {
          setShowingFieldsWizard(false);
        }}
      >
        {showingFieldsWizard && (
          <AsyncHTMLEditorTokenWizardComponent
            sectionType={selectedField}
            onSelect={onFieldWizardSelect}
          />
        )}
      </ModalComponent>
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      serviceTemplateGenerateHTMLPreview,
      GetServiceAgreementSavedSampleTemplates,
    },
    dispatch
  );
};
export default connect(null, mapDispatchToProps)(ServiceHTMLEditor);
