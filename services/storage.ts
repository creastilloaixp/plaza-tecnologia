import { Lead } from '../types';

const STORAGE_KEY = 'plaza_tecnologia_leads';
const VISITS_KEY = 'plaza_tecnologia_visits';

export const storageService = {
  saveLead: (lead: Lead) => {
    try {
      const existing = storageService.getLeads();
      const updated = [lead, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving lead', e);
    }
  },

  getLeads: (): Lead[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading leads', e);
      return [];
    }
  },

  recordVisit: () => {
    try {
      const current = parseInt(localStorage.getItem(VISITS_KEY) || '0', 10);
      localStorage.setItem(VISITS_KEY, (current + 1).toString());
    } catch (e) {
      console.error('Error recording visit', e);
    }
  },

  getVisits: (): number => {
    try {
      return parseInt(localStorage.getItem(VISITS_KEY) || '0', 10);
    } catch (e) {
      console.error('Error reading visits', e);
      return 0;
    }
  },

  getStats: () => {
    const leads = storageService.getLeads();
    const total = leads.length;
    
    // Group by Prize
    const byPrize = leads.reduce((acc, curr) => {
      acc[curr.prize] = (acc[curr.prize] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by City
    const byCity = leads.reduce((acc, curr) => {
      acc[curr.city] = (acc[curr.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byPrize, byCity };
  },

  exportToCSV: () => {
    const leads = storageService.getLeads();
    if (leads.length === 0) return;

    const headers = ['Nombre', 'Teléfono', 'Ciudad', 'Giro', 'Premio', 'Fecha'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
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
    link.setAttribute('download', `leads_plaza_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  
  clearData: () => {
    if (confirm('¿Estás seguro de borrar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VISITS_KEY);
      window.location.reload();
    }
  }
};