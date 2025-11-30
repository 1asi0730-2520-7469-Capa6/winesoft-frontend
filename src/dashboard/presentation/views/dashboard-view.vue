<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useDashboardStore } from '../../application/dashboard.store.js';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import jsPDF from 'jspdf';
import { subDays, startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

const { t } = useI18n();
const store = useDashboardStore();
const { data: dashboardData, dataLoaded, errors } = storeToRefs(store);
const { fetchDashboardData } = store;
const router = useRouter();

// --- ESTADO DEL FILTRO DE FECHAS ---
const popoverRef = ref();
const selectedDates = ref([]);
const selectedPreset = ref('last30d');

const initializeDates = () => {
  const endDate = new Date();
  const startDate = subDays(endDate, 29);
  selectedDates.value = [startDate, endDate];
};
initializeDates();

const dateRangeDisplay = computed(() => {
  if (!selectedDates.value || selectedDates.value.length < 2 || !selectedDates.value[0] || !selectedDates.value[1]) {
    return t('dashboard.rangeSelect'); // Nueva clave i18n
  }
  const start = format(selectedDates.value[0], 'dd/MM/yyyy');
  const end = format(selectedDates.value[1], 'dd/MM/yyyy');
  return `${start} - ${end}`;
});

// Predefined options for the panel
const presetRanges = computed(() => [
  { label: t('dashboard.rangeToday'), value: 'today' },
  { label: t('dashboard.rangeYesterday'), value: 'yesterday' },
  { label: t('dashboard.rangeLast7D'), value: 'last7d' },
  { label: t('dashboard.rangeLast30D'), value: 'last30d' },
  { label: t('dashboard.rangeThisMonth'), value: 'thisMonth' },
  { label: t('dashboard.rangeLastMonth'), value: 'lastMonth' },
  { label: t('dashboard.rangeCustom'), value: 'custom' },
]);

// Function to apply the filter
const applyFilter = (hidePopover = true) => {
  if (hidePopover) {
    popoverRef.value?.hide();
  }
  if (selectedDates.value && selectedDates.value.length === 2 && selectedDates.value[0] && selectedDates.value[1]) {
    console.log("Aplicando filtro:", selectedDates.value[0], selectedDates.value[1]);
    fetchDashboardData(selectedDates.value[0], selectedDates.value[1]);
  } else {
    console.warn("Attempt to apply filter with invalid dates.");
  }
};

// Function for managing preset selection
const selectPreset = (presetValue) => {
  selectedPreset.value = presetValue;
  const today = new Date();
  let start, end = today;

  switch (presetValue) {
    case 'today':
      start = today; end = today; break;
    case 'yesterday':
      start = subDays(today, 1); end = start; break;
    case 'last7d':
      start = subDays(today, 6); break;
    case 'last30d':
      start = subDays(today, 29); break;
    case 'thisMonth':
      start = startOfMonth(today); end = endOfMonth(today); break;
    case 'lastMonth':
      const startOfThisMonth = startOfMonth(today);
      start = startOfMonth(subMonths(startOfThisMonth, 1));
      end = endOfMonth(start); break;
    case 'custom':
      return; // No filter applies, wait for the 'Apply' button
    default:
      start = subDays(today, 29); break;
  }
  selectedDates.value = [start, end];
  applyFilter(); // Applies directly to presets
};

onMounted(() => {
  // Initial load with default dates
  applyFilter(false);
});

//Colores
const colorRojoEscaso = '#b0356d';
const colorNormal = '#6b1f43';

//Computed Properties for Graphics and Cards

const supplyChartData = computed(() => {
  const levels = dashboardData.value?.supplyLevels || [];
  const labels = levels.map(s => s.name);
  const data = levels.map(s => s.current);
  const backgroundColors = levels.map(s =>
      s.current < s.minStock ? colorRojoEscaso : colorNormal
  );
  return {
    labels: labels,
    datasets: [ { label: t('dashboard.supplyStock'), data: data, backgroundColor: backgroundColors, borderColor: backgroundColors, borderWidth: 1 } ]
  };
});
const supplyChartOptions = ref({
  responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: {}, y: {} }
});

// Alerts List (Low Stock) - NOT filtered by date
const lowStockSuppliesList = computed(() => {
  return (dashboardData.value?.supplyLevels || []).filter(s => s.current < s.minStock);
});

// Line Chart (Daily Rotation) - filter by date
const rotationChartData = computed(() => {
  const rotation = dashboardData.value?.dailyRotation || [];
  const labels = rotation.map(d =>
      new Date(d.date.replace(/-/g, '/')).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })
  );
  const data = rotation.map(d => d.movements);
  return {
    labels: labels,
    datasets: [ {
      label: t('dashboard.dailyMovements'), data: data, fill: 'origin',
      borderColor: colorRojoEscaso, backgroundColor: 'rgba(176, 53, 109, 0.2)', tension: 0
    } ]
  };
});
const rotationChartOptions = ref({
  responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, tooltip: {} }, elements: { point: { radius: 3 } }, scales: { x: {}, y: {} }
});

// Monthly Cost Card - filter by date
const formattedMonthlyCosts = computed(() => {
  const costs = dashboardData.value?.summary?.monthlyCosts;
  if (costs === undefined || costs === null) return 'N/A';
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD' }).format(costs);
});

// Order Table - filtered by date
const ordersData = computed(() => dashboardData.value?.orders || []);

// Button Functions
function generateReport() {
  // Verify that the data is ready and there are no errors.
  if (!dataLoaded.value || errors.value.length > 0) {
    // It displays an alert if it cannot be generated
    alert(t('dashboard.errorGeneratingReport'));
    return;
  }

  // Create the PDF object
  const doc = new jsPDF('p', 'mm', 'a4'); // 'p' = portrait, 'mm' = milímetros, 'a4' = tamaño
  const margin = 15; // Margen de la página
  let currentY = margin; // Posición vertical inicial para escribir

  // Título y Fecha
  doc.setFontSize(18); // Tamaño de fuente grande para el título
  doc.text(t('dashboard.reportGeneratedTitle'), margin, currentY); // Escribe el título
  currentY += 10; // Mueve la posición Y hacia abajo
  doc.setFontSize(10); // Tamaño más pequeño para la fecha
  // Escribe la fecha, usando i18n
  doc.text(t('dashboard.reportGeneratedDate', { date: new Date().toLocaleDateString('es-PE') }), margin, currentY);
  currentY += 15; // Deja espacio

  // Sección Resumen
  doc.setFontSize(14); // Tamaño para subtítulo
  doc.text(t('dashboard.reportSectionSummary'), margin, currentY);
  currentY += 8;
  doc.setFontSize(12); // Tamaño para el contenido del resumen
  // Escribe el total de costos
  doc.text(`${t('dashboard.monthlyTotal')}: ${formattedMonthlyCosts.value}`, margin + 5, currentY);
  currentY += 15;

  // Supply Levels Section
  doc.setFontSize(14);
  doc.text(t('dashboard.supplyLevelsTitle'), margin, currentY);
  currentY += 8;
  doc.setFontSize(10); // Tamaño para la tabla
  // Encabezados de la tabla en negrita
  doc.setFont(undefined, 'bold');
  doc.text(t('dashboard.reportSupplyName'), margin + 5, currentY);
  doc.text(t('dashboard.reportSupplyCurrent'), margin + 80, currentY); // Ajusta posición X si es necesario
  doc.text(t('dashboard.reportSupplyMin'), margin + 110, currentY);
  doc.text(t('dashboard.reportSupplyStatus'), margin + 140, currentY);
  doc.setFont(undefined, 'normal'); // Quita negrita
  currentY += 6; // Espacio antes de los datos

  // Iterate over the supply list to fill the table
  dashboardData.value.supplyLevels.forEach(supply => {
    // If the current line exceeds the page height (minus the margin), create a new page
    if (currentY > (doc.internal.pageSize.height - margin)) {
      doc.addPage();
      currentY = margin; // Reinicia Y al margen superior
    }
    const isLow = supply.current < supply.minStock; // Verifica si el stock es bajo
    if (isLow) {
      doc.setTextColor(176, 53, 109); // Pone el texto en color vino si está bajo
    }
    // Escribe los datos de cada suministro
    doc.text(supply.name, margin + 5, currentY);
    doc.text(String(supply.current), margin + 80, currentY);
    doc.text(String(supply.minStock), margin + 110, currentY);
    doc.text(isLow ? t('dashboard.reportStatusLow') : t('dashboard.reportStatusOK'), margin + 140, currentY);
    if (isLow) {
      doc.setTextColor(0, 0, 0); // Vuelve a poner el texto en negro
    }
    currentY += 6; // Mueve Y para la siguiente línea
  });
  currentY += 10; // Espacio después de la tabla

  // Daily Rotation Section
  // Check if there is enough space for this section; if not, start a new page.
  if (currentY > (doc.internal.pageSize.height - margin - 30)) { // -30 para título + algo de tabla
    doc.addPage();
    currentY = margin;
  }
  doc.setFontSize(14);
  doc.text(t('dashboard.dailyRotationTitle'), margin, currentY);
  currentY += 8;
  doc.setFontSize(10);
  // Encabezados de la tabla
  doc.setFont(undefined, 'bold');
  doc.text(t('dashboard.reportDate'), margin + 5, currentY);
  doc.text(t('dashboard.reportMovements'), margin + 50, currentY);
  doc.setFont(undefined, 'normal');
  currentY += 6;

  // Iterate over the daily rotation list
  dashboardData.value.dailyRotation.forEach(rotation => {
    // Salto de página si es necesario
    if (currentY > (doc.internal.pageSize.height - margin)) {
      doc.addPage();
      currentY = margin;
    }
    // Format the date
    const formattedDate = new Date(rotation.date.replace(/-/g, '/')).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    // Escribe los datos
    doc.text(formattedDate, margin + 5, currentY);
    doc.text(String(rotation.movements), margin + 50, currentY);
    currentY += 6;
  });

  // Save the PDF
  const fileName = `Reporte_Dashboard_WineSoft_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName); // Download the generated PDF file
}


function goToRequestSupplies() {
  alert('Redirigiendo a la solicitud de insumos (placeholder)...');
}

// Helpers Tabla Órdenes
function getStatusSeverity(status) {
  switch (status?.toUpperCase()) {
    case 'PENDING': return 'warning';
    case 'SHIPPED': return 'info';
    case 'DELIVERED': return 'success';
    case 'CANCELLED': return 'danger';
    default: return 'secondary';
  }
}
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return dateString; }
}

</script>

<template>
  <div class="p-4 dashboard-layout">
    <div class="dashboard-header">
      <h1>{{ t('dashboard.title') }}</h1>
      <div class="header-controls">

        <pv-button
            :label="dateRangeDisplay"
            icon="pi pi-calendar"
            class="p-button-outlined p-button-secondary p-button-sm mr-2"
            @click="(event) => popoverRef.toggle(event)"
        />

        <pv-popover ref="popoverRef" appendTo="body" :style="{width: '450px'}">
          <div class="date-filter-panel grid grid-gutter">
            <div class="col-4 preset-list pr-2">
              <pv-button
                  v-for="range in presetRanges"
                  :key="range.value"
                  :label="range.label"
                  :class="['p-button-text', 'p-button-sm', 'w-full', 'text-left', 'mb-1', {'preset-active': selectedPreset === range.value}]"
                  @click="selectPreset(range.value)"
              />
            </div>
            <div class="col-8 calendar-container p-fluid pl-2">
              <label for="daterange">{{ t('dashboard.rangeCustomLabel') }}</label>
              <pv-date-picker
                  v-model="selectedDates"
                  selectionMode="range"
                  :manualInput="false"
                  dateFormat="dd/mm/yy"
                  showIcon
                  inline
                  :disabled="selectedPreset !== 'custom'"
                  class="mt-2"
                  inputId="daterange"
                  @update:modelValue="selectedPreset = 'custom'"
              />
              <div class="flex justify-content-end mt-3">
                <pv-button
                    :label="t('dashboard.applyFilter')"
                    icon="pi pi-check"
                    class="p-button-sm"
                    @click="applyFilter(true)"
                    :disabled="selectedPreset !== 'custom' || !selectedDates || selectedDates.length < 2 || !selectedDates[0] || !selectedDates[1]"
                />
              </div>
            </div>
          </div>
        </pv-popover>

        <pv-button
            :label="t('dashboard.generateReport')"
            icon="pi pi-file-pdf"
            severity="secondary"
            @click="generateReport"
            :disabled="!dataLoaded || errors.length > 0"
            class="p-button-sm"
        />
      </div>
    </div>

    <div v-if="!dataLoaded" class="col-span-12 loading-message">
      <pv-spinner style="width: 50px; height: 50px" strokeWidth="8" />
      <p>{{ t('dashboard.loading') }}</p>
    </div>

    <div v-if="dataLoaded && errors.length" class="col-span-12 text-red-500 mb-4 p-error p-3 border-round">
      Error loading dashboard: {{ errors.map(e => e.message).join(', ') }}
    </div>

    <div class="dashboard-grid" v-if="dataLoaded && errors.length === 0">

      <pv-card class="dashboard-card col-span-12">
        <template #title>
          <div class="card-header">
            <span>{{ t('dashboard.dailyRotationTitle') }}</span>
            <div class="card-controls"> <i class="pi pi-arrows-alt"></i> <i class="pi pi-window-minimize"></i> <i class="pi pi-window-maximize"></i> </div>
          </div>
        </template>
        <template #content>
          <div class="chart-container-line">
            <pv-chart type="line" :data="rotationChartData" :options="rotationChartOptions" />
          </div>
        </template>
      </pv-card>

      <pv-card class="dashboard-card col-span-12">
        <template #title>
          <div class="card-header">
            <span>{{ t('dashboard.monthlyCostsTitle') }}</span>
            <div class="card-controls"> <i class="pi pi-arrows-alt"></i> <i class="pi pi-window-minimize"></i> <i class="pi pi-window-maximize"></i> </div>
          </div>
        </template>
        <template #content>
          <div class="costs-summary single-cost">
            <div class="cost-item">
              <span class="cost-label">{{ t('dashboard.monthlyTotal') }} ({{ dateRangeDisplay }})</span>
              <span class="cost-value total">{{ formattedMonthlyCosts }}</span>
            </div>
          </div>
        </template>
      </pv-card>

      <pv-card class="dashboard-card col-span-12">
        <template #title>
          <div class="card-header">
            <span>{{ t('dashboard.ordersTitle') }}</span>
            <div class="card-controls"> <i class="pi pi-arrows-alt"></i> <i class="pi pi-window-minimize"></i> <i class="pi pi-window-maximize"></i> </div>
          </div>
        </template>
        <template #content>
          <pv-data-table :value="ordersData" responsiveLayout="scroll" stripedRows :paginator="ordersData.length > 5" :rows="5" size="small">
            <pv-column field="id" :header="t('dashboard.orderId')" sortable style="width: 20%"></pv-column>
            <pv-column field="status" :header="t('dashboard.orderStatus')" sortable style="width: 25%">
              <template #body="slotProps">
                <pv-tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.status"></pv-tag>
              </template>
            </pv-column>
            <pv-column field="orderDate" :header="t('dashboard.orderDate')" sortable style="width: 30%">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.orderDate) }}
              </template>
            </pv-column>
            <pv-column field="productId" :header="t('dashboard.orderProductId')" style="width: 15%"></pv-column>
            <pv-column field="quantity" :header="t('dashboard.orderQuantity')" style="width: 10%"></pv-column>
          </pv-data-table>
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
          <div class="chart-container">
            <pv-chart type="bar" :data="supplyChartData" :options="supplyChartOptions" />
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
          <div class="alerts-content">
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

    </div> </div> </template>

<style scoped>

.dashboard-layout {
  min-height: calc(100vh - 60px);
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}
.dashboard-header h1 {
  color: #333333;
  font-size: 2rem;
  margin: 0;
  flex-grow: 1;
}
.header-controls {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.loading-message {
  color: #555;
  font-size: 1.2rem;
  text-align: center;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  padding-bottom: 2rem;
}
.date-filter-panel {
  border: none;
}
.preset-list {
  border-right: 1px solid var(--surface-d);
}
.preset-list .p-button-text {
  justify-content: flex-start;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  color: var(--text-color);
  width: 100%;
  text-align: left;
}
.preset-list .p-button-text:hover {
  background-color: var(--surface-hover);
}
.preset-list .preset-active {
  background-color: color-mix(in srgb, var(--primary-color) 15%, transparent);
  color: var(--primary-color);
  font-weight: 600;
}
.calendar-container {
  padding-left: 0.75rem;
}
.calendar-container label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  display: block;
  margin-bottom: 0.5rem;
}
:deep(.p-datepicker-inline) {
  width: 100%;
}
.col-span-12 { grid-column: span 12; }
@media (min-width: 768px) {
  .md\:col-span-3 { grid-column: span 3; }
  .md\:col-span-4 { grid-column: span 4; }
  .md\:col-span-8 { grid-column: span 8; }
  .md\:col-span-9 { grid-column: span 9; }
}
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
  min-height: 0;
}
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
  color: #b0356d;
}
.costs-summary.single-cost {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  flex-grow: 1;
}
.cost-item {
  text-align: center;
}
.cost-label {
  display: block;
  font-size: 1rem;
  color: #666666;
  margin-bottom: 0.5rem;
}
.cost-value {
  display: block;
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 1.2;
}
.cost-value.total {
  color: #b0356d;
}
.chart-container, .chart-container-line {
  position: relative;
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  min-height: 250px;
}
.chart-container { height: 280px; }
.chart-container-line { height: 350px; }
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.5rem 0.75rem;
}
:deep(.p-datatable .p-tag) {
  font-size: 0.75rem;
  padding: 0.15rem 0.3rem;
}
.alerts-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.low-stock-alerts {
  flex-grow: 1;
  overflow-y: auto;
  max-height: calc(100% - 60px);
  margin-bottom: 1rem;
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
  min-height: 150px;
  flex-grow: 1;
}
:deep(.p-chart .p-chart-legend li span) { color: #333333 !important; }
:deep(.p-chart .p-chart-legend li) { color: #333333 !important; }
:deep(.p-chart .p-chart-axis-x > div) { color: #555555 !important; }
:deep(.p-chart .p-chart-axis-y > div) { color: #555555 !important; }
:deep(.p-chart .p-chart-grid-horizontal > line) { stroke: #e0e0e0 !important; }
:deep(.p-chart .p-chart-grid-vertical > line) { stroke: #e0e0e0 !important; }
</style>