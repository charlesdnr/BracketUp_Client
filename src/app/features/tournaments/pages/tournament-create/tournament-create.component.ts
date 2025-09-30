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
      background: #f5f5f5;
      padding: 2rem 0;
    }

    .container {
      max-width: 900px;
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

    .tournament-form {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .form-section {
      padding: 2rem;
      border-bottom: 1px solid #eee;
    }

    .form-section:last-child {
      border-bottom: none;
    }

    .form-section h2 {
      font-size: 1.5rem;
      color: #333;
      margin: 0 0 1.5rem 0;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 600;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    textarea {
      resize: vertical;
      font-family: inherit;
    }

    .form-actions {
      padding: 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5568d3;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
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