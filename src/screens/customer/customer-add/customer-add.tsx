import React from 'react';
import { connect } from 'react-redux';
import { EnumScreens } from '../../../models/enums';
import { withAuthorize } from '../../../shared/hoc/authorize';

import { CustomerFormComponent } from '../customer-form/customer-form';

const mapStateToProps = (state: any) => {
    return {
        auth: state.authModel,
    };
}

const CustomerAddComponent = (props: any) => {
    return (
        <div>
            <CustomerFormComponent onReloadCustomersList={props?.onReloadCustomersList} addMode={true} cid={props?.cid} />
        </div>
    );
}

export default connect(mapStateToProps)(withAuthorize(CustomerAddComponent, EnumScreens.AddCustomer));