import { Poll, PollStatus } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const getPollStatus = (poll: Poll): PollStatus => {
  if (poll.expiresAt && new Date() > poll.expiresAt) {
    return 'expired';
  }
  return 'active';
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const calculatePercentage = (votes: number, total: number): number => {
  return total === 0 ? 0 : Math.round((votes / total) * 100);
};

export const getTotalVotes = (poll: Poll): number => {
  return poll.participants.length;
};

export const getOptionVotes = (pollOptionId: string, poll: Poll): number => {
  return poll.participants.filter(vote => vote.pollOptionId === pollOptionId).length;
};

export const hasUserVoted = (userId: string, poll: Poll): boolean => {
  return poll.participants.some(vote => vote.userId === userId);
};

export const getUserVote = (userId: string, poll: Poll): string | null => {
  const vote = poll.participants.find(vote => vote.userId === userId);
  return vote ? vote.pollOptionId : null;
};