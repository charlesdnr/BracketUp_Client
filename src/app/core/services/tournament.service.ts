import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Tournament,
  CreateTournamentDto,
  UpdateTournamentDto,
  RegisterTournamentDto,
  TournamentParticipant,
  TournamentStatus
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/tournaments`;

  private readonly tournamentsSignal = signal<Tournament[]>([]);
  private readonly isLoadingSignal = signal<boolean>(false);

  readonly tournaments = this.tournamentsSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();

  // Computed signals pour filtrer les tournois
  readonly activeTournaments = computed(() =>
    this.tournamentsSignal().filter(t =>
      t.status === TournamentStatus.REGISTRATION || t.status === TournamentStatus.ONGOING
    )
  );

  readonly upcomingTournaments = computed(() =>
    this.tournamentsSignal().filter(t => t.status === TournamentStatus.REGISTRATION)
  );

  readonly completedTournaments = computed(() =>
    this.tournamentsSignal().filter(t => t.status === TournamentStatus.COMPLETED)
  );

  /**
   * Récupérer tous les tournois
   */
  async getAllTournaments(forceRefresh = false): Promise<Tournament[]> {
    if (!forceRefresh && this.tournamentsSignal().length > 0) {
      return this.tournamentsSignal();
    }

    try {
      this.isLoadingSignal.set(true);
      const tournaments = await firstValueFrom(
        this.http.get<Tournament[]>(this.apiUrl)
      );
      this.tournamentsSignal.set(tournaments);
      return tournaments;
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Récupérer un tournoi par son ID
   */
  async getTournamentById(id: string): Promise<Tournament> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<Tournament>(`${this.apiUrl}/${id}`)
      );
    } catch (error) {
      console.error(`Failed to fetch tournament ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Créer un nouveau tournoi (admin/moderator uniquement)
   */
  async createTournament(data: CreateTournamentDto): Promise<Tournament> {
    try {
      this.isLoadingSignal.set(true);
      const tournament = await firstValueFrom(
        this.http.post<Tournament>(this.apiUrl, data)
      );
      this.tournamentsSignal.update(tournaments => [...tournaments, tournament]);
      return tournament;
    } catch (error) {
      console.error('Failed to create tournament:', error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Mettre à jour un tournoi (admin/moderator uniquement)
   */
  async updateTournament(id: string, data: UpdateTournamentDto): Promise<Tournament> {
    try {
      this.isLoadingSignal.set(true);
      const updatedTournament = await firstValueFrom(
        this.http.put<Tournament>(`${this.apiUrl}/${id}`, data)
      );
      this.tournamentsSignal.update(tournaments =>
        tournaments.map(t => t.id === id ? updatedTournament : t)
      );
      return updatedTournament;
    } catch (error) {
      console.error(`Failed to update tournament ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Supprimer un tournoi (admin uniquement)
   */
  async deleteTournament(id: string): Promise<void> {
    try {
      this.isLoadingSignal.set(true);
      await firstValueFrom(
        this.http.delete<void>(`${this.apiUrl}/${id}`)
      );
      this.tournamentsSignal.update(tournaments =>
        tournaments.filter(t => t.id !== id)
      );
    } catch (error) {
      console.error(`Failed to delete tournament ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * S'inscrire à un tournoi
   */
  async registerToTournament(
    tournamentId: string,
    data: RegisterTournamentDto
  ): Promise<TournamentParticipant> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.post<TournamentParticipant>(`${this.apiUrl}/${tournamentId}/register`, data)
      );
    } catch (error) {
      console.error(`Failed to register to tournament ${tournamentId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Récupérer les participants d'un tournoi
   */
  async getTournamentParticipants(tournamentId: string): Promise<TournamentParticipant[]> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<TournamentParticipant[]>(`${this.apiUrl}/${tournamentId}/participants`)
      );
    } catch (error) {
      console.error(`Failed to fetch participants for tournament ${tournamentId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Démarrer un tournoi (génère les brackets)
   */
  async startTournament(tournamentId: string): Promise<Tournament> {
    try {
      this.isLoadingSignal.set(true);
      const tournament = await firstValueFrom(
        this.http.post<Tournament>(`${this.apiUrl}/${tournamentId}/start`, {})
      );
      this.tournamentsSignal.update(tournaments =>
        tournaments.map(t => t.id === tournamentId ? tournament : t)
      );
      return tournament;
    } catch (error) {
      console.error(`Failed to start tournament ${tournamentId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Check-in pour un tournoi
   */
  async checkIn(tournamentId: string): Promise<TournamentParticipant> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.post<TournamentParticipant>(`${this.apiUrl}/${tournamentId}/checkin`, {})
      );
    } catch (error) {
      console.error(`Failed to check-in for tournament ${tournamentId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }
}