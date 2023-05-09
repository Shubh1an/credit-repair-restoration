import React, { useEffect, useState } from 'react';

import { ButtonComponent } from '../../../shared/components/button';

export const AddScreen = (props: { loading?: boolean, onSave: any, isEditing: any, screen: any }) => {

    useEffect(() => {
        setValue(props?.screen?.name);
        setDesc(props?.screen?.description);
    }, [props?.screen]);

    const [value, setValue] = useState('' as string);
    const [desc, setDesc] = useState('' as string);
    return (
        <div className="add-screen">
            <div className="row">
                <div className="col-12 col-sm-3">

                </div>
                <div className="col-12 col-sm-6 ">
                    <div className="form-group form-sm-inline">
                        <label style={{ minWidth: '100px' }}>Screen Name:</label>
                        <div className="input-group flex-1">
                            <input disabled={props?.isEditing} type="text" value={value ?? ''} onChange={(e) => setValue(e.target.value)} className="form-control" autoFocus={true} />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-2">

                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-3">

                </div>
                <div className="col-12 col-sm-6 ">
                    <div className="form-group form-sm-inline">
                        <label style={{ minWidth: '100px' }}>Description:</label>
                        <div className="input-group flex-1">
                            <input type="text" value={desc ?? ''} onChange={(e) => setDesc(e.target.value)} className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-2">

                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-9 d-flex justify-content-end">
                    <ButtonComponent text="Save" loading={props?.loading} disabled={!value?.trim()} onClick={() => props?.onSave(value, desc)}
                        className="btn btn-sm btn-primary shadow rounded w-100 w-sm-auto" >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
}