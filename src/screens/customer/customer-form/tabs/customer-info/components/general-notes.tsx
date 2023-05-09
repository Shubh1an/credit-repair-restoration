import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';

import { saveGeneralNotes } from '../../../../../../actions/customers.actions';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { Messages } from '../../../../../../shared/constants';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        saveGeneralNotes
    }, dispatch);
}

export const GeneralNotesComponent = connect(null, mapDispatchToProps)((props: { customer: any, saveGeneralNotes: any, isReadOnly: boolean }) => {

    const [isSaving, setIsSaving] = useState(false);
    const [note, setNote] = useState('');
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        setNote(props?.customer?.generalNote || '');
    }, [props?.customer]);

    const onSave = () => {
        setIsSaving(true);
        props?.saveGeneralNotes(props?.customer?.id, note?.trim(), axiosSource)
            .then((result: any) => {
                setIsSaving(false);
                if (result) {
                    toastr.success(`General Note saved successfully!`);
                } else {
                    toastr.error(Messages.GenericError);
                }
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsSaving(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <div className="form-group">
                        <label>Notes:  </label>
                        <textarea disabled={props?.isReadOnly} value={note} className="form-control" onChange={e => setNote(e.target.value)}></textarea>
                    </div>
                </div>
            </div>
            {!props?.isReadOnly &&
                <div className="row">
                    <div className="col-12 text-right">
                        <ButtonComponent disabled={isSaving || !(note?.trim()?.length)} text="Save" className="btn-primary" loading={isSaving} onClick={onSave} />
                    </div>
                </div>
            }
        </div>
    );
});