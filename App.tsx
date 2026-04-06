import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { CurrencyProvider, useCurrency } from './context/CurrencyContext';
import './i18n';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, User, Search, Menu, X, LogOut, LayoutDashboard, Star, Plus, Minus, Trash2, Sun, Moon, Heart, Check, Smartphone, Globe, Coins, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { Product, OperationType } from './types';
import { handleFirestoreError } from './utils/errorHandlers';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import TrackOrder from './pages/TrackOrder';
import MyOrders from './pages/MyOrders';
import Wishlist from './pages/Wishlist';
import SellerDashboard from './pages/SellerDashboard';
import SellerApplication from './pages/SellerApplication';
import SellerLanding from './pages/SellerLanding';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AIShoppingAssistant } from './components/AIShoppingAssistant';
import { AIAdvisor } from './components/AIAdvisor';
import { ComparisonTool } from './components/ComparisonTool';
import { BackToTop } from './components/BackToTop';
import { LazyImage } from './components/LazyImage';
import { Mail, Send } from 'lucide-react';

const AddToCartButton = ({ product, onAdd, className }: { product: Product, onAdd: (p: Product) => void, className?: string }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleAdd}
      className={`relative h-14 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 overflow-hidden group ${
        isAdded 
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
          : 'bg-black dark:bg-emerald-600 text-white hover:bg-gray-900 dark:hover:bg-emerald-700 shadow-xl shadow-black/10 dark:shadow-emerald-900/20'
      } ${className}`}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.div
            key="added"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <Check className="w-5 h-5" />
            <span>Added to Cart!</span>
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Add to Cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const CategoryBento = ({ onSelect, selected }: { onSelect: (c: string) => void, selected: string }) => {
  const categories = [
    { name: 'Electronics', icon: Smartphone, color: 'bg-blue-500', span: 'md:col-span-2 md:row-span-2', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800' },
    { name: 'Fashion', icon: User, color: 'bg-rose-500', span: 'md:col-span-1 md:row-span-2', img: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=800' },
    { name: 'Home Decor', icon: LayoutDashboard, color: 'bg-amber-500', span: 'md:col-span-1 md:row-span-1', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800' },
    { name: 'Beauty', icon: Star, color: 'bg-purple-500', span: 'md:col-span-1 md:row-span-1', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[500px]">
      {categories.map((cat) => (
        <motion.div
          key={cat.name}
          whileHover={{ scale: 0.98 }}
          onClick={() => onSelect(cat.name)}
          className={`relative rounded-[2rem] overflow-hidden cursor-pointer group ${cat.span} ${selected === cat.name ? 'ring-4 ring-emerald-500 ring-offset-4 dark:ring-offset-gray-950' : ''}`}
        >
          <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
              <cat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white">{cat.name}</h3>
            <p className="text-white/60 text-sm font-medium">Explore Collection</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Home = ({ searchQuery }: { searchQuery: string }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [minRating, setMinRating] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      showToast('You can only compare up to 3 products', 'info');
      return prev;
    });
  };

  const categories = ['All', 'Electronics', 'Fashion', 'Home Decor', 'Beauty'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(50));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(items);
        setFilteredProducts(items);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filtering
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Rating filtering
    result = result.filter(p => (p.rating || 0) >= minRating);
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products, priceRange, minRating]);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[700px] -mt-8 rounded-[3rem] overflow-hidden group">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </motion.div>
        
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8 w-fit"
          >
            <Star className="w-4 h-4 fill-current" /> New Collection 2026
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-7xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter"
          >
            Redefine Your <br />
            <span className="text-emerald-500">Lifestyle.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300 mb-12 max-w-lg leading-relaxed font-medium"
          >
            Experience the future of shopping with EcoKart. Premium products, sustainable choices, and AI-powered recommendations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <button className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-1">
              Explore Now
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all">
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 right-12 hidden lg:flex gap-8">
          {[
            { label: 'Active Users', value: '50k+' },
            { label: 'Premium Products', value: '12k+' },
            { label: 'Fast Delivery', value: '24h' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + (i * 0.1) }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl"
            >
              <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Category Bento Section */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl font-black dark:text-white mb-4">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl">Discover our curated collections across multiple categories, designed for your modern lifestyle.</p>
          </div>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="text-emerald-600 font-black uppercase tracking-widest text-sm hover:underline"
          >
            View All Categories
          </button>
        </div>
        <CategoryBento onSelect={setSelectedCategory} selected={selectedCategory} />
      </section>

      <section className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar - Redesigned */}
        <aside className={`lg:w-80 space-y-10 p-8 glass dark:bg-gray-900/50 rounded-[2.5rem] h-fit sticky top-24 transition-all ${isFilterOpen ? 'fixed inset-0 z-[60] m-4 lg:relative lg:inset-auto lg:m-0' : 'hidden lg:block'}`}>
          <div className="flex justify-between items-center lg:hidden mb-8">
            <h3 className="text-2xl font-black dark:text-white">Filters</h3>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl"><X className="w-6 h-6" /></button>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Categories</h4>
            <div className="grid grid-cols-1 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Price Range</h4>
            <div className="space-y-6">
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="50"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between items-center">
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-black dark:text-white">$0</div>
                <div className="w-4 h-px bg-gray-300 dark:bg-gray-700"></div>
                <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-black">${priceRange.max}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Minimum Rating</h4>
            <div className="flex justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setMinRating(star === minRating ? 0 : star)}
                  className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center ${minRating >= star ? 'bg-white dark:bg-gray-700 text-amber-400 shadow-sm' : 'text-gray-400'}`}
                >
                  <Star className={`w-5 h-5 ${minRating >= star ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              setSelectedCategory('All');
              setPriceRange({ min: 0, max: 2000 });
              setMinRating(0);
            }}
            className="w-full py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-colors border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl"
          >
            Clear All Filters
          </button>
        </aside>

        <div className="flex-1 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black dark:text-white">Featured Products</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{filteredProducts.length} premium items available</p>
            </div>
            <div className="flex items-center gap-4">
              <select className="bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-6 py-3 text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredProducts.length > 0 ? filteredProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] p-5 border border-gray-100 dark:border-gray-800 hover:shadow-premium transition-all duration-500 flex flex-col"
            >
              <Link to={`/product/${product.id}`} className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 block">
                <LazyImage 
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'} 
                  alt={product.name}
                  className="w-full h-full"
                  imageClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.stock < 10 && (
                    <div className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      Low Stock
                    </div>
                  )}
                  {product.price > 500 && (
                    <div className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      Premium
                    </div>
                  )}
                </div>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
                  }}
                  className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                    isInWishlist(product.id) 
                      ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/30' 
                      : 'bg-white/20 text-white hover:bg-white hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
              </Link>

              <div className="px-2 space-y-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-emerald-600 uppercase font-black tracking-[0.2em] mb-1">{product.category}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-black text-xl dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                    </Link>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span className="text-xs font-black dark:text-white">{product.rating || 4.5}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Price</span>
                      <p className="text-3xl font-black text-black dark:text-white tracking-tighter leading-none">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCompare(product.id);
                      }}
                      className={`p-4 rounded-2xl transition-all ${
                        compareIds.includes(product.id)
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-emerald-600 border border-gray-100 dark:border-gray-700'
                      }`}
                      title={compareIds.includes(product.id) ? 'Remove from Compare' : 'Add to Compare'}
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                    </button>
                  </div>
                  <AddToCartButton product={product} onAdd={addToCart} className="w-full" />
                </div>
              </div>
            </motion.div>
          )) : (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-5 h-[500px]">
                <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-[2rem] mb-6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
    <AIAdvisor products={products} />
    <ComparisonTool 
      products={products} 
      selectedIds={compareIds} 
      onToggle={toggleCompare}
      onClear={() => setCompareIds([])}
    />
  </div>
);
};


const Navbar = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (q: string) => void }) => {
  const { user, profile, isAdmin, isSeller } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass rounded-3xl px-6 h-20 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'shadow-premium' : ''}`}>
          <div className="flex items-center gap-12">
            <Link to="/" className="text-3xl font-black tracking-tighter text-black dark:text-white group">
              Eco<span className="text-emerald-600 transition-colors group-hover:text-emerald-500">Kart</span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-8">
              {['Shop', 'Categories', 'Deals', 'About'].map((item) => (
                <Link 
                  key={item} 
                  to="/" 
                  className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  {item}
                </Link>
              ))}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-sm font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search premium products..." 
                className="w-full bg-gray-100 dark:bg-gray-800/50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
              <button 
                onClick={() => i18n.changeLanguage('en')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${i18n.language === 'en' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
              >
                EN
              </button>
              <button 
                onClick={() => i18n.changeLanguage('hi')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${i18n.language === 'hi' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
              >
                HI
              </button>
            </div>

            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-gray-100 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 px-3 py-2 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.button>

            <Link to="/wishlist" className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors relative">
              <Heart className="w-5 h-5" />
            </Link>

            <Link to="/cart" className="p-3 rounded-2xl bg-black dark:bg-emerald-600 text-white hover:shadow-lg transition-all relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 border-2 border-white dark:border-gray-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-3 p-1 pr-4 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black">
                    {profile?.displayName?.[0] || 'U'}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-black dark:text-white line-clamp-1">{profile?.displayName}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Account</p>
                  </div>
                </Link>
                <button onClick={handleLogout} className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl dark:text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-24 z-[90] p-4"
          >
            <div className="glass rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Home', path: '/', icon: LayoutDashboard },
                  { label: 'Wishlist', path: '/wishlist', icon: Heart },
                  { label: 'Cart', path: '/cart', icon: ShoppingCart },
                  { label: 'Profile', path: '/profile', icon: User }
                ].map((item) => (
                  <Link 
                    key={item.label}
                    to={item.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl hover:bg-emerald-50 transition-colors"
                  >
                    <item.icon className="w-6 h-6 text-emerald-600" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">{item.label}</span>
                  </Link>
                ))}
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center gap-3 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl hover:bg-emerald-100 transition-colors col-span-2"
                  >
                    <LayoutDashboard className="w-6 h-6 text-emerald-600" />
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Admin Dashboard</span>
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center">
                    {theme === 'light' ? <Sun className="w-6 h-6 text-emerald-600" /> : <Moon className="w-6 h-6 text-emerald-600" />}
                  </div>
                  <div>
                    <p className="font-black dark:text-white">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Theme Preference</p>
                  </div>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                >
                  Switch
                </motion.button>
              </div>

              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-3xl">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl">
                      {profile?.displayName?.[0]}
                    </div>
                    <div>
                      <p className="font-black dark:text-white">{profile?.displayName}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Premium Member</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs">Logout</button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full py-5 bg-emerald-600 text-white text-center rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-600/20">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CurrencyProvider>
            <WishlistProvider>
              <CartProvider>
                <Router>
              <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors">
                <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                  <Routes>
                    <Route path="/" element={
                      <ErrorBoundary>
                        <Home searchQuery={searchQuery} />
                      </ErrorBoundary>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/admin" element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/seller" element={
                      <ProtectedRoute sellerOnly>
                        <SellerDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/seller-application" element={
                      <ProtectedRoute>
                        <SellerApplication />
                      </ProtectedRoute>
                    } />
                    <Route path="/sell" element={<SellerLanding />} />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/my-orders" element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    } />
                    <Route path="/wishlist" element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    } />
                    <Route path="/track-order/:id" element={
                      <ProtectedRoute>
                        <TrackOrder />
                      </ProtectedRoute>
                    } />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                  </Routes>
                </main>
                <AIShoppingAssistant />
                <BackToTop />
                <footer className="border-t border-gray-100 dark:border-gray-800 py-32 mt-32 bg-gray-50 dark:bg-gray-900/50 rounded-t-[5rem]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                      <div className="space-y-8">
                        <Link to="/" className="text-4xl font-black tracking-tighter text-black dark:text-white">
                          Eco<span className="text-emerald-600">Kart</span>
                        </Link>
                        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                          Crafting the future of digital commerce with premium experiences and sustainable choices.
                        </p>
                        <div className="flex gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <motion.div 
                              key={i}
                              whileHover={{ y: -5 }}
                              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center cursor-pointer"
                            >
                              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-8">Collections</h4>
                        <ul className="space-y-4">
                          {['New Arrivals', 'Best Sellers', 'Sustainable', 'Limited Edition'].map((item) => (
                            <li key={item}>
                              <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 font-bold transition-colors">{item}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-8">Company</h4>
                        <ul className="space-y-4">
                          {['Our Story', 'Sustainability', 'Careers', 'Press'].map((item) => (
                            <li key={item}>
                              <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 font-bold transition-colors">{item}</Link>
                            </li>
                          ))}
                          <li>
                            <Link to="/sell" className="text-emerald-600 hover:text-emerald-700 font-black transition-colors">Become a Seller</Link>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-8">Join the Club</h4>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Get exclusive access to new drops and premium content.</p>
                        <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                          <input 
                            type="email" 
                            placeholder="Your premium email" 
                            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all dark:text-white"
                          />
                          <button className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white px-6 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all">
                            Join
                          </button>
                        </form>
                      </div>
                    </div>
                    
                    <div className="pt-12 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
                      <p className="text-sm font-bold text-gray-400">© 2026 EcoKart Studio. All rights reserved.</p>
                      <div className="flex gap-12">
                        {['Privacy', 'Terms', 'Cookies'].map((item) => (
                          <Link key={item} to="/" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-colors">{item}</Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </CurrencyProvider>
    </AuthProvider>
  </ToastProvider>
</ThemeProvider>
  );
}
