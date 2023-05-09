import { EnumFieldRights, EnumRoles, EnumScreens } from '../../../models/enums';
import { IScreenDescription, IScreenProps } from '../../../models/interfaces/shared';

export let RoleMappings = [
    {
        screen: { name: EnumScreens.CustomerList, description: 'Client List Page', rules: [] } as IScreenDescription,
        fields: [{ name: 'List', description: 'Client Table ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] }]
    },
    {
        screen: { name: EnumScreens.CustomerDetails, description: 'Client Details Page', rules: [] },
        fields: [
            { name: 'SSN', description: 'SSN Field', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'ProcessingStatus', description: 'Processing Status', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.ReadOnly }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'ProcessingType', description: 'Processing Type', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.ReadOnly }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'Credentials', description: 'User Name Passwords Section', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'CreditCard', description: 'Credit Card details', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'ResendWelcomeEmail', description: 'Resend Welcome emails', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'SendPOREmail', description: 'Send POR email', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'DOB', description: 'Date of Birth Field', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'SaveButton', description: 'Update Button', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'FeeInfo', description: 'Fee Info Section', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.ReadOnly }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'MailChimp', description: 'Mail Chimp Section', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'MonitoringDetails', description: 'Monitoring Details Section', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'GeneralNotes', description: 'General Notes Section', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'CreditBlissReports', description: 'Credit Bliss Reports Section', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'EditRound', description: 'Ability To Edit Rounds ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'StartRound', description: 'Ability To Start Rounds ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'SubmitRound', description: 'Ability To Submit Rounds ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'ShowStats', description: 'Show Stats Section ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'AccountDelete', description: 'Ability To Delete Accounts ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'DisputeProgressTab', description: 'Dispute Progress Tab ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Show }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'NotesTab', description: 'Notes and Contacts Tab', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Show }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'FilesTab', description: 'Files Tab ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Show }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'LettersTab', description: 'Letters Tab ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Show }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'AddClientNotes', description: 'Ability to Add Client Notes ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'RemoveClientNotes', description: 'Ability to Remove Client Notes ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'EditClientNotes', description: 'Ability to Edit Client Notes ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'AddProcessingNotes', description: 'Ability to Add Processing Notes ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'RemoveProcessingNotes', description: 'Ability to Remove Processing Notes ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'UpdateContactDetails', description: 'Ability to Update Contact Details ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'UploadCustomerFile', description: 'Ability to Upload a Client File  in Files Tab ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'EditCustomerFile', description: 'Ability to Update Client File ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'DownloadCustomerFile', description: 'Ability to Download Client File ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'RemoveCustomerFile', description: 'Ability to Remove Client File ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'NavigationOptions', description: 'Ability to Navigation to Other screens ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'DownloadDisputeLetter', description: 'Ability to Download Dispute Letters ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'RemoveDisputeLetter', description: 'Ability to Remove Dispute Letter ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'CreateDisputeLetter', description: 'Ability to Create Dispute Letters ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'ProcessingNotesSection', description: 'Processing Notes Section ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'ClientNotesSection', description: 'Client Notes Section ', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
            { name: 'ToDoSection', description: 'To-Do Section ', rules: [{ role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }, { role: EnumRoles.Customer, right: EnumFieldRights.Hide }] },
        ]
    },
    {
        screen: { name: EnumScreens.AddCustomer, description: 'Add Client', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.Dashboard, description: 'Dashboard', rules: [] },
        fields: []
    },
    {
        screen: { name: EnumScreens.CreateLetter, description: 'Create Client Letters Screen', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }, { role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.FastEdit, description: 'Fast Edit Accounts', rules: [{ role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.ReportImporter, description: 'Report Importer', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }, { role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.ViewFranchiseOffices, description: 'View  Company Offices', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }, { role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.AddFranchiseOffice, description: 'Add  Company Office', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }, { role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.ViewReferralOffices, description: 'View Affiliate Offices', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.AddReferralOffice, description: 'Add Affiliate Office', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.ViewReferralAgents, description: 'View referral Agent', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.AddReferralAgent, description: 'Add Affiliate Agent', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.ViewFranchiseAgents, description: 'View Company Agents', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.AddFranchiseAgent, description: 'Add Company Agent', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }, { role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.ViewLeads, description: 'View Leads', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.AddLead, description: 'Add Lead', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.LetterTemplates, description: 'Letter Templates', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }, { role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.AdminSettings, description: 'Admin Settings', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }, { role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.PortalIntegration, description: 'Portal Integration', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }, { role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.AffiliateSignUp, description: 'Affiliate SignUp', rules: [{ role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }, { role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }] },
        fields: []
    },
    {
        screen: { name: EnumScreens.CBReportViewer, description: 'Credit Bliss Report Viewer', rules: [] },
        fields: []
    },
    {
        screen: { name: EnumScreens.UserAccess, description: 'User Access Management', rules: [{ role: EnumRoles.OfficeManager, right: EnumFieldRights.Hide }, { role: EnumRoles.Customer, right: EnumFieldRights.Hide }, { role: EnumRoles.Processor, right: EnumFieldRights.Hide }, { role: EnumRoles.CreditAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralAgent, right: EnumFieldRights.Hide }, { role: EnumRoles.ReferralManager, right: EnumFieldRights.Hide }] },
        fields: []
    }
] as IScreenProps[];