
import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (p: Property) => void;
  onChat?: (p: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, onChat }) => {
  return (
    <div
      onClick={() => onSelect(property)}
      className="group relative glass rounded-3xl overflow-hidden border-white/5 hover:border-yellow-500/50 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(255,215,0,0.1)] transition-all duration-500 cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* AI Chat Trigger on Card */}
        {onChat && (
          <button
            onClick={(e) => { e.stopPropagation(); onChat(property); }}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass bg-black/50 border-white/10 flex items-center justify-center text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            title="Ask AI about this property"
          >
            <i className="fa-solid fa-robot"></i>
          </button>
        )}
      </div>

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-500">{property.location_tag}</span>
          <span className="text-xs glass px-2 py-1 rounded bg-white/5">{property.type}</span>
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors duration-300">{property.title}</h3>

        <div className="flex gap-4 mb-6 text-sm text-gray-400">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <i className="fa-solid fa-bed text-xs text-yellow-500/70"></i>
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <i className="fa-solid fa-bath text-xs text-yellow-500/70"></i>
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <i className="fa-solid fa-file-shield text-xs text-yellow-500/70"></i>
            <span>{property.documents[0]}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <span className="text-2xl font-bold tracking-tight text-white group-hover:text-yellow-500 transition-colors duration-300">₦{property.price_val.toLocaleString()}</span>
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-yellow-500 group-hover:translate-x-1 transition-all duration-300 shadow-lg shadow-white/5">
            <i className="fa-solid fa-arrow-right -rotate-45"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
