/** Order Entity (Value Object for Analytics)
* @property {number} id
* @property {string} status
* @property {string} orderDate
* @property {number} productId
* @property {number} quantity
*/
export class Order {
    constructor({ id, status, orderDate, productId, quantity, total }) {
        this.id = id;
        this.status = status;
        this.orderDate = orderDate;
        this.productId = productId;
        this.quantity = quantity;
        this.total = total;
    }
}

/**
 * SupplyLevel: Represents the stock level for one supply item.
 * Think of it like a small container holding info about one product's stock.
 * Used inside the main Analytics data.
 * @property {number} id - The unique ID number for the supply.
 * @property {string} name - The name of the supply.
 * @property {number} current - How much of this supply we currently have.
 * @property {number} minStock - The minimum amount we want to have before it's considered low.
 */
export class SupplyLevel {
    constructor({ id, name, current, minStock }) {
        this.id = id; // Store the id
        this.name = name; // Store the name
        this.current = current; // Store the current amount
        this.minStock = minStock; // Store the minimum desired amount
    }
}

/**
 * DailyRotation: Represents how many movements happened on a specific date.
 * Like a daily log entry for supply activity.
 * Used inside the main Analytics data.
 * @property {string} date - The date this activity happened.
 * @property {number} movements - How many total movements (in or out) occurred on this date.
 */
export class DailyRotation {
    constructor({ date, movements }) {
        this.date = date; // Store the date
        this.movements = movements; // Store the number of movements
    }
}
/**
 * Analytics: The main structure holding all the data needed for the analytics page.
 * It combines summary info, supply levels, and daily activity.
 * This is the primary data object for this feature.
 */
export class Analytics {
    /**
     * @param {Object} param0 - The data object used to create the Analytics.
     * @param {Object} param0.summary - Quick summary numbers.
     * @param {number} param0.summary.monthlyCosts - Estimated costs for the month.
     * @param {SupplyLevel[]} param0.supplyLevels - A list of SupplyLevel objects.
     * @param {DailyRotation[]} param0.dailyRotation - A list of DailyRotation objects.
     * @param {Order[]} param0.orders
     */
    // This runs when we create the main Analytics object.
    // It sets default values if nothing is provided.
    constructor({ summary = { monthlyCosts: 0 }, supplyLevels = [], dailyRotation = [], orders = [] } = {} ) {
        this.summary = summary; // Store the summary info
        this.supplyLevels = supplyLevels; // Store the list of supply levels
        this.dailyRotation = dailyRotation;
        this.orders = orders;// Store the list of daily rotations
    }
}