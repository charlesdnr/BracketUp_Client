import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Tenter de vérifier le token si présent
  const token = authService.getToken();
  if (token) {
    const isValid = await authService.verifyToken();
    if (isValid) {
      return true;
    }
  }

  // Rediriger vers la page de login
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};