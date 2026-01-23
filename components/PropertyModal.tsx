
import React, { useEffect } from 'react';
import { Property } from '../types';
import { ABISAM_PHONE } from '../constants';

interface PropertyModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWhatsAppInquiry = () => {
    const text = `Hello Abisam Properties, I am interested in "${property.title}" in ${property.location_tag}. Please provide more details and the next steps for inspection.`;
    window.open(`https://wa.me/${ABISAM_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:p-10">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl glass rounded-3xl md:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(255,215,0,0.1)] flex flex-col lg:flex-row h-full max-h-[90vh] animate-in zoom-in-95 duration-500">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full glass border-white/20 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {/* Left: Image Section */}
        <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-10 left-10">
            <span className="glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-yellow-500 mb-4 inline-block">
              <i className="fa-solid fa-location-dot mr-2"></i> {property.location_tag}, Abeokuta
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">{property.title}</h2>
          </div>
        </div>

        {/* Right: Details Section */}
        <div className="lg:w-1/2 p-6 md:p-12 overflow-y-auto flex flex-col bg-black/40">
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-10">
              <span className="text-4xl font-black text-gradient">₦{property.price_val.toLocaleString()}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">{property.type}</span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="glass p-5 rounded-2xl border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Specifications</p>
                <div className="flex gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-bed text-yellow-500/50"></i>
                      <span className="font-bold">{property.bedrooms} Beds</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-bath text-yellow-500/50"></i>
                      <span className="font-bold">{property.bathrooms} Baths</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="glass p-5 rounded-2xl border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Verification</p>
                <div className="flex flex-wrap gap-2">
                  {property.documents.map((doc, i) => (
                    <span key={i} className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-white/80">{doc}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-yellow-500 mb-6 flex items-center gap-4">
                Property Overview
                <div className="flex-1 h-px bg-yellow-500/20"></div>
              </h4>
              <p className="text-gray-400 leading-relaxed font-light text-lg italic">
                "{property.ai_description}"
              </p>
            </div>

            <div className="space-y-6 mb-12">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-yellow-500 mb-6 flex items-center gap-4">
                Local Benefits
                <div className="flex-1 h-px bg-yellow-500/20"></div>
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                    <i className="fa-solid fa-check-double text-xs"></i>
                  </div>
                  <span>100% Verified Documents with State Bureau</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <i className="fa-solid fa-shield-halved text-xs"></i>
                  </div>
                  <span>Zero "Omonile" friction policy active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-auto border-t border-white/5 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleWhatsAppInquiry}
              className="flex-1 bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-yellow-500 hover:scale-[1.02] active:scale-95 shadow-xl"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
              BOOK INSPECTION
            </button>
            <button
              onClick={onClose}
              className="px-10 py-5 glass border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
