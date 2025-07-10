import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, Clock, Users, Star, Filter, Calendar, Vote, Sparkles, Siren as Fire, Eye, ArrowRight, RefreshCw, X } from 'lucide-react';
import { usePollContext } from '../contexts/PollContext';
import { Poll } from '../types';
import { getPollStatus, getTotalVotes, formatDate, hasUserVoted } from '../utils/pollUtils';
import PollCard from './PollCard';

const Discover: React.FC = () => {
  const { polls, currentUser } = usePollContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trending' | 'new' | 'ending-soon'>('all');
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  // Filter and categorize polls
  const filteredPolls = useMemo(() => {
    let filtered = polls.filter(poll => {
      const matchesSearch = poll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poll.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && getPollStatus(poll) === 'active';
    });

    switch (selectedCategory) {
      case 'trending':
        return filtered.sort((a, b) => getTotalVotes(b) - getTotalVotes(a));
      case 'new':
        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'ending-soon':
        return filtered
          .filter(poll => poll.expiresAt)
          .sort((a, b) => {
            if (!a.expiresAt || !b.expiresAt) return 0;
            return a.expiresAt.getTime() - b.expiresAt.getTime();
          });
      default:
        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }, [polls, searchTerm, selectedCategory]);

  // Get recommendations based on user activity
  const recommendations = useMemo(() => {
    const userVotedPolls = polls.filter(poll => hasUserVoted(currentUser.id, poll));
    const unvotedPolls = polls.filter(poll => 
      !hasUserVoted(currentUser.id, poll) && 
      getPollStatus(poll) === 'active'
    );

    // Simple recommendation: polls with similar vote counts to what user typically votes on
    const avgVotesUserParticipates = userVotedPolls.length > 0 
      ? userVotedPolls.reduce((sum, poll) => sum + getTotalVotes(poll), 0) / userVotedPolls.length
      : 0;

    return unvotedPolls
      .sort((a, b) => {
        const aDiff = Math.abs(getTotalVotes(a) - avgVotesUserParticipates);
        const bDiff = Math.abs(getTotalVotes(b) - avgVotesUserParticipates);
        return aDiff - bDiff;
      })
      .slice(0, 6);
  }, [polls, currentUser.id]);

  const trendingPolls = useMemo(() => {
    return polls
      .filter(poll => getPollStatus(poll) === 'active')
      .sort((a, b) => getTotalVotes(b) - getTotalVotes(a))
      .slice(0, 3);
  }, [polls]);

  const categories = [
    { id: 'all', label: 'All Polls', icon: Vote, count: filteredPolls.length },
    { id: 'trending', label: 'Trending', icon: TrendingUp, count: polls.filter(p => getPollStatus(p) === 'active').length },
    { id: 'new', label: 'New', icon: Sparkles, count: polls.filter(p => {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return p.createdAt > dayAgo && getPollStatus(p) === 'active';
    }).length },
    { id: 'ending-soon', label: 'Ending Soon', icon: Clock, count: polls.filter(p => {
      if (!p.expiresAt) return false;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return p.expiresAt < tomorrow && getPollStatus(p) === 'active';
    }).length }
  ];

  const FeaturedPollCard: React.FC<{ poll: Poll; featured?: boolean }> = ({ poll, featured = false }) => {
    const totalVotes = getTotalVotes(poll);
    const userHasVoted = hasUserVoted(currentUser.id, poll);
    const timeLeft = poll.expiresAt ? Math.max(0, poll.expiresAt.getTime() - Date.now()) : null;
    const daysLeft = timeLeft ? Math.ceil(timeLeft / (1000 * 60 * 60 * 24)) : null;

    return (
      <div 
        className={`group cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
          featured 
            ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6' 
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-600'
        }`}
        onClick={() => setSelectedPoll(poll)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 ${
              featured ? 'text-xl' : 'text-lg'
            }`}>
              {poll.name}
            </h3>
            {poll.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm line-clamp-2">{poll.description}</p>
            )}
          </div>
          {featured && (
            <div className="ml-4 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{totalVotes} votes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(poll.createdAt)}</span>
            </div>
          </div>
          {daysLeft !== null && (
            <div className={`flex items-center space-x-1 ${daysLeft <= 1 ? 'text-red-500 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'}`}>
              <Clock className="w-4 h-4" />
              <span>{daysLeft === 0 ? 'Ends today' : `${daysLeft}d left`}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {userHasVoted && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                Voted
              </span>
            )}
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
              {poll.options.length} options
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Discover Polls</h1>
          <p className="text-xl text-blue-100 mb-6">
            Explore trending polls, discover new topics, and make your voice heard in the community.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search polls by title, description, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Vote className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{polls.filter(p => getPollStatus(p) === 'active').length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Polls</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {polls.reduce((sum, poll) => sum + getTotalVotes(poll), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {polls.filter(poll => hasUserVoted(currentUser.id, poll)).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">You Participated</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Fire className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{trendingPolls.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trending Now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recommended for You</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Based on your voting activity</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((poll) => (
              <FeaturedPollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Polls */}
      {trendingPolls.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg">
              <Fire className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Trending Polls</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Most popular polls right now</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {trendingPolls.map((poll, index) => (
              <FeaturedPollCard key={poll.id} poll={poll} featured={index === 0} />
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Browse All Polls</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>Filter by category</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  <span className="font-medium text-gray-900 dark:text-white">{category.label}</span>
                </div>
                <p className={`text-sm ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {category.count} polls
                </p>
              </button>
            );
          })}
        </div>

        {/* Poll Grid */}
        {filteredPolls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onClick={() => setSelectedPoll(poll)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No polls found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm 
                ? `No polls match "${searchTerm}". Try adjusting your search terms.`
                : `No polls available in the ${selectedCategory} category.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Poll Details Modal */}
      {selectedPoll && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPoll.name}</h2>
                <button
                  onClick={() => setSelectedPoll(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedPoll.description}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Created {formatDate(selectedPoll.createdAt)} • {getTotalVotes(selectedPoll)} votes
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;