import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './components/dashboard/dashboard';

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
];
