import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Product } from '../lib/types';
import { ShoppingBag, ChevronRight, Filter, Package } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<Partial<Product>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/products?active=true');
      if (!response.ok) throw new Error('পণ্য লোড করা যায়নি');
      const productsData = await response.json();
      setProducts((productsData || []) as Product[]);
      const cats = Array.from(new Set((productsData || []).map((p: Product) => p.category).filter(Boolean))) as string[];
      setCategories(['All', ...cats]);
      const defaultProd = (productsData || []).find((p: Product) => p.slug === 'default-product') || productsData?.[0];
      if (defaultProd) setSiteSettings(defaultProd);
    } catch (fetchError) {
      console.error('Product load error:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'পণ্য লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Helmet>
        <title>আমাদের সকল পণ্যসমূহ - ORIGEN PRIME</title>
        <meta name="description" content="ORIGEN PRIME-এর প্রিমিয়াম কোয়ালিটি পণ্যসমূহ দেখুন এবং সরাসরি অর্ডার করুন।" />
      </Helmet>

      <Navbar 
        phone={siteSettings.phone_number || "01700000000"} 
        logoUrl={siteSettings.logo_url}
        badges={siteSettings.navbar_badges}
        onOrderClick={() => {}} 
      />
      
      <div className="bg-white border-b sticky top-[64px] z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            <Filter className="w-4 h-4 text-red-600 shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition whitespace-nowrap ${
                  selectedCategory === cat 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat === 'All' ? 'সব পণ্য' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
              আমাদের <span className="text-red-600">সংগ্রহ</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">এক্সক্লুসিভ কোয়ালিটি নিশ্চিত</p>
          </div>
        </div>

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 font-bold mb-6">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-72 animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map(product => (
              <Link 
                key={product.id} 
                to={`/${product.slug}`}
                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-50">
                  <img 
                    src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Not+Found'; }}
                  />
                  {product.discount_percentage > 0 && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl uppercase shadow-lg">
                      {product.discount_percentage}% ছাড়
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{product.category || 'Premium'}</span>
                  </div>
                  <h3 className="font-black text-gray-900 text-sm md:text-base line-clamp-2 leading-tight mb-4 group-hover:text-red-600 transition">{product.title}</h3>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div>
                      <span className="block text-sm md:text-lg font-black text-red-600">৳{product.sale_price.toLocaleString()}</span>
                      {product.regular_price > product.sale_price && (
                        <span className="block text-[10px] font-bold text-gray-300 line-through italic">৳{product.regular_price.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="bg-gray-900 text-white p-2.5 rounded-2xl group-hover:bg-red-600 transition shadow-lg">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <Package className="w-16 h-16 text-gray-100 mx-auto mb-4" />
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</p>
          </div>
        )}
      </main>

      <footer className="py-20 bg-gray-950 text-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="font-black text-3xl tracking-tighter italic mb-4 uppercase">
            ORIGEN<span className="text-red-600">PRIME</span>
          </div>
          <div className="w-10 h-1 bg-red-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] opacity-40 max-w-xs mx-auto leading-relaxed">
            &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
