import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, Route, Switch, useLocation, useParams } from 'react-router-dom';
import { validate as uuidValidate } from 'uuid';
import { Button, Spinner } from 'reactstrap';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import axios from 'axios';
import { Img } from 'react-image';

import './franchise-offices-list.scss';
import { asyncComponent } from '../../../../shared/components/async-component';
import { PrivateRoute } from '../../../../core/components/private-route';
import { EnumRoles, EnumScreens } from '../../../../models/enums';
import { ClientRoutesConstants, Constants, Messages } from '../../../../shared/constants';
import AuthService from '../../../../core/services/auth.service';
import { DashboardWidget } from '../../../dashboard/components/dashboard-widget';
import { IFranchiseOffice } from '../../../../models/interfaces/franchise';
import { withAuthorize } from '../../../../shared/hoc/authorize';
import { getFranchiseOffices } from '../../../../actions/franchise.actions';
import { ButtonComponent } from '../../../../shared/components/button';
import { UrlUtils } from '../../../../utils/http-url.util';
import { logoMissing } from '../../../../shared/components/images';
import { CommonUtils } from '../../../../utils/common-utils';

const AsyncFranchOfficeEditComponent = asyncComponent(() => import('../franchise-office-edit/'));
const AsyncFranOfficeAddComponent = asyncComponent(() => import('../franchise-office-add'));

interface IFranchiseOfficeList {
	match: { path: string, params?: { foid?: string } },
	auth: any, getFranchiseOffices: any
	history: any,
	currentAccessibleScreens: string[]
}
const FranchiseOfficesComponent: React.FC<IFranchiseOfficeList> = (props: IFranchiseOfficeList) => {

	const [franchiseOffices, setFranchiseOffices] = useState([] as IFranchiseOffice[]);
	const [isLoading, setIsLoading] = useState(false);
	const [activeId, setActiveId] = useState('' as string | unknown);
	const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());
	const [currentRole, setCurrentRole] = useState('' as EnumRoles);
	const [baseUrl, setBaseUrl] = useState(UrlUtils.getBaseUrl() as string);
	const [tenant, setTenant] = useState('' as string);

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
		setCurrentRole(payload?.roles);
		setTenant(payload?.tenant);
		if (payload.roles === EnumRoles.Administrator) {
			setSelectedOffice();
		}
		return () => {
			axiosSource?.cancel(Messages.APIAborted);
		};
	}, []);
	const loadOffices = () => {
		setIsLoading(true);
		const payload = AuthService.getCurrentJWTPayload();
		props.getFranchiseOffices(axiosSource)
			.then((data: IFranchiseOffice[]) => {
				data = data?.map(x => ({ ...x, logoUrl: baseUrl + CommonUtils.formatString(Constants.officeLogoPath, payload?.tenant, x?.id || '') }))
				setFranchiseOffices(data);
				setIsLoading(false);
			}).catch((err: any) => {
				if (!axios.isCancel(err)) {
					setFranchiseOffices([]);
					setIsLoading(false);
				}
			})
	}
	const getLink = (content: any, foid?: string) => {
		return (<Link to={ClientRoutesConstants.franchiseOffices + '/' + foid} onClick={() => setActiveId(foid)} >
			{content}
		</Link >);
	}
	const goToDetailsPage = (foid?: string) => {
		setActiveId(foid);
		props.history.push(ClientRoutesConstants.franchiseOffices + '/' + foid);
	}
	const onListReload = () => {
		loadOffices();
	}
	const refreshList = () => {
		loadOffices();
		setSelectedOffice();
	}
	return (
		<div className='customers-list'>
			<section className='content-header'>
				<div className='header-icon'>
					<i className='fa fa-university'></i>
				</div>
				<div className='header-title'>
					<h1>Company Offices</h1>
					<small>Add, Edit and delete Company Offices</small>
				</div>
			</section>
			<section className='content'>
				<div className='row'>
					<div className='col-12 pinpin customer-grid'>
						<DashboardWidget title={
							<>
								Company Offices
								{!isLoading && <span className='records pull-right mr-3'> Showing {franchiseOffices?.length} Records</span>}
							</>
						}
							reloadHandler={onListReload} isLoading={isLoading} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true} >
							<div style={{ minHeight: '400px' }} className='table-responsive list-scrollable custom-scrollbar'>

								<table className='dataTableCustomers table table-striped table-hover'>
									<thead className='back_table_color'>
										<tr className={'secondary'}>
											<th style={{ width: '5%' }}>Logo</th>
											<th style={{ width: '10%' }}>Is Main</th>
											<th style={{ width: '45%' }}>Office Name</th>
											<th style={{ width: '20%' }}>Round Days</th>
											<th style={{ width: '20%' }}>#Agents</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{
											franchiseOffices?.map((cust: IFranchiseOffice, index: number) => {
												return (
													<tr key={cust.id} className={classnames({ 'active': activeId === cust?.id })}>
														<td>
															<Img src={[cust?.logoUrl || ""]} height={60} width={110} style={{ borderRadius: '5px' }} />
														</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.isMain ? 'Yes' : ''}</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.name}</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.roundDays}</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.numberOfAgents}</td>
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
											!franchiseOffices?.length && !isLoading
											&& <tr>
												<td colSpan={6}>
													<div className="no-records text-danger justify-content-center">
														<h2> No Company Office Created Yet!! </h2>
														<div className="mt-2">
															<Link to={ClientRoutesConstants.addFranchiseOffice}>
																<ButtonComponent className="btn btn-primary" text="Create New Company Office" >
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
												<td colSpan={6} >
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
					<PrivateRoute path={ClientRoutesConstants.addFranchiseOffice} exact onReloadOfficesList={refreshList} component={AsyncFranOfficeAddComponent} />
					<Route path={ClientRoutesConstants.viewFranchiseOffices} children={<FranchiseOfficeListSubRoute onReloadOfficesList={refreshList} />} />
				</Switch>
			</section>
		</div >
	);
}


const mapStateToProps = (state: any) => {
	return {
		statuses: state?.customerViewModel?.statuses,
		currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens
	};
}

const mapDispatchToProps = (dispatch: any) => {
	return bindActionCreators({
		getFranchiseOffices,
	}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(withAuthorize(FranchiseOfficesComponent, EnumScreens.ViewFranchiseOffices));

const FranchiseOfficeListSubRoute = connect(mapStateToProps, mapDispatchToProps)((props: any) => {
	const { id }: any = useParams();
	return (
		uuidValidate(id) ? <AsyncFranchOfficeEditComponent {...props} id={id} /> : <Redirect to={ClientRoutesConstants.notFound} />
	);
});
