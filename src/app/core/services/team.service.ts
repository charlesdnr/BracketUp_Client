import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Team, CreateTeamDto, UpdateTeamDto, AddMemberDto, TransferCaptaincyDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/teams`;

  private readonly teamsSignal = signal<Team[]>([]);
  private readonly isLoadingSignal = signal<boolean>(false);

  readonly teams = this.teamsSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();

  /**
   * Récupérer toutes les équipes
   */
  async getAllTeams(forceRefresh = false): Promise<Team[]> {
    if (!forceRefresh && this.teamsSignal().length > 0) {
      return this.teamsSignal();
    }

    try {
      this.isLoadingSignal.set(true);
      const teams = await firstValueFrom(
        this.http.get<Team[]>(this.apiUrl)
      );
      this.teamsSignal.set(teams);
      return teams;
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Récupérer une équipe par son ID
   */
  async getTeamById(id: string): Promise<Team> {
    try {
      this.isLoadingSignal.set(true);
      return await firstValueFrom(
        this.http.get<Team>(`${this.apiUrl}/${id}`)
      );
    } catch (error) {
      console.error(`Failed to fetch team ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Créer une nouvelle équipe
   */
  async createTeam(data: CreateTeamDto): Promise<Team> {
    try {
      this.isLoadingSignal.set(true);
      const team = await firstValueFrom(
        this.http.post<Team>(this.apiUrl, data)
      );
      this.teamsSignal.update(teams => [...teams, team]);
      return team;
    } catch (error) {
      console.error('Failed to create team:', error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Mettre à jour une équipe
   */
  async updateTeam(id: string, data: UpdateTeamDto): Promise<Team> {
    try {
      this.isLoadingSignal.set(true);
      const updatedTeam = await firstValueFrom(
        this.http.put<Team>(`${this.apiUrl}/${id}`, data)
      );
      this.teamsSignal.update(teams =>
        teams.map(team => team.id === id ? updatedTeam : team)
      );
      return updatedTeam;
    } catch (error) {
      console.error(`Failed to update team ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Supprimer une équipe
   */
  async deleteTeam(id: string): Promise<void> {
    try {
      this.isLoadingSignal.set(true);
      await firstValueFrom(
        this.http.delete<void>(`${this.apiUrl}/${id}`)
      );
      this.teamsSignal.update(teams => teams.filter(team => team.id !== id));
    } catch (error) {
      console.error(`Failed to delete team ${id}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Ajouter un membre à une équipe
   */
  async addMember(teamId: string, data: AddMemberDto): Promise<Team> {
    try {
      this.isLoadingSignal.set(true);
      const updatedTeam = await firstValueFrom(
        this.http.post<Team>(`${this.apiUrl}/${teamId}/members`, data)
      );
      this.teamsSignal.update(teams =>
        teams.map(team => team.id === teamId ? updatedTeam : team)
      );
      return updatedTeam;
    } catch (error) {
      console.error(`Failed to add member to team ${teamId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Retirer un membre d'une équipe
   */
  async removeMember(teamId: string, userId: string): Promise<Team> {
    try {
      this.isLoadingSignal.set(true);
      const updatedTeam = await firstValueFrom(
        this.http.delete<Team>(`${this.apiUrl}/${teamId}/members/${userId}`)
      );
      this.teamsSignal.update(teams =>
        teams.map(team => team.id === teamId ? updatedTeam : team)
      );
      return updatedTeam;
    } catch (error) {
      console.error(`Failed to remove member from team ${teamId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Transférer le capitanat
   */
  async transferCaptaincy(teamId: string, data: TransferCaptaincyDto): Promise<Team> {
    try {
      this.isLoadingSignal.set(true);
      const updatedTeam = await firstValueFrom(
        this.http.patch<Team>(`${this.apiUrl}/${teamId}/captain`, data)
      );
      this.teamsSignal.update(teams =>
        teams.map(team => team.id === teamId ? updatedTeam : team)
      );
      return updatedTeam;
    } catch (error) {
      console.error(`Failed to transfer captaincy for team ${teamId}:`, error);
      throw error;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }
}