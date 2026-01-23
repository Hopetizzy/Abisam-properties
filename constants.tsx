
import React from 'react';
import { Property, PropertyLocation, PropertyType } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern 3-Bedroom Flat in Oke-Mosan',
    location_tag: PropertyLocation.OKE_MOSAN,
    price_val: 1200000,
    type: PropertyType.FLAT,
    documents: ['C of O', 'Survey'],
    ai_description: 'Luxury flat with proximity to government offices, 24/7 security, tiled floors, and spacious compound.',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    bedrooms: 3,
    bathrooms: 3
  },
  {
    id: '2',
    title: 'Cosy Self-Contain near FUNAAB',
    location_tag: PropertyLocation.CAMP,
    price_val: 150000,
    type: PropertyType.SELF_CONTAIN,
    documents: ['Survey'],
    ai_description: 'Student-friendly self-contain with reliable water supply and prepaid meter. Walking distance to Camp junction.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: '4-Bedroom Duplex in Adigbe',
    location_tag: PropertyLocation.ADIGBE,
    price_val: 45000000,
    type: PropertyType.DUPLEX,
    documents: ['C of O', 'Registered Survey', 'Deed of Assignment'],
    ai_description: 'Executive duplex with penthouse, modern fittings, fenced and gated with electric wire.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    bedrooms: 4,
    bathrooms: 4
  },
  {
    id: '4',
    title: 'Prime 2 Plots of Land at Obantoko',
    location_tag: PropertyLocation.OBANTOKO,
    price_val: 8000000,
    type: PropertyType.LAND,
    documents: ['C of O', 'Approved Layout'],
    ai_description: 'Flat dry land in a fast-developing neighborhood. No omonile issues guaranteed.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  }
];

export const ABISAM_PHONE = "2348123456789"; // Example WhatsApp Number
