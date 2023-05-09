import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';

import { EnumScreens, NotesTypes } from '../../../../../models/enums';
import { ModalComponent } from '../../../../../shared/components/modal';
import { Messages } from '../../../../../shared/constants';
import { CannedNotes } from './canned-notes';
import { ISaveNotesPayLoad, NotesComponent } from './notes';
import { addInternalNote, deleteInternalNote } from '../../../../../actions/customers.actions';
import { IDropdown } from '../../../../../models/interfaces/shared';
import AuthService from '../../../../../core/services/auth.service';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        addInternalNote,
        deleteInternalNote
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.CustomerDetails)
    };
}
export const CustomerProcessingNotesComponent = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [content, setContent] = useState('' as string | undefined);
    const [customer, setCustomer] = useState(null as any);
    const [agents, setAgents] = useState([] as IDropdown[]);
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);

    useEffect(() => {
        const list = props?.agents?.map((item: any) => {
            return {
                abbreviation: item?.id,
                name: item?.fullName
            }
        })
        setAgents(list);
    }, [props?.agents])
    useEffect(() => {
        setCustomer({
            ...props?.customer,
            historicalInternalNotes: (props?.customer?.historicalInternalNotes || [])?.reverse()
        });
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, [props?.customer])

    const onDelete = (noteId: string) => {
        setDeleting(true);
        props.deleteInternalNote(noteId, axiosSource)
            .then((result: string) => {
                setDeleting(false);
                setCustomer({
                    ...customer,
                    historicalInternalNotes: (customer?.historicalInternalNotes || []).filter((x: any) => x.internalNoteId !== noteId)
                });
                toastr.success('Internal Note removed successfully!!');
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setDeleting(false);
                    toastr.error(err?.response?.data);
                }
            })
    }

    const onSave = (param: ISaveNotesPayLoad) => {
        setSaving(true);
        setContent(param.content);
        props.addInternalNote(props?.customer?.id, param?.content, param?.agentId, param?.isEmailSend, axiosSource)
            .then((result: string) => {
                setSaving(false);
                toastr.success(result);
                setContent('');
                props?.onReloadCustomer();
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setSaving(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    const onCannedSelect = (param: any) => {
        setContent(param?.note);
    }
    const onCannedClose = (param: any) => {
        setCannedNotes(false);
    }
    const [cannedNotes, setCannedNotes] = useState(false);

    return (
        <>
            <NotesComponent type={NotesTypes.ProcessingNotes} title={'Processing Notes'}
                agents={agents}
                notes={customer?.historicalInternalNotes}
                onSave={onSave}
                saving={saving}
                content={content}
                deleting={deleting}
                onDelete={onDelete}
                customer={customer}
                allowAddNotes={(!AuthService.isFieldHidden(props.AuthRules, 'AddProcessingNotes') && !AuthService.isFieldReadOnly(props.AuthRules, 'AddProcessingNotes'))}
                allowRemoveNotes={(!AuthService.isFieldHidden(props.AuthRules, 'RemoveProcessingNotes') && !AuthService.isFieldReadOnly(props.AuthRules, 'RemoveProcessingNotes'))}
                onOpenCannedNotes={() => { setCannedNotes(true) }}
                isProcessingNotes={true}
            />
            <ModalComponent title={"Client Canned Notes"} isVisible={cannedNotes} onClose={() => setCannedNotes(false)} >
                <CannedNotes onSelect={onCannedSelect} type={NotesTypes.ProcessingNotes}
                    onClose={onCannedClose} />
            </ModalComponent>
        </>
    );
})