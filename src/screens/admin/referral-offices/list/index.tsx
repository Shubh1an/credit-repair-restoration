import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, Route, Switch, useParams } from 'react-router-dom';
import { validate as uuidValidate } from 'uuid';
import { Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import axios from 'axios';

import './list.scss';
import { asyncComponent } from '../../../../shared/components/async-component';
import { PrivateRoute } from '../../../../core/components/private-route';
import { EnumRoles, EnumScreens } from '../../../../models/enums';
import { ClientRoutesConstants, Messages } from '../../../../shared/constants';
import AuthService from '../../../../core/services/auth.service';
import { DashboardWidget } from '../../../dashboard/components/dashboard-widget';
import { IReferralOffice } from '../../../../models/interfaces/franchise';
import { withAuthorize } from '../../../../shared/hoc/authorize';
import { getReferralOffices } from '../../../../actions/referral.actions';
import { ButtonComponent } from '../../../../shared/components/button';
import { ModalComponent } from '../../../../shared/components/modal';
import { ReAssignOfficesComponent } from './re-assign.offices'

const AsyncEditComponent = asyncComponent(() => import('../edit'));
const AsyncAddComponent = asyncComponent(() => import('../add'));

interface IOfficeList {
	match: { path: string, params?: { foid?: string } },
	auth: any, getReferralOffices: any
	history: any,
	currentAccessibleScreens: string[]
}
const ReferralOfficesComponent: React.FC<IOfficeList> = (props: IOfficeList) => {

	const [referralOffices, setReferralOffices] = useState([] as IReferralOffice[]);
	const [isLoading, setIsLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [activeId, setActiveId] = useState('' as string | unknown);
	const [axiosSource] = useState(axios.CancelToken.source());

	const setSelectedOffice = () => {
		const index = window.location.href.lastIndexOf('/');
		const foid = window.location.href.slice(index + 1);
		if (foid && uuidValidate(foid)) {
			setActiveId(foid);
		}
	}

	useEffect(() => {
		loadOffices();
		const payload = AuthService.getCurrentJWTPayload();
		if (payload.roles === EnumRoles.Administrator) {
			setSelectedOffice();
		}
		return () => {
			axiosSource?.cancel(Messages.APIAborted);
		};
	}, []);
	const loadOffices = () => {
		setIsLoading(true);
		props.getReferralOffices(axiosSource)
			.then((data: IReferralOffice[]) => {
				setReferralOffices(data);
				setIsLoading(false);
			}).catch((err: any) => {
				if (!axios.isCancel(err)) {
					setReferralOffices([]);
					setIsLoading(false);
				}
			})
	}
	const getLink = (content: any, foid?: string) => {
		return (<Link to={ClientRoutesConstants.referralOffices + '/' + foid} onClick={() => setActiveId(foid)} >
			{content}
		</Link >);
	}
	const goToDetailsPage = (foid?: string) => {
		setActiveId(foid);
		props.history.push(ClientRoutesConstants.referralOffices + '/' + foid);
	}
	const onListReload = () => {
		loadOffices();
	}
	const refreshList = () => {
		loadOffices();
		setSelectedOffice();
	}
	const onReAssignOffice = () => {
		setIsModalVisible(true);
	}
	const onReAssignSave = () => {
		refreshList();
		setIsModalVisible(false);
	}
	return (
		<div className='customers-list'>
			<section className='content-header'>
				<div className='header-icon'>
					<i className='fa fa-university'></i>
				</div>
				<div className='header-title'>
					<h1>Affiliate Offices</h1>
					<small>Add, Edit and delete Affiliate Offices</small>
				</div>
			</section>
			<section className='content'>
				<div className='row'>
					<div className='col-12 pinpin customer-grid'>
						<DashboardWidget title={
							<>
								Affiliate Offices
								{!isLoading && <span className='records pull-right mr-3'> Showing {referralOffices?.length} Records</span>}
							</>
						}
							reloadHandler={onListReload} isLoading={isLoading} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true} >
							<div className='d-flex justify-content-end mt-3 mb-2 pr-2'>
								{
									<ButtonComponent text="Re-Assign Offices" className="btn-success" onClick={onReAssignOffice} >
										<i className="fa fa-exchange mr-2"></i>
									</ButtonComponent>
								}
							</div>
							<div style={{ minHeight: '400px' }} className='table-responsive list-scrollable custom-scrollbar'>

								<table className='dataTableCustomers table table-striped table-hover'>
									<thead className='back_table_color'>
										<tr className={'secondary'}>
											<th></th>
											<th style={{ width: '20%' }}>Type</th>
											<th style={{ width: '20%' }}>Office Name</th>
											<th style={{ width: '20%' }}>Telephone</th>
											<th style={{ width: '20%' }}>Credit Agent</th>
											<th style={{ width: '10%', textAlign: 'center' }}>#Agents</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{
											referralOffices?.map((cust: IReferralOffice, index: number) => {
												return (
													<tr key={cust.id} className={classnames({ 'active': activeId === cust?.id })}>
														<td></td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.classification}</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.name}</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.telephone}</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.agentName}</td>
														<td style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.numberOfAgents}</td>
														<td className='text-center'>
															{
																getLink(<Button color='secondary btn-sm'>View</Button>, cust?.id)
															}
														</td>
													</tr>
												);
											})
										}
										{
											!referralOffices?.length && !isLoading
											&& <tr>
												<td colSpan={7}>
													<div className="no-records text-danger justify-content-center">
														<h2> No Records Found!! </h2>
														<div className="mt-2">
															<Link to={ClientRoutesConstants.addReferralOffice}>
																<ButtonComponent className="btn btn-primary" text="Create New Affiliate Office" >
																	<i className="fa fa-plus mr-2"></i>
																</ButtonComponent>
															</Link>
														</div>
													</div>
												</td>
											</tr>
										}
										{
											isLoading &&
											<tr>
												<td colSpan={7} >
													<div style={{ minHeight: '400px' }}></div>
												</td>
											</tr>
										}
									</tbody>
								</table>
							</div>
						</DashboardWidget>
					</div>
				</div>
			</section>
			<section className='content edit-customer-section' id='myScrollToElement'>
				<Switch>
					<PrivateRoute path={ClientRoutesConstants.addReferralOffice} exact onReloadOfficesList={refreshList} component={AsyncAddComponent} />
					<Route path={ClientRoutesConstants.viewReferralOffices} children={<OfficeListSubRoute onReloadOfficesList={refreshList} />} />
				</Switch>
			</section>
			<ModalComponent isSmall={true} title={'Reassign all referral offices to new franchise agent:'}
				isVisible={isModalVisible} onClose={() => { setIsModalVisible(false); }}>
				{
					isModalVisible && <ReAssignOfficesComponent onClose={() => setIsModalVisible(false)} onSave={onReAssignSave} />
				}
			</ModalComponent>
		</div>
	);
}


const mapStateToProps = (state: any) => {
	return {
		currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens
	};
}

const mapDispatchToProps = (dispatch: any) => {
	return bindActionCreators({
		getReferralOffices,
	}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(withAuthorize(ReferralOfficesComponent, EnumScreens.ViewReferralOffices));

const OfficeListSubRoute = connect(mapStateToProps, mapDispatchToProps)((props: any) => {
	const { id }: any = useParams();
	return (
		uuidValidate(id) ? <AsyncEditComponent {...props} id={id} /> : <Redirect to={ClientRoutesConstants.notFound} />
	);
});
