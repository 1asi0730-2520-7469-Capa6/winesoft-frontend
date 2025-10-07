/**
 * Supply Entity
 * Represents a supply batch of liquor products in the inventory domain.
 * @class
 * @property {Number|null} id - The unique identifier of the supply.
 * @property {Number} productId - The ID of the product supplied.
 * @property {Number} quantity - The quantity of units supplied.
 * @property {string} supplier - The supplier name.
 * @property {string} date - The supply date (ISO format).
 *
 * @example
 * const supply = new Supply({
 *   id: 1,
 *   productId: 10,
 *   quantity: 50,
 *   supplier: 'Distribuidora Andina',
 *   date: '2025-10-05'
 * });
 * console.log(supply.quantity); // 50
 */
export class Supply {
    /**
     * Creates an instance of Supply.
     * @param {Object} param0
     * @param {Number|null} param0.id - The unique identifier of the supply.
     * @param {Number} param0.productId - The ID of the product supplied.
     * @param {Number} param0.quantity - The quantity supplied.
     * @param {string} param0.supplier - The supplier name.
     * @param {string} param0.date - The supply date (ISO format).
     */
    constructor({ id = null, productId, quantity, supplier, date }) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.supplier = supplier;
        this.date = date;
    }
}
