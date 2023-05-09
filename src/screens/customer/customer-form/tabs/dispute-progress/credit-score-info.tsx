import React, { useState } from 'react';
import { DashboardWidget } from '../../../../dashboard/components/dashboard-widget';

import { RoundsComponent } from './round-options/rounds';
import './dispute-progress.scss';
import AuthService from '../../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../../shared/components/button';
import { EnumScreens } from '../../../../../models/enums';
import { connect } from 'react-redux';
import { ModalComponent } from '../../../../../shared/components/modal';
import { AddRoundComponent } from './round-options/add-round';

const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.CustomerDetails)
    };
}
export const CreditScoreInfoComponent = connect(mapStateToProps)((props: any) => {
    const [isOpen, setIsOpen] = useState(false);

    const onAddRound = (isSaved: boolean) => {
        if (isSaved) {
            setIsOpen(false);
            props?.onReloadCustomer();
        }
    }
    return (
        <>
            <DashboardWidget title={"Rounds"} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
                <div className='row'>
                    <div className='col-12 mb-1 mt-3 pr-1 text-right'>
                        {
                            !AuthService.isFieldHidden(props.AuthRules, 'AddRound') &&
                            <ButtonComponent text="Add New Round" className="btn-primary ml-sm-2 mt-1 mt-sm-0" onClick={() => setIsOpen(true)} >
                                <i className="fa fa-plus mr-2"></i>
                            </ButtonComponent>
                        }
                    </div>
                </div>
                <RoundsComponent {...props} />
            </DashboardWidget>
            <ModalComponent title={'Add New Round'} isVisible={isOpen} onClose={() => setIsOpen(false)}>
                <AddRoundComponent onSave={onAddRound} cid={props?.customer?.id} />
            </ModalComponent>
        </>
    );
});
