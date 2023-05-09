import React from 'react';

import './customer-edit.scss';
import { CustomerFormComponent } from '../customer-form/customer-form';
import { withAuthorize } from '../../../shared/hoc/authorize';
import { EnumScreens } from '../../../models/enums';

const CustomerEditComponent = (props: any) => {
    return (
        <div className="edit-customer">
            <CustomerFormComponent {...props} />
        </div>
    );
}
export default withAuthorize(CustomerEditComponent, EnumScreens.CustomerDetails);