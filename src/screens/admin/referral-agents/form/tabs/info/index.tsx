import React from 'react';

import { ToDoTargetTypes } from '../../../../../../models/enums';
import { CustomerToDosComponent } from '../../../../../customer/customer-form/tabs/customer-info/components/customer-todos';
import { PersonalDetailsComponent } from './personal-details';


export const InfoComponent = ((props: any) => {
    return (
        <div className="tab-personal-details">
            <PersonalDetailsComponent {...props} />
        </div>
    );
})
