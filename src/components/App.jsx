import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X, Phone, Mail, MapPin, Plus, Minus, Check, ChevronUp, AlertCircle, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';

// DatePicker Component - Scrollable Menu
const DatePicker = ({ selectedDate, onDateSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate next 60 days
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    const isToday = formatDate(date) === formatDate(today);
    
    return {
      full: `${dayName}, ${monthName} ${day}, ${year}`,
      short: `${dayName}, ${monthName} ${day}`,
      isToday
    };
  };

  const dates = generateDates();
  const selectedDateObj = selectedDate ? dates.find(d => formatDate(d) === selectedDate) : null;
  const displayText = selectedDateObj 
    ? formatDateDisplay(selectedDateObj).full 
    : 'Select a date...';

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 border-2 border-stone-200 hover:border-amber-400 focus:border-amber-400 focus:outline-none transition-colors text-left flex items-center justify-between bg-white"
      >
        <span className={selectedDate ? 'text-stone-900' : 'text-stone-400'}>
          {displayText}
        </span>
        <ChevronRight 
          size={20} 
          className={`text-stone-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white border-2 border-stone-200 shadow-xl max-h-64 overflow-y-auto"
          >
            {dates.map((date) => {
              const formatted = formatDate(date);
              const display = formatDateDisplay(date);
              const isSelected = selectedDate === formatted;
              
              return (
                <motion.button
                  key={formatted}
                  whileHover={{ backgroundColor: '#fef3c7' }}
                  onClick={() => {
                    onDateSelect(formatted);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 text-left transition-colors border-b border-stone-100 ${
                    isSelected 
                      ? 'bg-amber-100 text-amber-900 font-semibold' 
                      : 'text-stone-700 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{display.short}</span>
                    {display.isToday && (
                      <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded font-medium">
                        Today
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// TimePicker Component - Scrollable Menu
const TimePicker = ({ selectedTime, onTimeSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate time slots (30-minute intervals from 7 AM to 8 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = String(hour).padStart(2, '0');
        const minuteStr = String(minute).padStart(2, '0');
        slots.push(`${hourStr}:${minuteStr}`);
      }
    }
    return slots;
  };

  const formatTimeDisplay = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${period}`;
  };

  const timeSlots = generateTimeSlots();
  const displayText = selectedTime 
    ? formatTimeDisplay(selectedTime) 
    : 'Select a time...';

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 border-2 border-stone-200 hover:border-amber-400 focus:border-amber-400 focus:outline-none transition-colors text-left flex items-center justify-between bg-white"
      >
        <span className={selectedTime ? 'text-stone-900' : 'text-stone-400'}>
          {displayText}
        </span>
        <ChevronRight 
          size={20} 
          className={`text-stone-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white border-2 border-stone-200 shadow-xl max-h-64 overflow-y-auto"
          >
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              
              return (
                <motion.button
                  key={time}
                  whileHover={{ backgroundColor: '#fef3c7' }}
                  onClick={() => {
                    onTimeSelect(time);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 text-left transition-colors border-b border-stone-100 ${
                    isSelected 
                      ? 'bg-amber-100 text-amber-900 font-semibold' 
                      : 'text-stone-700 hover:bg-amber-50'
                  }`}
                >
                  {formatTimeDisplay(time)}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PRODUCTS = [
  {
    id: 1,
    name: "Knotless Braids",
    category: "braids",
    featured: true,
    images: [
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890462/unknown-34-652da0770bbac_vw5yo5.avif",
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890462/picture4-6528098e4ec15_sx2yyq.avif",
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890462/IMG_1130-1024x1024_he7get.jpg"
    ],
    description: "Neat, lightweight knotless braids with a natural finish.",
    scents: ["Small", "Medium"],
    sizes: ["Short", "Medium", "Long"],
    priceMatrix: {
      Small: { Short: 350, Medium: 450, Long: 500 },
      Medium: { Short: 250, Medium: 350, Long: 400 }
    },
    price: 250
  },
  {
    id: 2,
    name: "Fulani Braids",
    category: "braids",
    featured: true,
    images: [
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890463/Fulani_braids_curls_2669576937402_yu6s0u.jpg",
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890463/Fulani-braids-with-a-freestyle-design_m3nbms.jpg",
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890463/extra-long-fulani-braids-boho_medusa.studioo_1_slnlwe.webp"
    ],
    description: "Fulani braids with clean parts and beautiful detailing.",
    scents: ["Small"],
    sizes: ["Short","Medium","Long"],
    priceMatrix: {
      Small: { "Short": 350, "Medium": 350 , "Long": 400 }
      
    },
    price: 350
  },
  {
    id: 3,
    name: "Straight Back / Up Braids",
    category: "braids",
    featured: true,
    images: [
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890462/Cornrow-Braid-Hairstyles_ucrhgd.jpg",
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890462/straight_back_cornrows_stitch_and_two_buns-1_dcvyrm.jpg",
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890462/79539b3fa390c10cf5d09024f8bde49d_c2nt8q.jpg",
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890461/0475307eb1f41172_hxbto6.jpg",
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890461/444458078_18438083644019335_8785294887889425548_n-1920x1080_j8a9hn.jpg"
    ],
    description: "Straight-back or up-do braids: clean, protective, and stylish.",
    scents: ["Small", "Medium"],
    sizes: ["Short", "Medium","Long"],
    priceMatrix: {
      Small: { "Short": 200, "Medium": 200 ,Long: 250 },
      Medium: { "Short": 150, "Medium": 150, Long: 200 }
    },
    price: 150
  },
  {
    id: 4,
    name: "Cornrows",
    category: "cornrows",
    featured: false,
    images: [
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890462/gettyimages-992659140-1641498755_ec9hxm.avif",
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890461/0fgjhs3dadoqq6rti_o057cc.jpg"
    ],
    description: "Classic cornrows: free hand or styled patterns.",
    scents: [],
    sizes: ["Free hand", "Styled"],
    sizePrices: {
      "Free hand": 100,
      "Styled": 120
    },
    price: 100
  },
  {
    id: 5,
    name: "Curls (Add-on)",
    category: "addon",
    featured: false,
    images: [
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1767890463/Fulani_braids_curls_2669576937402_yu6s0u.jpg"
    ],
    description: "Curls add-on to finish your style.",
    scents: [],
    sizes: [],
    price: 50
  },
  {
    id: 6,
    name: "Wig Installation",
    category: "service",
    featured: false,
    images: [
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1768302901/79B4B8E1-ECF4-4AC5-8203-3A0812F6B78B_cavbso.webp"
      
    ],
    description: "Professional wig installation and styling.",
    scents: [],
    sizes: [],
    price: 150
  },
  {
    id: 7,
    name: "Gel on Nails",
    category: "service",
    featured: false,
    images: [
      "https://res.cloudinary.com/dorbolgjy/image/upload/v1768302895/gelmanicure-07a728f93173488aac4d90206529ab87_tq5yqw.png"
    ],
    description: "Gel nail application for beautiful, long-lasting nails.",
    scents: [],
    sizes: [],
    price: 50
  }
];

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
  let message = `*New Booking Request*\n\n`;
  message += `*Customer Information:*\n`;
  message += `Name: ${customerInfo.name}\n`;
  message += `Contact Method: ${customerInfo.contactMethod}\n`;
  
  if (customerInfo.contactMethod === 'whatsapp' || customerInfo.contactMethod === 'phone') {
    message += `Phone: ${customerInfo.phone}\n`;
  }
  
  if (customerInfo.contactMethod === 'email') {
    message += `Email: ${customerInfo.email}\n`;
  }
  
  message += `Preferred date: ${customerInfo.preferredDate}\n`;
  message += `Preferred time: ${customerInfo.preferredTime}\n`;
  if (customerInfo.notes?.trim()) {
    message += `Notes: ${customerInfo.notes}\n`;
  }
  message += `\n`;
  message += `*Order Details:*\n`;
  
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    if (item.variant.scent) message += `   Size: ${item.variant.scent}\n`;
    if (item.variant.size) message += `   Length/Style: ${item.variant.size}\n`;
    if (item.includeHairWash) message += `   Includes Hair Wash: Yes (+R50)\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price: ${formatPrice(item.price * item.quantity)}\n\n`;
  });
  
  message += `*Total: ${formatPrice(parseFloat(total))}*`;
  return message;
};

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

const ImageCarousel = ({
  images,
  alt,
  heightClass,
  autoAdvanceMs = 4000,
  className = "",
}) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!images?.length) return;

    const el = containerRef.current;
    if (!el) return;

    const updateActiveFromScroll = () => {
      const width = el.clientWidth || 1;
      const idx = Math.round(el.scrollLeft / width);
      setActiveIndex(Math.max(0, Math.min(images.length - 1, idx)));
    };

    el.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    updateActiveFromScroll();

    return () => {
      el.removeEventListener('scroll', updateActiveFromScroll);
    };
  }, [images]);

  useEffect(() => {
    if (!images?.length) return;
    if (images.length <= 1) return;

    const el = containerRef.current;
    if (!el) return;

    const id = window.setInterval(() => {
      const width = el.clientWidth || 1;
      const next = (activeIndex + 1) % images.length;
      el.scrollTo({ left: next * width, behavior: 'smooth' });
    }, autoAdvanceMs);

    return () => window.clearInterval(id);
  }, [images, activeIndex, autoAdvanceMs]);

  if (!images?.length) return null;

  const dragState = useRef({ startScrollLeft: 0, moved: false });

  return (
    <div
      className={`relative ${className}`}
      onPointerDown={() => {
        const el = containerRef.current;
        dragState.current.startScrollLeft = el?.scrollLeft ?? 0;
        dragState.current.moved = false;
      }}
      onPointerUp={() => {
        const el = containerRef.current;
        const endScrollLeft = el?.scrollLeft ?? 0;
        dragState.current.moved = Math.abs(endScrollLeft - dragState.current.startScrollLeft) > 10;
      }}
      onClick={(e) => {
        if (dragState.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          dragState.current.moved = false;
        }
      }}
    >
      <div
        ref={containerRef}
        className={`flex overflow-x-auto scroll-smooth snap-x snap-mandatory ${heightClass} rovo-hide-scrollbar`}
        style={{ scrollbarWidth: 'none' }}
      >
        {images.map((src, idx) => (
          <div key={`${src}-${idx}`} className="min-w-full snap-start">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                idx === activeIndex ? 'bg-white/90 opacity-100' : 'bg-white/70 opacity-60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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

const AnimatedLogo = () => (
  <motion.div 
    variants={pulseAnimation}
    animate="animate"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative group"
  >
    <div className="w-14 h-14 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center transition-all group-hover:shadow-lg relative overflow-hidden">
      <span className="text-amber-100 font-serif text-lg tracking-wider z-10">HS</span>
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
  const [includeHairWash, setIncludeHairWash] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    contactMethod: 'whatsapp',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showStickyBooking, setShowStickyBooking] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      setShowStickyBooking(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageLoad = (imageId) => {
    setImageLoaded(prev => ({ ...prev, [imageId]: true }));
  };

  const getCurrentPrice = () => {
    if (!selectedProduct) return 0;

    let basePrice = selectedProduct.price;

    if (selectedProduct.priceMatrix && selectedScent && selectedSize) {
      basePrice = selectedProduct.priceMatrix?.[selectedScent]?.[selectedSize] ?? basePrice;
    }

    if (selectedProduct.sizePrices && selectedSize) {
      basePrice = selectedProduct.sizePrices[selectedSize] ?? basePrice;
    }

    if (includeHairWash && ['braids', 'cornrows'].includes(selectedProduct.category)) {
      basePrice += 50;
    }

    return basePrice;
  };

  const addToCart = (product) => {
    if (!selectedScent && product.scents.length > 0) {
      alert('Please select a size');
      return;
    }
    if (!selectedSize && product.sizes.length > 0) {
      alert('Please select a length/style');
      return;
    }

    const currentPrice = getCurrentPrice();
    
    const cartItem = {
      ...product,
      price: currentPrice,
      variant: {
        scent: selectedScent || product.scents[0] || '',
        size: selectedSize || product.sizes[0] || ''
      },
      includeHairWash: includeHairWash && ['braids', 'cornrows'].includes(product.category),
      quantity: 1
    };

    setCart([...cart, cartItem]);
    setSelectedScent('');
    setSelectedSize('');
    setIncludeHairWash(false);
    setSelectedProduct(null);
    
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
    if (!customerInfo.preferredDate.trim() || !customerInfo.preferredTime.trim()) {
      alert('Please enter your preferred date/time');
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
      preferredDate: '',
      preferredTime: '',
      notes: ''
    });
    window.open(`https://wa.me/27795430029?text=${encodedMessage}`, '_blank');
  };

  const featuredProducts = PRODUCTS.filter(product => product.featured);

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      {/* Alert Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white py-3 px-6 relative z-[60]"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <AlertCircle size={20} className="flex-shrink-0" />
                <p className="text-sm md:text-base font-medium tracking-wide">
                  <span className="hidden md:inline">⚠️ Important: </span>
                  Late arrivals (20+ min) incur R20 fee • House calls +R50 • Wash hair 20min early
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowBanner(false)}
                className="ml-4 text-white hover:text-amber-100 transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Book Now Button */}
      <AnimatePresence>
        {showStickyBooking && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all flex items-center space-x-2 font-semibold tracking-wider"
          >
            <ShoppingCart size={20} />
            <span>BOOK NOW</span>
            {cart.length > 0 && (
              <span className="bg-white text-amber-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cart.length}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-50 bg-stone-900 text-white p-4 rounded-full shadow-2xl hover:bg-stone-800 transition-all"
          >
            <ChevronUp size={24} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

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

      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-px bg-gradient-to-r from-transparent via-amber-50 to-transparent"
      />
      
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
                <span className="text-2xl font-serif tracking-wider text-stone-900">MoonL Braids</span>
                <p className="text-xs text-amber-700 tracking-widest mt-1">BRAIDS • CORNROWS • CURLS</p>
              </div>
            </div>

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
                Styles
                <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-700 group-hover:w-full transition-all duration-300" />
              </a>
              <a 
                href="#about" 
                className="text-stone-700 hover:text-amber-700 transition-colors tracking-wide text-sm relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-px bg-amber-700 group-hover:w-full transition-all duration-300" />
              </a>
              <a 
                href="#policies" 
                className="text-stone-700 hover:text-amber-700 transition-colors tracking-wide text-sm relative group"
              >
                Policies
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
                    Styles
                  </a>
                  <a 
                    href="#about" 
                    onClick={handleMenuClick}
                    className="text-stone-700 hover:text-amber-700 tracking-wide text-sm text-left py-2"
                  >
                    About
                  </a>
                  <a 
                    href="#policies" 
                    onClick={handleMenuClick}
                    className="text-stone-700 hover:text-amber-700 tracking-wide text-sm text-left py-2"
                  >
                    Policies
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
              <span className="text-xs text-amber-900 tracking-widest font-medium">PROTECTIVE STYLES</span>
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-6xl md:text-7xl font-serif text-stone-900 mb-8 leading-tight tracking-tight"
            >
              Beautiful Braids<br/>
              <span className="text-amber-800">Clean Parts • Neat Finish</span>
            </motion.h1>
            
            <motion.div
              variants={fadeInUp}
              className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"
            />
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-stone-600 mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Book your next style with us — neat work, clean parts, and a beautiful finish every time.
            </motion.p>
            
            <a 
              href="#shop"
              className="inline-block bg-gradient-to-r from-stone-900 to-stone-800 text-white px-12 py-5 hover:from-stone-800 hover:to-stone-700 transition-all tracking-widest text-sm shadow-xl"
            >
              VIEW STYLES
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <ScrollAnimatedSection className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-px bg-amber-400"></div>
              <span className="text-xs text-amber-700 tracking-widest">SIGNATURE</span>
              <div className="w-12 h-px bg-amber-400"></div>
            </div>
            <h2 className="text-5xl font-serif text-stone-900 tracking-tight justify-center">Our Styles</h2>
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
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: imageLoaded[product.id] ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-96"
                    >
                      <ImageCarousel
                        images={product.images}
                        alt={product.name}
                        heightClass="h-96"
                        autoAdvanceMs={4000}
                        className="w-full"
                      />
                    </motion.div>
                    <img
                      src={product.images?.[0]}
                      alt=""
                      className="hidden"
                      onLoad={() => handleImageLoad(product.id)}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="absolute top-6 right-6 w-12 h-12 border-2 border-white bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    <span className="text-white text-xs tracking-wider">VIEW</span>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-serif text-stone-900 tracking-wide break-words px-2">{product.name}</h3>
                  <p className="text-stone-600 leading-relaxed max-w-xs mx-auto">{product.description}</p>
                  <div className="w-16 h-px bg-amber-300 mx-auto my-4"></div>
                  <PriceDisplay price={product.price} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="shop" className="py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="container mx-auto px-6">
          <ScrollAnimatedSection className="text-center mb-20">
            <h2 className="text-5xl font-serif text-stone-900 mb-4 tracking-tight">All Styles</h2>
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
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: imageLoaded[`shop-${product.id}`] ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-72"
                    >
                      <ImageCarousel
                        images={product.images}
                        alt={product.name}
                        heightClass="h-72"
                        autoAdvanceMs={4000}
                        className="w-full"
                      />
                    </motion.div>
                    <img
                      src={product.images?.[0]}
                      alt=""
                      className="hidden"
                      onLoad={() => handleImageLoad(`shop-${product.id}`)}
                    />
                  </div>
                  <div className="absolute inset-0 border-4 border-white opacity-0 group-hover:opacity-100 transition-opacity m-3 pointer-events-none"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-serif text-lg text-stone-900 mb-2 tracking-wide break-words px-2">{product.name}</h3>
                  <PriceDisplay price={product.price} className="px-3 py-2 text-lg" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
              <h2 className="text-5xl font-serif text-stone-900 tracking-tight">About Us</h2>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-stone-700 space-y-8 leading-relaxed text-lg"
            >
              <motion.p variants={fadeInUp} className="text-center">
                We specialize in protective styles and neat braiding. Our focus is clean parts, comfortable installs, and long-lasting results.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-center">
                Choose your style, then select size and length to see the correct price automatically. Send a booking request on WhatsApp and we'll confirm your appointment.
              </motion.p>
              <motion.div variants={fadeInUp} className="text-center pt-8">
                <p className="text-amber-800 italic font-serif text-xl">
                  "Style is self-care."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection delay={0.25}>
        <section id="policies" className="py-28 bg-gradient-to-b from-stone-50 to-white relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-4xl relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-3 mb-6">
                <div className="w-16 h-px bg-amber-400"></div>
                <span className="text-xs text-amber-700 tracking-widest">IMPORTANT</span>
                <div className="w-16 h-px bg-amber-400"></div>
              </div>
              <h2 className="text-5xl font-serif text-stone-900 tracking-tight">Policies</h2>
            </div>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.div 
                variants={fadeInUp}
                whileHover={{ 
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="bg-white p-8 shadow-lg hover:shadow-2xl border-l-4 border-amber-400 relative overflow-hidden group cursor-pointer transition-all duration-300"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-amber-50/0 via-amber-50/50 to-amber-50/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="flex items-start space-x-4 relative z-10">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl">⏰</span>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif text-stone-900 mb-3 tracking-wide group-hover:text-amber-800 transition-colors">Appointment Time</h3>
                    <p className="text-stone-700 leading-relaxed text-base">
                      Appointment time must be respected. If late by 20 minutes or more, a fee of <span className="font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded">R20</span> will be charged.
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                whileHover={{ 
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="bg-white p-8 shadow-lg hover:shadow-2xl border-l-4 border-amber-400 relative overflow-hidden group cursor-pointer transition-all duration-300"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-amber-50/0 via-amber-50/50 to-amber-50/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="flex items-start space-x-4 relative z-10">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl">🏠</span>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif text-stone-900 mb-3 tracking-wide group-hover:text-amber-800 transition-colors">House Calls</h3>
                    <p className="text-stone-700 leading-relaxed text-base">
                      House calls are available with an additional charge of <span className="font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded">R50 extra</span>.
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                whileHover={{ 
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="bg-white p-8 shadow-lg hover:shadow-2xl border-l-4 border-amber-400 relative overflow-hidden group cursor-pointer transition-all duration-300"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-amber-50/0 via-amber-50/50 to-amber-50/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <div className="flex items-start space-x-4 relative z-10">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl">💧</span>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif text-stone-900 mb-3 tracking-wide group-hover:text-amber-800 transition-colors">Hair Washing</h3>
                    <p className="text-stone-700 leading-relaxed text-base">
                      If your hair requires washing before styling, please arrive <span className="font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded">20 minutes earlier</span> than your scheduled appointment.
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </ScrollAnimatedSection>

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
                { icon: Phone, text: "(+27)79 543 0029" },
                { icon: MapPin, text: "Thusi Village" },
                { icon: MapPin, text: "4185 Robert Sobukwe Str" }
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

      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
      />

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
                    <p className="text-xs text-amber-700 tracking-widest">HAIR STYLING</p>
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
                    <label className="block text-center text-sm tracking-widest text-stone-900 mb-6 font-medium">SELECT SIZE</label>
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
                    <label className="block text-center text-sm tracking-widest text-stone-900 mb-6 font-medium">SELECT LENGTH / STYLE</label>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedProduct.sizes.map(size => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedSize(size);
                          }}
                          className={`p-4 border-2 transition-all tracking-wide break-words text-center min-h-[4rem] flex items-center justify-center ${
                            selectedSize === size 
                              ? 'border-amber-600 bg-gradient-to-br from-amber-50 to-amber-100 text-stone-900 shadow-md' 
                              : 'border-stone-200 hover:border-amber-300 hover:shadow-sm'
                          }`}
                        >
                          <span className="break-words">{size}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedProduct.category === 'braids' || selectedProduct.category === 'cornrows') && (
                  <div className="mb-10">
                    <label className="block text-center text-sm tracking-widest text-stone-900 mb-6 font-medium">ADDITIONAL SERVICES</label>
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIncludeHairWash(!includeHairWash)}
                        className={`p-4 border-2 transition-all tracking-wide flex items-center gap-3 ${
                          includeHairWash 
                            ? 'border-amber-600 bg-gradient-to-br from-amber-50 to-amber-100 text-stone-900 shadow-md' 
                            : 'border-stone-200 hover:border-amber-300 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-5 h-5 border-2 flex items-center justify-center ${includeHairWash ? 'border-amber-600 bg-amber-600' : 'border-stone-300'}`}>
                          {includeHairWash && <Check size={12} className="text-white" />}
                        </div>
                        <span>Include Hair Wash (+R50)</span>
                      </motion.button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-8 border-t border-stone-100">
                  <PriceDisplay price={getCurrentPrice()} className="px-6 py-4" />
                  <AddToCartButton onClick={() => addToCart(selectedProduct)}>
                    ADD TO BOOKING
                  </AddToCartButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <h2 className="text-3xl font-serif text-stone-900 tracking-tight">Your Booking</h2>
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
                              {item.variant.scent && <p>Size: {item.variant.scent}</p>}
                              {item.variant.size && <p>Length/Style: {item.variant.size}</p>}
                              {item.includeHairWash && <p className="text-amber-700">✓ Includes Hair Wash (+R50)</p>}
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
                      REQUEST BOOKING
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                      <h2 className="text-3xl font-serif text-stone-900 tracking-tight mb-2">Booking Details</h2>
                      <p className="text-xs text-amber-700 tracking-widest">WE'LL CONFIRM YOUR APPOINTMENT</p>
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
                    
                    <div className="space-y-3">
                      <label className="block text-sm tracking-widest text-stone-900 mb-3 font-medium">PREFERRED DATE / TIME *</label>
                      
                      {/* Date Picker */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar size={16} className="text-amber-600" />
                          <span className="text-xs font-medium text-stone-600 tracking-wide">DATE</span>
                        </div>
                        <DatePicker
                          selectedDate={customerInfo.preferredDate}
                          onDateSelect={(date) => handleCustomerInfoChange('preferredDate', date)}
                        />
                      </div>

                      {/* Time Picker */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock size={16} className="text-amber-600" />
                          <span className="text-xs font-medium text-stone-600 tracking-wide">TIME</span>
                        </div>
                        <TimePicker
                          selectedTime={customerInfo.preferredTime}
                          onTimeSelect={(time) => handleCustomerInfoChange('preferredTime', time)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm tracking-widest text-stone-900 mb-3 font-medium">NOTES (OPTIONAL)</label>
                      <textarea
                        value={customerInfo.notes}
                        onChange={(e) => handleCustomerInfoChange('notes', e.target.value)}
                        rows={4}
                        className="w-full p-4 border-2 border-stone-200 focus:border-amber-400 focus:outline-none transition-colors resize-none"
                        placeholder="Anything we should know? (hair color, curls add-on, special requests)"
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