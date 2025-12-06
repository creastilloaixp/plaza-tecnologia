
import { Lead } from '../types';
import { EXTERNAL_API_URL, EXTERNAL_API_KEY } from '../constants';

/**
 * Este servicio se encarga de conectar la Ruleta con el Software Externo.
 * Envía datos enriquecidos para nutrir el módulo de clientes.
 */
export const integrationService = {
  
  syncToExternalSoftware: async (lead: Lead) => {
    // Si no hay URL configurada, abortamos silenciosamente (modo desarrollo)
    if (!EXTERNAL_API_URL || EXTERNAL_API_URL.includes("tusoftware.com")) {
      console.log("⚠️ URL de Software Externo no configurada o es placeholder.");
      return;
    }

    try {
      // 1. Recolectar Metadatos de Rastreo (Tracking)
      // Intentamos obtener parámetros UTM de la URL para saber de dónde vino el usuario
      const params = new URLSearchParams(window.location.search);
      const trackingData = {
        source: params.get('utm_source') || 'direct',
        medium: params.get('utm_medium') || 'web_app',
        campaign: params.get('utm_campaign') || 'ruleta_promo',
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      };

      // 2. Construir el Payload "Producido" (Enriquecido)
      // Estructura sugerida para un CRM/CDP
      const payload = {
        event: 'lead_captured',
        data: {
          profile: {
            external_id: lead.id, // ID único para deduplicación
            first_name: lead.name.split(' ')[0],
            full_name: lead.name,
            phone: lead.phone,
            location: {
              city: lead.city,
              plaza_interest: lead.city
            },
            tags: [
              'origen:ruleta',
              `giro:${lead.businessType}`, // Etiqueta para segmentar por tipo de negocio
              'prospecto_locatario'
            ]
          },
          interaction: {
            prize_won: lead.prize,
            game_timestamp: new Date(lead.timestamp).toISOString(),
            notes: `Usuario interesado en local para ${lead.businessType}. Ganó ${lead.prize}.`
          },
          tracking: trackingData
        }
      };

      // 3. Enviar al Software Externo (API REST)
      const response = await fetch(EXTERNAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EXTERNAL_API_KEY}`, // Seguridad básica
          'X-Source-App': 'Ruleta-Plaza-Tecnologia'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("✅ Datos sincronizados con Software Externo:", responseData);
      
      return true;

    } catch (error) {
      // No bloqueamos la experiencia del usuario si falla la integración
      console.error("❌ Error conectando con Software Externo:", error);
      return false;
    }
  }
};
