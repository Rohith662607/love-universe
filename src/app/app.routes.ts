import { Routes } from '@angular/router';

// The app uses scene-based in-memory navigation via SceneService
// This router handles initial load only
export const routes: Routes = [
  { path: '', redirectTo: 'universe', pathMatch: 'full' },
  {
    path: 'universe',
    loadComponent: () =>
      import('./components/universe-shell/universe-shell.component').then(m => m.UniverseShellComponent)
  },
  { path: '**', redirectTo: 'universe' }
];
