import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TournamentService, GameService } from '../../../../core/services';
import { TournamentStatus } from '../../../../core/models';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonModule,
    CardModule,
    Select,
    InputTextModule,
    TagModule,
    SkeletonModule
  ],
  template: `
    <div class="tournament-list-page xprime">
      <div class="container">
        <div class="header">
          <h1>Tournois</h1>
          <p-button
            label="Créer un tournoi"
            icon="pi pi-plus"
            routerLink="/tournaments/create"
            severity="primary" />
        </div>

        <!-- Filters -->
        <div class="filters">
          <p-select
            [(ngModel)]="selectedGame"
            [options]="gameOptions()"
            optionLabel="label"
            optionValue="value"
            placeholder="Tous les jeux"
            (onChange)="onFilterChange()"
            [style]="{'min-width': '200px'}" />

          <p-select
            [(ngModel)]="selectedStatus"
            [options]="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Tous les statuts"
            (onChange)="onFilterChange()"
            [style]="{'min-width': '200px'}" />
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
    </div>
  `,
  styles: [`
    .tournament-list-page {
      padding: var(--padding) 0;
      min-height: 100vh;
      background: var(--background-color);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--padding);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--padding);
      gap: var(--gap);
    }

    h1 {
      font-size: 2.5rem;
      color: var(--font-color);
    }

    .filters {
      display: flex;
      gap: var(--gap);
      margin-bottom: var(--padding);
      flex-wrap: wrap;
    }

    .tournaments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--padding);
    }

    :host ::ng-deep .tournament-card {
      cursor: pointer;
      transition: all var(--transition-duration);
    }

    :host ::ng-deep .tournament-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--box-shadow);
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
  protected readonly tournamentService = inject(TournamentService);
  protected readonly gameService = inject(GameService);

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

    if (this.selectedGame()) {
      tournaments = tournaments.filter(t => t.gameId === this.selectedGame());
    }

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

  onFilterChange(): void {
    // Filtrage géré par computed signal
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