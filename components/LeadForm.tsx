
import React, { useState } from 'react';
import { UserData } from '../types';
import { PLAZAS } from '../constants';
import { User, Smartphone, MapPin, Briefcase } from 'lucide-react';
import TermsModal from './TermsModal';

interface LeadFormProps {
  onSubmit: (data: UserData) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    phone: '',
    city: '',
    businessType: ''
  });
  
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.city) {
      onSubmit(formData);
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-brand-red p-4 text-center">
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">
            Regístrate para Girar
          </h3>
          <p className="text-brand-yellow text-sm font-medium">
            ¡Estás a un paso de ganar!
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all text-gray-900"
                placeholder="Ej. Carlos Hernández"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                required
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all text-gray-900"
                placeholder="Ej. 55 1234 5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plaza de Interés</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <select
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all text-gray-900 appearance-none bg-white"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="">Selecciona una ciudad/plaza</option>
                {PLAZAS.map((plaza) => (
                  <option key={plaza} value={plaza}>{plaza}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giro del Negocio</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all text-gray-900"
                placeholder="Ej. Ropa, Tecnología, Comida..."
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-500 mb-4 text-center">
              Al registrarte aceptas nuestros{' '}
              <button 
                type="button"
                onClick={() => setShowTerms(true)}
                className="underline cursor-pointer text-brand-red hover:text-brand-darkRed font-semibold focus:outline-none"
              >
                Términos y Condiciones
              </button>{' '}
              y Aviso de Privacidad.
            </p>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-yellow to-brand-gold hover:from-brand-gold hover:to-yellow-300 text-brand-darkRed font-black py-4 rounded-xl shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-1 transition-all text-xl uppercase tracking-widest"
            >
              ¡Girar Ruleta!
            </button>
          </div>
        </form>
      </div>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  );
};

export default LeadForm;
