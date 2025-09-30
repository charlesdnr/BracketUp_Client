import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService, GameService, TeamService, TournamentService } from '../../../../core/services';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-dashboard">
      <div class="container">
        <h1>Panneau d'Administration</h1>

        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalUsers() }}</div>
              <div class="stat-label">Utilisateurs</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🎮</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalGames() }}</div>
              <div class="stat-label">Jeux</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">👨‍👩‍👦</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalTeams() }}</div>
              <div class="stat-label">Équipes</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalTournaments() }}</div>
              <div class="stat-label">Tournois</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <section class="card">
          <h2>Actions rapides</h2>
          <div class="actions-grid">
            <button routerLink="/tournaments/create" class="action-btn">
              <span class="action-icon">➕</span>
              <span>Créer un tournoi</span>
            </button>
            <button routerLink="/admin/games" class="action-btn">
              <span class="action-icon">🎮</span>
              <span>Gérer les jeux</span>
            </button>
            <button routerLink="/admin/users" class="action-btn">
              <span class="action-icon">👥</span>
              <span>Gérer les utilisateurs</span>
            </button>
            <button routerLink="/admin/settings" class="action-btn">
              <span class="action-icon">⚙️</span>
              <span>Paramètres</span>
            </button>
          </div>
        </section>

        <div class="content-grid">
          <!-- Recent Tournaments -->
          <section class="card">
            <h2>Tournois récents</h2>
            @if (tournamentService.tournaments().length > 0) {
              <div class="list">
                @for (tournament of tournamentService.tournaments().slice(0, 5); track tournament.id) {
                  <div class="list-item" [routerLink]="['/tournaments', tournament.id]">
                    <div class="item-info">
                      <span class="item-name">{{ tournament.name }}</span>
                      <span class="item-meta">{{ tournament.game?.name }}</span>
                    </div>
                    <span class="item-status" [class]="'status-' + tournament.status">
                      {{ tournament.status }}
                    </span>
                  </div>
                }
              </div>
            } @else {
              <p class="empty">Aucun tournoi</p>
            }
          </section>

          <!-- Recent Teams -->
          <section class="card">
            <h2>Équipes récentes</h2>
            @if (teamService.teams().length > 0) {
              <div class="list">
                @for (team of teamService.teams().slice(0, 5); track team.id) {
                  <div class="list-item" [routerLink]="['/teams', team.id]">
                    <div class="item-info">
                      <span class="item-name">{{ team.name }}</span>
                      <span class="item-meta">{{ team.game?.name }}</span>
                    </div>
                    <span class="item-count">{{ team.members?.length || 0 }} membres</span>
                  </div>
                }
              </div>
            } @else {
              <p class="empty">Aucune équipe</p>
            }
          </section>
        </div>

        <!-- Games Management -->
        <section class="card">
          <h2>Jeux disponibles</h2>
          @if (gameService.games().length > 0) {
            <div class="games-grid">
              @for (game of gameService.games(); track game.id) {
                <div class="game-card">
                  @if (game.iconUrl) {
                    <img [src]="game.iconUrl" [alt]="game.name" class="game-icon" />
                  }
                  <div class="game-info">
                    <span class="game-name">{{ game.name }}</span>
                    <span class="game-size">{{ game.teamSize }}v{{ game.teamSize }}</span>
                  </div>
                  <span class="game-status" [class.active]="game.isActive">
                    {{ game.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                </div>
              }
            </div>
          } @else {
            <p class="empty">Aucun jeu configuré</p>
          }
          <button routerLink="/admin/games/create" class="btn-primary">
            Ajouter un jeu
          </button>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      min-height: 100vh;
      background: #f5f5f5;
      padding: 2rem 0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 1.5rem;
      color: #333;
      margin: 0 0 1.5rem 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      font-size: 3rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #667eea;
    }

    .stat-label {
      color: #666;
      font-size: 0.875rem;
    }

    .card {
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border: 2px solid #e2e3e5;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 1rem;
    }

    .action-btn:hover {
      background: #667eea;
      border-color: #667eea;
      color: white;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 2rem;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .list-item:hover {
      background: #e9ecef;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .item-name {
      font-weight: 600;
      color: #333;
    }

    .item-meta {
      font-size: 0.875rem;
      color: #666;
    }

    .item-status, .item-count {
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .item-status.status-registration {
      background: #d4edda;
      color: #155724;
    }

    .item-status.status-ongoing {
      background: #fff3cd;
      color: #856404;
    }

    .item-status.status-completed {
      background: #cce5ff;
      color: #004085;
    }

    .item-count {
      background: #e9ecef;
      color: #495057;
    }

    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .game-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 0.5rem;
    }

    .game-icon {
      width: 50px;
      height: 50px;
      border-radius: 0.5rem;
      object-fit: cover;
    }

    .game-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .game-name {
      font-weight: 600;
      color: #333;
    }

    .game-size {
      font-size: 0.875rem;
      color: #666;
    }

    .game-status {
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      background: #f8d7da;
      color: #721c24;
    }

    .game-status.active {
      background: #d4edda;
      color: #155724;
    }

    .empty {
      text-align: center;
      color: #999;
      padding: 2rem;
    }

    .btn-primary {
      padding: 0.75rem 2rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      background: #5568d3;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  protected readonly userService = inject(UserService);
  protected readonly gameService = inject(GameService);
  protected readonly teamService = inject(TeamService);
  protected readonly tournamentService = inject(TournamentService);

  protected readonly totalUsers = signal<number>(0);
  protected readonly totalGames = signal<number>(0);
  protected readonly totalTeams = signal<number>(0);
  protected readonly totalTournaments = signal<number>(0);

  async ngOnInit(): Promise<void> {
    await this.loadDashboardData();
  }

  private async loadDashboardData(): Promise<void> {
    try {
      await Promise.all([
        this.loadUsers(),
        this.gameService.getAllGames(true),
        this.teamService.getAllTeams(true),
        this.tournamentService.getAllTournaments(true)
      ]);

      this.totalGames.set(this.gameService.games().length);
      this.totalTeams.set(this.teamService.teams().length);
      this.totalTournaments.set(this.tournamentService.tournaments().length);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }

  private async loadUsers(): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      this.totalUsers.set(users.length);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }
}