import { ClientRoutesConstants } from '../../shared/constants';

export default class RoutingService {

    static isolateRoutes = [
        ClientRoutesConstants.htmlParser?.toLowerCase(),
        ClientRoutesConstants.leadAddPublic?.toLowerCase()
    ];
    static isIsolateRoutes(route: string): boolean {
        return this.isolateRoutes?.includes(route?.toLowerCase());
    }
}