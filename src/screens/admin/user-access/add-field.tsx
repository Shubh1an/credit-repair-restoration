import React, { useEffect, useState } from 'react';

import { ButtonComponent } from '../../../shared/components/button';

export const AddField = (props: { loading?: boolean, onSave: any, screen: string, editingData: any, isEditing: boolean }) => {

    useEffect(() => {
        if (props.isEditing) {
            setValue(props?.editingData?.name);
            setDesc(props?.editingData?.description);
        }
    }, [])

    const [value, setValue] = useState('' as string);
    const [desc, setDesc] = useState('' as string);
    return (
        <div className="add-screen">
            <div className="row">
                <div className="col-12 col-sm-3">

                </div>
                <div className="col-12 col-sm-6 ">
                    <div className="form-group">
                        <label style={{ minWidth: '100px' }}>Screen Name:</label>
                        <div className="input-group flex-1">
                            {props?.screen}
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
                    <div className="form-group ">
                        <label style={{ minWidth: '100px' }}>Field Name:</label>
                        <div className="input-group ">
                            <input type="text" disabled={props?.isEditing} value={value ?? ''} onChange={(e) => setValue(e.target?.value?.trim())} className="form-control" autoFocus={true} />
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
                    <div className="form-group ">
                        <label style={{ minWidth: '100px' }}>Description:</label>
                        <div className="input-group ">
                            <input type="text" value={desc ?? ''} onChange={(e) => setDesc(e.target.value?.trim())} className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-2">

                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-9 d-flex justify-content-end">
                    <ButtonComponent text="Save" loading={props?.loading} disabled={!value?.trim()} onClick={() => props?.onSave(props?.screen, value, desc, props?.editingData?.id)} className="btn btn-sm btn-primary shadow rounded w-100 w-sm-auto" >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div >
    );
}