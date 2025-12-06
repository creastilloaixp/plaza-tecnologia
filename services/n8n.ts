import { Lead } from '../types';
import { N8N_WEBHOOK_POST_URL, N8N_WEBHOOK_GET_URL } from '../constants';

export const n8nService = {
  /**
   * Sends the new lead data to n8n to be processed and saved (e.g., to Google Sheets or Database)
   */
  syncLeadToCloud: async (lead: Lead) => {
    // If no URL is configured (default state), just return
    if (N8N_WEBHOOK_POST_URL.includes("tu-instancia-n8n") || N8N_WEBHOOK_POST_URL.includes("tudominio.com")) {
      console.warn("⚠️ N8N POST URL no configurada en constants.ts");
      return;
    }

    try {
      // We use 'no-cors' mode for the POST request.
      // Why? n8n webhooks often don't send the correct Access-Control-Allow-Origin headers by default.
      // 'no-cors' allows the request to be sent (so n8n receives the data), but the browser won't be able to read the response.
      // This is fine for "Fire and Forget" saving of data.
      await fetch(N8N_WEBHOOK_POST_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });
      console.log("✅ Lead enviado a n8n correctamente (Background Sync)");
    } catch (error) {
      console.error("❌ Error enviando lead a n8n:", error);
    }
  },

  /**
   * Fetches all leads from n8n (which pulls from Google Sheets/DB)
   * This allows the Dashboard to see leads captured via WhatsApp too
   */
  fetchLeadsFromCloud: async (): Promise<Lead[] | null> => {
    if (N8N_WEBHOOK_GET_URL.includes("tu-instancia-n8n") || N8N_WEBHOOK_GET_URL.includes("tudominio.com")) {
      console.warn("⚠️ N8N GET URL no configurada en constants.ts");
      return null;
    }

    try {
      // For GET requests (reading data), we DO need CORS to be working on the n8n side.
      // In n8n, ensure your 'Respond to Webhook' node (or the Webhook node itself in newer versions) 
      // allows Cross-Origin requests from '*'.
      const response = await fetch(N8N_WEBHOOK_GET_URL);
      
      if (!response.ok) throw new Error("Failed to fetch from n8n");
      
      const data = await response.json();
      
      // Ensure the data structure matches Lead[]
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("❌ Error recibiendo leads de n8n:", error);
      return null;
    }
  }
};