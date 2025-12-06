
import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-2 text-brand-darkRed">
            <FileText className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-tight">Términos y Condiciones</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 text-gray-700 text-sm leading-relaxed space-y-4">
          
          <h3 className="font-bold text-lg text-black">Dinámica "Gira y Gana" - Plaza de la Tecnología</h3>
          
          <p>
            Al participar en la dinámica de la ruleta virtual, el usuario acepta los siguientes términos y condiciones establecidos por <strong>Plaza de la Tecnología</strong>.
          </p>

          <div className="space-y-2">
            <h4 className="font-bold text-black">1. Elegibilidad</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>La participación es válida únicamente para mayores de 18 años residentes en la República Mexicana.</li>
              <li>La promoción está dirigida exclusivamente a nuevos locatarios o clientes interesados en rentar un local comercial.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-black">2. Mecánica y Premios</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Los premios consisten en descuentos aplicables a la renta de locales o días de gracia (renta gratis) según lo indique la ruleta.</li>
              <li>Los porcentajes de descuento (ej. 30%, 50%) aplican únicamente sobre el primer mes de renta, salvo que se especifique lo contrario en el contrato final.</li>
              <li>Los premios <strong>NO son canjeables por dinero en efectivo</strong> ni transferibles a terceros.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-black">3. Validez y Reclamación</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>El ganador tiene un plazo máximo de <strong>7 días naturales</strong> a partir de la fecha de juego para reclamar su premio presentándose en la administración de la Plaza seleccionada o contactando vía WhatsApp oficial.</li>
              <li>Es indispensable presentar la captura de pantalla del premio y una identificación oficial vigente.</li>
              <li>La validación del premio está sujeta a la disponibilidad de locales en la plaza de interés seleccionada.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-black">4. Datos Personales</h4>
            <p>
              Al registrarse, el usuario autoriza a Plaza de la Tecnología a utilizar sus datos de contacto (Nombre, Teléfono, Ciudad) para fines comerciales, seguimiento de ventas y envío de promociones, conforme a nuestro Aviso de Privacidad. Sus datos no serán compartidos con terceros ajenos a la organización.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-black">5. Generales</h4>
            <p>
              Plaza de la Tecnología se reserva el derecho de cancelar o modificar esta promoción en cualquier momento sin previo aviso en caso de detectar fraudes o fallas técnicas. Cualquier situación no prevista en estos términos será resuelta por la administración de la Plaza.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-brand-darkRed text-white font-bold rounded-lg hover:bg-red-900 transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Entendido y Aceptar
          </button>
        </div>

      </div>
    </div>
  );
};

export default TermsModal;
