export enum TournamentFormat {
  SINGLE_ELIMINATION = 'single_elimination',
  DOUBLE_ELIMINATION = 'double_elimination',
  ROUND_ROBIN = 'round_robin',
  SWISS = 'swiss'
}

export enum TournamentStatus {
  DRAFT = 'draft',
  REGISTRATION = 'registration',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TournamentParticipantStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  DISQUALIFIED = 'disqualified',
  WITHDRAWN = 'withdrawn'
}

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  gameId: string;
  description: string | null;
  rules: string | null;
  format: TournamentFormat;
  maxParticipants: number;
  teamSize: number;
  status: TournamentStatus;
  prizePool: string | null;
  bannerUrl: string | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  startDate: string | null;
  endDate: string | null;
  discordChannelId: string | null;
  discordRoleId: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  game?: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
  creator?: {
    id: string;
    discordUsername: string;
  };
  _count?: {
    participants: number;
  };
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  userId: string | null;
  teamId: string | null;
  seed: number | null;
  status: TournamentParticipantStatus;
  registeredAt: string;
  checkedInAt: string | null;
  user?: {
    id: string;
    discordUsername: string;
    discordAvatar: string | null;
  };
  team?: {
    id: string;
    name: string;
    tag: string | null;
    logoUrl: string | null;
  };
}

export interface CreateTournamentDto {
  name: string;
  gameId: string;
  description?: string;
  rules?: string;
  format: TournamentFormat;
  maxParticipants: number;
  teamSize: number;
  prizePool?: string;
  bannerUrl?: string;
  registrationStart?: string;
  registrationEnd?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateTournamentDto extends Partial<CreateTournamentDto> {
  status?: TournamentStatus;
}

export interface RegisterTournamentDto {
  teamId?: string;
}