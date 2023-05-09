import './forget-password.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { ButtonComponent } from '../../../shared/components/button';
import { setPasswordResetLink } from '../../../actions/auth.actions';

const mapDispatchToProps = (dispatch: any) => {
   return bindActionCreators({
      setPasswordResetLink
   }, dispatch);
}
const ForgetPasswordComponent = connect(null, mapDispatchToProps)((props: any) => {

   const [uname, setUName] = useState('' as string);
   const [loading, setLoading] = useState(false);
   const [linkSent, setlinkSent] = useState(false);
   const [source, setSource] = useState(axios.CancelToken.source() as CancelTokenSource);

   const sentResetLink = () => {
      setLoading(true);
      props?.setPasswordResetLink({
         userNameOrEmailId: uname,
         domain: window.location.origin
      }, source).
         then((result: any) => {
            setLoading(false);
            setlinkSent(true);
         }).
         catch((err: any) => {
            if (!axios.isCancel(err)) {
               setLoading(false);
            }
         })
   }
   return (
      <div className="container-center">
         <div className="login-area">
            <div className="card panel-custom">
               <div className="card-heading custom_head">
                  <div className={classnames("view-header", { 'sent-pswd': linkSent })}>
                     <div className="header-icon">
                        <i className="pe-7s-refresh-2 mt-3"></i>
                     </div>
                     <div className="header-title" >
                        <h3>Password Reset</h3>
                        {!linkSent && <small><strong>Please fill the form to get the password reset link.</strong></small>}
                     </div>
                  </div>
               </div>

               <div className="card-body card_body_text forget-card">
                  {
                     linkSent ?
                        <div className="d-flex justify-content-between mt-4">
                           <i className="fa fa-check-circle text-success f-45"></i>
                           <p className="pl-3">An Email has been sent to your registered email id. Please reset your password and try login.</p>
                        </div>
                        :
                        <form>
                           <p>Fill with your mail/username to receive password reset link on your email id.</p>
                           <div className="form-group">
                              <label className="control-label" htmlFor="username">Email/Username</label>
                              <input type="text" placeholder="example@gmail.com" onChange={e => setUName(e.target.value)}
                                 title="Please enter you email address/username" name="username" id="username" className="form-control" />
                           </div>
                           <div>
                              <ButtonComponent onClick={sentResetLink} text="Reset password" loading={loading} disabled={!uname?.trim() && loading} className="btn btn-sm btn-primary shadow rounded w-100" >
                                 <i className="fa fa-key mr-2"></i>
                              </ButtonComponent>
                           </div>
                        </form>
                  }
                  <br />
                  <div className="text-center">
                     <strong> - OR -</strong>
                  </div>
                  <div className={classnames('login-buttons mt-3 mb-2', { 'd-flex justify-content-center': true })}>
                     <Link className="btn btn-secondary login" to="/login" > Login</Link>
                     {/* {!linkSent && <Link className="btn btn-secondary register" to="/register">Register</Link>} */}
                  </div>
               </div>
            </div>
         </div>
      </div >
   );
})

export default ForgetPasswordComponent;