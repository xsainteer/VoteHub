import React from 'react';
import { 
  BarChart3, 
  Vote, 
  User, 
  Settings, 
  HelpCircle, 
  Home,
  PlusCircle,
  TrendingUp,
  Users,
  Calendar,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Compass
} from 'lucide-react';
import { NavigationSection } from '../types';
import { useAuth } from '../hooks/useAuth';
import { usePollContext } from '../contexts/PollContext';

interface SidebarProps {
  activeSection: NavigationSection;
  onSectionChange: (section: NavigationSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isCollapsed,
  onToggleCollapse 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { polls } = usePollContext();

  const navigationItems = [
    {
      id: 'discover' as NavigationSection,
      label: 'Discover',
      icon: Compass,
      description: 'Find & explore polls'
    },
    {
      id: 'dashboard' as NavigationSection,
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & insights'
    },
    {
      id: 'polls' as NavigationSection,
      label: 'Poll Management',
      icon: Vote,
      description: 'Create & manage polls'
    },
    {
      id: 'analytics' as NavigationSection,
      label: 'Analytics',
      icon: BarChart3,
      description: 'Performance metrics'
    },
    {
      id: 'account' as NavigationSection,
      label: 'Account',
      icon: User,
      description: 'Profile & preferences'
    }
  ];

  const secondaryItems = [
    {
      id: 'settings' as NavigationSection,
      label: 'Settings',
      icon: Settings,
      description: 'App configuration'
    },
    {
      id: 'help' as NavigationSection,
      label: 'Help & Support',
      icon: HelpCircle,
      description: 'Get assistance'
    }
  ];

  const quickActions = [
    { label: 'New Poll', icon: PlusCircle, action: () => {} },
    { label: 'View Reports', icon: TrendingUp, action: () => {} },
    { label: 'Manage Users', icon: Users, action: () => {} }
  ];

  // Calculate stats
  const totalPolls = polls.length;
  const totalVotes = polls.reduce((sum, poll) => sum + poll.participants.length, 0);
  const activePolls = polls.filter(poll => {
    if (!poll.expiresAt) return true;
    return new Date() < poll.expiresAt;
  }).length;

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-72'
    } overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className={`flex items-center transition-all duration-300 ${
            isCollapsed ? 'justify-center w-full' : 'space-x-3'
          }`}>
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex-shrink-0">
              <Vote className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">VoteHub</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Polling Platform</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ${
              isCollapsed ? 'ml-0' : 'ml-2'
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {isAuthenticated ? (user?.email?.split('@')[0] || 'User') : 'Guest User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {isAuthenticated ? user?.email : 'Not signed in'}
              </p>
            </div>
            <Bell className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                } ${isCollapsed ? 'justify-center p-3' : 'space-x-3 px-3 py-3'}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                {!isCollapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-medium truncate">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.description}</div>
                  </div>
                )}
                {!isCollapsed && isActive && (
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="pt-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats */}
        {!isCollapsed && (
          <div className="pt-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {isAuthenticated ? 'Your Stats' : 'Local Stats'}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Polls Created</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{totalPolls}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Total Votes</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{totalVotes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Active Polls</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{activePolls}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="space-y-1">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                } ${isCollapsed ? 'justify-center p-3' : 'space-x-3 px-3 py-2'}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
              </button>
            );
          })}
          
          {isAuthenticated && (
            <button 
              onClick={logout}
              className={`w-full flex items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${
                isCollapsed ? 'justify-center p-3' : 'space-x-3 px-3 py-2'
              }`}
              title={isCollapsed ? 'Sign Out' : undefined}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">Sign Out</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;