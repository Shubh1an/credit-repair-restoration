import memoizeOne from "memoize-one";

import AuthService from "../core/services/auth.service";
import { EnumRoles, ToDoTargetTypes } from "../models/enums";
import { IScreenProps } from "../models/interfaces/shared";

export class AppUtils {
    static widgetRemoved: boolean;
    static checkAppLevelAccess(rules: IScreenProps): void {
        if (!this.widgetRemoved && this.isHelpWidgetDisabled(rules)) {
            this.removeHelpWidget();
        }
    }
    static isHelpWidgetDisabled = memoizeOne((rules: IScreenProps): boolean => {
        return (AuthService.isFieldHidden(rules, 'HelpWidget') || AuthService.isFieldReadOnly(rules, 'HelpWidget'));
    });
    static removeHelpWidget() {
        const widget = document.getElementById('freshworks-container');
        if (widget) {
            widget.remove();
            this.widgetRemoved = true;
        }
    }
    static convertRoleToToDoTypes(currentRole: EnumRoles) {
        switch (currentRole) {
            case EnumRoles.Customer:
                return ToDoTargetTypes.CUSTOMER;
            case EnumRoles.CreditAgent:
                return ToDoTargetTypes.FRANCHISE_AGENT;
            case EnumRoles.Administrator:
                return ToDoTargetTypes.ADMIN;
            case EnumRoles.OfficeManager:
                return ToDoTargetTypes.OFFICEMANAGER;
            case EnumRoles.Processor:
                return ToDoTargetTypes.PROCESSOR;
            case EnumRoles.ReferralAgent:
                return ToDoTargetTypes.REFERRAL_AGENT;
            case EnumRoles.ReferralManager:
                return ToDoTargetTypes.REFERRALMANAGER;
            default:
                return ToDoTargetTypes.CUSTOMER;
        }
    }
}