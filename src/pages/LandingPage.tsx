import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import OrderForm from '../components/OrderForm';
import SuccessModal from '../components/SuccessModal';

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const targetSlug = slug || 'default-product';
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', targetSlug)
        .single();

      if (data) setProduct(data as Product);
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  const scrollToOrder = () => document.getElementById('order-form-section')?.scrollIntoView({ behavior: 'smooth' });

  if (loading) return <div className="flex justify-center items-center h-screen">লোড হচ্ছে...</div>;
  if (!product) return <div className="text-center p-10">প্রোডাক্ট পাওয়া যায়নি</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-16">
      <Navbar phone="01709929310" onOrderClick={scrollToOrder} />
      <Hero 
        title={product.title} 
        subtitle={product.subtitle} 
        regularPrice={Number(product.regular_price)}
        salePrice={Number(product.sale_price)}
        discountPercentage={Number(product.discount_percentage || 0)}
        stockStatus={product.stock_status}
        images={product.images}
        videoUrl={product.video_url}
        onOrderClick={scrollToOrder}
      />
      <Features description={product.description} features={product.features} />
      <div id="order-form-section">
        <OrderForm productId={product.id} onOrderSuccess={setSuccessOrder} />
      </div>
      {successOrder && <SuccessModal order={successOrder} onClose={() => setSuccessOrder(null)} />}
    </div>
  );
}
