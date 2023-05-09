import React from 'react';

import { withAuthorize } from '../../../../shared/hoc/authorize';
import { EnumScreens } from '../../../../models/enums';
import { FormComponent } from '../form';

const ReferralAgentEditComponent = (props: any) => {
    return (
        <div className="edit-customer">
            <FormComponent {...props} />
        </div>
    );
}
export default withAuthorize(ReferralAgentEditComponent, EnumScreens.ViewLeads);