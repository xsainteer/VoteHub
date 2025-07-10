export interface Poll {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  expiresAt?: Date;
  creatorId: string;
  options: PollOption[];
  participants: Vote[];
}

export interface PollOption {
  id: string;
  name: string;
  description?: string;
  pollId: string;
  votes: Vote[];
}

export interface Vote {
  pollId: string;
  pollOptionId: string;
  userId: string;
  votedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  joinedAt: Date;
}

export type PollStatus = 'active' | 'expired' | 'draft';

export type NavigationSection = 
  | 'discover'
  | 'dashboard' 
  | 'polls' 
  | 'analytics' 
  | 'account' 
  | 'settings' 
  | 'help';

// API-specific types for backend integration
export interface ApiPoll {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  options: ApiPollOption[];
  isActive: boolean;
}

export interface ApiPollOption {
  id: number;
  name: string;
  votesCount: number;
  pollId: number;
}

// Utility functions to convert between API and local types
export const convertApiPollToLocal = (apiPoll: ApiPoll): Poll => ({
  id: apiPoll.id.toString(),
  name: apiPoll.title,
  description: apiPoll.description,
  createdAt: new Date(apiPoll.createdAt),
  expiresAt: apiPoll.endDate ? new Date(apiPoll.endDate) : undefined,
  creatorId: 'current-user', // This would come from auth context
  options: apiPoll.options.map(option => ({
    id: option.id.toString(),
    name: option.name,
    description: undefined,
    pollId: option.pollId.toString(),
    votes: Array(option.votesCount).fill(null).map((_, index) => ({
      pollId: option.pollId.toString(),
      pollOptionId: option.id.toString(),
      userId: `user-${index}`,
      votedAt: new Date(),
    })),
  })),
  participants: [],
});

export const convertLocalPollToApi = (poll: Partial<Poll>): Partial<ApiPoll> => ({
  title: poll.name,
  description: poll.description,
  endDate: poll.expiresAt?.toISOString(),
  isActive: true,
});