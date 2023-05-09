import './register.scss';

import React from 'react';
import { ClientRoutesConstants } from '../../../shared/constants';
import { Link } from 'react-router-dom';

class RegisterComponent extends React.PureComponent {

   render() {
      return (
         <div className="container-center lg">
            <div className="login-area">
               <div className="card  panel-custom">
                  <div className="card-heading custom_head">
                     <div className="view-header">
                        <div className="header-icon">
                           <i className="pe-7s-unlock"></i>
                        </div>
                        <div className="header-title">
                           <h3>Register</h3>
                           <small><strong>Please enter your data to register.</strong></small>
                        </div>
                     </div>
                  </div>
                  <div className="card-body">
                     <form action="index.html" id="loginForm">
                        <div className="row">
                           <div className="form-group col-lg-6">
                              <label>Username</label>
                              <input type="text" id="username" className="form-control" name="username" />
                              <span className="help-block small">Your unique username to app</span>
                           </div>
                           <div className="form-group col-lg-6">
                              <label>Password</label>
                              <input type="password" id="password" className="form-control" name="password" />
                              <span className="help-block small">Your hard to guess password</span>
                           </div>
                           <div className="form-group col-lg-6">
                              <label>Repeat Password</label>
                              <input type="password" id="repeatpassword" className="form-control" name="repeatpassword" />
                              <span className="help-block small">Please repeat your pasword</span>
                           </div>
                           <div className="form-group col-lg-6">
                              <label>Email Address</label>
                              <input type="text" id="email" className="form-control" name="email" />
                              <span className="help-block small">Your address email to contact</span>
                           </div>
                        </div>
                        <div className="register-buttons">
                           <button className="btn btn-primary register" type="button">Register</button>
                           <Link className="btn btn-secondary login" to={ClientRoutesConstants.login}>Login</Link>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

export default RegisterComponent;