import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
  useParams,
} from "react-router-dom";
import { validate as uuidValidate } from "uuid";
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import ReactTooltip from "react-tooltip";
import classnames from "classnames";
import axios from "axios";

import "./customer-list.scss";
import { DashboardWidget } from "../../dashboard/components/dashboard-widget";
import { ClientRoutesConstants, Messages } from "../../../shared/constants";
import { asyncComponent } from "../../../shared/components/async-component";
import { PrivateRoute } from "../../../core/components/private-route";
import {
  IAgent,
  ICustomerFilter,
  ICustomerShort,
  IStatus,
} from "../../../models/interfaces/customer-view";
import { ListFilterComponent } from "../../../shared/components/list-filter";
import {
  getCustomers,
  getFranchiseAgents,
  getReferralAgents,
  loadStatuses,
} from "../../../actions/customers.actions";
import { getFranchiseOffices } from "../../../actions/franchise.actions";
import AuthService from "../../../core/services/auth.service";
import {
  AutoCompleteSearchTypes,
  EnumRoles,
  EnumScreens,
  EnumSearchOptions,
  SearchType,
} from "../../../models/enums";
import {
  IDropdown,
  IJwtPayload,
  INameValueMatch,
} from "../../../models/interfaces/shared";
import { withAuthorize } from "../../../shared/hoc/authorize";
import { ToDoImage } from "../../../shared/components/images";
import { WindowUtils } from "../../../utils/window-utils";
import moment from "moment";
import { CommonUtils } from "../../../utils/common-utils";
import { ButtonComponent } from "../../../shared/components/button";
import { IFranchiseOffice } from "../../../models/interfaces/franchise";
import { StickyHeaderComponent } from "../../../shared/components/sticky-header";

const AsyncCustomerEditComponent = asyncComponent(
  () => import("../customer-edit/customer-edit")
);
const AsyncCustomerAddComponent = asyncComponent(
  () => import("../customer-add/customer-add")
);

interface ICustomerList {
  match: { path: string; params?: { cid?: string } };
  auth: any;
  getCustomers: any;
  loadStatuses: any;
  getCustomer: any;
  statuses: IStatus[];
  history: any;
  currentAccessibleScreens: string[];
  getFranchiseOffices: any;
}
const CustomerListComponent: React.FC<ICustomerList> = (
  props: ICustomerList
) => {
  const [randomKey, setRandomKey] = useState(
    CommonUtils.randomNumber() as number
  );
  const [customers, setCustomers] = useState([] as ICustomerShort[]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    ExcludeCancelled: true,
    ExcludeComplete: true,
    ExcludeOnHold: true,
    allMustMatch: true,
  } as ICustomerFilter);
  const [activeId, setActiveId] = useState("" as string);
  const [franchAgents, setFranchAgents] = useState([] as IAgent[]);
  const [franchiseOffices, setFranchiseOffices] = useState(
    [] as IFranchiseOffice[]
  );
  const [referralAgents, setReferralAgents] = useState([] as IAgent[]);
  const [rounds, setRounds] = useState([] as string[]);
  const [daysLeft, setDaysLeft] = useState([] as string[]);
  const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());
  const [selectedOptions, setSelectedOptions] = useState([] as string[]);
  const [selectedAlphabet, setSelectedAlphabet] = useState("");
  const [searchText, setSearchText] = useState("");
  const [bindCount, setBindCount] = useState(1 as number);
  const [filterChanged, setFilterChanged] = useState(false);
  const [currentRole, setCurrentRole] = useState("" as EnumRoles);

  const franchRef: any = useRef(null);
  const referralRef: any = useRef(null);
  const daysRef: any = useRef(null);
  const roundsRef: any = useRef(null);
  const statusRef: any = useRef(null);
  const franchOfcRef: any = useRef(null);

  const getRandom = () => {
    return CommonUtils.randomNumber();
  };
  const setSelectedCustomer = () => {
    const index = window.location.href.lastIndexOf("/");
    const cid = window.location.href.slice(index + 1);
    if (cid && uuidValidate(cid)) {
      setActiveId(cid);
    }
  };

  const currentLocation = useLocation();
  const [currentPayload, setCurrentPayload] = useState({} as IJwtPayload);
  useEffect(() => {
    const payload = AuthService.getCurrentJWTPayload();
    setCurrentPayload(payload);
  }, [currentLocation]);

  useEffect(() => {
    const payload = AuthService.getCurrentJWTPayload();
    setCurrentRole(payload?.roles);
    if (payload.roles !== EnumRoles.Customer) {
      loadRoundStatuses();
      setFilter({
        ...filter,
        MembershipId: payload?.membershipId,
        SiteId: payload?.siteId,
      });
      setSelectedOptions(getOptions(filter));
      setSelectedCustomer();
      loadAgents();
      loadFranchiseOffices();
    }
    return () => {
      axiosSource?.cancel(Messages.APIAborted);
    };
  }, []);
  const loadCustomers = () => {
    setIsLoading(true);
    props
      .getCustomers(filter, axiosSource)
      .then((data: any) => {
        if (bindCount === 1) {
          setRounds(data?.round);
          setDaysLeft(data?.daysLeft);
        }
        const newCount = bindCount + 1;
        setBindCount(newCount);
        setCustomers(data?.customers);
        setIsLoading(false);
      })
      .catch((err: any) => {
        if (!axios.isCancel(err)) {
          setCustomers([]);
          setIsLoading(false);
        }
      });
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
  useEffect(() => {
    if (filter && filter?.MembershipId && filter?.SiteId) {
      loadCustomers();
    }
  }, [filter]);
  const loadRoundStatuses = () => {
    props?.loadStatuses(axiosSource);
  };
  const loadAgents = () => {
    axios
      .all([getFranchiseAgents(axiosSource), getReferralAgents(axiosSource)])
      .then((results: any[]) => {
        if (results?.length) {
          setFranchAgents(results[0]);
          setReferralAgents(results[1]);
        }
      });
  };
  const getLink = (content: any, cid: string) => {
    return (
      <Link
        to={ClientRoutesConstants.customers + "/" + cid}
        onClick={() => {
          setActiveId(cid);
          scrollToForm();
        }}
      >
        {content}
      </Link>
    );
  };
  const goToDetailsPage = (cid: string) => {
    setActiveId(cid);
    scrollToForm();
    props.history.push(ClientRoutesConstants.customers + "/" + cid);
  };
  const onListReload = () => {
    setIsLoading(true);
    setFilter({
      ...filter,
      allMustMatch: !searchText,
    });
  };
  const onSearchOptionChange = (options: string[]) => {
    setFilterChanged(true);
    const newFilter = {
      ...filter,
      ExcludeComplete: !!options?.some((x) => x === EnumSearchOptions.Complete),
      ExcludeOnHold: !!options?.some((x) => x === EnumSearchOptions.OnHold),
      ExcludeCancelled: !!options?.some(
        (x) => x === EnumSearchOptions.Cancelled
      ),
      allMustMatch: !searchText,
    };
    setFilter(newFilter);
    setSelectedOptions(getOptions(newFilter));
  };
  const getOptions = (filt: ICustomerFilter): string[] => {
    let arr: string[] = [];
    if (filt) {
      if (filt?.ExcludeComplete) arr.push(EnumSearchOptions.Complete);
      if (filt?.ExcludeOnHold) arr.push(EnumSearchOptions.OnHold);
      if (filt?.ExcludeCancelled) arr.push(EnumSearchOptions.Cancelled);
    }
    return arr;
  };
  const alphabetClicked = (character: string) => {
    setSelectedAlphabet(character);
    setFilterChanged(true);
    setFilter({
      ...filter,
      searchCriteria: [
        ...((filter?.searchCriteria as any[])?.filter(
          (x) => x.Name !== "LastName"
        ) || []),
        { Name: "LastName", Value: character, Match: SearchType.StartsWith },
      ],
      allMustMatch: true,
    });
    setSearchText("");
  };
  const onTextChange = (text: string | IDropdown) => {
    setFilterChanged(true);
    if (typeof text === "string") {
      setSearchText(text);
      setFilter({
        ...filter,
        searchCriteria: !!text ? getTextCriteria(text) : [],
        allMustMatch: !text,
      });
    } else if (
      typeof text === "object" &&
      uuidValidate(text?.abbreviation ?? "")
    ) {
      const searchText = text?.name ?? "";
      setSearchText(searchText);
      setFilter({
        ...filter,
        searchCriteria: !!searchText ? getTextCriteria(searchText) : [],
        allMustMatch: !searchText,
      });
      setActiveId(text?.abbreviation ?? "");
      props.history.push(
        ClientRoutesConstants.customers + "/" + text?.abbreviation
      );
    }
  };
  const onDateRangeChange = (range: { from: string; to: string }) => {
    setSearchText("");
    setFilter({
      ...filter,
      searchCriteria: [
        {
          Name: "DateEntered",
          Value: `${range.from},${range.to}`,
          Match: SearchType.DateRange,
        },
      ],
    });
    setFilterChanged(true);
  };
  const getTextCriteria = (text: string): INameValueMatch[] => {
    return [
      { Name: "LastName", Value: text, Match: SearchType.StartsWith },
      { Name: "FirstName", Value: text, Match: SearchType.StartsWith },
      { Name: "Email", Value: text, Match: SearchType.StartsWith },
      { Name: "FullName", Value: text, Match: SearchType.StartsWith },
      { Name: "StatusName", Value: text, Match: SearchType.StartsWith },
      { Name: "Telephone", Value: text, Match: SearchType.StartsWith },
      { Name: "CellPhone", Value: text, Match: SearchType.StartsWith },
      { Name: "DateEntered", Value: text, Match: SearchType.StartsWith },
      { Name: "OfficeName", Value: text, Match: SearchType.Complete },
    ];
  };
  const onHeaderFilterChange = () => {
    setFilterChanged(true);
    let searchCriteria = [];
    if (franchRef.current.value) {
      searchCriteria.push(
        getHeaderFilter(
          "FranchiseAgentName",
          franchRef.current?.selectedOptions[0].innerText
        )
      );
    }
    if (referralRef.current.value) {
      searchCriteria.push(
        getHeaderFilter(
          "ReferralAgentName",
          referralRef.current?.selectedOptions[0].innerText
        )
      );
    }
    if (statusRef.current.value) {
      searchCriteria.push(
        getHeaderFilter("StatusName", statusRef.current.value)
      );
    }
    if (daysRef.current.value) {
      searchCriteria.push(
        getHeaderFilter(
          "DaysToPullScores",
          daysRef.current.value,
          SearchType.Complete
        )
      );
    }

    if (roundsRef.current.value) {
      searchCriteria.push(
        getHeaderFilter(
          "CurrentRound",
          roundsRef.current.value,
          SearchType.Complete
        )
      );
    }
    if (franchOfcRef.current.value) {
      searchCriteria.push(
        getHeaderFilter(
          "FranchiseOfficeName",
          franchOfcRef.current?.selectedOptions[0].innerText
        )
      );
    }
    setFilter({
      ...filter,
      searchCriteria,
      allMustMatch: !searchText,
    });
  };
  const getHeaderFilter = (
    Name: string,
    Value: string,
    Match = SearchType.Contains
  ): INameValueMatch => {
    return { Name, Value, Match };
  };
  const onFilterClear = () => {
    const payload = AuthService.getCurrentJWTPayload();
    const filt = {
      ExcludeCancelled: true,
      ExcludeComplete: true,
      ExcludeOnHold: true,
      allMustMatch: true,
      MembershipId: payload?.membershipId,
      SiteId: payload?.siteId,
    };
    setFilter(filt);
    franchRef.current.value = "";
    referralRef.current.value = "";
    daysRef.current.value = "";
    statusRef.current.value = "";
    roundsRef.current.value = "";
    franchOfcRef.current.value = "";
    setSearchText("");
    setSelectedAlphabet("");
    setSelectedOptions(getOptions(filt));
    setFilterChanged(false);
    setRandomKey(getRandom());
  };
  const refreshList = () => {
    loadCustomers();
    setSelectedCustomer();
  };
  const scrollToForm = () => {
    WindowUtils.scrollToForm("myScrollToElement");
  };
  return (
    <div className="customers-list">
      {currentRole !== EnumRoles.Customer ? (
        <>
          <section className="content-header">
            <div className="header-icon">
              <i className="fa fa-address-book-o"></i>
            </div>
            <div className="header-title">
              <h1>Clients</h1>
              <small>Add, Edit and delete Clients</small>
            </div>
          </section>
          <section className="content">
            <div className="row">
              <div className="col-12 pinpin customer-grid">
                <DashboardWidget
                  title={
                    <>
                      Clients List
                      {!isLoading && (
                        <span className="records pull-right mr-3">
                          {" "}
                          Showing {customers?.length} Records
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
                    onScroll={() => ReactTooltip.hide()}
                  >
                    <table className="dataTableCustomers table table-striped table-hover">
                      <thead className="back_table_color">
                        <tr className={"secondary"}>
                          <th></th>
                          <th style={{ width: "13%" }}>Last Name</th>
                          <th style={{ width: "13%" }}>First Name</th>
                          <th style={{ width: "15%" }}>
                            <div>Company Office</div>
                            <select
                              ref={franchOfcRef}
                              onChange={onHeaderFilterChange}
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
                            <div>Company Agent</div>
                            <select
                              ref={franchRef}
                              onChange={onHeaderFilterChange}
                              disabled={!franchAgents?.length}
                              className="form-control input-sm"
                            >
                              <option value="">- All Listings -</option>
                              {franchAgents?.map((item, index) => (
                                <option
                                  key={index}
                                  value={
                                    item?.firstName?.trim() +
                                    "," +
                                    item?.lastName?.trim()
                                  }
                                >
                                  {item?.firstName?.trim() +
                                    " " +
                                    item?.lastName?.trim()}
                                </option>
                              ))}
                            </select>
                          </th>
                          <th style={{ width: "16%" }}>
                            <div>Affiliate Agent</div>
                            <select
                              ref={referralRef}
                              onChange={onHeaderFilterChange}
                              disabled={!referralAgents?.length}
                              className="form-control input-sm"
                            >
                              <option value="">- All Listings -</option>
                              {referralAgents?.map((item, index) => (
                                <option
                                  key={index}
                                  value={
                                    item?.firstName?.trim() +
                                    "," +
                                    item?.lastName?.trim()
                                  }
                                >
                                  {item?.firstName?.trim() +
                                    " " +
                                    item?.lastName?.trim()}
                                </option>
                              ))}
                            </select>
                          </th>
                          <th className="text-center" style={{ width: "6%" }}>
                            <div>Round</div>
                            <select
                              disabled={!rounds?.length}
                              ref={roundsRef}
                              onChange={onHeaderFilterChange}
                              className="form-control input-sm"
                            >
                              <option value="">- All -</option>
                              {rounds?.map((item, index) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </th>
                          <th className="text-center" style={{ width: "10%" }}>
                            <div>Days Left</div>
                            <select
                              disabled={!daysLeft?.length}
                              ref={daysRef}
                              onChange={onHeaderFilterChange}
                              className="form-control input-sm"
                            >
                              <option value="">- All -</option>
                              {daysLeft?.map((item, index) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </th>
                          <th className="text-center" style={{ width: "9%" }}>
                            <div>Status</div>
                            <select
                              ref={statusRef}
                              onChange={onHeaderFilterChange}
                              className="form-control input-sm"
                              disabled={!props?.statuses?.length}
                            >
                              <option value="">- All -</option>
                              {props?.statuses?.map((item, index) => (
                                <option
                                  key={index}
                                  value={item?.statusName?.split(" ")[0]}
                                >
                                  {item?.statusName}
                                </option>
                              ))}
                            </select>
                          </th>
                          <th className="text-center" style={{ width: "8%" }}>
                            <div>Created On</div>
                          </th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers?.map(
                          (cust: ICustomerShort, index: number) => {
                            return (
                              <tr
                                key={cust.id}
                                className={classnames({
                                  active: activeId === cust?.id,
                                })}
                              >
                                <td
                                  className="text-center d-flex justify-content-center align-items-center"
                                  style={{ width: "50px" }}
                                >
                                  <i
                                    className={
                                      "fa " +
                                      (cust?.isLockedOut
                                        ? "fa-lock"
                                        : "fa-unlock")
                                    }
                                  ></i>
                                  {cust?.todoPending && (
                                    <img
                                      src={ToDoImage}
                                      className="todo-indicator pointer"
                                      title="Client has one or more Pending ToDos "
                                    />
                                  )}
                                </td>
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
                                  className="text-center"
                                  style={{ width: "6%", cursor: "pointer" }}
                                  onClick={() => goToDetailsPage(cust?.id)}
                                >
                                  {cust?.currentRound}
                                </td>
                                <td
                                  className="text-center"
                                  style={{ width: "8%", cursor: "pointer" }}
                                  onClick={() => goToDetailsPage(cust?.id)}
                                >
                                  {!cust?.daysToPullScores ||
                                  cust?.daysToPullScores == 2147483647
                                    ? "-"
                                    : cust?.daysToPullScores}
                                </td>
                                <td
                                  className="text-center"
                                  style={{ width: "9%", cursor: "pointer" }}
                                  onClick={() => goToDetailsPage(cust?.id)}
                                >
                                  <span
                                    className={
                                      "status " +
                                      cust?.statusName?.toLowerCase()
                                    }
                                  >
                                    {cust?.statusName}
                                  </span>
                                </td>
                                <td className="text-right">
                                  {moment(cust?.dateEntered).format(
                                    "MM/DD/YYYY"
                                  )}
                                </td>
                                <td className="text-center">
                                  {getLink(
                                    <Button color="secondary btn-sm">
                                      View
                                    </Button>,
                                    cust?.id
                                  )}
                                </td>
                              </tr>
                            );
                          }
                        )}
                        {!customers?.length && !isLoading && (
                          <tr>
                            <td colSpan={11}>
                              <div className="no-records text-danger justify-content-center">
                                <h2> No Client Created Yet!! </h2>
                                <div className="mt-2">
                                  <Link to={ClientRoutesConstants.customersAdd}>
                                    <ButtonComponent
                                      className="btn btn-primary"
                                      text="Create New Client"
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
                            <td colSpan={11}>
                              <div style={{ minHeight: "400px" }}></div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <ListFilterComponent
                    key={randomKey}
                    onSearchOptionChange={onSearchOptionChange}
                    selectedOptions={selectedOptions}
                    selectedAlphabet={selectedAlphabet}
                    onTextChange={onTextChange}
                    defaultText={searchText}
                    alphabetClicked={alphabetClicked}
                    searchTypes={AutoCompleteSearchTypes.CUSTOMER}
                    onFilterClear={onFilterClear}
                    onDateRangeChange={onDateRangeChange}
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
        </>
      ) : (
        currentPayload?.roles === EnumRoles.Customer &&
        !!currentPayload?.cid && (
          <Redirect
            to={ClientRoutesConstants.customers + "/" + currentPayload?.cid}
          />
        )
      )}
      <section className="content edit-customer-section" id="myScrollToElement">
        <Switch>
          <PrivateRoute
            path={ClientRoutesConstants.customersAdd}
            exact
            onReloadCustomersList={refreshList}
            component={AsyncCustomerAddComponent}
          />
          <Route
            path={ClientRoutesConstants.customersView}
            children={
              <CustomersListSubRoute onReloadCustomersList={refreshList} />
            }
          />
        </Switch>
      </section>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    statuses: state?.customerViewModel?.statuses,
    currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getCustomers,
      loadStatuses,
      getFranchiseOffices,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthorize(CustomerListComponent, EnumScreens.CustomerList));

const CustomersListSubRoute = connect(
  mapStateToProps,
  mapDispatchToProps
)((props: any) => {
  const { cid }: any = useParams();
  return uuidValidate(cid) ? (
    <AsyncCustomerEditComponent {...props} cid={cid} />
  ) : (
    <Redirect to={ClientRoutesConstants.notFound} />
  );
});
