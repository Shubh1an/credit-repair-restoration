import React from 'react';

import { ChangeSiteLogoComponent } from '../../screens/admin/site-logo/change-site-logo';
import { IMAGETYPES } from '../../models/enums';

export const SiteLogoEditorComponent = (props: { type: IMAGETYPES, onSuccess: any, officeId?: string }) => {
    return (
        <div className="site-logo-editor">
            <ChangeSiteLogoComponent {...props} />
        </div>
    );
}