import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'event-manager', loadChildren: () => import('./event-manager/event-manager-module').then(m => m.EventManagerModule) },
  { path: '**', redirectTo: 'event-manager'}
];
