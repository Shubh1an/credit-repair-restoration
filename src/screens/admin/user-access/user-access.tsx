import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { AccordionWithHeader, AccordionNode, AccordionHeader, AccordionPanel } from 'react-accordion-with-header';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import axios, { CancelTokenSource } from 'axios';
import toastr from 'toastr';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import './user-access.scss';
import { Alignment, EnumFieldRights, EnumRoles, EnumScreens } from '../../../models/enums';
import { withAuthorize } from '../../../shared/hoc/authorize';
import { DashboardWidget } from '../../dashboard/components/dashboard-widget';
import { RadioCheckboxList } from '../../../shared/components/radio-checkbox-list';
import { ICheckboxList, IFieldDescription, IFieldSettings, IScreenProps } from '../../../models/interfaces/shared';
import { saveAuthRules, getALLAuthRules, deleteField, deleteScreen, updateField, updateScreen } from '../../../shared/actions/shared.actions';
import { Messages } from '../../../shared/constants';
import { ModalComponent } from '../../../shared/components/modal';
import { AddScreen } from './add-screen';
import { AddField } from './add-field';
import { ButtonComponent } from '../../../shared/components/button';

const RoleKeys = Object.getOwnPropertyNames(EnumRoles)?.filter(x => x !== EnumRoles.Administrator);
const ScreenAccessTypes = Object.getOwnPropertyNames(EnumFieldRights)?.filter(x => x !== EnumFieldRights?.ReadOnly)
    ?.map(x => ({
        value: x,
        text: (EnumFieldRights as any)[x]
    } as ICheckboxList)) as ICheckboxList[];

const FieldsAccessTypes = Object.getOwnPropertyNames(EnumFieldRights)
    ?.map(x => ({
        value: x,
        text: (EnumFieldRights as any)[x]
    } as ICheckboxList)) as ICheckboxList[];

const UserAccess: React.FC = ((props: any) => {

    const [records, setRecords] = useState([] as IScreenProps[]);
    const [activeTab, setActiveTab] = useState('screen');
    const [loading, setLoading] = useState(false);
    const [screenId, setScreenId] = useState('' as string);
    const [isAddScreen, setIsAddScreen] = useState(false);
    const [isAddField, setIsAddField] = useState(false);
    const [isScreenSaving, setIsScreenSaving] = useState(false);
    const [fieldEditing, setFieldEditing] = useState(false);
    const [screenEditing, setscreenEditing] = useState(false);

    const [fieldEditingData, setFieldEditingData] = useState(null as IFieldDescription | null);
    const [screenEditingData, setScreenEditingData] = useState(null as any);
    const [currentScreen, setCurrentScreen] = useState('' as string);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        getUserAccess();
        return () => {
            if (axiosSource.cancel)
                axiosSource.cancel();
        }
    }, []);

    const onScreenFieldTabClick = (screendOrField: string) => {
        setActiveTab(screendOrField);
    }
    const actionCallback = (panels: any, state: any) => {
        if (state?.active?.length) {
            const index = state?.active[0];
            const sid = records[index].screen.name;
            setScreenId(sid);
        } else {
            setScreenId('');
        }
    }
    const onAddScreen = (screenName: string, description: string) => {
        const screen = records?.find(x => x.screen?.name === screenName);
        if (screen) {
            if (screenEditing) {
                screen.screen.description = description;
            } else {
                records.push({
                    screen: { name: screenName, description, rules: [] },
                    fields: []
                })
            }
        } else {
            records.push({
                screen: { name: screenName, description, rules: [] },
                fields: []
            })
        }
        saveUserAccess(records, true);
    }

    const onAddField = (screenName: EnumScreens, fieldName: string, description: string, fieldId: string) => {
        const screen = records?.find(x => x.screen?.name === screenName);
        if (screen) {
            if (fieldEditing) {
                const index = screen?.fields?.findIndex(x => x.id === fieldId);
                screen.fields.splice(index, 1, {
                    name: fieldName,
                    description,
                    rules: [...(screen.fields[index]?.rules || [])]
                });
            } else {
                screen?.fields?.push({
                    name: fieldName,
                    description,
                    rules: []
                });
            }
        }
        saveUserAccess(records, true);
    }

    const onAccessChangeFields = (data: { value: any, checked: boolean }, screen: string, field: string, role: string, fieldsOrScreen: string) => {
        const screenIndex = records?.findIndex(x => x?.screen?.name === screen);
        const fieldsIndex = records[screenIndex]?.fields?.findIndex(x => x.name === field);

        let rules = records[screenIndex]?.fields[fieldsIndex]?.rules?.filter((x: IFieldSettings) => x?.role !== (EnumRoles as any)[role]) as IFieldSettings[] || [];
        rules.push({ right: data?.value, role: (EnumRoles as any)[role] });


        const newRecords = JSON.parse(JSON.stringify(records));
        newRecords[screenIndex].fields[fieldsIndex].rules = rules;

        setRecords(newRecords);
        saveUserAccess(newRecords);
    }
    const onAccessChangeScreen = (data: { value: any, checked: boolean }, screen: string, role: string, fieldsOrScreen: string) => {
        const screenIndex = records?.findIndex(x => x?.screen?.name === screen);

        let rules = records[screenIndex]?.screen?.rules?.filter((x: IFieldSettings) => x?.role !== (EnumRoles as any)[role]) as IFieldSettings[] || [];
        rules.push({ right: data?.value, role: (EnumRoles as any)[role] });

        const newRecords = JSON.parse(JSON.stringify(records));

        newRecords[screenIndex].screen.rules = rules;

        setRecords(newRecords);
        saveUserAccess(newRecords);
    }
    const getSelectedAccess = (screen: string, field: string, role: string): EnumFieldRights => {
        const existsettings = records?.find(x => x?.screen?.name === screen)
            ?.fields?.find(x => x?.name === field)
            ?.rules?.find((x: IFieldSettings) => x?.role === (EnumRoles as any)[role])?.right;
        return existsettings || EnumFieldRights.Show;
    }
    const getSelectedAccessScreen = (screen: string, role: string): EnumFieldRights => {
        const existsettings = records?.find(x => x?.screen?.name === screen)?.screen?.rules?.find((x: IFieldSettings) => x?.role === (EnumRoles as any)[role])?.right;
        return existsettings || EnumFieldRights.Show;
    }
    const saveUserAccess = (settings: IScreenProps[], reload = false) => {
        if (!settings?.length) {
            toastr.warning('Data missing to be saved. please refresh screen and try again.');
            return;
        }
        setLoading(true);
        setIsScreenSaving(true);
        props?.saveAuthRules(settings, axiosSource)
            .then((result: boolean) => {
                setLoading(false);
                toastr.success('Settings Saved Successfully!');
                setIsScreenSaving(false);
                setFieldEditing(false);
                setFieldEditingData(null);
                if (reload) {
                    getUserAccess();
                    setIsAddScreen(false);
                    setIsAddField(false);
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    setIsScreenSaving(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    const getUserAccess = () => {
        setLoading(true);
        props?.getALLAuthRules(axiosSource)
            .then((results: any) => {
                setLoading(false);
                setRecords(results);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    const onScreenDeleteClick = async (e: any, name: string) => {
        e.stopPropagation();
        let result = await confirm({
            title: 'Remove Screen',
            message: "Are you sure you want to remove this Screen?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setLoading(true);
            props?.deleteScreen(name, axiosSource)
                .then((results: any) => {
                    setLoading(false);
                    getUserAccess();
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setLoading(false);
                        toastr.error(Messages.GenericError);
                    }
                })
        }
    }
    const onFieldDeleteClick = async (e: any, field: IFieldDescription) => {
        e.stopPropagation();
        let result = await confirm({
            title: 'Remove Field',
            message: "Are you sure you want to remove this Field?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setLoading(true);
            props?.deleteField(field?.id, axiosSource)
                .then((results: any) => {
                    setLoading(false);
                    getUserAccess();
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setLoading(false);
                        toastr.error(Messages.GenericError);
                    }
                })
        }
    }
    const onFieldUpdateClick = (e: any, field: IFieldDescription) => {
        e.stopPropagation();
        setFieldEditing(true);
        setFieldEditingData(field);
    }
    const onScreenUpdateClick = (e: any, screen: any) => {
        e.stopPropagation();
        setscreenEditing(true);
        setScreenEditingData(screen);
    }
    return (
        <div className="user-access">
            <section className="content-header row">
                <div className="col-10">
                    <div className="header-icon">
                        <i className="fa fa-envelope"></i>
                    </div>
                    <div className="header-title">
                        <h1>User Access</h1>
                        <small>Add, Edit and delete user roles</small>
                    </div>
                </div>
            </section>
            <section className="content access-container">

                <div className="row">
                    <div className="col-12 ">
                        <DashboardWidget className="all-screens-list" title={'User Access Management'} isLoading={loading}
                            allowFullscreen={true} allowMaximize={false} allowMinimize={false} reload={false}  >
                            <div style={{ minHeight: '70vh' }}>
                                <div className="row mb-3">
                                    <div className="col-12 d-flex justify-content-end">
                                        <ButtonComponent text="Add New Screen" onClick={() => setIsAddScreen(true)} className="btn btn-sm btn-primary" >
                                            <i className="fa fa-plus mr-2"></i>
                                        </ButtonComponent>
                                    </div>
                                </div>
                                {
                                    !!records?.length &&
                                    <AccordionWithHeader actionCallback={actionCallback} className="my-acc-demo accordion-with-header-root">
                                        {records?.map((record: IScreenProps, i) => {
                                            return (
                                                <AccordionNode key={i} className="my-acc-node accordion-node">
                                                    <AccordionHeader horizontalAlignment="centerSpaceBetween"
                                                        verticalAlignment="center" className="my-acc-header accordion-header">
                                                        <div className="toggle-container">
                                                            <i className={"text-secondary fa fa-chevron-" + (record?.screen?.name !== screenId ? 'right' : 'down')}></i>
                                                        </div>
                                                        <div className="title-container d-flex align-items-center justify-content-between" >
                                                            <div className='d-flex align-items-center'>
                                                                <h5 className="text-secondary">
                                                                    {record?.screen?.description}
                                                                </h5>
                                                                <span className="ml-2 text-secondary f-10 font-weight-bold mt-2">| SCREEN</span>
                                                            </div>
                                                            <div>
                                                                <i className='fa fa-pencil text-success f-17 pointer mr-2' onClick={e => { setCurrentScreen(record?.screen?.name); onScreenUpdateClick(e, record?.screen); }}></i>
                                                                <i className='fa fa-trash text-danger f-17' onClick={e => onScreenDeleteClick(e, record?.screen?.name)}></i>
                                                            </div>
                                                        </div>
                                                    </AccordionHeader>
                                                    <AccordionPanel className="accordion-panel">
                                                        <div className="my-acc-body">
                                                            <div className="row">
                                                                <div className="col-12 col-sm-2">
                                                                    <div className="acc-left-body">
                                                                        <button className={classNames("btn btn-sm btn-light", { 'active': activeTab === 'screen' })} onClick={() => onScreenFieldTabClick('screen')}>
                                                                            Screen
                                                                        </button>
                                                                        {
                                                                            !!record?.fields?.length &&
                                                                            <button className={classNames("btn btn-sm btn-light", { 'active': activeTab === 'fields' })} onClick={() => onScreenFieldTabClick('fields')}>
                                                                                Fields
                                                                                {
                                                                                    <span className='f-12'>({record?.fields?.length})</span>
                                                                                }
                                                                            </button>
                                                                        }
                                                                    </div>
                                                                    <div className="row mt-3">
                                                                        <div className="col-12 d-flex justify-content-center">
                                                                            <ButtonComponent text="Add New Field" onClick={() => { setCurrentScreen(record?.screen?.name); setIsAddField(true); }} className="btn btn-sm btn-link text-success f-10" >
                                                                                <i className="fa fa-plus mr-1"></i>
                                                                            </ButtonComponent>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-sm-10">
                                                                    <div className="acc-right-body">
                                                                        {
                                                                            activeTab === 'fields' ?
                                                                                <div className="table-responsive list-scrollable custom-scrollbar accounts-list-table">
                                                                                    <table className="dataTableCustomers table table-striped table-hover" cellSpacing={0} cellPadding={0}>
                                                                                        <thead className="back_table_color">
                                                                                            <tr>
                                                                                                <th style={{ width: '30%' }}>Field Name</th>
                                                                                                <th>Role</th>
                                                                                                <th style={{ width: 'auto' }}>Access Type</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {
                                                                                                record?.fields
                                                                                                    ?.map((field: IFieldDescription, j: number) => {
                                                                                                        return (
                                                                                                            <tr key={j}>
                                                                                                                <td className="align-top">
                                                                                                                    <label className="text-shadow-green">{field?.name}</label>
                                                                                                                    <div>{field?.description}</div>
                                                                                                                    <div className='mt-3'>
                                                                                                                        <i className='fa fa-pencil text-success f-14 pointer mr-2' onClick={e => { setCurrentScreen(record?.screen?.name); onFieldUpdateClick(e, field); }}></i>
                                                                                                                        <i className='fa fa-trash text-danger f-14 pointer' onClick={e => onFieldDeleteClick(e, field)}></i>
                                                                                                                    </div>
                                                                                                                </td>
                                                                                                                <td colSpan={2}>
                                                                                                                    {
                                                                                                                        RoleKeys?.map((role: string, k: number) => {
                                                                                                                            return (
                                                                                                                                <div className="row m-0" key={role}>
                                                                                                                                    <div className='col-12 col-sm-4 pl-0  d-flex flex-column justify-content-center'>
                                                                                                                                        <label className="">
                                                                                                                                            {
                                                                                                                                                k + 1
                                                                                                                                            })&nbsp;
                                                                                                                                            {
                                                                                                                                                (EnumRoles as any)[role]
                                                                                                                                            }
                                                                                                                                        </label>
                                                                                                                                    </div>
                                                                                                                                    <div className='col-12 col-sm-8 pl-0'>
                                                                                                                                        <RadioCheckboxList
                                                                                                                                            list={FieldsAccessTypes}
                                                                                                                                            selectedValue={getSelectedAccess(record?.screen?.name, field?.name, role)}
                                                                                                                                            groupName={record?.screen?.name + '_' + field?.name + '_' + role}
                                                                                                                                            alignment={Alignment.Horizontal}
                                                                                                                                            onChange={(data: { value: any, checked: boolean }) => onAccessChangeFields(data, record?.screen?.name, field?.name, role, 'fields')} />
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            );
                                                                                                                        })
                                                                                                                    }

                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        );
                                                                                                    })
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                                :
                                                                                <div className="table-responsive list-scrollable custom-scrollbar accounts-list-table">
                                                                                    <table className="dataTableCustomers table table-striped table-hover" cellSpacing={0} cellPadding={0}>
                                                                                        <thead className="back_table_color">
                                                                                            <tr>
                                                                                                <th style={{ width: '30%' }}>Screen</th>
                                                                                                <th>Role</th>
                                                                                                <th style={{ width: 'auto' }}>Access Type</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td className="align-top">
                                                                                                    <label className="text-shadow-green">{record?.screen?.name}</label>
                                                                                                    <div>{record?.screen?.description}</div>
                                                                                                </td>
                                                                                                <td colSpan={2}>
                                                                                                    {
                                                                                                        RoleKeys?.map((role: string, k: number) => {
                                                                                                            return (
                                                                                                                <div className="row m-0" key={role}>
                                                                                                                    <div className='col-12 col-sm-4 pl-0  d-flex flex-column justify-content-center'>
                                                                                                                        <label className="">
                                                                                                                            {
                                                                                                                                k + 1
                                                                                                                            })&nbsp;
                                                                                                                            {
                                                                                                                                (EnumRoles as any)[role]
                                                                                                                            }
                                                                                                                        </label>
                                                                                                                    </div>
                                                                                                                    <div className='col-12 col-sm-8 pl-0'>
                                                                                                                        <RadioCheckboxList
                                                                                                                            list={ScreenAccessTypes}
                                                                                                                            selectedValue={getSelectedAccessScreen(record?.screen?.name, role)}
                                                                                                                            groupName={record?.screen?.name + '_' + role}
                                                                                                                            alignment={Alignment.Horizontal}
                                                                                                                            onChange={(data: { value: any, checked: boolean }) => onAccessChangeScreen(data, record?.screen?.name, role, 'screen')} />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            );
                                                                                                        })
                                                                                                    }

                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AccordionPanel>
                                                </AccordionNode>
                                            );
                                        })
                                        }
                                    </AccordionWithHeader>
                                }
                            </div>
                        </DashboardWidget>
                    </div>
                </div>
            </section>
            <ModalComponent title={screenEditing ? "Update Screen" : "Add Screen"} isVisible={isAddScreen || screenEditing} onClose={() => { setIsAddScreen(false); setscreenEditing(false); }}>
                {(screenEditing || isAddScreen) && <AddScreen loading={isScreenSaving} isEditing={screenEditing} screen={screenEditingData} onSave={onAddScreen} />}
            </ModalComponent>
            <ModalComponent title={fieldEditing ? "Update Field" : "Add Field"} isVisible={isAddField || fieldEditing} onClose={() => { setIsAddField(false); setFieldEditing(false) }}>
                {(isAddField || fieldEditing) && <AddField loading={isScreenSaving} isEditing={fieldEditing} editingData={fieldEditingData} screen={currentScreen} onSave={onAddField} />}
            </ModalComponent>
        </div>
    );
})

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        saveAuthRules,
        getALLAuthRules,
        deleteScreen,
        updateScreen,
        deleteField,
        updateField
    }, dispatch);
}
export default connect(null, mapDispatchToProps)(withAuthorize(UserAccess, EnumScreens.UserAccess));