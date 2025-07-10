import React from 'react';
import { BarChart3, Users, Vote, TrendingUp, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { usePollContext } from '../contexts/PollContext';
import { getPollStatus, getTotalVotes, formatDate } from '../utils/pollUtils';

const Dashboard: React.FC = () => {
  const { polls } = usePollContext();

  const stats = {
    totalPolls: polls.length,
    activePolls: polls.filter(poll => getPollStatus(poll) === 'active').length,
    totalVotes: polls.reduce((sum, poll) => sum + getTotalVotes(poll), 0),
    avgVotesPerPoll: polls.length > 0 ? Math.round(polls.reduce((sum, poll) => sum + getTotalVotes(poll), 0) / polls.length) : 0
  };

  const recentPolls = polls.slice(0, 5);
  const topPolls = [...polls]
    .sort((a, b) => getTotalVotes(b) - getTotalVotes(a))
    .slice(0, 5);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's what's happening with your polls.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Polls"
          value={stats.totalPolls}
          icon={Vote}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend="+12% from last month"
        />
        <StatCard
          title="Active Polls"
          value={stats.activePolls}
          icon={Clock}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Total Votes"
          value={stats.totalVotes.toLocaleString()}
          icon={Users}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend="+23% from last month"
        />
        <StatCard
          title="Avg Votes/Poll"
          value={stats.avgVotesPerPoll}
          icon={BarChart3}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Polls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Polls</h2>
            <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {recentPolls.length > 0 ? recentPolls.map((poll) => {
              const status = getPollStatus(poll);
              const totalVotes = getTotalVotes(poll);
              
              return (
                <div key={poll.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{poll.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Created {formatDate(poll.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{totalVotes} votes</p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        status === 'active' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      }`}>
                        {status === 'active' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {status}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8">
                <Vote className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No polls created yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Polls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Performing</h2>
            <TrendingUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {topPolls.length > 0 ? topPolls.map((poll, index) => {
              const totalVotes = getTotalVotes(poll);
              const status = getPollStatus(poll);
              
              return (
                <div key={poll.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                    index === 1 ? 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300' :
                    index === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{poll.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{totalVotes} votes</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        status === 'active' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No poll data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          {polls.slice(0, 3).map((poll) => (
            <div key={poll.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Poll created:</span> {poll.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatDate(poll.createdAt)} • {getTotalVotes(poll)} votes received
                </p>
              </div>
            </div>
          ))}
          
          {polls.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;