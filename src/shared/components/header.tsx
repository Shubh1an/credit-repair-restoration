import React from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ClientRoutesConstants } from '../constants';
import { MenuComponent } from './menu';
import { GlobalCustomerSearch } from './global-customer-search';
import AuthService from '../../core/services/auth.service';
import { AutoCompleteSearchTypes, EnumRoles } from '../../models/enums';
import { SearchCustomersComponent } from './search-customers';
import { SiteLogoComponent } from './site-logo';
import { leftMenuOpened, toggleToDoShared } from '../actions/shared.actions';
import { IToDo } from '../../models/interfaces/customer-view';

class HeaderComponent extends React.PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        const payload = AuthService.getCurrentJWTPayload();
        const currRole = AuthService.currentRole();
        this.state = {
            searchOpened: false,
            showCustomerSearch: currRole !== EnumRoles.Customer,
            isAdmin: currRole === EnumRoles.Administrator,
            selectedSearch: null,
            currRole,
            fullName: (payload?.firstName || '') + ' ' + (payload?.lastName || '')
        };
        this.togggleSdeBar = this.togggleSdeBar.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.onSearchSelectedData = this.onSearchSelectedData.bind(this);
        this.docClickHandler = this.docClickHandler.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.onNotifyClick = this.onNotifyClick.bind(this);
    }
    componentDidMount() {
        document.addEventListener('click', this.docClickHandler);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.docClickHandler);
    }
    docClickHandler(e: any) {
        this.props?.toggleLeftMenu(!(isMobile ? true : this.props.sidebarCollapsed));
        if (isMobile) {
            document.body.classList.add('sidebar-collapse');
            document.body.classList.remove('sidebar-open');
        }
    }
    togggleSdeBar(e: any) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDrawer();
    }
    toggleSearch() {
        this.setState((state: any) => {
            return {
                searchOpened: !state.searchOpened
            }
        });
    }
    toggleDrawer() {
        this.props?.toggleLeftMenu(!this.props?.leftMenuOpened);
        document.body.classList.toggle('sidebar-collapse');
        document.body.classList.toggle('sidebar-open');
    }
    onSearchSelectedData(data: any) {
        this.toggleSearch();
        this.setState((state: any) => {
            return {
                ...state,
                selectedSearch: data
            }
        });
    }
    onNotifyClick(e: any) {
        e.preventDefault();
        this.props?.toggleToDoShared();
    }
    render() {
        const { searchOpened, showCustomerSearch, isAdmin, fullName, currRole, selectedSearch } = this.state;
        const { leftMenuOpened } = this.props;
        return (
            <header className="main-header" id="main-header">
                <SiteLogoComponent {...this.props} sidebarCollapsed={!leftMenuOpened} allowEditLogo={true} />
                <nav className="navbar navbar-expand py-0">
                    <a href="/" onClick={this.togggleSdeBar} className="sidebar-toggle">
                        <span className="sr-only">Toggle navigation</span>
                        <span className={"pe-7s-angle-" + (!leftMenuOpened ? "right" : "left") + "-circle"}></span>
                    </a>
                    {
                        showCustomerSearch &&
                        <div className='header-search-box'>
                            <div className='lead-cust-search-box'>
                                <SearchCustomersComponent autoFocus={true} searchTypes={AutoCompleteSearchTypes.CUSTOMER_LEAD} minSearchLength={3}
                                    onSelectedData={this.onSearchSelectedData} placeholder="search clients and leads ..."
                                    defaultValue={selectedSearch?.fullName || ''} />
                            </div>
                            <div id="search" className={searchOpened ? "open" : ""}>
                                <button type="button" className="close" onClick={this.toggleSearch}>×</button>
                                <GlobalCustomerSearch selected={selectedSearch} autoFocus={true} onClose={this.toggleSearch} />
                            </div>
                        </div>
                    }

                    <div className="collapse navbar-collapse navbar-custom-menu">
                        <ul className="navbar-nav ml-auto">
                            <div className='user-details pr-sm-4' title={currRole}>
                                <span className='prefix'>Welcome,&nbsp;</span><span>{fullName}</span>
                            </div>
                            {
                                <MenuComponent
                                    iconComponent={
                                        <>
                                            <i className="pe-7s-bell"></i>
                                            <span className="label bg-warning">{this.props?.todos?.length || 0}</span>
                                        </>
                                    }
                                    subComponents={
                                        <>
                                            {
                                                this.props?.todos?.map((item: IToDo, indd: number) => (
                                                    <a key={indd} className="dropdown-item" href="/" onClick={this.onNotifyClick}>
                                                        <div className="menuers">
                                                            <div className="single_menuers_item">
                                                                <h3 className='m-0 d-flex align-items-center'>
                                                                    <i className="fa fa-check-circle"></i>
                                                                    <span className=' html-content' dangerouslySetInnerHTML={{ __html: item?.toDoText }}></span>
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))
                                            }
                                        </>
                                    }
                                    containerCssClass="tasks-menu"
                                />
                            }
                            {
                                isAdmin &&
                                <>
                                    <MenuComponent
                                        iconComponent={
                                            <i className="pe-7s-settings"></i>
                                        }
                                        subComponents={
                                            <>
                                                <Link className="dropdown-item" to={ClientRoutesConstants.adminUserAccess}> <i className="fa fa-universal-access"></i> User Access </Link>
                                                <Link className="dropdown-item" to={ClientRoutesConstants.portalIntegration}> <i className="pe-7s-global text-dark mr-1 ml-1 font-weight-bold"></i> Portal Integration </Link>
                                                {/* <Link className="dropdown-item" to={ClientRoutesConstants.dashboard} ><i className="fa fa fa-bullhorn"></i> Lan settings</Link> */}
                                                <Link className="dropdown-item" to={ClientRoutesConstants.dashboard} ><i className="fa fa-cog"></i> Settings</Link>
                                                {/* <Link className="dropdown-item" to={ClientRoutesConstants.dashboard} ><i className="fa fa-wifi"></i> wifi</Link> */}
                                            </>
                                        }
                                        containerCssClass="dropdown-help"
                                    />
                                </>
                            }
                            <MenuComponent
                                iconComponent={
                                    <i className="pe-7s-power"></i>
                                }
                                subComponents={
                                    <>
                                        {/* <Link className="dropdown-item" to={ClientRoutesConstants.dashboard} ><i className="fa fa-user"></i> User Profile</Link>*/}
                                        <Link className="dropdown-item" to={ClientRoutesConstants.security}><i className="fa fa-lock"></i> Security</Link>
                                        <Link className="dropdown-item" to={ClientRoutesConstants.logout}><i className="fa fa-sign-out"></i> Logout</Link>
                                    </>
                                }
                                containerCssClass="dropdown-user"
                            />
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }

}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        toggleToDoShared,
        toggleLeftMenu: leftMenuOpened,
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        toggleToDo: state?.sharedModel?.toggleToDo,
        todos: state?.sharedModel?.todos,
        leftMenuOpened: state?.sharedModel?.leftMenuOpened,
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)