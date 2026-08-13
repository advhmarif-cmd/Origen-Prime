import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import OrderForm from '../components/OrderForm';
import SuccessModal from '../components/SuccessModal';
import StickyCTA from '../components/StickyCTA';
import { useCart } from '../context/CartContext';

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const { addToCart } = useCart();

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
        <div className="flex gap-4">
          <Link to="/" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black shadow-lg">সব পণ্য দেখুন</Link>
          <Link to="/admin" className="bg-red-600 text-white px-8 py-3 rounded-xl font-black shadow-lg">অ্যাডমিন প্যানেল</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20 md:pb-0 font-sans selection:bg-red-100 selection:text-red-900">
      <Helmet>
        <title>{product.title} - ORIGEN PRIME</title>
        <meta name="description" content={product.description?.substring(0, 160)} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.subtitle} />
        <meta property="og:image" content={product.images?.[0]} />
        <meta property="og:type" content="product" />
      </Helmet>

      <Navbar 
        phone={product.phone_number || '01700000000'} 
        logoUrl={product.logo_url}
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

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 hidden md:block">
        <button 
          onClick={() => addToCart(product)}
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-black transition active:scale-95 flex items-center gap-3"
        >
          কার্টে যোগ করুন
        </button>
      </div>

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

      {/* FIXED: Passing full product object */}
      <StickyCTA 
        product={product}
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
            &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
