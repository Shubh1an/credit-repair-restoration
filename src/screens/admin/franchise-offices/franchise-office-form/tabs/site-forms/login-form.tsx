import React, { useEffect, useState } from 'react';
import toastr from 'toastr';

import AuthService from '../../../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { UrlUtils } from '../../../../../../utils/http-url.util';
import { WindowUtils } from '../../../../../../utils/window-utils';
import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';

export const OfficeLoginFormComponent = (props: { officeId: string }) => {

    const [formHTML, setformHTML] = useState('');

    useEffect(() => {
        getLoginForm();
    }, []);

    const onCopy = () => {
        WindowUtils.CopyToClipBoard(formHTML).then(() => {
            toastr.success('Login Form Snippet Copied to Clipboard!!');
        });
    }
    const getLoginForm = () => {
        const payload = AuthService.getCurrentJWTPayload();
        const loginUrl = window.location.origin + '/' + payload?.tenant + '/login';
        const txt = LoginFormTemplate(loginUrl, props.officeId, UrlUtils.getPartnerKey());
        setformHTML(txt);
    }
    return (<div>
        <DashboardWidget title={'Login Form'} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
            <div className='lead-form pl-sm-5'>
                <div className='row mb-1'>
                    <div className='col-12 col-sm-2 pr-0'></div>
                    <div className='col-12 col-sm-5 pr-0'>
                        <label>
                            You can copy and paste the code snippet to add the portal login form to your site and use username and password to get log-in.
                        </label>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 col-sm-2 pr-0'>
                        <label>Form Source Code?</label>
                    </div>
                    <div className='col-12 col-sm-5 pt-1 form-group'>
                        <textarea readOnly value={formHTML} onChange={(e: any) => setformHTML(e.target.value)} className='form-control' style={{ height: '120px' }}></textarea>
                    </div>
                    <div className='col-12 col-sm-5 copy-control'>
                        <ButtonComponent text="Copy" className="btn-link" onClick={onCopy} >
                            <i className="fa fa-clone mr-2" aria-hidden="true"></i>
                        </ButtonComponent>
                    </div>
                </div>
            </div>
        </DashboardWidget>
    </div>);
}
const LoginFormTemplate = (url: string, officeId: string, tenant: string) => {
    return `<button id='account-progress-login-btn' type='button'>Login to Account Progress <div class='acc-lock'></div></button>
            <script type='text/javascript'>
                    (function () {
                        const loginButton = document.getElementById('account-progress-login-btn');
                        if (loginButton) {
                            loginButton.addEventListener('click', () => {
                                popupCenter({url:"${url}?officeid=${officeId}&tenant=${tenant}",title:'Login', w:600, h:600});
                            })
                        }
                        const popupCenter = ({url, title, w, h}) => {
                                // Fixes dual-screen position Most browsers Firefox
                                const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
                                const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;
                            
                                const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                                const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
                            
                                const systemZoom = width / window.screen.availWidth;
                                const left = (width - w) / 2 / systemZoom + dualScreenLeft
                                const top = (height - h) / 2 / systemZoom + dualScreenTop
                                const newWindow = window.open(url, title,'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no');
                                if (window.focus){ 
                                    newWindow.resizeTo(w/systemZoom,h/systemZoom);
                                    newWindow.moveBy(left,top);
                                    newWindow.focus();
                                }
                        }
                    })();                    
            </script>
            <style type='text/css'>
                #account-progress-login-btn {
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    background: #428bca;
                    border-radius: 8px;
                    box-shadow: #428bca 0 10px 20px -10px;
                    box-sizing: border-box;
                    color: #FFFFFF;
                    cursor: pointer;
                    font-family: Inter,Helvetica,"Apple Color Emoji","Segoe UI Emoji",NotoColorEmoji,"Noto Color Emoji","Segoe UI Symbol","Android Emoji",EmojiSymbols,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans",sans-serif;
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 24px;
                    opacity: 1;
                    outline: 0 solid transparent;
                    padding: 8px 18px;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    width: fit-content;
                    word-break: break-word;
                    border: 0;
                    margin:5px;
                }
                .acc-lock {
                    background: white;
                    border-radius: 3px;
                    width: 20px;
                    height: 15px;
                    margin-top: 15px;
                    position: relative;
                    margin-left: 10px;
                }
                .acc-lock:before {
                    content: "";
                    display: block;
                    position: absolute;
                    border: 3px solid white;
                    top: -14px;
                    left: 1.3px;
                    width: 17px;
                    height: 15px;
                    border-radius: 35px 35px 0 0;
                }
            </style>`;
}