import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import OrderForm from '../components/OrderForm';
import SuccessModal from '../components/SuccessModal';
import StickyCTA from '../components/StickyCTA';

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const targetSlug = slug || 'default-product';
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', targetSlug)
          .single();

        if (data) {
          setProduct(data as Product);
        } else {
          console.error('Error fetching product:', error);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const scrollToOrder = () => {
    document.getElementById('order-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-600 font-black italic uppercase tracking-widest">ORIGEN PRIME LOADING...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gray-50 text-center">
        <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic">দুঃখিত! প্রোডাক্টটি পাওয়া যায়নি।</h1>
        <p className="text-gray-600 mb-6 font-bold uppercase text-xs tracking-widest">ইউআরএল চেক করুন অথবা অ্যাডমিন প্যানেল থেকে তৈরি করুন।</p>
        <a href="/admin" className="bg-red-600 text-white px-8 py-3 rounded-xl font-black shadow-lg active:scale-95 transition">অ্যাডমিন প্যানেল</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20 md:pb-0 font-sans selection:bg-red-100 selection:text-red-900">
      <Navbar 
        phone={product.phone_number || '01700000000'} 
        badges={product.navbar_badges}
        onOrderClick={scrollToOrder} 
      />
      
      <Hero 
        title={product.title} 
        subtitle={product.subtitle} 
        regularPrice={product.regular_price}
        salePrice={product.sale_price}
        discountPercentage={product.discount_percentage}
        stockStatus={product.stock_status}
        images={product.images}
        videoUrl={product.video_url}
        promoTagline={product.promo_tagline}
        onOrderClick={scrollToOrder}
      />

      <Features 
        description={product.description} 
        features={product.features} 
        trustBadges={product.trust_badges}
      />

      {product.reviews && product.reviews.length > 0 && (
        <Reviews 
          reviews={product.reviews} 
          satisfactionRecord={product.satisfaction_record}
          satisfactionSubtext={product.satisfaction_subtext}
          successCountText={product.success_count_text}
        />
      )}

      <div id="order-form-section" className="scroll-mt-20">
        <OrderForm 
          productId={product.id} 
          productTitle={product.title}
          salePrice={product.sale_price}
          deliveryInside={product.delivery_charge_inside}
          deliveryOutside={product.delivery_charge_outside}
          onOrderSuccess={setSuccessOrder}
        />
      </div>

      <StickyCTA 
        salePrice={product.sale_price} 
        onOrderClick={scrollToOrder} 
      />

      {successOrder && (
        <SuccessModal 
          order={successOrder} 
          onClose={() => setSuccessOrder(null)} 
        />
      )}

      <footer className="py-12 bg-gray-950 text-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="font-black text-2xl tracking-tighter italic mb-4 uppercase">
            ORIGEN<span className="text-red-600">PRIME</span>
          </div>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] opacity-50">
            &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED. POWERED BY AGENTIC AUTOMATION.
          </p>
        </div>
      </footer>
    </div>
  );
}
