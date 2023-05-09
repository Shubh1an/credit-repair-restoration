import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { EnumRoles } from '../../models/enums'

const mapStateToProps = (state: any) => {
    return {
        leftMenuOpened: state?.sharedModel?.leftMenuOpened
    };
}

export const StickyHeaderComponent = connect(mapStateToProps)((props: { data: any, type: EnumRoles, leftMenuOpened: boolean }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [top, setTop] = useState(0 as number);
    const [left, setLeft] = useState(0 as number);
    useEffect(() => {
        const focusElement = document.getElementById('myScrollToElement');
        const windowScrollhandler = (e: any) => {
            if (focusElement) {
                const { offsetTop } = focusElement;
                const visible = e.currentTarget.scrollY >= (offsetTop - 50);
                setIsVisible(visible);
                if (visible) {
                    setDimensionsofHeader();
                }
            }
        }
        window.addEventListener('scroll', windowScrollhandler);
        return () => {
            window.removeEventListener('scroll', windowScrollhandler);
        }
    }, []);
    const setDimensionsofHeader = () => {
        const mainSidebar = document.getElementById("main-sidebar");
        const mainHeader = document.getElementById("main-header");
        if (mainHeader) {
            setTop(mainHeader.clientHeight);
        }
        if (mainSidebar) {
            setLeft(isMobile ? (props?.leftMenuOpened ? mainSidebar.clientWidth : 0) : mainSidebar.clientWidth);
        }
    }
    useEffect(() => {
        setTimeout(() => {
            setDimensionsofHeader();
        }, 500);
    }, [props?.leftMenuOpened]);

    return (
        isVisible ? <div className='sticky-header-user' style={{ 'top': top, 'left': left }}>
            <div className='row'>
                <div className='col-12 col-sm-12 d-flex'>
                    <div>
                        <b>
                            {
                                props?.data?.fullName
                            }
                        </b>
                        <span className='f-15'> ( {props?.data?.email} ) </span>
                    </div>
                    <div className='pl-4'>
                        <label>Company:</label>
                        <span className='f-12 pl-2'>
                            {props?.data?.agent?.office?.name}
                            {props?.type === EnumRoles.Customer ?
                                <> {props?.data?.agent?.office?.name}</>
                                : props?.type === EnumRoles.Lead ?
                                    <> {props?.data?.franchiseAgent?.office?.name || '-'}</> : null}
                        </span>
                    </div>
                </div>
                <div className='col-10'></div>
                <div className='col-12 d-flex'>
                    <div className=' form-group form-inline mb-0'>
                        <label>Company Agent:</label>
                        <div className='control-group f-13 pl-2'>
                            {props?.type === EnumRoles.Customer ?
                                <> {props?.data?.agent?.fullName}, ({props?.data?.agent?.email})</>
                                : props?.type === EnumRoles.Lead ?
                                    <> {props?.data?.franchiseAgent?.fullName}, ({props?.data?.franchiseAgent?.email})</> : null}
                        </div>
                    </div>
                    <div className=' form-group form-inline pl-2 mb-0'>
                        <label>Affiliate Agent:</label>
                        <div className='control-group f-13 pl-2'>
                            {props?.type === EnumRoles.Customer ?
                                <> {props?.data?.referrer?.fullName}, ({props?.data?.referrer?.email})</>
                                : props?.type === EnumRoles.Lead ?
                                    <> {props?.data?.referralAgent?.fullName}, ({props?.data?.referralAgent?.email})</> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div> : null
    )
});