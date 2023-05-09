import React from 'react';
import { FilesComponent } from '../../../../customer/customer-form/tabs/files';

export const LeadsFileComponent = (props: any) => {

    return (
        <FilesComponent customer={props?.lead} onReloadCustomer={props?.onListReload} isLead={true} />
    );
}