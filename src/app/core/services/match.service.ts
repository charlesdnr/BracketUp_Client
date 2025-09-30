import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Match, Bracket, UpdateMatchScoreDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  private readonly isLoadingSignal = signal<boolean>(false);
  readonly isLoading = this.isLoadingSignal.asReadonly();

  /**
   * Récupérer les brackets d'un tournoi
   */
  async getTournamentBrackets(tournamentId: string): Promise<Bracket[]> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<Bracket[]>(`${this.apiUrl}/tournaments/${tournamentId}/brackets`)
      );
    } catch (error) {
      console.error(`Failed to fetch brackets for tournament ${tournamentId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Récupérer les matchs d'un tournoi
   */
  async getTournamentMatches(tournamentId: string): Promise<Match[]> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<Match[]>(`${this.apiUrl}/tournaments/${tournamentId}/matches`)
      );
    } catch (error) {
      console.error(`Failed to fetch matches for tournament ${tournamentId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Récupérer un match par son ID
   */
  async getMatchById(matchId: string): Promise<Match> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<Match>(`${this.apiUrl}/matches/${matchId}`)
      );
    } catch (error) {
      console.error(`Failed to fetch match ${matchId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Mettre à jour le score d'un match
   */
  async updateMatchScore(matchId: string, data: UpdateMatchScoreDto): Promise<Match> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.patch<Match>(`${this.apiUrl}/matches/${matchId}/score`, data)
      );
    } catch (error) {
      console.error(`Failed to update match score ${matchId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Démarrer un match
   */
  async startMatch(matchId: string): Promise<Match> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.post<Match>(`${this.apiUrl}/matches/${matchId}/start`, {})
      );
    } catch (error) {
      console.error(`Failed to start match ${matchId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Terminer un match
   */
  async completeMatch(matchId: string): Promise<Match> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.post<Match>(`${this.apiUrl}/matches/${matchId}/complete`, {})
      );
    } catch (error) {
      console.error(`Failed to complete match ${matchId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }
}