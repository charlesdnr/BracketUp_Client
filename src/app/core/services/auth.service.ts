import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, TokenVerifyResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  private readonly TOKEN_KEY = 'brackup_token';

  // Signals
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly isLoadingSignal = signal<boolean>(false);

  // Computed
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');
  readonly isModerator = computed(() => {
    const role = this.currentUserSignal()?.role;
    return role === 'admin' || role === 'moderator';
  });

  constructor() {
    // L'initialisation est maintenant gérée par APP_INITIALIZER dans app.config.ts
  }

  /**
   * Récupérer le token depuis le localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Sauvegarder le token dans le localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Supprimer le token du localStorage
   */
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Rediriger vers Discord OAuth2
   */
  loginWithDiscord(): void {
    window.location.href = `${this.apiUrl}/auth/discord`;
  }

  /**
   * Gérer le callback après authentification Discord
   */
  async handleAuthCallback(token: string): Promise<void> {
    this.setToken(token);
    await this.verifyToken();
    await this.router.navigate(['/']);
  }

  /**
   * Vérifier la validité du token
   */
  async verifyToken(): Promise<boolean> {
    try {
      this.isLoadingSignal.set(true);
      const response = await firstValueFrom(
        this.http.post<TokenVerifyResponse>(`${this.apiUrl}/auth/verify`, {})
      );

      if (response.valid && response.user) {
        this.currentUserSignal.set(response.user);
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      this.logout();
      return false;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      this.isLoadingSignal.set(true);
      const user = await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/auth/me`)
      );
      this.currentUserSignal.set(user);
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/auth/logout`, {})
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
      this.currentUserSignal.set(null);
      await this.router.navigate(['/']);
    }
  }

  /**
   * Rafraîchir les données de l'utilisateur
   */
  async refreshUser(): Promise<void> {
    await this.getCurrentUser();
  }
}