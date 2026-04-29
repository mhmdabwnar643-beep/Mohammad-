import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, PlaneTakeoff, PlaneLanding, ArrowRight, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState({
    from: 'Cairo (CAI)',
    to: 'London (LHR)',
    date: '2024-05-20',
    passengers: '1 Adult'
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin size={12} /> From
          </label>
          <input 
            type="text" 
            value={searchQuery.from}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin size={12} /> To
          </label>
          <input 
            type="text" 
            value={searchQuery.to}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="w-[180px] space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} /> Date
          </label>
          <input 
            type="date" 
            value={searchQuery.date}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="w-[150px] space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Users size={12} /> Passengers
          </label>
          <select className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
            <option>1 Adult</option>
            <option>2 Adults</option>
            <option>1 Adult, 1 Child</option>
          </select>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 font-bold px-6">
          <Search size={20} /> Search
        </button>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Available Flights</h3>
          <p className="text-sm text-gray-500">Found 24 results for your route</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Flight Cards */}
      <div className="grid grid-cols-1 gap-6">
        {[
          { airline: 'EgyptAir', code: 'MS777', time: '10:00 - 14:30', duration: '4h 30m', price: '$650' },
          { airline: 'British Airways', code: 'BA154', time: '08:00 - 12:15', duration: '4h 15m', price: '$720' },
          { airline: 'Lufthansa', code: 'LH581', time: '02:00 - 06:10', duration: '4h 10m', price: '$550' },
        ].map((flight, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="bg-blue-50 p-4 rounded-2xl group-hover:bg-blue-100 transition-colors">
                <PlaneTakeoff className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{flight.airline}</h4>
                <p className="text-xs font-mono text-gray-400 uppercase">{flight.code}</p>
              </div>
            </div>

            <div className="flex items-center gap-12 text-center flex-1 justify-center">
              <div className="w-24">
                <p className="text-xl font-bold text-gray-900">{flight.time.split(' - ')[0]}</p>
                <p className="text-xs font-bold text-gray-400">CAI</p>
                <p className="text-[10px] text-gray-400">Terminal 3</p>
              </div>
              <div className="relative flex flex-col items-center flex-1 max-w-[200px]">
                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mb-1">{flight.duration}</p>
                 <div className="w-full h-px bg-blue-100 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3">
                       <PlaneTakeoff size={14} className="text-blue-600" />
                    </div>
                 </div>
                 <div className="flex gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                 </div>
              </div>
              <div className="w-24">
                <p className="text-xl font-bold text-gray-900">{flight.time.split(' - ')[1]}</p>
                <p className="text-xs font-bold text-gray-400">LHR</p>
                <p className="text-[10px] text-gray-400">Terminal 5</p>
              </div>
            </div>

            <div className="text-right flex items-center gap-6">
              <div>
                <p className="text-2xl font-black text-gray-900">{flight.price}</p>
                <p className="text-xs text-gray-400 font-medium">Round trip</p>
              </div>
              <button className="bg-gray-900 text-white rounded-xl p-3 hover:bg-gray-800 transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
