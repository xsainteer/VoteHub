const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Types for API responses
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

export interface ApiVote {
  pollOptionId: number;
  pollId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
  twoFactorRecoveryCode?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AccessTokenResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface InfoResponse {
  email: string;
  isEmailConfirmed: boolean;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Unauthorized');
      }
      const error = await response.text();
      throw new Error(error || 'API request failed');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as any;
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<AccessTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    const result = await this.handleResponse<AccessTokenResponse>(response);
    this.token = result.accessToken;
    localStorage.setItem('auth_token', result.accessToken);
    localStorage.setItem('refresh_token', result.refreshToken);
    return result;
  }

  async register(userData: RegisterRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    await this.handleResponse<void>(response);
  }

  async refreshToken(): Promise<AccessTokenResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ refreshToken }),
    });

    const result = await this.handleResponse<AccessTokenResponse>(response);
    this.token = result.accessToken;
    localStorage.setItem('auth_token', result.accessToken);
    localStorage.setItem('refresh_token', result.refreshToken);
    return result;
  }

  async getUserInfo(): Promise<InfoResponse> {
    const response = await fetch(`${API_BASE_URL}/manage/info`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<InfoResponse>(response);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  // Polls
  async getPolls(skip = 0, count = 10, query = ''): Promise<ApiPoll[]> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      count: count.toString(),
      query,
    });

    const response = await fetch(`${API_BASE_URL}/api/Poll?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<ApiPoll[]>(response);
  }

  async getPoll(id: string): Promise<ApiPoll> {
    const response = await fetch(`${API_BASE_URL}/api/Poll/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<ApiPoll>(response);
  }

  async createPoll(poll: Partial<ApiPoll>): Promise<ApiPoll> {
    const response = await fetch(`${API_BASE_URL}/api/Poll`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(poll),
    });

    return this.handleResponse<ApiPoll>(response);
  }

  async updatePoll(id: string, poll: Partial<ApiPoll>): Promise<ApiPoll> {
    const response = await fetch(`${API_BASE_URL}/api/Poll/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(poll),
    });

    return this.handleResponse<ApiPoll>(response);
  }

  async deletePoll(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/Poll/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    await this.handleResponse<void>(response);
  }

  // Poll Options
  async getPollOptions(skip = 0, count = 10, query = ''): Promise<ApiPollOption[]> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      count: count.toString(),
      query,
    });

    const response = await fetch(`${API_BASE_URL}/api/PollOption?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<ApiPollOption[]>(response);
  }

  async createPollOption(option: Partial<ApiPollOption>): Promise<ApiPollOption> {
    const response = await fetch(`${API_BASE_URL}/api/PollOption`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(option),
    });

    return this.handleResponse<ApiPollOption>(response);
  }

  async updatePollOption(id: string, option: Partial<ApiPollOption>): Promise<ApiPollOption> {
    const response = await fetch(`${API_BASE_URL}/api/PollOption/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(option),
    });

    return this.handleResponse<ApiPollOption>(response);
  }

  async deletePollOption(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/PollOption/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    await this.handleResponse<void>(response);
  }

  // Voting
  async vote(vote: ApiVote): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/Vote`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(vote),
    });

    await this.handleResponse<void>(response);
  }

  async updateVote(vote: ApiVote): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/Vote`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(vote),
    });

    await this.handleResponse<void>(response);
  }

  async getUserVote(userId: string, pollId: string): Promise<ApiVote | null> {
    const params = new URLSearchParams({
      currentUserId: userId,
      entityPollId: pollId,
    });

    const response = await fetch(`${API_BASE_URL}/api/Vote?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    try {
      return await this.handleResponse<ApiVote>(response);
    } catch {
      return null; // No vote found
    }
  }

  async getPollOptionVoteCount(pollOptionId: string): Promise<number> {
    const params = new URLSearchParams({
      pollOptionId,
    });

    const response = await fetch(`${API_BASE_URL}/api/Vote/poll-option/vote-count?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<number>(response);
  }

  // Statistics
  async getUserVotesTotalCount(userId: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/Statistics/user-votes-total-count/${userId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<number>(response);
  }

  async getMajorityMatchPercentage(userId: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/Statistics/majority-match-percentage/${userId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<number>(response);
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiService = new ApiService();