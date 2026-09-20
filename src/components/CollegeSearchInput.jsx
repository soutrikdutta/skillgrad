import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, MapPin, Check, ChevronDown, Sparkles, Building } from 'lucide-react';
import { searchIndianColleges, INDIAN_COLLEGES } from '../data/indianColleges';

export default function CollegeSearchInput({
  value = '',
  onChange,
  required = false,
  placeholder = "Search college (e.g. IIT Bombay, BITS Pilani, Jadavpur University)",
  label = "College / University",
  error = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Synchronize when value changes externally
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Compute closest match colleges
  const suggestions = searchIndianColleges(query, 8);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCollege = (collegeName) => {
    setQuery(collegeName);
    onChange(collegeName);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelectCollege(suggestions[highlightedIndex].name);
      } else if (query.trim()) {
        handleSelectCollege(query.trim());
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'IIT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'NIT':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'IIIT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Premier':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'State Govt':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
          <span>{label} {required && <span className="text-rose-400">*</span>}</span>
          <span className="text-[10px] text-indigo-400 font-normal flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> All Indian Colleges
          </span>
        </label>
      )}

      <div className="relative">
        <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          required={required}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none transition-all ${
            error 
              ? 'border-rose-500/50 focus:border-rose-500' 
              : 'border-white/[0.08] focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30'
          }`}
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer p-1"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* AUTOCOMPLETE DROPDOWN */}
      {isOpen && (
        <div 
          className="absolute left-0 right-0 top-full mt-1.5 max-h-64 overflow-y-auto bg-[#0c101c]/98 border border-indigo-500/30 rounded-xl shadow-2xl shadow-black/80 backdrop-blur-xl z-50 animate-scale-in no-scrollbar"
          style={{ transformOrigin: 'top center' }}
        >
          {/* Header indicator */}
          <div className="px-3 py-1.5 bg-slate-950/70 border-b border-white/[0.06] text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center justify-between">
            <span>Select Your College ({suggestions.length} Closest Matches)</span>
            <span className="text-indigo-400">↑↓ to navigate</span>
          </div>

          <div className="p-1 space-y-0.5">
            {suggestions.map((col, idx) => {
              const isSelected = query.toLowerCase() === col.name.toLowerCase();
              const isHighlighted = idx === highlightedIndex;

              return (
                <div
                  key={col.name}
                  onClick={() => handleSelectCollege(col.name)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`px-3 py-2 rounded-lg cursor-pointer transition-all flex items-start justify-between gap-2 text-left ${
                    isHighlighted || isSelected
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                      : 'hover:bg-white/[0.04] text-slate-300'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white truncate">
                        {col.short || col.name}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getCategoryBadgeClass(col.category)}`}>
                        {col.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {col.name}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-400" />
                      <span>{col.city}, {col.state}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  )}
                </div>
              );
            })}

            {/* Custom Option if typed query is not in list */}
            {query.trim() && !suggestions.some(c => c.name.toLowerCase() === query.toLowerCase().trim()) && (
              <div
                onClick={() => handleSelectCollege(query.trim())}
                className="mt-1 px-3 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/[0.08] text-left cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-white font-medium">
                    Use custom: <span className="font-bold text-indigo-400">"{query.trim()}"</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Can't find your college? Press enter to save your institution.</p>
                </div>
                <Check className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
