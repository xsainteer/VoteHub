import React from 'react';
import { Calendar, Users, Clock, CheckCircle, Edit3 } from 'lucide-react';
import { Poll } from '../types';
import { getPollStatus, formatDate, getTotalVotes, hasUserVoted } from '../utils/pollUtils';
import { usePollContext } from '../contexts/PollContext';

interface PollCardProps {
  poll: Poll;
  onClick: () => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onClick }) => {
  const { currentUser } = usePollContext();
  const status = getPollStatus(poll);
  const totalVotes = getTotalVotes(poll);
  const userHasVoted = hasUserVoted(currentUser.id, poll);
  const isCreator = poll.creatorId === currentUser.id;

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-700';
      case 'expired':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {poll.name}
            </h3>
            {poll.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm line-clamp-2">{poll.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {isCreator && (
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full" title="You created this poll">
                <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            {userHasVoted && (
              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full" title="You voted on this poll">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            )}
            <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="capitalize">{status}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(poll.createdAt)}</span>
            </div>
          </div>
          
          {poll.expiresAt && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                {status === 'expired' ? 'Expired' : 'Expires'} {formatDate(poll.expiresAt)}
              </span>
            </div>
          )}
        </div>

        {/* Creator/Voter indicators */}
        <div className="mt-3 flex items-center space-x-2">
          {isCreator && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
              Your Poll
            </span>
          )}
          {userHasVoted && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
              Voted
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollCard;