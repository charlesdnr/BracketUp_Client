export interface Game {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  teamSize: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateGameDto {
  name: string;
  teamSize: number;
  iconUrl?: string;
  description?: string;
}

export interface UpdateGameDto extends Partial<CreateGameDto> {}