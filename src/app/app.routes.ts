import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/map/components/map/map').then((m) => m.Map) },
  { path: '**', redirectTo: '' },
];
