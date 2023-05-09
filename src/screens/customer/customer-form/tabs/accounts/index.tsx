import React, { useEffect, useState } from 'react';

import { ICollectionAccountItem } from '../../../../../models/interfaces/customer-view';
import { Variables } from '../../../../../shared/constants';
import { DashboardWidget } from '../../../../dashboard/components/dashboard-widget';
import { AccountsWrapperComponent } from './components/accounts-list-wrapper';


export const AccountsComponent = (props: any) => {

    const [fastTrackAccounts, setFastTrackAccounts] = useState([] as ICollectionAccountItem[]);
    const [nonFastTrackAccounts, setNonFastTrackAccounts] = useState([] as ICollectionAccountItem[]);

    useEffect(() => {
        if (props?.customer?.processingType === Variables.STANDARD_FASTRACK) {
            setFastTrackAccounts(props?.customer?.collectionAccountItems?.filter((x: ICollectionAccountItem) => x.isFastTrack));
            setNonFastTrackAccounts(props?.customer?.collectionAccountItems?.filter((x: ICollectionAccountItem) => !x.isFastTrack));
        } else {
            setNonFastTrackAccounts(props?.customer?.collectionAccountItems);
        }
    }, [props?.customer]);

    return (
        <>
            <DashboardWidget title={'Client Accounts:'} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
                {
                    props?.customer?.processingType === Variables.STANDARD_FASTRACK
                    && !!fastTrackAccounts?.length &&
                    <div className="row mb-4">
                        <div className="col-12">
                            <h4 className="text-danger mb-2 pl-2 text-shadow-secondary">
                                Fast Track Accounts({fastTrackAccounts?.length || 0}): </h4>
                            <AccountsWrapperComponent customer={props?.customer} cid={props?.customer?.id} onReloadCustomer={props?.onReloadCustomer} isFastTrack={true} accounts={fastTrackAccounts} />
                        </div>
                    </div>
                }
                <div className="row">
                    <div className="col-12">
                        <h4 className="text-secondary mb-2 pl-2 text-shadow-secondary">
                            Accounts({nonFastTrackAccounts?.length || 0}): </h4>
                        <AccountsWrapperComponent customer={props?.customer}  cid={props?.customer?.id} onReloadCustomer={props?.onReloadCustomer} isFastTrack={false} accounts={nonFastTrackAccounts} />
                    </div>
                </div>
            </DashboardWidget>
        </>
    );
}