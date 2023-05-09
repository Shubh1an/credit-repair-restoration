import React, { useEffect, useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios, { CancelTokenSource } from "axios";

import "./leads-form.scss";
import { DashboardWidget } from "../../dashboard/components/dashboard-widget";
import { Messages } from "../../../shared/constants";
import { EnumRoles, EnumScreens, ToDoTargetTypes } from "../../../models/enums";
import AuthService from "../../../core/services/auth.service";
import { getFranchiseAgents } from "../../../actions/franchise.actions";
import { LeadsInfoComponent } from "./tabs/leads-info";
import { getLeadDetails } from "../../../actions/leads.actions";
import { ILeadDetails } from "../../../models/interfaces/leads";
import { getStates } from "../../../actions/customers.actions";
import { LeadsFileComponent } from "./tabs/files/";
import { CustomerClientNotesComponent } from "../../customer/customer-form/tabs/notes/client-notes";
import { CustomerContactDetailsComponent } from "../../customer/customer-form/tabs/notes/customer-contacts";
import { WindowUtils } from "../../../utils/window-utils";
import { CustomerToDosComponent } from "../../customer/customer-form/tabs/customer-info/components/customer-todos";
import { StickyHeaderComponent } from "../../../shared/components/sticky-header";

const mapStateToProps = (state: any) => {
  return {
    auth: state.authModel?.auth,
    AuthRules: AuthService.getScreenOject(
      state.sharedModel.AuthRules,
      EnumScreens.ViewLeads
    ),
  };
};

const matDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getLeadDetails,
      getStates,
      getFranchiseAgents,
    },
    dispatch
  );
};

export const LeadsFormComponent = connect(
  mapStateToProps,
  matDispatchToProps
)((props: any) => {
  console.log("from-leads-form", props);
  const [activeTab, setActiveTab] = useState(1);
  const [lead, setLead] = useState(null as ILeadDetails | null);
  const [loading, setLoading] = useState(false);
  const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);
  const [franchiseAgents, setFranchiseAgents] = useState([] as any[]);

  useEffect(() => {
    props?.getStates(axiosSource);
  }, []);
  useEffect(() => {
    const source = axios.CancelToken.source();
    setAxiosSource(source);
    if (props.id) {
      loadLeadDetails(props.id);
    }
    if (props?.addMode) {
      scrollToForm();
    }
    return () => {
      if (axiosSource?.cancel) axiosSource?.cancel(Messages.APIAborted);
    };
  }, [props?.id, props?.addMode]);

  const loadLeadDetails = (id: string) => {
    setLoading(true);
    props
      ?.getLeadDetails(id, axiosSource)
      .then((result: ILeadDetails) => {
        setLoading(false);
        setLead(result);
        scrollToForm();
      })
      .catch((e: any) => {
        if (!axios.isCancel(e)) {
          setLoading(false);
          setLead(null);
        }
      });
  };
  const scrollToForm = () => {
    WindowUtils.scrollToForm("myScrollToElement");
  };
  const toggle = (tab: number) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  const onReloadData = () => {
    if (props?.onReloadLeadsList) {
      props?.onReloadLeadsList();
    }
    onListReload();
  };
  const onListReload = () => {
    if (props.id) {
      loadLeadDetails(props.id);
    }
  };
  return (
    <>
      {!props?.addMode && (
        <StickyHeaderComponent type={EnumRoles.Lead} data={lead?.lead} />
      )}
      <DashboardWidget
        className="customer-form"
        title={
          props?.addMode ? (
            "Add Lead "
          ) : (
            <>
              Lead Full View{" "}
              <b className="text-success">({lead?.lead?.fullName || ""})</b>
            </>
          )
        }
        isLoading={loading}
        reloadHandler={onListReload}
        allowFullscreen={true}
        allowMaximize={true}
        allowMinimize={true}
        reload={true}
      >
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
                  <i className="fa fa-user mr-2"></i>
                  Lead Info
                </NavLink>
              </NavItem>
              {!AuthService.isFieldHidden(props.AuthRules, "ServicesTab") && (
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === 2 })}
                    onClick={() => {
                      toggle(2);
                    }}
                  >
                    <i className="fa fa-comments-o mr-2"></i>
                    Notes & Contacts
                  </NavLink>
                </NavItem>
              )}
              {!AuthService.isFieldHidden(props.AuthRules, "AgentsTab") && (
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === 3 })}
                    onClick={() => {
                      toggle(3);
                    }}
                  >
                    <i className="fa fa-users mr-2"></i>
                    Documents
                  </NavLink>
                </NavItem>
              )}
              {!props?.addMode &&
                !AuthService.isFieldHidden(props.AuthRules, "ToDoTab") && (
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 4 })}
                      onClick={() => {
                        toggle(4);
                      }}
                    >
                      <i className="pe-7s-note2 mr-2 font-weight-bold f-20"></i>
                      ToDos
                    </NavLink>
                  </NavItem>
                )}
            </Nav>
          </>
        )}
        <TabContent activeTab={activeTab}>
          <TabPane tabId={1}>
            {(!props?.addMode ? !!lead : true) && (
              <LeadsInfoComponent
                lead={lead}
                addMode={props?.addMode}
                onReloadLeadsList={onReloadData}
              />
            )}
          </TabPane>
          {!props?.addMode && !!lead && (
            <>
              <TabPane tabId={2}>
                {!!lead && (
                  <>
                    <CustomerClientNotesComponent
                      isLead={true}
                      franchiseAgents={franchiseAgents}
                      onReloadCustomer={onListReload}
                      customer={lead.lead}
                    />
                    <CustomerContactDetailsComponent
                      {...props}
                      addMode={props?.addMode}
                      onFranchiseLoad={(list: any[]) =>
                        setFranchiseAgents(list)
                      }
                      isLead={true}
                      onReloadData={onReloadData}
                      customer={lead.lead}
                    />
                  </>
                )}
              </TabPane>
              <TabPane tabId={3}>
                {!!lead && (
                  <LeadsFileComponent
                    lead={lead?.lead}
                    onListReload={onListReload}
                  />
                )}
              </TabPane>
              <TabPane tabId={4}>
                {!props?.addMode && !!lead && (
                  <CustomerToDosComponent
                    id={lead?.lead?.id}
                    targetType={ToDoTargetTypes.LEAD}
                  />
                )}
              </TabPane>
            </>
          )}
        </TabContent>
      </DashboardWidget>
    </>
  );
});
