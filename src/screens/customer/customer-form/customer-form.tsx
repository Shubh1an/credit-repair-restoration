import React, { useEffect, useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios, { CancelTokenSource } from "axios";

import "./customer-form.scss";
import { DashboardWidget } from "../../dashboard/components/dashboard-widget";
import { CustomerInfoComponent } from "./tabs/customer-info";
import { CustomerClientNotesComponent } from "./tabs/notes/client-notes";
import { CustomerContactDetailsComponent } from "./tabs/notes/customer-contacts";
import { CustomerProcessingNotesComponent } from "./tabs/notes/procesing-notes";
import { CreditScoreInfoComponent } from "./tabs/dispute-progress/credit-score-info";
import {
  getCustomer,
  checkAPIActive,
  getStates,
  checkPartnerKey,
  getAdminSettings,
} from "../../../actions/customers.actions";
import { ClientRoutesConstants, Messages } from "../../../shared/constants";
import { NavigationOptions } from "../../../shared/components/navigation-options";
import { DisputeStatisticsComponent } from "./tabs/dispute-progress/dispute-statistics/";
import { FilesComponent } from "./tabs/files/";
import { DisputeLettersComponent } from "./tabs/letters/";
import { AccountsComponent } from "./tabs/accounts/";
import { EnumRoles, EnumScreens, ToDoTargetTypes } from "../../../models/enums";
import { IScreenProps } from "../../../models/interfaces/shared";
import AuthService from "../../../core/services/auth.service";
import { DisputeStatisticsMiniComponent } from "./tabs/dispute-progress/dispute-statistics-mini";
import { WindowUtils } from "../../../utils/window-utils";
import { CustomerReferralAgentListComponent } from "./tabs/customer-info/components/customer-referral-agent/list";
import { ServiesAndOfcDetailsComponent } from "./servies-and-ofc-details";
import { CustomerToDosComponent } from "./tabs/customer-info/components/customer-todos";
import { StickyHeaderComponent } from "../../../shared/components/sticky-header";
import { ServiceAgreementComponent } from "./tabs/service-aggreement";

const mapStateToProps = (state: any) => {
  return {
    auth: state.authModel?.auth,
    AuthRules: AuthService.getScreenOject(
      state.sharedModel.AuthRules,
      EnumScreens.CustomerDetails
    ),
  };
};

const matDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getCustomer,
      checkAPIActive,
      getStates,
      getAdminSettings,
      checkPartnerKey,
    },
    dispatch
  );
};

export const CustomerFormComponent = connect(
  mapStateToProps,
  matDispatchToProps
)(
  (props: {
    cid?: string;
    addMode?: boolean;
    getCustomer?: any;
    checkAPIActive?: any;
    getStates?: any;
    checkPartnerKey?: any;
    getAdminSettings?: any;
    onReloadCustomersList?: any;
    AuthRules: IScreenProps | null;
  }) => {
    const [activeTab, setActiveTab] = useState(1);
    const [customer, setCustomer] = useState(null as any);
    const [loading, setLoading] = useState(false);
    const [franchiseAgents, setFranchiseAgents] = useState([] as any[]);
    const [stats, setStats] = useState({} as any);
    const [axiosSource, setAxiosSource] = useState(
      axios.CancelToken.source() as CancelTokenSource
    );
    const [currentRole, setCurrentRole] = useState("" as EnumRoles);

    useEffect(() => {
      const payload = AuthService.getCurrentJWTPayload();
      setCurrentRole(payload?.roles);
      props?.getStates(axiosSource);
      if (payload?.roles === EnumRoles.Customer) {
        setActiveTab(2); // set prgress tab for customer as default tab
      }
    }, []);
    useEffect(() => {
      const source = axios.CancelToken.source();
      setAxiosSource(source);
      props?.getAdminSettings(source);
      if (props.cid) {
        loadCustomerDetails(props.cid);
        props?.checkAPIActive("MailChimp", source);
      }
      props?.getStates(source);
      if (props?.addMode) {
        scrollToForm();
      }
      return () => {
        if (axiosSource?.cancel) axiosSource?.cancel(Messages.APIAborted);
      };
    }, [props?.cid, props?.addMode]);
    const scrollToForm = () => {
      WindowUtils.scrollToForm("myScrollToElement");
    };
    const loadCustomerDetails = (cid: string) => {
      setLoading(true);
      props
        ?.getCustomer(cid, axiosSource)
        .then((result: any) => {
          setLoading(false);
          setCustomer(result);
          console.log("customer-result=>>>>>>", result);
          if (result?.customer?.agent?.office?.id) {
            props?.checkPartnerKey(
              result?.customer?.agent?.office?.id,
              axiosSource
            );
          }
          scrollToForm();
        })
        .catch((e: any) => {
          if (!axios.isCancel(e)) {
            setLoading(false);
            setCustomer(null);
          }
        });
    };

    const toggle = (tab: number) => {
      if (activeTab !== tab) {
        setActiveTab(tab);
      }
    };
    const onReloadData = () => {
      if (props?.onReloadCustomersList) {
        props?.onReloadCustomersList();
      }
      onDetailsReload();
    };
    const onDetailsReload = () => {
      if (props.cid) {
        loadCustomerDetails(props.cid);
      }
    };
    const getTitleComponent = () => {
      return props?.addMode ? (
        "Add Client "
      ) : (
        <>
          <div>
            {currentRole !== EnumRoles.Customer ? "Client" : ""}
            Full View{" "}
            {customer?.customer?.fullName && (
              <b className="text-success">
                ({customer?.customer?.fullName || ""})
              </b>
            )}
          </div>
          <div>
            <ServiesAndOfcDetailsComponent {...customer} />
          </div>
        </>
      );
    };
    return (
      <>
        {!props?.addMode && currentRole !== EnumRoles.Customer && (
          <StickyHeaderComponent
            type={EnumRoles.Customer}
            data={customer?.customer}
          />
        )}
        <DashboardWidget
          className="customer-form "
          rootClassName={"header-customer"}
          title={getTitleComponent()}
          isLoading={loading}
          reloadHandler={onDetailsReload}
          allowFullscreen={true}
          allowMaximize={true}
          allowMinimize={true}
          reload={true}
        >
          {!props?.addMode &&
            !AuthService.isFieldHidden(
              props.AuthRules,
              "NavigationOptions"
            ) && (
              <div className="row mb-3">
                <div className="col-12 col-sm-9"></div>
                <div className="col-6 col-sm-2 text-left text-sm-right pr-0">
                  <label>Navigation options</label>
                </div>
                <div className="col-6 col-sm-1 pt-1 pl-0 text-right text-sm-left">
                  <NavigationOptions
                    current={ClientRoutesConstants.customersView}
                    cid={props?.cid}
                  />
                </div>
              </div>
            )}
          {!props?.addMode && (
            <>
              <Nav tabs className={classnames("customers-full-view-tabs")}>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === 1 })}
                    onClick={() => {
                      toggle(1);
                    }}
                  >
                    <i className="fa fa-user mr-1"></i>
                    Client Info
                  </NavLink>
                </NavItem>
                {!AuthService.isFieldHidden(
                  props.AuthRules,
                  "DisputeProgressTab"
                ) && (
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 2 })}
                      onClick={() => {
                        toggle(2);
                      }}
                    >
                      <i className="fa fa-line-chart mr-1"></i>
                      Dispute Progress
                    </NavLink>
                  </NavItem>
                )}
                {!AuthService.isFieldHidden(props.AuthRules, "NotesTab") && (
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 3 })}
                      onClick={() => {
                        toggle(3);
                      }}
                    >
                      <i className="fa fa-comments-o mr-1"></i>
                      Notes & Contacts
                    </NavLink>
                  </NavItem>
                )}
                {!AuthService.isFieldHidden(props.AuthRules, "FilesTab") && (
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 4 })}
                      onClick={() => {
                        toggle(4);
                      }}
                    >
                      <i className="fa fa-file-pdf-o mr-1"></i>
                      Documents
                    </NavLink>
                  </NavItem>
                )}
                {!AuthService.isFieldHidden(props.AuthRules, "LettersTab") && (
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 5 })}
                      onClick={() => {
                        toggle(5);
                      }}
                    >
                      <i className="fa fa-envelope-o mr-1"></i>
                      Letters
                    </NavLink>
                  </NavItem>
                )}
                {!props?.addMode &&
                  !AuthService.isFieldHidden(props.AuthRules, "ToDoTab") && (
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === 6 })}
                        onClick={() => {
                          toggle(6);
                        }}
                      >
                        <i className="pe-7s-note2 mr-2 font-weight-bold f-20"></i>
                        To Dos
                      </NavLink>
                    </NavItem>
                  )}
                {!props?.addMode &&
                  !AuthService.isFieldHidden(props.AuthRules, "ToDoTab") && (
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === 7 })}
                        onClick={() => {
                          toggle(7);
                        }}
                      >
                        <i className="pe-7s-note2 mr-2 font-weight-bold f-20"></i>
                        Service Agreement
                      </NavLink>
                    </NavItem>
                  )}
              </Nav>
            </>
          )}
          <TabContent activeTab={activeTab}>
            <TabPane tabId={1}>
              <CustomerInfoComponent
                {...customer}
                addMode={props?.addMode}
                onReloadCustomersList={onReloadData}
                onReloadCustomer={onDetailsReload}
                onTabChange={(tabnumber: number) => toggle(tabnumber)}
              />
            </TabPane>
            {!props?.addMode && !!customer && (
              <>
                <TabPane tabId={2}>
                  <DisputeStatisticsMiniComponent
                    {...customer}
                    progressBar={stats}
                    cid={props?.cid}
                  />
                  <CreditScoreInfoComponent
                    {...customer}
                    onReloadCustomer={onDetailsReload}
                  />
                  <AccountsComponent
                    {...customer}
                    onReloadCustomer={onDetailsReload}
                  />
                  {activeTab === 2 &&
                    !AuthService.isFieldHidden(props.AuthRules, "ShowStats") &&
                    !AuthService.isFieldReadOnly(
                      props.AuthRules,
                      "ShowStats"
                    ) && (
                      <DashboardWidget
                        title={"Dispute Stats"}
                        className={"p-0"}
                        allowFullscreen={true}
                        allowMaximize={true}
                        allowMinimize={true}
                        reload={false}
                      >
                        <DisputeStatisticsComponent
                          {...customer}
                          cid={props?.cid}
                          onLoad={(e: any) => setStats(e)}
                        />
                      </DashboardWidget>
                    )}
                </TabPane>
                <TabPane tabId={3}>
                  {customer ? (
                    <>
                      {!AuthService.isFieldHidden(
                        props.AuthRules,
                        "ClientNotesSection"
                      ) &&
                        !AuthService.isFieldReadOnly(
                          props.AuthRules,
                          "ClientNotesSection"
                        ) && (
                          <CustomerClientNotesComponent
                            onReloadCustomer={onDetailsReload}
                            {...customer}
                          />
                        )}
                      {!AuthService.isFieldHidden(
                        props.AuthRules,
                        "ProcessingNotesSection"
                      ) &&
                        !AuthService.isFieldReadOnly(
                          props.AuthRules,
                          "ProcessingNotesSection"
                        ) && (
                          <CustomerProcessingNotesComponent
                            agents={franchiseAgents}
                            onReloadCustomer={onDetailsReload}
                            {...customer}
                          />
                        )}
                      <CustomerContactDetailsComponent
                        {...props}
                        {...customer}
                        onFranchiseLoad={(list: any[]) =>
                          setFranchiseAgents(list)
                        }
                        onReloadData={onReloadData}
                      />
                      <CustomerReferralAgentListComponent cid={props?.cid} />
                    </>
                  ) : null}
                </TabPane>
                <TabPane tabId={4}>
                  {!!customer && (
                    <FilesComponent
                      {...customer}
                      onReloadCustomer={onDetailsReload}
                    />
                  )}
                </TabPane>
                <TabPane tabId={5}>
                  {!!customer && activeTab === 5 && (
                    <DisputeLettersComponent
                      cid={props?.cid}
                      onReloadCustomer={onDetailsReload}
                    />
                  )}
                </TabPane>
                <TabPane tabId={6}>
                  {!props?.addMode &&
                    !!customer &&
                    activeTab === 6 &&
                    !AuthService.isFieldHidden(
                      props.AuthRules,
                      "ToDoSection"
                    ) &&
                    !AuthService.isFieldReadOnly(
                      props.AuthRules,
                      "ToDoSection"
                    ) && (
                      <CustomerToDosComponent
                        id={props?.cid}
                        targetType={ToDoTargetTypes.CUSTOMER}
                      />
                    )}
                </TabPane>
                <TabPane tabId={7}>
                  {!!customer && activeTab === 7 && (
                    <ServiceAgreementComponent
                      cid={props?.cid}
                      membershipId={customer?.customer?.membershipId}
                      onReloadCustomer={onDetailsReload}
                    />
                  )}
                </TabPane>
              </>
            )}
          </TabContent>
        </DashboardWidget>
      </>
    );
  }
);
