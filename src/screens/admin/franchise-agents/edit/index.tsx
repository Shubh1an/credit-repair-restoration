import React from 'react';

import { withAuthorize } from '../../../../shared/hoc/authorize';
import { EnumScreens } from '../../../../models/enums';
import { FormComponent } from '../form';

const LeadsEditComponent = (props: any) => {
    return (
        <div className="edit-customer">
            <FormComponent {...props} />
        </div>
    );
}
export default withAuthorize(LeadsEditComponent, EnumScreens.ViewLeads);