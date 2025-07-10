import React, { useState } from 'react';
import { X, Calendar, Users, Clock, CheckCircle, Trash2, Edit3, Save, RotateCcw } from 'lucide-react';
import { Poll } from '../types';
import { getPollStatus, formatDate, getTotalVotes, getOptionVotes, calculatePercentage, hasUserVoted, getUserVote } from '../utils/pollUtils';
import { usePollContext } from '../contexts/PollContext';

interface PollDetailsProps {
  poll: Poll;
  onClose: () => void;
}

const PollDetails: React.FC<PollDetailsProps> = ({ poll, onClose }) => {
  const { currentUser, vote, updateVote, deletePoll, updatePoll } = usePollContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPoll, setEditedPoll] = useState({
    name: poll.name,
    description: poll.description || '',
    expiresAt: poll.expiresAt ? poll.expiresAt.toISOString().slice(0, 16) : ''
  });
  
  const status = getPollStatus(poll);
  const totalVotes = getTotalVotes(poll);
  const userHasVoted = hasUserVoted(currentUser.id, poll);
  const userVote = getUserVote(currentUser.id, poll);
  const isCreator = poll.creatorId === currentUser.id;

  const handleVote = (optionId: string) => {
    if (status === 'active') {
      if (userHasVoted) {
        updateVote(poll.id, optionId);
      } else {
        vote(poll.id, optionId);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      deletePoll(poll.id);
      onClose();
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updatePoll(poll.id, {
        name: editedPoll.name,
        description: editedPoll.description || undefined,
        expiresAt: editedPoll.expiresAt ? new Date(editedPoll.expiresAt) : undefined
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update poll:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedPoll({
      name: poll.name,
      description: poll.description || '',
      expiresAt: poll.expiresAt ? poll.expiresAt.toISOString().slice(0, 16) : ''
    });
    setIsEditing(false);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'expired':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {status === 'active' && <Clock className="w-4 h-4 inline mr-2" />}
              {status === 'expired' && <Calendar className="w-4 h-4 inline mr-2" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
            {userHasVoted && (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">You voted</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isCreator && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Edit poll"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="p-2 text-green-500 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Save changes"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Cancel editing"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </>
            )}
            {isCreator && !isEditing && (
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete poll"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Poll Title</label>
                  <input
                    type="text"
                    value={editedPoll.name}
                    onChange={(e) => setEditedPoll(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-bold bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Poll title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    value={editedPoll.description}
                    onChange={(e) => setEditedPoll(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Poll description (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiration Date</label>
                  <input
                    type="datetime-local"
                    value={editedPoll.expiresAt}
                    onChange={(e) => setEditedPoll(prev => ({ ...prev, expiresAt: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{poll.name}</h1>
                {poll.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{poll.description}</p>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" />
                <span className="font-medium">Total Votes</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">{totalVotes}</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Created</span>
              </div>
              <p className="text-sm text-green-900 dark:text-green-300 mt-1">{formatDate(poll.createdAt)}</p>
            </div>
            
            {poll.expiresAt && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    {status === 'expired' ? 'Expired' : 'Expires'}
                  </span>
                </div>
                <p className="text-sm text-orange-900 dark:text-orange-300 mt-1">{formatDate(poll.expiresAt)}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Poll Options</h2>
              {userHasVoted && status === 'active' && (
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-sm">
                  <RotateCcw className="w-4 h-4" />
                  <span>Click any option to change your vote</span>
                </div>
              )}
            </div>
            
            {poll.options.map((option) => {
              const optionVotes = getOptionVotes(option.id, poll);
              const percentage = calculatePercentage(optionVotes, totalVotes);
              const isUserChoice = userVote === option.id;
              
              return (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 transition-all ${
                    status === 'active'
                      ? 'hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md cursor-pointer'
                      : ''
                  } ${isUserChoice ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}
                  onClick={() => handleVote(option.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                        <span>{option.name}</span>
                        {isUserChoice && <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                      </h3>
                      {option.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{option.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{percentage}%</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{optionVotes} vote{optionVotes !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isUserChoice ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-400 dark:bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {status === 'active' && !userHasVoted && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300 font-medium">
                Click on any option above to cast your vote!
              </p>
            </div>
          )}

          {status === 'active' && userHasVoted && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-green-800 dark:text-green-300 font-medium">
                You have voted! Click on any option to change your vote.
              </p>
            </div>
          )}
          
          {status === 'expired' && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-300 font-medium">
                This poll has expired. Voting is no longer available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollDetails;