import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import OrderForm from '../components/OrderForm';
import StickyCTA from '../components/StickyCTA';

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('slug', slug || 'default-product').single();
      if (data) setProduct(data as Product);
    };
    fetchProduct();
  }, [slug]);

  const scrollToOrder = () => document.getElementById('order-form-section')?.scrollIntoView({ behavior: 'smooth' });

  if (!product) return <div>লোড হচ্ছে...</div>;

  return (
    <div className="pb-20">
      <Navbar phone="01709929310" onOrderClick={scrollToOrder} />
      <Hero {...product} regularPrice={product.regular_price} salePrice={product.sale_price} onOrderClick={scrollToOrder} />
      <Features description={product.description} features={product.features} />
      <div id="order-form-section"><OrderForm productId={product.id} /></div>
      <StickyCTA onClick={scrollToOrder} />
    </div>
  );
}
