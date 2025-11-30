import React, { useState, useEffect } from 'react';
import { CalendarDay } from './types';
import { DayWindow } from './components/DayWindow';
import { EditModal } from './components/EditModal';
import { CologneSkyline } from './components/CologneSkyline';
import { Settings, Lock, Unlock, Gift } from 'lucide-react';

const TOTAL_DAYS = 24;

// Initial data generation
const generateInitialData = (): CalendarDay[] => {
  return Array.from({ length: TOTAL_DAYS }, (_, i) => ({
    day: i + 1,
    imageUrl: '',
    linkUrl: '',
    title: '',
  }));
};

const App: React.FC = () => {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from local storage or initialize
  useEffect(() => {
    const savedData = localStorage.getItem('cologneAdventData');
    if (savedData) {
      // Migrate old data that might not have titles
      const parsed = JSON.parse(savedData);
      const migrated = parsed.map((d: any) => ({ ...d, title: d.title || '' }));
      setDays(migrated);
    } else {
      setDays(generateInitialData());
    }
  }, []);

  // Save to local storage whenever days change
  useEffect(() => {
    if (days.length > 0) {
      localStorage.setItem('cologneAdventData', JSON.stringify(days));
    }
  }, [days]);

  const handleEditClick = (day: CalendarDay) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleSaveDay = (dayNum: number, imageUrl: string, linkUrl: string, title: string) => {
    setDays((prevDays) =>
      prevDays.map((d) =>
        d.day === dayNum ? { ...d, imageUrl, linkUrl, title } : d
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-red-950/40 overflow-x-hidden flex flex-col relative font-sans">
      
      {/* Header */}
      <header className="pt-8 pb-4 px-4 text-center z-10 relative">
        <h1 className="text-4xl md:text-6xl font-bold font-christmas text-red-100 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] tracking-wide mb-2">
          Kölner Kultur Adventskalender 2025
        </h1>
        <p className="text-red-200/80 text-lg md:text-xl font-light max-w-2xl mx-auto">
          Tag für Tag wird ein verborgener Kunst- und Denkmalschatz Kölns enthüllt, neu interpretiert und überraschend in Szene gesetzt.
        </p>
      </header>

      {/* Admin Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 border border-white/10
            ${isEditMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'}
          `}
        >
          {isEditMode ? <Unlock size={16} /> : <Settings size={16} />}
          <span className="text-sm font-medium">{isEditMode ? 'Editing On' : 'Admin'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-6xl">
           {/* Info Banner in Edit Mode */}
           {isEditMode && (
            <div className="bg-blue-500/20 border border-blue-500/50 text-blue-100 px-6 py-3 rounded-lg mb-8 text-center backdrop-blur-md animate-fade-in-down">
              <p className="flex items-center justify-center gap-2">
                <Edit2Icon className="w-4 h-4" /> 
                Click any window to add or update its GIF and Link.
              </p>
            </div>
           )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {days.map((day) => (
              <DayWindow
                key={day.day}
                dayData={day}
                isEditMode={isEditMode}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer / Skyline */}
      <footer className="mt-auto relative w-full">
         <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
         <CologneSkyline className="w-full text-red-950/40 relative z-0" />
         <div className="absolute bottom-2 w-full text-center text-white/20 text-xs z-10">
            Made with holiday spirit
         </div>
      </footer>

      {/* Modals */}
      <EditModal
        dayData={selectedDay}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDay}
      />

    </div>
  );
};

// Helper icon component for inline usage
const Edit2Icon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

export default App;