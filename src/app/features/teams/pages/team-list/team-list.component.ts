import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeamService, GameService, AuthService } from '../../../../core/services';
import { HeaderComponent, FooterComponent } from '../../../../shared/components';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent, FooterComponent, SelectModule],
  template: `
    <div class="team-list-page">
      <app-header></app-header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="container hero-content">
          <h1 class="hero-title">Toutes les <span class="gradient-text">Équipes</span></h1>
          <p class="hero-subtitle">Rejoignez ou créez votre équipe et participez aux tournois</p>
          @if (authService.isAuthenticated()) {
            <button (click)="navigateToCreate()" class="btn-create-hero">
              <i class="pi pi-plus"></i>
              <span>Créer une équipe</span>
            </button>
          }
        </div>
      </section>

      <div class="container">
        <!-- Search Bar -->
        <div class="search-section">
          <div class="search-bar">
            <i class="pi pi-search search-icon"></i>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()"
              placeholder="🔍 Rechercher une équipe par nom ou tag..."
              class="search-input" />
          </div>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <h2>Filtrer les équipes</h2>
          <div class="filters">
            <div class="filter-group">
              <label>Jeu</label>
              <p-select
                [(ngModel)]="selectedGame"
                [options]="gameOptions()"
                placeholder="Tous les jeux"
                [filter]="true"
                filterPlaceholder="Rechercher un jeu..."
                styleClass="custom-select"
                [showClear]="true" />
            </div>
          </div>
        </div>

        <!-- Loading -->
        @if (teamService.isLoading()) {
          <div class="loading">
            <i class="pi pi-spinner pi-spin"></i>
            <p>Chargement des équipes...</p>
          </div>
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
                    <h3>{{ team.name }}</h3>
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
                      <i class="pi pi-users"></i>
                      {{ team.members.length }} membre{{ team.members.length > 1 ? 's' : '' }}
                    </div>
                  }
                </div>
              </div>
            } @empty {
              <div class="empty-state">
                <i class="pi pi-users"></i>
                <h3>Aucune équipe trouvée</h3>
                <p>Aucune équipe ne correspond à vos critères de recherche</p>
                @if (authService.isAuthenticated()) {
                  <button (click)="navigateToCreate()" class="btn-primary">
                    Créer la première équipe
                  </button>
                }
              </div>
            }
          </div>
        }
      </div>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .team-list-page {
      min-height: 100vh;
      background: var(--background-color);
    }

    /* Hero Section */
    .hero {
      position: relative;
      min-height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: calc(var(--padding) * 8) var(--padding) calc(var(--padding) * 4) var(--padding);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      animation: pulse 8s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(1px);
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 1200px;
    }

    .hero-title {
      font-size: 4.5rem;
      font-weight: 900;
      color: white;
      margin: 0 0 calc(var(--padding) * 1.5) 0;
      letter-spacing: -2px;
      text-shadow:
        0 4px 8px rgba(0, 0, 0, 0.3),
        0 8px 16px rgba(0, 0, 0, 0.2),
        0 0 40px rgba(255, 255, 255, 0.2);
      animation: fadeInUp 0.8s ease-out;
    }

    .gradient-text {
      background: linear-gradient(135deg, #fff 0%, #a8edea 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    }

    .hero-subtitle {
      font-size: 1.5rem;
      color: rgba(255, 255, 255, 0.95);
      margin: 0 0 calc(var(--padding) * 2.5) 0;
      font-weight: 500;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .btn-create-hero {
      padding: calc(var(--padding) * 1.25) calc(var(--padding) * 3);
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      color: white;
      border: 3px solid rgba(255, 255, 255, 0.4);
      border-radius: 50px;
      font-size: 1.125rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.25),
        0 0 30px rgba(255, 255, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      animation: fadeInUp 0.8s ease-out 0.4s both;
      display: inline-flex;
      align-items: center;
      gap: var(--gap);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .btn-create-hero:hover {
      background: rgba(255, 255, 255, 0.35);
      border-color: rgba(255, 255, 255, 0.6);
      transform: translateY(-3px);
      box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.35),
        0 0 40px rgba(255, 255, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .btn-create-hero:active {
      transform: translateY(-1px);
    }

    /* Container */
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 calc(var(--padding) * 2);
    }

    /* Search Section */
    .search-section {
      margin: calc(var(--padding) * 3) 0;
      animation: fadeInUp 0.8s ease-out 0.3s both;
    }

    .search-bar {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }

    .search-icon {
      position: absolute;
      left: calc(var(--padding) * 1.25);
      top: 50%;
      transform: translateY(-50%);
      color: var(--primary-color);
      font-size: 1.25rem;
      pointer-events: none;
      z-index: 1;
    }

    .search-input {
      width: 100%;
      padding: calc(var(--padding) * 1.25) calc(var(--padding) * 2);
      padding-left: calc(var(--padding) * 3.5);
      border: 3px solid var(--border-color);
      border-radius: 50px;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a1a1a;
      background: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .search-input::placeholder {
      color: #888;
      font-weight: 500;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1), 0 8px 24px rgba(0, 102, 204, 0.15);
      transform: translateY(-2px);
    }

    /* Filters Section */
    .filters-section {
      background: var(--container-color);
      border-radius: 24px;
      padding: calc(var(--padding) * 2);
      margin-bottom: calc(var(--padding) * 3);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .filters-section h2 {
      font-size: 1.75rem;
      color: var(--font-color);
      margin: 0 0 calc(var(--padding) * 1.5) 0;
      font-weight: 800;
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: calc(var(--padding) * 1.5);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: calc(var(--gap) * 0.75);
    }

    .filter-group label {
      font-weight: 700;
      color: var(--font-color);
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* PrimeNG Select Styling */
    ::ng-deep {
      .p-inputicon {
        top: 38%;
      }
    }

    :host ::ng-deep .custom-select.p-select {
      width: 100%;
      border-radius: 16px;
      border: 2px solid var(--border-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    :host ::ng-deep .custom-select.p-select:hover {
      border-color: var(--primary-color);
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
    }

    :host ::ng-deep .custom-select.p-select.p-focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
    }

    :host ::ng-deep .custom-select.p-select .p-select-label {
      padding: calc(var(--gap) * 0.85) calc(var(--padding) * 1.25);
      font-weight: 600;
      color: #1a1a1a !important;
    }

    :host ::ng-deep .custom-select .p-select-label.p-placeholder {
      color: #666666 !important;
      opacity: 1;
      font-weight: 500;
    }

    :host ::ng-deep .p-select-overlay {
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      border: 2px solid var(--border-color);
      margin-top: calc(var(--gap) / 2);
    }

    :host ::ng-deep .p-select-overlay .p-select-filter-container {
      padding: var(--padding);
      border-bottom: 2px solid var(--border-color);
      background: #f8f9fa;
    }

    :host ::ng-deep .p-select-overlay .p-select-filter-input {
      border-radius: 12px;
      border: 2px solid var(--border-color);
      padding: calc(var(--gap) * 0.75) var(--padding);
      padding-left: calc(var(--padding) * 2.5);
      color: #1a1a1a !important;
      background: white;
      width: 100%;
      font-weight: 500;
    }

    :host ::ng-deep .p-select-overlay .p-select-option {
      padding: calc(var(--gap) * 0.85) calc(var(--padding) * 1.25);
      transition: all 0.2s;
      cursor: pointer;
      color: var(--font-color) !important;
      font-weight: 500;
    }

    :host ::ng-deep .p-select-overlay .p-select-option:hover {
      background: #f0f7ff;
      color: var(--primary-color) !important;
    }

    :host ::ng-deep .p-select-overlay .p-select-option.p-select-option-selected {
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      color: white !important;
      font-weight: 700;
    }

    /* Loading */
    .loading {
      text-align: center;
      padding: calc(var(--padding) * 4);
      color: var(--font-secondary-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--padding);
    }

    .loading i {
      font-size: 3rem;
      color: var(--primary-color);
    }

    .loading p {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }

    /* Teams Grid */
    .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: calc(var(--padding) * 1.5);
      margin-bottom: calc(var(--padding) * 4);
      animation: fadeInUp 0.8s ease-out 0.5s both;
    }

    .team-card {
      background: var(--container-color);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: calc(var(--padding) * 2);
      border: 2px solid transparent;
    }

    .team-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-color);
    }

    .team-logo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: calc(var(--padding) * 1.5);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .team-card:hover .team-logo {
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .team-logo-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.5rem;
      font-weight: bold;
      margin-bottom: calc(var(--padding) * 1.5);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .team-card:hover .team-logo-placeholder {
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .team-content {
      text-align: center;
      width: 100%;
    }

    .team-header {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--gap);
      margin-bottom: calc(var(--padding) * 1.25);
      flex-wrap: wrap;
    }

    .team-header h3 {
      font-size: 1.5rem;
      color: var(--font-color);
      margin: 0;
      font-weight: 800;
    }

    .team-tag {
      color: var(--primary-color);
      font-weight: 700;
      font-size: 1.25rem;
    }

    .game-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--gap);
      margin-bottom: calc(var(--padding) * 1.25);
      color: var(--font-secondary-color);
      padding: calc(var(--gap) * 0.75) var(--padding);
      background: var(--background-color);
      border-radius: 12px;
      font-weight: 600;
    }

    .game-info img {
      width: var(--icons-size);
      height: var(--icons-size);
      border-radius: var(--inner-radius);
    }

    .captain-info {
      margin-bottom: calc(var(--padding) * 1.25);
      color: var(--font-secondary-color);
      font-weight: 500;
    }

    .captain-info .label {
      font-weight: 700;
      margin-right: calc(var(--gap) / 4);
      color: var(--font-color);
    }

    .members-count {
      color: var(--font-secondary-color);
      font-size: 0.95rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: calc(var(--gap) / 2);
    }

    .members-count i {
      color: var(--primary-color);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: calc(var(--padding) * 4);
      background: var(--container-color);
      border-radius: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      animation: fadeInUp 0.8s ease-out 0.5s both;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--padding);
    }

    .empty-state i {
      font-size: 5rem;
      color: var(--primary-color);
      opacity: 0.3;
    }

    .empty-state h3 {
      font-size: 1.75rem;
      color: var(--font-color);
      margin: 0;
      font-weight: 800;
    }

    .empty-state p {
      color: var(--font-secondary-color);
      font-size: 1.125rem;
      margin: 0;
      font-weight: 500;
    }

    .btn-primary {
      padding: calc(var(--padding) * 1.25) calc(var(--padding) * 3);
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      color: white;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-weight: 800;
      font-size: 1.125rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
      margin-top: var(--padding);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 102, 204, 0.4);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero {
        padding: calc(var(--padding) * 6) var(--padding) calc(var(--padding) * 3) var(--padding);
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.125rem;
      }

      .container {
        padding: 0 var(--padding);
      }

      .teams-grid {
        grid-template-columns: 1fr;
      }

      .filters {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamListComponent implements OnInit {
  protected readonly teamService = inject(TeamService);
  protected readonly gameService = inject(GameService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly selectedGame = signal<string>('');
  protected readonly searchQuery = signal<string>('');

  protected readonly gameOptions = computed(() => {
    return this.gameService.games().map(game => ({
      label: game.name,
      value: game.id
    }));
  });

  protected readonly filteredTeams = computed(() => {
    let teams = this.teamService.teams();

    // Filtre par recherche textuelle
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      teams = teams.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.tag?.toLowerCase().includes(query)
      );
    }

    // Filtre par jeu
    if (this.selectedGame()) {
      teams = teams.filter(t => t.gameId === this.selectedGame());
    }

    return teams;
  });

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.teamService.getAllTeams(true),
      this.gameService.getAllGames(true)
    ]);
  }

  onSearchChange(): void {
    // Recherche gérée par computed signal
  }

  async navigateToCreate(): Promise<void> {
    await this.router.navigate(['/teams/create']);
  }
}