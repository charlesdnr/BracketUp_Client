import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeamService, GameService, AuthService } from '../../../../core/services';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="team-list-page">
      <div class="container">
        <div class="header">
          <h1>Équipes</h1>
          @if (authService.isAuthenticated()) {
            <button routerLink="/teams/create" class="btn-primary">
              Créer une équipe
            </button>
          }
        </div>

        <!-- Filters -->
        <div class="filters">
          <select [(ngModel)]="selectedGame" (change)="onFilterChange()" class="filter-select">
            <option value="">Tous les jeux</option>
            @for (game of gameService.games(); track game.id) {
              <option [value]="game.id">{{ game.name }}</option>
            }
          </select>

          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onFilterChange()"
            placeholder="Rechercher une équipe..."
            class="search-input" />
        </div>

        <!-- Loading -->
        @if (teamService.isLoading()) {
          <div class="loading">Chargement...</div>
        }

        <!-- Teams Grid -->
        @if (!teamService.isLoading()) {
          <div class="teams-grid">
            @for (team of filteredTeams(); track team.id) {
              <div class="team-card" [routerLink]="['/teams', team.id]">
                @if (team.logoUrl) {
                  <img [src]="team.logoUrl" [alt]="team.name" class="team-logo" />
                } @else {
                  <div class="team-logo-placeholder">{{ team.name.charAt(0) }}</div>
                }

                <div class="team-content">
                  <div class="team-header">
                    <h2>{{ team.name }}</h2>
                    @if (team.tag) {
                      <span class="team-tag">[{{ team.tag }}]</span>
                    }
                  </div>

                  @if (team.game) {
                    <div class="game-info">
                      @if (team.game.iconUrl) {
                        <img [src]="team.game.iconUrl" [alt]="team.game.name" />
                      }
                      <span>{{ team.game.name }}</span>
                    </div>
                  }

                  @if (team.captain) {
                    <div class="captain-info">
                      <span class="label">Capitaine:</span>
                      <span>{{ team.captain.discordUsername }}</span>
                    </div>
                  }

                  @if (team.members) {
                    <div class="members-count">
                      {{ team.members.length }} membre{{ team.members.length > 1 ? 's' : '' }}
                    </div>
                  }
                </div>
              </div>
            } @empty {
              <div class="empty-state">
                <p>Aucune équipe trouvée</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .team-list-page {
      padding: 2rem 0;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 2.5rem;
      color: #333;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .filter-select, .search-input {
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      background: white;
    }

    .filter-select {
      cursor: pointer;
    }

    .search-input {
      flex: 1;
      max-width: 400px;
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
      transform: translateY(-2px);
    }

    .loading, .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .team-card {
      background: white;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }

    .team-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .team-logo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 1.5rem;
    }

    .team-logo-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
    }

    .team-content {
      text-align: center;
      width: 100%;
    }

    .team-header {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .team-header h2 {
      font-size: 1.5rem;
      color: #333;
      margin: 0;
    }

    .team-tag {
      color: #667eea;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .game-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: #666;
    }

    .game-info img {
      width: 24px;
      height: 24px;
      border-radius: 0.25rem;
    }

    .captain-info {
      margin-bottom: 1rem;
      color: #666;
    }

    .captain-info .label {
      font-weight: 600;
      margin-right: 0.25rem;
    }

    .members-count {
      color: #999;
      font-size: 0.875rem;
    }
  `]
})
export class TeamListComponent implements OnInit {
  protected readonly teamService = inject(TeamService);
  protected readonly gameService = inject(GameService);
  protected readonly authService = inject(AuthService);

  protected readonly selectedGame = signal<string>('');
  protected readonly searchQuery = signal<string>('');

  protected readonly filteredTeams = computed(() => {
    let teams = this.teamService.teams();

    if (this.selectedGame()) {
      teams = teams.filter(t => t.gameId === this.selectedGame());
    }

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      teams = teams.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.tag?.toLowerCase().includes(query)
      );
    }

    return teams;
  });

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.teamService.getAllTeams(true),
      this.gameService.getAllGames(true)
    ]);
  }

  onFilterChange(): void {
    // Filtrage géré par computed signal
  }
}