import React from "react";
import { EnumBureausShorts, Outcome } from "../models/enums";
import { ICheckboxList, IValueText } from "../models/interfaces/shared";
import { BureauLogoComponent } from "./components/bureau-logo";

export const Constants = {
  authSessionKey: "auth",
  siteLogoPath: "/images/logo/{0}/SiteLogo.jpeg",
  siteLogoMiniPath: "/images/logo/{0}/SiteLogoMini.jpeg",
  officeLogoPath: "/images/logo/{0}/offices/{1}/OfficeLogo.jpeg",
  officeLogoMiniPath: "/images/logo/{0}/offices/{1}/OfficeLogoMini.jpeg",
};
export const POSTGRID_API_KEY = {
  testKey: "test_sk_gREnmKjMYFq4GVj3qkT4LX",
  liveKey: "live_sk_kdWqdnvrtXvvz2mP5HCGJZ",
};
export const APIConstants = {
  auth: "/login",
  getStats: "/stats",
  getCustomers: "/customer",
  getCustomer: "/customer/{0}", //{customerid}
  getCustomerMinimaldetails: "/customer/{0}/minimaldetails", //{customerid}
  saveFeeDetails: "/customer/updatefeeinfo",
  saveCreditMonitoring: "/customer/updatemonitoringdetail",
  saveGeneralNotes: "/customer/updategennotes",
  updateUserName: "/customer/updateusername",
  updatePassword: "/customer/updatepassword",
  checkS3Files: "/customer/GetS3JSONRecentFiles",
  getS3SingleFile: "/customer/gets3jsonfiledata",
  adminsettings: "/customer/adminsettings",
  submitRounds: "/customer/submitrounds",
  submitQuery: "/customer/submitquery/{0}",
  customerFranchAgents: "/customer/franchiseagent",
  customerReferAgents: "/customer/referralagent",
  updateCustomerAgent: "/customer/agent",
  disputeProgress: "/customer/getdisputeprogressstatistics/{0}", // {0} cid
  resendWelcomeEmail: "/customer/resendwelcomeemail/{0}", // {0} customerid
  submitToProcessing: "/customer/SubmitToProcessing/{0}", // {0} customerid
  submitToArrayReport: "/customer/arraysubscription/{0}", // {0} customerid
  creditmonitoringsubscription: "/customer/creditmonitoringsubscription/{0}", // {0} customerid
  sendPORneeded: "/customer/sendporneeded/{0}", // {0} customerid
  removeSpouse: "/customer/removespouse/{0}/{1}", // {0} customerid {1} soupseid
  fastEditAccounts: "/customer/getaccounts",
  customerReferralAgents: "/customer/referralpartners/{0}", // {0} customerid {1}
  addUpdateCustomerReferralAgents: "/customer/referralpartners/{0}/{1}/{2}", // {0} customerid {1} -agentid,{2} rolename
  deleteCustomerReferralAgents: "/customer/referralpartners/{0}/{1}", // {0} customerid {1} -agentid
  toDos: "/todo/{0}/{1}", // {0} cid, {1} enum ToDoTargetTypes
  toDoUpdate: "/todo/{0}", // {0} todoid
  getCustomersCount: "/dashboard/customer",
  getFranchiseAgentsCount: "/dashboard/franchise",
  getReferralAgentsCount: "/dashboard/referral",
  getCustomerLettersCount: "/dashboard/customerLetter",
  getRolesCount: "/dashboard/role",
  getFranchiseAgents: "/common/franchiseagents",
  getReferralAgents: "/common/referralagents",
  getStates: "/common/states",
  checkPartnerkey: "/common/checkpartnerkey/{0}", // {officeid}
  checkAPIActive: "/common/checkapiactive/{0}", // api name {MailChimp}
  searchCollection: "/common/search/{0}?q={1}&l={2}", // {0} enumb CollectionEntryTypes,{1} text,{2} maxrecords
  getAllBureaus: "/common/bureaus",
  getAllLetterTypes: "/common/disputeLetterTypes",
  getRoles: "/",
  getCustomerLetters: "/",
  getScoringRoundStatuses: "/scoring/statuses",
  checkSubscriberListsByEmail: "/mailchimp/checkSubscriberListsByEmail",
  getMailchimpLists: "/mailchimp/getMailchimpLists",
  checkSubscriberCampaignsByEmail: "/mailchimp/checkSubscriberCampaignsByEmail",
  setMailchimpList: "/mailchimp/setMailchimpList",
  getAPIIntegrations: "/mailchimp/getAPIIntegrations",
  setAPIActive: "/mailchimp/setAPIActive",
  updateAPIKey: "/mailchimp/updateAPIKey",
  updateRound: "/scoring/round",
  deleteRound: "/scoring/round/{0}",
  addNewRound: "/scoring/addNewRound/{0}", // cid
  saveClientNote: "/note",
  processingNote: "/internalnote",
  getCannedNotes: "/cannednote/{0}", // noteType {0}
  createCannedNote: "/cannednote?note={0}&noteType={1}",
  collectionAccount: "/collectionaccount",
  account: "/account?accountId={0}&customerId={1}",
  file: "/file",
  updateFile: "/file?fileId={0}&filetype={1}&isLead={2}",
  disputeletter: "/disputeletter",
  serviceAgreement: "/disputeletter",
  letter: "/letter",
  downloadFileLetter: "/file?filePath={0}", // {0} file path coming from BE,
  updateCollectorAddress: "/fastedit/updateaddress",
  saveFEAccounts: "/fastedit/saveaccounts",
  saveFEAccountsMini: "/fastedit/saveminiaccount",
  updateYellowAccount: "/fastedit/removeupdated/{0}", // {0} ccid
  addNewAccount: "/fastedit/createnewaccount",
  getFELetterData: "/fastedit/getletterdata/{0}", // {0} cid
  getFEFullAccountDetails: "/fastedit/getaccountdetail/{0}", // {0} ccid
  saveFullAccountDetails: "/fastedit/fullsave",
  deleteBureauDetail: "/fastedit/deletebureau/{0}/{1}", // {0} cabid {1} ccid
  getPDFDisputeLetters: "/disputeletter/{0}", // {cid}
  getPDFServiceAgreementLetters: "/disputeletter/{0}", // {cid}
  getTempLetterQueue: "/letter/tempqueue/{0}", // {cid}
  letterSearch: "/letter/{0}?query={1}",
  createCredBCCLetter: "/letter/createcredccbcctempletter",
  createCRALetter: "/letter/createsingletempletter",
  createBureauLetter: "/letter/createtempletter",
  deleteTempLetter: "/letter/deletetempletterqueue",
  saveTempLetter: "/letter/savequeueletter",
  ccList: "/letter/CCList/{0}", // {0} cid
  createPDFLetter: "/letter/createpdfletters",
  restartRound: "/letter/startrestartround",
  setRounds: "/letter/setrounds",
  sendNoticeAccUpdate: "/letter/sendNoticeAccUpdate",
  regenerateNoticeAccountUpdate: "/letter/regeneratenoticeaccountupdate/{0}", // {0} cid
  getAuthRules: "/viewaccess/byrole",
  allAuthRules: "/viewaccess",
  useraccessDelete: "/ViewAccess/DeleteScreen/{0}", // screen name
  useraccessUpdate: "/ViewAccess/UpdateScreen",
  useraccessFieldDelete: "/ViewAccess/DeleteField/{0}", // field id
  useraccessFieldUpdate: "/ViewAccess/UpdateField", //
  importSave: "/importer",
  getS3JSONFileData: "/importer/getS3JSONFileData?fileName={0}", // filename
  freeTrialImporter: "/importer/getFreeTrialCredit",
  forgotPasswordLInk: "/userAccount/sendResetPasswordLink",
  verifyResetLink: "/userAccount/verifyResetPasswordLink",
  resetPassword: "/userAccount/resetPassword",
  franchiseOffices: "/franchiseOffices",
  getFranchiseOfficeDetails: "/franchiseOffices/{0}", // {0} office id
  getFranchiseOfficeAgents: "/franchiseOffices/{0}/agents", // {0} office id
  getCurrentOfficeAgents: "/franchiseOffices/currentOfficeAgents",
  getFranchiseSingleAgentDetails: "/franchiseAgents/{0}", //{0} agentid
  updateFranchiseAgent: "/franchiseAgents",
  getFranchiseAgentRoles: "/franchiseAgents/roles",
  getFranchiseOfficeServices: "/franchiseOffices/{0}/services", // {0} office id
  getFranchiseOfficeOutsourcedServices: "/franchiseOffices/{0}/services", // {0} office id
  createFranchiseOfficeServices: "/franchiseOffices/services", // {0} office id
  deleteFranchiseOfficeServices: "/franchiseOffices/{0}/services/{1}", // {0} office id,{1} service id
  getFranchiseOfficePayments: "/franchiseOffices/{0}/payments", // {0} office id
  deleteFranchiseOfficePayment: "/franchiseOffices/{0}/payments/{1}", // {0} office id,{1} paymentid
  getLeads: "/lead/getall", // {0} --query
  getSingleLeads: "/lead/{0}", // leadid
  resendLeadWelcomeEmail: "/lead/resendwelcomeemail/{0}", // {0} leadid
  addLead: "/lead",
  convertToCustomer: "/lead/ConvertToCustomer/{0}/{1}", // {0} --leadid,{1}- notify agent?
  leadCreditMonitoring: "/lead/CreditMonitoring",
  leadAgentUpdate: "/lead/agent",
  getFranchiseAgentsList: "/franchiseAgents/getall", // {0} --query
  getFranchiseAgentNotes: "/franchiseAgents/notes/{0}", // {0} --membershipid of agent or note id to delete
  addFranchiseAgentNote: "/franchiseAgents/notes",
  getFranchiseAgentCustomers: "/franchiseAgents/{0}/customers", //0- agent id
  getFranchiseAgentReferrals: "/franchiseAgents/{0}/referralPartners", //0- agent id
  franchAgentWelcomeEmail: "/franchiseAgents/ResendWelcomeEmail/{0}",
  referralOffices: "/referralOffices",
  getReferralOfficeDetails: "/referralOffices/{0}", // {0} office id
  getReferralOfficeAgents: "/referralOffices/{0}/agents", // {0} office id
  getReferralOfficeAgentDetails: "/referralAgent/{0}", // {1} agentid
  reassignReferralOffices: "/referralOffices/reassign/{0}/{1}", // {0} current id,{1} asign to id
  updateReferralAgent: "/referralAgent",
  getReferralSingleAgentDetails: "/referralAgents/{0}",
  referralAgentChangePassword: "/referralAgent/ChangePassword",
  resendWelcomeAgentEmail: "/referralAgent/ResendWelcomeEmail/{0}", // agent id
  resendFollowUpAgentEmail: "/referralAgent/ResendFollowUpEmail/{0}", // agent id
  getReferralAgentsList: "/referralAgent/getall", // {0} --query
  getReferralAgentCustomers: "/referralAgent/{0}/customers/{1}", //0- agent id, 1- type 0/1
  getAllEmailTemplates: "/lettertemplate/getall",
  getAllSubFieldsForSection: "/lettertemplate/getSubSectionTypes/{0}", // accounts/names/inquires
  getFinalCollectionToken: "/lettertemplate/getFinalCollectionToken",
  emailTemplate: "/lettertemplate/{0}", /// letter id
  emailTemplateUpdate: "/lettertemplate",
  emailTemplateCustomerTokens: "/lettertemplate/getCustomersFieldTokens",
  emailTemplateFieldTokens: "/lettertemplate/getFieldsTokens",
  emailTemplateGenerateHTMLPreview: "/lettertemplate/GenerateHTMLPreview",
  getEmailTemplatesByOfficeId:
    "/lettertemplate/GetEmailTemplatesByOfficeId/{0}", // office id
  setEmailTemplateActive: "/lettertemplate/SetEmailTemplateActive/{0}/{1}/{2}", // ofc id, letter IdleDeadline, active/or not
  getEmailTemplatesById: "/lettertemplate/GetEmailTemplatesById/{0}",
  updateOfcEmailTemplate: "/lettertemplate/UpdateOfcEmailTemplate",
  getSavedSampleTemplates: "/lettertemplate/GetSavedSampleTemplates/{0}", // email type
  getOfficeLeadFormOptions: "/lettertemplate/GetOfficeLeadFormOptions/{0}", // ofc id
  updateOfficeLeadFormOptions:
    "/lettertemplate/UpdateOfficeLeadFormOptions/{0}", // ofc id
  createOfficeLeadFormOptions: "/lettertemplate/CreateOfficeLeadForm/{0}", // ofc id
  emailTemplateOptions: "/lettertemplate/emailTemplateOptions/{0}/{1}", // templateid and data type
  removeEmailTemplateOptions: "/lettertemplate/emailTemplateOptions/{0}", // id
  getPublicToken: "/GetAccessToken/{0}", // tenant name
  getSiteLogos: "/media/getSiteLogos",
  uploadLogo: "/media/upload",
  removeLogo: "/media/delete/office/{0}", // 0 ofc id
  allOutsourcedServices: "/service/getall",
  outsourceFranchiseService: "/service",
  collectionEntry: "/collectionEntry",
  getFranchiseMasterServices: "/service/getall",
  createFranchiseMasterServices: "/service",
  franchiseMasterServiceLevel: "/servicelevel",
  franchiseMasterServiceAdons: "/serviceAddOn",
  getFranchiseMasterServiceCategories: "/ServicePricing/{0}", // serviceid
  saveFranchiseMasterServiceCategories: "/ServicePricing",
  removeFranchiseServiceCategory: "/ServicePricing/category/{0}",
  removeFranchiseServiceCategoryLevel: "/ServicePricing/level/{0}",
  removeFranchiseServiceCategoryLevelOption: "/ServicePricing/addons/{0}",
  getFranchiseOfficeAvailableServices:
    "/FranchiseOfficeServicePricing/GetAllServicesAvailable/{0}",
  getFranchiseOfficeAvailableCategories:
    "/FranchiseOfficeServicePricing/Get/{0}/{1}", // {0} franchise office id, {1} master serviceid
  saveCatogoryForFranchiseOffice: "/FranchiseOfficeServicePricing",
  removeCategoryFromOffice: "/FranchiseOfficeServicePricing/ServicePricing/{0}", // servicePricingId
  removeAddOnFromOffice: "/FranchiseOfficeServicePricing/addons/{0}", // pricingAddOnId
  removeLevelFromOffice: "/FranchiseOfficeServicePricing/Level/{0}", // pricingLevelId
  getFranchiseOfficeAllPricings: "/FranchiseOfficeServicePricing/GetAll/{0}", // office id
  getAllServiceAgreements: "/serviceagreement/getall",
  PostGridLetter: "/v1/letters",
  PostGridContacts: "/v1/contacts",
  PostGridTemplates: "/v1/templates",
  serviceTemplateUpdate: "/serviceagreementtemplatenew",
  serviceTemplateFieldTokens: "/serviceagreementtemplatenew/getFieldsTokens",
  getserviceAgreementTemplate: "/serviceagreementtemplatenew/{0}",
  serviceTemplateGenerateHTMLPreview:
    "serviceagreementtemplatenew/GenerateHTMLPreview",
  getServiceAgreementSampleTemplates:
    "/serviceagreementtemplatenew/GetSavedSampleTemplates/{0}",
  updateOfcServiceTemplate:
    "/serviceagreementtemplatenew/UpdateOfcEmailTemplate",
  getAllServiceTemplates: "/serviceagreementtemplatenew/getall",

  createServiceAgreement: "/serviceagreement",
  getServiceTemplatesById:
    "/serviceagreementtemplatenew/GetEmailTemplatesById/{0}",
};
export const ClientRoutesConstants = {
  notFound: "/notFound",
  unauthorized: "/unauthorized",
  dashboard: "/dashboard",
  login: "/login",
  logout: "/logout",
  forgetPassword: "/forget-password",
  register: "/register",
  security: "/security",
  customers: "/customers",
  customersAdd: "/customers/add",
  customersView: "/customers/:cid",
  fastEditAccounts: "/fasteditacounts/:cid",
  createLetter: "/createletter/:cid",
  createServiceAgreement: "/createserviceagreement/:aid",
  reportImporter: "/reportimporter/:cid?/:type?",
  leads: "/leads",
  leadAdd: "/leads/add",
  leadAddPublic: "/public/leads",
  viewLeads: "/leads/:id",
  referralAgents: "/referral-agents",
  addReferralAgent: "/referral-agents/add",
  viewReferralAgents: "/referral-agents/:id",
  referralOffices: "/referral-offices",
  addReferralOffice: "/referral-offices/add",
  viewReferralOffices: "/referral-offices/:id",
  franchiseAgents: "/franchise-agents",
  viewFranchiseAgents: "/franchise-agents/:id",
  addFranchiseAgent: "/franchise-agents/add",
  franchiseOffices: "/franchise-offices",
  viewFranchiseOffices: "/franchise-offices/:id",
  addFranchiseOffice: "/franchise-offices/add",
  emailTemplates: "/letter-templates",
  viewEmailTemplates: "/letter-templates/:id?",
  addEmailTemplate: "/letter-templates/add",
  portalIntegration: "/portal-integration",
  affiliateSignup: "/affiliate-signup",
  cbReportViewer: "/cb-report-viewer/:cid/:date",
  adminUserAccess: "/admin/user-access",
  htmlParser: "/htmlParser",
  passwordReset: "/reset-password/:token/:uid",
  masterData: "/master-data",
  serviceTemplates: "/service-templates",
  CreatePostGridLetter: "/create-postgrid-letter",
  postGridLetterList: "/postgrid-letter",
  viewPostgridLetter: "/postgrid-letter/:id",
  viewServiceAgreement: "/view-service-agreement/:id?",
};
export const AccountOutcomes: IValueText[] = [
  {
    value: "",
    text: "- Select -",
  },
  {
    value: Outcome.REPAIRED,
    text: Outcome.REPAIRED,
  },
  {
    value: Outcome.DELETED,
    text: Outcome.DELETED,
  },
  {
    value: Outcome.IN_PROGRESS,
    text: Outcome.IN_PROGRESS,
  },
  {
    value: Outcome.IN_DISPUTE,
    text: Outcome.IN_DISPUTE,
  },
  {
    value: Outcome.DO_NOT_DISPUTE_BY_CONSUMER,
    text: Outcome.DO_NOT_DISPUTE_BY_CONSUMER,
  },
  {
    value: Outcome.VerifiedByFCRA,
    text: Outcome.VerifiedByFCRA,
  },
];
export const Messages: any = {
  APIAborted: "API aborted as component unmounted",
  EmptyEmailChimp:
    "Email Address not listed for this lead.  Enter an email address for the lead, and Save your changes first",
  InValidEmailChimp:
    "{0} is not a valid email address.  Enter a valid email address for the lead, and Save your changes",
  MailChimpNotSubscribed:
    "Not yet subscribed to Mailchimp.  Choose from your lists below and click Save",
  GenericError: "Some Error occured! Please try again later.",
};
export const Variables = {
  MIN_PWD_LENGTH: 8,
  EMPTY_GUID: "00000000-0000-0000-0000-000000000000",
  EMPTY_DATE1: "1/1/0001",
  EMPTY_DATE2: "1/1/1900",
  STANDARD_FASTRACK: "Standard and Fast Track",
  BUREAU_LIST1: [
    {
      value: EnumBureausShorts.TU,
      text: <BureauLogoComponent type={EnumBureausShorts.TU} size={"sm"} />,
    },
    {
      value: EnumBureausShorts.EXP,
      text: <BureauLogoComponent type={EnumBureausShorts.EXP} size={"sm"} />,
    },
    {
      value: EnumBureausShorts.EQF,
      text: <BureauLogoComponent type={EnumBureausShorts.EQF} size={"sm"} />,
    },
  ],
  BUREAU_LIST2: [
    {
      value: EnumBureausShorts.CREDITOR,
      text: () => EnumBureausShorts.CREDITOR,
    },
    {
      value: EnumBureausShorts.CC,
      text: () => EnumBureausShorts.CC,
      disabled: true,
    },
    {
      value: EnumBureausShorts.BCC,
      text: () => EnumBureausShorts.BCC,
      disabled: true,
    },
  ],
  EmailTemplatesTypes: {
    WelcomeEmail: "Welcome Email",
    AgentWelcomeEmail: "Referral Agent Welcome Email",
    LeadWelcome: "Lead Welcome Email",
    ReminderEmail: "Reminder Email",
    PullEmail: "Pull Email",
    NoticeAccUpdate: "Account Update",
  },
  EmailTemplatesNames: {
    CustomerWelcome: "Welcome Email",
    ReferralAgentWelcome: "Referral Agent Welcome Email",
    LeadWelcome: "Lead Welcome Email",
    Email15Days: "15 Day Email",
    Email35Days: "35 Day Email",
    NoticeAccUpdate: "Notice of Account Update Email",
    NoticeAccUpdateDeletes: "Notice of Account Update With Deletes Email",
  },
  ClientLoginMessage: `We appreciate the opportunity to serve you and we will work diligently to help you reach your credit goals.<br/>
                        Your first step each time you login is to check if you have any Client Tasks that need to be completed.<br/>    
                        The sooner you complete your tasks, the sooner we can complete your program.<br/><br/>    
                        See if you have any assigned To Do’s toward the bottom of your Client Info tab.<br/>    
                        We will continue to send reminders until your To Do’s are completed.<br/><br/><br/>       
                        
                        Thank you again for allowing us to serve you.`,
  EmailSourceTypes: {
    FRENCHISE_AGENT: "FRENCHISE_AGENT",
    REFERRAL_AGENT: "REFERRAL_AGENT",
    SENDER: "SENDER",
  },
};

export const EmailSourceTypesList: ICheckboxList[] = [
  {
    text: "Credit Agents",
    value: Variables.EmailSourceTypes.FRENCHISE_AGENT,
  },
  {
    text: "Affiliate Agents",
    value: Variables.EmailSourceTypes.REFERRAL_AGENT,
  },
];
export const HTTP_ERROR_CODES = {
  BADREQUEST: 400,
  INTERNALERROR: 500,
  UNAUTHORISED: 403,
  NOTFOUND: 404,
};

export const PASSWORDSTRENGTH = [
  {
    id: 0,
    value: "Too weak",
    minDiversity: 0,
    minLength: 0,
  },
  {
    id: 1,
    value: "Weak",
    minDiversity: 2,
    minLength: Variables.MIN_PWD_LENGTH,
  },
  {
    id: 2,
    value: "Medium",
    minDiversity: 4,
    minLength: Variables.MIN_PWD_LENGTH + 2,
  },
  {
    id: 3,
    value: "Strong",
    minDiversity: 4,
    minLength: Variables.MIN_PWD_LENGTH + 4, // 10
  },
];

export const PageErrors = {
  commonErrors: {
    firstName: "First Name, ",
    lastName: "Last Name, ",
    email: "Email, ",
    emailOrUsername: "Email/Username, ",
    passwordRequired: "Password, ",
    validPassword: "Valid Password, ",
    confirmPassword: "Confirm Password, ",
    validConfirmPassword: "Valid Confirm Password, ",
    usernameRequired: "Username, ",
    passwordMatch: "Passwords do not match!",
  },
  clientPageErrors: {
    processingStatus: "Processing Status, ",
    franchiseId: "Credit(Franchise) Agent, ",
  },
  leadsPageErrors: {
    cellPhone: "Cell Phone, ",
  },
  companyOfficeErrors: {
    officeId: "Office Name, ",
    role: "Role, ",
  },
  affiliateOfficeErrors: {
    agentId: "Credit Agent, ",
    officeName: "Office Name, ",
    officeType: "Office Type, ",

    agentsTab: {
      affiliateOffice: "Affiliate Office, ",
    },
  },
};
