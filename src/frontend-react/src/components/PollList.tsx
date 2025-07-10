import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Users } from 'lucide-react';
import { Poll } from '../types';
import { getPollStatus, getTotalVotes } from '../utils/pollUtils';
import PollCard from './PollCard';

interface PollListProps {
  polls: Poll[];
  onPollClick: (poll: Poll) => void;
}

const PollList: React.FC<PollListProps> = ({ polls, onPollClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostVotes'>('newest');

  const filteredAndSortedPolls = useMemo(() => {
    let filtered = polls.filter(poll => {
      const matchesSearch = poll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poll.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || getPollStatus(poll) === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'mostVotes':
          return getTotalVotes(b) - getTotalVotes(a);
        default:
          return 0;
      }
    });

    return filtered;
  }, [polls, searchTerm, statusFilter, sortBy]);

  const getStatusCounts = () => {
    const active = polls.filter(poll => getPollStatus(poll) === 'active').length;
    const expired = polls.filter(poll => getPollStatus(poll) === 'expired').length;
    return { active, expired };
  };

  const { active, expired } = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search polls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'expired')}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Polls ({polls.length})</option>
                <option value="active">Active ({active})</option>
                <option value="expired">Expired ({expired})</option>
              </select>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'mostVotes')}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostVotes">Most Votes</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedPolls.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No polls found' : 'No polls yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first poll to get started with gathering opinions and feedback.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPolls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onClick={() => onPollClick(poll)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PollList;