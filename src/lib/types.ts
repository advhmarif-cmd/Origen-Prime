export interface Review {
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface TrustBadge {
  icon: 'Truck' | 'ShieldCheck' | 'RotateCcw' | 'CheckCircle2' | 'HeartHandshake';
  title: string;
  subtitle: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  regular_price: number;
  sale_price: number;
  discount_percentage: number;
  description: string;
  features: string[];
  images: string[];
  video_url: string;
  delivery_charge_inside: number;
  delivery_charge_outside: number;
  stock_status: string;
  reviews: Review[];
  phone_number: string;
  category?: string;
  
  // Full Page Control Fields
  logo_url?: string;
  navbar_badges: string[];
  trust_badges: TrustBadge[];
  promo_tagline: string;
  satisfaction_record: string;
  satisfaction_subtext: string;
  success_count_text: string;
  
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
}
