import React from 'react';

import { ReferralOfficeFormComponent } from '../form';
import { withAuthorize } from '../../../../shared/hoc/authorize';
import { EnumScreens } from '../../../../models/enums';

const ReferralOfficeEditComponent = (props: any) => {
    return (
        <div className="edit-customer">
            <ReferralOfficeFormComponent {...props} />
        </div>
    );
}
export default withAuthorize(ReferralOfficeEditComponent, EnumScreens.ViewFranchiseOffices);