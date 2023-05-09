import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ClientRoutesConstants } from '../../../../../../shared/constants';
import { MailchimpLogoSmall } from '../../../../../../shared/components/images';
import { ModalComponent } from '../../../../../../shared/components/modal';
import { MailChimpSettingsComponent } from './mail-chim-settings';
import { MailchimpLogo } from '../../../../../../shared/components/images';
import AuthService from '../../../../../../core/services/auth.service';

export const MailChimpComponent = (props: { customer: any, isReadOnly: boolean }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [payload] = useState(AuthService.getCurrentJWTPayload());
    return (
        <div className="row mail-chimp">
            <div className="col-12 d-flex pt-2 flex-column">
                <div className="d-flex">
                    <img src={MailchimpLogoSmall} alt='mail chimp' style={{ width: '25px', height: '25px' }} />
                    <label className="ml-1">Mail Chimp</label>
                </div>
                {!props?.isReadOnly &&
                    <div className='d-flex align-items-center justify-content-between'>
                        <span className='f-11 text-danger change-button font-weight-bold' onClick={() => setIsSettingsOpen(true)}>
                            <i className='fa fa-cog mr-1'></i>
                        Open Settings
                    </span>
                        <Link to={ClientRoutesConstants.portalIntegration} target={"_blank"} >
                            <span className="text-danger change-button font-weight-bold">
                                Activation
                        </span>
                            <i className="fa fa-external-link ml-1" aria-hidden="true"></i>
                        </Link>
                    </div>
                }
                {
                    !props?.isReadOnly &&
                    <div className="f-11 mt-2">
                        Dont have a MailChimp Account? <a href='http://eepurl.com/4h82v' target="_blank"> Click here </a>
                        to setup a FREE account.
                    </div>
                }
            </div>
            <ModalComponent title={<img style={{ height: '40px' }} src={MailchimpLogo} />} isVisible={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
                {isSettingsOpen && <MailChimpSettingsComponent customer={props?.customer} onClose={() => setIsSettingsOpen(false)} />}
            </ModalComponent>
        </div>
    );
}