import React from 'react';

import './unauth.scss'

const UnAuthorizedComponent = (props: any) => {
    return (
        <div className="content unauth-screen">
            <div className="middle-box">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="error-text">
                            <h1>403</h1>
                            <h3>
                                Not Authorized
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="row mt-5 pt-5">
                    <div className="col-sm-12">
                        <div className="error-desc">
                            <p>You are not authorized to access this page. Please contact your administrator.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UnAuthorizedComponent;