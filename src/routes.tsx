import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

import { asyncComponent } from "./shared/components/async-component";
import { NotFoundComponent } from "./screens/not-found";
import { FooterComponent } from "./shared/components/footer";
import { ClientRoutesConstants } from "./shared/constants";
import HeaderComponent from "./shared/components/header";
import LeftNavComponent from "./shared/components/left-nav";
import LogoutComponent from "./screens/auth/logout/logout";
import LoginComponent from "./screens/auth/login/login";
import { PrivateRoute } from "./core/components/private-route";
import AuthService from "./core/services/auth.service";
import RoutingService from "./core/services/routing-service";
import { setLogout } from "./actions/auth.actions";
import { bindActionCreators } from "redux";

const AsyncDashboardComponent = asyncComponent(
  () => import("./screens/dashboard")
);
const AsyncRegisterComponent = asyncComponent(
  () => import("./screens/auth/register/register")
);
const AsyncForgetPwdComponent = asyncComponent(
  () => import("./screens/auth/forget-password/forget-password")
);
const AsyncCustomerListComponent = asyncComponent(
  () => import("./screens/customer/customer-list/customer-list")
);
const AsyncFastEditAccountsComponent = asyncComponent(
  () => import("./screens/customer/fast-edit-accounts/fast-edit-accounts")
);
const AsyncCreateLetterComponent = asyncComponent(
  () => import("./screens/customer/create-letter")
);
const AsyncCreateServiceAgreementComponent = asyncComponent(
  () => import("./screens/customer/create-service-agreement")
);
const AsyncReportImporterComponent = asyncComponent(
  () => import("./screens/customer/report-importer/")
);
const AsyncPortalIntegrationComponent = asyncComponent(
  () => import("./screens/portal-integration/")
);
const AsyncAffiliateSignupComponent = asyncComponent(
  () => import("./screens/affiliate-signup/")
);
const AsyncCbReportViewerComponent = asyncComponent(
  () => import("./screens/customer/cb-report-viewer/")
);
const AsyncUserAccessComponent = asyncComponent(
  () => import("./screens/admin/user-access/user-access")
);
const AsyncUnAuthComponent = asyncComponent(
  () => import("./screens/auth/unauthorized/")
);
const AsyncSecurityComponent = asyncComponent(
  () => import("./screens/auth/security/security")
);
const AsyncResetPasswordComponent = asyncComponent(
  () => import("./screens/auth/reset-password/reset-password")
);
const AsyncHTMLReportPrserComponent = asyncComponent(
  () => import("./screens/html-parser/html-report-parser")
);
const AsyncFranchiseOfficesListComponent = asyncComponent(
  () => import("./screens/admin/franchise-offices/franchise-office-list/index")
);
const AsyncLeadsListComponent = asyncComponent(
  () => import("./screens/leads/leads-list")
);
const AsyncFranchiseAgentsListComponent = asyncComponent(
  () => import("./screens/admin/franchise-agents/list")
);
const AsyncReferralOfficesListComponent = asyncComponent(
  () => import("./screens/admin/referral-offices/list")
);
const AsyncReferralAgentsListComponent = asyncComponent(
  () => import("./screens/admin/referral-agents/list")
);
const AsyncEmailTempaltesListComponent = asyncComponent(
  () => import("./screens/admin/email-templates/list")
);
const AsyncServiceTempaltesListComponent = asyncComponent(
  () => import("./screens/admin/service-templates/list")
);

const AsyncPublicCreateLeadComponent = asyncComponent(
  () => import("./screens/public/leads/create-lead")
);
const AsyncMasterDataComponent = asyncComponent(
  () => import("./screens/admin/master-records")
);

const AsyncPostGridLetterListComponent = asyncComponent(
  () => import("./screens/admin/email-templates/post-grid/list")
);
const AsyncViewServiceAgreementComponent = asyncComponent(
  () => import("./screens/customer/view-service-agreement")
);
// const AsyncViewPostGridLetterComponent = asyncComponent(
//   () => import("./screens/admin/email-templates/post-grid/Create-Letter")
// );

const mapStateToProps = (state: any) => {
  return {
    authModel: state.authModel,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      setLogout,
    },
    dispatch
  );
};
export const Routes = connect(
  mapStateToProps,
  mapDispatchToProps
)((props: any) => {
  const location = useLocation();
  const [currentRouteNotIsolate] = useState(
    !RoutingService.isIsolateRoutes(location.pathname)
  );
  const [isLoginFromRemoteSite] = useState(
    !!new URLSearchParams(location.search).get("officeid")
  );
  useEffect(() => {
    const listner = (e: Event) => {
      ReactTooltip.hide();
    };
    document.addEventListener("click", listner);
    return () => {
      document.removeEventListener("click", listner);
    };
  }, []);
  const { isLoggedIn } = props?.authModel?.auth;
  return (
    <div className="wrapper router-container">
      {isLoggedIn && currentRouteNotIsolate ? <HeaderComponent /> : null}
      <>
        {isLoggedIn && currentRouteNotIsolate ? <LeftNavComponent /> : null}
        <div
          className={
            currentRouteNotIsolate
              ? "right-container " +
                (isLoggedIn ? " content-wrapper " : " login-wrapper ")
              : ""
          }
        >
          {
            <Switch>
              <Route path="/" exact>
                <Redirect to={ClientRoutesConstants.dashboard}></Redirect>
              </Route>
              <PrivateRoute
                path={ClientRoutesConstants.dashboard}
                exact
                component={AsyncDashboardComponent}
              />
              <Route
                path={ClientRoutesConstants.login}
                exact
                render={(propsLogin: any) => {
                  return AuthService.isLoggedIn() && !isLoginFromRemoteSite ? (
                    <Redirect to="/"></Redirect>
                  ) : (
                    <LoginComponent {...propsLogin} />
                  );
                }}
              />
              <Route
                path={ClientRoutesConstants.viewServiceAgreement}
                exact
                component={AsyncViewServiceAgreementComponent}
              />
              <Route
                path={ClientRoutesConstants.logout}
                exact
                component={LogoutComponent}
              />
              <Route
                path={ClientRoutesConstants.register}
                exact
                component={AsyncRegisterComponent}
              />
              <Route
                path={ClientRoutesConstants.forgetPassword}
                exact
                component={AsyncForgetPwdComponent}
              />
              <Route
                path={ClientRoutesConstants.passwordReset}
                exact
                component={AsyncResetPasswordComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.customers}
                component={AsyncCustomerListComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.fastEditAccounts}
                exact
                component={AsyncFastEditAccountsComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.createLetter}
                exact
                component={AsyncCreateLetterComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.createServiceAgreement}
                exact
                component={AsyncCreateServiceAgreementComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.portalIntegration}
                exact
                component={AsyncPortalIntegrationComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.affiliateSignup}
                exact
                component={AsyncAffiliateSignupComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.cbReportViewer}
                exact
                component={AsyncCbReportViewerComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.adminUserAccess}
                exact
                component={AsyncUserAccessComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.reportImporter}
                exact
                component={AsyncReportImporterComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.security}
                exact
                component={AsyncSecurityComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.htmlParser}
                exact
                component={AsyncHTMLReportPrserComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.franchiseOffices}
                component={AsyncFranchiseOfficesListComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.leads}
                component={AsyncLeadsListComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.franchiseAgents}
                component={AsyncFranchiseAgentsListComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.referralOffices}
                component={AsyncReferralOfficesListComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.referralAgents}
                component={AsyncReferralAgentsListComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.viewEmailTemplates}
                component={AsyncEmailTempaltesListComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.masterData}
                exact
                component={AsyncMasterDataComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.serviceTemplates}
                exact
                component={AsyncServiceTempaltesListComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.postGridLetterList}
                component={AsyncPostGridLetterListComponent}
              />
              <PrivateRoute
                path={ClientRoutesConstants.viewServiceAgreement}
                component={AsyncViewServiceAgreementComponent}
              />
              {/* <PrivateRoute
                path={ClientRoutesConstants.viewPostgridLetter}
                exact
                component={AsyncViewPostGridLetterComponent}
              /> */}

              <Route
                path={ClientRoutesConstants.leadAddPublic}
                exact
                component={AsyncPublicCreateLeadComponent}
              />

              <PrivateRoute
                path={ClientRoutesConstants.unauthorized}
                exact
                component={AsyncUnAuthComponent}
              />
              <Route path="*" component={NotFoundComponent} />
            </Switch>
          }
        </div>
        {currentRouteNotIsolate && (
          <FooterComponent isLoggedIn={isLoggedIn}></FooterComponent>
        )}
      </>
    </div>
  );
});
