/**
 * Order Entity
 * Represents an order made to a supplier.
 * @class
 * @property {Number|null} id - The unique identifier of the order.
 * @property {Number} supplyId - The ID of the supply being ordered.
 * @property {Number} quantity - The quantity ordered.
 * @property {string} status - The current status of the order (e.g., 'pending', 'in-transit', 'delivered').
 * @property {Number} supplierId - The ID of the supplier.
 */
export class Order {
    /**
     * Creates an instance of Order.
     * @param {Object} param0
     * @param {Number|null} param0.id
     * @param {Number} param0.supplyId
     * @param {Number} param0.quantity
     * @param {string} param0.status
     * @param {Number} param0.supplierId
     */
    constructor({ id = null, supplyId, quantity, status, supplierId }) {
        this.id = id;
        this.supplyId = supplyId;
        this.quantity = quantity;
        this.status = status;
        this.supplierId = supplierId;
    }
}