import { Analytics, SupplyLevel, DailyRotation, Order } from "../domain/model/analytics.entity.js";

/**
 * Assembler class: Used to convert raw data coming from the API
 * into objects of our own classes Analytics, SupplyLevel, etc.
 * It's like a translator between the API and our code.
 * @class
 */

export class AnalyticsAssembler {
    static toEntityFromResource(resource) {
        const summary = resource.summary || { pendingOrders: 0, monthlyCosts: 0 };
        return new Analytics({
            summary: {
                monthlyCosts: summary.monthlyCosts
            },
            // Check if supplyLevels is a list (array).
            // If yes, loop through each item ('s') and create a new SupplyLevel object for it.
            supplyLevels: Array.isArray(resource.supplyLevels)
                ? resource.supplyLevels.map(s => new SupplyLevel(s))
                : [],
            // Do the same for dailyRotation.
            // Check if it's an array and create DailyRotation objects for each item ('d').
            dailyRotation: Array.isArray(resource.dailyRotation)
                ? resource.dailyRotation.map(d => new DailyRotation(d))
                : [],
            orders: Array.isArray(resource.orders)
                ? resource.orders.map(o => new Order(o))
                : []
        });
    }
    /**
     * Converts the FULL API RESPONSE (including status, data, etc.)
     * into ONE Analytics class object.
     * @param {Object} response - The complete response from the API call
     * @returns {Analytics} - A Analytics object. Returns an empty one if there's an error.
     */
    static toEntityFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return new Analytics();
        }
        // If the response was successful (200 OK),
        // call the other function (toEntityFromResource) to convert
        // just the data part (response.data) into a Analytics object.
        return this.toEntityFromResource(response.data);
    }
}