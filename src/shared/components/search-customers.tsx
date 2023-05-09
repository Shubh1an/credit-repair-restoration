
import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';
import classnames from 'classnames';
import { validate as uuidValidate } from 'uuid';

import { IDropdown, ISearchBoxProps } from '../../models/interfaces/shared';
import { getCustomer } from '../../actions/customers.actions';
import { getLeads } from '../../actions/leads.actions';
import { ICustomerShort } from '../../models/interfaces/customer-view';
import { AutoComplete } from './autocomplete';
import { AutoCompleteSearchTypes } from '../../models/enums';
import { IFranchiseAgent } from '../../models/interfaces/franchise';
import { getFranchseAgentsList } from '../../actions/franchise-agents.actions';
import { getReferralAgentsList } from '../../actions/referral.actions';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getCustomer,
        getLeads,
        getFranchseAgentsList,
        getReferralAgentsList
    }, dispatch);
}
export const SearchCustomersComponent = connect(null, mapDispatchToProps)((props: ISearchBoxProps) => {

    const [list, setList] = useState([] as ICustomerShort[]);

    const customerPromise = (searchText: string, source: CancelTokenSource) => {
        if (props?.searchTypes === AutoCompleteSearchTypes.LEAD) {
            return props?.getLeads([], source, searchText).then((result: any) => {
                setList(result?.leads);
                return result?.leads;
            }).then((result: ICustomerShort[]) => {
                return result?.map(item => ({
                    name: item?.firstName + ' ' + (item?.lastName || ''),
                    abbreviation: item?.id
                }));
            }) as Promise<IDropdown[]>
        } else if (props?.searchTypes === AutoCompleteSearchTypes.FRENCHISE_AGENT) {
            return props?.getFranchseAgentsList([], source, searchText).then((result: any) => {
                setList(result?.agents);
                return result?.agents;
            }).then((result: IFranchiseAgent[]) => {
                return result?.map(item => ({
                    name: item?.firstName + ' ' + (item?.lastName || ''),
                    abbreviation: item?.id
                }));
            }) as Promise<IDropdown[]>
        } else if (props?.searchTypes === AutoCompleteSearchTypes.REFERRAL_AGENT) {
            return props?.getReferralAgentsList([], source, searchText).then((result: any) => {
                setList(result?.agents);
                return result?.agents;
            }).then((result: IFranchiseAgent[]) => {
                return result?.map(item => ({
                    name: item?.firstName + ' ' + (item?.lastName || ''),
                    abbreviation: item?.id
                }));
            }) as Promise<IDropdown[]>
        }
        else {
            return props?.getCustomer(searchText, source, props?.searchTypes === AutoCompleteSearchTypes.CUSTOMER_LEAD)
                .then((result: any) => {
                    setList(result);
                    return result;
                }).then((result: ICustomerShort[]) => {
                    return result?.map(item => ({
                        name: item?.fullName + (item?.isLead ? getLeadMessage() : ''),
                        abbreviation: item?.id
                    }));
                }) as Promise<IDropdown[]>
        }
    }
    const getLeadMessage = () => {
        return '<b class="text-danger ml-2">(Lead)</b>';
    }
    const onSelect = (text: string | IDropdown) => {
        if (props?.onSelect) {
            props?.onSelect(text);
        }
        if (typeof (text) === 'object' && uuidValidate(text?.abbreviation ?? '') && props?.onSelectedData) {
            const cust = list?.find(x => x.id === text?.abbreviation);
            props?.onSelectedData(cust);
        }
    }
    return (
        <div className={classnames("searchbox ")} >
            <AutoComplete asyncData={customerPromise} avoidMergeChangeWithSelectEvent={true} autoFocus={props?.autoFocus} isTextArea={props?.isTextArea} value={props?.defaultValue ?? ''} showSubmitArrow={props?.showSubmitArrow}
                placeholder={props?.placeholder} minSearchLength={props?.minSearchLength} onChange={props?.onChange} onSelect={onSelect} />
        </div>
    );
})