import { useState, useEffect } from 'react';
import { apiService, ApiPoll } from '../services/api';

export const usePolls = () => {
  const [polls, setPolls] = useState<ApiPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolls = async (skip = 0, count = 50, query = '') => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPolls = await apiService.getPolls(skip, count, query);
      setPolls(fetchedPolls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  };

  const createPoll = async (pollData: Partial<ApiPoll>) => {
    try {
      const newPoll = await apiService.createPoll(pollData);
      setPolls(prev => [newPoll, ...prev]);
      return newPoll;
    } catch (err) {
      throw err;
    }
  };

  const updatePoll = async (id: string, pollData: Partial<ApiPoll>) => {
    try {
      const updatedPoll = await apiService.updatePoll(id, pollData);
      setPolls(prev => prev.map(poll => poll.id.toString() === id ? updatedPoll : poll));
      return updatedPoll;
    } catch (err) {
      throw err;
    }
  };

  const deletePoll = async (id: string) => {
    try {
      await apiService.deletePoll(id);
      setPolls(prev => prev.filter(poll => poll.id.toString() !== id));
    } catch (err) {
      throw err;
    }
  };

  const vote = async (pollId: number, pollOptionId: number) => {
    try {
      await apiService.vote({ pollId, pollOptionId });
      // Refresh the specific poll to get updated vote counts
      const updatedPoll = await apiService.getPoll(pollId.toString());
      setPolls(prev => prev.map(poll => poll.id === pollId ? updatedPoll : poll));
    } catch (err) {
      throw err;
    }
  };

  const updateVote = async (pollId: number, pollOptionId: number) => {
    try {
      await apiService.updateVote({ pollId, pollOptionId });
      // Refresh the specific poll to get updated vote counts
      const updatedPoll = await apiService.getPoll(pollId.toString());
      setPolls(prev => prev.map(poll => poll.id === pollId ? updatedPoll : poll));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return {
    polls,
    loading,
    error,
    fetchPolls,
    createPoll,
    updatePoll,
    deletePoll,
    vote,
    updateVote,
    refetch: () => fetchPolls(),
  };
};