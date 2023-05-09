import React from 'react';

import { IFranchiseAgent } from '../../../../../../models/interfaces/franchise';
import { AgentNotesComponent } from '../../../../../customer/customer-form/tabs/notes/agent-notes';

export const ReferralAgentNotesComponent = (props: { agent: IFranchiseAgent }) => {

    return (
        <AgentNotesComponent agent={props?.agent} />
    );
}
