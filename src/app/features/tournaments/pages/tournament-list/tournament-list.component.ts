import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TournamentService, GameService, AuthService } from '../../../../core/services';
import { TournamentStatus } from '../../../../core/models';
import { HeaderComponent, FooterComponent, SearchBarComponent, FilterSelectComponent } from '../../../../shared/components';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    CardModule,
    TagModule,
    SkeletonModule,
    HeaderComponent,
    FooterComponent,
    SearchBarComponent,
    FilterSelectComponent
  ],
  template: `
    <div class="tournament-list-page">
      <app-header></app-header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="container hero-content">
          <h1 class="hero-title">Tous les <span class="gradient-text">Tournois</span></h1>
          <p class="hero-subtitle">Découvrez et participez aux compétitions gaming professionnelles</p>
          @if (authService.isModerator()) {
            <button (click)="navigateToCreate()" class="btn-create-hero">
              <i class="pi pi-plus"></i>
              <span>Créer un tournoi</span>
            </button>
          }
        </div>
      </section>

      <div class="container">
        <!-- Search Bar -->
        <app-search-bar
          [value]="searchQuery()"
          (valueChange)="searchQuery.set($event)"
          [placeholder]="'🔍 Rechercher un tournoi par nom...'" />

        <!-- Filters -->
        <div class="filters-section">
          <h2>Filtrer les tournois</h2>
          <div class="filters">
            <app-filter-select
              label="Jeu"
              [value]="selectedGame()"
              (valueChange)="selectedGame.set($event)"
              [options]="gameOptions()"
              placeholder="Tous les jeux"
              filterPlaceholder="Rechercher un jeu..." />

            <app-filter-select
              label="Statut"
              [value]="selectedStatus()"
              (valueChange)="selectedStatus.set($event)"
              [options]="statusOptions"
              placeholder="Tous les statuts"
              filterPlaceholder="Rechercher un statut..." />
          </div>
        </div>

        <!-- Loading -->
        @if (tournamentService.isLoading()) {
          <div class="tournaments-grid">
            @for (i of [1,2,3,4,5,6]; track i) {
              <p-card>
                <p-skeleton width="100%" height="200px" styleClass="mb-3"></p-skeleton>
                <p-skeleton width="80%" height="2rem" styleClass="mb-2"></p-skeleton>
                <p-skeleton width="60%" height="1rem"></p-skeleton>
              </p-card>
            }
          </div>
        }

        <!-- Tournaments Grid -->
        @if (!tournamentService.isLoading()) {
          <div class="tournaments-grid">
            @for (tournament of filteredTournaments(); track tournament.id) {
              <p-card [routerLink]="['/tournaments', tournament.id]" styleClass="tournament-card">
                @if (tournament.bannerUrl) {
                  <ng-template pTemplate="header">
                    <img [src]="tournament.bannerUrl" [alt]="tournament.name" class="tournament-banner" />
                  </ng-template>
                }

                <div class="tournament-header">
                  <h2>{{ tournament.name }}</h2>
                  <p-tag [value]="getStatusLabel(tournament.status)" [severity]="getStatusSeverity(tournament.status)" />
                </div>

                @if (tournament.game) {
                  <div class="game-info">
                    @if (tournament.game.iconUrl) {
                      <img [src]="tournament.game.iconUrl" [alt]="tournament.game.name" class="game-icon" />
                    }
                    <span>{{ tournament.game.name }}</span>
                  </div>
                }

                <div class="tournament-meta">
                  <div class="meta-item">
                    <i class="pi pi-sitemap"></i>
                    <span>{{ tournament.format }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="pi pi-users"></i>
                    <span>{{ tournament._count?.participants || 0 }}/{{ tournament.maxParticipants }}</span>
                  </div>
                  @if (tournament.prizePool) {
                    <div class="meta-item">
                      <i class="pi pi-trophy"></i>
                      <span>{{ tournament.prizePool }}</span>
                    </div>
                  }
                </div>

                @if (tournament.startDate) {
                  <div class="tournament-date">
                    <i class="pi pi-calendar"></i>
                    {{ formatDate(tournament.startDate) }}
                  </div>
                }
              </p-card>
            } @empty {
              <div class="empty-state">
                <i class="pi pi-inbox" style="font-size: 4rem; color: var(--p-text-muted-color);"></i>
                <p>Aucun tournoi trouvé</p>
              </div>
            }
          </div>
        }
      </div>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .tournament-list-page {
      min-height: 100vh;
      background: var(--background-color);
    }

    ::ng-deep {
      .p-inputicon{
        top: 38%;
      }
    }

    .hero {
      position: relative;
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      color: white;
      padding: calc(var(--padding) * 10) 0 calc(var(--padding) * 6) 0;
      text-align: center;
      overflow: hidden;
      margin-top: 0;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      animation: pulse 15s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 30%, rgba(255, 255, 255, 0.03) 70%, transparent 70%),
        linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.03) 30%, rgba(255, 255, 255, 0.03) 70%, transparent 70%);
      background-size: 100px 100px;
      opacity: 0.5;
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .hero-title {
      font-size: 4rem;
      margin-bottom: var(--padding);
      color: white;
      font-weight: 800;
      line-height: 1.1;
      animation: slideUp 0.8s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .gradient-text {
      background: linear-gradient(to right, #ffffff, #e0f0ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: inline-block;
    }

    .hero-subtitle {
      font-size: 1.35rem;
      margin-bottom: calc(var(--padding) * 2);
      color: white;
      opacity: 0.95;
      max-width: 650px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    .btn-create-hero {
      padding: calc(var(--padding) * 1.25) calc(var(--padding) * 2.5);
      border-radius: 50px;
      border: none;
      background: white;
      color: var(--primary-color);
      font-weight: 700;
      font-size: 1.125rem;
      cursor: pointer;
      transition: all var(--transition-duration);
      display: inline-flex;
      align-items: center;
      gap: var(--gap);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .btn-create-hero:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: calc(var(--padding) * 3) var(--padding) var(--padding) var(--padding);
    }

    .filters-section {
      margin-bottom: calc(var(--padding) * 3);
    }

    .filters-section h2 {
      font-size: 2rem;
      color: var(--font-color);
      margin-bottom: var(--padding);
      font-weight: 700;
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: calc(var(--padding) * 1.5);
    }

    :host ::ng-deep .custom-select .p-select-label.p-placeholder {
      color: #666666 !important;
      opacity: 1;
    }

    :host ::ng-deep .custom-select .p-select-dropdown {
      color: var(--primary-color);
    }

    :host ::ng-deep .p-select-overlay .p-select-option {
      padding: calc(var(--gap) * 0.75) var(--padding);
      border-radius: 8px;
      margin: 0 calc(var(--gap) / 2);
      transition: all var(--transition-duration);
      font-weight: 500;
      color: var(--font-color) !important;
    }

    :host ::ng-deep .p-select-overlay {
      border-radius: 16px;
      border: 2px solid var(--primary-color);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      padding: calc(var(--gap) / 2);
    }

    :host ::ng-deep .p-select-overlay .p-select-filter {
      padding: var(--gap);
      padding-bottom: calc(var(--gap) / 2);
    }

    :host ::ng-deep .p-select-overlay .p-select-filter-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    :host ::ng-deep .p-select-overlay .p-select-filter-icon {
      position: absolute;
      left: calc(var(--padding) * 0.75);
      color: var(--primary-color);
      font-size: 1rem;
      pointer-events: none;
    }

    :host ::ng-deep .p-select-overlay .p-select-filter-input {
      border-radius: 12px;
      border: 2px solid var(--border-color);
      padding: calc(var(--gap) * 0.75) var(--padding);
      padding-left: calc(var(--padding) * 2.5);
      font-size: 0.95rem;
      transition: all var(--transition-duration);
      color: #1a1a1a !important;
      background: white;
      width: 100%;
    }

    :host ::ng-deep .p-select-overlay .p-select-filter-input::placeholder {
      color: #666666 !important;
      opacity: 1;
    }

    :host ::ng-deep .p-select-overlay .p-select-filter-input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
      outline: none;
    }

    :host ::ng-deep .p-select-overlay .p-select-option:hover {
      background: rgba(0, 102, 204, 0.08);
      color: #0066cc !important;
    }

    :host ::ng-deep .p-select-overlay .p-select-option.p-select-option-selected {
      background: linear-gradient(135deg, var(--primary-color) 0%, #0066cc 100%);
      color: white !important;
      font-weight: 700;
    }

    :host ::ng-deep .p-select-overlay .p-select-option.p-select-option-selected:hover {
      background: linear-gradient(135deg, #0055aa 0%, #0052b3 100%);
      color: white !important;
    }

    :host ::ng-deep .p-select-overlay .p-select-list {
      padding: calc(var(--gap) / 2);
    }

    .tournaments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--padding);
    }

    :host ::ng-deep .tournament-card {
      cursor: pointer;
      transition: all var(--transition-duration);
      border: 1px solid transparent;
    }

    :host ::ng-deep .tournament-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-color);
    }

    .tournament-banner {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .tournament-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: var(--gap);
      gap: var(--gap);
    }

    .tournament-header h2 {
      font-size: 1.5rem;
      color: var(--font-color);
      margin: 0;
      flex: 1;
    }

    .game-info {
      display: flex;
      align-items: center;
      gap: var(--gap);
      margin-bottom: var(--gap);
      color: var(--font-secondary-color);
    }

    .game-icon {
      width: var(--icons-size);
      height: var(--icons-size);
      border-radius: var(--inner-radius);
    }

    .tournament-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap);
      margin-bottom: var(--gap);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: calc(var(--gap) / 2);
      color: var(--font-color);
      font-size: 0.875rem;
    }

    .meta-item i {
      color: var(--primary-color);
    }

    .tournament-date {
      display: flex;
      align-items: center;
      gap: calc(var(--gap) / 2);
      color: var(--font-secondary-color);
      font-size: 0.875rem;
      padding-top: var(--gap);
      border-top: 1px solid var(--border-color);
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: calc(var(--padding) * 2);
      color: var(--font-secondary-color);
    }

    .empty-state p {
      margin-top: var(--gap);
      font-size: 1.125rem;
    }

    @media (max-width: 768px) {
      .tournaments-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TournamentListComponent implements OnInit {
  private readonly router = inject(Router);
  protected readonly tournamentService = inject(TournamentService);
  protected readonly gameService = inject(GameService);
  protected readonly authService = inject(AuthService);

  protected readonly searchQuery = signal<string>('');
  protected readonly selectedGame = signal<string>('');
  protected readonly selectedStatus = signal<string>('');

  protected readonly gameOptions = computed(() => [
    { label: 'Tous les jeux', value: '' },
    ...this.gameService.games().map(game => ({ label: game.name, value: game.id }))
  ]);

  protected readonly statusOptions = [
    { label: 'Tous les statuts', value: '' },
    { label: 'Inscriptions ouvertes', value: 'registration' },
    { label: 'En cours', value: 'ongoing' },
    { label: 'Terminés', value: 'completed' }
  ];

  protected readonly filteredTournaments = computed(() => {
    let tournaments = this.tournamentService.tournaments();

    // Filtre par recherche textuelle
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      tournaments = tournaments.filter(t =>
        t.name.toLowerCase().includes(query)
      );
    }

    // Filtre par jeu
    if (this.selectedGame()) {
      tournaments = tournaments.filter(t => t.gameId === this.selectedGame());
    }

    // Filtre par statut
    if (this.selectedStatus()) {
      tournaments = tournaments.filter(t => t.status === this.selectedStatus());
    }

    return tournaments;
  });

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.tournamentService.getAllTournaments(true),
      this.gameService.getAllGames(true)
    ]);
  }

  onSearchChange(): void {
    // Recherche gérée par computed signal
  }

  onFilterChange(): void {
    // Filtrage géré par computed signal
  }

  async navigateToCreate(): Promise<void> {
    await this.router.navigate(['/tournaments/create']);
  }

  getStatusLabel(status: TournamentStatus): string {
    const labels: Record<TournamentStatus, string> = {
      [TournamentStatus.DRAFT]: 'Brouillon',
      [TournamentStatus.REGISTRATION]: 'Inscriptions',
      [TournamentStatus.ONGOING]: 'En cours',
      [TournamentStatus.COMPLETED]: 'Terminé',
      [TournamentStatus.CANCELLED]: 'Annulé'
    };
    return labels[status];
  }

  getStatusSeverity(status: TournamentStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    const severities: Record<TournamentStatus, any> = {
      [TournamentStatus.DRAFT]: 'secondary',
      [TournamentStatus.REGISTRATION]: 'success',
      [TournamentStatus.ONGOING]: 'warn',
      [TournamentStatus.COMPLETED]: 'info',
      [TournamentStatus.CANCELLED]: 'danger'
    };
    return severities[status];
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}