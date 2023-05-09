import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllSubFieldsForSection, getFinalCollectionToken, } from '../../actions/email-templates.actions';
import { Alignment } from '../../models/enums';
import { ICheckboxList, INameValueSmall } from '../../models/interfaces/shared';
import { Messages } from '../constants';
import { ButtonComponent } from './button';
import { CheckboxList } from './checkbox-list';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getAllSubFieldsForSection,
        getFinalCollectionToken
    }, dispatch);
}

const HTMLEditorTokenWizardComponent = connect(null, mapDispatchToProps)((props: {
    sectionType: string, getAllSubFieldsForSection: any, getFinalCollectionToken: any,
    onSelect: any
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedFields, setSelectedFields] = useState([] as string[]);
    const [fields, setFields] = useState([] as INameValueSmall[]);
    const [checkFields, setCheckFields] = useState([] as ICheckboxList[]);
    const [token, setToken] = useState('' as string);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        getFields(props.sectionType);
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [])

    const getFields = (sectionType: string) => {
        setLoading(true);
        props?.getAllSubFieldsForSection(sectionType, axiosSource)
            .then((f: INameValueSmall[]) => {
                setLoading(false);
                setFields(f);
                const m = (f || [])?.map((s: INameValueSmall) => ({
                    text: s.name,
                    value: s?.value,
                    title: s?.name
                } as ICheckboxList));
                setCheckFields(m);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                }
            });
    }
    const getToken = () => {
        setLoading(true);
        const textes = fields?.filter((s: INameValueSmall) => selectedFields.includes(s.value))?.map(
            (s: INameValueSmall) => s?.name) || [];
        const payload = {
            selectedSection: props?.sectionType,
            selectedItems: textes
        };
        props?.getFinalCollectionToken(payload, axiosSource)
            .then((t: string) => {
                setLoading(false);
                setToken(t);
                props?.onSelect(t);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                }
            });
    }
    const handleChange = (list: string[]) => {
        setSelectedFields(list);
    }
    return (
        <div className='token-wizard'>
            <div className='row'>
                <div className='col-12'>
                    This section type supports the following fields. Check each of the fields you would like to insert into your section and click the Next button.
                </div>
                <div className='col-12 max-height-400px custom-scrollbar fields-checkbox p-3'>
                    <CheckboxList selectedValues={selectedFields || []} alignment={Alignment.Vertical}
                        list={checkFields || []} onChange={handleChange} />
                </div>
                <div className='col-12'>
                    <div className="d-flex justify-content-end mb-2 mt-2">
                        <ButtonComponent disabled={!selectedFields?.length} loading={loading} className="btn btn-primary ml-3" text="Done" onClick={getToken}>
                        </ButtonComponent>
                    </div>
                </div>
            </div>
        </div>
    );
})

export default HTMLEditorTokenWizardComponent;