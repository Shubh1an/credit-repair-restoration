import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios, { CancelTokenSource } from 'axios';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import { Spinner } from 'reactstrap';

import { DashboardWidget } from '../../../../dashboard/components/dashboard-widget';
import { getCustomerFranchAgents, getCustomerReferrAgents, updateCustomerAgent } from '../../../../../actions/customers.actions';
import { updateLeadAgent } from '../../../../../actions/leads.actions';
import AuthService from '../../../../../core/services/auth.service';
import { Messages } from '../../../../../shared/constants';
import { ButtonComponent } from '../../../../../shared/components/button';
import { EnumScreens } from '../../../../../models/enums';
import { IFranchiseAgent, IFranchiseOfficeGroup } from '../../../../../models/interfaces/franchise';

const mapStateToProps = (state: any) => {
    return {
        model: state.customerViewModel,
        AuthRules: AuthService.getScreenOject(state.sharedModel.AuthRules, EnumScreens.CustomerDetails)
    };
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        updateCustomerAgent,
        updateLeadAgent
    }, dispatch);
}
export const CustomerContactDetailsComponent = connect(mapStateToProps, mapDispatchToProps)(
    (props: any) => {

        const [franch, setFranch] = useState('');
        const [selectedFranch, setSelectedFranch] = useState(null as any);
        const [referral, setReferral] = useState('');
        const [selectedReferral, setSelectedReferral] = useState(null as any);
        const [franches, setFranches] = useState([] as IFranchiseOfficeGroup[]);
        const [referrals, setReferrals] = useState([] as any[]);
        const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
        const [isUpdating, setIsUpdating] = useState(false);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            return () => {
                if (axiosSource?.cancel)
                    axiosSource?.cancel(Messages.APIAborted);
            }
        }, []);

        useEffect(() => {
            if (props?.fAgentId && props?.isPublic) {
                fetchData(props?.fAgentId);
            }
        }, [props?.fAgentId]);

        useEffect(() => {
            if (props?.addMode) {
                const { rid, logedInUserFAgent } = AuthService.getCurrentJWTPayload();
                setReferral(rid || '');
                onReferralSelect(rid, referrals);
                // setFranch(logedInUserFAgent || '')
            }
        }, [props?.addMode]);


        useEffect(() => {
            onFranchSelect(franch, franches?.flatMap(x => x?.agents));
        }, [franch])
        const onFranchSelect = (f: string, list: any[]) => {
            const obj = list?.find(x => x.id === f);
            setSelectedFranch(obj);
            if (props?.onFranchiseSelect) {
                props?.onFranchiseSelect(obj);
            }
        }
        useEffect(() => {
            onReferralSelect(referral, referrals);
        }, [referral])
        const onReferralSelect = (r: any, list: any[]) => {
            const obj = list?.find(x => x.id === r);
            setSelectedReferral(obj);
            if (props?.onReferralSelect) {
                props?.onReferralSelect(obj);
            }
        }
        useEffect(() => {
            fetchData();
            const { logedInUserFAgent } = AuthService.getCurrentJWTPayload();
            let fId = props?.customer?.agent?.id || props?.customer?.franchiseAgent?.id || logedInUserFAgent || '';
            if (!props.addMode) {
                fId = props?.customer?.agent?.office?.defaultAgentId || fId;
                setFranch(fId);
                const referralId = (props?.customer?.referrer || props?.customer?.referralAgent)?.id;
                setReferral(referralId || '');
            }
        }, [props?.customer]);

        const fetchData = (fAgentId: string = '') => {
            setLoading(true);
            axios.all([getCustomerFranchAgents(axiosSource), getCustomerReferrAgents(axiosSource)])
                .then((results: any[]) => {
                    setLoading(false);
                    const grouped1 = groupFranchiseAgentsWithOffice(results[0]);
                    setFranches(grouped1);
                    if (props?.onFranchiseLoad) {
                        props.onFranchiseLoad(results[0]);
                    }
                    setReferrals(results[1]);
                    // if logged in agent is referral agent
                    const { rid } = AuthService.getCurrentJWTPayload();
                    if (rid && props.addMode) {
                        onReferralSelect(rid, results[1]);
                    } else {
                        onReferralSelect(((props?.customer?.referrer || props?.customer?.referralAgent)?.id), results[1]);
                    }
                    const payload = AuthService.getCurrentJWTPayload();

                    if (results[0]) {
                        let franchData;
                        const defaultAgentIdOfOffice = props?.customer?.agent?.office?.defaultAgentId;
                        if (props?.isPublic && (defaultAgentIdOfOffice || fAgentId)) {
                            franchData = results[0]?.find((x: any) => x?.id === (defaultAgentIdOfOffice || fAgentId));
                        } else {
                            franchData = results[0]?.find((x: any) => x?.membershipId === payload?.membershipId);
                        }
                        let val = props?.customer?.agent?.id || props?.customer?.franchiseAgent?.id || franchData?.id || '';
                        if (props?.addMode) {
                            const defaultAgent = { id: results[0][0]?.office?.defaultAgentId, fullName: results[0][0]?.office?.defaultAgentName };
                            if (defaultAgent?.fullName) {
                                const list = results[0]?.filter((x: any) => x.id !== defaultAgent?.id);
                                list?.push(defaultAgent);
                                const grouped = groupFranchiseAgentsWithOffice(list);
                                setFranches(grouped);
                            }
                            val = (defaultAgent?.fullName ? defaultAgent?.id : '') || val || payload?.logedInUserFAgent || '';
                        }
                        if (!props?.addMode) {
                            onFranchSelect(val, results[0]);
                            setFranch(val);
                        }
                    }
                })
                .catch((err: any) => {
                    setLoading(false);
                })
        }
        const groupFranchiseAgentsWithOffice = (list: IFranchiseAgent[]) => {
            const group = {} as any;
            list?.forEach((item: IFranchiseAgent) => {
                const offcName = item.office?.name || '';
                if (offcName) {
                    if (group[offcName]?.length) {
                        group[offcName] = [...group[offcName], item];
                    } else {
                        group[offcName] = [item];
                    }
                }
            });
            const newGroup = Object.getOwnPropertyNames(group)?.map((name: string) => ({ name, agents: group[name] } as IFranchiseOfficeGroup));
            return newGroup;
        }
        const onAddUpdate = () => {
            setIsUpdating(true);
            const promise = props?.isLead ? props?.updateLeadAgent(props?.customer?.id, franch, referral, axiosSource)
                : props?.updateCustomerAgent(props?.cid, franch, referral, axiosSource);
            promise.then((result: any) => {
                setIsUpdating(false);
                if (result) {
                    if (props.onReloadData) {
                        props.onReloadData();
                    }
                    toastr.success('Agents association saved successfully!');
                } else {
                    toastr.error(Messages.GenericError);
                }
            })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                })
        }
        return (
            <div>
                <DashboardWidget title={"Contacts"} allowFullscreen={!props?.addMode} allowMaximize={!props?.addMode} allowMinimize={!props?.addMode} reload={false} >
                    <div className="row mb-3">
                        {
                            <>
                                <div className={props?.hideROffice ? "col-12 col-sm-6" : "col-12 col-sm-3 "}>
                                    <div className="row">
                                        <div className="col-12 col-sm-10 pr-sm-0">
                                            <div className="form-group">
                                                <label className="text-orange-red">Credit(Franchise) Agent*</label>
                                                <select disabled={!franches?.length || loading} value={franch || ''} onChange={e => setFranch(e.target.value)} className="form-control input-sm" required={true}>
                                                    <option value={''}>- Select -</option>
                                                    {
                                                        franches?.map((ofc: any) => (<optgroup key={ofc?.name} label={ofc?.name}>
                                                            {
                                                                ofc?.agents?.map((f: IFranchiseAgent, index: number) => {
                                                                    return <option key={index} value={f.id}>{f.fullName}</option>;
                                                                })
                                                            }
                                                        </optgroup>))
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-2 pl-1 pt-4  d-none d-sm-block ">
                                            {loading && <Spinner size="sm" color="secondary" />}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group mb-0">
                                                <label>Office:</label>
                                                <div className="f-13">
                                                    <i className="fa fa-phone mr-2"></i>
                                                    {
                                                        selectedFranch?.telephone || "-"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group mb-0">
                                                <label>Cell:</label>
                                                <div className="f-13">
                                                    <i className="fa fa-mobile-phone mr-2 f-15"></i>
                                                    {
                                                        selectedFranch?.cellPhone || "-"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group mb-0">
                                                <label>Email:</label>
                                                <div className="f-13">
                                                    <i className="fa fa-envelope-o mr-2 f-10"></i>
                                                    {
                                                        selectedFranch?.email || "-"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        {
                            !props?.hideROffice &&
                            <>
                                <div className="col-2 border-right-grad d-none d-sm-block"></div>
                                <div className="col-2 d-none d-sm-block "></div>
                                <div className='col-12 col-sm-3'>
                                    <div className="row">
                                        <div className="col-12  col-sm-10 pr-sm-0">
                                            <div className="form-group">
                                                <label>Referring Agent:</label>
                                                <select disabled={!referrals?.length || loading} value={referral || ''} onChange={e => setReferral(e.target.value)} className="form-control input-sm" required={true}>
                                                    <option value={''}>- Select -</option>
                                                    {
                                                        referrals?.map((f: any, index: number) => (<option key={index} value={f.id}>{f.fullName}</option>))
                                                    }
                                                </select>

                                            </div>
                                        </div>
                                        <div className="col-2 pl-1 pt-4  d-none d-sm-block ">
                                            {loading && <Spinner size="sm" color="secondary" />}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group mb-0">
                                                <label>Office:</label>
                                                <div className="f-13">
                                                    <i className="fa fa-phone mr-2"></i>
                                                    {
                                                        selectedReferral?.telephone || "-"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group mb-0">
                                                <label>Cell:</label>
                                                <div className="f-13">
                                                    <i className="fa fa-mobile-phone mr-2 f-15"></i>
                                                    {
                                                        selectedReferral?.cellPhone || "-"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group mb-0">
                                                <label>Email:</label>
                                                <div className="f-13">
                                                    <i className="fa fa-envelope-o mr-2 f-10"></i>
                                                    {
                                                        selectedReferral?.email || "-"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    {
                        !props?.addMode && !AuthService.isFieldHidden(props.AuthRules, 'UpdateContactDetails') &&
                        <div className="row">
                            <div className="col-12 text-right">
                                <ButtonComponent text="Save Details" disabled={isUpdating || loading || !franch || AuthService.isFieldReadOnly(props.AuthRules, 'UpdateContactDetails')} className="btn-primary w-100 w-sm-auto" loading={isUpdating} onClick={onAddUpdate} >
                                    <i className="fa fa-floppy-o mr-2"></i>
                                </ButtonComponent>
                            </div>
                        </div>
                    }
                </DashboardWidget>
            </div>
        );
    });