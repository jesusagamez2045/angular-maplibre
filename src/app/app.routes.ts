import { Routes } from '@angular/router';
import { Map } from './features/map/components/map/map';

export const routes: Routes = [
  { path: '', component: Map },
  { path: '**', redirectTo: '' },
];
