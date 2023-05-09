import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect, Route, Switch, useParams } from "react-router-dom";
import { validate as uuidValidate } from "uuid";
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import classnames from "classnames";
import axios from "axios";
import moment from "moment";

import "./leads-list.scss";
import { asyncComponent } from "../../../shared/components/async-component";
import { PrivateRoute } from "../../../core/components/private-route";
import {
  AutoCompleteSearchTypes,
  EnumScreens,
  SearchType,
} from "../../../models/enums";
import { ClientRoutesConstants, Messages } from "../../../shared/constants";
import { DashboardWidget } from "../../dashboard/components/dashboard-widget";
import { withAuthorize } from "../../../shared/hoc/authorize";
import { getLeads } from "../../../actions/leads.actions";
import { ButtonComponent } from "../../../shared/components/button";
import { ICustomerShort } from "../../../models/interfaces/customer-view";
import { ILeadsResponse } from "../../../models/interfaces/leads";
import {
  IDropdown,
  INameValue,
  INameValueMatch,
} from "../../../models/interfaces/shared";
import { ListFilterComponent } from "../../../shared/components/list-filter";
import { CommonUtils } from "../../../utils/common-utils";
import { getFranchiseOffices } from "../../../actions/franchise.actions";
import { IFranchiseOffice } from "../../../models/interfaces/franchise";

const AsyncLeadsEditComponent = asyncComponent(() => import("../leads-edit"));
const AsyncLeadsAddComponent = asyncComponent(() => import("../leads-add"));

const LeadsListComponent: React.FC<any> = (props: {
  match: { path: string; params?: { id?: string } };
  auth: any;
  getLeads: any;
  history: any;
  currentAccessibleScreens: string[];
  getFranchiseOffices: any;
}) => {
  const [leads, setLeads] = useState([] as ICustomerShort[]);
  const [loadCounts, setLoadCounts] = useState(0 as number);
  const [fagents, setFAgents] = useState([] as INameValue[]);
  const [ragents, setRAgents] = useState([] as INameValue[]);
  const [statuses, setStatuses] = useState([] as string[]);
  const [transactionTypes, setTransactionTypes] = useState([] as string[]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeId, setActiveId] = useState("" as string | unknown);
  const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());
  const franchRef: any = useRef(null);
  const referralRef: any = useRef(null);
  const traxnRef: any = useRef(null);
  const statusRef: any = useRef(null);
  const franchOfcRef: any = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [filterChanged, setFilterChanged] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState([] as INameValueMatch[]);
  const [selectedAlphabet, setSelectedAlphabet] = useState("");
  const [randomKey, setRandomKey] = useState(
    CommonUtils.randomNumber() as number
  );
  const [franchiseOffices, setFranchiseOffices] = useState(
    [] as IFranchiseOffice[]
  );

  const getRandom = () => {
    return CommonUtils.randomNumber();
  };
  const setSelectedLead = () => {
    const index = window.location.href.lastIndexOf("/");
    const foid = window.location.href.slice(index + 1);
    if (foid && uuidValidate(foid)) {
      setActiveId(foid);
    }
  };
  useEffect(() => {
    loadFranchiseOffices();
    return () => {
      axiosSource.cancel(Messages.APIAborted);
    };
  }, []);
  useEffect(() => {
    loadLeads();
  }, [searchCriteria]);

  const loadLeads = () => {
    setIsLoading(true);
    setLoadCounts(() => loadCounts + 1);
    props
      .getLeads(searchCriteria || [], axiosSource, searchText)
      .then((data: ILeadsResponse) => {
        console.log("from-load-leads", data);
        setIsLoading(false);
        setLeads(data?.leads);
        if (loadCounts === 0) {
          setRAgents(data?.referralAgents);
          setFAgents(data?.franchiseAgents);
          setStatuses(data?.statusNames);
          setTransactionTypes(data?.tranactionTypes);
        }
        setSelectedLead();
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setLeads([]);
          setIsLoading(false);
        }
      });
  };
  const getLink = (content: any, foid?: string) => {
    return (
      <Link
        to={ClientRoutesConstants.leads + "/" + foid}
        onClick={() => {
          setActiveId(foid);
        }}
      >
        {content}
      </Link>
    );
  };
  const goToDetailsPage = (foid?: string) => {
    setActiveId(foid);
    props.history.push(ClientRoutesConstants.leads + "/" + foid);
  };
  const onListReload = () => {
    loadLeads();
  };
  const onHeaderFilterChange = (fiterlName: number) => {
    setFilterChanged(true);
    let s = [] as INameValueMatch[];
    let search = [...searchCriteria];
    console.log("from-header-filter", `search-${search}`, s);
    switch (fiterlName) {
      case 1:
        search = search.filter((x) => x.Name !== "TransactionType");

        if (traxnRef.current.value) {
          s.push(
            getHeaderFilter(
              "TransactionType",
              traxnRef.current.value,
              SearchType.Complete
            )
          );
        }
        break;
      case 2:
        search = search.filter((x) => x.Name !== "FranchiseAgentId");
        console.log("from-header-filter", search, s);
        if (franchRef.current.value) {
          s.push(
            getHeaderFilter(
              "FranchiseAgentId",
              franchRef.current?.selectedOptions[0].value,
              SearchType.Complete
            )
          );
        }
        break;
      case 3:
        search = search.filter((x) => x.Name !== "ReferralAgentId");
        if (referralRef.current.value) {
          s.push(
            getHeaderFilter(
              "ReferralAgentId",
              referralRef.current?.selectedOptions[0].value,
              SearchType.Complete
            )
          );
        }
        break;
      case 4:
        search = search.filter((x) => x.Name !== "LeadType");
        if (statusRef.current.value) {
          s.push(
            getHeaderFilter(
              "LeadType",
              statusRef.current.value,
              SearchType.Complete
            )
          );
        }
        break;
      case 5: {
        search = search.filter((x) => x.Name !== "FranchiseOfficeName");
        if (franchOfcRef.current.value) {
          s.push(
            getHeaderFilter(
              "FranchiseOfficeName",
              franchOfcRef.current?.selectedOptions[0].innerText
            )
          );
        }
        break;
      }
      default:
        break;
    }

    setSearchCriteria([...search, ...s]);
  };
  const getHeaderFilter = (
    Name: string,
    Value: string,
    Match = SearchType.Contains
  ): INameValueMatch => {
    return { Name, Value, Match };
  };
  const getLeadStatus = (type?: string) => {
    switch (type) {
      case "No Contact":
        return <div className="text-danger f-12 font-weight-bold">{type}</div>;
      case "Active":
        return <div className="text-success f-12 font-weight-bold">{type}</div>;
      case "Not Interested":
        return <div className="text-dark f-12 font-weight-bold">{type}</div>;
      case "Contact 1+":
        return (
          <div className="text-primary f-12 ext-warning font-weight-bold">
            {type}
          </div>
        );
      case "Transferred to LO":
        return <div className="text-info f-12 font-weight-bold">{type}</div>;
      case "Contact 5+":
        return (
          <div className="text-orange-red f-12 font-weight-bold">{type}</div>
        );
      case "Contact 10+":
        return (
          <div className="text-darak-orange  f-12 font-weight-bold">{type}</div>
        );
    }
  };
  const onTextChange = (text: string | IDropdown) => {
    setFilterChanged(true);
    if (typeof text === "string") {
      setSearchText(text);
      setSearchCriteria([...searchCriteria]);
    } else if (
      typeof text === "object" &&
      uuidValidate(text?.abbreviation ?? "")
    ) {
      setSearchText("");
      setSearchCriteria([
        ...searchCriteria?.filter((x) => x.Name !== "Id"),
        {
          Name: "Id",
          Value: text?.abbreviation || "",
          Match: SearchType.Complete,
        },
      ]);
      setActiveId(text?.abbreviation);
      props.history.push(ClientRoutesConstants.leads + "/" + text.abbreviation);
    }
  };
  const onFilterClear = () => {
    setSearchCriteria([]);
    franchRef.current.value = "";
    referralRef.current.value = "";
    statusRef.current.value = "";
    traxnRef.current.value = "";
    setSearchText("");
    setSelectedAlphabet("");
    setRandomKey(getRandom());
    setFilterChanged(false);
  };
  const alphabetClicked = (character: string) => {
    setSelectedAlphabet(character);
    setSearchText("");
    setFilterChanged(true);
    setSearchCriteria([
      ...searchCriteria?.filter((x) => x.Name !== "LastName"),
      { Name: "LastName", Value: character, Match: SearchType.StartsWith },
    ]);
  };
  const onDateRangeChange = (range: { from: string; to: string }) => {
    setFilterChanged(true);
    setSearchText("");
    setSearchCriteria([
      ...searchCriteria?.filter((x) => x.Name !== "DateEntered"),
      {
        Name: "DateEntered",
        Value: `${range.from},${range.to}`,
        Match: SearchType.DateRange,
      },
    ]);
  };
  const loadFranchiseOffices = () => {
    props
      .getFranchiseOffices(axiosSource)
      .then((data: any) => {
        setFranchiseOffices(data);
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setIsLoading(false);
        }
      });
  };
  return (
    <div className="customers-list lead-list">
      <section className="content-header">
        <div className="header-icon">
          <i className="fa fa-group"></i>
        </div>
        <div className="header-title">
          <h1>Leads</h1>
          <small>Add, Edit and delete leads</small>
        </div>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-12 pinpin customer-grid lead-grid">
            <DashboardWidget
              title={
                <>
                  Leads
                  {!isLoading && (
                    <span className="records pull-right mr-3">
                      {" "}
                      Showing {leads?.length} Records
                    </span>
                  )}
                </>
              }
              reloadHandler={onListReload}
              isLoading={isLoading}
              allowFullscreen={true}
              allowMaximize={true}
              allowMinimize={true}
              reload={true}
            >
              <div
                style={{ minHeight: "400px" }}
                className="table-responsive list-scrollable custom-scrollbar"
              >
                <table className="dataTableCustomers table table-striped table-hover">
                  <thead className="back_table_color">
                    <tr className={"secondary"}>
                      <th></th>
                      <th style={{ width: "12%" }}>Last Name</th>
                      <th style={{ width: "12%" }}>First Name</th>
                      <th style={{ width: "12%" }}>
                        <div>Transaction</div>
                        <select
                          ref={traxnRef}
                          onChange={() => onHeaderFilterChange(1)}
                          disabled={!transactionTypes?.length}
                          className="form-control input-sm"
                        >
                          <option value="">- All Listings -</option>
                          {transactionTypes?.map((item, index) => (
                            <option key={index} value={item?.trim()}>
                              {item?.trim()}
                            </option>
                          ))}
                        </select>
                      </th>
                      <th style={{ width: "15%" }}>
                        <div>Company Office</div>
                        <select
                          ref={franchOfcRef}
                          onChange={() => onHeaderFilterChange(5)}
                          disabled={!franchiseOffices?.length}
                          className="form-control input-sm"
                        >
                          <option value="">- All Listings -</option>
                          {franchiseOffices?.map((item, index) => (
                            <option key={index} value={item?.name}>
                              {item?.name?.trim()}
                            </option>
                          ))}
                        </select>
                      </th>
                      <th style={{ width: "15%" }}>
                        <div>Agent</div>
                        <select
                          ref={franchRef}
                          onChange={() => onHeaderFilterChange(2)}
                          disabled={!fagents?.length}
                          className="form-control input-sm"
                        >
                          <option value="">- All Listings -</option>
                          {fagents?.map((item, index) => (
                            <option key={index} value={item?.Value?.trim()}>
                              {item?.Name?.trim()}
                            </option>
                          ))}
                        </select>
                      </th>
                      <th style={{ width: "15%" }}>
                        <div>Referred By</div>
                        <select
                          ref={referralRef}
                          onChange={() => onHeaderFilterChange(3)}
                          disabled={!ragents?.length}
                          className="form-control input-sm"
                        >
                          <option value="">- All Listings -</option>
                          {ragents?.map((item, index) => (
                            <option key={index} value={item?.Value?.trim()}>
                              {item?.Name?.trim()}
                            </option>
                          ))}
                        </select>
                      </th>
                      <th style={{ width: "15%" }}>
                        <div>Status</div>
                        <select
                          ref={statusRef}
                          onChange={() => onHeaderFilterChange(4)}
                          disabled={!statuses?.length}
                          className="form-control input-sm"
                        >
                          <option value="">- All Listings -</option>
                          {statuses?.map((item, index) => (
                            <option key={index} value={item?.trim()}>
                              {item?.trim()}
                            </option>
                          ))}
                        </select>
                      </th>
                      <th style={{ width: "15%", textAlign: "center" }}>
                        <div>Created On</div>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads?.map((cust: ICustomerShort, index: number) => {
                      return (
                        <tr
                          key={cust.id}
                          className={classnames({
                            active: activeId === cust?.id,
                          })}
                        >
                          <td></td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => goToDetailsPage(cust?.id)}
                          >
                            {cust?.lastName}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => goToDetailsPage(cust?.id)}
                          >
                            {cust?.firstName}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => goToDetailsPage(cust?.id)}
                          >
                            {cust?.transactionType}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => goToDetailsPage(cust?.id)}
                          >
                            {cust?.franchiseOfficeName}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => goToDetailsPage(cust?.id)}
                          >
                            {cust?.franchiseAgentName}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => goToDetailsPage(cust?.id)}
                          >
                            {cust?.referralAgentName}
                          </td>
                          <td
                            style={{
                              cursor: "pointer",
                              textAlign: "center",
                              padding: "0!important",
                              position: "relative",
                            }}
                            onClick={() => goToDetailsPage(cust?.id)}
                          >
                            {getLeadStatus(cust?.leadType)}
                          </td>
                          <td className="text-center">
                            {moment(cust?.dateEntered).format("MM/DD/YYYY")}
                          </td>
                          <td className="text-center">
                            {getLink(
                              <Button color="secondary btn-sm">View</Button>,
                              cust?.id
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {!leads?.length && !isLoading && (
                      <tr>
                        <td colSpan={10}>
                          <div className="no-records text-danger justify-content-center">
                            <h2> No Lead Created Yet!! </h2>
                            <div className="mt-2">
                              <Link to={ClientRoutesConstants.leadAdd}>
                                <ButtonComponent
                                  className="btn btn-primary"
                                  text="Create New Lead"
                                >
                                  <i className="fa fa-plus mr-2"></i>
                                </ButtonComponent>
                              </Link>
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
              <ListFilterComponent
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
              )}
            </DashboardWidget>
          </div>
        </div>
      </section>
      <section className="content edit-customer-section" id="myScrollToElement">
        <Switch>
          <PrivateRoute
            path={ClientRoutesConstants.leadAdd}
            exact
            onReloadLeadsList={loadLeads}
            component={AsyncLeadsAddComponent}
          />
          <Route
            path={ClientRoutesConstants.viewLeads}
            children={<LeadsListSubRoute onReloadLeadsList={loadLeads} />}
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
      getLeads,
      getFranchiseOffices,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthorize(LeadsListComponent, EnumScreens.ViewLeads));

const LeadsListSubRoute = connect(
  mapStateToProps,
  mapDispatchToProps
)((props: any) => {
  const { id }: any = useParams();
  return uuidValidate(id) ? (
    <AsyncLeadsEditComponent {...props} id={id} />
  ) : (
    <Redirect to={ClientRoutesConstants.notFound} />
  );
});
