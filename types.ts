
export type ServiceType = 
  | 'Air Duct Cleaning'
  | 'Dryer Vent Cleaning'
  | 'Water Heater Service'
  | 'Plumbing'
  | 'Garage Door'
  | 'Locksmith'
  | 'Carpet Cleaning';

export type PageType = 'Home' | 'Service' | 'About' | 'Contact' | 'FAQs' | 'Locations' | 'Blog Archive';

export interface FAQ {
  question: string;
  answer: string;
}

export interface Coupon {
  name: string;
  description: string;
}

export interface BlogPost {
  title: string;
  url: string;
  date: string;
  description: string;
}

export interface WorkingHours {
  weekdayOpens: string;
  weekdayCloses: string;
  weekendOpens: string;
  weekendCloses: string;
  is247: boolean;
}

export interface SeoData {
  businessName: string;
  baseUrl: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: string;
  lng: string;
  serviceRadius: string;
  serviceType: ServiceType;
  areaServed: string[];
  relatedServices: string[];
  themeColor: string;
  faviconUrl: string;
  appleTouchIconUrl: string;
  logoUrl: string;
  primaryImageUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  couponImageUrl: string; 
  pageType: PageType;
  pagePath: string; 
  parentPageName: string; 
  parentPagePath: string; 
  faqs: FAQ[];
  coupons: Coupon[];
  blogPosts: BlogPost[];
  workingHours: WorkingHours;
  metaTitle: string;
  metaDescription: string;
}

export const SERVICE_SCHEMA_MAP: Record<ServiceType, string> = {
  'Air Duct Cleaning': 'HomeAndConstructionBusiness',
  'Dryer Vent Cleaning': 'HomeAndConstructionBusiness',
  'Water Heater Service': 'Plumber',
  'Plumbing': 'Plumber',
  'Garage Door': 'HomeAndConstructionBusiness',
  'Locksmith': 'Locksmith',
  'Carpet Cleaning': 'ProfessionalService'
};