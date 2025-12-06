
import React, { useMemo, useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { supabaseService } from '../services/supabase';
import { Lead } from '../types';
import { X, Download, Trash2, Users, MapPin, Trophy, Search, RefreshCw, Cloud, Database } from 'lucide-react';

interface DashboardProps {
  onClose: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  // Data State
  const [localLeads, setLocalLeads] = useState<Lead[]>([]);
  const [supabaseLeads, setSupabaseLeads] = useState<Lead[]>([]);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');

  // Load local data on mount
  useEffect(() => {
    const data = storageService.getLeads();
    setLocalLeads(data);
  }, []);

  // Fetch Cloud Data (Supabase) when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      handleSync();
    }
  }, [isAuthenticated]);

  const handleSync = async () => {
    setIsLoadingCloud(true);
    // Fetch from Supabase
    const data = await supabaseService.getLeads();
    if (data) {
      setSupabaseLeads(data);
    }
    setIsLoadingCloud(false);
  };

  // Merge Local and Cloud leads, prioritizing Cloud (Supabase) and removing duplicates
  const allLeads = useMemo(() => {
    // 1. Start with Supabase data (Single Source of Truth)
    const combined = [...supabaseLeads];
    
    // 2. Add local leads ONLY if they aren't in Supabase yet (pending sync)
    localLeads.forEach(localLead => {
      if (!combined.find(l => l.id === localLead.id)) {
        combined.push(localLead);
      }
    });

    // Sort by timestamp desc
    return combined.sort((a, b) => b.timestamp - a.timestamp);
  }, [localLeads, supabaseLeads]);

  const stats = useMemo(() => {
    const total = allLeads.length;
    const visits = storageService.getVisits();
    const conversionRate = visits > 0 ? ((total / visits) * 100).toFixed(1) : "0";

    const byPrize = allLeads.reduce((acc, curr) => {
      acc[curr.prize] = (acc[curr.prize] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCity = allLeads.reduce((acc, curr) => {
      acc[curr.city] = (acc[curr.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byPrize, byCity, visits, conversionRate };
  }, [allLeads]);

  const filteredLeads = useMemo(() => {
    return allLeads.filter(lead => 
      (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').includes(searchTerm) ||
      (lead.city || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allLeads, searchTerm]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2024') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('PIN Incorrecto');
      setPin('');
    }
  };

  const exportCSV = () => {
    if (filteredLeads.length === 0) return;

    const headers = ['ID', 'Nombre', 'Teléfono', 'Ciudad', 'Giro', 'Premio', 'Fecha'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        `"${lead.id}"`,
        `"${lead.name}"`,
        `"${lead.phone}"`,
        `"${lead.city}"`,
        `"${lead.businessType}"`,
        `"${lead.prize}"`,
        `"${new Date(lead.timestamp).toLocaleString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_plaza_produccion_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
          <h2 className="text-2xl font-black text-brand-dark mb-2 text-center">🔐 Acceso Restringido</h2>
          <p className="text-gray-500 text-center mb-6 text-sm">Ingresa el PIN de administrador para ver los datos.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center text-3xl tracking-[1em] font-bold border-b-2 border-brand-red focus:border-brand-darkRed outline-none py-2 text-brand-dark"
              placeholder="••••"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
            >
              Entrar
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="w-full text-gray-400 text-xs hover:text-gray-600 mt-2"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col animate-in slide-in-from-bottom duration-300 font-sans text-gray-800 overflow-hidden">
      
      {/* Header */}
      <div className="bg-brand-dark px-6 py-4 flex flex-col md:flex-row items-center justify-between text-white shadow-md gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            📊 Dashboard (Supabase)
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-400">
             <Cloud className="w-3 h-3 text-green-400" />
             <span>Nube: {supabaseLeads.length}</span>
             <span className="text-gray-600">|</span>
             <Database className="w-3 h-3" />
             <span>Local: {localLeads.length}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar lead..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/20"
            />
          </div>

          <button 
            onClick={handleSync}
            className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ${isLoadingCloud ? 'animate-spin' : ''}`}
            title="Refrescar datos de Supabase"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" /> <span className="hidden md:inline">Exportar</span>
          </button>
          <button 
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Total Registros</p>
                <h3 className="text-2xl font-black text-gray-900">{stats.total}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
               <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Tasa Conversión</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-black text-gray-900">{stats.conversionRate}%</h3>
                  <span className="text-xs text-gray-400">({stats.visits} visitas)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Ciudades</p>
                <h3 className="text-2xl font-black text-gray-900">{Object.keys(stats.byCity).length}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Premios</p>
                <h3 className="text-2xl font-black text-gray-900">{stats.total}</h3>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Cities */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 text-sm uppercase tracking-wide">📍 Top Ciudades</h3>
              <div className="space-y-3">
                {(Object.entries(stats.byCity) as [string, number][])
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([city, count]) => (
                    <div key={city} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{city}</span>
                          <span className="text-gray-500">{count}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-brand-red h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Prize Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 text-sm uppercase tracking-wide">🎁 Distribución de Premios</h3>
              <div className="space-y-3">
                {(Object.entries(stats.byPrize) as [string, number][])
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5) // Show top 5 only to save space
                  .map(([prize, count]) => (
                    <div key={prize} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium truncate">{prize}</span>
                          <span className="text-gray-500">{count}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-brand-yellow h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                Registros ({filteredLeads.length})
              </h3>
              <button 
                onClick={() => storageService.clearData()}
                className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3 h-3" /> Borrar caché local
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-gray-500 font-medium uppercase text-xs border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">WhatsApp</th>
                    <th className="px-6 py-4">Ciudad</th>
                    <th className="px-6 py-4">Premio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.slice(0, 50).map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        <div className="flex flex-col">
                           <span>{new Date(lead.timestamp).toLocaleDateString()}</span>
                           <span className="text-[10px] text-gray-400">{new Date(lead.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-xs">{lead.phone}</td>
                      <td className="px-6 py-4 text-gray-600">
                         <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" /> {lead.city}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-100 text-yellow-800 tracking-wide">
                          {lead.prize}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                           <Users className="w-12 h-12 mb-2 opacity-20" />
                           <p>No se encontraron registros.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
