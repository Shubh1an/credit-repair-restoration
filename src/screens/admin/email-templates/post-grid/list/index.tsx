import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import { ButtonComponent } from "../../../../../shared/components/button";
import { DashboardWidget } from "../../../../dashboard/components/dashboard-widget";
import { debounce } from "lodash";
import { ListFilterComponent } from "../../../../../shared/components/list-filter";
import { generatePath, Link, Switch, useHistory } from "react-router-dom";
import { ClientRoutesConstants } from "../../../../../shared/constants";
import { connect } from "react-redux";
import { withAuthorize } from "../../../../../shared/hoc/authorize";
import { EnumScreens } from "../../../../../models/enums";
import { bindActionCreators } from "redux";
import {
  getAllPostGridLetterTemplates,
  getAllEmailTemplatesList,
  deleteEmailTemplate,
} from "../../../../../actions/email-templates.actions";
import { cancelPostGridLetter } from "../../../../../actions/postgrid-templates.actions";
import { ModalComponent } from "../../../../../shared/components/modal";
import { PostGridEditor } from "./postgrid-letter-add";
import { WindowUtils } from "../../../../../utils/window-utils";
import { PrivateRoute } from "../../../../../core/components/private-route";
import { asyncComponent } from "../../../../../shared/components/async-component";
import Pagination from "../../../../../shared/components/pagination";
type Props = {};
const AsyncViewPostGridLetterComponent = asyncComponent(
  () => import("../Create-Letter")
);

const PostGridLetters = (props: any) => {
  const [searchCompleted, setSearchCompleted] = useState<boolean>(false);
  const [filterChanged, setFilterChanged] = useState(false);
  const [activeLetter, setActiveLetter] = useState<any>();
  const [activeId, setActiveId] = useState("" as string);
  const [axiosSource] = useState(axios.CancelToken.source());
  const [postGridletters, setPostGridletters] = useState<any>([]);
  const [openEditor, setOpenEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toggle, setToggle] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);
  const searchRef = useRef<HTMLInputElement>(null);

  // const navigate = useNavigate();
  useEffect(() => {
    loadPostGridLetters({ skip, pageSize });
    setToggle(true);
  }, []);
  const onDelete = (id: any) => {
    props
      .cancelPostGridLetter(id)
      .then((res: any) => loadPostGridLetters({ skip, pageSize }));
  };
  const loadPostGridLetters = (prop?: any) => {
    setIsLoading(true);
    props
      .getAllPostGridLetterTemplates(
        prop?.skip,
        prop?.pageSize,
        prop?.criteria ? prop?.criteria : ""
      )
      .then((data: any) => {
        console.log("daata=>>>", data);
        setIsLoading(false);
        setPostGridletters(data);
        if (data.data.length == 0) setSearchCompleted(true);
        else setSearchCompleted(false);
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setPostGridletters([]);
          setIsLoading(false);
        }
      });
  };
  const debouncedSearch = React.useRef(
    debounce(async (criteria) => {
      loadPostGridLetters({ skip, pageSize, criteria });
    }, 300)
  ).current;
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchCompleted(false);
    debouncedSearch(e.target.value);
  }
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  const handlePageChange = (page: number) => {
    let skip = page * pageSize - pageSize;
    setCurrentPage(page);
    setSkip(skip);
    loadPostGridLetters({ skip, pageSize });
  };
  const getLink = (content: any, lid: string) => {
    return (
      <Link
        to={ClientRoutesConstants.postGridLetterList + "/" + lid}
        onClick={() => {
          setActiveId(lid);
          scrollToForm();
        }}
      >
        {content}
      </Link>
    );
  };
  const scrollToForm = () => {
    WindowUtils.scrollToForm("myScrollToElement");
  };
  if (!toggle) return <></>;
  return (
    <div>
      <div className="row">
        <ModalComponent
          title={"Create Letter"}
          fullscreen={true}
          isVisible={openEditor}
          onClose={() => setOpenEditor(false)}
        >
          {openEditor && (
            <PostGridEditor
              // letterId={activeLetter?.id}
              setOpenEditor={setOpenEditor}
              loadPostGridLetters={loadPostGridLetters}
              letterObject={activeLetter}
              skip={skip}
              pageSize={pageSize}
            />
          )}
        </ModalComponent>
        <section className="content col-12">
          <div className="row">
            <div className="col-12 pinpin customer-grid lead-grid">
              <DashboardWidget
                title={
                  <>
                    PostGrid Letters
                    {!isLoading && (
                      <span className="records pull-right mr-3">
                        {" "}
                        Showing {postGridletters?.data?.length} Records
                      </span>
                    )}
                  </>
                }
                //   reloadHandler={onListReload}
                isLoading={isLoading}
                allowFullscreen={true}
                allowMaximize={true}
                allowMinimize={true}
                reload={true}
              >
                <div className="input-group d-flex justify-content-between rounded">
                  <div className="d-flex justify-content-start align-items-center ml-2">
                    <input
                      type="search"
                      className="form-control rounded"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="search-addon"
                      onChange={handleChange}
                    />
                    {/* <span className="input-group-text border-0" id="search-addon">
                      <i className="fa fas fa-search"></i>
                    </span> */}
                  </div>
                  <ButtonComponent
                    text="Create Letter"
                    className="btn-success mr-1 mb-2 mt-3 mr-2"
                    onClick={() => {
                      setOpenEditor(true);
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
                        <th></th>
                        <th style={{ width: "20%" }}>Description</th>
                        <th style={{ width: "20%" }}>Recipient</th>
                        <th style={{ width: "20%" }}>Address</th>
                        <th style={{ width: "20%" }}>Status</th>
                        <th style={{ width: "20%" }}>Created At</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {postGridletters?.data?.map(
                        (letter: any, index: number) => {
                          return (
                            <tr
                              className="w-100"
                              key={index}
                              //   className={classnames({
                              //     active: activeId === cust?.id,
                              //   })}
                            >
                              <td></td>
                              <td
                                style={{ cursor: "pointer" }}
                                // onClick={() => goToDetailsPage(cust?.id)}
                              >
                                {letter?.description}
                              </td>
                              <td
                                style={{ cursor: "pointer" }}
                                // onClick={() => goToDetailsPage(letter?.id)}
                              >
                                {letter?.to?.firstName}
                              </td>
                              <td
                                style={{ cursor: "pointer" }}
                                // onClick={() => goToDetailsPage(letter?.id)}
                              >
                                {letter?.to?.addressLine1}
                              </td>
                              <td
                                style={{ cursor: "pointer" }}
                                // onClick={() => goToDetailsPage(letter?.id)}
                              >
                                {letter?.status}
                              </td>
                              <td>
                                {moment(letter?.createdAt).format("MM/DD/YYYY")}
                              </td>
                              <td className="text-center mr-2">
                                {/* <Button
                                  color="link btn-sm pl-2 pr-2 text-dark hover-zoom"
                                  onClick={() => handleProceed(letter?.id)}
                                >
                                  <i className="fa fa-pencil"></i>
                                </Button> */}
                                <td className="text-center">
                                  {getLink(
                                    <Button color="secondary btn-sm">
                                      View
                                    </Button>,
                                    letter?.id
                                  )}
                                </td>
                                <Button
                                  color="danger btn-sm pl-2 pr-2 hover-zoom"
                                  onClick={() => onDelete(letter?.id)}
                                  disabled={
                                    letter.status === "cancelled" ||
                                    letter.status === "completed"
                                  }
                                >
                                  <i className="fa fa-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          );
                        }
                      )}
                      {!postGridletters?.data?.length &&
                        !isLoading &&
                        searchCompleted && (
                          <tr>
                            <td colSpan={10}>
                              <div className="no-records text-danger justify-content-center">
                                <h2> No Letter Created Yet!! </h2>
                                <div className="mt-2">
                                  <ButtonComponent
                                    className="btn btn-primary"
                                    text="Create New Letter"
                                    onClick={() => setOpenEditor(true)}
                                  >
                                    <i className="fa fa-plus mr-2"></i>
                                  </ButtonComponent>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      {isLoading && (
                        <tr>
                          <td colSpan={10}>
                            <div style={{ minHeight: "400px" }}></div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* <ListFilterComponent
                  key={randomKey}
                  hideAlphabets={false}
                  hideSearchOptions={true}
                  selectedAlphabet={selectedAlphabet}
                  alphabetClicked={alphabetClicked}
                  onFilterClear={onFilterClear}
                  hideCustomerSearch={false}
                  onTextChange={onTextChange}
                  defaultText={searchText}
                  searchTypes={AutoCompleteSearchTypes.LEAD}
                  onDateRangeChange={onDateRangeChange}
                  customerSearchPlaceholder={"Type to search Leads..."}
                />
                {filterChanged && (
                  <span className="filter-clear" onClick={onFilterClear}>
                    <i className="fa fa-remove mr-1"></i>
                    clear filters
                  </span>
                )} */}
                <div className="d-flex justify-content-end align-items-center my-3">
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={postGridletters?.totalCount}
                    pageSize={pageSize}
                    onPageChange={(page: any) => handlePageChange(page)}
                  />
                </div>
              </DashboardWidget>
            </div>
          </div>
        </section>
      </div>
      <section className="content edit-customer-section" id="myScrollToElement">
        <Switch>
          <PrivateRoute
            path={ClientRoutesConstants.viewPostgridLetter}
            exact
            component={AsyncViewPostGridLetterComponent}
          />
        </Switch>
      </section>
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
      getAllEmailTemplatesList,
      getAllPostGridLetterTemplates,
      deleteEmailTemplate,
      cancelPostGridLetter,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthorize(PostGridLetters, EnumScreens.PostGridLetterList));
