import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

// Apunta a la nueva variable
const dashboardEndpointPath = import.meta.env.VITE_DASHBOARD_ENDPOINT_PATH;

/**
 * Dashboard API class to interact with the dashboard endpoint.
 * @extends BaseApi
 */
export class DashboardApi extends BaseApi {
    #dashboardEndpoint;

    constructor() {
        super();
        this.#dashboardEndpoint = new BaseEndpoint(this, dashboardEndpointPath);
    }

    /**
     * Fetches the dashboard data object from the dashboard endpoint.
     * getAll() hace un GET a /dashboard
     */
    getDashboardData() {
        return this.#dashboardEndpoint.getAll();
    }
}