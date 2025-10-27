/**
 * SupplyLevel: Represents the stock level for one supply item.
 * Think of it like a small container holding info about one product's stock.
 * Used inside the main Dashboard data.
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
 * Used inside the main Dashboard data.
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
 * Dashboard: The main structure holding all the data needed for the dashboard page.
 * It combines summary info, supply levels, and daily activity.
 * This is the primary data object for this feature.
 */
export class Dashboard {
    /**
     * @param {Object} param0 - The data object used to create the Dashboard.
     * @param {Object} param0.summary - Quick summary numbers.
     * @param {number} param0.summary.pendingOrders - How many orders are waiting.
     * @param {number} param0.summary.monthlyCosts - Estimated costs for the month.
     * @param {SupplyLevel[]} param0.supplyLevels - A list (array) of SupplyLevel objects.
     * @param {DailyRotation[]} param0.dailyRotation - A list (array) of DailyRotation objects.
     */
    // This runs when we create the main Dashboard object.
    // It sets default values if nothing is provided.
    constructor({ summary = { pendingOrders: 0, monthlyCosts: 0 }, supplyLevels = [], dailyRotation = [] } = {}) {
        this.summary = summary; // Store the summary info
        this.supplyLevels = supplyLevels; // Store the list of supply levels
        this.dailyRotation = dailyRotation; // Store the list of daily rotations
    }
}