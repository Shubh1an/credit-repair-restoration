import React, { useState } from 'react';
import { useEffect } from 'react';

import { EnumBureaus, EnumBureausShorts } from '../../models/enums';
import { EQF_LOGO_SM, EQF_LOGO_MD, EXP_LOGO_SM, EXP_LOGO_MD, TU_LOGO_SM, TU_LOGO_MD } from '../components/images';

export const BureauLogoComponent = (props: { type?: string | EnumBureausShorts, size?: 'md' | 'sm' }) => {

    const [logo, setLogo] = useState(null as any);

    useEffect(() => {
        switch (props?.type?.toLowerCase()) {
            case EnumBureausShorts.TU?.toLowerCase():
            case EnumBureaus.TransUnion?.toLowerCase():
                if (props?.size === 'md') {
                    setLogo(TU_LOGO_MD);
                } else {
                    setLogo(TU_LOGO_SM);
                }
                break;
            case EnumBureausShorts.EXP?.toLowerCase():
            case EnumBureaus.Experian?.toLowerCase():
                if (props?.size === 'md') {
                    setLogo(EXP_LOGO_MD);
                } else {
                    setLogo(EXP_LOGO_SM);
                }
                break;
            case EnumBureausShorts.EQF?.toLowerCase():
            case EnumBureaus.Equifax?.toLowerCase():
                if (props?.size === 'md') {
                    setLogo(EQF_LOGO_MD);
                } else {
                    setLogo(EQF_LOGO_SM);
                }
                break;
        }
    }, [props?.type, props?.size]);

    return (
        <div className="bureau-logo">
            <img src={logo} alt='Bureau Logo' />
        </div>
    );
}