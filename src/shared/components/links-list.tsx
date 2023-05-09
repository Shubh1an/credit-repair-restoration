import React from 'react';
import { Link } from 'react-router-dom';

import { INavMenu } from '../../models/interfaces/shared';

export const LinkListComponent = (props: { list: INavMenu[], onClick?: any }) => {
    return (
        <div className="link-list">
            {
                props?.list?.map((item: INavMenu, index: number) => {
                    return (
                        <div className="link-item" key={index}>
                            <Link to={item?.url} onClick={props?.onClick} title={item?.text}>{item?.text}</Link>
                            <Link to={item?.url} title={'Open in New Window'} target="_blank">
                                <i className="fa fa-external-link"></i>
                            </Link>
                        </div>
                    );
                })
            }
        </div>
    );
}