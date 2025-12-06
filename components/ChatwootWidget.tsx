import React, { useEffect } from 'react';
import { UserData, Prize } from '../types';
import { CHATWOOT_BASE_URL, CHATWOOT_WEBSITE_TOKEN } from '../constants';

interface ChatwootWidgetProps {
  userData: UserData | null;
  wonPrize: Prize | null;
}

declare global {
  interface Window {
    chatwootSettings: any;
    chatwootSDK: any;
    $chatwoot: any;
  }
}

const ChatwootWidget: React.FC<ChatwootWidgetProps> = ({ userData, wonPrize }) => {
  useEffect(() => {
    // Basic validation
    if (!CHATWOOT_WEBSITE_TOKEN) return;

    // Chatwoot Settings
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right', 
      locale: 'es', 
      type: 'standard', 
    };

    // Script Injection
    (function(d, t) {
      const BASE_URL = CHATWOOT_BASE_URL;
      const g = d.createElement(t) as HTMLScriptElement;
      const s = d.getElementsByTagName(t)[0];
      g.src = BASE_URL + "/packs/js/sdk.js";
      g.defer = true;
      g.async = true;
      s.parentNode?.insertBefore(g, s);

      g.onload = function() {
        window.chatwootSDK.run({
          websiteToken: CHATWOOT_WEBSITE_TOKEN,
          baseUrl: BASE_URL
        });
      };
    })(document, "script");

  }, []);

  // Sync User Data when available
  useEffect(() => {
    if (userData && window.$chatwoot) {
      const identifier = `${userData.phone.replace(/\D/g, '')}`; // Use sanitized phone as ID
      
      window.$chatwoot.setUser(identifier, {
        email: `${identifier}@placeholder.com`, // Chatwoot often requires email, generating a fake one if not asked
        name: userData.name,
        phone_number: `+52${userData.phone.replace(/^(\+52|52)/, '')}`, // Ensure E.164 format roughly
      });

      window.$chatwoot.setCustomAttributes({
        city: userData.city,
        businessType: userData.businessType,
        prize: wonPrize ? wonPrize.label : 'Pendiente',
        stage: wonPrize ? 'Ganador' : 'Registrado'
      });
    }
  }, [userData, wonPrize]);

  // If no token is configured, don't render anything (though script injection handles most logic)
  if (!CHATWOOT_WEBSITE_TOKEN) return null;

  return null; // The widget renders itself via the script
};

export default ChatwootWidget;