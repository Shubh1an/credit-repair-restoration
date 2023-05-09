import React, { useEffect, useRef, useState } from 'react';
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
import { AutoCompleteSearchTypes, EnumScreens, SearchType } from '../../../../models/enums';
import { ClientRoutesConstants, Messages } from '../../../../shared/constants';
import { DashboardWidget } from '../../../dashboard/components/dashboard-widget';
import { withAuthorize } from '../../../../shared/hoc/authorize';
import { getFranchseAgentsList } from '../../../../actions/franchise-agents.actions';
import { ButtonComponent } from '../../../../shared/components/button';
import { IDropdown, INameValue, INameValueMatch } from '../../../../models/interfaces/shared';
import { ListFilterComponent } from '../../../../shared/components/list-filter';
import { IFranchiseAgent } from '../../../../models/interfaces/franchise';
import moment from 'moment';
import { CommonUtils } from '../../../../utils/common-utils';

const AsyncEditComponent = asyncComponent(() => import('../edit'));
const AsyncAddComponent = asyncComponent(() => import('../add'));

const FranchiseAgentsListComponent: React.FC<any> = (props: {
	match: { path: string, params?: { id?: string } },
	auth: any, getFranchseAgentsList: any
	history: any,
	currentAccessibleScreens: string[]
}) => {
	
	const [agents, setAgents] = useState([] as IFranchiseAgent[]);
	const [agentCounts, setAgentCounts] = useState(0 as number);
	const [fOffices, setFOffices] = useState([] as INameValue[]);
	const [roleNames, setRoleNames] = useState([] as INameValue[]);
	const [isLoading, setIsLoading] = useState(false);
	const [activeId, setActiveId] = useState('' as string | unknown);
	const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());
	const franchRef: any = useRef(null);
	const rolesRef: any = useRef(null);
	const [searchText, setSearchText] = useState('');
	const [filterChanged, setFilterChanged] = useState(false);
	const [searchCriteria, setSearchCriteria] = useState([] as INameValueMatch[]);
	const [selectedAlphabet, setSelectedAlphabet] = useState('');
	const [randomKey, setRandomKey] = useState(CommonUtils.randomNumber() as number);
	const getRandom = () => {
		return CommonUtils.randomNumber();
	}
	const setSelectedAgent = () => {
		const index = window.location.href.lastIndexOf('/');
		const foid = window.location.href.slice(index + 1);
		if (foid && uuidValidate(foid)) {
			setActiveId(foid);
		}
	}
	useEffect(() => {
		return () => {
			axiosSource.cancel(Messages.APIAborted);
		}
	}, [])
	useEffect(() => {
		loadAgents();
	}, [searchCriteria]);

	const loadAgents = () => {
		setIsLoading(true);
		setAgentCounts(() => agentCounts + 1);
		props.getFranchseAgentsList(searchCriteria || [], axiosSource, searchText)
			.then((data: any) => {
				setIsLoading(false);
				setAgents(data?.agents);
				if (agentCounts === 0) {
					setFOffices(data?.offices);
					setRoleNames(data?.roles);
				}
				setSelectedAgent();
			}).catch((err: any) => {
				if (!axios.isCancel(err)) {
					setAgents([]);
					setIsLoading(false);
				}
			})
	}
	const getLink = (content: any, foid?: string) => {
		return (<Link to={ClientRoutesConstants.franchiseAgents + '/' + foid} onClick={() => { setActiveId(foid); }} >
			{content}
		</Link >);
	}
	const goToDetailsPage = (foid?: string) => {
		setActiveId(foid);
		props.history.push(ClientRoutesConstants.franchiseAgents + '/' + foid);
	}
	const onListReload = () => {
		loadAgents();
	}
	const onHeaderFilterChange = (fiterlName: number) => {
		setFilterChanged(true);
		let s = [] as INameValueMatch[];
		let search = [...searchCriteria];
		switch (fiterlName) {
			case 1:
				search = search.filter(x => x.Name !== 'Role');
				if (rolesRef.current.value) {
					s.push(getHeaderFilter('Role', rolesRef.current.value, SearchType.Complete));
				}
				break;
			case 2:
				search = search.filter(x => x.Name !== 'Office.Name');
				if (franchRef.current.value) {
					s.push(getHeaderFilter('Office.Name', franchRef.current?.selectedOptions[0].value, SearchType.Complete));
				}
				break;
			default:
				break;
		}

		setSearchCriteria([
			...search,
			...s
		]);
	}
	const getHeaderFilter = (Name: string, Value: string, Match = SearchType.Contains): INameValueMatch => {
		return { Name, Value, Match };
	}

	const onTextChange = (text: string | IDropdown) => {
		setFilterChanged(true);
		if (typeof (text) === 'string') {
			setSearchText(text);
			setSearchCriteria([
				...searchCriteria
			]);
		} else if (typeof (text) === 'object' && uuidValidate(text?.abbreviation ?? '')) {
			setSearchText('');
			setSearchCriteria([
				...searchCriteria?.filter(x => x.Name !== 'Id'),
				{ Name: 'Id', Value: text?.abbreviation || '', Match: SearchType.Complete }
			]);
			setActiveId(text?.abbreviation);
			props.history.push(ClientRoutesConstants.franchiseAgents + '/' + text.abbreviation);
		}
	}
	const onFilterClear = () => {
		setSearchCriteria([]);
		franchRef.current.value = '';
		rolesRef.current.value = '';
		setSearchText('');
		setSelectedAlphabet('');
		setRandomKey(getRandom());
		setFilterChanged(false);
	}
	const alphabetClicked = (character: string) => {
		setSelectedAlphabet(character);
		setSearchText('');
		setFilterChanged(true);
		setSearchCriteria([
			...searchCriteria?.filter(x => x.Name !== 'LastName'),
			{ Name: 'LastName', Value: character, Match: SearchType.StartsWith },
		]);
	}
	const onDateRangeChange = (range: { from: string, to: string }) => {
		setFilterChanged(true);
		setSearchText('');
		setSearchCriteria([
			...searchCriteria?.filter(x => x.Name !== 'DateEntered'),
			{ Name: 'DateEntered', Value: `${range.from},${range.to}`, Match: SearchType.DateRange },
		]);
	}
	return (
		<div className='customers-list lead-list'>
			<section className='content-header'>
				<div className='header-icon'>
					<i className='fa fa-user-secret'></i>
				</div>
				<div className='header-title'>
					<h1>Company Agents</h1>
					<small>Add, Edit and delete Company Agents</small>
				</div>
			</section>
			<section className='content'>
				<div className='row'>
					<div className='col-12 pinpin customer-grid lead-grid'>
						<DashboardWidget title={
							<>
								Company Agents
								{!isLoading && <span className='records pull-right mr-3'> Showing {agents?.length} Records</span>}
							</>
						}
							reloadHandler={onListReload} isLoading={isLoading} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true} >
							<div style={{ minHeight: '400px' }} className='table-responsive list-scrollable custom-scrollbar'>

								<table className='dataTableCustomers table table-striped table-hover'>
									<thead className='back_table_color'>
										<tr className={'secondary'}>
											<th></th>
											<th style={{ width: '15%' }}>Last Name</th>
											<th style={{ width: '15%' }}>First Name</th>
											<th style={{ width: '15%' }}>
												<div>Type</div>
												<select ref={rolesRef} onChange={() => onHeaderFilterChange(1)} disabled={!roleNames?.length} className='form-control input-sm'>
													<option value=''>- All Listings -</option>
													{
														roleNames?.map((item: INameValue, index) => <option key={index} value={(item?.Value)}>{item?.Name}</option>)
													}
												</select>
											</th>
											<th style={{ width: '20%' }}>
												<div>Company</div>
												<select ref={franchRef} onChange={() => onHeaderFilterChange(2)} disabled={!fOffices?.length} className='form-control input-sm'>
													<option value=''>- All Listings -</option>
													{
														fOffices?.map((item, index) => <option key={index} value={(item?.Value?.trim())}>{(item?.Name?.trim())}</option>)
													}
												</select>
											</th>
											<th style={{ width: '20%' }}>
												<div>Email</div>
											</th>
											<th style={{ width: '10%', textAlign: 'center' }}>
												Created On
											</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{
											agents?.map((cust: IFranchiseAgent, index: number) => {
												return (
													<tr key={cust.id} className={classnames({ 'active': activeId === cust?.id })}>
														<td></td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.lastName}</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.firstName}</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.role}</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.office?.name}</td>
														<td style={{ cursor: 'pointer' }} onClick={() => goToDetailsPage(cust?.id)}>{cust?.email?.toLowerCase()}</td>
														<td className='text-center'>
															{
																moment(cust?.dateEntered).format('MM/DD/YYYY')
															}
														</td>
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
											!agents?.length && !isLoading
											&& <tr>
												<td colSpan={8}>
													{
														filterChanged ?
															<div className="no-records text-danger justify-content-center">
																<h2> No Record Found!! </h2>
															</div>
															:
															<div className="no-records text-danger justify-content-center">
																<h2> No Agents Created Yet!! </h2>
																<div className="mt-2">
																	<Link to={ClientRoutesConstants.addFranchiseAgent}>
																		<ButtonComponent className="btn btn-primary" text="Create New Company Agent" >
																			<i className="fa fa-plus mr-2"></i>
																		</ButtonComponent>
																	</Link>
																</div>
															</div>
													}
												</td>
											</tr>
										}
										{
											isLoading &&
											<tr>
												<td colSpan={8} >
													<div style={{ minHeight: '400px' }}></div>
												</td>
											</tr>
										}
									</tbody>
								</table>
							</div>
							<ListFilterComponent
								key={randomKey}
								hideAlphabets={false}
								hideSearchOptions={true}
								selectedAlphabet={selectedAlphabet}
								alphabetClicked={alphabetClicked}
								onFilterClear={onFilterClear}
								hideCustomerSearch={false}
								onTextChange={onTextChange}
								defaultText={searchText}
								searchTypes={AutoCompleteSearchTypes.FRENCHISE_AGENT}
								onDateRangeChange={onDateRangeChange}
								customerSearchPlaceholder={"Type to search Agents..."}
							/>
							{
								filterChanged &&
								<span className="filter-clear" onClick={onFilterClear}>
									<i className="fa fa-remove mr-1"></i>
									clear filters
								</span>
							}
						</DashboardWidget>
					</div>
				</div>
			</section>
			<section className='content edit-customer-section' id='myScrollToElement'>
				<Switch>
					<PrivateRoute path={ClientRoutesConstants.addFranchiseAgent} exact onReloadList={loadAgents} component={AsyncAddComponent} />
					<Route path={ClientRoutesConstants.viewFranchiseAgents} children={<AgentsListSubRoute onReloadList={loadAgents} />} />
				</Switch>
			</section>
		</div >
	);
}


const mapStateToProps = (state: any) => {
	return {
		currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens
	};
}

const mapDispatchToProps = (dispatch: any) => {
	return bindActionCreators({
		getFranchseAgentsList,
	}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(withAuthorize(FranchiseAgentsListComponent, EnumScreens.ViewFranchiseAgents));

const AgentsListSubRoute = connect(mapStateToProps, mapDispatchToProps)((props: any) => {
	const { id }: any = useParams();
	return (
		uuidValidate(id) ? <AsyncEditComponent {...props} id={id} /> : <Redirect to={ClientRoutesConstants.notFound} />
	);
});
