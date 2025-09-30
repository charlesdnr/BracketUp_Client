export enum Role {
  PLAYER = 'player',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export interface User {
  id: string;
  discordId: string;
  discordUsername: string;
  discordDiscriminator: string | null;
  discordAvatar: string | null;
  email: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
}

export interface UserStats {
  totalTournaments: number;
  wins: number;
  losses: number;
  winRate: number;
}