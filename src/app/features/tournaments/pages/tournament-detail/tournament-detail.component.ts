import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TournamentService, AuthService } from '../../../../core/services';
import { Tournament, TournamentParticipant, TournamentStatus } from '../../../../core/models';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="tournament-detail-page xprime">
      @if (isLoading()) {
        <div class="loading">Chargement...</div>
      } @else if (tournament()) {
        <div class="container">
          <!-- Banner -->
          @if (tournament()!.bannerUrl) {
            <div class="banner" [style.background-image]="'url(' + tournament()!.bannerUrl + ')'"></div>
          }

          <!-- Header -->
          <div class="tournament-header">
            <div class="header-content">
              <h1>{{ tournament()!.name }}</h1>
              <span class="status" [class]="'status-' + tournament()!.status">
                {{ getStatusLabel(tournament()!.status) }}
              </span>
            </div>

            @if (tournament()!.game) {
              <div class="game-info">
                @if (tournament()!.game!.iconUrl) {
                  <img [src]="tournament()!.game!.iconUrl" [alt]="tournament()!.game!.name" />
                }
                <span>{{ tournament()!.game!.name }}</span>
              </div>
            }
          </div>

          <!-- Actions -->
          <div class="actions">
            @if (canRegister()) {
              <button (click)="register()" class="btn-primary">
                S'inscrire
              </button>
            }
            @if (canCheckIn()) {
              <button (click)="checkIn()" class="btn-warning">
                Check-in
              </button>
            }
            @if (authService.isModerator()) {
              <button [routerLink]="['/tournaments', tournament()!.id, 'edit']" class="btn-secondary">
                Modifier
              </button>
              @if (tournament()!.status === 'registration') {
                <button (click)="startTournament()" class="btn-success">
                  Démarrer le tournoi
                </button>
              }
            }
          </div>

          <div class="content-grid">
            <!-- Main Info -->
            <div class="main-content">
              <!-- Description -->
              @if (tournament()!.description) {
                <section class="card">
                  <h2>Description</h2>
                  <p>{{ tournament()!.description }}</p>
                </section>
              }

              <!-- Rules -->
              @if (tournament()!.rules) {
                <section class="card">
                  <h2>Règles</h2>
                  <p class="rules">{{ tournament()!.rules }}</p>
                </section>
              }

              <!-- Participants -->
              <section class="card">
                <h2>Participants ({{ participants().length }}/{{ tournament()!.maxParticipants }})</h2>
                <div class="participants-list">
                  @for (participant of participants(); track participant.id) {
                    <div class="participant-item">
                      @if (participant.user) {
                        <div class="participant-info">
                          @if (participant.user.discordAvatar) {
                            <img
                              [src]="'https://cdn.discordapp.com/avatars/' + participant.user.discordAvatar + '.png'"
                              [alt]="participant.user.discordUsername"
                              class="avatar" />
                          } @else {
                            <div class="avatar-placeholder">{{ participant.user.discordUsername.charAt(0) }}</div>
                          }
                          <span>{{ participant.user.discordUsername }}</span>
                        </div>
                      } @else if (participant.team) {
                        <div class="participant-info">
                          @if (participant.team.logoUrl) {
                            <img [src]="participant.team.logoUrl" [alt]="participant.team.name" class="avatar" />
                          } @else {
                            <div class="avatar-placeholder">{{ participant.team.name.charAt(0) }}</div>
                          }
                          <span>{{ participant.team.name }}</span>
                          @if (participant.team.tag) {
                            <span class="tag">[{{ participant.team.tag }}]</span>
                          }
                        </div>
                      }
                      <span class="participant-status" [class]="'status-' + participant.status">
                        {{ participant.status }}
                      </span>
                    </div>
                  } @empty {
                    <p class="empty">Aucun participant pour le moment</p>
                  }
                </div>
              </section>

              <!-- Bracket -->
              @if (tournament()!.status === 'ongoing' || tournament()!.status === 'completed') {
                <section class="card">
                  <h2>Bracket</h2>
                  <div class="bracket-container">
                    <p>Le bracket sera affiché ici</p>
                    <!-- TODO: Intégrer le Bracket Visualizer -->
                  </div>
                </section>
              }
            </div>

            <!-- Sidebar -->
            <aside class="sidebar">
              <!-- Tournament Info -->
              <div class="card">
                <h3>Informations</h3>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">Format</span>
                    <span class="value">{{ tournament()!.format }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Taille équipe</span>
                    <span class="value">{{ tournament()!.teamSize }}v{{ tournament()!.teamSize }}</span>
                  </div>
                  @if (tournament()!.prizePool) {
                    <div class="info-item">
                      <span class="label">Prize Pool</span>
                      <span class="value">{{ tournament()!.prizePool }}</span>
                    </div>
                  }
                  @if (tournament()!.registrationStart) {
                    <div class="info-item">
                      <span class="label">Début inscriptions</span>
                      <span class="value">{{ formatDate(tournament()!.registrationStart!) }}</span>
                    </div>
                  }
                  @if (tournament()!.registrationEnd) {
                    <div class="info-item">
                      <span class="label">Fin inscriptions</span>
                      <span class="value">{{ formatDate(tournament()!.registrationEnd!) }}</span>
                    </div>
                  }
                  @if (tournament()!.startDate) {
                    <div class="info-item">
                      <span class="label">Date de début</span>
                      <span class="value">{{ formatDate(tournament()!.startDate!) }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Creator -->
              @if (tournament()!.creator) {
                <div class="card">
                  <h3>Organisateur</h3>
                  <div class="creator-info">
                    <span>{{ tournament()!.creator!.discordUsername }}</span>
                  </div>
                </div>
              }
            </aside>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .tournament-detail-page {
      min-height: 100vh;
      background: var(--background-color);
      padding-bottom: calc(var(--padding) * 2);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .loading {
      text-align: center;
      padding: calc(var(--padding) * 2);
      color: var(--font-secondary-color);
    }

    .banner {
      width: 100%;
      height: 300px;
      background-size: cover;
      background-position: center;
    }

    .tournament-header {
      background: var(--container-color);
      padding: var(--padding);
      box-shadow: var(--box-shadow);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--gap);
    }

    h1 {
      font-size: 2.5rem;
      color: var(--font-color);
      margin: 0;
    }

    .status {
      padding: calc(var(--gap) / 2) var(--gap);
      border-radius: var(--inner-radius);
      font-weight: 600;
    }

    .status-registration { background: #d4edda; color: #155724; }
    .status-ongoing { background: #fff3cd; color: #856404; }
    .status-completed { background: #cce5ff; color: #004085; }
    .status-draft { background: #e2e3e5; color: #383d41; }

    .game-info {
      display: flex;
      align-items: center;
      gap: var(--gap);
      color: var(--font-secondary-color);
    }

    .game-info img {
      width: var(--icons-size);
      height: var(--icons-size);
      border-radius: var(--inner-radius);
    }

    .actions {
      display: flex;
      gap: var(--gap);
      padding: var(--padding);
      background: var(--container-color);
      border-top: 1px solid var(--border-color);
    }

    .btn-primary, .btn-secondary, .btn-success, .btn-warning {
      padding: calc(var(--gap) * 0.75) calc(var(--padding) * 2);
      border: none;
      border-radius: var(--inner-radius);
      cursor: pointer;
      font-weight: 600;
      transition: all var(--transition-duration);
    }

    .btn-primary {
      background: var(--primary-color);
      color: var(--font-color-invert);
    }

    .btn-secondary {
      background: var(--neutral-color);
      color: var(--font-color-invert);
    }

    .btn-success {
      background: #28a745;
      color: var(--font-color-invert);
    }

    .btn-warning {
      background: #ffc107;
      color: var(--font-color);
    }

    .btn-primary:hover { background: var(--primary-color-hover); }
    .btn-secondary:hover { opacity: 0.9; }
    .btn-success:hover { background: #218838; }
    .btn-warning:hover { background: #e0a800; }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: var(--padding);
      padding: var(--padding);
    }

    .card {
      background: var(--container-color);
      padding: var(--padding);
      border-radius: var(--radius);
      box-shadow: var(--box-shadow);
      margin-bottom: var(--padding);
    }

    .card h2, .card h3 {
      margin: 0 0 var(--padding) 0;
      color: var(--font-color);
    }

    .rules {
      white-space: pre-wrap;
      line-height: 1.6;
      color: var(--font-secondary-color);
    }

    .participants-list {
      display: flex;
      flex-direction: column;
      gap: var(--gap);
    }

    .participant-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--gap);
      background: var(--background-color);
      border-radius: var(--inner-radius);
    }

    .participant-info {
      display: flex;
      align-items: center;
      gap: var(--gap);
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color);
      color: var(--font-color-invert);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .tag {
      color: var(--primary-color);
      font-weight: 600;
    }

    .participant-status {
      padding: calc(var(--gap) / 4) var(--gap);
      border-radius: var(--inner-radius);
      font-size: 0.875rem;
    }

    .participant-status.status-pending { background: #e2e3e5; color: #383d41; }
    .participant-status.status-confirmed { background: #d4edda; color: #155724; }
    .participant-status.status-checked_in { background: #d1ecf1; color: #0c5460; }

    .empty {
      text-align: center;
      color: var(--font-secondary-color);
      padding: var(--padding);
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: var(--gap);
    }

    .info-item {
      display: flex;
      justify-content: space-between;
    }

    .info-item .label {
      color: var(--font-secondary-color);
      font-size: 0.875rem;
    }

    .info-item .value {
      font-weight: 600;
      color: var(--font-color);
    }

    .creator-info {
      color: var(--font-secondary-color);
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TournamentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tournamentService = inject(TournamentService);
  protected readonly authService = inject(AuthService);

  protected readonly tournament = signal<Tournament | null>(null);
  protected readonly participants = signal<TournamentParticipant[]>([]);
  protected readonly isLoading = signal<boolean>(true);

  protected readonly canRegister = computed(() => {
    const t = this.tournament();
    return t && t.status === TournamentStatus.REGISTRATION && this.authService.isAuthenticated();
  });

  protected readonly canCheckIn = computed(() => {
    const t = this.tournament();
    // TODO: vérifier si l'utilisateur est inscrit
    return t && t.status === TournamentStatus.REGISTRATION && this.authService.isAuthenticated();
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      await this.router.navigate(['/tournaments']);
      return;
    }

    await this.loadTournament(id);
  }

  private async loadTournament(id: string): Promise<void> {
    try {
      this.isLoading.set(true);
      const [tournament, participants] = await Promise.all([
        this.tournamentService.getTournamentById(id),
        this.tournamentService.getTournamentParticipants(id)
      ]);
      this.tournament.set(tournament);
      this.participants.set(participants);
    } catch (error) {
      console.error('Failed to load tournament:', error);
      await this.router.navigate(['/tournaments']);
    } finally {
      this.isLoading.set(false);
    }
  }

  async register(): Promise<void> {
    const tournamentId = this.tournament()?.id;
    if (!tournamentId) return;

    try {
      // TODO: Ajouter un modal pour choisir équipe ou solo
      await this.tournamentService.registerToTournament(tournamentId, {});
      await this.loadTournament(tournamentId);
      alert('Inscription réussie !');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Échec de l\'inscription');
    }
  }

  async checkIn(): Promise<void> {
    const tournamentId = this.tournament()?.id;
    if (!tournamentId) return;

    try {
      await this.tournamentService.checkIn(tournamentId);
      await this.loadTournament(tournamentId);
      alert('Check-in réussi !');
    } catch (error) {
      console.error('Check-in failed:', error);
      alert('Échec du check-in');
    }
  }

  async startTournament(): Promise<void> {
    const tournamentId = this.tournament()?.id;
    if (!tournamentId) return;

    if (!confirm('Êtes-vous sûr de vouloir démarrer le tournoi ?')) return;

    try {
      await this.tournamentService.startTournament(tournamentId);
      await this.loadTournament(tournamentId);
      alert('Tournoi démarré avec succès !');
    } catch (error) {
      console.error('Failed to start tournament:', error);
      alert('Échec du démarrage du tournoi');
    }
  }

  getStatusLabel(status: TournamentStatus): string {
    const labels: Record<TournamentStatus, string> = {
      [TournamentStatus.DRAFT]: 'Brouillon',
      [TournamentStatus.REGISTRATION]: 'Inscriptions ouvertes',
      [TournamentStatus.ONGOING]: 'En cours',
      [TournamentStatus.COMPLETED]: 'Terminé',
      [TournamentStatus.CANCELLED]: 'Annulé'
    };
    return labels[status];
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}