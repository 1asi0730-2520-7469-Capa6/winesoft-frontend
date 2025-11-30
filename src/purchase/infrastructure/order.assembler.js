import { Order } from "../domain/model/order.entity.js";

export class OrderAssembler {
    static toEntityFromResource(resource) {
        return new Order({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        // json-server devuelve el array directamente en data
        const resources = response.data;
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}