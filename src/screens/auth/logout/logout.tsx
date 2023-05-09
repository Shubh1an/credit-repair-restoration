import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setLogout } from '../../../actions/auth.actions';
import { ClientRoutesConstants } from '../../../shared/constants';

class LogoutComponent extends React.PureComponent<any, any> {
    componentDidMount() {
        this.props.setLogout();
        this.props.history.push(ClientRoutesConstants.login);
        setTimeout(() => {
            window.location.reload();
        }, 0);
    }
    render() {
        return (
            <div className="text-center">
                <h2>You Are logged out !</h2>
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        setLogout
    }, dispatch);
}
export default connect(null, mapDispatchToProps)(LogoutComponent);