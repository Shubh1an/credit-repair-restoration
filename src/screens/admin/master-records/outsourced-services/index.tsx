import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Spinner } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import toastr from 'toastr';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { CollectionEntryTypes } from '../../../../models/enums';
import { ButtonComponent } from '../../../../shared/components/button';
import { Messages } from '../../../../shared/constants';
import { IDataItem } from '../../../../models/interfaces/fast-edit-accounts';
import { masterGetFranchiseServices, masterCreateService, masterUpdateService, masterGetFranchiseServiceLevels, masterCreateServiceLevel, masterUpdateServiceLevel, masterCreateServiceOptions, masterGetFranchiseServiceOptions, masterUpdateServiceOptions } from '../../../../actions/franchise-services.actions';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        masterGetFranchiseServices,
        masterCreateService,
        masterUpdateService,
        masterGetFranchiseServiceLevels,
        masterCreateServiceLevel,
        masterUpdateServiceLevel,
        masterGetFranchiseServiceOptions,
        masterCreateServiceOptions,
        masterUpdateServiceOptions
    }, dispatch);
}

export const CreateServiceItemComponent = connect(null, mapDispatchToProps)((
    props: {
        type: CollectionEntryTypes | null,
        onSuccess: any,
        masterGetFranchiseServices: any,
        masterCreateService: any,
        masterUpdateService: any,
        masterGetFranchiseServiceLevels: any,
        masterCreateServiceLevel: any,
        masterUpdateServiceLevel: any,
        masterGetFranchiseServiceOptions: any,
        masterCreateServiceOptions: any,
        masterUpdateServiceOptions: any
    }) => {

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [desc, setDesc] = useState('' as string);
    const [name, setName] = useState('' as string);
    const [cost, setCost] = useState('' as string);
    const [letterCount, setLetterCount] = useState('' as string);
    const [deletingId, setDeletingId] = useState('' as string);
    const [deleting, setDeleting] = useState(false);
    const [records, setRecords] = useState([] as IDataItem[]);
    const [axiosSource] = useState(axios.CancelToken.source());


    useEffect(() => {
        getRecords();
        return () => {
            axiosSource.cancel(Messages.APIAborted);
        }
    }, [])

    const getRecords = () => {
        setLoading(true);
        const promise$ = props?.type === CollectionEntryTypes.Service ? props?.masterGetFranchiseServices
            : props?.type === CollectionEntryTypes.ServiceLevel ? props?.masterGetFranchiseServiceLevels : props?.masterGetFranchiseServiceOptions;
        promise$?.(props?.type, axiosSource)
            .then((r: IDataItem[]) => {
                setLoading(false);
                setRecords(r);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    const onAddClick = () => {
        setSaving(true);
        const promise$ = props?.type === CollectionEntryTypes.Service ? props?.masterCreateService :
            props?.type === CollectionEntryTypes.ServiceLevel ? props?.masterCreateServiceLevel : props?.masterCreateServiceOptions;
        promise$({ name, description: desc, cost, letterCount }, axiosSource)
            .then((id: string) => {
                setSaving(false);
                getRecords();
                setName('');
                setDesc('');
                setCost('');
                setLetterCount('');
                props?.onSuccess();
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setSaving(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    const onDelete = async (id: string) => {
        let result = await confirm({
            title: 'Remove Entry',
            message: "Are you sure you want to remove this Entry?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setDeleting(true);
            setDeletingId(id || '');
            const promise$ = props?.type === CollectionEntryTypes.Service ? props?.masterUpdateService({ serviceId: id, isDeleted: true }, axiosSource) : props?.type === CollectionEntryTypes.ServiceLevel ? props?.masterUpdateServiceLevel({ serviceLevelId: id, isDeleted: true }, axiosSource) : props?.masterUpdateServiceOptions({ serviceAddOnId: id, isDeleted: true }, axiosSource);
            promise$.then((result: string) => {
                setDeleting(false);
                toastr.success(result);
                getRecords();
                setDeletingId('');
            })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setDeleting(false);
                        toastr.error(Messages.GenericError);
                    }
                })
        }
    }
    const getTitle = () => {
        switch (props?.type) {
            case CollectionEntryTypes.Service:
                return 'Services';
                break;

            case CollectionEntryTypes.ServiceLevel:
                return 'Services Levels';
                break;

            case CollectionEntryTypes.ServiceOption:
                return 'Service Ad-Ons';
                break;
            default:
                break;
        }

    }
    const isValid = () => {
        if (props?.type === CollectionEntryTypes.ServiceOption) {
            return !cost?.trim().length && !name?.trim().length;
        } else if (props?.type === CollectionEntryTypes.ServiceLevel) {
            return !cost?.trim().length && !letterCount?.trim().length && !name?.trim().length;
        } else
            return !name?.trim().length;
    }
    return <div className='collection-type'>
        <div className='row'>
            <div className='col-12 col-sm-2'></div>
            <div className='col-12 col-sm-10 pb-2'>
                <h5>{getTitle()}</h5>
            </div>
        </div>
        <div className='row'>
            <div className='col-12 col-sm-2'></div>
            <div className='col-12 col-sm-7 form-group'>
                <label className='text-orange-red'>Name*</label>
                <input type='text' className='form-control form-input' autoFocus={true} value={name} onChange={(ev: any) => setName(ev.target.value)} />
            </div>
            <div className='col-12 col-sm-3'></div>
            <div className='col-12 col-sm-2'></div>
            <div className='col-12 col-sm-7 form-group'>
                <label>Description</label>
                <textarea onChange={(ev: any) => setDesc(ev.target.value)} value={desc || ""} name="notes" className="form-control" placeholder="Enter Description" required={true} ></textarea>
            </div>
            <div className='col-12 col-sm-3'></div>
            {
                (props?.type === CollectionEntryTypes.ServiceOption || props?.type === CollectionEntryTypes.ServiceLevel) && <>
                    <div className='col-12 col-sm-2'></div>
                    <div className='col-12 col-sm-7 form-group'>
                        <label className='text-orange-red'>Cost($)*</label>
                        <input type='number' className='form-control form-input' autoFocus={false} value={cost} onChange={(ev: any) => setCost(ev.target.value)} />
                    </div>
                    <div className='col-12 col-sm-3'></div>
                </>
            }
            {
                (props?.type === CollectionEntryTypes.ServiceLevel) && <>
                    <div className='col-12 col-sm-2'></div>
                    <div className='col-12 col-sm-7 form-group'>
                        <label className='text-orange-red'>Letters*</label>
                        <input type='number' className='form-control form-input' autoFocus={false} value={letterCount} onChange={(ev: any) => setLetterCount(ev.target.value)} />
                    </div>
                    <div className='col-12 col-sm-3'></div>
                </>
            }
            <div className='col-12 col-sm-7'></div>
            <div className='col-12 col-sm-2 text-right mt-1'>
                <ButtonComponent text="Save" loading={saving} disabled={isValid()} className="btn btn-primary w-100" onClick={onAddClick} >
                    <i className="fa fa-floppy-o mr-2"></i>
                </ButtonComponent>
            </div>
            <div className='col-12 col-sm-2'></div>
        </div>
        <div className='row mt-4'>
            <div className='col-12'>
                <div style={{ maxHeight: '400px' }} className='table-responsive list-scrollable custom-scrollbar'>
                    <table className='dataTableCustomers table table-striped table-hover'>
                        <thead className='back_table_color'>
                            <tr className={'secondary'}>
                                <th style={{ width: '20%' }}>Name</th>
                                <th style={{ width: '30%' }}>Description</th>
                                {(props?.type === CollectionEntryTypes.ServiceLevel) && <th style={{ width: '20%' }}>Letters</th>}
                                {(props?.type === CollectionEntryTypes.ServiceOption || props?.type === CollectionEntryTypes.ServiceLevel) && <th style={{ width: '20%' }}>Cost</th>}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                !loading ?
                                    records?.length ?
                                        records?.map((item: any) => {
                                            return (
                                                <tr key={item?.id}>
                                                    <td>
                                                        {item?.name}
                                                    </td>
                                                    <td>
                                                        {item?.description}
                                                    </td>
                                                    {(props?.type === CollectionEntryTypes.ServiceLevel) && <td>{item?.letterCount}</td>}
                                                    {(props?.type === CollectionEntryTypes.ServiceOption || props?.type === CollectionEntryTypes.ServiceLevel) && <td>${item?.cost}</td>}
                                                    <td className='text-center'>
                                                        {
                                                            deleting && (item.serviceId || item.serviceLevelId || item.serviceAddOnId) === deletingId ?
                                                                <Spinner size={'sm'} className='sm' />
                                                                :
                                                                <Button color='danger btn-sm' onClick={() => { onDelete(item.serviceId || item.serviceLevelId || item.serviceAddOnId || '') }}>
                                                                    <i className='fa fa-trash'></i>
                                                                </Button>
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        })
                                        : <tr >
                                            <td colSpan={props?.type === CollectionEntryTypes.ServiceOption ? 4 : props?.type === CollectionEntryTypes.ServiceLevel ? 5 : 3} className='text-danger text-center' style={{ maxHeight: '200px' }}>
                                                <i>No records available!</i>
                                            </td>
                                        </tr>
                                    :
                                    <tr >
                                        <td colSpan={props?.type === CollectionEntryTypes.ServiceOption ? 4 : props?.type === CollectionEntryTypes.ServiceLevel ? 5 : 3} className='position-relative text-center' style={{ maxHeight: '200px' }}>
                                            <Spinner size={'sm'} className='sm' />
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>;
});
