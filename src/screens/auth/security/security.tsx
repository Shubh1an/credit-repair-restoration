import React from 'react';

import { ChangePasswordComponent } from './components/change-password';

const SecurityComponent = (props: any) => {

    return (
        <div className="fast-edit-accounts">
            <section className="content-header row">
                <div className="col-10">
                    <div className="header-icon">
                        <i className="fa fa-users"></i>
                    </div>
                    <div className="header-title ml-0">
                        <h1>Security</h1>
                        <small>Update Password, Update Notification settings etc  </small>
                    </div>
                </div>
                <div className="col-2 pt-3 p-0">
                </div>
            </section>
            <section className="content">
                <ChangePasswordComponent />
            </section>
        </div >
    );
}

export default SecurityComponent;