
export enum PropertyLocation {
  CAMP = 'Camp',
  ADIGBE = 'Adigbe',
  OBANTOKO = 'Obantoko',
  OKE_MOSAN = 'Oke-Mosan',
  KUTO = 'Kuto',
  LANTORO = 'Lantoro'
}

export enum PropertyType {
  SELF_CONTAIN = 'Self-contain',
  FLAT = 'Flat',
  BUNGALOW = 'Bungalow',
  DUPLEX = 'Duplex',
  LAND = 'Land'
}

export interface Property {
  id: string;
  title: string;
  location_tag: PropertyLocation;
  price_val: number;
  type: PropertyType;
  documents: string[];
  ai_description: string;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  property?: Property;
  timestamp: Date;
}

export interface LeadSummary {
  intent: 'Buy' | 'Rent' | 'Sell';
  location: string;
  budget: string;
  propertyType: string;
  summary: string;
}
