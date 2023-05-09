import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toastr from 'toastr';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ClientRoutesConstants, Messages } from '../../../../../shared/constants';
import { ButtonComponent } from '../../../../../shared/components/button';
import { deleteLead } from '../../../../../actions/leads.actions';



const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        deleteLead
    }, dispatch);
}
export const LeadDeleteComponent = connect(null, mapDispatchToProps)((props: {
    cid: string, onReloadLeadsList: any, deleteLead: any
}) => {

    useEffect(() => {
        setAxiosSource(axios.CancelToken.source());
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.cid])

    const [redirectToList, setRedirectToList] = useState(false);

    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());
    const [isDeleting, setIsDeleting] = useState(false);

    const BodyMesage = () => (
        <div className='text-danger'>
            Are you sure you want to delete this Lead?
            <div>
                Once deleted can not be undone!
            </div>
        </div>
    );
    const onCustomerDelete = async () => {
        let result = await confirm({
            title: 'Delete Lead',
            bodyComponent: BodyMesage,
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setIsDeleting(true);
            props?.deleteLead(props?.cid, axiosSource)
                .then((result: any) => {
                    setIsDeleting(false);
                    if (result) {
                        toastr.success('Lead deleted successfully!!');
                        if (props?.onReloadLeadsList) {
                            props?.onReloadLeadsList();
                        }
                        setRedirectToList(true);
                    } else {
                        toastr.error(Messages.GenericError);
                    }
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setIsDeleting(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                });
        }
    }

    return (
        !redirectToList
            ?
            <ButtonComponent text="Delete Lead" loading={isDeleting} sizeClass={'btn-md'} className="btn-danger w-100" onClick={onCustomerDelete}>
                <i className="fa fa-trash mr-2"></i>
            </ButtonComponent>
            : <Redirect to={ClientRoutesConstants.leads} />
    );
});
