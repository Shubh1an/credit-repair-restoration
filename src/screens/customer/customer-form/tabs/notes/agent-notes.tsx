import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios, { CancelTokenSource } from 'axios';
import toastr from 'toastr';

import { EnumScreens, NotesTypes } from '../../../../../models/enums';
import { ISaveNotesPayLoad, NotesComponent } from './notes';
import { CannedNotes } from './canned-notes';
import { ModalComponent } from '../../../../../shared/components/modal';
import { AddFranchiseAgentNotes, deleteFranchiseAgentNote, getFranchiseAgentNotes } from '../../../../../actions/franchise-agents.actions';
import { getFranchiseAgents } from '../../../../../actions/customers.actions';
import { Messages } from '../../../../../shared/constants';
import AuthService from '../../../../../core/services/auth.service';
import { IDropdown } from '../../../../../models/interfaces/shared';
import { IFranchiseAgentNotes } from '../../../../../models/interfaces/franchise';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        AddFranchiseAgentNotes,
        deleteFranchiseAgentNote,
        getFranchiseAgentNotes
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel.AuthRules, EnumScreens.ViewFranchiseAgents)
    };
}

export const AgentNotesComponent = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [notes, setNotes] = useState([] as IFranchiseAgentNotes[]);
    const [content, setContent] = useState('' as string | undefined);
    const [franchiseAgents, setFranchiseAgents] = useState([] as IDropdown[]);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    const loadNotes = () => {
        setLoading(true);
        props.getFranchiseAgentNotes(props?.agent?.membershipId, axiosSource)
            .then((result: any[]) => {
                setLoading(false);
                setNotes(result);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    const loadFranchiseAgents = () => {
        getFranchiseAgents(axiosSource)
            .then((result: any[]) => {
                setFranchiseAgents(result?.map(x => ({ abbreviation: x?.id, name: x?.fullName })) || []);
            });
    }
    const onDelete = (noteId: string) => {
        setDeleting(true);
        props.deleteFranchiseAgentNote(noteId, axiosSource)
            .then((result: string) => {
                setDeleting(false);
                setNotes(notes?.filter(x => x.id !== noteId));
                toastr.success('Client Note removed successfully!!');
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
        const payload = {
            agentMembershipId: props?.agent?.membershipId,
            agentName: props?.agent?.firstName + ' ' + props?.agent?.lastName,
            noteText: param?.content,
            sendToAgentId: param?.agentId,
            sendEmail: param?.isEmailSend,
        };
        props.AddFranchiseAgentNotes(payload, axiosSource)
            .then((result: any) => {
                setSaving(false);
                if (result?.status) {
                    toastr.success(result.message);
                    setContent('');
                    loadNotes();
                } else {
                    toastr.error(result.message);
                }
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setSaving(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    useEffect(() => {
        loadNotes();
        loadFranchiseAgents();
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, [props?.agent])

    const onCannedSelect = (param: any) => {
        setContent(param?.note);
    }
    const onCannedClose = (param: any) => {
        setCannedNotes(false);
    }

    const [cannedNotes, setCannedNotes] = useState(false);
    return (
        <>
            <NotesComponent type={NotesTypes.ClientNotes} title={'Notes'}
                agents={franchiseAgents}
                notes={notes}
                onSave={onSave}
                onDelete={onDelete}
                saving={saving}
                content={content}
                deleting={deleting}
                loading={loading}
                allowAddNotes={(!AuthService.isFieldHidden(props.AuthRules, 'AddFranchiseAgentNotes') || !AuthService.isFieldReadOnly(props.AuthRules, 'AddFranchiseAgentNotes'))}
                allowRemoveNotes={(!AuthService.isFieldHidden(props.AuthRules, 'RemoveFranchiseAgentNotes') || !AuthService.isFieldReadOnly(props.AuthRules, 'RemoveFranchiseAgentNotes'))}
                onOpenCannedNotes={() => { setCannedNotes(true) }}
            />
            <ModalComponent title={"Canned Notes"} isVisible={cannedNotes} onClose={() => setCannedNotes(false)}>
                <CannedNotes onSelect={onCannedSelect} type={NotesTypes.ClientNotes}
                    onClose={onCannedClose} />
            </ModalComponent>

        </>
    );
})