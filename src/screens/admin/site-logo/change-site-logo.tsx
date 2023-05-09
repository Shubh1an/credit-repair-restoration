import React, { createRef, useEffect, useRef, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import toastr from 'toastr';

import './change-site-logo.scss';
import { ButtonComponent } from '../../../shared/components/button';
import { FileUploadButton } from '../../../shared/components/file-upload-button';
import { Messages } from '../../../shared/constants';
import { ImageUtils } from '../../../utils/image.util';
import { IMAGETYPES } from '../../../models/enums';
import { uploadLogo, updateKey } from '../../../actions/media.actions';
import { IMediaPayload } from '../../../models/interfaces/shared';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        uploadLogo,
        updateKey
    }, dispatch);
}
export const ChangeSiteLogoComponent = connect(null, mapDispatchToProps)((props: { updateKey: any, officeId?: string, siteId?: string, uploadLogo?: any, onSuccess?: any, action?: string, type: IMAGETYPES }) => {

    const [uploading, setUploading] = useState(false);
    const [src, setSrc] = useState() as any;
    const [crop, setCrop] = useState({
        unit: 'px',
        x: 2, y: 2, // top, left of crop control
        width: 260, aspect: 11 / 3
    }) as any;
    const [axiosSource] = useState({} as CancelTokenSource);
    const [croppedImageUrl, setCroppedImageUrl] = useState('' as string);
    const [imageRef, setimageRef] = useState() as any;
    const [croppedImageBase64, setCroppedImageBase64] = useState('' as string);
    const btnRef = createRef() as any;

    useEffect(() => {
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);
    const onSubmit = () => {
        setUploading(true);
        const payload: IMediaPayload = { imageBase64: croppedImageBase64 || src, ...props };
        props?.uploadLogo(payload, axiosSource)
            .then((result: string) => {
                setUploading(false);
                toastr.success('Logo updated successfully!!');
                props?.onSuccess(true);
                props.updateKey();
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setUploading(false);
                    if (err?.response?.data) {
                        toastr.error(err?.response?.data);
                    }
                }
            })
    }
    const onSelect = () => {
        const item = btnRef?.current?.openFile();
    }
    const onFileSelected = (arr: any[]) => {
        if (arr?.length) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setSrc(reader.result);
            });
            reader.readAsDataURL(arr[0]);
        }
    }
    const onImageLoaded = (img: any) => {
        setimageRef(img);
    }
    const onCropComplete = (c: any) => {
        makeClientCrop(c);
    };

    const onCropChange = (c: any, percentCrop: any) => {
        setCrop(c);
    };
    const makeClientCrop = async (c: any) => {
        if (imageRef && c?.width && crop?.height) {
            ImageUtils.getCroppedImg(imageRef, c, 'newFile.jpeg').then(({ url, blob }) => {
                ImageUtils.getBase64FromBlob(blob).then((res: string) => {
                    setCroppedImageBase64(res);
                })
            });
        }
    }
    return (
        <>
            <div className='row mt-5 mb-5'>
                {
                    src && <div className='col-12 col-sm-6 border-right-grad-sm'>
                        <div className='crop-image-preview'>
                            {src && crop && (
                                <ReactCrop
                                    src={src}
                                    crop={crop}
                                    ruleOfThirds
                                    onImageLoaded={onImageLoaded}
                                    onComplete={onCropComplete}
                                    onChange={onCropChange}
                                />
                            )}
                        </div>
                    </div>
                }
                <div className={classNames('col-12 col-sm-6', { 'col-12 col-sm-12 text-center': !src })}>
                    <div className="d-none">
                        <FileUploadButton ref={btnRef} onChange={onFileSelected} label="Choose File" />
                    </div>
                    <div className="all-buttons d-flex flex-column align-items-center  h-100">
                        <ButtonComponent text="Select Image"
                            className="btn-secondary input-sm w-100 w-sm-auto mt-3 mt-sm-0" onClick={onSelect} >
                            <i className="fa fa-upload mr-2"></i>
                        </ButtonComponent>
                        {
                            src
                            && <ButtonComponent text="Save" loading={uploading}
                                className="btn-primary input-sm w-100 w-sm-auto mt-3 mt-sm-0" onClick={onSubmit} >
                                <i className="fa fa-floppy-o mr-2"></i>
                            </ButtonComponent>
                        }
                    </div>
                </div>
            </div>

        </>
    );
});
