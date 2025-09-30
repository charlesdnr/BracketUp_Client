import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, UserService } from '../../../../core/services';
import { User, UserStats } from '../../../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-page">
      <div class="container">
        @if (isLoading()) {
          <div class="loading">Chargement...</div>
        } @else if (user()) {
          <div class="profile-header">
            <div class="profile-avatar-section">
              @if (user()!.discordAvatar) {
                <img
                  [src]="getAvatarUrl()"
                  [alt]="user()!.discordUsername"
                  class="profile-avatar" />
              } @else {
                <div class="profile-avatar-placeholder">
                  {{ user()!.discordUsername.charAt(0) }}
                </div>
              }
              <div class="profile-info">
                <h1>{{ user()!.discordUsername }}</h1>
                @if (user()!.discordDiscriminator) {
                  <span class="discriminator">#{{ user()!.discordDiscriminator }}</span>
                }
                <span class="role" [class]="'role-' + user()!.role">{{ getRoleLabel(user()!.role) }}</span>
              </div>
            </div>

            <button (click)="logout()" class="btn-danger">Déconnexion</button>
          </div>

          <div class="content-grid">
            <!-- Stats -->
            <div class="main-content">
              @if (stats()) {
                <section class="card">
                  <h2>Statistiques</h2>
                  <div class="stats-grid">
                    <div class="stat-card">
                      <span class="stat-value">{{ stats()!.totalTournaments }}</span>
                      <span class="stat-label">Tournois joués</span>
                    </div>
                    <div class="stat-card">
                      <span class="stat-value">{{ stats()!.wins }}</span>
                      <span class="stat-label">Victoires</span>
                    </div>
                    <div class="stat-card">
                      <span class="stat-value">{{ stats()!.losses }}</span>
                      <span class="stat-label">Défaites</span>
                    </div>
                    <div class="stat-card">
                      <span class="stat-value">{{ stats()!.winRate.toFixed(1) }}%</span>
                      <span class="stat-label">Taux de victoire</span>
                    </div>
                  </div>
                </section>
              }

              <section class="card">
                <h2>Mes Équipes</h2>
                <p class="empty">Vous ne faites partie d'aucune équipe pour le moment</p>
                <button routerLink="/teams/create" class="btn-primary">Créer une équipe</button>
              </section>

              <section class="card">
                <h2>Tournois en cours</h2>
                <p class="empty">Vous ne participez à aucun tournoi actuellement</p>
                <button routerLink="/tournaments" class="btn-primary">Voir les tournois</button>
              </section>

              <section class="card">
                <h2>Historique</h2>
                <p class="empty">Aucun historique pour le moment</p>
              </section>
            </div>

            <!-- Sidebar -->
            <aside class="sidebar">
              <div class="card">
                <h3>Informations</h3>
                <div class="info-list">
                  @if (user()!.email) {
                    <div class="info-item">
                      <span class="label">Email</span>
                      <span class="value">{{ user()!.email }}</span>
                    </div>
                  }
                  <div class="info-item">
                    <span class="label">Rôle</span>
                    <span class="value">{{ getRoleLabel(user()!.role) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Membre depuis</span>
                    <span class="value">{{ formatDate(user()!.createdAt) }}</span>
                  </div>
                  @if (user()!.lastLogin) {
                    <div class="info-item">
                      <span class="label">Dernière connexion</span>
                      <span class="value">{{ formatDate(user()!.lastLogin!) }}</span>
                    </div>
                  }
                </div>
              </div>

              @if (authService.isAdmin()) {
                <div class="card">
                  <h3>Administration</h3>
                  <button routerLink="/admin" class="btn-primary full-width">
                    Panneau d'administration
                  </button>
                </div>
              }
            </aside>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      min-height: 100vh;
      background: #f5f5f5;
      padding: 2rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .profile-header {
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .profile-avatar-section {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
    }

    .profile-avatar-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      font-weight: bold;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    h1 {
      font-size: 2.5rem;
      color: #333;
      margin: 0;
    }

    .discriminator {
      color: #999;
      font-size: 1.25rem;
    }

    .role {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      width: fit-content;
    }

    .role-player {
      background: #e2e3e5;
      color: #383d41;
    }

    .role-admin {
      background: #dc3545;
      color: white;
    }

    .role-moderator {
      background: #ffc107;
      color: #333;
    }

    .btn-primary, .btn-danger {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-primary:hover { background: #5568d3; }
    .btn-danger:hover { background: #c82333; }

    .full-width {
      width: 100%;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    .card {
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .card h2, .card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1.5rem;
      border-radius: 0.5rem;
      text-align: center;
      color: white;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .empty {
      text-align: center;
      color: #999;
      padding: 2rem;
      margin-bottom: 1rem;
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-item .label {
      color: #999;
      font-size: 0.875rem;
    }

    .info-item .value {
      font-weight: 600;
      color: #333;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .profile-header {
        flex-direction: column;
        gap: 2rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  protected readonly user = signal<User | null>(null);
  protected readonly stats = signal<UserStats | null>(null);
  protected readonly isLoading = signal<boolean>(true);

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    try {
      this.isLoading.set(true);
      const currentUser = this.authService.currentUser();

      if (currentUser) {
        this.user.set(currentUser);

        // Charger les stats
        try {
          const stats = await this.userService.getUserStats(currentUser.id);
          this.stats.set(stats);
        } catch (error) {
          console.error('Failed to load stats:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  getAvatarUrl(): string {
    const user = this.user();
    if (!user || !user.discordAvatar) return '';
    // Discord CDN avatar format
    return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png?size=256`;
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      player: 'Joueur',
      admin: 'Administrateur',
      moderator: 'Modérateur'
    };
    return labels[role] || role;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}