import React, { createRef, forwardRef, useImperativeHandle, useState } from 'react';

export const FileUploadButton = forwardRef((props: { label?: string, onChange: any, onClose?: any, ref?: any }, ref) => {

    const [selectedFiles, setSelectedFiles] = useState([] as any[]);
    const fileRef = createRef() as any;

    // these methods can be called from parent component
    useImperativeHandle(ref, () => ({
        openFile() {
            selectFile();
        }
    }));

    const selectFile = () => {
        fileRef?.current?.click();
    }
    const onChange = (list: any) => {
        const arr = Array.from(list);
        setSelectedFiles(arr);
        props?.onChange(arr, list);
        if (arr?.length) {
            fileRef.current.value = null;
        }
    }

    // const formatSize = (bytes: number) => {
    //     if (bytes === 0) {
    //         return '0 B';
    //     }
    //     var k = 1000, dm = 3, sizes = ['B', 'KB', 'MB', 'GB'],
    //         i = Math.floor(Math.log(bytes) / Math.log(k));
    //     return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    // }
    return (
        <div className="upload-button-comp">
            {
                selectedFiles?.length ?
                    <div className="d-flex flex-column f-13 text-success">
                        {
                            selectedFiles?.map((f: any, index: number) => <div key={index} className="d-flex justify-content-between align-items-center">{f?.name} <i title="Remove" className="fa fa-times text-danger pointer" onClick={e => { onChange([]); props?.onClose && props?.onClose(); }}></i></div>)
                        }
                    </div>
                    :
                    <button className="btn btn-link p-0 f-13" onClick={selectFile}>{props?.label || 'Choose File'}</button>
            }

            <input ref={fileRef} type="file" className="d-none" onChange={e => onChange(e.target.files)} />
        </div>
    );
});
