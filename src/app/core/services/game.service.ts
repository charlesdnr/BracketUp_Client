import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Game, CreateGameDto, UpdateGameDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/games`;

  private readonly gamesSignal = signal<Game[]>([]);
  private readonly isLoadingSignal = signal<boolean>(false);

  readonly games = this.gamesSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();

  /**
   * Récupérer tous les jeux
   */
  async getAllGames(forceRefresh = false): Promise<Game[]> {
    if (!forceRefresh && this.gamesSignal().length > 0) {
      return this.gamesSignal();
    }

    try {
      this.isLoadingSignal.set(true);
      const games = await firstValueFrom(
        this.http.get<Game[]>(this.apiUrl)
      );
      this.gamesSignal.set(games);
      return games;
    } catch (error) {
      console.error('Failed to fetch games:', error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Récupérer un jeu par son ID
   */
  async getGameById(id: string): Promise<Game> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<Game>(`${this.apiUrl}/${id}`)
      );
    } catch (error) {
      console.error(`Failed to fetch game ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Créer un nouveau jeu (admin uniquement)
   */
  async createGame(data: CreateGameDto): Promise<Game> {
    try {
      this.isLoadingSignal.set(true);
      const game = await firstValueFrom(
        this.http.post<Game>(this.apiUrl, data)
      );
      this.gamesSignal.update(games => [...games, game]);
      return game;
    } catch (error) {
      console.error('Failed to create game:', error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Mettre à jour un jeu (admin uniquement)
   */
  async updateGame(id: string, data: UpdateGameDto): Promise<Game> {
    try {
      this.isLoadingSignal.set(true);
      const updatedGame = await firstValueFrom(
        this.http.put<Game>(`${this.apiUrl}/${id}`, data)
      );
      this.gamesSignal.update(games =>
        games.map(game => game.id === id ? updatedGame : game)
      );
      return updatedGame;
    } catch (error) {
      console.error(`Failed to update game ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Supprimer un jeu (admin uniquement)
   */
  async deleteGame(id: string): Promise<void> {
    try {
      this.isLoadingSignal.set(true);
      await firstValueFrom(
        this.http.delete<void>(`${this.apiUrl}/${id}`)
      );
      this.gamesSignal.update(games => games.filter(game => game.id !== id));
    } catch (error) {
      console.error(`Failed to delete game ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Activer/Désactiver un jeu (admin uniquement)
   */
  async toggleGameStatus(id: string): Promise<Game> {
    try {
      this.isLoadingSignal.set(true);
      const updatedGame = await firstValueFrom(
        this.http.patch<Game>(`${this.apiUrl}/${id}/toggle-status`, {})
      );
      this.gamesSignal.update(games =>
        games.map(game => game.id === id ? updatedGame : game)
      );
      return updatedGame;
    } catch (error) {
      console.error(`Failed to toggle game status ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }
}