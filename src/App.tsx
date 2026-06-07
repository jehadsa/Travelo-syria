/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Menu, X, Globe, User, Bell, ChevronRight, ChevronLeft, 
  MapPin, Star, Bed, Calendar, Phone, Users, Shield, CheckCircle2,
  ListFilter, Sparkles, Trash2, SlidersHorizontal, ArrowLeftCircle, Heart,
  Sun, Moon, LayoutGrid, Hotel, Building, Car, Utensils, Home
} from 'lucide-react';

import { Language, User as UserType, Trip, Booking, Notification, ToastMessage } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getStoredLanguage, setStoredLanguage, 
  getStoredUser, setStoredUser,
  getStoredTrips, updateStoredTripBooking,
  getStoredBookings, addStoredBooking,
  getStoredNotifications, setNotificationRead, markAllNotificationsRead, clearAllStoredNotifications, addStoredNotification
} from './localStorageEngine';

// Subcomponents
import { AboutUs } from './components/AboutUs';
import { Services } from './components/Services';
import { ContactSection } from './components/ContactSection';
import { MapContainer } from './components/MapContainer';
import { Toasts } from './components/Toasts';
import { Modals } from './components/Modals';
import { AdminPanel } from './components/AdminPanel';
import { CompanyPortal } from './components/CompanyPortal';

export default function App() {
  // Core reactive states
  const [lang, setLang] = useState<Language>(getStoredLanguage());
  const [currentUser, setCurrentUser] = useState<UserType | null>(getStoredUser());
  const [trips, setTrips] = useState<Trip[]>(getStoredTrips());
  const [bookings, setBookings] = useState<Booking[]>(getStoredBookings());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activePage, setActivePage] = useState<'home' | 'admin' | 'company'>('home');

  // Real-time time display clock
  const [currentTime, setCurrentTime] = useState('');

  // UI menus & dropdown triggers
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  // Refs for closing dropdowns on click outside
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Modular modals triggers passed to Modals component
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [authRequiredOpen, setAuthRequiredOpen] = useState(false);

  // Interactive filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hotels' | 'cars' | 'restaurants' | 'apartments' | 'favorites'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'booked'>('all');

  // Currently viewing overlays
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [detailActiveImgIndex, setDetailActiveImgIndex] = useState(0);

  // Active bookings inputs
  const [bookingTrip, setBookingTrip] = useState<Trip | null>(null);
  
  // Generic booking form states
  const [bookingFullName, setBookingFullName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingDays, setBookingDays] = useState(3);
  
  // Hotel specific toggles
  const [hotelNationality, setHotelNationality] = useState<'syrian' | 'tourist' | null>(null);
  const [hotelMaritalStatus, setHotelMaritalStatus] = useState<'single' | 'married_children' | 'married_new' | null>(null);
  const [uploadedId, setUploadedId] = useState<string | null>(null);
  const [uploadedPassport, setUploadedPassport] = useState<string | null>(null);
  const [uploadedFamilyBook, setUploadedFamilyBook] = useState<string | null>(null);
  const [uploadedContract, setUploadedContract] = useState<string | null>(null);

  // Car specific toggles
  const [carDriverOption, setCarDriverOption] = useState<'with_driver' | 'without_driver'>('without_driver');

  // Section limit toggles (Show All when > 3 elements)
  const [showAllHotels, setShowAllHotels] = useState(false);
  const [showAllCars, setShowAllCars] = useState(false);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);
  const [showAllApartments, setShowAllApartments] = useState(false);

  // Favorites persistence state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('travelo_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync favorites changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('travelo_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error writing favorites to localStorage', e);
    }
  }, [favorites]);

  // Reviews dynamic state corresponding to unique listings
  const [reviews, setReviews] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('travelo_reviews');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    // default reviews list or empty
    return [
      { id: 'rev-1', tripId: '1', userName: 'أحمد علي', rating: 5, comment: 'فندق مذهل وإطلالة ساحرة جداً غاية في الهدوء والرفاهية. الخدمة سريعة وممتازة والأسرة في غاية الراحة والنظافة.', date: '2026-05-12' },
      { id: 'rev-2', tripId: '1', userName: 'ريم السعيد', rating: 4, comment: 'فندق جميل وهادئ، الغرفة كانت نظيفة جداً والمعاملة راقية واستمتعنا كثيراً بإقامتنا هنا وبالمرافق الفاخرة المتاحة.', date: '2026-05-20' },
      { id: 'rev-3', tripId: '2', userName: 'محمد الحمصي', rating: 5, comment: 'سيارة نظيفة وجاهزة تماماً، وسرعة في استكمال الإجراءات والمعاملة احترافية جداً ومريحة لأبعد الحدود.', date: '2026-05-25' },
      { id: 'rev-4', tripId: '3', userName: 'سارة دمشق', rating: 5, comment: 'أجواء دمشقية تقليدية ساحرة، والطعام شهي ومميز وخاصة الفتة الشامية واللحوم المشوية رائعة ومذهلة!', date: '2026-05-28' },
    ];
  });

  // State fields for the active review input form
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Handle submitting reviews
  const handleAddReview = (tripId: string) => {
    if (!newReviewComment.trim()) return;
    const nameToUse = newReviewName.trim() || (currentUser ? currentUser.name : (lang === 'ar' ? 'زائر كرم' : 'Valued Guest'));
    const newRatingItem = {
      id: 'rev-' + Date.now(),
      tripId,
      userName: nameToUse,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [newRatingItem, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('travelo_reviews', JSON.stringify(updatedReviews));

    // Reset fields
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);

    handleShowToast(
      '⭐️',
      'تمت إضافة تعليقك وتقييمك بنجاح!',
      'Review submitted successfully!',
      lang === 'ar' ? 'شكراً لمشاركتك رأيك القيّم معنا في ترافيلو.' : 'Thank you for sharing your valuable thoughts with Travelo.',
      lang === 'ar' ? 'سيظهر تعليقك فوراً للجميع لخدمة أدق تفاصيل الشفافية.' : 'Your feed is live in our guest activity transparent index.',
      '#0d9488'
    );
  };

  // Global Theme (Light/Dark Mode) State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('travelo_theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      return 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    handleShowToast(
      nextTheme === 'dark' ? '🌙' : '☀️',
      nextTheme === 'dark' ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع المضيء',
      nextTheme === 'dark' ? 'Dark Mode Activated' : 'Light Mode Activated',
      nextTheme === 'dark' ? 'تم تحويل التطبيق للوضع الداكن المريح للعينين.' : 'تم تحويل التطبيق للوضع المضيء والكلاسيكي.',
      nextTheme === 'dark' ? 'The application has switched to eye-safe dark mode style.' : 'The application has switched to classic light mode theme.',
      nextTheme === 'dark' ? 'indigo' : 'teal'
    );
  };

  // Sync theme selection to document element (Tailwind dark class) & localStorage
  useEffect(() => {
    try {
      localStorage.setItem('travelo_theme', theme);
    } catch (e) {
      console.error('Error writing theme to localStorage', e);
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync initial language directions and fetch notifications
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    setStoredLanguage(lang);
    if (currentUser) {
      setNotifications(getStoredNotifications());
    }
  }, [lang, currentUser]);

  // Real-time Clock loop (VIP UX Damascus Time Simulation)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Emulate Damascus time zone
      const formatter = new Intl.DateTimeFormat('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Damascus'
      });
      setCurrentTime(formatter.format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Listen to URL hash and path name changes for true standalone page routing
  useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#/admin' || hash === '#admin' || path === '/admin' || path.endsWith('/admin')) {
        setActivePage('admin');
      } else if (hash === '#/company' || hash === '#company' || path === '/company' || path.endsWith('/company')) {
        setActivePage('company');
      } else {
        setActivePage('home');
      }
    };
    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // Sync separate tabs / standalone page changes in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'travelo_trips') {
        setTrips(getStoredTrips());
      }
      if (e.key === 'travelo_bookings') {
        setBookings(getStoredBookings());
      }
      if (e.key === 'travelo_user') {
        setCurrentUser(getStoredUser());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Scroll Lock effect for overlays and modals (locks main page background scroll)
  useEffect(() => {
    const isAnyOverlayActive = 
      isSidebarOpen || 
      selectedTrip !== null || 
      bookingTrip !== null || 
      loginModalOpen || 
      signupModalOpen || 
      editProfileOpen || 
      authRequiredOpen;

    if (isAnyOverlayActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [
    isSidebarOpen, 
    selectedTrip, 
    bookingTrip, 
    loginModalOpen, 
    signupModalOpen, 
    editProfileOpen, 
    authRequiredOpen
  ]);

  // Set default account login status inside state
  const handleSetUser = (user: UserType | null) => {
    setCurrentUser(user);
    setStoredUser(user);
    if (!user) {
      setNotifications([]);
    } else {
      setNotifications(getStoredNotifications());
    }
  };

  // Toast notifier
  const handleShowToast = (icon: string, titleAr: string, titleEn: string, bodyAr: string, bodyEn: string, color: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev, { id, icon, title: titleAr, titleEn, body: bodyAr, bodyEn, color }]);
    
    // Auto erase toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Switch languages seamlessly
  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  // Toggle favorites state with toast notifications
  const toggleFavorite = (tripId: string) => {
    const isFav = favorites.includes(tripId);
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== tripId));
      handleShowToast(
        '🤍',
        'تمت الإزالة من المفضلة',
        'Removed from Favorites',
        'تمت إزالة هذا العرض من قائمتك المفضلة.',
        'This offer has been removed from your favorites list.',
        'slate'
      );
    } else {
      setFavorites(prev => [...prev, tripId]);
      handleShowToast(
        '❤️',
        'تمت الإضافة للمفضلة',
        'Added to Favorites',
        'تمت إضافة هذا العرض إلى قائمتك المفضلة بنجاح.',
        'This offer has been successfully added to your favorites list.',
        'teal'
      );
    }
  };

  const handleLogout = () => {
    handleSetUser(null);
    setStoredUser(null);
    handleShowToast(
      '👋',
      'تم تسجيل الخروج',
      'Logged Out',
      'في أمان الله! نتنافس لخدمتكم قريباً في ترافيلو.',
      'Farewell! We hope to serve you again soon on Travelo.',
      '#e11d48'
    );
    setIsUserOpen(false);
  };

  const handleMarkRead = (notifId: string) => {
    const updated = setNotificationRead(notifId);
    setNotifications(updated);
  };

  const handleReadAll = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
  };

  const handleClearNotifs = () => {
    const updated = clearAllStoredNotifications();
    setNotifications(updated);
  };

  // Book trigger directly from cards or details popup
  const handleTriggerBooking = (trip: Trip) => {
    if (!currentUser) {
      setAuthRequiredOpen(true);
      return;
    }
    setBookingTrip(trip);
    setBookingFullName(currentUser.name || '');
    setBookingPhone(currentUser.phone || '');
    setBookingGuests(2);
    setBookingDays(3);
    setHotelNationality(null);
    setHotelMaritalStatus(null);
    setUploadedId(null);
    setUploadedPassport(null);
    setUploadedFamilyBook(null);
    setUploadedContract(null);
    setCarDriverOption('without_driver');
  };

  // Pre-configured dynamic pricing for cars
  const getCarPricingSummary = () => {
    if (!bookingTrip) return { dailyRate: 0, driverCost: 0, total: 0 };
    const basePrice = parseInt(bookingTrip.price) || 30;
    const driverIncrement = carDriverOption === 'with_driver' ? 20 : 0;
    const dailyRate = basePrice + driverIncrement;
    const total = dailyRate * bookingDays;
    return { dailyRate, driverCost: driverIncrement, total };
  };

  // File drop mocks with instant previews
  const handleFileUploadMock = (type: 'id' | 'passport' | 'family' | 'contract') => {
    const responses = {
      id: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=300&q=80',
      passport: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
      family: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?auto=format&fit=crop&w=300&q=80',
      contract: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=300&q=80'
    };
    
    if (type === 'id') setUploadedId(responses.id);
    else if (type === 'passport') setUploadedPassport(responses.passport);
    else if (type === 'family') setUploadedFamilyBook(responses.family);
    else if (type === 'contract') setUploadedContract(responses.contract);

    handleShowToast(
      '📎',
      'تم إرفاق الوثيقة',
      'Document Attached',
      'تم تأمين ورفع المستند الثبوتي إلى خادم الحجوزات بأمان.',
      'Document uploaded and encrypted on current booking successfully.',
      '#0d9488'
    );
  };

  const handleConfirmBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTrip || !currentUser) return;

    // Validate specific triggers
    if (bookingTrip.category === 'hotels' || bookingTrip.category === 'apartments') {
      if (!hotelNationality || !hotelMaritalStatus) {
        alert(lang === 'ar' ? 'يرجى تحديد الجنسية والحالة الاجتماعية أولاً.' : 'Please select nationality and marital status.');
        return;
      }
      if (hotelNationality === 'syrian' && !uploadedId) {
        alert(lang === 'ar' ? 'يرجى إرفاق صورة الهوية الوطنية.' : 'Please attach Syrian National ID.');
        return;
      }
      if (hotelNationality === 'tourist' && !uploadedPassport) {
        alert(lang === 'ar' ? 'يرجى إرفاق صورة جواز السفر.' : 'Please attach Passport document.');
        return;
      }
      if (hotelMaritalStatus === 'married_children' && !uploadedFamilyBook) {
        alert(lang === 'ar' ? 'يرجى إرفاق صورة دفتر العائلة.' : 'Please upload Family Book.');
        return;
      }
      if (hotelMaritalStatus === 'married_new' && (!uploadedContract || !uploadedFamilyBook)) {
        alert(lang === 'ar' ? 'يرجى إرفاق صور عقد الزواج ودفتر العائلة.' : 'Please upload Family book & Marriage contract.');
        return;
      }
    }

    const { total: carTotal } = getCarPricingSummary();
    const guestTotal = bookingGuests * (parseInt(bookingTrip.price) || 0);

    const newBooking: Booking = {
      id: 'book-' + Math.random().toString(36).slice(2, 9),
      tripId: bookingTrip.id,
      tripTitle: bookingTrip.title,
      tripTitleEn: bookingTrip.title_en,
      bookingType: bookingTrip.category,
      userEmail: currentUser.email,
      date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'pending',
      details: {
        fullName: bookingFullName,
        phone: bookingPhone,
        guestCount: (bookingTrip.category !== 'cars' && bookingTrip.category !== 'apartments') ? String(bookingGuests) : undefined,
        days: (bookingTrip.category === 'cars' || bookingTrip.category === 'apartments' || bookingTrip.category === 'hotels') ? bookingDays : undefined,
        nationality: hotelNationality || undefined,
        maritalStatus: hotelMaritalStatus || undefined,
        driverOption: bookingTrip.category === 'cars' ? carDriverOption : undefined,
        totalPrice: bookingTrip.category === 'restaurants' ? 0 : (bookingTrip.category === 'cars' ? carTotal : (bookingTrip.category === 'hotels' || bookingTrip.category === 'apartments') ? (bookingDays * Number(bookingTrip.price)) : Number(bookingTrip.price))
      }
    };

    // Save and flag trip catalog as reserved
    const updatedBookings = addStoredBooking(newBooking);
    setBookings(updatedBookings);
    setTrips(getStoredTrips()); // Reload trips to show reserved flags

    // Spawn notification and success toast
    handleShowToast(
      '🌟',
      'تم إرسال طلب حجزك!',
      'Booking Request Sent!',
      `تم إيداع طلب حجز ${bookingTrip.title} بنجاح ومراجعته جارية.`,
      `Your booking request for ${bookingTrip.title_en} has been submitted for review.`,
      '#0d9488'
    );

    // Auto-accept trip simulation after 6 seconds for extreme realistic polish
    setTimeout(() => {
      const userMail = currentUser.email;
      const acceptNotif: Notification = {
        id: 'acc-' + Math.random().toString(36).slice(2, 9),
        message: `تهانينا يا ${bookingFullName}! تم قبول طلب حجزك لـ (${bookingTrip.title}) وتأكيد حجز مرشدكم المخصص لرحلتكم.`,
        message_en: `Good news ${bookingFullName}! Your reservation for (${bookingTrip.title_en}) has been formally APPROVED by Travelo administration.`,
        type: 'accepted',
        read: false,
        date: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      
      // Persist welcome simulation notification
      addStoredNotification(acceptNotif);
      if (currentUser && currentUser.email === userMail) {
        setNotifications(getStoredNotifications());
        handleShowToast(
          '✅',
          'موافقة على الحجز!',
          'Booking Approved!',
          `تمت الموافقة الرسمية على حجزك لـ ${bookingTrip.title}! تصفح إشعاراتك الآن.`,
          `Your reservation for ${bookingTrip.title_en} was approved! View notifications.`,
          '#10b981'
        );
      }
    }, 6000);

    setBookingTrip(null);
  };

  // Dynamic filter query logic
  const filteredTrips = trips.filter(trip => {
    const isCategoryMatch = selectedCategory === 'all' || 
      (selectedCategory === 'favorites' ? favorites.includes(trip.id) : trip.category === selectedCategory);
    
    const isAvailabilityMatch = availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && !trip.isBooked) ||
      (availabilityFilter === 'booked' && trip.isBooked);

    const titleField = lang === 'ar' ? trip.title : trip.title_en;
    const descField = lang === 'ar' ? (trip.description || '') : (trip.description_en || '');
    const locationField = lang === 'ar' ? (trip.locationName || '') : (trip.locationName_en || '');
    
    const matchStr = `${titleField} ${descField} ${locationField}`.toLowerCase();
    const isSearchMatch = matchStr.includes(searchQuery.toLowerCase());

    return isCategoryMatch && isAvailabilityMatch && isSearchMatch;
  });

  const filteredHotels = filteredTrips.filter(t => t.category === 'hotels');
  const filteredCars = filteredTrips.filter(t => t.category === 'cars');
  const filteredRestaurants = filteredTrips.filter(t => t.category === 'restaurants');
  const filteredApartments = filteredTrips.filter(t => t.category === 'apartments');

  // Arabic/English Dictionary Mappings
  const isAr = lang === 'ar';
  const lex = {
    ar: {
      brand: "Travelo",
      subtitle: "Explore Syria With Us",
      tagline: "ترافيلو - بوابتك الفاخرة لحجز الفنادق وأرقى الخدمات في سوريا",
      home: "الرئيسية",
      hotels: "حجز فندق",
      apartments: "أجار شقق سكنية",
      cars: "حجز سيارة",
      restaurants: "مطاعم",
      about: "من نحن",
      services: "خدماتنا",
      contact: "اتصل بنا",
      searchPlaceholder: "ابحث عن فندق، مدينة، أو مطعم في سوريا...",
      searchBtn: "بحث",
      all: "الكل",
      filterTitle: "عروض الرحلات والخدمات المتوفرة",
      noResults: "عذراً، لم نعثر على أي نتائج مطابقة لبحثك.",
      hotelOffers: "🏨 فندق شريك",
      carOffers: "🚗 تأجير السيارات",
      restaurantOffers: "🍽️ المطاعم الفاخرة",
      rating: "التقييم العام",
      price: "السعر",
      bookedBadge: "محجوز",
      availableBadge: "متاح للحجز",
      detailsBtn: "عرض التفاصيل الكاملة",
      bookNow: "احجز الآن",
      bedTypeTwo: "سريرين لشخصين",
      bedTypeSingle: "سرير فردي لشخص واحد",
      additionalDetails: "مزايا وخدمات إضافية مدمجة:",
      notifTitle: "الإشعارات الواردة",
      noNotifs: "لا توجد إشعارات حالياً",
      markAllRead: "قراءة الكل",
      clearAllNotifs: "تفريغ السجل",
      editProfile: "تعديل الملف الشخصي",
      logout: "تسجيل الخروج",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      welcomeUser: "مرحباً يا",
      bookingHistory: "سجل حجزك",
      damascusTime: "وقيت دمشق",
      availableFilters: "تصنيف العروض",
      allStatus: "جميع الحالات",
      onlyAvailable: "المتاحة فقط",
      onlyBooked: "المحجوزة مسبقاً",
      closeDetails: "الرجوع للرئيسية",
      hotelFormTitle: "بيانات حجز الفندق",
      hotelFormSub: "يرجى اختيار وتعبئة المستندات المطلوبة حسب قوانين الجمهورية العربية السورية للفنادق.",
      nationalityPrompt: "الجنسية والتبعية الوطنية",
      syrian: "سوري / سورية",
      foreigner: "سائح أجنبي / مغترب",
      maritalPrompt: "الحالة الاجتماعية للنزيل",
      single: "أعزب / عزباء",
      marriedChildren: "متزوج وعائلته معه",
      newMarried: "متزوجون قريباً (شهر العسل)",
      uploadBoxTitle: "انقر لرفع المستند المطلوب رقمياً",
      nationalIdPhoto: "صورة الهوية الشخصية السورية *",
      passportPhoto: "صورة جواز السفر الدولي *",
      familyBookPhoto: "صورة الصفحة الأولى من دفتر العائلة *",
      contractPhoto: "صورة عقد الزواج الرسمي المصدق *",
      fullname: "الاسم الثلاثي بالكامل *",
      phone: "رقم الموبايل للتواصل والدعم *",
      guestSlider: "عدد النزلاء والضيوف المعنيين بالحجز: ",
      confirmBookBtn: "تأكيد وإرسال طلب الحجز آلياً",
      carPriceMultiply: "التكلفة اليومية شاملة السائق والخيار المختار:",
      driverPrompt: "خيارات السائق المصاحب:",
      withoutDriver: "قيادة شخصية (بدون سائق)",
      withDriver: "سائق خاص من شركة ترافيلو (+$20 يومياً)",
      daysSlider: "مدة استئجار وتأجير السيارة المطلوبة: ",
      showAll: "عرض الكل",
      showLess: "عرض أقل"
    },
    en: {
      brand: "Travelo",
      subtitle: "Explore Syria With Us",
      tagline: "Explore Syria with premium hotel, car and dining reservations",
      home: "Home",
      hotels: "Hotels",
      apartments: "Apartments",
      cars: "Cars",
      restaurants: "Restaurants",
      about: "About",
      services: "Services",
      contact: "Contact us",
      searchPlaceholder: "Search for hotels, towns, or dining spots in Syria...",
      searchBtn: "Search",
      all: "All Stays",
      filterTitle: "Curated Syrian listings and premium offers",
      noResults: "Sorry, no listings matched your query.",
      hotelOffers: "🏨 Hotel Room",
      carOffers: "🚗 Luxury Car Rental",
      restaurantOffers: "🍽️ Traditional Dining",
      rating: "Rating",
      price: "Price",
      bookedBadge: "Fully Reservated",
      availableBadge: "Available",
      detailsBtn: "View Details",
      bookNow: "Book Now",
      bedTypeTwo: "Double Beds Room",
      bedTypeSingle: "Single Cozy Bed Room",
      additionalDetails: "Exclusive properties & included services:",
      notifTitle: "Notifications Feed",
      noNotifs: "No new updates yet",
      markAllRead: "Mark all as read",
      clearAllNotifs: "Clear Feed",
      editProfile: "Modify Account Info",
      logout: "Logout",
      login: "Login",
      register: "Sign Up",
      welcomeUser: "Welcome,",
      bookingHistory: "Bookings List",
      damascusTime: "Damascus Time",
      availableFilters: "Catalog Status",
      allStatus: "All Properties",
      onlyAvailable: "Only Available Stays",
      onlyBooked: "Only Reserved Stays",
      closeDetails: "Back to Catalog",
      hotelFormTitle: "Hotel Stay Specifications",
      hotelFormSub: "Kindly adjust and upload the certified identification documents required by the Syrian Hospitality Association.",
      nationalityPrompt: "Resident Citizenship",
      syrian: "Syrian Citizen",
      foreigner: "Foreign Tourist / Migrant",
      maritalPrompt: "Resident Marital Status",
      single: "Single Resident",
      marriedChildren: "Married with children accompanied",
      newMarried: "Newlyweds Stay / Honeymoon",
      uploadBoxTitle: "Click to upload certified scan",
      nationalIdPhoto: "Syrian National ID card copy *",
      passportPhoto: "Certified Passport copy *",
      familyBookPhoto: "Accompanying Family Book page copy *",
      contractPhoto: "Marriage Certificate copy *",
      fullname: "Full Legal Name *",
      phone: "Mobile phone contact digits *",
      guestSlider: "Number of accompanying guests: ",
      confirmBookBtn: "Submit Certified Reservation Request",
      carPriceMultiply: "Effective daily rental rate:",
      driverPrompt: "Private Driver Concierge Choices:",
      withoutDriver: "Self-Driving Lease",
      withDriver: "Travelo Dedicated Private Driver (+$20/day)",
      daysSlider: "Lease Period (Days Selection): ",
      showAll: "Show All",
      showLess: "Show Less"
    }
  }[lang];

  const renderTripCard = (trip: Trip) => {
    const title = isAr ? trip.title : trip.title_en;
    const subtitle = isAr ? trip.subtitle : trip.subtitle_en;
    const location = isAr ? trip.locationName : trip.locationName_en;

    // Determine category-specific high-contrast styling tokens
    const config = {
      hotels: {
        accentColor: "text-teal-600",
        badgeBg: "bg-teal-50 text-teal-700 border-teal-100",
        shadowHover: "hover:shadow-teal-900/5 hover:border-teal-500/10 hover:border-teal-500/20",
        btnClass: "bg-teal-600 hover:bg-teal-700 shadow-teal-600/10",
        emoji: "🏨",
        typeLabel: isAr ? "فندق فاخر" : "Luxury Hotel"
      },
      cars: {
        accentColor: "text-indigo-600",
        badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
        shadowHover: "hover:shadow-indigo-900/5 hover:border-indigo-500/10 hover:border-indigo-500/20",
        btnClass: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10",
        emoji: "🚗",
        typeLabel: isAr ? "تأجير سيارات" : "Premium Lease"
      },
      restaurants: {
        accentColor: "text-rose-600",
        badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
        shadowHover: "hover:shadow-rose-900/5 hover:border-rose-500/10 hover:border-rose-500/20",
        btnClass: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10",
        emoji: "🍽️",
        typeLabel: isAr ? "مطعم مميز" : "Fine Dining"
      },
      apartments: {
        accentColor: "text-purple-600",
        badgeBg: "bg-purple-50 text-purple-750 border-purple-100",
        shadowHover: "hover:shadow-purple-900/5 hover:border-purple-500/10 hover:border-purple-500/20",
        btnClass: "bg-purple-600 hover:bg-purple-700 shadow-purple-600/10",
        emoji: "🏢",
        typeLabel: isAr ? "شقة سكنية" : "Apartment Rental"
      }
    }[trip.category] || {
      accentColor: "text-slate-600",
      badgeBg: "bg-slate-150 text-slate-800 border-slate-200",
      shadowHover: "hover:shadow-slate-900/5",
      btnClass: "bg-slate-800 hover:bg-slate-900 shadow-slate-900/10",
      emoji: "🌟",
      typeLabel: isAr ? "عرض مميز" : "Exclusive Offer"
    };

    return (
      <div 
        key={trip.id}
        className={`bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group ${config.shadowHover}`}
      >
        {/* Header Image box with overlays */}
        <div className="relative h-56 overflow-hidden select-none bg-slate-900 shrink-0">
          <img 
            src={trip.image} 
            alt={title} 
            loading="lazy" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Elegant Dark Vignette layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent"></div>

          {/* Floating Category type info */}
          <span className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} py-1.5 px-3 rounded-full text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-sm border border-white/10 flex items-center gap-1.5 bg-slate-950/50 text-white`}>
            <span>{config.emoji}</span>
            <span>{config.typeLabel}</span>
          </span>

          {/* Floating Availability state badge */}
          <span className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} py-1.5 px-3 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 bg-white/95 text-slate-800 border border-slate-100/50`}>
            <span className={`w-2 h-2 rounded-full ${trip.isBooked ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
            <span>{trip.isBooked ? lex.bookedBadge : lex.availableBadge}</span>
          </span>

          {/* Star Rating Badge floating on bottom-right of image */}
          {trip.adminRating && (
            <span className={`absolute bottom-3 ${isAr ? 'left-3' : 'right-3'} py-1 px-2.5 rounded-xl text-xs font-black bg-slate-950/60 text-amber-400 backdrop-blur-md border border-white/10 flex items-center gap-1 shadow-md`}>
              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>{trip.adminRating}</span>
            </span>
          )}

          {/* Favorite Heart Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(trip.id);
            }}
            className={`absolute bottom-3 ${isAr ? 'right-3' : 'left-3'} w-8 h-8 rounded-xl backdrop-blur-md border shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95 z-10
              ${favorites.includes(trip.id) 
                ? 'bg-rose-500 border-rose-600 text-white shadow-rose-500/20 shadow-md' 
                : 'bg-slate-950/45 border-white/10 text-white/90 hover:bg-white hover:text-rose-500 hover:border-white'
              }`}
            title={favorites.includes(trip.id) ? (isAr ? 'إزالة من المفضلة' : 'Remove from favorites') : (isAr ? 'إضافة للمفضلة' : 'Add to favorites')}
          >
            <Heart className={`w-4 h-4 ${favorites.includes(trip.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content Panel */}
        <div className="p-6 flex flex-col justify-between grow">
          <div className="space-y-3.5">
            {/* Title & category */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors leading-snug">
                {title}
              </h3>
            </div>

            {/* Price section with styled units */}
            {trip.category === 'restaurants' ? (
              <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-extrabold text-xs max-w-fit select-none">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                </span>
                <span>{isAr ? 'بدون تسعير' : 'No pre-pricing'}</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  ${trip.price}
                </span>
                
                {trip.category === 'hotels' && (
                  <span className="text-xs text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">/{isAr ? 'ليلة' : 'night'}</span>
                )}
                {trip.category === 'cars' && (
                  <span className="text-xs text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">/{isAr ? 'يوم' : 'day'}</span>
                )}
                {trip.category === 'apartments' && (
                  <span className="text-xs text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">/{isAr ? 'شهر' : 'month'}</span>
                )}
              </div>
            )}

            {/* Description Subtitle excerpt */}
            <p className="text-xs leading-relaxed text-slate-500 font-normal line-clamp-2 font-sans">
              {subtitle}
            </p>

            {/* Custom Interactive Chips Grid for Travel Attributes */}
            <div className="flex flex-wrap gap-2 pt-1.5">
              {location && (
                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-100 max-w-full">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              )}

              {trip.category === 'hotels' && trip.bedType && (
                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-100">
                  <Bed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {trip.bedType === 'two_beds' 
                      ? lex.bedTypeTwo 
                      : trip.bedType === 'single_bed' 
                        ? lex.bedTypeSingle 
                        : trip.bedType}
                  </span>
                </div>
              )}

              {trip.category === 'apartments' && trip.bedType && (
                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-100">
                  <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{trip.bedType}</span>
                </div>
              )}

              {trip.category === 'cars' && (
                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-100">
                  <span>✨</span>
                  <span>{isAr ? 'مكيّفة بالكامل' : 'A/C Fully'}</span>
                </div>
              )}

              {trip.category === 'restaurants' && (
                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-100">
                  <span>🍽️</span>
                  <span>{isAr ? 'جلسة VIP مألوفة' : 'VIP Diner'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Actions Grid */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
            <button 
              onClick={() => handleTriggerBooking(trip)}
              className={`grow py-2.5 px-4 ${config.btnClass} text-white font-black rounded-xl text-xs transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-1 hover:-translate-y-0.5 active:translate-y-0 active:scale-95`}
            >
              <span>{lex.bookNow}</span>
            </button>
            <button 
              onClick={() => { setSelectedTrip(trip); setDetailActiveImgIndex(0); }}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold rounded-xl text-xs transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-center"
            >
              {lex.detailsBtn}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (activePage === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <AdminPanel 
          lang={lang}
          trips={trips}
          setTrips={setTrips}
          bookings={bookings}
          setBookings={setBookings}
          onBack={() => {
            window.location.hash = '';
            if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new Event('popstate'));
            }
          }}
          showToast={handleShowToast}
        />
        <Toasts 
          lang={lang}
          toasts={toasts} 
          onDismiss={handleDismissToast} 
        />
      </div>
    );
  }

  if (activePage === 'company') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <CompanyPortal 
          lang={lang}
          trips={trips}
          setTrips={setTrips}
          bookings={bookings}
          setBookings={setBookings}
          onBack={() => {
            window.location.hash = '';
            if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new Event('popstate'));
            }
          }}
          showToast={handleShowToast}
        />
        <Toasts 
          lang={lang}
          toasts={toasts} 
          onDismiss={handleDismissToast} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between text-slate-800 antialiased font-sans">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 glass-panel shadow-sm">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between">
          
          {/* Logo & Slogan */}
          <div 
            className="flex items-center gap-1.5 sm:gap-3 cursor-pointer select-none"
            onClick={() => {
              setSelectedCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-xs shrink-0">
              <img 
                src="/src/assets/images/travelo_logo_1780422163382.png" 
                alt="Travelo" 
                className="w-full h-full object-contain rounded-lg scale-[1.4]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight leading-none">
                {lex.brand}
              </h1>
              <p className="text-[10px] text-teal-600 tracking-widest font-bold mt-1 uppercase hidden sm:block">
                {lex.subtitle}
              </p>
            </div>
          </div>

          {/* Desktop Categories Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-slate-50/90 p-0.5 rounded-full border border-slate-200/65 select-none shrink-0 shadow-sm">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-1 px-2 rounded-full text-[11px] font-black transition-all text-slate-800 hover:text-black hover:bg-white hover:shadow-xs flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{lex.home}</span>
            </a>

            <div className="h-3 w-px bg-slate-200 mx-0.5" />

            <a 
              href="#hotels-section" 
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory('all');
                setTimeout(() => {
                  document.getElementById('hotels-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="py-1 px-2 rounded-full text-[11px] font-black transition-all text-slate-800 hover:text-black hover:bg-white hover:shadow-xs flex items-center gap-1"
            >
              <Hotel className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{lex.hotels}</span>
            </a>
            <a 
              href="#apartments-section" 
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory('all');
                setTimeout(() => {
                  document.getElementById('apartments-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="py-1 px-2 rounded-full text-[11px] font-black transition-all text-slate-800 hover:text-black hover:bg-white hover:shadow-xs flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lex.apartments}</span>
            </a>
            <a 
              href="#cars-section" 
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory('all');
                setTimeout(() => {
                  document.getElementById('cars-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="py-1 px-2 rounded-full text-[11px] font-black transition-all text-slate-800 hover:text-black hover:bg-white hover:shadow-xs flex items-center gap-1"
            >
              <Car className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>{lex.cars}</span>
            </a>
            <a 
              href="#restaurants-section" 
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory('all');
                setTimeout(() => {
                  document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="py-1 px-2 rounded-full text-[11px] font-black transition-all text-slate-800 hover:text-black hover:bg-white hover:shadow-xs flex items-center gap-1"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lex.restaurants}</span>
            </a>

            <div className="h-3 w-px bg-slate-200 mx-0.5" />

            <a 
              href="#services" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="py-1 px-2 rounded-full text-[11px] font-black transition-all text-slate-800 hover:text-black hover:bg-white hover:shadow-xs flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 animate-pulse" />
              <span>{lex.services}</span>
            </a>
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="py-1 px-2 rounded-full text-[11px] font-black transition-all text-slate-800 hover:text-black hover:bg-white hover:shadow-xs flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{lex.about}</span>
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="py-1 px-2 rounded-full text-[11px] font-black transition-all text-slate-800 hover:text-black hover:bg-white hover:shadow-xs flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{lex.contact}</span>
            </a>
          </nav>

          {/* User actions drawer / clock header */}
          <div className="flex items-center gap-1 sm:gap-2 relative">
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center cursor-pointer border border-transparent hover:border-slate-200 shrink-0"
              title={lang === 'ar' ? (theme === 'dark' ? 'تبديل للوضع المضيء' : 'تبديل للوضع المظلم') : (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500 animate-[spin_8s_linear_infinite]" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer border border-transparent hover:border-slate-200 shrink-0"
            >
              <Globe className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'English' : 'العربية'}</span>
              <span className="inline sm:hidden text-[10px]">{lang === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Notification dropzone bell */}
            {currentUser && (
              <div className="relative shrink-0" ref={notifRef}>
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all relative border border-transparent hover:border-slate-200 cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white"></span>
                  )}
                </button>

                {/* Notifications Panel Dropdown */}
                {isNotifOpen && (
                  <div className={`absolute top-12 z-[200] w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 flex flex-col justify-between max-h-96 scale-100 origin-top
                    ${isAr ? '-left-12 sm:left-0' : '-right-12 sm:right-0'}
                  `}>
                    <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{lex.notifTitle}</span>
                      {notifications.length > 0 && (
                        <div className="flex gap-2">
                          <button 
                            onClick={handleReadAll}
                            className="text-[10px] text-teal-600 hover:underline font-bold cursor-pointer"
                          >
                            {lex.markAllRead}
                          </button>
                          <button 
                            onClick={handleClearNotifs}
                            className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer flex items-center gap-0.5"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                            <span>{lex.clearAllNotifs}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="overflow-y-auto grow custom-scroll py-2">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <Bell className="w-8 h-8 mx-auto opacity-20 mb-2" />
                          <span className="text-xs">{lex.noNotifs}</span>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => handleMarkRead(n.id)}
                            className={`p-3 border-b border-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-2.5 text-xs text-left cursor-pointer
                              ${!n.read ? 'bg-teal-50/40 relative' : ''}
                            `}
                            dir={isAr ? 'rtl' : 'ltr'}
                          >
                            {!n.read && <span className="absolute top-4 left-auto right-3 w-1.5 h-1.5 bg-teal-500 rounded-full"></span>}
                            <div className="grow pl-4 pr-1">
                              <p className="text-slate-700 leading-normal font-medium">
                                {isAr ? n.message : n.message_en}
                              </p>
                              <span className="text-[10px] text-slate-400 leading-none block mt-1">{n.date}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User details credentials actions */}
            <div className="relative shrink-0" ref={userRef}>
              <button 
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="p-2 sm:p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 transition-all flex items-center gap-1 sm:gap-1.5 text-xs font-bold border border-teal-100/30 cursor-pointer"
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">
                  {currentUser ? `${lex.welcomeUser} ${currentUser.name.split(' ')[0]}` : lex.login}
                </span>
              </button>

              {isUserOpen && (
                <div className={`absolute top-12 z-[200] w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 origin-top scale-100
                  ${isAr ? 'left-0' : 'right-0'}
                `}>
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <span className="text-xs text-slate-400 block truncate leading-tight">Email</span>
                        <strong className="text-xs text-slate-800 truncate block mt-0.5">{currentUser.email}</strong>
                      </div>
                      <button 
                        onClick={() => { setEditProfileOpen(true); setIsUserOpen(false); }}
                        className="w-full text-right px-4 py-2 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-2 hover:text-slate-900"
                        dir={isAr ? 'rtl' : 'ltr'}
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lex.editProfile}</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-right px-4 py-2 hover:bg-rose-50 text-rose-600 text-xs font-bold cursor-pointer flex items-center gap-2 border-t border-slate-50"
                        dir={isAr ? 'rtl' : 'ltr'}
                      >
                        <User className="w-3.5 h-3.5 text-rose-400" />
                        <span>{lex.logout}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setLoginModalOpen(true); setIsUserOpen(false); }}
                        className="w-full text-right px-4 py-2 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                        dir={isAr ? 'rtl' : 'ltr'}
                      >
                        {lex.login}
                      </button>
                      <button 
                        onClick={() => { setSignupModalOpen(true); setIsUserOpen(false); }}
                        className="w-full text-right px-4 py-2 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                        dir={isAr ? 'rtl' : 'ltr'}
                      >
                        {lex.register}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Nav toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR PANEL */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-md flex items-stretch justify-start animate-fade-in-backdrop">
          <div className="bg-white max-w-xs w-full p-6 flex flex-col justify-between shadow-2xl relative overflow-y-auto custom-modal-scroll">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-xs">
                  <img 
                    src="/src/assets/images/travelo_logo_1780422163382.png" 
                    alt="Travelo" 
                    className="w-full h-full object-contain rounded-lg scale-[1.4]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <strong className="text-slate-800 text-lg font-black uppercase tracking-wider">{lex.brand}</strong>
              </div>
              
              <nav className="flex flex-col gap-2">
                <a 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault();
                    setSelectedCategory('all'); 
                    setIsSidebarOpen(false); 
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-sm flex items-center gap-3 text-slate-800 hover:text-slate-900 transition-colors"
                >
                  <Home className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{lex.home}</span>
                </a>
                <a 
                  href="#hotels-section" 
                  onClick={(e) => { 
                    e.preventDefault();
                    setSelectedCategory('all'); 
                    setIsSidebarOpen(false); 
                    setTimeout(() => {
                      document.getElementById('hotels-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }} 
                  className="py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-sm flex items-center gap-3 text-slate-800 hover:text-slate-900 transition-colors"
                >
                  <Hotel className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{lex.hotels}</span>
                </a>
                <a 
                  href="#apartments-section" 
                  onClick={(e) => { 
                    e.preventDefault();
                    setSelectedCategory('all'); 
                    setIsSidebarOpen(false); 
                    setTimeout(() => {
                      document.getElementById('apartments-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }} 
                  className="py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-sm flex items-center gap-3 text-slate-800 hover:text-slate-900 transition-colors"
                >
                  <Home className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lex.apartments}</span>
                </a>
                <a 
                  href="#cars-section" 
                  onClick={(e) => { 
                    e.preventDefault();
                    setSelectedCategory('all'); 
                    setIsSidebarOpen(false); 
                    setTimeout(() => {
                      document.getElementById('cars-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }} 
                  className="py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-sm flex items-center gap-3 text-slate-800 hover:text-slate-900 transition-colors"
                >
                  <Car className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{lex.cars}</span>
                </a>
                <a 
                  href="#restaurants-section" 
                  onClick={(e) => { 
                    e.preventDefault();
                    setSelectedCategory('all'); 
                    setIsSidebarOpen(false); 
                    setTimeout(() => {
                      document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }} 
                  className="py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-sm flex items-center gap-3 text-slate-800 hover:text-slate-900 transition-colors"
                >
                  <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{lex.restaurants}</span>
                </a>
                
                <div className="my-1 border-t border-slate-10 border-dashed" />

                <a 
                  href="#services" 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-sm flex items-center gap-3 text-slate-800 hover:text-slate-900 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
                  <span>{lex.services}</span>
                </a>
                <a 
                  href="#about" 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-sm flex items-center gap-3 text-slate-800 hover:text-slate-900 transition-colors"
                >
                  <Users className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{lex.about}</span>
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-sm flex items-center gap-3 text-slate-800 hover:text-slate-900 transition-colors"
                >
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{lex.contact}</span>
                </a>

                <button 
                  onClick={() => {
                    toggleTheme();
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-right py-3 px-4 rounded-xl hover:bg-slate-50 font-bold text-sm flex items-center justify-between text-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  <span className="flex items-center gap-2">
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                    <span>{isAr ? 'مظهر التطبيق' : 'App Theme'}</span>
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 py-1 px-2.5 rounded-full font-bold">
                    {isAr ? (theme === 'dark' ? 'ليلي' : 'مضيء') : (theme === 'dark' ? 'Dark' : 'Light')}
                  </span>
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
              <p>© 2026 Travelo. Explore Syria.</p>
            </div>
          </div>
          <div className="grow" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* MAIN LAYOUT WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-12">
          
          {/* HERO SECTION CONTAINER */}
        <div className="relative rounded-[2.5rem] bg-slate-950 p-8 sm:p-12 md:p-16 text-center select-none shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-center items-center">
          {/* Background image parallax overlays */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599839620584-6997cc0fcae0?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/20 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'مسؤوليتنا راحتكم وثقتكم' : 'Our commitment: trust & safety'}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {lang === 'ar' ? 'اكتشف سوريا مع Travelo' : 'Discover Syria with Travelo'}
            </h2>
            <p className="text-slate-300 font-medium text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {lex.tagline}
            </p>

            {/* SEAMLESS SEARCH BAR PANEL */}
            <div className="pt-4 max-w-xl mx-auto relative group">
              <div className="flex items-stretch bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden p-1.5 group-focus-within:ring-4 group-focus-within:ring-teal-500/10 transition-all">
                <div className="flex items-center gap-2 pl-3 py-2 pr-1 grow select-none">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={lex.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium text-sm border-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors shrink-0">
                  {lex.searchBtn}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DATA DISPLAY GRID CONTENT */}
        <div id="catalog-content" className="space-y-6 pt-6">
          
          {/* Section title & Category filters row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-teal-600" />
                <span>{lex.filterTitle}</span>
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">{isAr ? 'تصفح باقات ترافيلو المتوفرة حسب رغبتك.' : 'View active listings sorted by categories.'}</p>
            </div>

            {/* Availability filter switches */}
            <div className="flex bg-slate-100 border border-slate-200/50 rounded-xl p-1 shrink-0 self-start text-xs font-bold leading-none select-none">
              <button 
                onClick={() => setAvailabilityFilter('all')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${availabilityFilter === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {lex.allStatus}
              </button>
              <button 
                onClick={() => setAvailabilityFilter('available')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${availabilityFilter === 'available' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {lex.onlyAvailable}
              </button>
              <button 
                onClick={() => setAvailabilityFilter('booked')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${availabilityFilter === 'booked' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {lex.onlyBooked}
              </button>
            </div>
          </div>

          {/* Interactive Categories pill switcher */}
          <div className="flex flex-wrap items-center gap-2 select-none">
            {[
              { id: 'all' as const, ar: 'العروض كافّة', en: 'All Offers', icon: <LayoutGrid className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />, count: trips.length },
              { id: 'hotels' as const, ar: 'فنادق فاخرة', en: 'Hotels', icon: <Hotel className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />, count: trips.filter(t => t.category === 'hotels').length },
              { id: 'apartments' as const, ar: 'أجار شقق سكنية', en: 'Apartment Rentals', icon: <Home className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />, count: trips.filter(t => t.category === 'apartments').length },
              { id: 'cars' as const, ar: 'تأجير سيارات', en: 'Lease Cars', icon: <Car className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />, count: trips.filter(t => t.category === 'cars').length },
              { id: 'restaurants' as const, ar: 'مطاعم مميزة', en: 'Diners', icon: <Utensils className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />, count: trips.filter(t => t.category === 'restaurants').length },
              { id: 'favorites' as const, ar: 'مفضلتي', en: 'My Favorites', icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />, count: favorites.length }
            ].map((catPill) => {
              const isActive = selectedCategory === catPill.id;
              return (
                <button
                  key={catPill.id}
                  onClick={() => setSelectedCategory(catPill.id)}
                  className={`group py-2 px-4 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-2
                    ${isActive 
                      ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white border-transparent shadow-md shadow-teal-600/10 scale-102 font-extrabold' 
                      : 'bg-white dark:bg-white text-slate-700 dark:text-slate-800 border-slate-200 dark:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-50'
                    }
                  `}
                >
                  <span className={isActive ? 'text-white [&_svg]:text-white' : ''}>{catPill.icon}</span>
                  <span>{isAr ? catPill.ar : catPill.en}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none font-extrabold shadow-inner
                    ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-100 text-slate-500 dark:text-slate-500'}
                  `}>
                    {catPill.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Offers loop listing */}
          {filteredTrips.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-100 max-w-lg mx-auto">
              <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto opacity-40 mb-3" />
              <h4 className="text-xl font-bold text-slate-800">{lex.noResults}</h4>
              <p className="text-slate-500 text-xs sm:text-sm mt-2">
                {isAr ? 'جرب البحث مجدداً بكلمات بحث أخرى أو قم بتفريغ الحقول.' : 'Try adjusting your status search filters or search parameters.'}
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setAvailabilityFilter('all'); setSelectedCategory('all'); }}
                className="mt-5 inline-flex items-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200"
              >
                {isAr ? 'تهيئة العرض' : 'Reset Search Filters'}
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              {/* FAVORITES CATEGORY CONTAINER */}
              {selectedCategory === 'favorites' && (
                <div id="favorites-section" className="space-y-8 scroll-mt-24">
                  <div className="border-b border-dashed border-slate-200 pb-4">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span className="text-2xl text-rose-500">❤️</span>
                      <span>{isAr ? 'قائمة مفضلتي' : 'My Favorites List'}</span>
                      <span className="text-xs bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-100 font-mono font-bold">
                        {filteredTrips.length} {isAr ? 'عرض' : 'offers'}
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {isAr ? 'تصفح وإدارة العروض والخدمات التي قمت بحفظها للرجوع إليها لاحقاً.' : 'Browse and manage your saved premium offers and accommodation setups.'}
                    </p>
                  </div>

                  {filteredTrips.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 max-w-md mx-auto shadow-sm">
                      <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Heart className="w-8 h-8 fill-current" />
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-slate-800">{isAr ? 'مفضلتك فارغة حالياً' : 'Your Favorites is Empty'}</h4>
                      <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                        {isAr ? 'اضغط على أيقونة القلب على أي عرض للفنادق أو السيارات أو المطاعم لحفظها هنا.' : 'Click the heart icon on any accommodation, car, or dinner offer to bookmark it here.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTrips.map((trip) => renderTripCard(trip))}
                    </div>
                  )}
                </div>
              )}

              {/* HOTELS CATEGORY CONTAINER */}
              {(selectedCategory === 'all' || selectedCategory === 'hotels') && filteredHotels.length > 0 && (
                <div id="hotels-section" className="space-y-8 scroll-mt-24">
                  <div className="border-b border-dashed border-slate-200 pb-4">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                      <Hotel className="w-6 h-6 text-blue-650 dark:text-blue-450 shrink-0 animate-pulse" />
                      <span>{isAr ? 'عروض الفنادق الفاخرة المميزة' : 'Featured Luxury Hotels'}</span>
                      <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full border border-teal-100 font-mono font-bold">
                        {filteredHotels.length} {isAr ? 'عرض' : 'offers'}
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {isAr ? 'فنادق وأجنحة شريكة توفر أرقى الخدمات الفاخرة لك ولعائلتك في المحافظات السورية.' : 'Carefully chosen premium hotel retreats and master bedroom suites across Syrian cities.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(showAllHotels ? filteredHotels : filteredHotels.slice(0, 3)).map((trip) => renderTripCard(trip))}
                  </div>

                  {filteredHotels.length > 3 && (
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => setShowAllHotels(!showAllHotels)}
                        className="py-2.5 px-6 bg-white hover:bg-slate-50 text-teal-600 hover:text-teal-700 font-extrabold rounded-full text-xs sm:text-sm border border-slate-200 hover:border-teal-200 transition-all cursor-pointer shadow-sm hover:shadow flex items-center gap-1.5"
                      >
                        <span>{showAllHotels ? lex.showLess : lex.showAll}</span>
                        <span className="font-mono text-sm leading-none">{showAllHotels ? '▲' : '▼'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* APARTMENTS CATEGORY CONTAINER */}
              {(selectedCategory === 'all' || selectedCategory === 'apartments') && filteredApartments.length > 0 && (
                <div id="apartments-section" className="space-y-8 scroll-mt-24">
                  <div className="border-b border-dashed border-slate-200 pb-4">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                      <Home className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{isAr ? 'عروض أجار الشقق السكنية' : 'Curated Residential Apartments'}</span>
                      <span className="text-xs bg-purple-50 text-purple-750 border-purple-100 px-2.5 py-0.5 rounded-full border font-mono font-bold">
                        {filteredApartments.length} {isAr ? 'شقة' : 'apartments'}
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {isAr ? 'شقق سكنية مفروشة ديلوكس في دمشق والمحافظات السورية بإطلالات خلابة وتجهيزات ذكية كاملة.' : 'Settle into luxury fully-furnished residential suites and flat options across Syrian cities.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(showAllApartments ? filteredApartments : filteredApartments.slice(0, 3)).map((trip) => renderTripCard(trip))}
                  </div>

                  {filteredApartments.length > 3 && (
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => setShowAllApartments(!showAllApartments)}
                        className="py-2.5 px-6 bg-white hover:bg-slate-50 text-purple-650 hover:text-purple-700 font-extrabold rounded-full text-xs sm:text-sm border border-slate-200 hover:border-purple-200 transition-all cursor-pointer shadow-sm hover:shadow flex items-center gap-1.5"
                      >
                        <span>{showAllApartments ? lex.showLess : lex.showAll}</span>
                        <span className="font-mono text-sm leading-none">{showAllApartments ? '▲' : '▼'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* CARS CATEGORY CONTAINER */}
              {(selectedCategory === 'all' || selectedCategory === 'cars') && filteredCars.length > 0 && (
                <div id="cars-section" className="space-y-8 scroll-mt-24">
                  <div className="border-b border-dashed border-slate-200 pb-4">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                      <Car className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>{isAr ? 'عروض تأجير السيارات الفخمة' : 'Premium & Luxury Car Rental'}</span>
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100 font-mono font-bold">
                        {filteredCars.length} {isAr ? 'سيارة' : 'vehicles'}
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {isAr ? 'تنقل مريح وآمن في سوريا بأسطول سيارات حديث مع خيارات السائق الشخصي من ترافيلو.' : 'Discover Syrian topography comfortably using modern, safe luxury automobiles.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(showAllCars ? filteredCars : filteredCars.slice(0, 3)).map((trip) => renderTripCard(trip))}
                  </div>

                  {filteredCars.length > 3 && (
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => setShowAllCars(!showAllCars)}
                        className="py-2.5 px-6 bg-white hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 font-extrabold rounded-full text-xs sm:text-sm border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer shadow-sm hover:shadow flex items-center gap-1.5"
                      >
                        <span>{showAllCars ? lex.showLess : lex.showAll}</span>
                        <span className="font-mono text-sm leading-none">{showAllCars ? '▲' : '▼'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* RESTAURANTS CATEGORY CONTAINER */}
              {(selectedCategory === 'all' || selectedCategory === 'restaurants') && filteredRestaurants.length > 0 && (
                <div id="restaurants-section" className="space-y-8 scroll-mt-24">
                  <div className="border-b border-dashed border-slate-200 pb-4">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                      <Utensils className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{isAr ? 'أشهر المطاعم الفاخرة في سوريا' : 'Famous Traditional Levant Dining'}</span>
                      <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-100 font-mono font-bold">
                        {filteredRestaurants.length} {isAr ? 'مطعم' : 'diners'}
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {isAr ? 'تذوق أشهى الأطباق التراثية والشرقية والمطابخ العريقة بجلسات عائلية أو VIP حصرية.' : 'Savor authentic recipes and eastern Levant cuisine with guaranteed table reservations.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(showAllRestaurants ? filteredRestaurants : filteredRestaurants.slice(0, 3)).map((trip) => renderTripCard(trip))}
                  </div>

                  {filteredRestaurants.length > 3 && (
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => setShowAllRestaurants(!showAllRestaurants)}
                        className="py-2.5 px-6 bg-white hover:bg-slate-50 text-rose-600 hover:text-rose-700 font-extrabold rounded-full text-xs sm:text-sm border border-slate-200 hover:border-rose-200 transition-all cursor-pointer shadow-sm hover:shadow flex items-center gap-1.5"
                      >
                        <span>{showAllRestaurants ? lex.showLess : lex.showAll}</span>
                        <span className="font-mono text-sm leading-none">{showAllRestaurants ? '▲' : '▼'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* INTEGRATED SERVICES EXCHANGES */}
        <Services lang={lang} onFilterSelect={setSelectedCategory} />

        {/* INTEGRATED ABOUT TEAM STATISTICS */}
        <AboutUs lang={lang} />

        {/* INTEGRATED CONTACT CONCIERGE FORM */}
        <ContactSection lang={lang} onShowToast={handleShowToast} />

        </main>

      {/* FOOTER AREA */}
      <footer className="bg-slate-900 text-white/70 py-10 border-t border-white/5 select-none text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-extrabold text-base text-white">{lex.brand} Syria</h4>
            <span className="text-xs text-white/50 block mt-1">تراخيص ترافيلو ومستشاري السفر المعتمدة © 2026.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold">
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية / Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">الشروط والأحكام / Terms of Leisure</a>
            <a href="#" className="hover:text-white transition-colors">خريطة الموقع / Sitemap</a>
          </div>
        </div>
      </footer>

      {/* FULL IMMERSIVE POPUP DETAIL REVIEW MODAL */}
      <AnimatePresence>
        {selectedTrip && (
          <div 
            className="fixed inset-0 z-[9995] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-0 md:p-6 lg:p-10 font-sans text-slate-850 overflow-hidden"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            {/* Backdrop click area for extra convenience */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedTrip(null)} />

            <motion.div 
              initial={{ y: '30%', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '30%', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 26, stiffness: 210 }}
              className="bg-white w-full max-w-5xl h-full md:h-[90vh] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative z-10 border border-slate-100"
            >
            
              {/* Top sticky navigation bar */}
              <div className="bg-white/95 backdrop-blur-md z-40 border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between shrink-0">
                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="flex items-center gap-1.5 hover:bg-slate-100 text-teal-600 font-extrabold hover:text-teal-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs"
                >
                  {isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5 text-teal-600" />}
                  <span>{isAr ? 'العودة للعروض' : 'Back to Listings'}</span>
                </button>

                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  {isAr ? 'عرض التفاصيل الكاملة والتقييمات' : 'Detailed Specifications & Reviews'}
                </span>

                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content inside Dialog wrapper */}
              <div className="grow overflow-y-auto custom-modal-scroll">
                
                {/* Grid content columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8 shrink-0">
              
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Image Carousel */}
                <div className="relative h-[250px] sm:h-[420px] bg-slate-900 select-none overflow-hidden rounded-[2rem] shadow-xl border border-slate-100">
                  <img 
                    src={selectedTrip.images[detailActiveImgIndex] || selectedTrip.image} 
                    alt={selectedTrip.title} 
                    className="w-full h-full object-cover select-none pointer-events-none transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  {/* Carousel controls */}
                  {selectedTrip.images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setDetailActiveImgIndex(prev => (prev - 1 + selectedTrip.images.length) % selectedTrip.images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer z-10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setDetailActiveImgIndex(prev => (prev + 1) % selectedTrip.images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer z-10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Custom Modern Pill Indicators */}
                  {selectedTrip.images.length > 1 && (
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 items-center select-none z-10">
                      {selectedTrip.images.map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => setDetailActiveImgIndex(i)}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer
                            ${detailActiveImgIndex === i ? 'bg-teal-500 w-6 shadow-md' : 'bg-white/60 w-2 hover:bg-white'}
                          `}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Badges / Category and Status */}
                <div className="space-y-4">
                  <div className="flex select-none flex-wrap gap-2 items-center">
                    <span className={`inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full text-[10px] font-black tracking-wider uppercase border shadow-2xs
                      ${selectedTrip.category === 'hotels' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        selectedTrip.category === 'apartments' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                        selectedTrip.category === 'cars' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                        'bg-rose-50 text-rose-700 border-rose-200'}
                    `}>
                      <span>
                        {selectedTrip.category === 'hotels' ? '🏨 ' : 
                         selectedTrip.category === 'apartments' ? '🏢 ' : 
                         selectedTrip.category === 'cars' ? '🚗 ' : '🍽️ '}
                      </span>
                      <span>
                        {selectedTrip.category === 'hotels' ? (isAr ? 'فندق فاخر' : 'Hotel') : 
                         selectedTrip.category === 'apartments' ? (isAr ? 'شقة سكنية' : 'Apartment') : 
                         selectedTrip.category === 'cars' ? (isAr ? 'تأجير سيارات' : 'Car Rental') : 
                         (isAr ? 'مأكولات راقية' : 'Dining')}
                      </span>
                    </span>
                    
                    <span className={`py-1 px-3 rounded-full text-[10px] font-black border tracking-wider uppercase shadow-2xs
                      ${selectedTrip.isBooked ? 'bg-rose-50/80 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}
                    `}>
                      {selectedTrip.isBooked ? lex.bookedBadge : lex.availableBadge}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {isAr ? selectedTrip.title : selectedTrip.title_en}
                  </h2>
                  
                  {selectedTrip.title_en && !isAr && (
                    <p className="text-xs text-slate-400 font-bold tracking-wider uppercase leading-none">{selectedTrip.title_en}</p>
                  )}
                </div>

                {/* PREMIUM DYNAMIC TRIP SPECIFICATIONS GRID */}
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* SPECIFICATION CARD 1 */}
                  <div className="bg-slate-50/50 border border-slate-100/80 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center transition-all hover:bg-slate-50 hover:border-slate-200">
                    {selectedTrip.category === 'apartments' ? (
                      <>
                        <Home className="w-5 h-5 text-emerald-600 mb-1.5 shrink-0" />
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">{isAr ? 'التقسيم الداخلي' : 'Division'}</span>
                        <strong className="text-xs font-black text-slate-800 block mt-0.5 max-w-full truncate">
                          {selectedTrip.bedType || (isAr ? '٣ غرف ومنافع' : '3 Rooms')}
                        </strong>
                      </>
                    ) : selectedTrip.category === 'cars' ? (
                      <>
                        <Car className="w-5 h-5 text-indigo-600 mb-1.5 shrink-0" />
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">{isAr ? 'ناقل الحركة' : 'Gearbox'}</span>
                        <strong className="text-xs font-black text-slate-800 block mt-0.5">
                          {isAr ? 'أوتوماتيك حديث' : 'Automatic'}
                        </strong>
                      </>
                    ) : selectedTrip.category === 'restaurants' ? (
                      <>
                        <Utensils className="w-5 h-5 text-rose-600 mb-1.5 shrink-0" />
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">{isAr ? 'نوع المطبخ' : 'Gastronomy'}</span>
                        <strong className="text-xs font-black text-slate-800 block mt-0.5">
                          {isAr ? 'مأكولات شرقية' : 'Eastern Cuisine'}
                        </strong>
                      </>
                    ) : (
                      <>
                        <Bed className="w-5 h-5 text-teal-600 mb-1.5 shrink-0" />
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">{isAr ? 'طبيعة الأسرة' : 'Beds Setup'}</span>
                        <strong className="text-xs font-black text-slate-800 block mt-0.5">
                          {selectedTrip.bedType === 'two_beds' 
                            ? lex.bedTypeTwo 
                            : selectedTrip.bedType === 'single_bed' 
                              ? lex.bedTypeSingle 
                              : selectedTrip.bedType || (isAr ? 'سرير مزدوج' : 'Double Bed')}
                        </strong>
                      </>
                    )}
                  </div>

                  {/* SPECIFICATION CARD 2 */}
                  <div className="bg-slate-50/50 border border-slate-100/80 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center transition-all hover:bg-slate-50 hover:border-slate-200">
                    <Sparkles className="w-5 h-5 text-amber-500 mb-1.5 shrink-0" />
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">{isAr ? 'تقييم المنشأة' : 'Status Rank'}</span>
                    <strong className="text-xs font-black text-slate-800 block mt-0.5">
                      {selectedTrip.adminRating ? `${selectedTrip.adminRating} / 5` : '4.9 / 5'}
                    </strong>
                  </div>

                  {/* SPECIFICATION CARD 3 */}
                  <div className="bg-slate-50/50 border border-slate-100/80 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center transition-all hover:bg-slate-50 hover:border-slate-200">
                    <Shield className="w-5 h-5 text-teal-600 mb-1.5 shrink-0" />
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">{isAr ? 'درجة الأمان' : 'Trust Index'}</span>
                    <strong className="text-xs font-black text-slate-800 block mt-0.5 text-emerald-600">
                      {isAr ? 'موثّق بالكامل' : 'Platinum Safe'}
                    </strong>
                  </div>

                </div>

                {/* Stay Description text block */}
                <div className="space-y-3.5 border-t border-slate-100 pt-6">
                  <span className="text-[10px] text-teal-600 font-black tracking-widest uppercase block">{isAr ? 'نظرة عامة على الإقامة' : 'stay description'}</span>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal text-justify select-text">
                    {isAr ? (selectedTrip.description || selectedTrip.subtitle) : (selectedTrip.description_en || selectedTrip.subtitle_en)}
                  </p>
                </div>

                {/* Included Amenities listed */}
                {selectedTrip.services && selectedTrip.services.length > 0 && (
                  <div className="space-y-4 border-t border-slate-100 pt-6">
                    <span className="text-[10px] text-teal-600 font-black tracking-widest uppercase block">{lex.additionalDetails}</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(isAr ? selectedTrip.services : selectedTrip.services_en).map((svc, i) => (
                        <div 
                          key={i} 
                          className="flex items-center gap-2.5 py-3 px-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                          <CheckCircle2 className="w-4.5 h-4.5 text-teal-600 shrink-0" />
                          <span className="text-slate-700 text-xs font-bold leading-tight">{svc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Map directions integrations */}
                {(selectedTrip.hotelLocation || selectedTrip.restaurantLocation) && (
                  <div className="space-y-4 border-t border-slate-100 pt-6">
                    <span className="text-[10px] text-teal-600 font-black tracking-widest uppercase block">{isAr ? 'الموقع الجغرافي والإحداثيات' : 'Physical Location coordinates'}</span>
                    <MapContainer 
                      locationQuery={selectedTrip.hotelLocation || selectedTrip.restaurantLocation || ''} 
                      locationName={isAr ? selectedTrip.title : selectedTrip.title_en}
                      category={selectedTrip.category === 'hotels' ? 'hotels' : 'restaurants'}
                    />
                  </div>
                )}

                {/* CUSTOMER REVIEWS & COMMENT SECTION */}
                <div className="space-y-6 border-t border-slate-100 pt-6" id="reviews-section">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>💬</span>
                      <span>{isAr ? 'آراء وتقييمات النزلاء الأحدث' : 'Verified Reviews & Feedback'}</span>
                      <span className="text-xs font-black bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full border border-teal-100">
                        {reviews.filter(r => r.tripId === selectedTrip.id).length}
                      </span>
                    </h3>
                  </div>

                  {/* Verified Customer Feedback Stack */}
                  <div className="space-y-3.5">
                    {reviews.filter(r => r.tripId === selectedTrip.id).length === 0 ? (
                      <div className="p-10 text-center bg-slate-50 rounded-[2rem] border border-slate-100 text-slate-400 text-xs font-semibold">
                        {isAr ? 'لا توجد تعليقات أو مراجعات مكتوبة بعد لهذا العرض. شاركنا تجربتك لتكون أول المقيّمين!' : 'No written reviews verified for this offer yet. Be the first to publish a review!'}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3.5 select-text">
                        {reviews.filter(r => r.tripId === selectedTrip.id).map((rev) => (
                          <div key={rev.id} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-xs transition-all space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center font-black text-slate-600 text-xs select-none">
                                  {rev.userName.slice(0, 2)}
                                </div>
                                <div>
                                  <span className="text-xs font-extrabold text-slate-800 block leading-tight">{rev.userName}</span>
                                  <span className="text-[9px] text-emerald-600 font-bold items-center gap-0.5 inline-flex leading-none mt-1">
                                    <span>✓</span> 
                                    <span>{isAr ? 'نزيل موثّق' : 'Verified Guest'}</span>
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 font-bold">{rev.date}</span>
                            </div>

                            <div className="flex items-center gap-1 leading-none text-amber-400 select-none">
                              {Array.from({ length: 5 }).map((_, sIdx) => (
                                <Star 
                                  key={sIdx} 
                                  className={`w-3.5 h-3.5 ${sIdx < rev.rating ? 'fill-current' : 'text-slate-100'}`} 
                                />
                              ))}
                              <span className="text-[10px] font-black text-slate-400 ml-1">({rev.rating}/5)</span>
                            </div>

                            <p className="text-slate-650 text-xs leading-relaxed font-semibold">
                              {rev.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Publish a comment and star system */}
                  <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-[2rem] border border-slate-200/40 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                      <span>✍️</span>
                      <span>{isAr ? 'شاركنا تقييمك ورأيك المكتوب بالمنشأة' : 'Write a Review and rate your stay'}</span>
                    </h4>

                    <div className="space-y-4">
                      {/* Interactive Star rating selector */}
                      <div>
                        <span className="block text-[10px] font-black uppercase text-slate-400 mb-1.5">
                          {isAr ? 'تقييم المنشأة بالنجوم:' : 'Star Rating Selection:'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const starValue = i + 1;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setNewReviewRating(starValue)}
                                className="p-1 hover:scale-110 transition-transform cursor-pointer text-amber-500"
                              >
                                <Star className={`w-6 h-6 ${newReviewRating >= starValue ? 'fill-current' : 'text-slate-300'}`} />
                              </button>
                            );
                          })}
                          <span className="text-xs font-black text-slate-600 ml-2">
                            {newReviewRating === 5 ? (isAr ? 'ممتاز جداً 🌟' : 'Excellent!') :
                             newReviewRating === 4 ? (isAr ? 'جيد جداً 👍' : 'Very Good') :
                             newReviewRating === 3 ? (isAr ? 'جيد مقبول' : 'Good') :
                             newReviewRating === 2 ? (isAr ? 'ضعيف' : 'Fair') :
                             (isAr ? 'سيء جداً' : 'Poor')}
                          </span>
                        </div>
                      </div>

                      {/* Guest customized name input */}
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">{isAr ? 'اسمك الكريم (اختياري - يترك فارغاً للتلقائي):' : 'Your Nickname / Name (Optional):'}</label>
                        <input 
                          type="text"
                          placeholder={currentUser ? currentUser.name : (isAr ? 'مثال: أحمد الدمشقي' : 'e.g. Samer Al-Saeed')}
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-teal-500 shadow-2xs"
                        />
                      </div>

                      {/* Review text box */}
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">{isAr ? 'اكتب رأيك وتجربتك هنا كتابة بالتفصيل *' : 'Write your comment experience *'}</label>
                        <textarea 
                          rows={3}
                          required
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          placeholder={isAr ? 'اكتب مراجعتك بكل شفافية للنزلاء الآخرين...' : 'Express your honest hotel details...'}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none focus:border-teal-500 resize-none leading-relaxed shadow-2xs"
                        />
                      </div>

                      {/* Submit comment action button */}
                      <button
                        type="button"
                        onClick={() => handleAddReview(selectedTrip.id)}
                        className="w-full py-3 px-5 text-xs text-white font-extrabold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 shadow-teal-600/10"
                      >
                        <span>🚀</span>
                        <span>{isAr ? 'نشر التعليق والتقييم بالنجوم والكتابة' : 'Publish Review'}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Elegant Sticky Right/Left Sidebar panel column for booking information */}
              <div className="space-y-4">
                <div className="lg:sticky lg:top-24 bg-white rounded-[2rem] p-6 border border-slate-100 shadow-2xl space-y-6">
                  
                  {/* Rating or Top Title segment */}
                  <div>
                    <span className="text-[10px] text-teal-600 font-extrabold uppercase tracking-widest block mb-1">
                      {isAr ? 'عقد وحجز الإقامة الفاخرة' : 'Premium Booking Specifications'}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      {selectedTrip.category === 'restaurants' ? (
                        <div className="text-right w-full">
                          <span className="text-2xl font-black text-indigo-600">{isAr ? 'حجز مجاني ترفيهي' : 'Free RSVP'}</span>
                          <p className="text-[10px] text-slate-400 font-bold block mt-0.5">
                            {isAr ? 'لا توجد رسوم مسبقة، الدفع للمطعم مباشرة' : 'No pre-payment required'}
                          </p>
                        </div>
                      ) : (
                        <>
                          <span className="text-3xl font-black text-teal-600 leading-none">${selectedTrip.price}</span>
                          <span className="text-xs text-slate-400 font-semibold block leading-none">
                            / {selectedTrip.category === 'hotels' ? (isAr ? 'ليلة' : 'night') : selectedTrip.category === 'apartments' ? (isAr ? 'ليلة' : 'night') : (isAr ? 'يوم' : 'day')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Simulated dates block */}
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-450">
                      <span>{isAr ? 'تاريخ الحجز المقترح:' : 'Proposed Dates:'}</span>
                      <span className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded text-[8px] font-black">
                        {isAr ? 'حجز متاح فوراً' : 'Available'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 select-none">
                      <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>
                        {isAr ? '١٠ يونيو ٢٠٢٦ - ١٥ يونيو ٢٠٢٦' : 'Jun 10, 2026 - Jun 15, 2026'}
                      </span>
                    </div>
                  </div>

                  {/* Verified Owner label */}
                  {selectedTrip.companyName && (
                    <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-black text-teal-700 text-sm shadow-sm shrink-0 uppercase select-none">
                        {selectedTrip.companyName.slice(0, 1)}
                      </div>
                      <div className="grow">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wide block">{isAr ? 'المنظم المالك' : 'Verified Publisher'}</span>
                        <strong className="text-xs font-black text-slate-800 block mt-0.5 leading-snug">
                          {isAr ? selectedTrip.companyName : selectedTrip.companyName_en}
                        </strong>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 py-0.5 px-2 rounded-full text-[9px] font-black border border-emerald-100 shrink-0">
                        {isAr ? 'موثّق ✓' : 'Verified ✓'}
                      </span>
                    </div>
                  )}

                  {/* Transaction safety bullet items */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold">
                      <span className="text-emerald-500 font-bold select-none">✓</span>
                      <span>{isAr ? 'تأكيد فوري للحجز عبر البريد والواتساب' : 'Instant confirmation via WhatsApp'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-semibold">
                      <span className="text-emerald-500 font-bold select-none">✓</span>
                      <span>{isAr ? 'إلغاء مجاني متاح لأدق الشفافية والراحة' : 'Free cancelation flexibility'}</span>
                    </div>
                  </div>

                  {/* Booking Trigger Button */}
                  <div className="pt-2">
                    <button 
                      onClick={() => { handleTriggerBooking(selectedTrip); setSelectedTrip(null); }}
                      disabled={selectedTrip.isBooked}
                      className={`w-full py-4 px-6 text-white font-extrabold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer
                        ${selectedTrip.isBooked 
                          ? 'bg-slate-300 pointer-events-none select-none shadow-none' 
                          : 'bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 shadow-teal-600/15 hover:scale-[1.01] active:scale-95'
                        }
                      `}
                    >
                      {selectedTrip.isBooked ? (
                        <span>{lex.bookedBadge}</span>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>{currentUser ? lex.bookNow : `${lex.login} / ${lex.bookNow}`}</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>

            </div> {/* Grid wrapper close */}
          </div> {/* Scrollable Content wrapper close */}

          {/* Mobile Sticky Booking Bar */}
          <div className="lg:hidden sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 flex items-center justify-between z-30 select-none shadow-lg">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{lex.price}</span>
              <div className="flex items-baseline leading-none">
                {selectedTrip.category === 'restaurants' ? (
                  <span className="text-xs font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
                    {isAr ? 'بدون تسعير مسبق' : 'No pre-pricing'}
                  </span>
                ) : (
                  <>
                    <strong className="text-xl font-black text-teal-600">${selectedTrip.price}</strong>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      /{selectedTrip.category === 'hotels' ? (isAr ? 'ليلة' : 'night') : selectedTrip.category === 'apartments' ? (isAr ? 'ليلة' : 'night') : (isAr ? 'يوم' : 'day')}
                    </span>
                  </>
                )}
              </div>
            </div>
            <button 
              onClick={() => { handleTriggerBooking(selectedTrip); setSelectedTrip(null); }}
              disabled={selectedTrip.isBooked}
              className={`py-2.5 px-5 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer
                ${selectedTrip.isBooked 
                  ? 'bg-slate-300 pointer-events-none select-none shadow-none' 
                  : 'bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 shadow-teal-600/15'
                }
              `}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{selectedTrip.isBooked ? lex.bookedBadge : lex.bookNow}</span>
            </button>
          </div>

        </motion.div>
      </div>
        )}
      </AnimatePresence>

      {/* COMPREHENSIVE CATEGORY SPECIFIC RESERVATION FORMS OVERLAYS */}
      {bookingTrip && (
        <div className="fixed inset-0 z-[9990] p-4 flex items-center justify-center bg-slate-950/60 backdrop-blur-md select-none animate-fade-in-backdrop">
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-2xl max-w-md sm:max-w-xl w-full max-h-[85vh] overflow-y-auto custom-modal-scroll relative animate-scale-in-box">
            
            {/* Close button modal dropdown */}
            <button 
              onClick={() => setBookingTrip(null)}
              className="absolute top-5 right-5 z-20 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleConfirmBookingSubmit} className="p-8 space-y-6">
              
              {/* Header block */}
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="py-1 px-3 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-100 uppercase select-none">
                  Secure Checkout
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {bookingTrip.category === 'hotels' ? lex.hotelFormTitle : bookingTrip.category === 'apartments' ? (isAr ? 'عقد ومستندات استئجار شقة سكنية' : 'Apartment Lease Verification') : bookingTrip.category === 'cars' ? `${isAr ? 'حجز مركبة' : 'Rental Lease'} - ${isAr ? bookingTrip.title : bookingTrip.title_en}` : `${isAr ? 'حجز طاولة' : 'Table Reservation'} - ${isAr ? bookingTrip.title : bookingTrip.title_en}`}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal max-w-sm mx-auto">
                  {bookingTrip.category === 'hotels' ? lex.hotelFormSub : bookingTrip.category === 'apartments' ? (isAr ? 'يرجى اختيار وتعبئة تفاصيل النزلاء ومستندات الهوية للتسجيل والتوثيق الرسمي للشقة.' : 'Please supply official tenant information and identification sheets to successfully process formal apartment lease contracts.') : (isAr ? 'يرجى تقديم تفاصيل الاتصال والنزلاء المرافقة لتأكيد حجز الطاولة فوراً.' : 'Please enter your legal digits and guest specs to confirm lease.')}
                </p>
              </div>

              {/* 1. HOTELS & APARTMENTS DOCUMENTATION DROP REVIEWS */}
              {(bookingTrip.category === 'hotels' || bookingTrip.category === 'apartments') && (
                <div className="space-y-4">
                  {/* Nationality selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase select-none">
                      {lex.nationalityPrompt}
                    </label>
                    <div className="grid grid-cols-2 gap-3 select-none">
                      <button
                        type="button"
                        onClick={() => { setHotelNationality('syrian'); setUploadedPassport(null); }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold border select-none transition-all cursor-pointer flex flex-col justify-center items-center gap-1
                          ${hotelNationality === 'syrian' ? 'bg-teal-50/50 border-teal-500 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-600'}
                        `}
                      >
                        <Globe className="w-5 h-5" />
                        <span>{lex.syrian}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setHotelNationality('tourist'); setUploadedId(null); }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold border select-none transition-all cursor-pointer flex flex-col justify-center items-center gap-1
                          ${hotelNationality === 'tourist' ? 'bg-teal-50/50 border-teal-500 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-600'}
                        `}
                      >
                        <Heart className="w-5 h-5" />
                        <span>{lex.foreigner}</span>
                      </button>
                    </div>
                  </div>

                  {/* Marital selector */}
                  {hotelNationality && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase select-none">
                        {lex.maritalPrompt}
                      </label>
                      <div className="grid grid-cols-3 gap-2 select-none text-center">
                        <button
                          type="button"
                          onClick={() => { setHotelMaritalStatus('single'); setUploadedFamilyBook(null); setUploadedContract(null); }}
                          className={`py-2 px-2.5 rounded-xl text-[10px] font-bold border select-none transition-all cursor-pointer flex flex-col justify-center items-center gap-1
                            ${hotelMaritalStatus === 'single' ? 'bg-indigo-50/50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'}
                          `}
                        >
                          <User className="w-4 h-4" />
                          <span>{lex.single}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setHotelMaritalStatus('married_children'); setUploadedContract(null); }}
                          className={`py-2 px-2.5 rounded-xl text-[10px] font-bold border select-none transition-all cursor-pointer flex flex-col justify-center items-center gap-1
                            ${hotelMaritalStatus === 'married_children' ? 'bg-indigo-50/50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'}
                          `}
                        >
                          <Users className="w-4 h-4" />
                          <span>{lex.marriedChildren}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setHotelMaritalStatus('married_new')}
                          className={`py-2 px-2.5 rounded-xl text-[10px] font-bold border select-none transition-all cursor-pointer flex flex-col justify-center items-center gap-1
                            ${hotelMaritalStatus === 'married_new' ? 'bg-indigo-50/50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'}
                          `}
                        >
                          <StarsIcon className="w-4 h-4" />
                          <span>{lex.newMarried}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* DOCUMENTATION FILE SELECTOR DROPS */}
                  {hotelNationality && hotelMaritalStatus && (
                    <div className="space-y-3.5 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">{isAr ? 'الوثائق الثبوتية الآمنة لرفعها رقمياً' : 'Certified document scans upload list'}</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 select-none">
                        {/* Syrian National ID */}
                        {hotelNationality === 'syrian' && (
                          <div 
                            onClick={() => handleFileUploadMock('id')}
                            className="p-4 bg-slate-50 hover:bg-slate-100/80 border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] relative overflow-hidden group transition-all"
                          >
                            {uploadedId ? (
                              <img src={uploadedId} alt="National ID" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <>
                                <Shield className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                                <strong className="text-[10px] text-slate-700 leading-none">{lex.nationalIdPhoto}</strong>
                              </>
                            )}
                          </div>
                        )}

                        {/* Foreign Passport */}
                        {hotelNationality === 'tourist' && (
                          <div 
                            onClick={() => handleFileUploadMock('passport')}
                            className="p-4 bg-slate-50 hover:bg-slate-100/80 border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] relative overflow-hidden group transition-all"
                          >
                            {uploadedPassport ? (
                              <img src={uploadedPassport} alt="Passport Scan" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <>
                                <Shield className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                                <strong className="text-[10px] text-slate-700 leading-none">{lex.passportPhoto}</strong>
                              </>
                            )}
                          </div>
                        )}

                        {/* Accompanied Family Book */}
                        {hotelMaritalStatus === 'married_children' && (
                          <div 
                            onClick={() => handleFileUploadMock('family')}
                            className="p-4 bg-slate-50 hover:bg-slate-100/80 border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] relative overflow-hidden group transition-all"
                          >
                            {uploadedFamilyBook ? (
                              <img src={uploadedFamilyBook} alt="Family Book Scan" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <>
                                <Shield className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                                <strong className="text-[10px] text-slate-700 leading-none">{lex.familyBookPhoto}</strong>
                              </>
                            )}
                          </div>
                        )}

                        {/* HoneyMoon Family marriage scans */}
                        {hotelMaritalStatus === 'married_new' && (
                          <>
                            <div 
                              onClick={() => handleFileUploadMock('family')}
                              className="p-4 bg-slate-50 hover:bg-slate-100/80 border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] relative overflow-hidden group transition-all"
                            >
                              {uploadedFamilyBook ? (
                                <img src={uploadedFamilyBook} alt="Family Book scan" className="absolute inset-0 w-full h-full object-cover" />
                              ) : (
                                <>
                                  <Shield className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                                  <strong className="text-[10px] text-slate-700 leading-none">{lex.familyBookPhoto}</strong>
                                </>
                              )}
                            </div>
                            <div 
                              onClick={() => handleFileUploadMock('contract')}
                              className="p-4 bg-slate-50 hover:bg-slate-100/80 border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] relative overflow-hidden group transition-all"
                            >
                              {uploadedContract ? (
                                <img src={uploadedContract} alt="Marriage Contract scan" className="absolute inset-0 w-full h-full object-cover" />
                              ) : (
                                <>
                                  <Shield className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                                  <strong className="text-[10px] text-slate-700 leading-none">{lex.contractPhoto}</strong>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hotel or Apartment stay length selector */}
                  {(bookingTrip.category === 'hotels' || bookingTrip.category === 'apartments') && (
                    <div className="space-y-4 pt-3 border-t border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span className="text-slate-500 uppercase">
                            {bookingTrip.category === 'apartments'
                              ? (isAr ? 'مدة استئجار الشقة السكنية' : 'Apartment Lease Duration')
                              : (isAr ? 'مدة الإقامة بالفندق' : 'Hotel Stay Duration')}
                          </span>
                          <strong className="text-teal-600">
                            {bookingDays} {bookingTrip.category === 'apartments' ? (isAr ? 'أشهر' : 'months') : (isAr ? 'ليالي' : 'nights')}
                          </strong>
                        </div>
                        <input 
                          type="range"
                          min={1}
                          max={bookingTrip.category === 'apartments' ? 12 : 30}
                          value={bookingDays}
                          onChange={(e) => setBookingDays(Number(e.target.value))}
                          className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. CARS DURATION MULTIPLIERS FOR RENTALS */}
              {bookingTrip.category === 'cars' && (
                <div className="space-y-4">
                  {/* Private Driver switch selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase select-none">
                      {lex.driverPrompt}
                    </label>
                    <div className="grid grid-cols-2 gap-3 select-none">
                      <button
                        type="button"
                        onClick={() => setCarDriverOption('without_driver')}
                        className={`py-3 px-4 rounded-xl text-xs font-bold border select-none transition-all cursor-pointer flex flex-col justify-center items-center gap-1
                          ${carDriverOption === 'without_driver' ? 'bg-orange-50/50 border-orange-500 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-600'}
                        `}
                      >
                        <User className="w-5 h-5" />
                        <span>{lex.withoutDriver}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCarDriverOption('with_driver')}
                        className={`py-3 px-4 rounded-xl text-xs font-bold border select-none transition-all cursor-pointer flex flex-col justify-center items-center gap-1
                          ${carDriverOption === 'with_driver' ? 'bg-orange-50/50 border-orange-500 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-600'}
                        `}
                      >
                        <Users className="w-5 h-5" />
                        <span>{lex.withDriver}</span>
                      </button>
                    </div>
                  </div>

                  {/* Lease duration slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="text-slate-500 uppercase">{lex.daysSlider}</span>
                      <strong className="text-teal-600">{bookingDays} {isAr ? 'أيام' : 'days'}</strong>
                    </div>
                    <input 
                      type="range"
                      min={1}
                      max={14}
                      value={bookingDays}
                      onChange={(e) => setBookingDays(Number(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                    />
                  </div>

                  {/* ID Scan copy upload box */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">{lex.uploadBoxTitle}</span>
                    <div 
                      onClick={() => handleFileUploadMock('id')}
                      className="p-6 bg-slate-50 hover:bg-slate-100/80 border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer min-h-[90px] relative overflow-hidden group transition-all"
                    >
                      {uploadedId ? (
                        <img src={uploadedId} alt="ID scan copy" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <>
                          <Shield className="w-5 h-5 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
                          <strong className="text-[10px] text-slate-700 leading-none">{isAr ? 'صورة رخصة القيادة السارية الصلاحية *' : "Valid Driver's license copy *"}</strong>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. RESTAURANT GUESTS SLIDERS AND PRICES */}
              {bookingTrip.category === 'restaurants' && (
                <div className="space-y-4">
                  {/* Guest sliders */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="text-slate-500 uppercase">{lex.guestSlider}</span>
                      <strong className="text-teal-600">{bookingGuests} {isAr ? 'أشخاص' : 'guests'}</strong>
                    </div>
                    <input 
                      type="range" 
                      min={1}
                      max={12}
                      value={bookingGuests}
                      onChange={(e) => setBookingGuests(Number(e.target.value))}
                      className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Shared full-name & Mobile credentials */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">{isAr ? 'بيانات التواصل الرسمي للحجز' : 'Contact official details'}</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase select-none">{lex.fullname}</label>
                    <input 
                      type="text"
                      required
                      placeholder={isAr ? 'الاسم الثلاثي بالكامل' : 'Full Name'}
                      value={bookingFullName}
                      onChange={(e) => setBookingFullName(e.target.value)}
                      className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase select-none">{lex.phone}</label>
                    <input 
                      type="tel"
                      required
                      placeholder="+963 933 111 222"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic live calculation highlight cards */}
              {bookingTrip.category === 'cars' && (
                <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center justify-between text-teal-800 select-none">
                  <div>
                    <span className="text-[10px] text-teal-600 font-extrabold uppercase leading-none block">{lex.carPriceMultiply}</span>
                    <strong className="text-lg font-black block mt-1">${getCarPricingSummary().dailyRate} / {isAr ? 'يوم' : 'day'}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-teal-600 font-extrabold uppercase leading-none block">{isAr ? 'الإجمالي العام المصدق:' : 'Certified stay overall:'}</span>
                    <strong className="text-2xl font-black block mt-0.5 text-teal-700">${getCarPricingSummary().total}</strong>
                  </div>
                </div>
              )}

              {bookingTrip.category === 'restaurants' && (
                <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center justify-between text-teal-800 select-none">
                  <div className="flex items-center gap-2 text-teal-700">
                    <span className="text-lg">✨</span>
                    <span className="text-xs font-bold leading-normal">{isAr ? 'حجز طاولة بدون أي تكلفة مسبقة' : 'Table reservation with no pre-pricing required'}</span>
                  </div>
                </div>
              )}

              {bookingTrip.category === 'apartments' && (
                <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center justify-between text-teal-800 select-none">
                  <div>
                    <span className="text-[10px] text-teal-600 font-extrabold uppercase leading-none block">{isAr ? 'سعر إيجار الشهر الواحد:' : 'Monthly rate:'}</span>
                    <strong className="text-lg font-black block mt-1">${bookingTrip.price}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-teal-600 font-extrabold uppercase leading-none block">{isAr ? 'إجمالي تكلفة الإيجار:' : 'Lease overall total:'}</span>
                    <strong className="text-2xl font-black block mt-0.5 text-teal-700">${bookingDays * Number(bookingTrip.price)}</strong>
                  </div>
                </div>
              )}

              {bookingTrip.category === 'hotels' && (
                <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center justify-between text-teal-800 select-none">
                  <div>
                    <span className="text-[10px] text-teal-600 font-extrabold uppercase leading-none block">{isAr ? 'سعر الليلة الواحدة:' : 'Nightly rate:'}</span>
                    <strong className="text-lg font-black block mt-1">${bookingTrip.price}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-teal-600 font-extrabold uppercase leading-none block">{isAr ? 'إجمالي تكلفة الإقامة:' : 'Total stay cost:'}</span>
                    <strong className="text-2xl font-black block mt-0.5 text-teal-700">${bookingDays * Number(bookingTrip.price)}</strong>
                  </div>
                </div>
              )}

              {/* Confirmation trigger */}
              <button 
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-600/10 cursor-pointer text-center"
              >
                {lex.confirmBookBtn}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* MODAL CONTROLLER RENDER PIPELINE */}
      <Modals 
        lang={lang}
        loginOpen={loginModalOpen}
        signupOpen={signupModalOpen}
        editOpen={editProfileOpen}
        authRequiredOpen={authRequiredOpen}
        currentUser={currentUser}
        onCloseAll={() => { setLoginModalOpen(false); setSignupModalOpen(false); setEditProfileOpen(false); setAuthRequiredOpen(false); }}
        onSetUser={handleSetUser}
        onShowToast={handleShowToast}
        onOpenSignup={() => { setLoginModalOpen(false); setSignupModalOpen(true); setEditProfileOpen(false); setAuthRequiredOpen(false); }}
        onOpenLogin={() => { setLoginModalOpen(true); setSignupModalOpen(false); setEditProfileOpen(false); setAuthRequiredOpen(false); }}
      />

      {/* TOAST NOTIFIER SYSTEM */}
      <Toasts 
        lang={lang} 
        toasts={toasts} 
        onDismiss={handleDismissToast} 
      />

    </div>
  );
}

// Sparkles secondary icons fallback trigger
const StarsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z"/>
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/>
  </svg>
);
