import React from 'react';
import { LeadFormComponent } from './lead-form';
import { OfficeLoginFormComponent } from './login-form';

export const SiteForms = (props: { officeId: string }) => {

    return (
        <div>
            <LeadFormComponent {...props} />
            <OfficeLoginFormComponent {...props} />
        </div>
    );
}