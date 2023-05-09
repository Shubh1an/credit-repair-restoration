import React from 'react';

import { FranchiseOfficeFormComponent } from '../franchise-office-form';
import { withAuthorize } from '../../../../shared/hoc/authorize';
import { EnumScreens } from '../../../../models/enums';

const FranchiseOfficeEditComponent = (props: any) => {
    return (
        <div className="edit-customer">
            <FranchiseOfficeFormComponent {...props} />
        </div>
    );
}
export default withAuthorize(FranchiseOfficeEditComponent, EnumScreens.ViewFranchiseOffices);