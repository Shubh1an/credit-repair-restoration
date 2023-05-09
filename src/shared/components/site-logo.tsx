import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Img } from 'react-image';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { logoMissing } from './images';
import { ClientRoutesConstants, Constants } from '../constants';
import AuthService from '../../core/services/auth.service';
import { ModalComponent } from './modal';
import { SiteLogoEditorComponent } from './site-logo-editor';
import { EnumRoles, IMAGETYPES } from '../../models/enums';
import { UrlUtils } from '../../utils/http-url.util';
import { CommonUtils } from '../../utils/common-utils';


const mapStateToProps = (state: any) => {
    return {
        logoKey: state?.sharedModel?.logoChangedKey
    };
}
export const SiteLogoComponent = connect(mapStateToProps)((props: any) => {

    const [role, setRole] = useState(null as any);
    const [logoUrlMini, setlogoUrlMini] = useState('' as string);
    const [logoUrl, setlogoUrl] = useState('' as string);
    const [ofclogoUrlMini, setOfclogoUrlMini] = useState('' as string);
    const [ofclogoUrl, setOfclogoUrl] = useState('' as string);
    const [openEditor, setOpenEditor] = useState(false as boolean);


    useEffect(() => {
        const p = AuthService.getCurrentJWTPayload();
        const tenant = UrlUtils.getPartnerKey();
        const baseUrl = UrlUtils.getBaseUrl();
        setlogoUrl(baseUrl + CommonUtils.formatString(Constants.siteLogoPath, tenant));
        setlogoUrlMini(baseUrl + CommonUtils.formatString(Constants.siteLogoMiniPath, tenant));
        setOfclogoUrl(baseUrl + CommonUtils.formatString(Constants.officeLogoPath, tenant, p?.mainFranchiseOfficeId || ''));
        setOfclogoUrlMini(baseUrl + CommonUtils.formatString(Constants.officeLogoMiniPath, tenant, p?.mainFranchiseOfficeId || ''));
        setRole(p?.roles);
    }, [props]);

    const onLogoUpdate = (saved: boolean) => {
        setOpenEditor(false);
    }
    return (
        <>
            <div className={classNames("logo position-relative ", { "show-editor": role === EnumRoles.Administrator || props?.allowEditLogo, 'side-bar-collapsed': props?.sidebarCollapsed })}>
                <Fragment key={props?.logoKey + '&t=' + new Date().getTime()}>
                    <span className="logo-lg">
                        <Link to={ClientRoutesConstants.dashboard}>
                            <Img key={(ofclogoUrl || logoUrl) + props?.logoKey + '&t=' + new Date().getTime()}
                                src={[ofclogoUrl + '?q=' + props?.logoKey + '&t=' + new Date().getTime(), logoUrl + '?q=' + props?.logoKey + '&t=' + new Date().getTime(), logoMissing]}
                                loader={<Spinner size="sm" color="secondary" />}
                            />
                        </Link>
                    </span>
                    <span className={"logo-mini"} >
                        <Link to={ClientRoutesConstants.dashboard}>
                            <Img key={(ofclogoUrlMini || logoUrlMini) + props?.logoKey + '&t=' + new Date().getTime()}
                                src={[ofclogoUrlMini + '?q=' + props?.logoKey + '&t=' + new Date().getTime(), logoUrlMini + '?q=' + props?.logoKey + '&t=' + new Date().getTime(), logoMissing]}
                                loader={<Spinner size="sm" color="secondary" />}
                            />
                        </Link>
                    </span>
                    <div className='editor-trigger'>
                        <div className='d-flex justify-content-center align-items-center pencil-container f-11' onClick={() => setOpenEditor(true)}>
                            {!props?.sidebarCollapsed && <label className='pointer'>Change Logo</label>}
                            <i className='fa fa-pencil ml-1' ></i>
                        </div>
                    </div>
                </Fragment>
            </div >
            {
                props?.allowEditLogo
                && <ModalComponent title={'Change Site Logo'} halfFullScreen={true} isVisible={openEditor} onClose={() => setOpenEditor(false)}>
                    {openEditor && <SiteLogoEditorComponent type={IMAGETYPES.SITE_LOGO} onSuccess={onLogoUpdate} />}
                </ModalComponent>
            }

        </>
    );
});