import React from 'react';

import { PersonalDetailsComponent } from './personal-details';


export const InfoComponent = ((props: any) => {
    return (
        <div className="tab-personal-details">
            <PersonalDetailsComponent {...props} />            
        </div>
    );
})
