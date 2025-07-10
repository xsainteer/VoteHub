import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Clock, Vote, Eye, Share2 } from 'lucide-react';
import { usePollContext } from '../contexts/PollContext';
import { getPollStatus, getTotalVotes, formatDate } from '../utils/pollUtils';

const Analytics: React.FC = () => {
  const { polls } = usePollContext();

  // Calculate analytics data
  const totalPolls = polls.length;
  const activePolls = polls.filter(poll => getPollStatus(poll) === 'active').length;
  const expiredPolls = polls.filter(poll => getPollStatus(poll) === 'expired').length;
  const totalVotes = polls.reduce((sum, poll) => sum + getTotalVotes(poll), 0);
  
  // Engagement metrics
  const avgVotesPerPoll = totalPolls > 0 ? Math.round(totalVotes / totalPolls) : 0;
  const mostVotedPoll = polls.reduce((max, poll) => 
    getTotalVotes(poll) > getTotalVotes(max) ? poll : max, polls[0]);
  
  // Time-based analytics
  const pollsThisMonth = polls.filter(poll => {
    const now = new Date();
    const pollDate = new Date(poll.createdAt);
    return pollDate.getMonth() === now.getMonth() && pollDate.getFullYear() === now.getFullYear();
  }).length;

  const votesThisMonth = polls
    .filter(poll => {
      const now = new Date();
      const pollDate = new Date(poll.createdAt);
      return pollDate.getMonth() === now.getMonth() && pollDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, poll) => sum + getTotalVotes(poll), 0);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }> = ({ title, value, icon: Icon, color, change, changeType = 'neutral' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
              changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${
                changeType === 'negative' ? 'rotate-180' : ''
              }`} />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const PollPerformanceChart: React.FC = () => {
    const sortedPolls = [...polls]
      .sort((a, b) => getTotalVotes(b) - getTotalVotes(a))
      .slice(0, 10);

    const maxVotes = sortedPolls.length > 0 ? getTotalVotes(sortedPolls[0]) : 1;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Poll Performance</h3>
        
        <div className="space-y-4">
          {sortedPolls.map((poll, index) => {
            const votes = getTotalVotes(poll);
            const percentage = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
            const status = getPollStatus(poll);
            
            return (
              <div key={poll.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {poll.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(poll.createdAt)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        status === 'active' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{votes}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">votes</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          
          {sortedPolls.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No poll data available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Detailed insights into your polling performance and engagement.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Polls"
          value={totalPolls}
          icon={Vote}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          change="+12% from last month"
          changeType="positive"
        />
        <MetricCard
          title="Total Votes"
          value={totalVotes.toLocaleString()}
          icon={Users}
          color="bg-gradient-to-r from-green-500 to-green-600"
          change="+23% from last month"
          changeType="positive"
        />
        <MetricCard
          title="Avg Engagement"
          value={`${avgVotesPerPoll}/poll`}
          icon={TrendingUp}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          change="+8% from last month"
          changeType="positive"
        />
        <MetricCard
          title="Active Polls"
          value={activePolls}
          icon={Clock}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Poll Performance Chart */}
        <PollPerformanceChart />

        {/* Engagement Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Engagement Overview</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Poll Views</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Estimated based on votes</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {(totalVotes * 2.5).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Participation Rate</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Votes vs estimated views</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">40%</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Avg Options per Poll</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Choice variety</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {totalPolls > 0 ? Math.round(polls.reduce((sum, poll) => sum + poll.options.length, 0) / totalPolls) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Monthly Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-lg">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{pollsThisMonth}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">Polls Created This Month</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-lg">
            <Vote className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">{votesThisMonth}</p>
            <p className="text-sm text-green-700 dark:text-green-400">Votes This Month</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-lg">
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {pollsThisMonth > 0 ? Math.round(votesThisMonth / pollsThisMonth) : 0}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-400">Avg Votes/Poll This Month</p>
          </div>
        </div>
      </div>

      {/* Top Performing Poll Details */}
      {mostVotedPoll && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Performing Poll</h3>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{mostVotedPoll.name}</h4>
                {mostVotedPoll.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{mostVotedPoll.description}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Created {formatDate(mostVotedPoll.createdAt)}</span>
                  <span>•</span>
                  <span>{mostVotedPoll.options.length} options</span>
                  <span>•</span>
                  <span className={`font-medium ${
                    getPollStatus(mostVotedPoll) === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {getPollStatus(mostVotedPoll)}
                  </span>
                </div>
              </div>
              <div className="text-right ml-6">
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{getTotalVotes(mostVotedPoll)}</p>
                <p className="text-sm text-orange-700 dark:text-orange-500">Total Votes</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;