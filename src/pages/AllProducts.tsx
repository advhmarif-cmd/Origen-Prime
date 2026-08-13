import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import { ShoppingBag, ChevronRight, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) {
      setProducts(data as Product[]);
      const cats = Array.from(new Set(data.map((p: any) => p.category).filter(Boolean))) as string[];
      setCategories(['All', ...cats]);
    }
    setLoading(false);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar phone="01709929310" onOrderClick={() => {}} />
      
      {/* Category Filter Bar */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition whitespace-nowrap ${
                  selectedCategory === cat 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat === 'All' ? 'সব পণ্য' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">আমাদের <span className="text-red-600">পণ্যসমূহ</span></h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Premium Quality Guaranteed</p>
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase">
            {filteredProducts.length} টি পণ্য পাওয়া গেছে
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <Link 
                key={product.id} 
                to={`/${product.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img 
                    src={product.images[0] || 'https://via.placeholder.com/400'} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  {product.discount_percentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase">
                      {product.discount_percentage}% ছাড়
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-[8px] font-black text-red-600 uppercase tracking-widest mb-1">{product.category || 'Premium'}</span>
                  <h3 className="font-black text-gray-900 text-sm line-clamp-2 leading-tight mb-2 group-hover:text-red-600 transition">{product.title}</h3>
                  
                  <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                    <div>
                      <span className="block text-[10px] font-black text-red-600">৳{product.sale_price.toLocaleString()}</span>
                      {product.regular_price > product.sale_price && (
                        <span className="block text-[8px] font-bold text-gray-400 line-through">৳{product.regular_price.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="bg-gray-900 text-white p-2 rounded-lg group-hover:bg-red-600 transition">
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">এই ক্যাটাগরিতে কোনো পণ্য নেই</p>
          </div>
        )}
      </main>

      <footer className="py-12 bg-gray-950 text-white text-center mt-20">
        <div className="font-black text-xl tracking-tighter italic mb-2 uppercase">
          ORIGEN<span className="text-red-600">PRIME</span>
        </div>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] opacity-50">
          Premium Dynamic Shopping Experience
        </p>
      </footer>
    </div>
  );
}
