import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: AdminLogin },
    { path: 'admin', component: AdminDashboard, canActivate: [adminGuard] },
    { path: '**', redirectTo: '' }
];
