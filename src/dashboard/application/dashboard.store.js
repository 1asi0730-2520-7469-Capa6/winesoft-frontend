import { defineStore } from "pinia";
import { ref } from "vue";
import { DashboardApi } from "../infrastructure/dashboard-api.js";
import { DashboardAssembler } from "../infrastructure/dashboard.assembler.js";
import { Dashboard } from "../domain/model/dashboard.entity.js";
import { formatISO } from 'date-fns';

const dashboardApi = new DashboardApi();

/**
 * Pinia store for managing dashboard state.
 */
export const useDashboardStore = defineStore("dashboard", () => {
    // State
    const data = ref(new Dashboard());
    const errors = ref([]);
    const dataLoaded = ref(false);

    // Actions
    function fetchDashboardData(startDate = null, endDate = null) {

        dataLoaded.value = false;
        errors.value = [];

        const startStr = startDate ? formatISO(startDate, { representation: 'date' }) : null;
        const endStr = endDate ? formatISO(endDate, { representation: 'date' }) : null;

        dashboardApi
            .getDashboardData()
            .then((response) => {
                data.value = DashboardAssembler.toEntityFromResponse(response);
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
        fetchDashboardData,
    };
});