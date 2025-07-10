import React, { createContext, useContext, useState, useEffect } from 'react';
import { Poll, User, convertApiPollToLocal, convertLocalPollToApi } from '../types';
import { usePolls } from '../hooks/usePolls';
import { useAuth } from '../hooks/useAuth';
import { generateId } from '../utils/pollUtils';

interface PollContextType {
  polls: Poll[];
  currentUser: User;
  loading: boolean;
  error: string | null;
  createPoll: (poll: Omit<Poll, 'id' | 'createdAt' | 'creatorId' | 'participants'>) => Promise<void>;
  updatePoll: (pollId: string, poll: Partial<Poll>) => Promise<void>;
  vote: (pollId: string, optionId: string) => Promise<void>;
  updateVote: (pollId: string, optionId: string) => Promise<void>;
  deletePoll: (pollId: string) => Promise<void>;
  refetchPolls: () => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const usePollContext = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePollContext must be used within a PollProvider');
  }
  return context;
};

export const PollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { polls: apiPolls, loading, error, createPoll: createApiPoll, updatePoll: updateApiPoll, vote: apiVote, updateVote: apiUpdateVote, deletePoll: deleteApiPoll, refetch } = usePolls();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentUser] = useState<User>({
    id: generateId(),
    name: user?.email?.split('@')[0] || 'Guest User',
    email: user?.email || 'guest@example.com',
    joinedAt: new Date()
  });

  // Convert API polls to local format
  useEffect(() => {
    const convertedPolls = apiPolls.map(convertApiPollToLocal);
    setPolls(convertedPolls);
  }, [apiPolls]);

  // Fallback to localStorage for offline functionality
  useEffect(() => {
    if (!isAuthenticated) {
      const savedPolls = localStorage.getItem('votehub-polls');
      if (savedPolls && polls.length === 0) {
        const parsedPolls = JSON.parse(savedPolls);
        const pollsWithDates = parsedPolls.map((poll: any) => ({
          ...poll,
          createdAt: new Date(poll.createdAt),
          expiresAt: poll.expiresAt ? new Date(poll.expiresAt) : null,
          participants: poll.participants.map((vote: any) => ({
            ...vote,
            votedAt: new Date(vote.votedAt)
          }))
        }));
        setPolls(pollsWithDates);
      }
    }
  }, [isAuthenticated, polls.length]);

  // Save to localStorage for offline functionality
  useEffect(() => {
    if (!isAuthenticated && polls.length > 0) {
      localStorage.setItem('votehub-polls', JSON.stringify(polls));
    }
  }, [polls, isAuthenticated]);

  const createPoll = async (pollData: Omit<Poll, 'id' | 'createdAt' | 'creatorId' | 'participants'>) => {
    if (isAuthenticated) {
      try {
        const apiPollData = convertLocalPollToApi({
          ...pollData,
          createdAt: new Date(),
          creatorId: currentUser.id,
          participants: []
        });

        // Create poll with options
        const pollToCreate = {
          ...apiPollData,
          options: pollData.options.map(option => ({
            name: option.name,
            votesCount: 0,
            pollId: 0, // Will be set by backend
          }))
        };

        await createApiPoll(pollToCreate);
      } catch (err) {
        console.error('Failed to create poll:', err);
        throw err;
      }
    } else {
      // Offline mode - use localStorage
      const newPoll: Poll = {
        ...pollData,
        id: generateId(),
        createdAt: new Date(),
        creatorId: currentUser.id,
        participants: [],
        options: pollData.options.map(option => ({
          ...option,
          id: generateId(),
          pollId: '',
          votes: []
        }))
      };
      
      newPoll.options.forEach(option => {
        option.pollId = newPoll.id;
      });

      setPolls(prev => [newPoll, ...prev]);
    }
  };

  const updatePoll = async (pollId: string, pollData: Partial<Poll>) => {
    if (isAuthenticated) {
      try {
        const apiPollData = convertLocalPollToApi(pollData);
        await updateApiPoll(pollId, apiPollData);
      } catch (err) {
        console.error('Failed to update poll:', err);
        throw err;
      }
    } else {
      // Offline mode
      setPolls(prev => prev.map(poll => 
        poll.id === pollId ? { ...poll, ...pollData } : poll
      ));
    }
  };

  const vote = async (pollId: string, optionId: string) => {
    if (isAuthenticated) {
      try {
        await apiVote(parseInt(pollId), parseInt(optionId));
      } catch (err) {
        console.error('Failed to vote:', err);
        throw err;
      }
    } else {
      // Offline mode
      setPolls(prev => prev.map(poll => {
        if (poll.id === pollId) {
          const filteredParticipants = poll.participants.filter(vote => vote.userId !== currentUser.id);
          
          return {
            ...poll,
            participants: [
              ...filteredParticipants,
              {
                pollId,
                pollOptionId: optionId,
                userId: currentUser.id,
                votedAt: new Date()
              }
            ]
          };
        }
        return poll;
      }));
    }
  };

  const updateVote = async (pollId: string, optionId: string) => {
    if (isAuthenticated) {
      try {
        await apiUpdateVote(parseInt(pollId), parseInt(optionId));
      } catch (err) {
        console.error('Failed to update vote:', err);
        throw err;
      }
    } else {
      // Offline mode - same as vote since we replace the user's vote
      await vote(pollId, optionId);
    }
  };

  const deletePoll = async (pollId: string) => {
    if (isAuthenticated) {
      try {
        await deleteApiPoll(pollId);
      } catch (err) {
        console.error('Failed to delete poll:', err);
        throw err;
      }
    } else {
      // Offline mode
      setPolls(prev => prev.filter(poll => poll.id !== pollId));
    }
  };

  return (
    <PollContext.Provider value={{
      polls,
      currentUser,
      loading,
      error,
      createPoll,
      updatePoll,
      vote,
      updateVote,
      deletePoll,
      refetchPolls: refetch
    }}>
      {children}
    </PollContext.Provider>
  );
};