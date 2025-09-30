import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TournamentService, GameService } from '../../../../core/services';
import { TournamentFormat, CreateTournamentDto } from '../../../../core/models';

@Component({
  selector: 'app-tournament-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="tournament-create-page">
      <div class="container">
        <div class="header">
          <h1>Créer un Tournoi</h1>
          <button routerLink="/tournaments" class="btn-secondary">Annuler</button>
        </div>

        <form (ngSubmit)="onSubmit()" class="tournament-form">
          <!-- Basic Info -->
          <section class="form-section">
            <h2>Informations générales</h2>

            <div class="form-group">
              <label for="name">Nom du tournoi *</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="formData.name"
                name="name"
                required
                placeholder="Nom du tournoi" />
            </div>

            <div class="form-group">
              <label for="gameId">Jeu *</label>
              <select id="gameId" [(ngModel)]="formData.gameId" name="gameId" required>
                <option value="">Sélectionner un jeu</option>
                @for (game of gameService.games(); track game.id) {
                  <option [value]="game.id">{{ game.name }}</option>
                }
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="format">Format *</label>
                <select id="format" [(ngModel)]="formData.format" name="format" required>
                  <option value="single_elimination">Simple élimination</option>
                  <option value="double_elimination">Double élimination</option>
                  <option value="round_robin">Round Robin</option>
                  <option value="swiss">Swiss</option>
                </select>
              </div>

              <div class="form-group">
                <label for="teamSize">Taille équipe *</label>
                <input
                  type="number"
                  id="teamSize"
                  [(ngModel)]="formData.teamSize"
                  name="teamSize"
                  min="1"
                  max="10"
                  required />
              </div>

              <div class="form-group">
                <label for="maxParticipants">Participants max *</label>
                <input
                  type="number"
                  id="maxParticipants"
                  [(ngModel)]="formData.maxParticipants"
                  name="maxParticipants"
                  min="2"
                  max="256"
                  required />
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                [(ngModel)]="formData.description"
                name="description"
                rows="4"
                placeholder="Description du tournoi"></textarea>
            </div>

            <div class="form-group">
              <label for="rules">Règles</label>
              <textarea
                id="rules"
                [(ngModel)]="formData.rules"
                name="rules"
                rows="6"
                placeholder="Règles du tournoi"></textarea>
            </div>
          </section>

          <!-- Prize & Media -->
          <section class="form-section">
            <h2>Prix et Médias</h2>

            <div class="form-group">
              <label for="prizePool">Prize Pool</label>
              <input
                type="text"
                id="prizePool"
                [(ngModel)]="formData.prizePool"
                name="prizePool"
                placeholder="Ex: 1000€" />
            </div>

            <div class="form-group">
              <label for="bannerUrl">URL de la bannière</label>
              <input
                type="url"
                id="bannerUrl"
                [(ngModel)]="formData.bannerUrl"
                name="bannerUrl"
                placeholder="https://..." />
            </div>
          </section>

          <!-- Dates -->
          <section class="form-section">
            <h2>Dates</h2>

            <div class="form-row">
              <div class="form-group">
                <label for="registrationStart">Début inscriptions</label>
                <input
                  type="datetime-local"
                  id="registrationStart"
                  [(ngModel)]="formData.registrationStart"
                  name="registrationStart" />
              </div>

              <div class="form-group">
                <label for="registrationEnd">Fin inscriptions</label>
                <input
                  type="datetime-local"
                  id="registrationEnd"
                  [(ngModel)]="formData.registrationEnd"
                  name="registrationEnd" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="startDate">Date de début</label>
                <input
                  type="datetime-local"
                  id="startDate"
                  [(ngModel)]="formData.startDate"
                  name="startDate" />
              </div>

              <div class="form-group">
                <label for="endDate">Date de fin (estimée)</label>
                <input
                  type="datetime-local"
                  id="endDate"
                  [(ngModel)]="formData.endDate"
                  name="endDate" />
              </div>
            </div>
          </section>

          <!-- Submit -->
          <div class="form-actions">
            <button type="button" routerLink="/tournaments" class="btn-secondary">
              Annuler
            </button>
            <button type="submit" class="btn-primary" [disabled]="isSubmitting()">
              {{ isSubmitting() ? 'Création...' : 'Créer le tournoi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .tournament-create-page {
      min-height: 100vh;
      background: var(--background-color);
      padding: var(--padding) 0;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 var(--padding);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--padding);
    }

    h1 {
      font-size: 2.5rem;
      color: var(--font-color);
    }

    .tournament-form {
      background: var(--container-color);
      border-radius: var(--radius);
      box-shadow: var(--box-shadow);
    }

    .form-section {
      padding: var(--padding);
      border-bottom: 1px solid var(--border-color);
    }

    .form-section:last-child {
      border-bottom: none;
    }

    .form-section h2 {
      font-size: 1.5rem;
      color: var(--font-color);
      margin: 0 0 var(--padding) 0;
    }

    .form-group {
      margin-bottom: var(--padding);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--gap);
    }

    label {
      display: block;
      margin-bottom: calc(var(--gap) / 2);
      color: var(--font-secondary-color);
      font-weight: 600;
    }

    input, select, textarea {
      width: 100%;
      padding: calc(var(--gap) * 0.75);
      border: 1px solid var(--border-color);
      border-radius: var(--inner-radius);
      font-size: 1rem;
      transition: border-color var(--transition-duration);
      background: var(--container-color);
      color: var(--font-color);
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    textarea {
      resize: vertical;
      font-family: inherit;
    }

    .form-actions {
      padding: var(--padding);
      display: flex;
      justify-content: flex-end;
      gap: var(--gap);
    }

    .btn-primary, .btn-secondary {
      padding: calc(var(--gap) * 0.75) calc(var(--padding) * 2);
      border: none;
      border-radius: var(--inner-radius);
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      transition: all var(--transition-duration);
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn-primary:disabled {
      background: var(--neutral-color);
      cursor: not-allowed;
      opacity: 0.5;
    }

    .btn-secondary {
      background: var(--neutral-color);
      color: white;
    }

    .btn-secondary:hover {
      opacity: 0.9;
    }
  `]
})
export class TournamentCreateComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly tournamentService = inject(TournamentService);
  protected readonly gameService = inject(GameService);

  protected readonly isSubmitting = signal<boolean>(false);

  protected formData = {
    name: '',
    gameId: '',
    format: 'single_elimination' as TournamentFormat,
    teamSize: 1,
    maxParticipants: 16,
    description: '',
    rules: '',
    prizePool: '',
    bannerUrl: '',
    registrationStart: '',
    registrationEnd: '',
    startDate: '',
    endDate: ''
  };

  async ngOnInit(): Promise<void> {
    await this.gameService.getAllGames(true);
  }

  async onSubmit(): Promise<void> {
    const data = this.formData;

    if (!data.name || !data.gameId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      this.isSubmitting.set(true);

      const dto: CreateTournamentDto = {
        name: data.name,
        gameId: data.gameId,
        format: data.format,
        teamSize: data.teamSize,
        maxParticipants: data.maxParticipants,
        description: data.description || undefined,
        rules: data.rules || undefined,
        prizePool: data.prizePool || undefined,
        bannerUrl: data.bannerUrl || undefined,
        registrationStart: data.registrationStart || undefined,
        registrationEnd: data.registrationEnd || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined
      };

      const tournament = await this.tournamentService.createTournament(dto);
      await this.router.navigate(['/tournaments', tournament.id]);
    } catch (error) {
      console.error('Failed to create tournament:', error);
      alert('Échec de la création du tournoi');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}