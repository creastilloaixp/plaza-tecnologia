
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
            id: lead.id, // We use the client-generated UUID
            name: lead.name,
            phone: lead.phone,
            city: lead.city,
            business_type: lead.businessType,
            prize: lead.prize,
            created_at: new Date(lead.timestamp).toISOString()
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

      // Map Supabase rows (snake_case) back to our App's CamelCase Lead type
      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        city: row.city,
        businessType: row.business_type,
        prize: row.prize,
        timestamp: new Date(row.created_at).getTime()
      }));

    } catch (e) {
      console.error('Supabase Exception:', e);
      return [];
    }
  }
};
