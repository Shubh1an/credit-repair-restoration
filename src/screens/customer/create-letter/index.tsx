import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import './create-letter.scss';
import { NavigationOptions } from '../../../shared/components/navigation-options';
import { ClientRoutesConstants } from '../../../shared/constants';
import { CreateLetterListViewComponent } from './components/create-letter-list-view/create-letter-list-view';
import { CreateLetter } from './components/create-letter';
import { withAuthorize } from '../../../shared/hoc/authorize';
import { EnumScreens } from '../../../models/enums';

const CreateLetterComponent: React.FC = (props: any) => {
    const params = useParams() as { cid: string };
    const [customer, setCustomer] = useState(null);
    const onCustomerDetails = (data: any) => {
        setCustomer(data);
    }
    return (
        <div className="create-letter">
            <section className="content-header row">
                <div className="col-12 col-sm-10">
                    <div className="header-icon">
                        <i className="fa fa-envelope"></i>
                    </div>
                    <div className="header-title">
                        <h1>Create Letter</h1>
                        <small>Add, Edit and delete Letters</small>
                    </div>
                </div>
                <div className="col-12 col-sm-2 pt-3 pl-5 pl-sm-0">
                    <NavigationOptions label="Navigation Options" current={ClientRoutesConstants.createLetter} cid={params.cid} />
                </div>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-12">
                        <CreateLetter {...props} customer={customer} customerDetails={onCustomerDetails} />
                    </div>
                    <div className="col-12">
                        <CreateLetterListViewComponent {...props} cid={params?.cid} customer={customer} />
                    </div>
                </div>
            </section>
        </div>
    );
}
export default withAuthorize(CreateLetterComponent, EnumScreens.CreateLetter);