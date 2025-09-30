export enum MatchStatus {
  PENDING = 'pending',
  READY = 'ready',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum BracketType {
  WINNER = 'winner',
  LOSER = 'loser',
  GROUP = 'group'
}

export interface Match {
  id: string;
  tournamentId: string;
  bracketId: string;
  round: number;
  matchNumber: number;
  participant1Id: string | null;
  participant2Id: string | null;
  winnerId: string | null;
  scoreParticipant1: number;
  scoreParticipant2: number;
  bestOf: number;
  status: MatchStatus;
  nextMatchId: string | null;
  loserNextMatchId: string | null;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  participant1?: any;
  participant2?: any;
  winner?: any;
}

export interface Bracket {
  id: string;
  tournamentId: string;
  type: BracketType | null;
  name: string | null;
  roundCount: number;
  createdAt: string;
  matches?: Match[];
}

export interface UpdateMatchScoreDto {
  scoreParticipant1: number;
  scoreParticipant2: number;
  winnerId?: string;
}