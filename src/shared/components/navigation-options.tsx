import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';

import { LinkListComponent } from '../../shared/components/links-list';
import { CommonUtils } from '../../utils/common-utils';
import { INavOptions } from '../../models/interfaces/shared';

const mapStateToProps = (state: any) => {
    return {
        currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens
    };
}
export const NavigationOptions: React.FC<any> = connect(mapStateToProps)((props: INavOptions) => {
    const [opened, setOpened] = useState(false);
    return (
        <div className="ace-tooltip">
            {props?.label &&
                <label className="nav-to-label">{props?.label}</label>
            }
            {opened ?
                <>
                    <span className="pointer go-to-options" title="Navigation Options" data-tip={props.cid ?? ''} data-for={"tooltip-go-to-" + (props.cid ?? 'test')} data-event='click'>
                        <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                    </span>
                    <ReactTooltip
                        getContent={(content: any) => <LinkListComponent list={CommonUtils.CustomersMenus(content, props.current, props.currentAccessibleScreens)} />}
                        className="go-to-menu-theme" id={"tooltip-go-to-" + (props.cid ?? 'test')} place='bottom' effect='solid'
                        clickable={true} />
                </>
                :
                <span className="pointer go-to-options" onMouseEnter={() => setOpened(!opened)} title="Navigation Options">
                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                </span>
            }
        </div>
    );
});