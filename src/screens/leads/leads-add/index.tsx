import React from 'react';
import { connect } from 'react-redux';

import { EnumScreens } from '../../../models/enums';
import { withAuthorize } from '../../../shared/hoc/authorize';
import { LeadsFormComponent } from '../leads-form';

const mapStateToProps = (state: any) => {
    return {
        auth: state.authModel,
    };
}

const LeadsAddComponent = (props: any) => {
    return (
        <div>
            <LeadsFormComponent {...props} addMode={true} />
        </div>
    );
}

export default connect(mapStateToProps)(withAuthorize(LeadsAddComponent, EnumScreens.AddLead));