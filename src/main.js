import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import i18n from "./i18n.js";
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import { definePreset } from '@primeuix/themes';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import {
    Button, Calendar,
    Card,
    Checkbox,
    Column,
    ConfirmationService,
    ConfirmDialog, DataTable, Dialog,
    DialogService, Drawer, FileUpload, FloatLabel, IconField, InputIcon, InputNumber, InputText, Menu,
    Rating, Row, Select, SelectButton, Tag, Textarea, Toast,
    ToastService, Toolbar, Tooltip
} from "primevue";
import router from "./router.js";
import pinia from "./pinia.js";

const WineSoftPreset = definePreset(Material, {
    semantic: {
        primary: {
            50:  '#f9ebf1',
            100: '#f2d6e3',
            200: '#e6adc7',
            300: '#d986aa',
            400: '#c85d8c',
            500: '#b0356d',   // tono principal vino
            600: '#8d2958',
            700: '#6b1f43',
            800: '#49152e',
            900: '#270a19'
        },
        surface: {
            0:   '#121212', // fondo general oscuro
            50:  '#1C1C1C',
            100: '#222222',
            200: '#2C2C2C'
        }
    },
    colorScheme: {
        dark: {
            surface: '#121212',
            textColor: '#EDEDED',
            primaryColor: '#b0356d',
            primaryColorText: '#ffffff'
        }
    }
});

createApp(App)
    .use(PrimeVue, {
        theme: {
            preset: WineSoftPreset,
            options: {
                darkModeSelector: '.dark' // opcional
            }
        }
    })
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-calendar', Calendar)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-checkbox', Checkbox)
    .component('pv-data-table', DataTable)
    .component('pv-dialog', Dialog)
    .component('pv-select', Select)
    .component('pv-select-button', SelectButton)
    .component('pv-file-upload', FileUpload)
    .component('pv-float-label', FloatLabel)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-text', InputText)
    .component('pv-input-number', InputNumber)
    .component('pv-menu', Menu)
    .component('pv-rating', Rating)
    .component('pv-row', Row)
    .component('pv-drawer', Drawer)
    .component('pv-tag', Tag)
    .component('pv-textarea', Textarea)
    .component('pv-toolbar', Toolbar)
    .component('pv-toast', Toast)
    .directive('tooltip', Tooltip)
    .use(i18n)
    .use(router)
    .use(pinia)
    .mount('#app')
