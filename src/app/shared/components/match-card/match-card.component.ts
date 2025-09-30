import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '../../../core/models';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="match-card" [class.clickable]="clickable()" (click)="onCardClick()">
      <!-- Status Badge -->
      <div class="match-status" [class]="'status-' + match().status">
        {{ getStatusLabel(match().status) }}
      </div>

      <!-- Match Info -->
      <div class="match-info">
        <div class="match-round">
          Round {{ match().round }} - Match {{ match().matchNumber }}
        </div>
        @if (match().scheduledAt) {
          <div class="match-schedule">
            📅 {{ formatDate(match().scheduledAt!) }}
          </div>
        }
      </div>

      <!-- Participants -->
      <div class="participants">
        <!-- Participant 1 -->
        <div class="participant" [class.winner]="match().winnerId === match().participant1Id">
          <div class="participant-name">
            @if (match().participant1) {
              {{ getParticipantName(match().participant1) }}
            } @else {
              <span class="tbd">TBD</span>
            }
          </div>
          <div class="participant-score">
            {{ match().scoreParticipant1 }}
          </div>
        </div>

        <div class="vs">VS</div>

        <!-- Participant 2 -->
        <div class="participant" [class.winner]="match().winnerId === match().participant2Id">
          <div class="participant-name">
            @if (match().participant2) {
              {{ getParticipantName(match().participant2) }}
            } @else {
              <span class="tbd">TBD</span>
            }
          </div>
          <div class="participant-score">
            {{ match().scoreParticipant2 }}
          </div>
        </div>
      </div>

      <!-- Best Of -->
      <div class="match-format">
        Best of {{ match().bestOf }}
      </div>
    </div>
  `,
  styles: [`
    .match-card {
      background: var(--container-color);
      border-radius: var(--radius);
      padding: var(--padding);
      box-shadow: var(--box-shadow);
      transition: all var(--transition-duration);
      position: relative;
    }

    .match-card.clickable {
      cursor: pointer;
    }

    .match-card.clickable:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .match-status {
      position: absolute;
      top: var(--gap);
      right: var(--gap);
      padding: calc(var(--gap) / 4) calc(var(--gap) * 0.75);
      border-radius: var(--inner-radius);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-pending {
      background: #e2e3e5;
      color: #383d41;
    }

    .status-ready {
      background: #d1ecf1;
      color: #0c5460;
    }

    .status-ongoing {
      background: #fff3cd;
      color: #856404;
    }

    .status-completed {
      background: #d4edda;
      color: #155724;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    .match-info {
      margin-bottom: var(--padding);
    }

    .match-round {
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: calc(var(--gap) / 4);
    }

    .match-schedule {
      font-size: 0.875rem;
      color: var(--font-secondary-color);
    }

    .participants {
      display: flex;
      flex-direction: column;
      gap: var(--gap);
      margin-bottom: var(--gap);
    }

    .participant {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: calc(var(--gap) * 0.75);
      background: var(--background-color);
      border-radius: var(--inner-radius);
      transition: all var(--transition-duration);
    }

    .participant.winner {
      background: #d4edda;
      font-weight: 600;
      border: 2px solid #28a745;
    }

    .participant-name {
      flex: 1;
    }

    .tbd {
      color: var(--font-secondary-color);
      font-style: italic;
    }

    .participant-score {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--font-color);
      min-width: 40px;
      text-align: right;
    }

    .vs {
      text-align: center;
      color: var(--font-secondary-color);
      font-weight: 600;
      font-size: 0.875rem;
      margin: calc(var(--gap) / 4) 0;
    }

    .match-format {
      text-align: center;
      color: var(--font-secondary-color);
      font-size: 0.875rem;
      padding-top: var(--gap);
      border-top: 1px solid var(--border-color);
    }
  `]
})
export class MatchCardComponent {
  // Inputs
  readonly match = input.required<Match>();
  readonly clickable = input<boolean>(false);

  // Outputs
  readonly matchClick = output<Match>();

  protected onCardClick(): void {
    if (this.clickable()) {
      this.matchClick.emit(this.match());
    }
  }

  protected getParticipantName(participant: any): string {
    if (participant.user) {
      return participant.user.discordUsername;
    }
    if (participant.team) {
      return participant.team.tag
        ? `${participant.team.name} [${participant.team.tag}]`
        : participant.team.name;
    }
    return 'Unknown';
  }

  protected getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'En attente',
      ready: 'Prêt',
      ongoing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé'
    };
    return labels[status] || status;
  }

  protected formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}