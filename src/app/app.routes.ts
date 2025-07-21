import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ApiTestComponent } from './components/api-test/api-test.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'api-test', component: ApiTestComponent },
  { path: '**', redirectTo: '' },
];
