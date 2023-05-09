import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import axios from "axios";
// @ts-ignore
import confirm from "reactstrap-confirm";
import toastr from "toastr";

import "./list.scss";
import { EnumScreens } from "../../../../models/enums";
import { ClientRoutesConstants, Messages } from "../../../../shared/constants";
import { DashboardWidget } from "../../../dashboard/components/dashboard-widget";
import { withAuthorize } from "../../../../shared/hoc/authorize";
// import {
//   getAllServiceAgreeementsList,
//   deleteEmailTemplate,
// } from "../../../../actions/email-templates.actions";
import {
  getAllServiceAgreementTemplateList,
  deleteEmailTemplate,
} from "../../../../actions/service-agreement.actions";
import { ButtonComponent } from "../../../../shared/components/button";
import {
  IEmailLetters,
  ServiceTempLetters,
} from "../../../../models/interfaces/email-letters";
import { ModalComponent } from "../../../../shared/components/modal";
import { OfcServiceTemplateEditor } from "./ofc-service-template-editor";
import { ServiceTemplateEditor } from "./service-template-editor";

const ServiceTemplateListComponent: React.FC<any> = (props: {
  match: { path: string; params?: { id?: string } };
  auth: any;
  getAllServiceAgreementTemplateList: any;
  deleteEmailTemplate: any;
  history: any;
  currentAccessibleScreens: string[];
}) => {
  const [letters, setLetters] = useState([] as ServiceTempLetters[]);
  const [activeLetter, setActiveLetter] = useState(
    null as ServiceTempLetters | null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [axiosSource] = useState(axios.CancelToken.source());
  const [openEditor, setOpenEditor] = useState(false);
  const { id: routeLetterId }: any = useParams();
  useEffect(() => {
    loadServiceAgreements();
    if (routeLetterId) {
      onEdit({ id: routeLetterId });
      props.history.push(ClientRoutesConstants.serviceTemplates);
    }
    return () => {
      axiosSource.cancel(Messages.APIAborted);
    };
  }, []);

  const loadServiceAgreements = () => {
    setIsLoading(true);
    props
      .getAllServiceAgreementTemplateList(axiosSource)
      .then((data: ServiceTempLetters[]) => {
        setIsLoading(false);
        setLetters(data);
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setLetters([]);
          setIsLoading(false);
        }
      });
  };

  const onListReload = () => {
    loadServiceAgreements();
  };
  const onDelete = async (letter: ServiceTempLetters) => {
    setActiveLetter(letter);
    let result = await confirm({
      title: "Remove Email Template?",
      message: "Are you sure you want to remove this Email Template?",
      confirmText: "YES",
      confirmColor: "danger",
      cancelColor: "link text-secondary",
    });
    if (result) {
      setActiveLetter(letter);
      setIsLoading(true);
      props
        ?.deleteEmailTemplate(letter?.id, axiosSource)
        .then((result: any) => {
          setIsLoading(false);
          toastr.success(result);
          setLetters(letters?.filter((x) => x?.id !== letter?.id));
          setActiveLetter(null);
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            setActiveLetter(null);
            setIsLoading(false);
            toastr.error(err?.response?.data || Messages.GenericError);
          }
        });
    }
  };
  const onEdit = (letter: ServiceTempLetters) => {
    console.log(letter, "letter->>>>>");
    // debugger
    setActiveLetter(letter);
    setOpenEditor(true);
  };
  const onEditCopy = (letter: ServiceTempLetters) => {
    const copyLetter = JSON.parse(JSON.stringify(letter)) as ServiceTempLetters;
    copyLetter.name = "Copy Of " + copyLetter?.name;
    copyLetter.id = "";
    setActiveLetter(copyLetter);
    setOpenEditor(true);
  };

  return (
    <div className="customers-list lead-list">
      <section className="content-header">
        <div className="header-icon">
          <i className="fa fa-envelope"></i>
        </div>
        <div className="header-title">
          <h1>Service Agreement Templates</h1>
          <small className="mt-1">
            The list below shows all of the letter templates that can be used by
            agents when creating letters on the Client page. You may change,
            copy or delete any letter by clicking the appropriate icon next to
            the letter you want to work with.
          </small>
        </div>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-12 pinpin customer-grid lead-grid">
            <DashboardWidget
              title={
                <>
                  Agreements
                  {/* {!isLoading && (
                    <span className="records pull-right mr-3">
                      {" "}
                      Showing {letters?.length} Records
                    </span>
                  )} */}
                </>
              }
              reloadHandler={onListReload}
              isLoading={isLoading}
              allowFullscreen={true}
              allowMaximize={true}
              allowMinimize={true}
              reload={true}
            >
              <div className="d-flex justify-content-end">
                <ButtonComponent
                  text="Add New Service Template"
                  className="btn-success mr-1 mb-2 mt-3"
                  onClick={() => {
                    setOpenEditor(true);
                    setActiveLetter(null);
                  }}
                >
                  <i className="fa fa-plus mr-2"></i>
                </ButtonComponent>
              </div>
              <div
                style={{ minHeight: "400px" }}
                className="table-responsive list-scrollable custom-scrollbar"
              >
                <table className="dataTableCustomers table table-striped table-hover">
                  <thead className="back_table_color">
                    <tr className={"secondary"}>
                      <th style={{ width: "45%" }}>Letter Name</th>
                      <th style={{ width: "20%" }} className="text-center">
                        Letter Type
                      </th>
                      <th style={{ width: "15%" }} className="text-center">
                        Letter Source
                      </th>
                      <th style={{ width: "10%" }} className="text-center">
                        Round
                      </th>
                      <th style={{ width: "10%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {letters?.map((letter: IEmailLetters, index: number) => {
                      return (
                        <tr key={letter.id}>
                          <td>{letter?.name}</td>
                          <td className="text-center">
                            {letter?.letterType?.type}
                          </td>
                          <td className="text-center">
                            {letter?.bureau?.value}
                          </td>
                          <td className="text-center">
                            {letter?.scoringRound && letter?.scoringRound > 0
                              ? letter?.scoringRound
                              : "All"}
                          </td>
                          <td className="text-center">
                            <Button
                              color="link btn-sm pl-2 pr-2 text-dark hover-zoom"
                              onClick={() => onEdit(letter)}
                            >
                              <i className="fa fa-pencil"></i>
                            </Button>
                            <Button
                              color="link btn-sm pl-2 pr-2 mr-2 text-dark hover-zoom"
                              onClick={() => onEditCopy(letter)}
                            >
                              <i className="fa fa-clone"></i>
                            </Button>
                            <Button
                              color="danger btn-sm pl-2 pr-2 hover-zoom"
                              onClick={() => onDelete(letter)}
                            >
                              <i className="fa fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {isLoading && (
                      <tr>
                        <td colSpan={5}>
                          <div style={{ minHeight: "400px" }}></div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </DashboardWidget>
          </div>
        </div>
      </section>
      <ModalComponent
        title={`${activeLetter?.id ? "Edit" : "Add"} Service Template`}
        fullscreen={true}
        isVisible={openEditor}
        onClose={() => setOpenEditor(false)}
      >
        {openEditor && (
          <ServiceTemplateEditor
            onSave={() => {
              setOpenEditor(false);
              onListReload();
            }}
            // letterId={activeLetter?.id}
            letterObject={activeLetter}
          />
        )}
      </ModalComponent>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getAllServiceAgreementTemplateList,

      deleteEmailTemplate,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthorize(ServiceTemplateListComponent, EnumScreens.ServiceTemplates));
