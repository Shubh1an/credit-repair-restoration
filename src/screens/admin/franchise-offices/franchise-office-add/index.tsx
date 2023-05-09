import React from 'react';
import { connect } from 'react-redux';

import { EnumScreens } from '../../../../models/enums';
import { withAuthorize } from '../../../../shared/hoc/authorize';
import { FranchiseOfficeFormComponent } from '../franchise-office-form';

const mapStateToProps = (state: any) => {
    return {
        auth: state.authModel,
    };
}

const FranchiseOfficeAddComponent = (props: any) => {
    return (
        <div>
            <FranchiseOfficeFormComponent {...props} addMode={true} />
        </div>
    );
}

export default connect(mapStateToProps)(withAuthorize(FranchiseOfficeAddComponent, EnumScreens.AddFranchiseOffice));