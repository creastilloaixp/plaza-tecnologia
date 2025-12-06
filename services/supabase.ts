
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';
import { Lead } from '../types';

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const supabaseService = {
  /**
   * Saves a new lead to the 'leads' table in Supabase.
   */
  saveLead: async (lead: Lead) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            id: lead.id,
            nombre: lead.name,       // Mapped to 'nombre'
            whatsapp: lead.phone,    // Mapped to 'whatsapp'
            ciudad: lead.city,       // Mapped to 'ciudad'
            giro: lead.businessType, // Mapped to 'giro'
            premio: lead.prize,      // Mapped to 'premio'
            created_at: new Date(lead.timestamp).toISOString(),
            // CRM Default Fields
            source: 'Ruleta',
            status: 'new',
            probabilidad: 50,
            assigned_to: 'Agente IA',
            interes_local: 'Interesado en Local' // Default context
          }
        ]);

      if (error) {
        console.error('Supabase Error (Insert):', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase Exception:', e);
      return false;
    }
  },

  /**
   * Fetches all leads from the 'leads' table.
   */
  getLeads: async (): Promise<Lead[]> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase Error (Select):', error);
        return [];
      }

      // Map Supabase rows (snake_case/Spanish) back to our App's CamelCase Lead type
      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.nombre || row.name || 'Sin Nombre', // Fallback to avoid crash
        phone: row.whatsapp || row.phone || '',
        city: row.ciudad || row.city || '',
        businessType: row.giro || row.business_type || '',
        prize: row.premio || row.prize || '',
        timestamp: new Date(row.created_at).getTime(),
        // CRM Fields
        source: row.source,
        status: row.status,
        probability: row.probabilidad,
        assigned_to: row.asignado_a
      }));

    } catch (e) {
      console.error('Supabase Exception:', e);
      return [];
    }
  }
};
