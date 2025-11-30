import { defineStore } from "pinia";
import { ref } from "vue";
import { AnalyticsApi } from "../infrastructure/analytics-api.js";
import { AnalyticsAssembler } from "../infrastructure/analytics.assembler.js";
import { Analytics } from "../domain/model/analytics.entity.js";
import { formatISO } from 'date-fns';

const analyticsApi = new AnalyticsApi();

/**
 * Pinia store for managing analytics state.
 */
export const useAnalyticsStore = defineStore("analytics", () => {
    // State
    const data = ref(new Analytics());
    const errors = ref([]);
    const dataLoaded = ref(false);

    // Actions
    function fetchAnalyticsData(startDate = null, endDate = null) {

        dataLoaded.value = false;
        errors.value = [];

        const startStr = startDate ? formatISO(startDate, { representation: 'date' }) : null;
        const endStr = endDate ? formatISO(endDate, { representation: 'date' }) : null;

        analyticsApi
            .getAnalyticsData()
            .then((response) => {
                data.value = AnalyticsAssembler.toEntityFromResponse(response);
                dataLoaded.value = true;
            })
            .catch((error) => {
                errors.value.push(error);
                dataLoaded.value = true;
            });
    }

    return {
        // State
        data,
        errors,
        dataLoaded,
        // Actions
        fetchAnalyticsData,
    };
});