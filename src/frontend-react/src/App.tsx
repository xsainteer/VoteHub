import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { PollProvider } from './contexts/PollContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationSection } from './types';
import Sidebar from './components/Sidebar';
import Discover from './components/Discover';
import Dashboard from './components/Dashboard';
import PollList from './components/PollList';
import PollForm from './components/PollForm';
import PollDetails from './components/PollDetails';
import Analytics from './components/Analytics';
import Account from './components/Account';
import Settings from './components/Settings';
import Help from './components/Help';
import LoginForm from './components/LoginForm';
import ThemeToggle from './components/ThemeToggle';
import { usePollContext } from './contexts/PollContext';
import { Poll } from './types';
import { LogIn, User } from 'lucide-react';

const AppContent: React.FC = () => {
  const { polls, loading } = usePollContext();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<NavigationSection>('discover');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'discover':
        return <Discover />;
      case 'dashboard':
        return <Dashboard />;
      case 'polls':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Poll Management</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Create, manage, and monitor all your polls in one place.</p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Create New Poll
              </button>
            </div>
            <PollList
              polls={polls}
              onPollClick={(poll) => setSelectedPoll(poll)}
            />
          </div>
        );
      case 'analytics':
        return <Analytics />;
      case 'account':
        return <Account />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      default:
        return <Discover />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors">
      {/* Authentication Status Bar */}
      <div className="fixed top-0 right-0 z-40 p-4">
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginForm(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm">Sign In</span>
            </button>
          )}
        </div>
      </div>

      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-0' : 'ml-0'
      }`}>
        <div className="p-8 pt-20">
          {renderContent()}
        </div>
      </main>

      {showCreateForm && (
        <PollForm onClose={() => setShowCreateForm(false)} />
      )}
      
      {selectedPoll && (
        <PollDetails
          poll={selectedPoll}
          onClose={() => setSelectedPoll(null)}
        />
      )}

      {showLoginForm && (
        <LoginForm onClose={() => setShowLoginForm(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PollProvider>
          <AppContent />
        </PollProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;