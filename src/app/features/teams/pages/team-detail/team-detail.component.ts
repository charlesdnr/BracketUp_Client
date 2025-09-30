import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService, AuthService } from '../../../../core/services';
import { Team } from '../../../../core/models';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="team-detail-page">
      @if (isLoading()) {
        <div class="loading">Chargement...</div>
      } @else if (team()) {
        <div class="container">
          <!-- Header -->
          <div class="team-header">
            @if (team()!.logoUrl) {
              <img [src]="team()!.logoUrl" [alt]="team()!.name" class="team-logo" />
            } @else {
              <div class="team-logo-placeholder">{{ team()!.name.charAt(0) }}</div>
            }

            <div class="team-info">
              <div class="team-name">
                <h1>{{ team()!.name }}</h1>
                @if (team()!.tag) {
                  <span class="team-tag">[{{ team()!.tag }}]</span>
                }
              </div>

              @if (team()!.game) {
                <div class="game-info">
                  @if (team()!.game!.iconUrl) {
                    <img [src]="team()!.game!.iconUrl" [alt]="team()!.game!.name" />
                  }
                  <span>{{ team()!.game!.name }}</span>
                </div>
              }
            </div>

            <!-- Actions -->
            @if (isCaptain()) {
              <div class="actions">
                <button (click)="editTeam()" class="btn-primary">Modifier</button>
                <button (click)="deleteTeam()" class="btn-danger">Supprimer</button>
              </div>
            }
          </div>

          <div class="content-grid">
            <!-- Members -->
            <div class="main-content">
              <section class="card">
                <h2>Membres ({{ team()!.members?.length || 0 }})</h2>

                <div class="members-list">
                  @for (member of team()!.members; track member.id) {
                    <div class="member-item">
                      <div class="member-info">
                        @if (member.user?.discordAvatar) {
                          <img
                            [src]="'https://cdn.discordapp.com/avatars/' + member.user!.discordAvatar + '.png'"
                            [alt]="member.user!.discordUsername"
                            class="avatar" />
                        } @else {
                          <div class="avatar-placeholder">
                            {{ member.user?.discordUsername?.charAt(0) || '?' }}
                          </div>
                        }

                        <div class="member-details">
                          <span class="username">{{ member.user?.discordUsername }}</span>
                          <span class="role" [class]="'role-' + member.role">{{ getRoleLabel(member.role) }}</span>
                        </div>
                      </div>

                      @if (isCaptain() && member.userId !== team()!.captainId) {
                        <div class="member-actions">
                          <button (click)="removeMember(member.userId)" class="btn-text">Retirer</button>
                          @if (member.role !== 'captain') {
                            <button (click)="transferCaptaincy(member.userId)" class="btn-text">
                              Promouvoir capitaine
                            </button>
                          }
                        </div>
                      }
                    </div>
                  } @empty {
                    <p class="empty">Aucun membre</p>
                  }
                </div>

                @if (isCaptain()) {
                  <div class="add-member">
                    <button (click)="showAddMemberModal()" class="btn-secondary">
                      Ajouter un membre
                    </button>
                  </div>
                }
              </section>

              <!-- Tournament History -->
              <section class="card">
                <h2>Historique des Tournois</h2>
                <p class="empty">Aucun tournoi joué pour le moment</p>
              </section>
            </div>

            <!-- Sidebar -->
            <aside class="sidebar">
              <div class="card">
                <h3>Informations</h3>
                <div class="info-list">
                  @if (team()!.captain) {
                    <div class="info-item">
                      <span class="label">Capitaine</span>
                      <span class="value">{{ team()!.captain!.discordUsername }}</span>
                    </div>
                  }
                  <div class="info-item">
                    <span class="label">Créée le</span>
                    <span class="value">{{ formatDate(team()!.createdAt) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Dernière MAJ</span>
                    <span class="value">{{ formatDate(team()!.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .team-detail-page {
      min-height: 100vh;
      background: var(--background-color);
      padding: var(--padding) 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--padding);
    }

    .loading {
      text-align: center;
      padding: calc(var(--padding) * 2);
      color: var(--font-secondary-color);
    }

    .team-header {
      background: var(--container-color);
      padding: var(--padding);
      border-radius: var(--radius);
      box-shadow: var(--box-shadow);
      display: flex;
      gap: var(--padding);
      align-items: center;
      margin-bottom: var(--padding);
    }

    .team-logo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
    }

    .team-logo-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      font-weight: bold;
    }

    .team-info {
      flex: 1;
    }

    .team-name {
      display: flex;
      align-items: center;
      gap: var(--gap);
      margin-bottom: calc(var(--gap) / 2);
    }

    h1 {
      font-size: 2.5rem;
      color: var(--font-color);
      margin: 0;
    }

    .team-tag {
      color: var(--primary-color);
      font-size: 2rem;
      font-weight: 600;
    }

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
    }

    .btn-primary, .btn-secondary, .btn-danger, .btn-text {
      padding: calc(var(--gap) * 0.75) calc(var(--padding) * 1.5);
      border: none;
      border-radius: var(--inner-radius);
      cursor: pointer;
      font-weight: 600;
      transition: all var(--transition-duration);
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-secondary {
      background: var(--neutral-color);
      color: white;
    }

    .btn-danger {
      background: var(--danger-color);
      color: white;
    }

    .btn-text {
      background: transparent;
      color: var(--primary-color);
      padding: calc(var(--gap) / 2);
    }

    .btn-primary:hover { opacity: 0.9; }
    .btn-secondary:hover { opacity: 0.9; }
    .btn-danger:hover { opacity: 0.9; }
    .btn-text:hover { text-decoration: underline; }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: var(--padding);
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

    .members-list {
      display: flex;
      flex-direction: column;
      gap: var(--gap);
    }

    .member-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--gap);
      background: var(--background-color);
      border-radius: var(--inner-radius);
    }

    .member-info {
      display: flex;
      align-items: center;
      gap: var(--gap);
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .avatar-placeholder {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .member-details {
      display: flex;
      flex-direction: column;
    }

    .username {
      font-weight: 600;
      color: var(--font-color);
    }

    .role {
      font-size: 0.875rem;
      padding: calc(var(--gap) / 4) calc(var(--gap) / 2);
      border-radius: var(--inner-radius);
      width: fit-content;
    }

    .role-captain {
      background: #ffc107;
      color: #333;
    }

    .role-member {
      background: #e2e3e5;
      color: #383d41;
    }

    .role-substitute {
      background: #d1ecf1;
      color: #0c5460;
    }

    .member-actions {
      display: flex;
      gap: calc(var(--gap) / 2);
    }

    .add-member {
      margin-top: var(--gap);
      padding-top: var(--gap);
      border-top: 1px solid var(--border-color);
    }

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

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly teamService = inject(TeamService);
  private readonly authService = inject(AuthService);

  protected readonly team = signal<Team | null>(null);
  protected readonly isLoading = signal<boolean>(true);

  protected readonly isCaptain = computed(() => {
    const t = this.team();
    const user = this.authService.currentUser();
    return t && user && t.captainId === user.id;
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      await this.router.navigate(['/teams']);
      return;
    }

    await this.loadTeam(id);
  }

  private async loadTeam(id: string): Promise<void> {
    try {
      this.isLoading.set(true);
      const team = await this.teamService.getTeamById(id);
      this.team.set(team);
    } catch (error) {
      console.error('Failed to load team:', error);
      await this.router.navigate(['/teams']);
    } finally {
      this.isLoading.set(false);
    }
  }

  editTeam(): void {
    // TODO: Implémenter modal d'édition
    alert('Fonctionnalité à venir');
  }

  async deleteTeam(): Promise<void> {
    const teamId = this.team()?.id;
    if (!teamId) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) return;

    try {
      await this.teamService.deleteTeam(teamId);
      await this.router.navigate(['/teams']);
    } catch (error) {
      console.error('Failed to delete team:', error);
      alert('Échec de la suppression');
    }
  }

  async removeMember(userId: string): Promise<void> {
    const teamId = this.team()?.id;
    if (!teamId) return;

    if (!confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) return;

    try {
      await this.teamService.removeMember(teamId, userId);
      await this.loadTeam(teamId);
    } catch (error) {
      console.error('Failed to remove member:', error);
      alert('Échec du retrait du membre');
    }
  }

  async transferCaptaincy(userId: string): Promise<void> {
    const teamId = this.team()?.id;
    if (!teamId) return;

    if (!confirm('Êtes-vous sûr de vouloir transférer le capitanat ?')) return;

    try {
      await this.teamService.transferCaptaincy(teamId, { newCaptainId: userId });
      await this.loadTeam(teamId);
    } catch (error) {
      console.error('Failed to transfer captaincy:', error);
      alert('Échec du transfert');
    }
  }

  showAddMemberModal(): void {
    // TODO: Implémenter modal d'ajout de membre
    alert('Fonctionnalité à venir');
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      captain: 'Capitaine',
      member: 'Membre',
      substitute: 'Remplaçant'
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
}