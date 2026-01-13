import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Phone, Mail, MapPin, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';

const PRODUCTS = [
  {
    id: 1,
    name: "Lavender Dreams",
    price: 200,
    category: "home",
    featured: true,
    images: ["/images/products/car-diffusers/dif1.jpg"],
    description: "A soothing lavender scent that transforms your home into a peaceful sanctuary",
    scents: ["Lavender", "Vanilla"],
    sizes: ["120ml"],
    sizePrices: {
      "120ml": 200,
      
    }
  },
  {
    id: 2,
    name: "Citrus Burst",
    price: 80,
    category: "home",
    featured: true,
    images: ["/images/products/car-diffusers/dif2.jpg"],
    description: "Energizing citrus blend perfect for brightening any space",
    scents: ["Lavender", "Vanilla", "Cherry Blossom", "Rose", "Osmanthus Flower"],
    sizes: ["8ml"],
    sizePrices: {
      "8ml": 80,
    }
  }
];

// Enhanced Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
  transition: { duration: 0.4, ease: "easeOut" }
};

// Working pulse animations using Framer Motion
const pulseAnimation = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.9, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const breathingAnimation = {
  animate: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const buttonPulseAnimation = {
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const formatPrice = (price) => `R${typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2)}`;

const generateWhatsAppMessage = (cart, total, customerInfo) => {
  let message = `*New Order from Laureta Scents*\n\n`;
  message += `*Customer Information:*\n`;
  message += `Name: ${customerInfo.name}\n`;
  message += `Contact Method: ${customerInfo.contactMethod}\n`;
  
  if (customerInfo.contactMethod === 'whatsapp' || customerInfo.contactMethod === 'phone') {
    message += `Phone: ${customerInfo.phone}\n`;
  }
  
  if (customerInfo.contactMethod === 'email') {
    message += `Email: ${customerInfo.email}\n`;
  }
  
  message += `Delivery Address: ${customerInfo.address}\n\n`;
  message += `*Order Details:*\n`;
  
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    if (item.variant.scent) message += `   Scent: ${item.variant.scent}\n`;
    if (item.variant.size) message += `   Size: ${item.variant.size}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price: ${formatPrice(item.price * item.quantity)}\n\n`;
  });
  
  message += `*Total: ${formatPrice(parseFloat(total))}*`;
  return message;
};

// Enhanced Scroll animated section component
const ScrollAnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={{
        initial: { opacity: 0, y: 40 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.8, 
            ease: "easeOut",
            delay: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Price Display Component with Enhanced Styling
const PriceDisplay = ({ price, className = "" }) => {
  return (
    <motion.div
      variants={breathingAnimation}
      animate="animate"
      className={`inline-flex items-center justify-center px-4 py-3 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white ${className}`}
    >
      <span className="text-2xl font-serif text-amber-800 tracking-tight">
        {formatPrice(price)}
      </span>
    </motion.div>
  );
};

// Animated Logo Component
const AnimatedLogo = () => (
  <motion.div 
    variants={pulseAnimation}
    animate="animate"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative group"
  >
    <div className="w-14 h-14 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center transition-all group-hover:shadow-lg relative overflow-hidden">
      <span className="text-amber-100 font-serif text-lg tracking-wider z-10">LS</span>
      {/* Subtle ripple effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-amber-200/10 to-transparent"
        animate={{
          opacity: [0, 0.1, 0],
          scale: [1, 1.5, 2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1,
        }}
      />
    </div>
    <div className="absolute inset-0 border border-amber-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </motion.div>
);

// Animated Add to Cart Button
const AddToCartButton = ({ onClick, children }) => (
  <motion.button
    variants={buttonPulseAnimation}
    animate="animate"
    whileHover={{ 
      scale: 1.05, 
      y: -2,
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-gradient-to-r from-stone-900 to-stone-800 text-white px-10 py-4 hover:from-stone-800 hover:to-stone-700 transition-all tracking-widest text-sm shadow-xl relative overflow-hidden"
  >
    {children}
    {/* Subtle shimmer effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      animate={{
        x: [-100, 300],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3,
      }}
    />
  </motion.button>
);

const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedScent, setSelectedScent] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    contactMethod: 'whatsapp',
    phone: '',
    email: '',
    address: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const handleImageLoad = (imageId) => {
    setImageLoaded(prev => ({ ...prev, [imageId]: true }));
  };

  // Get current price based on selected size
  const getCurrentPrice = () => {
    if (!selectedProduct) return 0;
    
    if (selectedProduct.sizePrices && selectedSize) {
      return selectedProduct.sizePrices[selectedSize] || selectedProduct.price;
    }
    
    return selectedProduct.price;
  };

  const addToCart = (product) => {
    if (!selectedScent && product.scents.length > 0) {
      alert('Please select a scent');
      return;
    }
    if (!selectedSize && product.sizes.length > 0) {
      alert('Please select a size');
      return;
    }

    const currentPrice = getCurrentPrice();
    
    const cartItem = {
      ...product,
      price: currentPrice, // Use the price based on selected size
      variant: {
        scent: selectedScent || product.scents[0],
        size: selectedSize || product.sizes[0]
      },
      quantity: 1
    };

    setCart([...cart, cartItem]);
    setSelectedScent('');
    setSelectedSize('');
    setSelectedProduct(null);
    
    // Show success animation
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 600);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCustomerInfo = () => {
    if (!customerInfo.name.trim()) {
      alert('Please enter your name');
      return false;
    }
    if ((customerInfo.contactMethod === 'whatsapp' || customerInfo.contactMethod === 'phone') 
        && !customerInfo.phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    if (customerInfo.contactMethod === 'email' && !customerInfo.email.trim()) {
      alert('Please enter your email address');
      return false;
    }
    if (!customerInfo.address.trim()) {
      alert('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const proceedToOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setShowCustomerForm(true);
  };

  const completeOrder = () => {
    if (!validateCustomerInfo()) {
      return;
    }
    const message = generateWhatsAppMessage(cart, getTotalPrice().toFixed(2), customerInfo);
    const encodedMessage = encodeURIComponent(message);
    setShowCustomerForm(false);
    setIsCartOpen(false);
    setCart([]);
    setCustomerInfo({
      name: '',
      contactMethod: 'whatsapp',
      phone: '',
      email: '',
      address: ''
    });
    window.open(`https://wa.me/27610325686?text=${encodedMessage}`, '_blank');
  };

  const featuredProducts = PRODUCTS.filter(product => product.featured);

  // Fixed: Use anchor links instead of scroll handlers for reliable navigation
  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-2xl"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Top Border */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-px bg-gradient-to-r from-transparent via-amber-50 to-transparent"
      />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <AnimatedLogo />
              <div>
                <span className="text-2xl font-serif tracking-wider text-stone-900">LAURETA SCENTS</span>
                <p className="text-xs text-amber-700 tracking-widest mt-1">FINE FRAGRANCES</p>
              </div>
            </div>

            {/* Fixed: Use anchor links for navigation */}
            <nav className="hidden md:flex space-x-10">
              <a 
                href="#home" 
                className="text-stone-700 hover:text-amber-700 transition-colors tracking-wide text-sm relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-700 group-hover:w-full transition-all duration-300" />
              </a>
              <a 
                href="#shop" 
                className="text-stone-700 hover:text-amber-700 transition-colors tracking-wide text-sm relative group"
              >
                Collection
                <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-700 group-hover:w-full transition-all duration-300" />
              </a>
              <a 
                href="#about" 
                className="text-stone-700 hover:text-amber-700 transition-colors tracking-wide text-sm relative group"
              >
                Our Story
                <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-700 group-hover:w-full transition-all duration-300" />
              </a>
              <a 
                href="#contact" 
                className="text-stone-700 hover:text-amber-700 transition-colors tracking-wide text-sm relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-700 group-hover:w-full transition-all duration-300" />
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-stone-900 hover:text-amber-700 transition-colors"
              >
                <ShoppingCart size={22} strokeWidth={1.5} />
                {cart.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-stone-900"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-6 pb-6 border-t border-stone-100 pt-6 overflow-hidden"
              >
                {/* Fixed: Use anchor links for mobile navigation */}
                <nav className="flex flex-col space-y-4">
                  <a 
                    href="#home" 
                    onClick={handleMenuClick}
                    className="text-stone-700 hover:text-amber-700 tracking-wide text-sm text-left py-2"
                  >
                    Home
                  </a>
                  <a 
                    href="#shop" 
                    onClick={handleMenuClick}
                    className="text-stone-700 hover:text-amber-700 tracking-wide text-sm text-left py-2"
                  >
                    Collection
                  </a>
                  <a 
                    href="#about" 
                    onClick={handleMenuClick}
                    className="text-stone-700 hover:text-amber-700 tracking-wide text-sm text-left py-2"
                  >
                    Our Story
                  </a>
                  <a 
                    href="#contact" 
                    onClick={handleMenuClick}
                    className="text-stone-700 hover:text-amber-700 tracking-wide text-sm text-left py-2"
                  >
                    Contact
                  </a>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200/30 to-transparent"></div>
        <div className="container mx-auto px-6 relative">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center space-x-2 mb-6 px-5 py-2 bg-white border border-amber-200 rounded-full"
            >
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
              <span className="text-xs text-amber-900 tracking-widest font-medium">PREMIUM FRAGRANCES</span>
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-6xl md:text-7xl font-serif text-stone-900 mb-8 leading-tight tracking-tight"
            >
              Elevated Elegance<br/>
              <span className="text-amber-800">Timeless Grace</span>
            </motion.h1>
            
            <motion.div
              variants={fadeInUp}
              className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"
            />
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-stone-600 mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Inspired by the grace and strength of Duduzile Laureta Xaba. Each fragrance is crafted to capture the essence of her warmth and sophisticated spirit.
            </motion.p>
            
            {/* Fixed: Use anchor link for hero button */}
            <a 
              href="#shop"
              className="inline-block bg-gradient-to-r from-stone-900 to-stone-800 text-white px-12 py-5 hover:from-stone-800 hover:to-stone-700 transition-all tracking-widest text-sm shadow-xl"
            >
              EXPLORE COLLECTION
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <ScrollAnimatedSection className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-px bg-amber-400"></div>
              <span className="text-xs text-amber-700 tracking-widest">SIGNATURE</span>
              <div className="w-12 h-px bg-amber-400"></div>
            </div>
            <h2 className="text-5xl font-serif text-stone-900 tracking-tight justify-center">Our Collection</h2>
          </ScrollAnimatedSection>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-center"
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                whileHover={{ 
                  y: -10, 
                  transition: { duration: 0.3 } 
                }}
                className="group cursor-pointer relative"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Ripple effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-amber-200/0 via-transparent to-amber-100/0 rounded-lg pointer-events-none z-10"
                  whileHover={{
                    opacity: [0, 0.1, 0],
                    scale: [1, 1.02, 1.05]
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut"
                  }}
                />
                
                <div className="relative overflow-hidden mb-8 bg-stone-50">
                  <div className="relative overflow-hidden">
                    {!imageLoaded[product.id] && (
                      <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <motion.img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                      onLoad={() => handleImageLoad(product.id)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: imageLoaded[product.id] ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-6 right-6 w-12 h-12 border-2 border-white bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-white text-xs tracking-wider">VIEW</span>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-serif text-stone-900 tracking-wide">{product.name}</h3>
                  <p className="text-stone-600 leading-relaxed max-w-xs mx-auto">{product.description}</p>
                  <div className="w-16 h-px bg-amber-300 mx-auto my-4"></div>
                  <PriceDisplay price={product.price} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="container mx-auto px-6">
          <ScrollAnimatedSection className="text-center mb-20">
            <h2 className="text-5xl font-serif text-stone-900 mb-4 tracking-tight">Complete Collection</h2>
            <p className="text-stone-600 tracking-wide">Discover our curated selection</p>
          </ScrollAnimatedSection>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-10 justify-center"
          >
            {PRODUCTS.map((product, index) => (
              <motion.div
                key={product.id}
                variants={scaleIn}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group cursor-pointer bg-white hover:shadow-2xl transition-all duration-500 relative"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Enhanced ripple effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-amber-200/0 via-transparent to-amber-100/0 pointer-events-none z-10"
                  whileHover={{
                    opacity: [0, 0.08, 0],
                    scale: [1, 1.02, 1.05]
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut"
                  }}
                />
                
                <div className="relative overflow-hidden">
                  <div className="relative overflow-hidden">
                    {!imageLoaded[`shop-${product.id}`] && (
                      <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <motion.img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                      onLoad={() => handleImageLoad(`shop-${product.id}`)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: imageLoaded[`shop-${product.id}`] ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.08 }}
                    />
                  </div>
                  <div className="absolute inset-0 border-4 border-white opacity-0 group-hover:opacity-100 transition-opacity m-3"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-serif text-lg text-stone-900 mb-2 tracking-wide">{product.name}</h3>
                  <PriceDisplay price={product.price} className="px-3 py-2 text-lg" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <ScrollAnimatedSection delay={0.2}>
        <section id="about" className="py-28 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/20 to-transparent"></div>
          <div className="container mx-auto px-6 max-w-4xl relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-3 mb-6">
                <div className="w-16 h-px bg-amber-400"></div>
                <span className="text-xs text-amber-700 tracking-widest">HERITAGE</span>
                <div className="w-16 h-px bg-amber-400"></div>
              </div>
              <h2 className="text-5xl font-serif text-stone-900 tracking-tight">A Legacy of Excellence</h2>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-stone-700 space-y-8 leading-relaxed text-lg"
            >
              <motion.p variants={fadeInUp} className="text-center">
                Laureta Scents is a fragrant expression of a remarkable woman, Duduzile Laureta Xaba. Her life is a masterful composition of unwavering strength and profound grace—a continuous inspiration for everything we create.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-center">
                Each fragrance is crafted to echo the essence of her spirit. With meticulous attention to detail, our scents are designed to embody the same delicate balance she exemplifies: the harmony of nurture and boldness, the blend of warmth and sophisticated elegance..
              </motion.p>
              <motion.div variants={fadeInUp} className="text-center pt-8">
                <p className="text-amber-800 italic font-serif text-xl">
                  "In every note, the essence of her philosophy."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </ScrollAnimatedSection>

      {/* Contact Section */}
      <ScrollAnimatedSection delay={0.3}>
        <section id="contact" className="py-24 bg-gradient-to-b from-stone-50 to-white">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif text-stone-900 mb-4 tracking-tight">Connect With Us</h2>
              <p className="text-stone-600 tracking-wide">We welcome your inquiries</p>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { icon: Phone, text: "(+27)61 032 5686" },
                { icon: Mail, text: "lauretascents.co.za" },
                { icon: MapPin, text: "Ermelo, Mpumalanga" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="text-center p-8 bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="text-amber-800" size={20} strokeWidth={1.5} />
                  </div>
                  <p className="text-stone-800 font-medium tracking-wide">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </ScrollAnimatedSection>

      {/* Elegant Bottom Border */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
      />

      {/* Rest of the code remains the same for modals, cart, etc. */}
      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-stone-100">
                  <div>
                    <h2 className="text-4xl font-serif text-stone-900 tracking-tight mb-2">{selectedProduct.name}</h2>
                    <p className="text-xs text-amber-700 tracking-widest">PREMIUM FRAGRANCE</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedProduct(null)}
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <X size={28} strokeWidth={1.5} />
                  </motion.button>
                </div>
                
                <div className="relative mb-10 overflow-hidden">
                  <img 
                    src={selectedProduct.images[0]} 
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 border-8 border-white m-4"></div>
                </div>
                
                <p className="text-stone-700 mb-10 leading-relaxed text-lg text-center max-w-2xl mx-auto">{selectedProduct.description}</p>
                
                {selectedProduct.scents.length > 0 && (
                  <div className="mb-8">
                    <label className="block text-center text-sm tracking-widest text-stone-900 mb-6 font-medium">SELECT SCENT</label>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedProduct.scents.map(scent => (
                        <motion.button
                          key={scent}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedScent(scent)}
                          className={`p-4 border-2 transition-all tracking-wide ${
                            selectedScent === scent 
                              ? 'border-amber-600 bg-gradient-to-br from-amber-50 to-amber-100 text-stone-900 shadow-md' 
                              : 'border-stone-200 hover:border-amber-300 hover:shadow-sm'
                          }`}
                        >
                          {scent}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProduct.sizes.length > 0 && (
                  <div className="mb-10">
                    <label className="block text-center text-sm tracking-widest text-stone-900 mb-6 font-medium">SELECT SIZE</label>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedProduct.sizes.map(size => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedSize(size);
                          }}
                          className={`p-4 border-2 transition-all tracking-wide ${
                            selectedSize === size 
                              ? 'border-amber-600 bg-gradient-to-br from-amber-50 to-amber-100 text-stone-900 shadow-md' 
                              : 'border-stone-200 hover:border-amber-300 hover:shadow-sm'
                          }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-8 border-t border-stone-100">
                  <PriceDisplay price={getCurrentPrice()} className="px-6 py-4" />
                  <AddToCartButton onClick={() => addToCart(selectedProduct)}>
                    ADD TO CART
                  </AddToCartButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial="initial"
              animate="animate"
              exit="exit"
              variants={slideInRight}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-stone-100">
                  <h2 className="text-3xl font-serif text-stone-900 tracking-tight">Your Cart</h2>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCartOpen(false)}
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <X size={28} strokeWidth={1.5} />
                  </motion.button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-20">
                      <ShoppingCart className="mx-auto text-stone-300 mb-4" size={48} strokeWidth={1} />
                      <p className="text-stone-500 tracking-wide">Your cart is empty</p>
                    </div>
                  ) : (
                    <motion.div 
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                      className="space-y-6"
                    >
                      {cart.map((item, index) => (
                        <motion.div
                          key={index}
                          variants={fadeInUp}
                          className="flex items-center space-x-6 p-6 bg-gradient-to-br from-stone-50 to-white border border-stone-100"
                        >
                          <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="w-20 h-20 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif text-stone-900 text-lg mb-1 tracking-wide">{item.name}</h3>
                            <div className="text-sm text-stone-600 space-y-1">
                              {item.variant.scent && <p>Scent: {item.variant.scent}</p>}
                              {item.variant.size && <p>Size: {item.variant.size}</p>}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-3">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(index, item.quantity - 1)}
                                  className="w-8 h-8 border border-stone-300 flex items-center justify-center hover:border-amber-400 transition-colors"
                                >
                                  <Minus size={14} strokeWidth={2} />
                                </motion.button>
                                <span className="text-stone-900 font-medium w-8 text-center">{item.quantity}</span>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(index, item.quantity + 1)}
                                  className="w-8 h-8 border border-stone-300 flex items-center justify-center hover:border-amber-400 transition-colors"
                                >
                                  <Plus size={14} strokeWidth={2} />
                                </motion.button>
                              </div>
                              <PriceDisplay price={item.price * item.quantity} className="px-3 py-1 text-base" />
                            </div>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(index)}
                            className="text-stone-400 hover:text-red-500 transition-colors p-2"
                          >
                            <X size={18} strokeWidth={2} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
                
                {cart.length > 0 && (
                  <div className="border-t border-stone-100 pt-8 mt-8">
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-stone-700 tracking-wide">Total</span>
                      <PriceDisplay price={getTotalPrice()} className="px-5 py-3 text-xl" />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={proceedToOrder}
                      className="w-full bg-gradient-to-r from-stone-900 to-stone-800 text-white py-5 hover:from-stone-800 hover:to-stone-700 transition-all tracking-widest text-sm shadow-xl"
                    >
                      PROCEED TO ORDER
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Information Form */}
      <AnimatePresence>
        {showCustomerForm && (
          <div className="fixed inset-0 z-50">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setShowCustomerForm(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-10">
                  <div className="flex justify-between items-start mb-8 pb-6 border-b border-stone-100">
                    <div>
                      <h2 className="text-3xl font-serif text-stone-900 tracking-tight mb-2">Complete Your Order</h2>
                      <p className="text-xs text-amber-700 tracking-widest">WE'LL CONTACT YOU TO FINALIZE</p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowCustomerForm(false)}
                      className="text-stone-400 hover:text-stone-900 transition-colors"
                    >
                      <X size={28} strokeWidth={1.5} />
                    </motion.button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm tracking-widest text-stone-900 mb-3 font-medium">FULL NAME *</label>
                      <input 
                        type="text" 
                        value={customerInfo.name}
                        onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                        className="w-full p-4 border-2 border-stone-200 focus:border-amber-400 focus:outline-none transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm tracking-widest text-stone-900 mb-3 font-medium">PREFERRED CONTACT METHOD *</label>
                      <select 
                        value={customerInfo.contactMethod}
                        onChange={(e) => handleCustomerInfoChange('contactMethod', e.target.value)}
                        className="w-full p-4 border-2 border-stone-200 focus:border-amber-400 focus:outline-none transition-colors"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Phone Call</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                    
                    {(customerInfo.contactMethod === 'whatsapp' || customerInfo.contactMethod === 'phone') && (
                      <div>
                        <label className="block text-sm tracking-widest text-stone-900 mb-3 font-medium">PHONE NUMBER *</label>
                        <input 
                          type="tel" 
                          value={customerInfo.phone}
                          onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                          className="w-full p-4 border-2 border-stone-200 focus:border-amber-400 focus:outline-none transition-colors"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    )}
                    
                    {customerInfo.contactMethod === 'email' && (
                      <div>
                        <label className="block text-sm tracking-widest text-stone-900 mb-3 font-medium">EMAIL ADDRESS *</label>
                        <input 
                          type="email" 
                          value={customerInfo.email}
                          onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                          className="w-full p-4 border-2 border-stone-200 focus:border-amber-400 focus:outline-none transition-colors"
                          placeholder="Enter your email address"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm tracking-widest text-stone-900 mb-3 font-medium">DELIVERY ADDRESS *</label>
                      <textarea 
                        value={customerInfo.address}
                        onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                        rows={4}
                        className="w-full p-4 border-2 border-stone-200 focus:border-amber-400 focus:outline-none transition-colors resize-none"
                        placeholder="Enter your complete delivery address"
                      />
                    </div>
                    
                    <div className="pt-6 border-t border-stone-100">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-stone-700 tracking-wide text-lg">Order Total</span>
                        <PriceDisplay price={getTotalPrice()} className="px-5 py-3 text-xl" />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={completeOrder}
                        className="w-full bg-gradient-to-r from-stone-900 to-stone-800 text-white py-5 hover:from-stone-800 hover:to-stone-700 transition-all tracking-widest text-sm shadow-xl"
                      >
                        COMPLETE ORDER
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;