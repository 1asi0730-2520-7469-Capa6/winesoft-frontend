import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const analyticsEndpointPath = import.meta.env.VITE_ANALYTICS_ENDPOINT_PATH;

/**
 * Analytics API class to interact with the analytics endpoint.
 * @extends BaseApi
 */
export class AnalyticsApi extends BaseApi {
    #analyticsEndpoint;

    constructor() {
        super();
        this.#analyticsEndpoint = new BaseEndpoint(this, analyticsEndpointPath);
    }

    /**
     * Fetches the analytics data object from the analytics endpoint.
     * getAll() hace un GET a /analytics
     */
    getAnalyticsData(startDate = null, endDate = null) {
        const params = {};
        if (startDate) params.startDate = startDate;// ej: "2025-10-01"
        if (endDate) params.endDate = endDate;// ej: "2025-10-31"
        return this.http.get(this.#analyticsEndpoint.endpointPath, { params });
    }
}