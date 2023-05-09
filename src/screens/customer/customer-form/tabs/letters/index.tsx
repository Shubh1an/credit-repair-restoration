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
import { removeLetters } from "../../../../../actions/customers.actions";
import { LargeSpinner } from "../../../../../shared/components/large-spinner";
import { FileDownload } from "../../../../../shared/components/file-download";
import { EnumScreens } from "../../../../../models/enums";
import AuthService from "../../../../../core/services/auth.service";
import { IPDFDisputeLetters } from "../../../../../models/interfaces/create-letter";
import { getPDFDisputeLetters } from "../../../../../actions/create-letter.actions";

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getPDFDisputeLetters,
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

export const DisputeLettersComponent = connect(
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
  const [letters, setLetters] = useState([] as IPDFDisputeLetters[]);

  useEffect(() => {
    fetchDisputeLetters(props?.cid);
  }, [props?.cid]);
  const fetchDisputeLetters = (cid: string) => {
    setDataLoading(true);
    const src = axios.CancelToken.source();
    setAxiosSource(src);
    props
      ?.getPDFDisputeLetters(cid, src)
      .then((result: any) => {
        setDataLoading(false);
        setLetters(result);
        setAllChecked(false);
        setcheckedCount(0);
      })
      .catch((e: any) => {
        if (!axios.isCancel(e)) {
          setDataLoading(false);
          setLetters([]);
          setAllChecked(false);
          setcheckedCount(0);
        }
      });
  };
  const onAllChecked = (checked: boolean) => {
    setcheckedCount(checked ? letters?.length : 0);
    setLetters(
      letters?.map((file: IPDFDisputeLetters) => {
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
        (checkedCount === letters?.length ? "All" : checkedCount) +
        " letter" +
        (checkedCount > 1 ? "s" : "") +
        "?",
      confirmText: "YES",
      confirmColor: "danger",
      cancelColor: "link text-secondary",
    });
    if (result) {
      const ids = letters
        ?.filter((x) => x.checked)
        ?.map((x) => x.letterFileId)
        ?.join(",");
      if (!ids) {
        return;
      }
      setDelLoading(true);
      removeLetters(ids, axiosSource)
        .then((result: any) => {
          setDelLoading(false);
          toastr.success(
            checkedCount +
              " Letter" +
              (checkedCount > 1 ? "s" : "") +
              " deleted successfully!!"
          );
          fetchDisputeLetters(props?.cid);
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            setDelLoading(false);
            toastr.error(err?.response?.data || Messages.GenericError);
          }
        });
    }
  };
  const onDelete = async (file: IPDFDisputeLetters) => {
    let result = await confirm({
      title: "Remove Letter",
      message:
        "Are you sure you want to remove this " + file?.name + " Letter?",
      confirmText: "YES",
      confirmColor: "danger",
      cancelColor: "link text-secondary",
    });
    if (result) {
      setdeletingId(file?.letterFileId);
      setSingleLoading(true);
      await removeLetters(file?.letterFileId, axiosSource)
        .then((result: any) => {
          setSingleLoading(false);
          toastr.success(file?.name + " Letter removed successfully!!");
          fetchDisputeLetters(props?.cid);
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
  const onFileChecked = (file: IPDFDisputeLetters, checked: boolean) => {
    setcheckedCount(checked ? checkedCount + 1 : checkedCount - 1);
    if (!checked) {
      setAllChecked(false);
    }
    setLetters(
      letters?.map((f: IPDFDisputeLetters) => {
        return {
          ...f,
          checked: f.letterFileId === file.letterFileId ? checked : f.checked,
        };
      })
    );
  };
  return (
    <DashboardWidget
      title={"Dispute Letter History"}
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

          {!AuthService.isFieldHidden(props.AuthRules, "CreateDisputeLetter") &&
            !AuthService.isFieldReadOnly(
              props.AuthRules,
              "CreateDisputeLetter"
            ) && (
              <Link
                to={CommonUtils.replaceProps(
                  ClientRoutesConstants.createLetter,
                  { cid: props?.cid }
                )}
              >
                <ButtonComponent
                  text="Create Letters"
                  className="btn-success pull-right"
                  onClick={() => {}}
                >
                  <i className="fa fa-file-pdf-o mr-2"></i>
                </ButtonComponent>
              </Link>
            )}
          <div className="clearfix"></div>
        </div>
        {!dataLoading && (
          <div className="table-responsive list-scrollable custom-scrollbar">
            <table className="dataTableCustomers table table-striped table-hover">
              <thead className="back_table_color">
                <tr className="secondary">
                  <th style={{ width: "2%" }}>
                    {!!letters?.length &&
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
                  </th>
                  <th style={{ width: "5%" }}>Download</th>
                  <th style={{ width: "20%" }}>Name</th>
                  <th style={{ width: "20%" }}>Accounts</th>
                  <th style={{ width: "10%" }}>Type</th>
                  <th style={{ width: "10%" }}>Date Entered</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {letters?.length ? (
                  letters?.map((file: IPDFDisputeLetters, index: number) => {
                    return (
                      <tr key={index}>
                        <td>
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
                        </td>
                        <td>
                          {!AuthService.isFieldHidden(
                            props.AuthRules,
                            "DownloadDisputeLetter"
                          ) &&
                            !AuthService.isFieldReadOnly(
                              props.AuthRules,
                              "DownloadDisputeLetter"
                            ) && <FileDownload filePath={file?.pathLocation} />}
                        </td>
                        <td>{file?.name}</td>
                        <td>
                          <ol className="m-0 p-0 pl-2">
                            {file?.accounts?.map((x: string, ind: number) => {
                              return <li key={ind}>{x}</li>;
                            })}
                          </ol>
                        </td>
                        <td>{file?.type}</td>
                        <td>
                          {moment(file?.dateEntered).format("MM/DD/YYYY")}
                        </td>
                        <td className="position-relative">
                          {singleLoading &&
                          deletingId === file?.letterFileId ? (
                            <LargeSpinner className="small-spinner" />
                          ) : (
                            <>
                              {!AuthService.isFieldHidden(
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
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-danger"
                      style={{ height: "50px" }}
                    >
                      <i>No Dispute Letters available.</i>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardWidget>
  );
});
