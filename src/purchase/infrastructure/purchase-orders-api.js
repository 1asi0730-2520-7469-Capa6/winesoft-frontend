import { BaseApi } from "../../shared/infrastructure/base-api.js";

const purchaseEndpoint = import.meta.env.VITE_PURCHASE_ORDERS_ENDPOINT_PATH;

export class PurchaseOrdersApi extends BaseApi {
    #endpointPath;

    constructor() {
        super();
        this.#endpointPath = purchaseEndpoint;
    }

    async getAll() {
        return await this.http.get(this.#endpointPath);
    }

    async create(resource) {
        return await this.http.post(this.#endpointPath, resource);
    }

    getById(id) {
        return this.http.get(`${this.#endpointPath}/${id}`);
    }

    update(id, resource) {
        return this.http.put(`${this.#endpointPath}/${id}`, resource);
    }

    delete(id) {
        return this.http.delete(`${this.#endpointPath}/${id}`);
    }
}