import { Dashboard, SupplyLevel, DailyRotation } from "../domain/model/dashboard.entity.js";

/**
 * Assembler class: Used to convert raw data coming from the API
 * into objects of our own classes Dashboard, SupplyLevel, etc.
 * It's like a translator between the API and our code.
 * @class
 */

export class DashboardAssembler {
    static toEntityFromResource(resource) {
        const summary = resource.summary || { pendingOrders: 0, monthlyCosts: 0 };
        return new Dashboard({
            summary: {
                pendingOrders: summary.pendingOrders,
                monthlyCosts: summary.monthlyCosts
            },
            // Check if supplyLevels is a list (array).
            // If yes, loop through each item ('s') and create a new SupplyLevel object for it.
            // If not an array, leave the list empty ([]).
            supplyLevels: Array.isArray(resource.supplyLevels)
                ? resource.supplyLevels.map(s => new SupplyLevel(s))
                : [],
            // Do the same for dailyRotation.
            // Check if it's an array and create DailyRotation objects for each item ('d').
            dailyRotation: Array.isArray(resource.dailyRotation)
                ? resource.dailyRotation.map(d => new DailyRotation(d))
                : []
        });
    }
    /**
     * Converts the FULL API RESPONSE (including status, data, etc.)
     * into ONE Dashboard class object.
     * @param {Object} response - The complete response from the API call
     * @returns {Dashboard} - A Dashboard object. Returns an empty one if there's an error.
     */
    static toEntityFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return new Dashboard();
        }
        // If the response was successful (200 OK),
        // call the other function (toEntityFromResource) to convert
        // just the data part (response.data) into a Dashboard object.
        return this.toEntityFromResource(response.data);
    }
}