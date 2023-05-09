export enum NotesTypes {
  ClientNotes = "Customer Note",
  ProcessingNotes = "Internal Customer Note",
}
export enum GrantType {
  password = "password",
  refresh_token = "refresh_token",
}
export enum Alignment {
  Horizontal = "horizontal",
  Vertical = "vertical",
}
export enum AccountTypes {
  Inquiry = "inquiry",
  PersonalInfo = "personal infomation",
  NonClose = "non-close",
}
export enum EnumBureaus {
  TransUnion = "TransUnion",
  Experian = "Experian",
  Equifax = "Equifax",
}
export enum EnumBureausShorts {
  TU = "TU",
  EXP = "EXP",
  EQF = "EQF",
  CREDITOR = "Creditor",
  CC = "CC",
  BCC = "BCC",
  CRA = "CRA",
}
export enum EnumControlTypes {
  Number = "Number",
  TextBox = "TextBox",
  TextArea = "TextArea",
  Checkbox = "Checkbox",
  AutoComplete = "AutoComplete",
  DrowpDown = "DrowpDown",
  DatePicker = "DatePicker",
  ReadOnly = "ReadOnly",
}
export enum EnumComponentMode {
  Edit = "Edit",
  Add = "Add",
}
export enum EnumSearchOptions {
  Complete = "Complete",
  OnHold = "OnHold",
  Cancelled = "Cancelled",
}

export enum EnumRoles {
  Administrator = "Administrator",
  Processor = "Processor",
  Customer = "Customer",
  CreditAgent = "Credit Agent",
  OfficeManager = "Office Manager",
  ReferralManager = "Referral Manager",
  ReferralAgent = "Referral Agent",
  Lead = "Lead",
}
export enum CollectionEntryTypes {
  AccountName = "AccountName",
  AccountType = "AccountType",
  AccountStatus = "AccountStatus",
  Outcome = "Outcome",
  Reason = "TailEndDisputeReason",
  Service = "Service",
  ServiceLevel = "ServiceLevel",
  ServiceOption = "ServiceOption",
}
export enum GlobalParams {
  globalReason = "globalReason",
  globalOutcome = "globalOutcome",
  globalAccType = "globalAccType",
}
export enum SearchType {
  Complete,
  Contains,
  StartsWith,
  DateRange,
}
export enum LetterSearchTypes {
  Equifax = "Equifax",
  ChexSystems = "Chex Systems",
  Experian = "Experian",
  TransUnion = "TransUnion",
  Creditor = "Creditor",
  BCC = "BCC",
  CC = "CC",
  CRA = "CRA",
}
export enum Outcome {
  REPAIRED = "Repaired",
  DELETED = "Deleted",
  IN_PROGRESS = "In Progress",
  IN_DISPUTE = "In Dispute",
  DO_NOT_DISPUTE_BY_CONSUMER = "Do Not Dispute By Consumer",
  SATISFACTORY = "Satisfactory",
  VerifiedByFCRA = "Account Verified by the FCRA",
}
export enum LetterOptionsConfirm {
  END_CURRENT = "END CURRENT",
  RESTART = "RESTART",
  UPDATE_SCORES = "UPDATE SCORES",
  NONE = "NONE",
}
export enum EnumFieldRights {
  Show = "Show",
  Hide = "Hide",
  ReadOnly = "ReadOnly",
}
export enum EnumScreens {
  Application = "Application",
  Dashboard = "Dashboard",
  CustomerList = "CustomerList",
  CustomerDetails = "CustomerDetails",
  AddCustomer = "AddCustomer",
  FastEdit = "FastEdit",
  CreateLetter = "CreateLetter",
  ReportImporter = "ReportImporter",
  ViewFranchiseOffices = "ViewFranchiseOffices",
  AddFranchiseOffice = "AddFranchiseOffice",
  ViewReferralOffices = "ViewReferralOffices",
  AddReferralOffice = "AddReferralOffice",
  ViewReferralAgents = "ViewReferralAgents",
  AddReferralAgent = "AddReferralAgent",
  ViewFranchiseAgents = "ViewFranchiseAgents",
  AddFranchiseAgent = "AddFranchiseAgent",
  ViewLeads = "ViewLeads",
  AddLead = "AddLead",
  LetterTemplates = "LetterTemplates",
  ServiceTemplates = "ServiceTemplates",
  AdminSettings = "AdminSettings",
  PortalIntegration = "PortalIntegration",
  AffiliateSignUp = "AffiliateSignUp",
  CBReportViewer = "CBReportViewer",
  UserAccess = "UserAccess",
  Security = "Security",
  HTMLParser = "HTMLParser",
  MasterData = "MasterData",
  ViewReferralOfficesAgentsTab = "ViewReferralOfficesAgentsTab",
  CreatePostGridLetter = "CreatePostGridLetter",
  PostGridLetterList = "PostGridLetters",
  ViewPostgridLetter = "ViewPostgridLetter",
  ViewServiceAgreement = "ViewAgreement",
}

export enum ToDoTargetTypes {
  CUSTOMER = "CUSTOMER",
  FRANCHISE_AGENT = "FRANCHISE_AGENT",
  REFERRAL_AGENT = "REFERRAL_AGENT",
  LEAD = "LEAD",
  ADMIN = "ADMINISTRATOR",
  OFFICEMANAGER = "OFFICEMANAGER",
  PROCESSOR = "PROCESSOR",
  REFERRALMANAGER = "REFERRALMANAGER",
}
export enum AutoCompleteSearchTypes {
  CUSTOMER = "CUSTOMER",
  CUSTOMER_LEAD = "CUSTOMER_LEAD",
  FRENCHISE_AGENT = "FRENCHISE_AGENT",
  REFERRAL_AGENT = "REFERRAL_AGENT",
  LEAD = "LEAD",
}
export enum ReferralCustomerTypes {
  Primary = 0,
  Associated = 1,
}
export enum EmailTemplatesTypes {
  CustomerWelcome = 1,
  ReferralAgentWelcome = 2,
  Reminder15Days = 3,
  Reminder35Days = 4,
  NoticeOfAccountUpdate = 5,
  NoticeOfAccountUpdateWithDeletes = 6,
  ReferralAgentFollowUp = 7,
}
export enum IMAGETYPES {
  SITE_LOGO,
  FRANCHISE_OFFICE_LOGO,
}

export enum SortOrderType {
  ASC = "ASC",
  DESC = "DESC",
}
export enum EmailTemplateOptionTypes {
  CC = "CC",
  BCC = "BCC",
  SENDER = "SENDER",
}
