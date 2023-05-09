import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { ICustomerView, ILetterCounts } from '../../../models/interfaces/customer-view';
import { getLettersCounts } from '../../../actions/dashboard.actions';
import { ClientRoutesConstants, Messages } from '../../../shared/constants';

const matchDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getLettersCounts
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        customerLetters: state.dashboardModel?.customerLetters,
    };
}
export const LettersViewComponent = connect(mapStateToProps, matchDispatchToProps)((props: LetterCountsType) => {
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());
    useEffect(() => {
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);

    useEffect(() => {
        if (props.isLoading && props.getLettersCounts) {
            setAxiosSource(axios.CancelToken.source());
            props.getLettersCounts(axiosSource)
                .then((result: ILetterCounts) => {
                    props.reloadComplete();
                })
                .catch((error: any) => {
                    props.reloadComplete(true);
                })
        }
    }, [props.isLoading])

    return (
        <>
            <div className="row">
                <div className="col-12 text-right pr-0">
                    <Link to={ClientRoutesConstants.emailTemplates} className="btn btn-link f-12 text-success font-weight-bold">
                        Open Letter Template List
                        <i className="fa fa-chevron-right ml-1"></i>
                    </Link>
                </div>
            </div>
            {
                props?.customerLetters?.map((letter, index) => {
                    return (<div className={"row detailswork  mt-2 mb-2 " + (index === props?.customerLetters?.length - 1 ? "" : " border-bottom ")} key={index}>
                        <div className="col-12 pl-0 pr-0 text-danger d-flex">
                            <span className="pr-1 f-14 font-weight-bold">&gt;</span> <Link to={ClientRoutesConstants.emailTemplates + '/' + letter?.id} className="letter-link pl-1" title={letter?.name}>{letter?.name}</Link>
                        </div>
                    </div>);
                })
            }

        </>
    );
});
type LetterCountsType = ICustomerView & {
    customerLetters: ILetterCounts[],
    getLettersCounts: (param: any) => any,
}