import React, { useEffect, useState } from 'react';
import Spinner from 'reactstrap/lib/Spinner';

import { IDashboardWidget } from '../../../models/interfaces/dashboard';

export const DashboardWidget = (props: IDashboardWidget) => {

    const [settingOpened, setSettingOpened] = useState(false);
    const [minimize, setMinimize] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        const listner = (e: any) => {
            setSettingOpened(false);
        };
        document.addEventListener('click', listner);
        return () => {
            document.removeEventListener('click', listner);
        }
    }, []);
    const loading = props.isLoading;

    const reloadClick = () => {
        if (!loading && props.reloadHandler) {
            props.reloadHandler();
        }
    }
    const toggleSettings = (e: any) => {
        e.stopPropagation();
        setSettingOpened(!settingOpened);
    }
    return (
        <div className={"card lobicard lobicard-custom-control lobicard-sortable d-block " + (fullscreen ? ' fullscreen ' : '') + (props?.rootClassName || '')} >
            {
                !props?.hideHeader &&
                <div className={"card-header " + (props.headerClass ?? '')}>
                    <div className="card-title custom_title" style={{ maxWidth: "100%", flex: 1 }}>
                        <h4 className="widget-title">{props?.title}</h4>
                    </div>
                    <div className={"dropdown " + (settingOpened && 'show')}>
                        <ul className={"dropdown-menu dropdown-menu-right " + (settingOpened && 'show')}>
                            {
                                props?.reload && !minimize &&
                                <li onClick={reloadClick} className={loading ? " disabled disabled-reload " : ''}>
                                    <a href="/" onClick={e => e.preventDefault()} title=""><i className="card-control-icon fa fa-refresh"></i><span className="control-title">Reload</span></a>
                                </li>
                            }
                            {
                                props?.allowMinimize &&
                                <li onClick={() => setMinimize(!minimize)}>
                                    <a href="/" onClick={e => e.preventDefault()} title=""><i className={"card-control-icon fa" + (minimize ? " fa-chevron-down" : " fa-chevron-up")}></i><span className="control-title">{minimize ? 'Minimize' : 'Maximize'}</span></a>
                                </li>
                            }
                            {
                                props?.allowFullscreen &&
                                <li onClick={() => setFullscreen(!fullscreen)}>
                                    <a href="/" onClick={e => e.preventDefault()} title=""><i className={"card-control-icon fa " + (fullscreen ? " fa-compress" : " fa-expand")}></i><span className="control-title">Fullscreen</span></a>
                                </li>
                            }
                        </ul>
                        <div className="dropdown-toggle" data-toggle="dropdown" onClick={toggleSettings}><span className="card-control-icon fa fa-cog"></span>
                        </div>
                    </div>
                </div>
            }
            {
                !minimize &&
                <div className={"card-body position-relative " + props?.className}>
                    {props.children}
                    {
                        loading &&
                        <div className="section-spinner">
                            <Spinner size="md" color="secondary" />
                        </div>
                    }
                </div>
            }
        </div>
    );
}