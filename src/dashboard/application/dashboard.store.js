import { defineStore } from "pinia";
import { ref } from "vue";
import { DashboardApi } from "../infrastructure/dashboard-api.js";
import { DashboardAssembler } from "../infrastructure/dashboard.assembler.js";
import { Dashboard } from "../domain/model/dashboard.entity.js";

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
    function fetchDashboardData() {
        if (dataLoaded.value) return;

        errors.value = [];
        dashboardApi
            .getDashboardData()
            .then((response) => {
                data.value = DashboardAssembler.toEntityFromResponse(response);
                dataLoaded.value = true;
            })
            .catch((error) => {
                errors.value.push(error);
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