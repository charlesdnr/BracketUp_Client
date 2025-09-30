export enum TeamMemberRole {
  CAPTAIN = 'captain',
  MEMBER = 'member',
  SUBSTITUTE = 'substitute'
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamMemberRole;
  joinedAt: string;
  user?: {
    id: string;
    discordUsername: string;
    discordAvatar: string | null;
  };
}

export interface Team {
  id: string;
  name: string;
  tag: string | null;
  logoUrl: string | null;
  captainId: string | null;
  gameId: string;
  createdAt: string;
  updatedAt: string;
  captain?: {
    id: string;
    discordUsername: string;
    discordAvatar: string | null;
  };
  game?: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
  members?: TeamMember[];
}

export interface CreateTeamDto {
  name: string;
  tag?: string;
  logoUrl?: string;
  gameId: string;
}

export interface UpdateTeamDto extends Partial<CreateTeamDto> {}

export interface AddMemberDto {
  userId: string;
}

export interface TransferCaptaincyDto {
  newCaptainId: string;
}