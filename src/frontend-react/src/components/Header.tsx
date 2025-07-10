import React from 'react';
import { Vote, Plus } from 'lucide-react';

interface HeaderProps {
  onCreatePoll: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreatePoll }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Vote className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">VoteHub</h1>
              <p className="text-blue-100 text-sm">Create and manage polls effortlessly</p>
            </div>
          </div>
          
          <button
            onClick={onCreatePoll}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Poll</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;