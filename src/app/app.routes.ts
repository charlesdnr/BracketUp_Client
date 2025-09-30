import { Routes } from '@angular/router';
import { authGuard, adminGuard, moderatorGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/success',
    loadComponent: () =>
      import('./features/auth/pages/callback/callback.component').then(m => m.CallbackComponent)
  },
  {
    path: 'tournaments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tournaments/pages/tournament-list/tournament-list.component').then(m => m.TournamentListComponent)
  },
  {
    path: 'tournaments/create',
    canActivate: [moderatorGuard],
    loadComponent: () =>
      import('./features/tournaments/pages/tournament-create/tournament-create.component').then(m => m.TournamentCreateComponent)
  },
  {
    path: 'tournaments/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tournaments/pages/tournament-detail/tournament-detail.component').then(m => m.TournamentDetailComponent)
  },
  {
    path: 'teams',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/teams/pages/team-list/team-list.component').then(m => m.TeamListComponent)
  },
  {
    path: 'teams/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/teams/pages/team-detail/team-detail.component').then(m => m.TeamDetailComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
