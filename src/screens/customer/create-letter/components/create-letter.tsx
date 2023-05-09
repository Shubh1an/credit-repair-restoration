import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useParams } from 'react-router-dom';

import { ICreateLetterSource } from '../../../../models/interfaces/create-letter';
import { LetterCreationOptionsComponent } from './letter-creation-options';
import { LetterSourceComponent } from './letter-source';
import { SearchForLetterComponent } from './search-for-letter';
import { saveLetterSource } from '../../../../actions/create-letter.actions';
import { DashboardWidget } from '../../../dashboard/components/dashboard-widget';
import { CustomerRoundInfo } from './customer-round-info';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        saveLetterSource,
    }, dispatch)
}
const mapStateToProps = (state: any) => {
    return {
        model: state.createLetterModel,
    };
}
export const CreateLetter = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const { cid } = useParams() as { cid: string, date: string };


    const onSaveLetterSource = (sources: ICreateLetterSource, isShowMore: boolean) => {
        props?.saveLetterSource({
            sources,
            isShowMore
        });
    }
    return (
        <DashboardWidget headerClass="create-letter-header" title={<CustomerRoundInfo cid={cid} customerDetails={props?.customerDetails} />} allowFullscreen={true} allowMaximize={true} allowMinimize={true}
            reload={false} >
            <div className="row mb-4">
                <div className="col-12 col-sm-3 step-1">
                    <LetterSourceComponent onSave={onSaveLetterSource} letterSource={props?.model?.letterSource} />
                    <SearchForLetterComponent cid={cid} />
                </div>
                <div className="col-12 col-sm-9 step-3 d-flex flex-column justify-content-center">
                    <LetterCreationOptionsComponent customer={props?.customer} />
                </div>
            </div>
        </DashboardWidget>
    );
});