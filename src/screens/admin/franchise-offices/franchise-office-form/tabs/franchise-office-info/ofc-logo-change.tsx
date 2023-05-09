import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { Img } from 'react-image';
import { connect } from 'react-redux';
import { Button, Spinner } from 'reactstrap';
import { bindActionCreators } from 'redux';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import toastr from 'toastr';

import { IMAGETYPES } from '../../../../../../models/enums';
import { logoMissing } from '../../../../../../shared/components/images';
import { LargeSpinner } from '../../../../../../shared/components/large-spinner';
import { ModalComponent } from '../../../../../../shared/components/modal';
import { SiteLogoEditorComponent } from '../../../../../../shared/components/site-logo-editor';
import { Constants, Messages } from '../../../../../../shared/constants';
import { CommonUtils } from '../../../../../../utils/common-utils';
import { UrlUtils } from '../../../../../../utils/http-url.util';
import { removeOfficeLogo, updateKey } from '../../../../../../actions/media.actions';

const mapStateToProps = (state: any) => {
    return {
        logoKey: state?.sharedModel?.logoChangedKey
    };
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        updateKey,
        removeOfficeLogo
    }, dispatch);
}
export const FranchiseOfficeLogoChangeComponent = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const [openModal, setOpenModal] = useState(false as boolean);
    const [removing, setRemoving] = useState(false as boolean);
    const [ofclogoUrl, setOfclogoUrl] = useState('' as string);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [logoExists, setLogoExists] = useState(false as boolean);

    useEffect(() => {
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);

    useEffect(() => {
        if (ofclogoUrl) {
            fetch(ofclogoUrl).then((response: any) => {
                if (!response.ok) {
                    throw new Error("not found!");
                } else {
                    return true;
                }
            }).then(() => {
                setLogoExists(true);
            }).catch(() => {
                setLogoExists(false);
            })
        }
    }, [ofclogoUrl, props?.logoKey]);
    useEffect(() => {
        if (props?.officeId) {
            const tenant = UrlUtils.getPartnerKey();
            const baseUrl = UrlUtils.getBaseUrl();
            setOfclogoUrl(baseUrl + CommonUtils.formatString(Constants.officeLogoPath, tenant, props?.officeId || ''));
        }
    }, [props]);
    const onEdit = () => {
        setOpenModal(true);
    }
    const onSave = (imageData: any) => {
        setOpenModal(false);
    }
    const onRemove = async () => {
        let result = await confirm({
            title: 'Delete Company Office Logo?',
            message: 'Are you sure to delete Company Office Logo?',
            confirmText: "YES, Delete",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setRemoving(true);
            props?.removeOfficeLogo(props?.officeId, axiosSource)
                .then((result: string) => {
                    setRemoving(false);
                    toastr.success(result);
                    props.updateKey();
                    setOfclogoUrl('');
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setRemoving(false);
                        if (err?.response?.data) {
                            toastr.error(err?.response?.data);
                        }
                    }
                })
        }
    }
    return (
        <>
            <div className='ofc-logo-preview d-flex flex-column align-items-center justify-content-center p-4 pl-sm-5  border-left-grad-sm'>
                {
                    removing && <LargeSpinner />
                }
                <Img className='ofc-image-logo' key={ofclogoUrl + props?.logoKey + new Date().getTime()} src={[ofclogoUrl + '?q=' + props?.logoKey + '&t=' + new Date().getTime(), logoMissing]} loader={<Spinner size="sm" color="secondary" />} />
                <div className='logo-controls'>
                    <>
                        <span className='edit-ofc-logo'>
                            <Button color='link btn-sm pl-2 pr-2 text-dark hover-zoom' onClick={onEdit}>
                                <i className="fa fa-pencil"></i>
                            </Button>
                        </span>
                        {
                            logoExists &&
                            <span className='edit-ofc-logo bg-danger text-white'>
                                <Button color='link btn-sm pl-2 pr-2 text-dark hover-zoom' onClick={onRemove}>
                                    <i className="fa fa-trash"></i>
                                </Button>
                            </span>
                        }
                    </>
                </div>
            </div>

            <ModalComponent title={'Change Company Office Logo'} halfFullScreen={true} isVisible={openModal} onClose={() => setOpenModal(false)}>
                {openModal && <SiteLogoEditorComponent officeId={props?.officeId} type={IMAGETYPES.FRANCHISE_OFFICE_LOGO} onSuccess={onSave} />}
            </ModalComponent>
        </>
    )
});