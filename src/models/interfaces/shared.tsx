import { CancelToken, CancelTokenSource } from "axios";
import { FC } from "react";
import {
  Alignment,
  AutoCompleteSearchTypes,
  EnumBureausShorts,
  EnumFieldRights,
  EnumRoles,
  EnumScreens,
  IMAGETYPES,
  SearchType,
} from "../enums";
import { ICustomerShort, IToDo } from "./customer-view";

export interface IPayLoad {
  type: string;
  payload: any;
}

export interface ILocalStorage {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}
export interface INavMenu {
  id: string;
  screenId?: EnumScreens;
  text: string;
  tooltip?: string;
  url: string;
  opened?: boolean;
  iconClass?: string;
  submenus?: INavMenu[];
}
export interface IAlphabetProps {
  onSelect: (text: string) => void;
  text?: string;
  selected?: string;
}
export interface ISearchBoxProps {
  onSelect?: (item: any) => any;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  minSearchLength: number;
  getCustomer: (
    cidOrText: string,
    source: CancelTokenSource,
    includeLeads?: boolean
  ) => any;
  onSelectedData?: (data?: ICustomerShort) => any;
  showSubmitArrow?: boolean;
  isTextArea?: boolean;
  onChange?: any;
  searchTypes: AutoCompleteSearchTypes;
  getLeads: (payload: any, source: CancelTokenSource, cidOrText: string) => any;
  getFranchseAgentsList: (
    payload: any,
    source: CancelTokenSource,
    cidOrText: string
  ) => any;
  getReferralAgentsList: (
    payload: any,
    source: CancelTokenSource,
    cidOrText: string
  ) => any;
  autoFocus?: boolean;
}
export interface IDropdown {
  name?: string;
  abbreviation?: string;
}
export interface ICheckbox {
  disabled?: boolean;
  checked?: boolean;
  groupName?: string;
  value?: any;
  text?: string | FC<any> | undefined | EnumBureausShorts;
  circled?: boolean;
  height?: string;
  width?: string;
  title?: string;
  cssClass?: string;
  onChange?: (param: any) => void;
  enableClickOnDisabled?: boolean;
  disableLabelClick?: boolean;
}
export interface ICheckboxList {
  disabled?: boolean;
  value: any;
  text: string | any;
  title?: string;
  cssClass?: string;
}
export interface ICheckBoxListInput {
  list: ICheckboxList[];
  selectedValues: string[];
  onChange: (
    param: string[],
    current?: { value: any; checked: boolean }
  ) => void;
  alignment: Alignment;
  title?: string;
  cssClass?: string;
  enableRemove?: boolean;
  onRemove?: (item: ICheckboxList, index: number) => void;
  enableClickOnDisabled?: boolean;
  disableLabelClick?: boolean;
}
export interface IValueText {
  value: any;
  text: string;
}
export interface INavOptions {
  cid: string;
  current: string;
  label?: string;
  currentAccessibleScreens: string[];
}
export interface INameValue {
  Name: string;
  Value: string;
}
export interface INameValueSmall {
  name: string;
  value: string;
}
export interface INameValueMatch extends INameValue {
  Match?: SearchType;
}
export interface ICBFilesModel {
  folderName: string;
  filePath: string;
  fileName: string;
  fullPath: string;
  formattedDate: string;
}
export interface IValueTextExtra extends IValueText {
  path: string;
  websiteName: string;
  isOutsourced?: boolean;
}
export interface IValueTextRole extends IValueText {
  roles?: string[];
}
export interface ICollectionEntry {
  id: string;
  name: string;
}
export interface IJwtPayload {
  sub: string;
  membershipId: string;
  id: string;
  tenant: string;
  firstName: string;
  lastName: string;
  siteId: string;
  roles: EnumRoles;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
  cid?: string; // customer id
  fid?: string; // franchise agent id
  rid?: string; // refferral agent id
  lid?: string; // lead id
  isMainOffice: boolean;
  mainFranchiseOfficeId?: string;
  isOutsourced?: boolean;
  logedInUserFAgent?: string; // current logged in user's Franchise AgentId
}
export interface IScreenProps {
  screen: IScreenDescription;
  fields: IFieldDescription[];
}
export interface IScreenDescription {
  name: EnumScreens | string;
  rules: IFieldSettings[];
  description: string;
}
export interface IFieldDescription {
  id?: string;
  name: string;
  rules: IFieldSettings[];
  description: string;
}
export interface IFieldSettings {
  role: EnumRoles;
  right: EnumFieldRights;
}
export interface ISharedState {
  AuthRules?: IScreenProps[] | null;
  isLoaderShown?: boolean;
  loaderInnerMessage?: string;
  isLoaderShownInner?: boolean;
  currentAccessibleScreens: string[] | null;
  logoChangedKey?: number;
  todos: IToDo[];
  toggleToDo?: boolean;
  passwordNotStrong?: boolean;
  leftMenuOpened?: boolean;
}
export interface IMediaPayload {
  type: IMAGETYPES;
  imageBase64: string;
  officeId?: string;
  siteId?: string;
}
export interface IRoundAddModel {
  startDate?: string;
  endDate?: string;
  eqfScore?: string;
  expScore?: string;
  tuScore?: string;
}
export interface IUpdateServiceRequest {
  serviceId: string;
  name: string;
  description: string;
  isDeleted?: boolean;
}
