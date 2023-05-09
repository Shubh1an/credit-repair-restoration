import { EnumScreens } from "../models/enums";
import { INavMenu } from "../models/interfaces/shared";
import { ClientRoutesConstants } from "../shared/constants";

export const menus: INavMenu[] = [
  {
    id: "menu-dashboard",
    screenId: EnumScreens.Dashboard,
    text: "Dashboard",
    url: ClientRoutesConstants.dashboard,
    iconClass: "fa fa-tachometer",
    tooltip: "Dashboard",
  },
  {
    id: "menu-customer",
    text: "Clients",
    iconClass: "fa fa-address-book-o",
    tooltip: "Clients",
    opened: false,
    url: ClientRoutesConstants.customers,
    submenus: [
      {
        id: "menu-cust-list",
        screenId: EnumScreens.CustomerList,
        text: "List",
        url: ClientRoutesConstants.customers,
        tooltip: "Clients",
      },
      {
        id: "menu-add-customer",
        screenId: EnumScreens.AddCustomer,
        text: "Add Client",
        url: ClientRoutesConstants.customersAdd,
        tooltip: "Add Client",
      },
    ],
  },
  {
    id: "menu-leads",
    text: "Leads",
    iconClass: "fa fa-group",
    tooltip: "Leads",
    opened: false,
    url: ClientRoutesConstants.leads,
    submenus: [
      {
        id: "menu-add-lead",
        screenId: EnumScreens.AddLead,
        text: "List",
        url: ClientRoutesConstants.leads,
        tooltip: "Leads",
      },
      {
        id: "menu-leads",
        screenId: EnumScreens.ViewLeads,
        text: "Add Lead",
        url: ClientRoutesConstants.leadAdd,
        tooltip: "Add Lead",
      },
    ],
  },
  {
    id: "menu-importer",
    text: "Credit Reports",
    iconClass: "fa fa-exchange rotate-90",
    tooltip: "Credit Reports",
    opened: false,
    url: ClientRoutesConstants.reportImporter
      ?.replace(/\/:type\?/g, "")
      ?.replace(/\/:cid\?/g, ""),
    submenus: [
      {
        id: "menu-add-importer",
        screenId: EnumScreens.ReportImporter,
        text: "Importer",
        url: ClientRoutesConstants.reportImporter
          ?.replace(/\/:type\?/g, "")
          ?.replace(/\/:cid\?/g, ""),
        tooltip: "Open Importer",
      },
    ],
  },
  {
    id: "men-fran-ofc",
    text: "Company Offices",
    iconClass: "fa fa-home",
    tooltip: " Company Offices",
    opened: false,
    url: ClientRoutesConstants.franchiseOffices,
    submenus: [
      {
        id: "menu-fr-view",
        screenId: EnumScreens.ViewFranchiseOffices,
        text: "List",
        url: ClientRoutesConstants.franchiseOffices,
        tooltip: "View  Company Offices",
      },
      {
        id: "menu-fr-ofc-add",
        screenId: EnumScreens.AddFranchiseOffice,
        text: "Add  Company Office",
        url: ClientRoutesConstants.addFranchiseOffice,
        tooltip: "Add  Company Office",
      },
    ],
  },
  {
    id: "menu-fr-agts",
    text: "Company Agents",
    iconClass: "fa fa-user-secret",
    tooltip: "Company Agents",
    opened: false,
    url: ClientRoutesConstants.franchiseAgents,
    submenus: [
      {
        id: "menu-fr-ag-view",
        screenId: EnumScreens.ViewFranchiseAgents,
        text: "List",
        url: ClientRoutesConstants.franchiseAgents,
        tooltip: "View Company Agents",
      },
      {
        id: "menu-fr-add-ag",
        screenId: EnumScreens.AddFranchiseAgent,
        text: "Add Company Agent",
        url: ClientRoutesConstants.addFranchiseAgent,
        tooltip: "Add Company Agent",
      },
    ],
  },
  {
    id: "menu-ref-office",
    text: "Affiliate Offices",
    iconClass: "fa fa-user-circle",
    tooltip: "Affiliate Offices",
    opened: false,
    url: ClientRoutesConstants.referralOffices,
    submenus: [
      {
        id: "menu-ref-ofc",
        screenId: EnumScreens.ViewReferralOffices,
        text: "List",
        url: ClientRoutesConstants.referralOffices,
        tooltip: "View Affiliate Offices",
      },
      {
        id: "menu-add-ref-ofc",
        screenId: EnumScreens.AddReferralOffice,
        text: "Add Affiliate Office",
        url: ClientRoutesConstants.addReferralOffice,
        tooltip: "Add Affiliate Office",
      },
    ],
  },
  {
    id: "menu-ref-ag",
    text: "Affiliate Agents",
    iconClass: "fa fa-handshake-o",
    tooltip: "Affiliate Agents",
    opened: false,
    url: ClientRoutesConstants.referralAgents,
    submenus: [
      {
        id: "menu-ref-ag-view",
        screenId: EnumScreens.ViewReferralAgents,
        text: "List",
        url: ClientRoutesConstants.referralAgents,
        tooltip: "View Affiliate Agents",
      },
      {
        id: "menu-ref-add-ag",
        screenId: EnumScreens.AddReferralAgent,
        text: "Add Affiliate Agent",
        url: ClientRoutesConstants.addReferralAgent,
        tooltip: "Add Affiliate Agent",
      },
    ],
  },
  {
    id: "menu-master-data",
    text: "Master Data",
    iconClass: "fa fa-database",
    tooltip: "Master Data",
    opened: false,
    url: ClientRoutesConstants.masterData,
    submenus: [
      {
        id: "menu-master-data-create",
        screenId: EnumScreens.MasterData,
        text: "Create/View",
        url: ClientRoutesConstants.masterData,
        tooltip: "Create/Update Master Data",
      },
    ],
  },
  {
    id: "menu-email",
    text: "Letter Templates",
    iconClass: "fa fa-envelope",
    tooltip: "Letter Templates",
    opened: false,
    url: ClientRoutesConstants.emailTemplates,
    submenus: [
      {
        id: "menu-emil-emples",
        screenId: EnumScreens.LetterTemplates,
        text: "List",
        url: ClientRoutesConstants.emailTemplates,
        tooltip: "View/Add Letter Templates",
      },
      {
        id: "menu-emil-post-grid",
        screenId: EnumScreens.PostGridLetterList,
        text: "PostGrid Letters",
        url: ClientRoutesConstants.postGridLetterList,
        tooltip: "PostGrid Letter List",
      },
    ],
  },

  {
    id: "menu-service-agreement",
    text: "Service Agreement",
    iconClass: "fa fa-solid fa-file-contract",
    tooltip: "Service Agreement",
    opened: false,
    url: ClientRoutesConstants.serviceTemplates,
    submenus: [
      {
        id: "menu-service-temp",
        screenId: EnumScreens.ServiceTemplates,
        text: "List",
        url: ClientRoutesConstants.serviceTemplates,
        tooltip: "View/Add Letter Templates",
      },
    ],
  },
];
