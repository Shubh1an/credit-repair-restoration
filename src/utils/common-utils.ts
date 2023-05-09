import { ClientRoutesConstants, PageErrors, PASSWORDSTRENGTH, Variables } from '../shared/constants';
import { EnumComponentMode, EnumScreens, Outcome, SortOrderType } from '../models/enums';
import { IDropdown, INavMenu, IValueText, IValueTextExtra, IValueTextRole } from '../models/interfaces/shared';

import moment from 'moment';
import { Options, passwordStrength } from 'check-password-strength';

export class CommonUtils {
    static getYears(count: number = 10): IDropdown[] {
        let currentYear = new Date().getFullYear() - 5;
        let years: IDropdown[] = [];
        for (let index = 1; index <= count + 5; index++) {
            years.push({
                name: currentYear.toString(),
                abbreviation: currentYear.toString()
            });
            currentYear++;
        }
        return years;
    }
    static getMonths(): IDropdown[] {
        return [{
            abbreviation: '1',
            name: 'January'
        }, {
            abbreviation: '2',
            name: 'February'
        }, {
            abbreviation: '3',
            name: 'March'
        }, {
            abbreviation: '4',
            name: 'April'
        }, {
            abbreviation: '5',
            name: 'May'
        }, {
            abbreviation: '6',
            name: 'June'
        }, {
            abbreviation: '7',
            name: 'July'
        }, {
            abbreviation: '8',
            name: 'August'
        }, {
            abbreviation: '9',
            name: 'September'
        }, {
            abbreviation: '10',
            name: 'October'
        }, {
            abbreviation: '11',
            name: 'November'
        }, {
            abbreviation: '12',
            name: 'December'
        }];
    }
    static formatString(str: string, ...val: string[]): string {
        for (let index = 0; index < val.length; index++) {
            str = str.replace(`{${index}}`, val[index]);
        }
        return str;
    }
    static replaceProps(str: string, data: any): string {
        Object.keys(data).forEach((key: string) => {
            str = str.replaceAll(':' + key, data[key]);
        });
        return str;
    }
    static getDateInMMDDYYYY(strDate: string): string {
        try {
            return strDate
                ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
                    .format(new Date(strDate))
                : '';
        } catch (e) {
            return strDate || '';
        }
    }
    static isAMEXcard(value: string): boolean {
        return /^3[47]/.test(value);
    }
    static CustomersMenus(cid: string, current: string | null, allAvailableScreens: string[]): INavMenu[] {
        let opts: INavMenu[] = [
            {
                id: 'menu-cust-list',
                screenId: EnumScreens.CustomerList,
                url: ClientRoutesConstants.customers,
                text: 'Client List'
            },
            {
                id: 'menu-cust-details',
                screenId: EnumScreens.CustomerDetails,
                url: ClientRoutesConstants.customersView,
                text: 'Client Details'
            },
            {
                id: 'menu-fast-edit',
                screenId: EnumScreens.FastEdit,
                url: ClientRoutesConstants.fastEditAccounts,
                text: 'Fast Edit Accounts'
            },
            {
                id: 'menu-cust-letter',
                screenId: EnumScreens.CreateLetter,
                url: ClientRoutesConstants.createLetter,
                text: 'Create Letters'
            },
            {
                id: 'menu-report-importer',
                screenId: EnumScreens.ReportImporter,
                url: ClientRoutesConstants.reportImporter?.replace(/\/:type?/g, '')?.replace(/[\?]/g, ''),
                text: 'Report Importer'
            }
        ];
        opts = opts.filter(x => x.screenId && x.url !== current && allAvailableScreens?.includes(x.screenId));
        if (cid) {
            opts.forEach((item) => {
                item.url = item?.url.replace(/:cid/gi, cid);
            });
        } else {
            opts = opts?.filter(x => x.screenId === EnumScreens.CustomerList);
        }
        return opts;
    }
    static LeadsMenus(cid: string, current: string | null, allAvailableScreens: string[]): INavMenu[] {
        let opts: INavMenu[] = [
            {
                id: 'menu-lead-list',
                screenId: EnumScreens.ViewLeads,
                url: ClientRoutesConstants.leads,
                text: 'Show All Leads'
            },
            {
                id: 'menu-lead-details',
                screenId: EnumScreens.AddLead,
                url: ClientRoutesConstants.viewLeads,
                text: 'View Lead Details'
            }
        ];
        opts = opts.filter(x => x.screenId && x.url !== current && allAvailableScreens?.includes(x.screenId));
        if (cid) {
            opts.forEach((item) => {
                item.url = item?.url.replace(/:id/gi, cid);
            });
        }
        return opts;
    }
    static ProcessingTypes(): IValueText[] {
        let opts: IValueText[] = [
            {
                value: Variables.STANDARD_FASTRACK,
                text: Variables.STANDARD_FASTRACK
            },
            {
                value: 'Standard',
                text: 'Standard'
            },
            {
                value: 'Direct To Creditor &amp; CRA',
                text: 'Direct To Creditor &amp; CRA'
            },
            {
                value: 'Credit Report Analysis',
                text: 'Credit Report Analysis'
            },
            {
                value: 'Fast Track',
                text: 'Fast Track'
            },
            {
                value: 'Final Update',
                text: 'Final Update'
            },
            {
                value: 'Tradeline Services',
                text: 'Tradeline Services'
            },
            {
                value: 'Bankruptcy',
                text: 'Bankruptcy'
            },
            {
                value: 'Pay For Delete',
                text: 'Pay For Delete'
            }
        ];
        return opts;
    }

    static CardTypes(): IValueText[] {
        let opts: IValueText[] = [
            {
                value: 'AmericanExpress',
                text: 'American Express'
            },
            {
                value: 'Discover',
                text: 'Discover'
            },
            {
                value: 'MasterCard',
                text: 'MasterCard'
            },
            {
                value: 'Visa',
                text: 'Visa'
            }
        ];
        return opts;
    }
    static CreditMOnitoringOptions(): IValueTextExtra[] {
        return [
            { value: 'None', text: 'None', websiteName: '', path: '' },
            { value: 'CreditBliss', text: 'Credit Bliss', websiteName: 'Bypass Login', path: 'https://portal.creditbliss.com/client?bps={0}&email={1}' },
            { value: 'IDTheftDefender', text: 'ID Theft Defender', websiteName: 'ID Theft Defender', path: 'https://www.idtheftdefender.com/customer_login.asp', isOutsourced: true },
            { value: 'MyIDIQ', text: 'Identity IQ', websiteName: 'identityiq.com', path: 'https://member.identityiq.com/login.aspx', isOutsourced: true },
            { value: 'TrueCredit', text: 'True Credit', websiteName: 'True Credit', path: 'http://www.truecredit.com' },
            { value: 'CreditCheckTotal', text: 'Credit Check Total', websiteName: 'Credit Check Total', path: 'http://www.creditchecktotal.com' },
            { value: 'CreditKeeper', text: 'Credit Keeper', websiteName: 'Credit Keeper', path: 'http://www.creditkeeper.com' },
            { value: 'PrivacyGuard', text: 'Privacy Guard', websiteName: 'Privacy Guard', path: 'http://www.privacyguard.com' },
            { value: 'ScoreSense', text: 'Score Sense', websiteName: 'ScoreSense.com', path: 'http://www.scoresense.com' },
            { value: 'FreeScore', text: 'Free Score', websiteName: 'FreeScore.com', path: 'http://www.freescore.com' },
            { value: '53IdentityAlert', text: '53 Identity Alert', websiteName: '53IdentityAlert.com', path: 'http://www.53identityalert.com' },
            { value: 'WellsFargoProtection', text: 'Wells Fargo Enhanced', websiteName: 'Wells Fargo Enhanced', path: 'https://identity.wellsfargoprotection.com/secure/LoginRouter.aspx' },
            { value: 'WellsFargoMonitor2', text: 'Wells Fargo Option 2', websiteName: 'Wells Fargo #2', path: 'https://monitor.wellsfargoprotection.com/sign-in' },
            { value: 'CreditScore', text: 'CreditScore.com', websiteName: 'CreditScore.com', path: 'https://www.creditscore.com/sign-in.aspx' },
            { value: 'FreeCreditScore', text: 'Free Credit Score', websiteName: 'Free Credit Score', path: 'http://www.freecreditscore.com' },
            { value: 'FreeScore360', text: 'Free Score 360', websiteName: 'Free Score 360', path: 'http://www.freescore360.com/' },
            { value: 'FreeCreditReport', text: 'Free Credit Report', websiteName: 'FreeCreditReport.com', path: 'http://www.freecreditreport.com/' },
            { value: 'IdentityGuard', text: 'Identity Guard', websiteName: 'Identity Guard', path: 'https://secure.identityguard.com/LogonForm?storeId=10051' },
            { value: 'CitiIdentityMonitor', text: 'Citi Identity Monitor', websiteName: 'Citi Identity Monitor', path: 'https://membership.identitymonitor.citi.com/Pages/English/In_Activation.asp?source=IMN00518&ordsrc=' },
            { value: 'CostcoIdentityGuard', text: 'Costco IdentityGuard', websiteName: 'Costco IdentityGaurd', path: 'https://secure.costco.identityguard.com/LogonForm?storeId=10552' },
            { value: 'CreditReport.com', text: 'CreditReport.com', websiteName: 'CreditReport.com', path: 'https://www.creditreport.com/sign-in.aspx' },
            { value: 'FreeScoresAndMore.com', text: 'FreeScoresAndMore.com', websiteName: 'Free Scores and More', path: 'https://www.freescoresandmore.com/' },
            { value: 'Equifax', text: 'Equifax', websiteName: 'Equifax', path: 'https://www.econsumer.equifax.com/otc/landing.ehtml?^start=&companyName=PSb14bpd02_lgn' },
            { value: 'LifeLock', text: 'LifeLock', websiteName: 'LifeLock', path: 'https://secure.lifelock.com/portal/login/' },
            { value: 'Experian', text: 'Experian', websiteName: 'Experian', path: 'http://www.experian.com/consumer/login.html/' },
            { value: 'SmartCredit', text: 'SmartCredit', websiteName: 'smartcredit.com', path: 'https://www.smartcredit.com/login/', isOutsourced: true },
            { value: 'MyFreeScoreNow', text: 'My Free Score Now', websiteName: 'member.myfreescorenow.com', path: 'https://member.myfreescorenow.com/login/', isOutsourced: true },
            { value: 'MyScoreIQ', text: 'My Score IQ', websiteName: 'member.myscoreiq.com', path: 'https://member.myscoreiq.com/login.aspx', isOutsourced: true },
            { value: 'Other', text: 'Other...', websiteName: '', path: '' }
        ];
    }
    static ClientNotesWhoLefts(): IValueTextRole[] {
        return [
            {
                value: 'Administrator', text: 'Administrator', roles: []
            },
            {
                value: 'Office Manager', text: 'Office Manager', roles: []
            },
            {
                value: 'Processor', text: 'Processor', roles: []
            },
            {
                value: 'Customer', text: 'Client', roles: []
            },
            {
                value: 'Credit Agent', text: 'Credit Agent', roles: []
            }
        ];
    }
    static DocTypes(): IDropdown[] {
        return [{
            abbreviation: 'Id',
            name: 'ID'
        }, {
            abbreviation: 'Address Verification',
            name: 'POR - Address Verification'
        }, {
            abbreviation: 'COPY SS',
            name: 'COPY SS'
        }, {
            abbreviation: 'SUPPORTING DOCs',
            name: 'SUPPORTING DOCs'
        }, {
            abbreviation: 'Reports',
            name: 'REPORTS'
        }, {
            abbreviation: 'Progress Reports',
            name: 'PROGRESS REPORTS'
        }, {
            abbreviation: 'Service Agreement',
            name: 'SERVICE AGREEMENT'
        }];
    }
    static getDate(d: string): any {
        const dateNew = moment(d).format('MM/DD/YYYY');
        if (dateNew === '01/01/0001' || dateNew === '01/01/1900') return '';
        return dateNew;
    }
    static isAvailableToSelect(outcome?: string) {
        outcome = outcome?.toLowerCase();
        const notAllowedOutcomes = [Outcome?.DELETED?.toLowerCase(), Outcome?.REPAIRED?.toLowerCase(), Outcome?.SATISFACTORY?.toLowerCase(), Outcome?.DO_NOT_DISPUTE_BY_CONSUMER?.toLowerCase()];
        return !notAllowedOutcomes.includes(outcome || '');
    }
    static ProcessingStatus(): IValueText[] {
        let opts: IValueText[] = [
            {
                value: 'POR',
                text: 'POR'
            },
            {
                value: 'Problem',
                text: 'Problem'
            },
            {
                value: 'On Hold',
                text: 'On Hold'
            },
            {
                value: 'Cancelled',
                text: 'Cancelled'
            },
            {
                value: 'NSF',
                text: 'NSF'
            },
            {
                value: 'CM Hold',
                text: 'CM Hold'
            },
            {
                value: 'Completed',
                text: 'Completed'
            }
        ];
        return opts;
    }

    static CallingTimes(): IValueText[] {
        let opts: IValueText[] = [
            {
                value: 'Morning',
                text: 'Morning'
            },
            {
                value: 'Afternoon',
                text: 'Afternoon'
            },
            {
                value: 'Evening',
                text: 'Evening'
            }
        ];
        return opts;
    }
    static LeadTypes(): IValueText[] {
        let opts: IValueText[] = [
            {
                value: 'Active',
                text: 'Active'
            },
            {
                value: 'Contact 1+',
                text: 'Contact 1+'
            },
            {
                value: 'Contact 5+',
                text: 'Contact 5+'
            },
            {
                value: 'Contact 10+',
                text: 'Contact 10+'
            },
            {
                value: 'No Contact',
                text: 'No Contact'
            },
            {
                value: 'Not Interested',
                text: 'Not Interested'
            },
            {
                value: 'Transferred to LO',
                text: 'Transferred to LO'
            }
        ];
        return opts;
    }
    static TransactionTypes(): IValueText[] {
        let opts: IValueText[] = [
            {
                value: 'New Purchase',
                text: 'New Purchase'
            },
            {
                value: 'Refinance',
                text: 'Refinance'
            },
            {
                value: 'Auto Loan',
                text: 'Auto Loan'
            },
            {
                value: 'Business Loan',
                text: 'Business Loan'
            }
        ];
        return opts;
    }
    static ReferralOfficeTypes(): IValueText[] {
        return [
            {
                value: 'Bank', text: 'Bank'
            },
            {
                value: 'Car Dealership', text: 'Car Dealership'
            },
            {
                value: 'Insurance Company', text: 'Insurance Company'
            },
            {
                value: 'Mortgage Company', text: 'Mortgage Company'
            },
            {
                value: 'Real Estate Agency', text: 'Real Estate Agency'
            },
            {
                value: 'Title Company', text: 'Title Company'
            },
            {
                value: 'Tax Services', text: 'Tax Services'
            },
            {
                value: 'Apt. Complex', text: 'Apt. Complex'
            },
            {
                value: 'Company Referrals', text: 'Company Referrals'
            },
            {
                value: 'Solar Companies', text: 'Solar Companies'
            }
        ];
    }
    static FormatHTML(html: string): string {
        var tab = '\t';
        var result = '';
        var indent = '';

        html.split(/>\s*</).forEach((element) => {
            if (element.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }
            result += indent + '<' + element + '>\r\n';
            /* uncomment below code to add identation in the html */
            if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
                indent += tab;
            }
        });
        return result.substring(1, result.length - 3);
    }
    static ReplaceUnCloseIMGtags(html: string): string {
        return html.replace("@(<img.*?)(?<!/)>@i", "$1/>");
    }
    static ReplaceUnCloseBRtags(html: string): string {
        return html.replace(/<br\s*[\/]?>/gi, '<br/>');
    }
    static randomNumber(): number {
        return Math.floor(Math.random() * 101);
    }
    static formErrors(data: any, options?: any): string {
        console.log('data --- ', data)
        let msg = '';
        let passwordDoesNotMatch = false;

        switch (options.screenName) {
            case EnumScreens.CustomerList:
                msg = this.ClientPageErrors(msg, data, options);
                break;

            case EnumScreens.ViewLeads:
                msg = this.LeadsPageErrors(msg, data, options);
                break;
            case EnumScreens.ViewFranchiseOffices:
                msg = this.CompanyOfficesPageErrors(msg, data, options);
                if (!msg && options.screenMode === EnumComponentMode.Add) {
                    if (
                        !data?.password ||
                        data?.password?.value !== data?.confirmPassword?.value
                    ) {
                        msg += PageErrors.commonErrors.passwordMatch;
                        passwordDoesNotMatch = true;
                    }
                }
                break;
            case EnumScreens.ViewReferralOffices:
                msg = this.AffiliateOfficesPageErrors(msg, data, options);
                break;
            case EnumScreens.ViewReferralOfficesAgentsTab:
                msg = this.AffiliateOfficesAgentTabPageErrors(msg, data, options);
                if (!msg && options.screenMode === EnumComponentMode.Add) {
                    if (
                        !data?.password ||
                        data?.password?.value !== data?.confirmPassword?.value
                    ) {
                        msg += PageErrors.commonErrors.passwordMatch;
                        passwordDoesNotMatch = true;
                    }
                }
                break;
            default:
                break;
        }
        const result = msg.substring(0, msg.lastIndexOf(","));
        return msg && !passwordDoesNotMatch ? `Please enter ${result}` : msg;
    }

    static ClientPageErrors(msg: string, data: any, options: any): string {
        if (!data?.firstName) {
            msg += PageErrors.commonErrors.firstName;
        }
        if (!data?.lastName) {
            msg += PageErrors.commonErrors.lastName;
        }
        if (!data?.email) {
            msg += PageErrors.commonErrors.email;
        }
        if (!data?.transactionType) {
            msg += PageErrors.clientPageErrors.processingStatus;
        }
        if (
            options.screenMode === EnumComponentMode.Add &&
            !data.franchise &&
            !data.franchise?.id
        ) {
            msg += PageErrors.clientPageErrors.franchiseId;
        }
        return msg;
    }

    static LeadsPageErrors(msg: string, data: any, options: any): string {
        if (!data?.firstName) {
            msg += PageErrors.commonErrors.firstName;
        }
        if (!data?.lastName) {
            msg += PageErrors.commonErrors.lastName;
        }
        if (!data?.email) {
            msg += PageErrors.commonErrors.email;
        }
        if (options?.isPublic && !data?.cellPhone) {
            msg += PageErrors.leadsPageErrors.cellPhone;
        }
        if (
            !options?.isPublic ? options.screenMode === EnumComponentMode.Add &&
                !data.franchise &&
                !data.franchise?.id :
                false
        ) {
            msg += PageErrors.clientPageErrors.franchiseId;
        }
        return msg;
    }

    static CompanyOfficesPageErrors(msg: string, data: any, options: any): string {
        if (data) {
            if (!data?.firstName) {
                msg += PageErrors.commonErrors.firstName;
            }

            if (!data?.email) {
                msg += PageErrors.commonErrors.email;
            }
            if (!(data?.office?.id || data?.props?.officeId)) {
                msg += PageErrors.companyOfficeErrors.officeId;
            }

            if (!(data?.role)) {
                msg += PageErrors.companyOfficeErrors.role;
            }
            if (!(data?.password && data?.password?.value)) {
                msg += PageErrors.commonErrors.passwordRequired;
            } else if (
                data?.password &&
                data?.password?.value &&
                !data?.password.isValid
            ) {
                msg += PageErrors.commonErrors.validPassword;
            }
            if (options.screenMode === EnumComponentMode.Add) {
                if (!data.userName) {
                    msg += PageErrors.commonErrors.usernameRequired;
                }
                if (!(data?.confirmPassword && data?.confirmPassword?.value)) {
                    msg += PageErrors.commonErrors.confirmPassword;
                }
            }
        }
        return msg;
    }

    static AffiliateOfficesPageErrors(msg: string, data: any, options: any): string {
        if (!data?.agent?.id) {
            msg += PageErrors.affiliateOfficeErrors.agentId;
        }
        if (!data?.name) {
            msg += PageErrors.affiliateOfficeErrors.officeName;
        }
        if (!data?.classification) {
            msg += PageErrors.affiliateOfficeErrors.officeType;
        }

        return msg;
    }

    static AffiliateOfficesAgentTabPageErrors(msg: string, data: any, options: any): string {
        if (data) {
            // common 
            if (!data?.firstName) {
                msg += PageErrors.commonErrors.firstName;
            }
            if (options.screenMode === EnumComponentMode.Edit) {
                if (!data?.officeId) {
                    msg += PageErrors.affiliateOfficeErrors.agentsTab.affiliateOffice;
                }
                if (!data?.email) {
                    msg += PageErrors.commonErrors.email;
                }
            }
            if (options.screenMode === EnumComponentMode.Add) {
                if (!(data?.officeId || data?.props?.officeId)) {
                    msg += PageErrors.affiliateOfficeErrors.agentsTab.affiliateOffice;
                }
                if (!(data?.password && data?.password?.value)) {
                    msg += PageErrors.commonErrors.passwordRequired;
                } else if (
                    data?.password &&
                    data?.password?.value &&
                    !data?.password.isValid
                ) {
                    msg += PageErrors.commonErrors.validPassword;
                }

                if (!(data?.confirmPassword && data?.confirmPassword?.value)) {
                    msg += PageErrors.commonErrors.confirmPassword;
                }
            }

        }
        return msg;
    }

    static customSort(data1: any, data2: any, order: string, key: string) {
        let result;
        if (typeof data1[key] === 'string' && typeof data2[key] === 'string')
            result = order === SortOrderType.ASC ? data1[key].localeCompare(data2[key]) : data2[key].localeCompare(data1[key]);
        return result;
    }
    static isPasswordStrong(pwd: string): boolean {
        const calculatedStrength = passwordStrength(pwd, PASSWORDSTRENGTH as Options<string>)
        return calculatedStrength.id >= 2;
    }
}