import React from 'react';
import { connect } from 'react-redux';

import { EnumScreens } from '../../../../models/enums';
import { withAuthorize } from '../../../../shared/hoc/authorize';
import { FormComponent } from '../form';

const mapStateToProps = (state: any) => {
    return {
        auth: state.authModel,
    };
}

const ReferralAgentAddComponent = (props: any) => {
    return (
        <div>
            <FormComponent {...props} addMode={true} />
        </div>
    );
}

export default connect(mapStateToProps)(withAuthorize(ReferralAgentAddComponent, EnumScreens.AddReferralAgent));