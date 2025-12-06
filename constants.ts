
import { Prize } from './types';

// WhatsApp number for Plaza de la Tecnología
export const WHATSAPP_NUMBER = "5216673442996";

// =================================================================================
// ⚡ SUPABASE CONFIGURATION (PRODUCCIÓN - BD INTERNA)
// =================================================================================
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// =================================================================================
// 🌐 INTEGRACIÓN CON SOFTWARE EXTERNO (CRM / ERP EN DESARROLLO)
// =================================================================================
// Cambia esto por la URL real de tu software cuando esté listo
export const EXTERNAL_API_URL = "https://api.tusoftware.com/v1/leads/ingest"; 
export const EXTERNAL_API_KEY = "tu_api_key_segura_aqui"; 

// =================================================================================
// 🚀 CONEXIÓN CON N8N (OPCIONAL / LEGACY)
// =================================================================================
export const N8N_WEBHOOK_POST_URL = "https://tu-instancia-n8n.hostinger.com/webhook/crear-lead-ruleta"; 
export const N8N_WEBHOOK_GET_URL = "https://tu-instancia-n8n.hostinger.com/webhook/obtener-leads-dashboard";

// =================================================================================
// 💬 CHATWOOT CONFIGURATION
// =================================================================================
export const CHATWOOT_WEBSITE_TOKEN: string = ""; 
export const CHATWOOT_BASE_URL = "https://app.chatwoot.com";

// =================================================================================

export const PLAZAS = [
  "CDMX - Centro",
  "CDMX - Pericentro",
  "Guadalajara",
  "Monterrey",
  "Puebla",
  "León",
  "Toluca",
  "Querétaro",
  "San Luis Potosí",
  "Mérida",
  "Chihuahua",
  "Tijuana"
];

export const PRIZES: Prize[] = [
  { 
    id: '1', 
    label: '50% de Descuento en Renta', 
    shortLabel: '50% DSCTO', 
    color: '#D90429', 
    textColor: '#FFD60A',
    weight: 10 
  },
  { 
    id: '2', 
    label: '30% de Descuento en Renta', 
    shortLabel: '30% DSCTO', 
    color: '#FFD60A', 
    textColor: '#D90429',
    weight: 20 
  },
  { 
    id: '3', 
    label: '45 Días de Renta Gratis', 
    shortLabel: '45 DÍAS', 
    color: '#D90429', 
    textColor: '#FFD60A',
    weight: 15 
  },
  { 
    id: '4', 
    label: '60 Días de Renta Gratis', 
    shortLabel: '60 DÍAS', 
    color: '#FFD60A', 
    textColor: '#D90429',
    weight: 5 
  },
  { 
    id: '5', 
    label: '30% Descuento + 5 Días Gratis', 
    shortLabel: '30% + 5D', 
    color: '#D90429', 
    textColor: '#FFD60A',
    weight: 15 
  },
  { 
    id: '6', 
    label: '3 Días de Renta Gratis', 
    shortLabel: '3 DÍAS', 
    color: '#FFD60A', 
    textColor: '#D90429',
    weight: 25 
  },
  { 
    id: '7', 
    label: '50% de Descuento o Días Gratis', 
    shortLabel: '50% O DÍAS', 
    color: '#D90429', 
    textColor: '#FFD60A',
    weight: 5 
  },
  { 
    id: '8', 
    label: '30% Descuento + 10 Días Gratis', 
    shortLabel: '30% + 10G', 
    color: '#FFD60A', 
    textColor: '#D90429',
    weight: 5 
  }
];

export const INITIAL_TIME_SECONDS = 300; // 5 minutes
