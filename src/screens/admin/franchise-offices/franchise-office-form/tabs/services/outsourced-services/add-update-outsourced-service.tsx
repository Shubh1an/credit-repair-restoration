import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { CompanyWiseServices } from '../../../../../master-records/company-services/';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
    }, dispatch);
}
export const AddUpdateOutsourcedServiceComponent = connect(null, mapDispatchToProps)((props: {
    onSave: () => void,
    officeId?: string,
}) => {

    return (
        <div className="add-edit-fr-agent pt-3 position-relative ofc-outsourced-serv">
            <CompanyWiseServices officeId={props?.officeId} onSave={props?.onSave} />
        </div>
    );
});
