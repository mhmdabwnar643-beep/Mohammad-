/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GdsTerminal } from './components/GdsTerminal';
import { AIAssistant } from './components/AIAssistant';
import { Dashboard } from './components/Dashboard';
import { 
  Plane, 
  Terminal as TerminalIcon, 
  BookOpen, 
  Settings, 
  HelpCircle,
  Menu,
  X,
  CreditCard,
  User,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'dashboard' | 'history'>('terminal');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#f3f4f6] overflow-hidden font-sans text-gray-900">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="bg-[#002855] text-white flex flex-col shadow-xl z-20"
      >
        <div className="p-6 flex items-center justify-between border-b border-blue-900/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Plane size={24} />
            </div>
            {sidebarOpen && <h1 className="font-bold text-xl tracking-tight">AMADEUS</h1>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-blue-800 rounded transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'terminal', icon: TerminalIcon, label: 'GDS Terminal' },
            { id: 'dashboard', icon: LayoutDashboard, label: 'Search' },
            { id: 'history', icon: BookOpen, label: 'Ticketing' },
            { id: 'payment', icon: CreditCard, label: 'Payments' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <item.icon size={22} className="flex-shrink-0" />
              {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-900/50 space-y-2">
          <button className="w-full flex items-center gap-4 p-3 text-blue-100 hover:bg-blue-800 rounded-lg transition-colors">
            <Settings size={22} className="flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Settings</span>}
          </button>
          <button className="w-full flex items-center gap-4 p-3 text-blue-100 hover:bg-blue-800 rounded-lg transition-colors">
            <User size={22} className="flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Profile</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {activeTab === 'terminal' ? 'GDS Terminal' : activeTab}
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              CAI1P0987 - CONNECTED
            </div>
          </div>
          <div className="flex items-center gap-4">
            <HelpCircle size={20} className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" />
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="flex-1 overflow-hidden p-8 flex gap-8">
          {/* Main Workspace */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <AnimatePresence mode="wait">
              {activeTab === 'terminal' && (
                <motion.div 
                  key="terminal"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1"
                >
                  <GdsTerminal />
                </motion.div>
              )}
              {activeTab === 'dashboard' && (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 overflow-y-auto pr-2"
                >
                  <Dashboard />
                </motion.div>
              )}
              {activeTab !== 'terminal' && activeTab !== 'dashboard' && (
                <motion.div 
                  key="other"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="bg-gray-100 p-6 rounded-full text-gray-400">
                    <BookOpen size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Module Under Training</h3>
                  <p className="text-gray-500 max-w-sm">
                    The {activeTab} module is part of the advanced GDS courses. Please use the Terminal for basic training.
                  </p>
                  <button 
                    onClick={() => setActiveTab('terminal')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Back to Terminal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Side Panel */}
          <div className="w-[400px] shrink-0 h-full hidden lg:block">
            <AIAssistant />
          </div>
        </div>
      </main>
    </div>
  );
}

