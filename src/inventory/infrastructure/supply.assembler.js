import { Supply } from "../domain/model/supply.entity.js";

/**
 * Assembler class to convert supply resources and responses into Supply entities.
 * @class
 *
 * @example
 * // Convert a single resource to an entity
 * const resource = { id: 1, supplierName: "Distribuidora X", liquorName: "Whisky", quantity: 50, unit: "bottles", date: "2025-10-01" };
 * const supplyEntity = SupplyAssembler.toEntityFromResource(resource);
 *
 * // Convert a response containing multiple resources to entities
 * const response = {
 *   status: 200,
 *   data: [
 *     { id: 1, supplierName: "Distribuidora X", liquorName: "Whisky", quantity: 50, unit: "bottles", date: "2025-10-01" },
 *     { id: 2, supplierName: "Proveedor Y", liquorName: "Vodka", quantity: 30, unit: "boxes", date: "2025-10-02" }
 *   ]
 * };
 * const supplyEntities = SupplyAssembler.toEntitiesFromResponse(response);
 */
export class SupplyAssembler {
    /**
     * Convert a single supply resource into a Supply entity.
     * @param {Object} resource - The supply resource object.
     * @returns {Supply} - The converted Supply entity.
     */
    static toEntityFromResource(resource) {
        return new Supply({
            ...resource,
            date: resource.date ? new Date(resource.date) : null
        });
    }

    /**
     * Convert a response containing multiple supply resources into an array of Supply entities.
     * @param {Object} response - The response object containing supply resources.
     * @returns {Supply[]} - An array of converted Supply entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = Array.isArray(response.data) ? response.data : response.data['supplies'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
