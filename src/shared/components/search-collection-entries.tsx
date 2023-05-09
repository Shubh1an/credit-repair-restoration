
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';
import classnames from 'classnames';

import { ICollectionEntry, IDropdown } from '../../models/interfaces/shared';
import { searchCollectionEntries } from '../../actions/fast-edit.actions';
import { AutoComplete } from './autocomplete';
import { CollectionEntryTypes } from '../../models/enums';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        searchCollectionEntries
    }, dispatch);
}
export const SearchCollectionEntries = connect(null, mapDispatchToProps)((props: {
    searchCollectionEntries: any,
    type: CollectionEntryTypes,
    defaultValue?: string,
    onSelect?: any,
    onChange?: any,
    placeholder?: string,
    minSearchLength?: number,
    limit?: number,
    isTextArea?: boolean,
    autoFocus?: boolean
}) => {

    const apiPromise = (searchText: string, source: CancelTokenSource) => {
        return props?.searchCollectionEntries(props.type, searchText, props?.limit || 100, source)
            .then((result: ICollectionEntry[]) => {
                return result?.map(item => ({
                    name: item?.name,
                    abbreviation: item?.id
                }));
            }) as Promise<IDropdown[]>
    }
    return (
        <div className={classnames("searchbox flex-1")} >
            <AutoComplete asyncData={apiPromise} value={props?.defaultValue ?? ''} isTextArea={props?.isTextArea}
                placeholder={props?.placeholder} minSearchLength={props?.minSearchLength || 3} onSelect={props?.onSelect}
                onChange={props?.onChange} autoFocus={props?.autoFocus}/>
        </div >
    );
})