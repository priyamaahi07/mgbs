import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(c => c.Login)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then((c => c.Dashboard))
    },
    {
        path: 'billing',
        loadComponent: () => import('./components/billing/billing').then((c => c.Billing))
    },
    {
        path: 'stocks',
        loadComponent: () => import('./components/stocks/stocks').then((c => c.Stocks))
    },
    {
        path: 'products',
        loadComponent: () => import('./components/products/products').then((c => c.Products))
    },
];
