import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import OrderForm from '../components/OrderForm';
import StickyCTA from '../components/StickyCTA';
import SuccessModal from '../components/SuccessModal';

const DEFAULT_PRODUCT = {
  id: 2,
  title: 'প্রিমিয়াম আজওয়া খেজুর (Premium Ajwa Dates)',
  subtitle: 'সরাসরি মদিনা শরিফ থেকে আমদানিকৃত শতভাগ খাঁটি ও প্রিমিয়াম গ্রেডের আজওয়া খেজুর। ২ কেজি ও ৫ কেজির আকর্ষণীয় প্যাকেজে ধামাকা অফার!',
  regular_price: 2400,
  sale_price: 1590,
  discount_percentage: 34,
  description: 'আজওয়া খেজুর হলো খেজুরের রাজা। সরাসরি মদিনা শরিফের নিজস্ব বাগান থেকে আমদানিকৃত আমাদের এই আজওয়া খেজুর অত্যন্ত নরম, সুস্বাদু এবং পুষ্টিগুণে ভরপুর। কোনো প্রকার কৃত্রিম মিষ্টি বা প্রিজারভেটিভ ছাড়াই সম্পূর্ণ প্রাকৃতিকভাবে প্রক্রিয়াজাতকৃত। আমাদের আজওয়া খেজুর আকারে বড় এবং অত্যন্ত প্রিমিয়াম কোয়ালিটির। পরিবারে সুস্বাস্থ্যের জন্য আজই অর্ডার করুন!',
  features: [
    'সরাসরি মদিনা শরিফ থেকে আমদানিকৃত শতভাগ অরিজিনাল খেজুরের নিশ্চয়তা।',
    'কোনো প্রকার কেমিক্যাল, প্রিজারভেটিভ বা কৃত্রিম মিষ্টি মুক্ত সম্পূর্ণ প্রাকৃতিক খেজুর।',
    'খেতে অত্যন্ত সুস্বাদু, নরম এবং পুষ্টিগুণে ভরপুর (প্রাকৃতিক এনার্জি বুস্টার)।',
    'ডেলিভারি ম্যানের সামনে পণ্য দেখে, খেয়ে গুণগত মান যাচাই করে পেমেন্ট করার সুবিধা।',
    '২ কেজি এবং ৫ কেজির প্রিমিয়াম ফুড-গ্রেড বক্সে আকর্ষণীয় ডিসকাউন্ট।'
  ],
  images: [
    '/images/dates-1.jpg',
    '/images/dates-2.jpg',
    '/images/dates-3.jpg'
  ],
  video_url: '/videos/product-video.mp4',
  delivery_charge_inside: 70,
  delivery_charge_outside: 120,
  stock_status: 'In Stock'
};

export default function LandingPage() {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  const fetchActiveProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;

      if (data && data.length > 0) {
        setProduct(data[0]);
      } else {
        setProduct(DEFAULT_PRODUCT);
      }
    } catch (err) {
      console.error('Failed to fetch active product from Supabase, using fallback:', err);
      setProduct(DEFAULT_PRODUCT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveProduct();
  }, []);

  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-4 font-black text-gray-800 text-sm">অপেক্ষা করুন...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-16 md:pb-0">
      {/* Navbar */}
      <Navbar phone="01732669919" onOrderClick={scrollToOrderForm} />

      {/* Unified Hero Section */}
      <Hero
        title={product.title}
        subtitle={product.subtitle}
        regularPrice={product.regular_price}
        salePrice={product.sale_price}
        discountPercentage={product.discount_percentage}
        stockStatus={product.stock_status}
        images={product.images}
        videoUrl={product.video_url}
        onOrderClick={scrollToOrderForm}
      />

      {/* Description & Features */}
      <Features description={product.description} features={product.features} />

      {/* Reviews Section */}
      <Reviews />

      {/* Checkout Order Form */}
      <OrderForm
        productId={product.id}
        productTitle={product.title}
        salePrice={product.sale_price}
        deliveryInside={product.delivery_charge_inside || 60}
        deliveryOutside={product.delivery_charge_outside || 120}
        onOrderSuccess={(order: any) => setSuccessOrder(order)}
      />

      {/* Sticky Bottom Mobile CTA */}
      <StickyCTA salePrice={product.sale_price} productTitle={product.title} onOrderClick={scrollToOrderForm} />

      {/* Checkout Success Modal */}
      {successOrder && (
        <SuccessModal
          order={successOrder}
          onClose={() => setSuccessOrder(null)}
        />
      )}
    </div>
  );
}
