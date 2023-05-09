import axios, { CancelTokenSource } from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import confirm from "reactstrap-confirm";
import toastr from "toastr";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { ButtonComponent } from "../../../../../shared/components/button";
import { Checkbox } from "../../../../../shared/components/checkbox";
import {
  ClientRoutesConstants,
  Messages,
} from "../../../../../shared/constants";
import { CommonUtils } from "../../../../../utils/common-utils";
import { DashboardWidget } from "../../../../dashboard/components/dashboard-widget";
import { removeServiceAgreements } from "../../../../../actions/customers.actions";
import { LargeSpinner } from "../../../../../shared/components/large-spinner";
import { FileDownload } from "../../../../../shared/components/file-download";
import { EnumScreens } from "../../../../../models/enums";
import AuthService from "../../../../../core/services/auth.service";
import {
  IPDFAgreementLetters,
  IPDFDisputeLetters,
} from "../../../../../models/interfaces/create-letter";
import { getServiceAgreementLetters } from "../../../../../actions/create-letter.actions";
import { ModalComponent } from "../../../../../shared/components/modal";
import { ServiceAgreementEditor } from "../../../create-service-agreement";

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getServiceAgreementLetters,
    },
    dispatch
  );
};

const mapStateToProps = (state: any) => {
  return {
    AuthRules: AuthService.getScreenOject(
      state.sharedModel?.AuthRules,
      EnumScreens.CustomerDetails
    ),
  };
};

export const ServiceAgreementComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)((props: any) => {
  const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);
  const [delLoading, setDelLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [checkedCount, setcheckedCount] = useState(0);
  const [singleLoading, setSingleLoading] = useState(false);
  const [deletingId, setdeletingId] = useState("" as unknown | string);
  const [agreements, setAgreements] = useState([] as IPDFAgreementLetters[]);
  const [activeLetter, setActiveLetter] = useState<any>();
  const [openEditor, setOpenEditor] = useState(false);
  useEffect(() => {
    fetchServiceAgreement(props?.cid);
  }, [props?.cid]);
  const fetchServiceAgreement = (cid: string) => {
    setDataLoading(true);
    const src = axios.CancelToken.source();
    setAxiosSource(src);
    props
      ?.getServiceAgreementLetters(props?.membershipId, src)
      .then((result: any) => {
        setDataLoading(false);
        console.log(result);
        let modifiedLetters = result.map((x: IPDFAgreementLetters) => {
          return { ...x, checked: false };
        });
        setAgreements(modifiedLetters);
        setAllChecked(false);
        setcheckedCount(0);
      })
      .catch((e: any) => {
        if (!axios.isCancel(e)) {
          setDataLoading(false);
          setAgreements([]);
          setAllChecked(false);
          setcheckedCount(0);
        }
      });
  };
  const onAllChecked = (checked: boolean) => {
    setcheckedCount(checked ? agreements?.length : 0);
    setAgreements(
      agreements?.map((file: IPDFAgreementLetters) => {
        return {
          ...file,
          checked,
        };
      })
    );
  };
  const onDeleteAll = async () => {
    let result = await confirm({
      title: "Remove Multiple Letters",
      message:
        "Are you sure you want to remove selected " +
        (checkedCount === agreements?.length ? "All" : checkedCount) +
        " letter" +
        (checkedCount > 1 ? "s" : "") +
        "?",
      confirmText: "YES",
      confirmColor: "danger",
      cancelColor: "link text-secondary",
    });
    if (result) {
      const ids = agreements
        ?.filter((x) => x.checked)
        ?.map((x) => x.id)
        ?.join(",");
      if (!ids) {
        return;
      }
      setDelLoading(true);
      removeServiceAgreements(ids, axiosSource)
        .then((result: any) => {
          setDelLoading(false);
          toastr.success(
            checkedCount +
              " Letter" +
              (checkedCount > 1 ? "s" : "") +
              " deleted successfully!!"
          );
          fetchServiceAgreement(props?.cid);
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            setDelLoading(false);
            toastr.error(err?.response?.data || Messages.GenericError);
          }
        });
    }
  };

  const onDelete = async (file: IPDFAgreementLetters) => {
    let result = await confirm({
      title: "Remove Letter",
      message:
        "Are you sure you want to remove this " + file?.name + " Letter?",
      confirmText: "YES",
      confirmColor: "danger",
      cancelColor: "link text-secondary",
    });
    if (result) {
      setdeletingId(file?.id);
      setSingleLoading(true);
      await removeServiceAgreements(file?.id, axiosSource)
        .then((result: any) => {
          setSingleLoading(false);
          toastr.success(file?.name + " Letter removed successfully!!");
          fetchServiceAgreement(props?.membershipId);
          setdeletingId("");
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            setSingleLoading(false);
            toastr.error(err?.response?.data || Messages.GenericError);
          }
        });
    }
  };
  const onFileChecked = (file: IPDFAgreementLetters, checked: boolean) => {
    setcheckedCount(checked ? checkedCount + 1 : checkedCount - 1);
    if (!checked) {
      setAllChecked(false);
    }
    setAgreements(
      agreements?.map((f: IPDFAgreementLetters) => {
        return {
          ...f,
          checked: f.id === file.id ? checked : f.checked,
        };
      })
    );
  };
  return (
    <DashboardWidget
      title={"Service Agreement History"}
      allowFullscreen={true}
      allowMaximize={true}
      allowMinimize={true}
      reload={false}
    >
      <div className="files-list">
        {dataLoading && <LargeSpinner />}
        <div className="p-2">
          {checkedCount > 0 &&
            !AuthService.isFieldHidden(
              props.AuthRules,
              "RemoveDisputeLetter"
            ) && (
              <ButtonComponent
                disabled={AuthService.isFieldReadOnly(
                  props.AuthRules,
                  "RemoveDisputeLetter"
                )}
                text={"Delete " + `(${checkedCount})`}
                loading={delLoading}
                className="btn-danger pull-left"
                onClick={onDeleteAll}
              >
                <i className="fa fa-trash mr-2"></i>
              </ButtonComponent>
            )}
          {/* xc */}
          {!AuthService.isFieldHidden(
            props.AuthRules,
            "CreateServiceAgreement"
          ) &&
            !AuthService.isFieldReadOnly(
              props.AuthRules,
              "CreateServiceAgreement"
            ) && (
              <ButtonComponent
                text="Create Agreement"
                className="btn-success pull-right"
                onClick={() => {
                  setOpenEditor(true);
                }}
              >
                <i className="fa fa-file-pdf-o mr-2"></i>
              </ButtonComponent>
            )}
          <div className="clearfix"></div>
        </div>
        {!dataLoading && (
          <div className="table-responsive list-scrollable custom-scrollbar">
            <table className="dataTableCustomers table table-striped table-hover">
              <thead className="back_table_color">
                <tr className="secondary">
                  {/* <th style={{ width: "2%" }}>
                    {!!agreements?.length &&
                      !AuthService.isFieldHidden(
                        props.AuthRules,
                        "RemoveDisputeLetter"
                      ) && (
                        <Checkbox
                          text=""
                          checked={allChecked}
                          onChange={(data: any) => {
                            setAllChecked(data?.checked);
                            onAllChecked(data?.checked);
                          }}
                        />
                      )}
                  </th> */}
                  {/* <th style={{ width: "5%" }}>Download</th> */}
                  <th style={{ width: "20%" }}>Name</th>
                  <th style={{ width: "20%" }}>Signed</th>
                  <th style={{ width: "10%" }}>Date Entered</th>
                  <th style={{ width: "10%" }}>Date Signed</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {agreements?.length ? (
                  agreements?.map(
                    (file: IPDFAgreementLetters, index: number) => {
                      return (
                        <tr key={index}>
                          {/* <td>
                            {!AuthService.isFieldHidden(
                              props.AuthRules,
                              "RemoveDisputeLetter"
                            ) && (
                              <Checkbox
                                text=""
                                checked={!!file?.checked || false}
                                onChange={(data: any) =>
                                  onFileChecked(file, data?.checked)
                                }
                              />
                            )}
                          </td> */}
                          {/* <td>
                            {!AuthService.isFieldHidden(
                              props.AuthRules,
                              "DownloadDisputeLetter"
                            ) &&
                              !AuthService.isFieldReadOnly(
                                props.AuthRules,
                                "DownloadDisputeLetter"
                              ) && (
                                <FileDownload filePath={file?.pathLocation} />
                              )}
                          </td> */}
                          <td>{file?.name}</td>

                          <td>{file?.isSigned + ""}</td>

                          <td>
                            {moment(file?.dateEntered).format("MM/DD/YYYY")}
                          </td>
                          <td>
                            {/* <ol className="m-0 p-0 pl-2">
                              {file?.accounts?.map((x: string, ind: number) => {
                                return <li key={ind}>{x}</li>;
                              })}
                            </ol> */}
                            {moment(file?.eSignedDate).format("MM/DD/YYYY")}
                          </td>
                          <td className="position-relative">
                            {singleLoading && deletingId === file?.id ? (
                              <LargeSpinner className="small-spinner" />
                            ) : (
                              <>
                                {!file?.isSigned &&
                                  !AuthService.isFieldHidden(
                                    props.AuthRules,
                                    "RemoveDisputeLetter"
                                  ) &&
                                  !AuthService.isFieldReadOnly(
                                    props.AuthRules,
                                    "RemoveDisputeLetter"
                                  ) && (
                                    <i
                                      className="fa fa-trash text-danger f-15 pointer"
                                      title="remove"
                                      onClick={() => onDelete(file)}
                                    ></i>
                                  )}
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-danger"
                      style={{ height: "50px" }}
                    >
                      <i>No Service Agreements are available.</i>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ModalComponent
        title={`${activeLetter?.id ? "Edit" : "Add"} Service Agreement`}
        fullscreen={true}
        isVisible={openEditor}
        onClose={() => setOpenEditor(false)}
      >
        {openEditor && (
          <ServiceAgreementEditor
            setOpenEditor={setOpenEditor}
            // letterId={activeLetter?.id}
            agreementObject={activeLetter}
            customerId={props?.cid}
            membershipId={props?.membershipId}
          />
        )}
      </ModalComponent>
    </DashboardWidget>
  );
});
