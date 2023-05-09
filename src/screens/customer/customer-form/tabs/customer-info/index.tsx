import React from 'react';
import { connect } from 'react-redux';

import { CustomerActivitiesComponent } from './components/customer-activities';
import { CustomerPersonalDetailsComponent } from './components/personal-details';
import { CredentialsSetComponent } from './components/credentials-set';
import { EnumScreens, ToDoTargetTypes } from '../../../../../models/enums';
import AuthService from '../../../../../core/services/auth.service';
import { CustomerOperationsComponent } from './components/customer-operations';

const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.CustomerDetails)
    }
}
export const CustomerInfoComponent = connect(mapStateToProps)((props: any) => {
    return (
        <div>
            <CustomerPersonalDetailsComponent {...props} />
            {!props?.addMode && !!props?.customer &&
                <>
                    <CustomerActivitiesComponent {...props} />
                    {
                        !AuthService.isFieldHidden(props.AuthRules, 'Credentials') &&
                        <CredentialsSetComponent isReadOnly={AuthService.isFieldReadOnly(props.AuthRules, 'Credentials')} {...props} />
                    }
                    
                    {
                        !AuthService.isFieldHidden(props.AuthRules, 'CustomerActions')
                        && !AuthService.isFieldReadOnly(props.AuthRules, 'CustomerActions')
                        && <CustomerOperationsComponent id={props?.customer?.id} onReloadCustomersList={props?.onReloadCustomersList} />
                    }
                </>
            }
        </div>
    );
})
