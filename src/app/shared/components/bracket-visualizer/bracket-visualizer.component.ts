import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match, Bracket } from '../../../core/models';

@Component({
  selector: 'app-bracket-visualizer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bracket-visualizer">
      @if (bracket()) {
        <div class="bracket-header">
          <h3>{{ bracket()!.name || 'Bracket' }}</h3>
          <span class="round-count">{{ bracket()!.roundCount }} rounds</span>
        </div>

        <div class="bracket-container" [style.--rounds]="bracket()!.roundCount">
          @for (round of rounds(); track $index) {
            <div class="bracket-round">
              <div class="round-header">Round {{ $index + 1 }}</div>
              <div class="matches">
                @for (match of round; track match.id) {
                  <div class="match-card" [class.completed]="match.status === 'completed'">
                    <!-- Participant 1 -->
                    <div class="match-participant" [class.winner]="match.winnerId === match.participant1Id">
                      @if (match.participant1) {
                        <div class="participant-info">
                          <span class="participant-name">
                            {{ getParticipantName(match.participant1) }}
                          </span>
                          <span class="participant-score">{{ match.scoreParticipant1 }}</span>
                        </div>
                      } @else {
                        <div class="participant-info placeholder">
                          <span class="participant-name">TBD</span>
                        </div>
                      }
                    </div>

                    <div class="match-divider"></div>

                    <!-- Participant 2 -->
                    <div class="match-participant" [class.winner]="match.winnerId === match.participant2Id">
                      @if (match.participant2) {
                        <div class="participant-info">
                          <span class="participant-name">
                            {{ getParticipantName(match.participant2) }}
                          </span>
                          <span class="participant-score">{{ match.scoreParticipant2 }}</span>
                        </div>
                      } @else {
                        <div class="participant-info placeholder">
                          <span class="participant-name">TBD</span>
                        </div>
                      }
                    </div>

                    <!-- Match info -->
                    @if (match.status === 'completed') {
                      <div class="match-status completed">✓</div>
                    } @else if (match.status === 'ongoing') {
                      <div class="match-status ongoing">En cours</div>
                    } @else if (match.status === 'ready') {
                      <div class="match-status ready">Prêt</div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-bracket">
          <p>Aucun bracket disponible</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .bracket-visualizer {
      width: 100%;
      overflow-x: auto;
      padding: 1rem 0;
    }

    .bracket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 0 1rem;
    }

    .bracket-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .round-count {
      color: #666;
      font-size: 0.875rem;
    }

    .bracket-container {
      display: flex;
      gap: 3rem;
      padding: 1rem;
      min-width: fit-content;
    }

    .bracket-round {
      display: flex;
      flex-direction: column;
      min-width: 250px;
    }

    .round-header {
      text-align: center;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 1.5rem;
      font-size: 1.125rem;
    }

    .matches {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      justify-content: space-around;
      flex: 1;
    }

    .match-card {
      background: white;
      border: 2px solid #e2e3e5;
      border-radius: 0.5rem;
      overflow: hidden;
      position: relative;
      transition: all 0.3s;
    }

    .match-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    }

    .match-card.completed {
      border-color: #28a745;
    }

    .match-participant {
      display: flex;
      padding: 0.75rem 1rem;
      transition: background 0.3s;
    }

    .match-participant:hover {
      background: #f8f9fa;
    }

    .match-participant.winner {
      background: #d4edda;
      font-weight: 600;
    }

    .participant-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .participant-info.placeholder {
      color: #999;
      font-style: italic;
    }

    .participant-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .participant-score {
      font-weight: bold;
      color: #333;
      margin-left: 1rem;
      min-width: 30px;
      text-align: right;
    }

    .match-divider {
      height: 1px;
      background: #e2e3e5;
    }

    .match-status {
      position: absolute;
      top: 50%;
      right: -25px;
      transform: translateY(-50%);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .match-status.completed {
      background: #28a745;
      color: white;
    }

    .match-status.ongoing {
      background: #ffc107;
      color: #333;
    }

    .match-status.ready {
      background: #17a2b8;
      color: white;
    }

    .empty-bracket {
      text-align: center;
      padding: 3rem;
      color: #999;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .bracket-container {
        gap: 2rem;
      }

      .bracket-round {
        min-width: 200px;
      }

      .matches {
        gap: 2rem;
      }
    }
  `]
})
export class BracketVisualizerComponent {
  // Inputs
  readonly bracket = input<Bracket | null>(null);
  readonly matches = input<Match[]>([]);

  // Computed: Organiser les matchs par round
  protected readonly rounds = computed(() => {
    const bracketData = this.bracket();
    const matchesData = this.matches();

    if (!bracketData || !matchesData.length) return [];

    const roundCount = bracketData.roundCount;
    const rounds: Match[][] = Array.from({ length: roundCount }, () => []);

    matchesData.forEach(match => {
      if (match.round > 0 && match.round <= roundCount) {
        rounds[match.round - 1].push(match);
      }
    });

    // Trier les matchs par matchNumber dans chaque round
    rounds.forEach(round => {
      round.sort((a, b) => a.matchNumber - b.matchNumber);
    });

    return rounds;
  });

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
}