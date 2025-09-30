import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserStats, Role } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/users`;

  private readonly isLoadingSignal = signal<boolean>(false);
  readonly isLoading = this.isLoadingSignal.asReadonly();

  /**
   * Récupérer tous les utilisateurs (admin uniquement)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<User[]>(this.apiUrl)
      );
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Récupérer un utilisateur par son ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/${id}`)
      );
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async getCurrentUserProfile(): Promise<User> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/me`)
      );
    } catch (error) {
      console.error('Failed to fetch current user profile:', error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.put<User>(`${this.apiUrl}/${id}`, data)
      );
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Mettre à jour le rôle d'un utilisateur (admin uniquement)
   */
  async updateUserRole(id: string, role: Role): Promise<User> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.patch<User>(`${this.apiUrl}/${id}/role`, { role })
      );
    } catch (error) {
      console.error(`Failed to update user role ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Supprimer un utilisateur (admin uniquement)
   */
  async deleteUser(id: string): Promise<void> {
    try {
      this.isLoadingSignal.set(true);
      await firstValueFrom(
        this.http.delete<void>(`${this.apiUrl}/${id}`)
      );
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Récupérer les statistiques d'un utilisateur
   */
  async getUserStats(id: string): Promise<UserStats> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<UserStats>(`${this.apiUrl}/${id}/stats`)
      );
    } catch (error) {
      console.error(`Failed to fetch user stats ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }
}