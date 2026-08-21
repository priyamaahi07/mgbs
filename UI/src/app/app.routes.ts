import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Billing } from './components/billing/billing';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Dashboard
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'billing',
        component: Billing
    }
];
