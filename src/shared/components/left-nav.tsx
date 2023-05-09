import React, { MouseEvent } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";

import AuthService from "../../core/services/auth.service";
import { INavMenu } from "../../models/interfaces/shared";

const mapStateToProps = (state: any) => {
  return {
    sharedModel: state.sharedModel,
  };
};
class LeftNavComponent extends React.PureComponent<any, { menus: INavMenu[] }> {
  constructor(props: any) {
    super(props);
    console.log("TEST_SCR -", props?.sharedModel?.currentAccessibleScreens);
    const availableMenus = AuthService.getLeftMenuOptions(
      props?.sharedModel?.currentAccessibleScreens
    );
    this.state = { menus: availableMenus };
    this.getMenuItems = this.getMenuItems.bind(this);
    this.getSubmenuItems = this.getSubmenuItems.bind(this);
    this.nestedMenuClickHandle = this.nestedMenuClickHandle.bind(this);
    this.nestedMenuClickHandle = this.nestedMenuClickHandle.bind(this);
  }
  componentDidMount() {}
  nestedMenuClickHandle(ev: MouseEvent, menu: INavMenu, index: number) {
    let arr = [...this.state.menus];
    arr.forEach((m: INavMenu) => {
      m.opened = false;
    });
    arr[index].opened = !arr[index].opened;
    arr.splice(index, 1, arr[index]);
    this.setState({
      menus: [...arr],
    });
  }
  getMenuItems(items: INavMenu[]) {
    if (items?.length) {
      return this.state.menus?.map((menu: INavMenu, index: number) => {
        return (
          <li
            className={"treeview " + (menu.opened ? "active" : "")}
            key={index}
          >
            <NavLink
              to={menu.url || ""}
              onClick={(e) => this.nestedMenuClickHandle(e, menu, index)}
            >
              <i className={menu?.iconClass}></i>
              <span title={menu?.tooltip}>{menu?.text}</span>
              {menu?.submenus?.length ? (
                <span className="pull-right-container">
                  <i className="fa fa-angle-left float-right"></i>
                </span>
              ) : null}
            </NavLink>
            <ul
              className={
                "treeview-menu " +
                (menu?.submenus?.length && menu.opened ? "d-block" : "d-none")
              }
            >
              {this.getSubmenuItems(menu?.submenus)}
            </ul>
          </li>
        );
      });
    }
  }
  getSubmenuItems(items?: INavMenu[]) {
    if (items?.length) {
      return items.map((menu: INavMenu) => {
        return (
          <li key={menu?.text}>
            <NavLink to={menu.url} title={menu?.tooltip}>
              {menu?.text}
            </NavLink>
          </li>
        );
      });
    }
  }

  render() {
    const { menus: ms } = this.state;
    return ms?.length ? (
      <aside className="main-sidebar" id="main-sidebar">
        <div className="sidebar">
          <ul className="sidebar-menu">{this.getMenuItems(ms)}</ul>
        </div>
      </aside>
    ) : null;
  }
}
export default connect(mapStateToProps)(withRouter(LeftNavComponent));
