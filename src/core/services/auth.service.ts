import jwt_decode from "jwt-decode";
import memoizeOne from "memoize-one";

import { EnumFieldRights, EnumRoles, EnumScreens } from "../../models/enums";
import {
  IJwtPayload,
  ILocalStorage,
  INavMenu,
  IScreenProps,
} from "../../models/interfaces/shared";
import { RoleMappings } from "../../screens/admin/user-access/role-fields-mapping";
import { Constants } from "../../shared/constants";
import { UrlUtils } from "../../utils/http-url.util";
import { menus } from "../../utils/nav-menu-util";

export default class AuthService {
  static cachedRole = "";
  static inMemorySesssion = null as ILocalStorage | null;
  static get key(): string {
    return Constants.authSessionKey;
  }
  static get partnerKey(): string {
    return UrlUtils.getPartnerKey();
  }
  static get partnerKeyInvalid(): boolean {
    return UrlUtils.isPartnerKeyInvalid();
  }
  static setLogin(data: ILocalStorage) {
    let oldKeys: any = localStorage.getItem(this.key);
    oldKeys = oldKeys ? JSON.parse(oldKeys) : {};
    const json = JSON.stringify({
      ...oldKeys,
      [this.partnerKey]: data,
    });
    console.log("from auth set login", data, this.partnerKey);
    localStorage.setItem(this.key, json);
  }
  static setLoginInMemory(data: ILocalStorage) {
    this.inMemorySesssion = data;
  }
  static setLogout() {
    let oldKeys: any = localStorage.getItem(this.key);
    oldKeys = oldKeys ? JSON.parse(oldKeys) : {};
    let json = { ...oldKeys };
    delete json[this.partnerKey];
    localStorage.setItem(this.key, JSON.stringify(json));
    this.cachedRole = "";
    this.inMemorySesssion = null;
  }
  static getSession(): ILocalStorage | null {
    try {
      const session = localStorage.getItem(this.key);
      if (session) {
        const s = JSON.parse(session);
        return s ? (s[this.partnerKey] as ILocalStorage) : null;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  static isLoggedIn(): boolean {
    const session = this.getSession();
    return !!(session && session.access_token && session.refresh_token);
  }
  static getCurrentJWTPayload(): IJwtPayload {
    const session = this.getSession();
    const payload = session?.access_token
      ? jwt_decode(session.access_token)
      : {};
    return payload as IJwtPayload;
  }
  static currentRole(): EnumRoles {
    if (this.cachedRole) {
      return this.cachedRole as EnumRoles;
    }
    const role = this.getCurrentJWTPayload()?.roles;
    this.cachedRole = role;
    return role;
  }
  static getJWTPayload(token: string): any {
    return jwt_decode(token);
  }
  static getDefaultAccessRules(): IScreenProps[] {
    return RoleMappings;
  }
  static isFieldHidden = memoizeOne(
    (rules: IScreenProps | null, fieldName: string) => {
      const role = AuthService.currentRole();
      console.log("from-field-hidden", rules, fieldName, role);
      const roleEntry = rules?.fields
        ?.find((x) => x?.name?.trim() === fieldName?.trim())
        ?.rules?.find((x) => x.role === role);
      console.log(
        "roleEntry",
        !!roleEntry && roleEntry?.right === EnumFieldRights.Hide
      );
      return !!roleEntry && roleEntry?.right === EnumFieldRights.Hide;
    }
  );
  static isFieldReadOnly = memoizeOne(
    (rules: IScreenProps | null, fieldName: string): boolean => {
      const role = AuthService.currentRole();
      const roleEntry = rules?.fields
        ?.find((x) => x?.name?.trim() === fieldName?.trim())
        ?.rules?.find((x) => x.role === role);
      return !!roleEntry && roleEntry?.right === EnumFieldRights.ReadOnly;
    }
  );
  static isScreenHidden = memoizeOne((rules: IScreenProps): boolean => {
    const role = AuthService.currentRole();
    const roleEntry = rules?.screen?.rules?.find((x) => x.role === role);
    return !!roleEntry && roleEntry?.right === EnumFieldRights.Hide;
  });
  static getAllAccessibleScreens(remoteRules: IScreenProps[]): string[] {
    let screens = [] as string[];
    const currRole = this.currentRole();
    screens = remoteRules
      ?.filter(
        (x: IScreenProps) =>
          !x?.screen?.rules?.some(
            (s) => s?.role === currRole && s?.right === EnumFieldRights?.Hide
          )
      )
      ?.map((x) => x?.screen?.name);
    return screens;
  }
  static getLeftMenuOptions(availableScreenIds: string[]): INavMenu[] {
    let options = [] as INavMenu[];
    const role = this.currentRole();
    menus.forEach((menu: INavMenu) => {
      if (menu?.submenus?.length) {
        const availSubMenus = menu?.submenus?.filter(
          (x) => x?.screenId && availableScreenIds?.includes(x?.screenId)
        );
        if (availSubMenus?.length) {
          options.push({
            ...menu,
            submenus: availSubMenus,
          });
        }
      } else {
        if (menu?.screenId && availableScreenIds?.includes(menu?.screenId)) {
          options.push({ ...menu });
        }
      }
    });
    if (role === EnumRoles.Customer) {
      options = options?.filter((x) => x.id !== "menu-customer");
    }
    return options;
  }
  static getScreenOject(
    mappings: IScreenProps[],
    screen: EnumScreens
  ): IScreenProps | null {
    console.log("from-get-screen-object", mappings, screen);
    return mappings?.find((x) => x?.screen?.name === screen) || null;
  }
  static RedirectToRemoteLoginWindow() {
    const tenant = this.getCurrentJWTPayload()?.tenant;
    window.opener.location.href = `${window.location.origin}/${tenant}/`;
    window.close();
  }
}
