import { ICustomersState } from '../models/interfaces/customer-view';

export const CustomersListInitialState: ICustomersState = {
    statuses: [],
    apiActive: false,
    states: [],
    hasPartneryKey: false,
    s3Files: [],
    adminSettings: null,
    disputeStats: [],
    disputeStatsLoading: false
};