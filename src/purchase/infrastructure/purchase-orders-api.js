import { BaseApi } from "../../shared/infrastructure/base-api.js";

const purchaseEndpoint = import.meta.env.VITE_PURCHASE_ORDERS_ENDPOINT_PATH;

export class PurchaseOrdersApi extends BaseApi {
    #endpointPath;

    constructor() {
        super();
        this.#endpointPath = purchaseEndpoint;
    }

    async getAll() {
        return this.http.get(`${this.#endpointPath}/get-all-orders`);
    }

    async create(resource) {
        return this.http.post(`${this.#endpointPath}/create-order`, resource);
    }

    getById(id) {
        return this.http.get(`${this.#endpointPath}/get-order-by-id/${id}`);
    }

    update(id, resource) {
        return this.http.put(`${this.#endpointPath}/update-order-by-id/${id}`, resource);
    }

    delete(id) {
        return this.http.delete(`${this.#endpointPath}/delete-order-by-id/${id}`);
    }
}