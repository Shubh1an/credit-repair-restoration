import React from 'react';
import { EnumScreens } from '../../models/enums';
import { withAuthorize } from '../../shared/hoc/authorize';

const AffiliateSignupComponent = (props: any) => {
    return (
        <div className="affiliate-signup">
            <section className="content-header">
                <div className="header-icon">
                    <i className="fa fa-dashboard"></i>
                </div>
                <div className="header-title">
                    <h1>Affiliate Signup</h1>
                    <small>Affiliate</small>
                </div>
            </section>
            <section className="content">
                <div className="row">
                    <div className="col-12" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h1> Coming Soon!!!</h1>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default withAuthorize(AffiliateSignupComponent, EnumScreens.AffiliateSignUp);