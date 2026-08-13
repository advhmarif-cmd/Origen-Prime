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
  created_at: string;
  category?: string;
}
