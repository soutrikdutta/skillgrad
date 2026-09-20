import React, { useState, useEffect } from 'react';
import { dbService } from '../firebase/dbService';
import { useAuth } from '../context/AuthContext';
import { 
  ClipboardList, Clock, CheckCircle2, XCircle, HelpCircle,
  Building2, MapPin, DollarSign, Briefcase, ChevronDown, ChevronUp
} from 'lucide-react';

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

  const loadApplications = () => {
    if (!user) return;
    const local = dbService.getStudentApplications(user);
    setApplications(local);
    
    dbService.fetchStudentApplications(user).then((apps) => {
      if (apps && Array.isArray(apps) && apps.length > 0) {
        setApplications(apps);
      }
    });
  };

  useEffect(() => {
    loadApplications();

    const handleChange = () => loadApplications();
    window.addEventListener('skillgrad_application_submitted', handleChange);
    window.addEventListener('skillgrad_application_status_changed', handleChange);
    return () => {
      window.removeEventListener('skillgrad_application_submitted', handleChange);
      window.removeEventListener('skillgrad_application_status_changed', handleChange);
    };
  }, [user]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'accepted':
        return { 
          label: 'Accepted', 
          icon: CheckCircle2, 
          bg: 'bg-emerald-500/10', 
          border: 'border-emerald-500/25', 
          text: 'text-emerald-400',
          dot: 'bg-emerald-400'
        };
      case 'rejected':
        return { 
          label: 'Rejected', 
          icon: XCircle, 
          bg: 'bg-rose-500/10', 
          border: 'border-rose-500/25', 
          text: 'text-rose-400',
          dot: 'bg-rose-400'
        };
      default:
        return { 
          label: 'Not Responded', 
          icon: Clock, 
          bg: 'bg-amber-500/10', 
          border: 'border-amber-500/25', 
          text: 'text-amber-400',
          dot: 'bg-amber-400'
        };
    }
  };

  const filteredApps = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !app.status || app.status === 'pending';
    return app.status === filter;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter(a => !a.status || a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (!user) return null;

  return (
    <section id="my-applications" className="py-12 sm:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold text-indigo-400 mb-3 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <ClipboardList className="w-3.5 h-3.5 ml-0.5" />
            Live Application Tracker
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
            <span className="flow-gradient-text">My Applications</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time status updates directly synchronized with hiring partner decisions.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 stagger-children">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'rejected', label: 'Rejected' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                filter === tab.key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-white/[0.06]'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === tab.key ? 'bg-white/20' : 'bg-white/[0.06]'
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-14 glass-panel rounded-2xl space-y-3 animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mx-auto text-indigo-400">
              <ClipboardList className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">
              {filter === 'all' ? 'No Applications Yet' : `No ${filter} applications`}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {filter === 'all' 
                ? 'Apply to internships above and track their status here.' 
                : 'No applications with this status right now.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {filteredApps.map((app) => {
              const status = getStatusConfig(app.status);
              const StatusIcon = status.icon;
              const isExpanded = expandedId === app.id;

              return (
                <div key={app.id} className="glass-panel-interactive rounded-2xl overflow-hidden transition-all duration-300">
                  {/* Main Row */}
                  <div 
                    className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                  >
                    {/* Status Beacon Dot */}
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.dot}`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${status.dot}`}></span>
                    </span>
                    
                    {/* Job info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-indigo-200 transition-colors">{app.jobTitle || 'Internship Role'}</h4>
                      <p className="text-[12px] text-slate-300 truncate flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.companyName || 'Company'}</span>
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${status.bg} ${status.border} ${status.text} border shrink-0 shadow-sm`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </div>

                    {/* Expand toggle */}
                    <div className="shrink-0 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-white/[0.06] animate-slide-up" style={{ animationDuration: '0.25s' }}>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                        <div>
                          <span className="text-slate-500 block mb-0.5">Applied On</span>
                          <span className="text-slate-200 font-medium">
                            {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </span>
                        </div>
                        {app.college && (
                          <div>
                            <span className="text-slate-500 block mb-0.5">College</span>
                            <span className="text-slate-200 font-medium">{app.college}</span>
                          </div>
                        )}
                        {app.coverNote && (
                          <div className="col-span-2">
                            <span className="text-slate-500 block mb-0.5">Your Note</span>
                            <span className="text-slate-300 italic text-[12px]">"{app.coverNote}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
