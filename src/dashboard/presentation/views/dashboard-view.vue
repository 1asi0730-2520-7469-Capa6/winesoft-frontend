<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDashboardStore } from '../../application/dashboard.store.js';
import { useI18n } from 'vue-i18n';
import Chart from 'primevue/chart';
import { storeToRefs } from 'pinia';
import {useRouter} from "vue-router";
import jsPDF from 'jspdf';
import ProgressSpinner from 'primevue/progressspinner';

const { t } = useI18n();
const store = useDashboardStore();
const { data: dashboardData, dataLoaded, errors } = storeToRefs(store);
const { fetchDashboardData } = store;
const router = useRouter();

onMounted(() => {
  fetchDashboardData();
});

//Colores
const colorRojoEscaso = '#b0356d';
const colorNormal = '#6b1f43';
const colorTextoTarjeta = '#333333';

//Bar Chart 1 - Supplies
const supplyChartData = computed(() => {
  if (!dashboardData.value || !dashboardData.value.supplyLevels || dashboardData.value.supplyLevels.length === 0) {
    return { labels: [], datasets: [] };
  }
  const labels = dashboardData.value.supplyLevels.map(s => s.name);
  const data = dashboardData.value.supplyLevels.map(s => s.current);
  const backgroundColors = dashboardData.value.supplyLevels.map(s =>
      s.current < s.minStock ? colorRojoEscaso : colorNormal
  );
  return {
    labels: labels,
    datasets: [ { label: t('dashboard.supplyStock'), data: data, backgroundColor: backgroundColors, borderColor: backgroundColors, borderWidth: 1 } ]
  };
});
const supplyChartOptions = ref({});
//List of scarce supplies
const lowStockSuppliesList = computed(() => {
  if (!dashboardData.value || !dashboardData.value.supplyLevels) return [];
  return dashboardData.value.supplyLevels.filter(s => s.current < s.minStock);
});

//Chart 2 - Daily rotation
const rotationChartData = computed(() => {
  if (!dashboardData.value || !dashboardData.value.dailyRotation || dashboardData.value.dailyRotation.length === 0) {
    return { labels: [], datasets: [] };
  }

  const labels = dashboardData.value.dailyRotation.map(d =>
      new Date(d.date).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })
  );
  const data = dashboardData.value.dailyRotation.map(d => d.movements);

  return {
    labels: labels,
    datasets: [
      {
        label: t('dashboard.dailyMovements'),
        data: data,
        fill: 'origin',
        borderColor: colorRojoEscaso,
        backgroundColor: 'rgba(176, 53, 109, 0.2)',
        tension: 0
      }
    ]
  };
});

const rotationChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' }
  },
});


//Summary metrics
const formattedMonthlyCosts = computed(() => {
  if (!dashboardData.value || !dashboardData.value.summary) return 'N/A';
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD' }).format(dashboardData.value.summary.monthlyCosts);
});

const pendingOrders = computed(() => {
  return (dashboardData.value && dashboardData.value.summary) ? dashboardData.value.summary.pendingOrders : 0;
});

function generateReport() {
    if (!dataLoaded.value || errors.value.length > 0) {
      alert(t('dashboard.errorGeneratingReport'));
      return;
    }

    // Create a new instance of jsPDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 15;
    let currentY = margin;

    // Report Title
    doc.setFontSize(18);
    doc.text(t('dashboard.reportGeneratedTitle'), margin, currentY);
    currentY += 10;
    doc.setFontSize(10);
    doc.text(t('dashboard.reportGeneratedDate', { date: new Date().toLocaleDateString('es-PE') }), margin, currentY);
    currentY += 15;

    //Summary
    doc.setFontSize(14);
    doc.text(t('dashboard.reportSectionSummary'), margin, currentY);
    currentY += 8;
    doc.setFontSize(12);
    doc.text(`${t('dashboard.pendingOrders')}: ${pendingOrders.value}`, margin + 5, currentY);
    currentY += 7;
    doc.text(`${t('dashboard.monthlyTotal')}: ${formattedMonthlyCosts.value}`, margin + 5, currentY);
    currentY += 15;

    //Supply Levels
    doc.setFontSize(14);
    doc.text(t('dashboard.supplyLevelsTitle'), margin, currentY);
    currentY += 8;
    doc.setFontSize(10);
    // Simple table headers
    doc.setFont(undefined, 'bold');
    doc.text(t('dashboard.reportSupplyName'), margin + 5, currentY);
    doc.text(t('dashboard.reportSupplyCurrent'), margin + 80, currentY);
    doc.text(t('dashboard.reportSupplyMin'), margin + 110, currentY);
    doc.text(t('dashboard.reportSupplyStatus'), margin + 140, currentY);
    doc.setFont(undefined, 'normal');
    currentY += 6;

    dashboardData.value.supplyLevels.forEach(supply => {
      if (currentY > (doc.internal.pageSize.height - margin)) {
        doc.addPage();
        currentY = margin;
      }
      const isLow = supply.current < supply.minStock;
      if (isLow) { doc.setTextColor(176, 53, 109); }
      doc.text(supply.name, margin + 5, currentY);
      doc.text(String(supply.current), margin + 80, currentY);
      doc.text(String(supply.minStock), margin + 110, currentY);
      doc.text(isLow ? t('dashboard.reportStatusLow') : t('dashboard.reportStatusOK'), margin + 140, currentY);
      if (isLow) { doc.setTextColor(0, 0, 0); }
      currentY += 6;
    });
    currentY += 10;

    //Daily rotation last 7 days
    if (currentY > (doc.internal.pageSize.height - margin - 30)) {
      doc.addPage();
      currentY = margin;
    }
    doc.setFontSize(14);
    doc.text(t('dashboard.dailyRotationTitle'), margin, currentY);
    currentY += 8;
    doc.setFontSize(10);
    //headers
    doc.setFont(undefined, 'bold');
    doc.text(t('dashboard.reportDate'), margin + 5, currentY);
    doc.text(t('dashboard.reportMovements'), margin + 50, currentY);
    doc.setFont(undefined, 'normal');
    currentY += 6;

    dashboardData.value.dailyRotation.forEach(rotation => {
      if (currentY > (doc.internal.pageSize.height - margin)) {
        doc.addPage();
        currentY = margin;
      }
      const formattedDate = new Date(rotation.date).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
      doc.text(formattedDate, margin + 5, currentY);
      doc.text(String(rotation.movements), margin + 50, currentY);
      currentY += 6;
    });

    //Save the PDF
    //File name: Report_Dashboard_WineSoft_YYYY-MM-DD.pdf
    const fileName = `Report_Dashboard_WineSoft_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}

function goToRequestSupplies() {
  alert('Redirecting to the request for inputs (placeholder)...');
}

</script>
<template>
  <div class="p-4 dashboard-layout">
    <div class="dashboard-header">
      <h1>{{ t('dashboard.title') }}</h1>
      <pv-button
          :label="t('dashboard.generateReport')"
          icon="pi pi-file-pdf"
          severity="secondary"
          @click="generateReport"
          :disabled="!dataLoaded || errors.length > 0"
      />
    </div>

    <div v-if="!dataLoaded" class="col-span-12 loading-message"> {{ t('dashboard.loading') }} </div>

    <div v-if="dataLoaded && errors.length" class="col-span-12 text-red-500 mb-4 p-error p-3 border-round">
      Error loading control panel: {{ errors.map(e => e.message).join(', ') }}
    </div>

    <div class="dashboard-grid" v-if="dataLoaded && errors.length === 0">

      <pv-card class="dashboard-card col-span-12">
        <template #content>
          <div v-if="!dataLoaded" class="loading-spinner"> <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" /> </div>
          <div v-else class="chart-container-line">
            <Chart type="line" :data="rotationChartData" :options="rotationChartOptions" />
          </div>
        </template>
      </pv-card>

      <pv-card class="dashboard-card col-span-12 md:col-span-8">
        <template #title>
          <div class="card-header">
            <span>{{ t('dashboard.monthlyCosts') }}</span>
            <div class="card-controls">
              <i class="pi pi-arrows-alt"></i>
              <i class="pi pi-window-minimize"></i>
              <i class="pi pi-window-maximize"></i>
            </div>
          </div>
        </template>
        <template #content>
          <div v-if="!dataLoaded" class="loading-spinner"> <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" /> </div>
          <div v-else class="costs-summary single-cost">
            <div class="cost-item">
              <span class="cost-value total">{{ formattedMonthlyCosts }}</span>
            </div>
          </div>
        </template>
      </pv-card>

      <pv-card class="dashboard-card summary-card col-span-12 md:col-span-4">
        <template #title>
          <div class="card-header">
            <span>{{ t('dashboard.pendingOrders') }}</span>
            <div class="card-controls">
              <i class="pi pi-arrows-alt"></i>
              <i class="pi pi-window-minimize"></i>
              <i class="pi pi-window-maximize"></i>
            </div>
          </div>
        </template>
        <template #content>
          <div v-if="!dataLoaded" class="loading-spinner"> <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" /> </div>
          <div v-else class="metric-value">{{ pendingOrders }}</div>
        </template>
      </pv-card>

      <pv-card class="dashboard-card col-span-12 md:col-span-8">
        <template #title>
          <div class="card-header">
            <span>{{ t('dashboard.supplyLevelsTitle') }}</span>
            <div class="card-controls"> <i class="pi pi-arrows-alt"></i> <i class="pi pi-window-minimize"></i> <i class="pi pi-window-maximize"></i> </div>
          </div>
        </template>
        <template #content>
          <div v-if="!dataLoaded" class="loading-spinner"> <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" /> </div>
          <div v-else class="chart-container">
            <Chart type="bar" :data="supplyChartData" :options="supplyChartOptions" />
          </div>
        </template>
      </pv-card>

      <pv-card class="dashboard-card col-span-12 md:col-span-4">
        <template #title>
          <div class="card-header">
            <span>{{ t('dashboard.alertsTitle') }}</span>
            <div class="card-controls"> <i class="pi pi-arrows-alt"></i> <i class="pi pi-window-minimize"></i> <i class="pi pi-window-maximize"></i> </div>
          </div>
        </template>
        <template #content>
          <div v-if="!dataLoaded" class="loading-spinner"> <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" /> </div>
          <div v-else class="alerts-content">
            <div class="low-stock-alerts" v-if="lowStockSuppliesList.length > 0">
              <div v-for="supply in lowStockSuppliesList" :key="supply.id" class="alert-item">
                <i class="pi pi-exclamation-triangle p-error"></i>
                <div class="alert-text">
                  <span class="font-medium">{{ supply.name }}</span>
                  <small>{{ t('dashboard.lowStockAlert') }} ({{ supply.current }}/{{ supply.minStock }})</small>
                </div>
              </div>
            </div>
            <p v-else class="no-alerts">{{ t('dashboard.noLowStock') }}</p>

            <pv-button
                :label="t('dashboard.requestSupplies')"
                icon="pi pi-shopping-cart"
                class="p-button-sm mt-auto"
            @click="goToRequestSupplies"
            :disabled="lowStockSuppliesList.length === 0"
            />
          </div>
        </template>
      </pv-card>

    </div> </div>
</template>

<style scoped>
.dashboard-layout {
  min-height: calc(100vh - 60px);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.dashboard-header h1 {
  color: #333333;
  font-size: 2rem;
  margin: 0;
}
.loading-message {
  color: #EDEDED;
  font-size: 1.2rem;
  text-align: center;
  padding: 2rem;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  padding-bottom: 2rem;
}

.col-span-12 { grid-column: span 12; }
@media (min-width: 768px) {
  .md\:col-span-3 { grid-column: span 3; }
  .md\:col-span-4 { grid-column: span 4; }
  .md\:col-span-8 { grid-column: span 8; }
  .md\:col-span-9 { grid-column: span 9; }
}

/*White card style*/
.dashboard-card {
  background: #ffffff;
  color: #333333;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
:deep(.dashboard-card .p-card-body) {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.dashboard-card .p-card-content) {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Para flexbox */
}

/* Card header and controls */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eeeeee;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333333;
}
.card-controls {
  display: flex;
  gap: 0.75rem;
  color: #888888;
}
.card-controls i {
  cursor: pointer;
  transition: color 0.2s;
}
.card-controls i:hover {
  color: #b0356d; /*Color vino al pasar el mouse*/
}

/*Top cost card */
.costs-summary {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem 0;
  flex-grow: 1;
}
.cost-item {
  text-align: center;
}
.cost-label {
  display: block;
  font-size: 0.9rem;
  color: #666666;
  margin-bottom: 0.25rem;
}
.cost-value {
  display: block;
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 1.2;
}
.cost-value.total {
  color: #b0356d;
}


/*Small pending orders card*/

.summary-card .card-header span {
  font-size: 1.1rem;
  font-weight: 500;
  color: #555555;
}
.summary-card .metric-value {
  font-size: 3.5rem;
  font-weight: 600;
  color: #b0356d;
  text-align: center;
  line-height: 1.1;
  margin: auto;
}
/* Asegurar que el contenido quede cetrado */


.chart-container, .chart-container-line {
  position: relative;
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
}
.chart-container {
  height: 280px;
  min-height: 250px;
}
.chart-container-line {
  height: 320px;
  min-height: 300px;
}
.alerts-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
/*Alertas de stock bajo */
.low-stock-alerts {
  flex-grow: 1;
  overflow-y: auto; /* Scroll si hay muchas alertas */
  max-height: calc(100% - 60px); /* Limita altura dejando espacio para botón */
  margin-bottom: 1rem; /* Espacio antes del botón */
}
.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0.25rem;
  font-size: 0.9rem;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}
.alert-item:last-child {
  border-bottom: none;
}
.alert-item i {
  font-size: 1.1rem;
  color: #d32f2f;
  margin-top: 2px;
}
.alert-text {
  display: flex;
  flex-direction: column;
}
.alert-text .font-medium {
  font-weight: 600;
}
.alert-text small {
  font-size: 0.8rem;
  color: #666;
}
.no-alerts {
  text-align: center;
  color: #888;
  font-style: italic;
  margin: auto;
}
.alerts-content .p-button-sm {
  width: 100%;
}
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
/* Estilos :deep() para gráficos */
:deep(.p-chart .p-chart-legend li span) { color: #333333 !important; }
:deep(.p-chart .p-chart-legend li) { color: #333333 !important; }
:deep(.p-chart .p-chart-axis-x > div) { color: #555555 !important; }
:deep(.p-chart .p-chart-axis-y > div) { color: #555555 !important; }
:deep(.p-chart .p-chart-grid-horizontal > line) { stroke: #e0e0e0 !important; }
:deep(.p-chart .p-chart-grid-vertical > line) { stroke: #e0e0e0 !important; }

</style>