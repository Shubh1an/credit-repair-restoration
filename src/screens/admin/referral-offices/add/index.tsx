import React from 'react';
import { connect } from 'react-redux';

import { EnumScreens } from '../../../../models/enums';
import { withAuthorize } from '../../../../shared/hoc/authorize';
import { ReferralOfficeFormComponent } from '../form';

const mapStateToProps = (state: any) => {
    return {
        auth: state.authModel,
    };
}

const ReferralOfficeAddComponent = (props: any) => {
    return (
        <div>
            <ReferralOfficeFormComponent {...props} addMode={true} />
        </div>
    );
}

export default connect(mapStateToProps)(withAuthorize(ReferralOfficeAddComponent, EnumScreens.AddReferralOffice));