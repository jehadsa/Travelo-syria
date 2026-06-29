/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Package, Clock, Building2, TrendingUp, Plus, Trash2, 
  Check, X, Eye, Edit2, ShieldAlert, MapPin, Star, Bed, Sparkles, 
  DollarSign, ArrowLeft, ArrowRight, User, Phone, CheckCircle, Upload, Image as ImageIcon,
  Hotel, Car, Utensils, Home, LayoutGrid, Lock, LogIn
} from 'lucide-react';

import { Language, Category, Trip, Booking } from '../types';

interface AdminPanelProps {
  lang: Language;
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  onBack: () => void;
  showToast: (icon: string, titleAr: string, titleEn: string, bodyAr: string, bodyEn: string, color: string) => void;
}

interface CompanyAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  active?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  lang,
  trips,
  setTrips,
  bookings,
  setBookings,
  onBack,
  showToast
}) => {
  const isAr = lang === 'ar';
  
  // Admin Authentication states
  const [adminUser, setAdminUser] = useState<{ email: string; roleAr: string; roleEn: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Hardcoded Accounts list
  const FIXED_ADMINS = [
    { email: 'admin@travelo.sy', password: 'admin', roleAr: 'المدير العام للمنصة', roleEn: 'Super Administrator' },
    { email: 'manager@travelo.sy', password: 'manager', roleAr: 'المدير العام للمنصة', roleEn: 'Super Administrator' }
  ];

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const emailLower = loginEmail.trim().toLowerCase();
    const found = FIXED_ADMINS.find(admin => admin.email === emailLower && admin.password === loginPassword);
    
    if (found) {
      const userData = { email: found.email, roleAr: found.roleAr, roleEn: found.roleEn };
      setAdminUser(userData);
      showToast(
        '🔑',
        'تم تسجيل الدخول بنجاح',
        'Logged in successfully',
        `أهلاً بك مجدداً ${found.roleAr}. تم فتح لوحة التحكم بنجاح.`,
        `Welcome back ${found.roleEn}. Admin authorization granted.`,
        '#10b981'
      );
    } else {
      setLoginError(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password.');
    }
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setLoginEmail('');
    setLoginPassword('');
    showToast(
      '🔓',
      'تم تسجيل الخروج',
      'Logged Out',
      'تم إغلاق الجلسة الإدارية بنجاح.',
      'Admin session closed successfully.',
      '#f59e0b'
    );
  };
  
  // Tabs: 'bookings' | 'offers' | 'pending' | 'companies' | 'profits'
  const [activeTab, setActiveTab] = useState<'bookings' | 'offers' | 'pending' | 'companies' | 'profits'>('bookings');
  
  // Bookings Filter States
  const [bookingTypeFilter, setBookingTypeFilter] = useState<'all' | 'holder' | 'car' | 'restaurant' | 'hotels' | 'cars' | 'restaurants' | 'apartments'>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  
  // Offers Filter States
  const [offerCategoryFilter, setOfferCategoryFilter] = useState<'all' | 'hotels' | 'cars' | 'restaurants' | 'apartments'>('all');
  
  // Open documents lists state
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  
  // Edit Offer Modal State
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  
  // Companies accounts local state
  const [companies, setCompanies] = useState<CompanyAccount[]>([]);
  
  // New Offer Form Toggle & Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOfferCat, setNewOfferCat] = useState<Category>('hotels');
  const [newOfferTitleAr, setNewOfferTitleAr] = useState('');
  const [newOfferTitleEn, setNewOfferTitleEn] = useState('');
  const [newOfferLocationAr, setNewOfferLocationAr] = useState('');
  const [newOfferLocationEn, setNewOfferLocationEn] = useState('');
  const [newOfferSubAr, setNewOfferSubAr] = useState('');
  const [newOfferSubEn, setNewOfferSubEn] = useState('');
  const [newOfferPrice, setNewOfferPrice] = useState('');
  const [newOfferCompanyPrice, setNewOfferCompanyPrice] = useState('');
  const [newOfferRating, setNewOfferRating] = useState('4');
  const [newOfferBedType, setNewOfferBedType] = useState<'single_bed' | 'two_beds'>('single_bed');
  const [newOfferImages, setNewOfferImages] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [newOfferTagsAr, setNewOfferTagsAr] = useState<string[]>([]);
  const [newOfferTagsEn, setNewOfferTagsEn] = useState<string[]>([]);

  // Pending approval prices input state
  const [pendingPriceInput, setPendingPriceInput] = useState<Record<string, string>>({});

  // Load companies (in-memory defaults)
  useEffect(() => {
    const defaultCompanies: CompanyAccount[] = [
      { id: '1', name: 'فندق الشام الكبير', email: 'cham@travelo.sy', phone: '+963 11 223 344', category: 'hotels', active: true },
      { id: '2', name: 'سيريا كارس لتأجير السيارات', email: 'cars@travelo.sy', phone: '+963 933 111 222', category: 'cars', active: true },
      { id: '3', name: 'مطعم بوابة دمشق القديمة', email: 'rest@travelo.sy', phone: '+963 11 544 555', category: 'restaurants', active: true },
      { id: '4', name: 'الشهباء لتأجير الشقق المفروشة', email: 'shaba@travelo.sy', phone: '+963 21 444 555', category: 'apartments', active: true }
    ];
    setCompanies(defaultCompanies);
  }, []);

  const saveCompaniesToStorage = (updated: CompanyAccount[]) => {
    setCompanies(updated);
    // company accounts managed in-memory
  };

  // Profit margins calculation variables
  const getAcceptedBookingsProfitData = () => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    // Categories breakdown
    const categories = {
      hotels: { nameAr: 'الفنادق', nameEn: 'Hotels', count: 0, revenue: 0, cost: 0, profit: 0, color: 'emerald' as const },
      apartments: { nameAr: 'الشقق السكنية', nameEn: 'Apartments', count: 0, revenue: 0, cost: 0, profit: 0, color: 'purple' as const },
      cars: { nameAr: 'تأجير السيارات', nameEn: 'Car Leases', count: 0, revenue: 0, cost: 0, profit: 0, color: 'indigo' as const },
      restaurants: { nameAr: 'المطاعم الفاخرة', nameEn: 'Diners & Restos', count: 0, revenue: 0, cost: 0, profit: 0, color: 'amber' as const }
    };

    const acceptedBookingsList = bookings.filter(b => b.status === 'accepted');

    const detailedItems = acceptedBookingsList.map(b => {
      const trip = trips.find(t => t.id === b.tripId);
      const rawCat = b.bookingType === 'car' ? 'cars' : (b.bookingType === 'restaurant' ? 'restaurants' : (b.bookingType === 'holder' ? 'hotels' : b.bookingType));
      const category: 'hotels' | 'apartments' | 'cars' | 'restaurants' = 
        (rawCat === 'hotels' || rawCat === 'apartments' || rawCat === 'cars' || rawCat === 'restaurants') 
          ? rawCat 
          : 'hotels';

      let days = b.details.days || 1;
      let revenue = b.details.totalPrice || 0;
      let cost = 0;

      if (trip) {
        const sellPrice = parseFloat(trip.price) || 0;
        if (category === 'hotels' || category === 'apartments') {
          revenue = revenue || (sellPrice * days);
          const companyCostPerNight = trip.companyPrice !== undefined ? parseFloat(trip.companyPrice) : (sellPrice * 0.85);
          cost = companyCostPerNight * days;
        } else if (category === 'cars') {
          revenue = revenue || (sellPrice * days);
          let companyCostPerDay = trip.companyPrice !== undefined ? parseFloat(trip.companyPrice) : (sellPrice * 0.85);
          if (b.details.driverOption === 'with_driver' && trip.carCostWithDriver) {
            companyCostPerDay = parseFloat(trip.carCostWithDriver);
          } else if (b.details.driverOption === 'without_driver' && trip.carCostWithoutDriver) {
            companyCostPerDay = parseFloat(trip.carCostWithoutDriver);
          }
          cost = companyCostPerDay * days;
        } else if (category === 'restaurants') {
          revenue = revenue || sellPrice || 0;
          const companyCost = trip.companyPrice !== undefined ? parseFloat(trip.companyPrice) : (revenue * 0.85);
          cost = companyCost;
          if (revenue === 0) {
            revenue = 30; // nominal user order value
            cost = 15; // default commission
          }
        }
      } else {
        revenue = revenue || 100;
        cost = revenue * 0.85;
      }

      const profit = Math.max(0, revenue - cost);

      if (categories[category]) {
        categories[category].count += 1;
        categories[category].revenue += revenue;
        categories[category].cost += cost;
        categories[category].profit += profit;
      }

      totalRevenue += revenue;
      totalCost += cost;
      totalProfit += profit;

      return {
        bookingId: b.id,
        guestName: b.details.fullName,
        date: b.date,
        tripTitle: isAr ? (trip?.title || b.tripTitle) : (trip?.title_en || b.tripTitleEn),
        category,
        revenue,
        cost,
        profit,
        companyName: trip?.companyName || (isAr ? 'مستقل' : 'Independent')
      };
    });

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      categories,
      detailedItems
    };
  };

  const calculateTotalProfit = () => {
    return getAcceptedBookingsProfitData().totalProfit;
  };

  // Documents Toggler
  const toggleDocsPanel = (bookingId: string) => {
    setExpandedDocs(prev => ({ ...prev, [bookingId]: !prev[bookingId] }));
  };

  // Accept Booking Action
  const handleAcceptBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Update state & Local storage
    const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'accepted' as const } : b);
    setBookings(updatedBookings);
    // bookings persisted via React state (in-memory)

    // Emit Notification back to relevant client user
    try {
      const clientMail = booking.userEmail;
      // Notification sent in-memory (no persistence)
    } catch (e) {
      console.error(e);
    }

    showToast(
      '✅',
      'تم قبول الحجز بنجاح',
      'Booking Request Accepted',
      `تم قبول طلب حجز العميل وتأشير حجز «${booking.tripTitle}».`,
      `The booking request has been successfully approved for trip "${booking.tripTitleEn}".`,
      '#10b981'
    );
  };

  // Delete Booking Action
  const handleDeleteBooking = (bookingId: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف وإلغاء هذا الحجز بالكامل؟' : 'Are you sure you want to cancel and delete this booking request?')) return;
    
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Filter out booking
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    setBookings(updatedBookings);
    // bookings persisted via React state (in-memory)

    // Update Trip reservation status to false so it can be re-booked!
    const localTrips = trips.map(t => t.id === booking.tripId ? { ...t, isBooked: false } : t);
    setTrips(localTrips);
    // trips persisted via React state (in-memory)

    showToast(
      '🗑️',
      'تم حذف طلب الحجز',
      'Booking Deleted',
      `تم شطب طلب الحجز لرحلة «${booking.tripTitle}» وإتاحة العرض مرة أخرى.`,
      `Booking for "${booking.tripTitleEn}" has been deleted and the trip is available again.`,
      '#e11d48'
    );
  };

  // Toggle reservation Status Of Trip manually
  const handleToggleTripBooked = (tripId: string) => {
    const updatedTrips = trips.map(t => t.id === tripId ? { ...t, isBooked: !t.isBooked } : t);
    setTrips(updatedTrips);
    // trips persisted via React state (in-memory)
    
    const trip = trips.find(t => t.id === tripId);
    const newStatus = trip ? !trip.isBooked : false;

    showToast(
      '🔒',
      'تحديث حالة الحجز',
      'Trip Status Updated',
      `تم تعديل حالة الحجز لعرض «${trip?.title}» إلى ${newStatus ? 'محجوز' : 'متاح'}.`,
      `Status for "${trip?.title_en}" set to ${newStatus ? 'Booked' : 'Available'}.`,
      '#0d9488'
    );
  };

  // Delete Trip Offer
  const handleDeleteTrip = (tripId: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا العرض بالكامل من المنصة؟' : 'Are you sure you want to definitely remove this offer?')) return;
    const updatedTrips = trips.filter(t => t.id !== tripId);
    setTrips(updatedTrips);
    // trips persisted via React state (in-memory)

    showToast(
      '🗑️',
      'تم حذف العرض',
      'Offer Deleted',
      'تم شطب العرض وإزالته تماماً من المنصة العامة للجمهور.',
      'This offer has been successfully excised from travel catalogs.',
      '#e11d48'
    );
  };

  // Approve Pending Trip from Companies
  const handleApprovePendingTrip = (tripId: string) => {
    const inputVal = pendingPriceInput[tripId];
    if (!inputVal || parseFloat(inputVal) <= 0) {
      alert(isAr ? 'يرجى تحديد السعر النهائي للمستخدم أولاً.' : 'Please enter a valid listing price.');
      return;
    }

    const updatedTrips = trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          price: inputVal,
          pendingApproval: false,
          companyPrice: (t as any).companyPrice !== undefined ? (t as any).companyPrice : (parseFloat(inputVal) * 0.75) // default cost
        };
      }
      return t;
    });

    setTrips(updatedTrips);
    // trips persisted via React state (in-memory)

    // Notify company simulator / Show Toast
    const trip = trips.find(t => t.id === tripId);
    showToast(
      '✅',
      'تم قبول ونشر العرض',
      'Offer Approved & Published',
      `تم اعتماد عرض «${trip?.title}» وتحديد السعر النهائي بـ $${inputVal} ونشره للمستخدمين.`,
      `Offer "${trip?.title_en}" is now approved and live for $${inputVal}.`,
      '#10b981'
    );
  };

  // Reject/Delete Pending Trip
  const handleRejectPendingTrip = (tripId: string) => {
    if (!window.confirm(isAr ? 'هل تود رفض وحذف هذا العرض المقدم؟' : 'Reject and delete this submitted offer?')) return;
    const updatedTrips = trips.filter(t => t.id !== tripId);
    setTrips(updatedTrips);
    // trips persisted via React state (in-memory)

    showToast(
      '❌',
      'تم رفض العرض',
      'Offer Rejected',
      'تم رفض طلب العرض المضاف وحذفه بنجاح.',
      'The company offer has been rejected and discarded.',
      '#e11d48'
    );
  };

  // Toggle Company Status
  const handleToggleCompanyStatus = (companyId: string) => {
    const updated = companies.map(c => c.id === companyId ? { ...c, active: c.active !== false ? false : true } : c);
    saveCompaniesToStorage(updated);
    
    const co = companies.find(c => c.id === companyId);
    const becameActive = co ? co.active === false : true;

    showToast(
      '🏢',
      becameActive ? 'تم تفعيل شركة' : 'تم إيقاف شركة',
      becameActive ? 'Company Activated' : 'Company Activated',
      `تم تغيير حالة الشركة «${co?.name}» بنجاح.`,
      `Company state altered successfully for "${co?.name}".`,
      becameActive ? '#10b981' : '#e11d48'
    );
  };

  // Delete Company
  const handleDeleteCompany = (companyId: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من مسح هذه الشركة وعروضها التابعة؟' : 'Are you sure you want to remove this company and all its offers?')) return;
    const updatedCompanies = companies.filter(c => c.id !== companyId);
    saveCompaniesToStorage(updatedCompanies);

    // Filter out all trips belonging to this company
    const companyTrips = trips.filter(t => t.companyId === companyId);
    const companyTripIds = companyTrips.map(t => t.id);
    const updatedTrips = trips.filter(t => t.companyId !== companyId);
    setTrips(updatedTrips);
    localStorage.setItem('travelo_trips', JSON.stringify(updatedTrips));

    // Also cancel and filter out all bookings associated with this company's offers
    const updatedBookings = bookings.filter(b => !companyTripIds.includes(b.tripId));
    setBookings(updatedBookings);
    localStorage.setItem('travelo_bookings', JSON.stringify(updatedBookings));

    showToast(
      '🗑️',
      'تم شطب معلومات الشركة وعروضها وحجوزاتها',
      'Company, Offers & Bookings Deleted',
      'تم إلغاء سجل الشركة وجميع عروضها التابعة لها وحجوزاتها المرتبطة بها في النظام بنجاح.',
      'Company workspace, affiliated offers, and related bookings deleted successfully.',
      '#e11d48'
    );
  };

  // Save edits of trip
  const handleSaveEditOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrip) return;

    const updatedTrips = trips.map(t => t.id === editingTrip.id ? editingTrip : t);
    setTrips(updatedTrips);
    // trips persisted via React state (in-memory)

    setEditingTrip(null);
    showToast(
      '💾',
      'تم حفظ التعديلات',
      'Edits Saved',
      `تم تحديث وتعديل عرض الفندق/المرفق «${editingTrip.title}» بنجاح وبشكل فوري للجمهور.`,
      `Edits for "${editingTrip.title_en}" saved and propagated instantly.`,
      '#0d9488'
    );
  };

  // Create Tag Event
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (newTagInput.trim() === '') return;
    
    // Add same tag to AR and a simple lowercase representation to EN
    setNewOfferTagsAr(prev => [...prev, newTagInput.trim()]);
    setNewOfferTagsEn(prev => [...prev, newTagInput.trim().toLowerCase()]);
    setNewTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    setNewOfferTagsAr(prev => prev.filter((_, i) => i !== index));
    setNewOfferTagsEn(prev => prev.filter((_, i) => i !== index));
  };

  // Image Upload handler (Base64 conversion for persistent caching / standalone)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readers = Array.from(files).map((file: any) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => {
      setNewOfferImages(prev => [...prev, ...results]);
    });
  };

  // Form Submission
  const handleCreateOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOfferImages.length === 0) {
      alert(isAr ? 'يرجى رفع صورة واحدة على الأقل للعرض الجديد.' : 'Please upload at least one image.');
      return;
    }

    const createdTripId = 'trip-' + Math.random().toString(36).slice(2, 9);
    const finalPrice = newOfferPrice || '50';
    const finalCost = newOfferCompanyPrice || String(parseFloat(finalPrice) * 0.8);

    const newTrip: Trip = {
      id: createdTripId,
      category: newOfferCat,
      title: newOfferTitleAr,
      title_en: newOfferTitleEn,
      subtitle: newOfferSubAr || (isAr ? 'عرض مميز وخدمات متكاملة.' : 'Cozy retreat with complete services.'),
      subtitle_en: newOfferSubEn || 'Premium retreat with complete accommodation.',
      image: newOfferImages[0],
      images: newOfferImages,
      price: finalPrice,
      locationName: newOfferLocationAr || (isAr ? 'دمشق، سوريا' : 'Damascus, Syria'),
      locationName_en: newOfferLocationEn || 'Damascus, Syria',
      adminRating: newOfferRating,
      isBooked: false,
      companyName: isAr ? 'لوحة تحكم ترافيلو' : 'Travelo Manager',
      companyName_en: 'Travelo Admin Panel',
      services: newOfferTagsAr.length > 0 ? newOfferTagsAr : [isAr ? 'دخول صالة VIP' : 'VIP Lounge Access', isAr ? 'مكيّف ومؤمن بالكامل' : 'A/C Fully'],
      services_en: newOfferTagsEn.length > 0 ? newOfferTagsEn : ['VIP Lounge Access', 'A/C Fully'],
      bedType: newOfferCat === 'hotels' ? newOfferBedType : undefined
    };

    // Store custom cost price
    (newTrip as any).companyPrice = parseFloat(finalCost) || 0;

    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    // trips persisted via React state (in-memory)

    // Reset Form
    setShowAddForm(false);
    setNewOfferTitleAr('');
    setNewOfferTitleEn('');
    setNewOfferLocationAr('');
    setNewOfferLocationEn('');
    setNewOfferSubAr('');
    setNewOfferSubEn('');
    setNewOfferPrice('');
    setNewOfferCompanyPrice('');
    setNewOfferRating('4');
    setNewOfferImages([]);
    setNewOfferTagsAr([]);
    setNewOfferTagsEn([]);

    showToast(
      '📦',
      'تم نشر العرض بنجاح',
      'Offer Published successfully',
      `تم إدراج العرض الفاخر «${newOfferTitleAr}» ونشره مباشرة للعملاء على المنصة.`,
      `Offer "${newOfferTitleEn}" has been listed and made live instantly.`,
      '#10b981'
    );
  };

  // Filtering Logic
  const filteredBookings = bookings.filter(b => {
    const normalizedType = b.bookingType === 'car' ? 'cars' : (b.bookingType === 'restaurant' ? 'restaurants' : (b.bookingType === 'holder' ? 'hotels' : b.bookingType));
    const normalizedFilter = bookingTypeFilter === 'car' ? 'cars' : (bookingTypeFilter === 'restaurant' ? 'restaurants' : (bookingTypeFilter === 'holder' ? 'hotels' : bookingTypeFilter));
    const typeMatch = normalizedFilter === 'all' || normalizedType === normalizedFilter;
    const statusMatch = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    return typeMatch && statusMatch;
  });

  const filteredOffers = trips.filter(t => {
    // skip ones waiting approval for standard offers list
    if (t.pendingApproval === true) return false;
    
    return offerCategoryFilter === 'all' || t.category === offerCategoryFilter;
  });

  const pendingOffers = trips.filter(t => t.pendingApproval === true);

  if (!adminUser) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-lg bg-white rounded-[32px] border border-slate-200/80 shadow-2xl overflow-hidden p-6 sm:p-8 relative">
          
          {/* Header branding */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-50 border border-teal-100 rounded-2xl mx-auto flex items-center justify-center mb-4 text-teal-650 shadow-md">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">
              {isAr ? 'بوابة الإشراف والربط الإداري' : 'Travelo Admin Access Portal'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-3 font-medium">
              {isAr 
                ? 'لوحة التحكم المركزية للمشرفين ومدراء المنصة في المحافظات السورية' 
                : 'Central administrative terminal for Syrian catalog operators and admins'}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-5">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-bold leading-relaxed">
                ⚠️ {loginError}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1.5">
                {isAr ? 'البريد الإلكتروني للإدارة' : 'Official Admin Email'}
              </label>
              <div className="relative">
                <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isAr ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="email"
                  required
                  placeholder=""
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 text-xs font-extrabold outline-none focus:border-teal-500 focus:bg-white transition-all font-mono
                    ${isAr ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}
                  `}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1.5">
                {isAr ? 'كلمة المرور المشفرة' : 'Secure Authorization Password'}
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isAr ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder=""
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 text-xs font-mono outline-none focus:border-teal-500 focus:bg-white transition-all
                    ${isAr ? 'pr-11 pl-16 text-right' : 'pl-11 pr-16 text-left'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold px-2.5 py-1 hover:bg-slate-100 rounded-lg cursor-pointer
                    ${isAr ? 'left-3' : 'right-3'}
                  `}
                >
                  {showPassword ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'إظهار' : 'Show')}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 via-teal-700 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-teal-650/15 cursor-pointer transition-all flex items-center justify-center gap-2 group"
              >
                <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>{isAr ? 'تسجيل دخول كمسؤول' : 'Authenticate & Sign In'}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-800" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Lightbox Backdrop with Framer Animation style */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in-backdrop"
        >
          <img 
            src={lightboxImg} 
            alt="Enlarged Document Preview" 
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-4 border-white/10 object-contain animate-scale-up"
          />
        </div>
      )}

      {/* Header and Control row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7 text-teal-650" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                <span>{isAr ? 'لوحة تحكم المشرف والربط الإداري' : 'Admin & Partner Dashboard'}</span>
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                {isAr ? 'إدارة رحلات العروض، تأكيد طلبات وثائق الهوية الوطنية للنزلاء، ومراقبة تسعير نسب الأرباح.' : 'Perform critical verifications, supervise active reservations, and tweak margin profits.'}
              </p>
            </div>
          </div>
        </div>

        {/* Real-Time Live Clock Indicators and Authentication profile */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-center">
          <div className="flex items-center gap-2.5 bg-slate-100 border border-slate-200 p-1.5 px-3.5 rounded-2xl">
            <div className={`text-start sm:text-right ${isAr ? 'text-right' : 'text-left'}`}>
              <span className="text-[10px] text-slate-400 font-bold block leading-none">{isAr ? 'الربط الإداري النشط' : 'Authorized Personnel'}</span>
              <span className="text-xs font-extrabold text-teal-600 block mt-1">{isAr ? adminUser.roleAr : adminUser.roleEn}</span>
            </div>
            <button
              onClick={handleAdminLogout}
              className="p-1 px-2.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer text-[10px] font-black uppercase tracking-wider shrink-0"
              title={isAr ? 'تسجيل الخروج من لوحة الإشراف' : 'Log Out administrative session'}
            >
              {isAr ? 'خروج' : 'Log Out'}
            </button>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl uppercase">
              {isAr ? 'التحكم الإداري المباشر' : 'Live Control'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics indicator Ribbon Dashboard info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 p-5 rounded-[24px] shadow-sm flex flex-col justify-between group hover:border-teal-500/30 transition-all duration-300">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">{isAr ? 'إجمالي العروض النشطة' : 'Active Offers'}</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{trips.filter(t => !t.pendingApproval).length}</span>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">+{trips.filter(t => t.isBooked).length} {isAr ? 'محجوزة' : 'booked'}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-[24px] shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-300">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">{isAr ? 'طلبات الحجز' : 'Total Bookings'}</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-black text-indigo-600 tracking-tight">{bookings.length}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{bookings.filter(b => b.status === 'pending').length} {isAr ? 'جديد' : 'new'}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-[24px] shadow-sm flex flex-col justify-between group hover:border-amber-500/30 transition-all duration-300">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">{isAr ? 'الشركات المسجلة' : 'Registered Agencies'}</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-4xl font-black text-amber-600 tracking-tight">{companies.length}</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">{companies.filter(c => c.active !== false).length} {isAr ? 'نشطه' : 'active'}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-[24px] shadow-sm flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-300">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">{isAr ? 'صافي الأرباح الكلية' : 'Net expected profit'}</span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">${calculateTotalProfit().toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">USD</span>
          </div>
        </div>
      </div>

      {/* Tabs pills filters selection row */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 border border-slate-200/60 p-1.5 rounded-[20px] select-none">
        <button 
          onClick={() => { setActiveTab('bookings'); setShowAddForm(false); }}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2
            ${activeTab === 'bookings' ? 'bg-white shadow-md text-slate-900 border border-slate-200/30 font-black scale-102' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          <ClipboardList className="w-4 h-4 text-teal-600" />
          <span>{isAr ? 'طلبات الحجز الفورية' : 'Live Reservation Requests'}</span>
          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">{bookings.length}</span>
        </button>

        <button 
          onClick={() => { setActiveTab('offers'); }}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2
            ${activeTab === 'offers' ? 'bg-white shadow-md text-slate-900 border border-slate-200/30 font-black scale-102' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          <Package className="w-4 h-4 text-indigo-600" />
          <span>{isAr ? 'عروض وتصنيفات سوريا' : 'Curated Offers Directory'}</span>
          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">{trips.filter(t => !t.pendingApproval).length}</span>
        </button>

        <button 
          onClick={() => { setActiveTab('pending'); setShowAddForm(false); }}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 relative
            ${activeTab === 'pending' ? 'bg-white shadow-md text-slate-900 border border-slate-200/30 font-black scale-102' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'أرباح الحجوزات' : 'Booking Profits'}</span>
        </button>

        <button 
          onClick={() => { setActiveTab('companies'); setShowAddForm(false); }}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2
            ${activeTab === 'companies' ? 'bg-white shadow-md text-slate-900 border border-slate-200/30 font-black scale-102' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          <Building2 className="w-4 h-4 text-pink-600" />
          <span>{isAr ? 'دليل شركات المحافظات' : 'Managing Partner Accounts'}</span>
        </button>

        <button 
          onClick={() => { setActiveTab('profits'); setShowAddForm(false); }}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2
            ${activeTab === 'profits' ? 'bg-white shadow-md text-slate-900 border border-slate-200/30 font-black scale-102' : 'text-slate-500 hover:text-slate-800'}
          `}
        >
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'نسبة الأرباح والموارد' : 'Pricing & Net Profits Engine'}</span>
        </button>
      </div>

      {/* TAB AREA 1: RESERVE BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <ClipboardList className="w-5 h-5 text-teal-600 shrink-0" />
                <span>{isAr ? 'طلبات الحجز الواردة — كل المحافظات' : 'Submitted Booking Invoices & Requests'}</span>
              </h3>
              
              {/* Type Subfilters */}
              <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold leading-none self-start">
                {[
                  { id: 'all' as const, lbl: isAr ? 'الكل' : 'All' },
                  { id: 'hotels' as const, lbl: isAr ? 'فنادق' : 'Hotels' },
                  { id: 'cars' as const, lbl: isAr ? 'سيارات' : 'Cars' },
                  { id: 'restaurants' as const, lbl: isAr ? 'مطاعم' : 'Diners' },
                  { id: 'apartments' as const, lbl: isAr ? 'شقق سكنية' : 'Apartments' }
                ].map(switchBtn => {
                  const IconComponent = switchBtn.id === 'hotels' ? Hotel 
                             : switchBtn.id === 'cars' ? Car 
                             : switchBtn.id === 'restaurants' ? Utensils 
                             : switchBtn.id === 'apartments' ? Home
                             : LayoutGrid;
                  return (
                    <button 
                      key={switchBtn.id}
                      onClick={() => setBookingTypeFilter(switchBtn.id)}
                      className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        bookingTypeFilter === switchBtn.id
                          ? 'bg-white shadow-sm text-slate-900 font-extrabold' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      <span>{switchBtn.lbl}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Filter buttons */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 pb-5">
              {[
                { id: 'all' as const, lbl: isAr ? 'الجميع' : 'All Statuses' },
                { id: 'pending' as const, lbl: isAr ? 'معلّق' : 'Awaiting Review' },
                { id: 'accepted' as const, lbl: isAr ? 'مقبول رسميّاً' : 'Approved' },
                { id: 'rejected' as const, lbl: isAr ? 'ملغي' : 'Canceled' }
              ].map(st => {
                const IconComponent = st.id === 'pending' ? Clock 
                             : st.id === 'accepted' ? CheckCircle 
                             : st.id === 'rejected' ? X 
                             : null;
                return (
                  <button 
                    key={st.id}
                    onClick={() => setBookingStatusFilter(st.id)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5
                      ${bookingStatusFilter === st.id 
                        ? 'bg-slate-900 border-transparent text-white' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }
                    `}
                  >
                    {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                    <span>{st.lbl}</span>
                  </button>
                );
              })}
            </div>

            {/* List entries */}
            {filteredBookings.length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                <ClipboardList className="w-16 h-16 mx-auto opacity-20 mb-4" />
                <p className="text-sm font-bold">{isAr ? 'لا توجد طلبات حجز مطابقة لهذه الفلاتر حالياً.' : 'No reservations registered under current metrics.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredBookings.map((b) => {
                  const hotelNationalityLabel = b.details.nationality === 'syrian' ? (isAr ? 'سوري / سورية' : 'Syrian Native') : (isAr ? 'سائح أجنبي' : 'International Tourist');
                  const hotelMaritalLabel = b.details.maritalStatus === 'single' ? (isAr ? 'أعزب' : 'Single') : (isAr ? 'متزوج وعائلته معه' : 'Married');
                  const customIdIndex = String(b.id).toUpperCase().slice(-5);
                  const showDocs = expandedDocs[b.id] || false;
                  
                  // Collect documents that actually exist
                  const attachedDocs: Array<{ labelAr: string; labelEn: string; src: string }> = [];
                  if (b.details.idImage) attachedDocs.push({ labelAr: 'بطاقة الهوية والنزول الشخصية', labelEn: 'Syrian National ID card', src: b.details.idImage });
                  if (b.details.passportImage) attachedDocs.push({ labelAr: 'جواز السفر المعتمد للتسجيل', labelEn: 'International Passport Document', src: b.details.passportImage });
                  if (b.details.familyImage) attachedDocs.push({ labelAr: 'وثيقة دفتر العائلة للنزيل', labelEn: 'Syrian Family Book Records', src: b.details.familyImage });
                  if (b.details.contractImage) attachedDocs.push({ labelAr: 'صفحة صك عقد الزواج الرسمي', labelEn: 'Marriage Contract Certificate', src: b.details.contractImage });

                  return (
                    <div 
                      key={b.id} 
                      className={`bg-white rounded-[24px] border p-5 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-md
                        ${b.status === 'accepted' ? 'border-emerald-200' : b.status === 'rejected' ? 'border-rose-200' : 'border-slate-200'}
                      `}
                    >
                      <div>
                        {/* Header Badge */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase
                            ${b.bookingType === 'hotels' ? 'bg-emerald-50 text-emerald-700' : (b.bookingType === 'cars' || b.bookingType === 'car') ? 'bg-indigo-50 text-indigo-700' : b.bookingType === 'apartments' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'}
                          `}>
                            {b.bookingType === 'hotels' ? (isAr ? '🏨 فندق' : 'Hotel Room') : (b.bookingType === 'cars' || b.bookingType === 'car') ? (isAr ? '🚗 سيارة' : 'Car Lease') : b.bookingType === 'apartments' ? (isAr ? '🏢 شقة سكنية' : 'Apartment') : (isAr ? '🍽️ مطعم فاخر' : 'Diner')}
                          </span>
                          
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border
                            ${b.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : b.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'}
                          `}>
                            {b.status === 'accepted' ? '✅ مقبول' : b.status === 'rejected' ? '❌ ملغي' : '⏳ معلّق'}
                          </span>
                        </div>

                        {/* Booking Title / Location */}
                        <div className="space-y-1 mt-2">
                          <h4 className="text-base font-black text-slate-800 line-clamp-1">{isAr ? b.tripTitle : b.tripTitleEn}</h4>
                          <span className="text-[10px] font-mono font-semibold text-slate-400 block">ID: #{customIdIndex} ({b.date})</span>
                        </div>

                        {/* Customer Information Section */}
                        <div className="mt-4 space-y-2 pt-3 border-t border-slate-100">
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-slate-400 font-medium shrink-0 min-w-16 block">{isAr ? '👤 الاسم:' : '👤 Name:'}</span>
                            <span className="text-xs text-slate-800 font-extrabold">{b.details.fullName || b.userEmail}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-xs text-slate-400 font-medium shrink-0 min-w-16 block">{isAr ? '📞 الهاتف:' : '📞 Phone:'}</span>
                            <span className="text-xs text-slate-800 font-mono font-bold">{b.details.phone || '—'}</span>
                          </div>
                          
                          {/* Guests count and specific filters */}
                          {b.details.guestCount && (
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-slate-400 font-medium shrink-0 min-w-16 block">{isAr ? '👥 النزلاء:' : '👥 Guests:'}</span>
                              <span className="text-xs text-slate-800 font-bold">{b.details.guestCount} {isAr ? 'أشخاص' : 'persons'}</span>
                            </div>
                          )}

                          {b.details.days && (
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-slate-400 font-medium shrink-0 min-w-16 block">{isAr ? '⏳ المدة:' : '⏳ Lease:'}</span>
                              <span className="text-xs text-slate-800 font-bold">{b.details.days} {isAr ? 'أيام كاملة' : 'days'}</span>
                            </div>
                          )}

                          {b.bookingType === 'hotels' && (
                            <>
                              <div className="flex items-start gap-2">
                                <span className="text-xs text-slate-400 font-medium shrink-0 min-w-16 block">{isAr ? '🛪 الجنسية:' : '🛪 Status:'}</span>
                                <span className="text-xs text-slate-800 font-bold">{hotelNationalityLabel}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-xs text-slate-400 font-medium shrink-0 min-w-16 block">{isAr ? '💍 العائلية:' : '💍 Family:'}</span>
                                <span className="text-xs text-slate-800 font-bold">{hotelMaritalLabel}</span>
                              </div>
                            </>
                          )}

                          {b.bookingType === 'car' && b.details.driverOption && (
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-slate-400 font-medium shrink-0 min-w-16 block">{isAr ? '👑 السائق:' : '👑 Driver:'}</span>
                              <span className="text-xs text-slate-800 font-bold">
                                {b.details.driverOption === 'with_driver' ? (isAr ? 'مع سائق من ترافيلو' : 'With customized driver') : (isAr ? 'خدمة قيادة ذاتية' : 'Self driving lease')}
                              </span>
                            </div>
                          )}

                          {b.bookingType === 'hotels' ? (
                            <div className="flex items-start gap-2 mt-2 pt-2 border-t border-slate-50">
                              <span className="text-xs text-slate-400 font-bold shrink-0 min-w-16 block">{isAr ? '💰 التكلفة:' : '💰 Total Price:'}</span>
                              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded leading-none">
                                {isAr ? 'بدون تسعير مسبق' : 'Without pricing'}
                              </span>
                            </div>
                          ) : b.details.totalPrice && (
                            <div className="flex items-start gap-2 mt-2 pt-2 border-t border-slate-50">
                              <span className="text-xs text-slate-400 font-bold shrink-0 min-w-16 block">{isAr ? '💰 التكلفة:' : '💰 Total Price:'}</span>
                              <span className="text-sm font-black text-emerald-600">${b.details.totalPrice}</span>
                            </div>
                          )}
                        </div>

                        {/* Document Verification collapsible toggle block */}
                        {attachedDocs.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <button
                              onClick={() => toggleDocsPanel(b.id)}
                              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>📂</span>
                              <span>{isAr ? `تدقيق المرفقات الثبوتية (${attachedDocs.length})` : `Verify Documents (${attachedDocs.length})`}</span>
                            </button>

                            {showDocs && (
                              <div className="mt-3 grid grid-cols-2 gap-2 animate-slide-down bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                {attachedDocs.map((doc, idx) => (
                                  <div key={idx} className="flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500 font-medium mb-1 truncate max-w-full block">
                                      {isAr ? doc.labelAr : doc.labelEn}
                                    </span>
                                    <img 
                                      src={doc.src} 
                                      alt={doc.labelEn} 
                                      onClick={() => setLightboxImg(doc.src)}
                                      className="w-full h-16 object-cover rounded-lg border border-slate-200 cursor-zoom-in transition-all duration-300 hover:scale-105 shadow-sm"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Triggers */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                        {b.status !== 'accepted' ? (
                          <button 
                            onClick={() => handleAcceptBooking(b.id)}
                            className="grow py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'قبول الحجز' : 'Approve Booking'}</span>
                          </button>
                        ) : (
                          <div className="grow py-2.5 px-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs border border-emerald-100 text-center flex items-center justify-center gap-1">
                            <span>✅</span>
                            <span>{isAr ? 'تم تأكيد حجز العميل' : 'Reservation Approved'}</span>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => handleDeleteBooking(b.id)}
                          className="py-2.5 px-3 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer border border-slate-200/50 hover:border-rose-100"
                          title={isAr ? 'إلغاء وشطب هذا الطلب' : 'Reject request'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB AREA 2: ACTIVE OFFERS & DIRECTORY MANAGEMENT */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          
          {/* Header Title & Expandable insert form block button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold leading-none select-none">
              {[
                { id: 'all' as const, lbl: isAr ? 'الكل' : 'All' },
                { id: 'hotels' as const, lbl: isAr ? 'فنادق' : 'Hotels' },
                { id: 'cars' as const, lbl: isAr ? 'سيارات' : 'Cars' },
                { id: 'restaurants' as const, lbl: isAr ? 'مطاعم' : 'Restaurants' },
                { id: 'apartments' as const, lbl: isAr ? 'شقق سكنية' : 'Apartments' }
              ].map(pill => {
                const IconComponent = pill.id === 'hotels' ? Hotel 
                             : pill.id === 'cars' ? Car 
                             : pill.id === 'restaurants' ? Utensils 
                             : pill.id === 'apartments' ? Home 
                             : LayoutGrid;
                return (
                  <button 
                    key={pill.id}
                    onClick={() => setOfferCategoryFilter(pill.id)}
                    className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${offerCategoryFilter === pill.id ? 'bg-white shadow-sm text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{pill.lbl}</span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة عرض فاخر جديد' : 'Publish New Offer'}</span>
            </button>
          </div>

          {/* Dynamic CREATE OFFER Form container */}
          {showAddForm && (
            <form 
              onSubmit={handleCreateOfferSubmit}
              className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-6 sm:p-8 animate-slide-down space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <span>{isAr ? 'عقد نشر عرض فاخر جديد في الدليل' : 'Incorporate New Premium Activity Listing'}</span>
                </h3>
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Grid elements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isAr ? 'فئة المنشأة / المرفق *' : 'Facility Category *'}</label>
                  <select 
                    value={newOfferCat} 
                    onChange={(e) => setNewOfferCat(e.target.value as Category)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-teal-500 focus:bg-white transition-all"
                  >
                    <option value="hotels">🏨 {isAr ? 'فندق فاخر' : 'Luxury Hotel Rooms'}</option>
                    <option value="cars">🚗 {isAr ? 'تأجير سيارات فخمة' : 'Premium Lease Vehicles'}</option>
                    <option value="restaurants">🍽️ {isAr ? 'مطعم مميز' : 'Traditional Levant Diner'}</option>
                    <option value="apartments">🏢 {isAr ? 'شقة سكنية للايجار' : 'Residential Apartments'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isAr ? 'التقييم المقترح (1 - 5) *' : 'Assigned rating (1 - 5) *'}</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="1" 
                    max="5"
                    value={newOfferRating} 
                    onChange={(e) => setNewOfferRating(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-teal-500 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isAr ? 'اسم المنشأة باللغة العربية *' : 'Facility Title (Arabic) *'}</label>
                  <input 
                    type="text" 
                    placeholder="مثال: فندق شهباء حلب الملكي" 
                    value={newOfferTitleAr} 
                    onChange={(e) => setNewOfferTitleAr(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isAr ? 'اسم المنشأة باللغة الإنكليزية *' : 'Facility Title (English) *'}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Shahba Aleppo Royal Hotel" 
                    value={newOfferTitleEn} 
                    onChange={(e) => setNewOfferTitleEn(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isAr ? 'الموقع والمحافظة (بالعربية) *' : 'Location (Arabic) *'}</label>
                  <input 
                    type="text" 
                    placeholder="مثال: حلب - الشهباء، سوريا" 
                    value={newOfferLocationAr} 
                    onChange={(e) => setNewOfferLocationAr(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isAr ? 'الموقع والمحافظة (بالإنكليزية) *' : 'Location (English) *'}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aleppo - Shahba District, Syria" 
                    value={newOfferLocationEn} 
                    onChange={(e) => setNewOfferLocationEn(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isAr ? 'سعر المستخدم المعروض ($) *' : 'Listing Price for Users ($) *'}</label>
                  <input 
                    type="number" 
                    placeholder="السعر المعروض للعملاء" 
                    value={newOfferPrice} 
                    onChange={(e) => setNewOfferPrice(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-teal-500 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isAr ? 'تكلفة الشركة الخاصة بنا ($)' : 'Cost Price of agency ($)'}</label>
                  <input 
                    type="number" 
                    placeholder="سعر التكلفة من الشركة لتحديد الأرباح" 
                    value={newOfferCompanyPrice} 
                    onChange={(e) => setNewOfferCompanyPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-teal-500 focus:bg-white transition-all font-mono"
                  />
                </div>

                {newOfferCat === 'hotels' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{isAr ? 'نوع السرير المدمج' : 'Hotel Bed configuration'}</label>
                    <select 
                      value={newOfferBedType} 
                      onChange={(e) => setNewOfferBedType(e.target.value as 'single_bed' | 'two_beds')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-teal-500 focus:bg-white transition-all"
                    >
                      <option value="single_bed">{isAr ? '🛏️ سرير فردي لشخص واحد' : 'Single snug Cozy Bed'}</option>
                      <option value="two_beds">{isAr ? '🛏️🛏️ سريرين لشخصين' : 'Double cozy beds'}</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Tag builder and Services editor tags list (VIP features) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {isAr ? 'المزايا والخدمات والمميزات المرفقة بالعرض' : 'Curated Facilities & Features (Options)'}
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {newOfferTagsAr.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-xl border border-teal-100 font-bold"
                    >
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(idx)} 
                        className="text-[10px] text-teal-500 hover:text-teal-800 font-extrabold cursor-pointer ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 max-w-md">
                  <input 
                    type="text" 
                    placeholder={isAr ? 'أدخل خدمة لتضمينها (مثال: إنترنت سريع)' : 'Type active amenity (e.g. Free Wifi)'}
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(e);
                      }
                    }}
                    className="grow px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Upload Base64 Images preview and box */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {isAr ? 'المستندات أو صور المرفق الفاخر المعروض *' : 'Facility Preview Images *'}
                </label>
                
                {/* Thumbnails preview strip */}
                {newOfferImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-2 mb-3">
                    {newOfferImages.map((img, index) => (
                      <div key={index} className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <img src={img} alt="Thumb preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setNewOfferImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 bg-red-600 text-white text-[8px] p-0.5 rounded-full w-4 h-4 flex items-center justify-center font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-600">{isAr ? 'تصفح وارفاق صور للمرفق' : 'Browse offer gallery files'}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{isAr ? 'يقبل صور بلاحقة png, jpeg' : 'Supports common image extensions'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  className="py-2.5 px-6 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md cursor-pointer"
                >
                  {isAr ? 'تأكيد وإدراج المنشأة' : 'Verify & Publish Listings'}
                </button>
              </div>
            </form>
          )}

          {/* Catalog grid listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              return (
                <div 
                  key={offer.id} 
                  className="bg-white rounded-[28px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Photo area with visual tags */}
                  <div className="relative h-48 overflow-hidden bg-slate-900 shrink-0">
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {offer.isBooked && (
                      <span className="absolute top-4 right-4 bg-rose-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider select-none animate-pulse">
                        {isAr ? 'محجوز حالياً' : 'Booked'}
                      </span>
                    )}

                    <span className="absolute bottom-4 left-4 right-auto bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {offer.category === 'hotels' ? (isAr ? '🏨 فنادق' : 'Hotels') : (offer.category === 'cars' ? (isAr ? '🚗 سيارات' : 'Cars') : (offer.category === 'apartments' ? (isAr ? '🏢 شقق سكنية' : 'Apartments') : (isAr ? '🍽️ مطاعم' : 'Restaurants')))}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col grow justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-base font-extrabold text-slate-800">{isAr ? offer.title : offer.title_en}</h4>
                        {offer.adminRating && (
                          <div className="flex items-center gap-0.5 bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-lg border border-amber-100 text-[10px] shrink-0">
                            <Star className="w-3 h-3 fill-current text-amber-500" />
                            <span>{offer.adminRating}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900">${offer.price}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          /{(offer.category === 'hotels' || offer.category === 'apartments') ? (isAr ? 'الليلة' : 'night') : (offer.category === 'cars' ? (isAr ? 'يوم' : 'day') : (isAr ? 'شخص' : 'person'))}
                        </span>
                      </div>

                      {offer.locationName && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{isAr ? offer.locationName : offer.locationName_en}</span>
                        </div>
                      )}

                      <p className="text-xs text-slate-400 leading-normal line-clamp-2 italic">
                        {isAr ? offer.subtitle : offer.subtitle_en}
                      </p>
                    </div>

                    {/* Operational Action triggers */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleTripBooked(offer.id)}
                        className={`grow py-2 px-3 border rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1
                          ${offer.isBooked 
                            ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          }
                        `}
                      >
                        <span>🔓</span>
                        <span>{offer.isBooked ? (isAr ? 'إلغاء الحجز' : 'Release offer') : (isAr ? 'تعيين كـ محجوز' : 'Mark Booked')}</span>
                      </button>

                      <button 
                        onClick={() => setEditingTrip(offer)}
                        className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold border border-slate-200/40 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{isAr ? 'تعديل' : 'Modify'}</span>
                      </button>

                      <button 
                        onClick={() => handleDeleteTrip(offer.id)}
                        className="py-2 px-3 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/40 rounded-xl text-xs transition-all shrink-0 cursor-pointer"
                        title={isAr ? 'حذف العرض نهائياً' : 'Remove offer'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB AREA 3: BOOKING PROFITS AND REVENUE LEDGER */}
      {activeTab === 'pending' && (() => {
        const data = getAcceptedBookingsProfitData();
        return (
          <div className="space-y-6">
            {/* Main Stats Summary Banner */}
            <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 rounded-[32px] p-6 text-white shadow-lg overflow-hidden relative group">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-emerald-100">
                    {isAr ? 'التقرير المالي لأرباح ترافيلو' : 'Travelo Financial Profit Summary'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-3 leading-none">
                    {isAr ? 'أرباح الحجوزات المقبولة والمؤكدة' : 'Earnings from Confirmed Bookings'}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                    {isAr
                      ? 'يتم احتساب هذا التقرير ديناميكياً استناداً إلى عمليات الحجز المقبولة فقط، بعد خصم عمولة وتكاليف شركات ومزودي الخدمات في المحافظات السورية.'
                      : 'This report is dynamically tabulated using accepted booking receipts, after adjusting direct cost rates from partners.'}
                  </p>
                </div>

                <div className="flex gap-4 sm:gap-6 justify-between md:justify-end border-t border-white/10 pt-4 md:border-none md:pt-0 shrink-0">
                  <div className="text-center md:text-right">
                    <span className="text-[10px] text-white/75 block uppercase font-bold">{isAr ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
                    <span className="text-xl sm:text-2xl font-black tracking-tight">${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                  </div>
                  <div className="w-px bg-white/20"></div>
                  <div className="text-center md:text-right">
                    <span className="text-[10px] text-white/75 block uppercase font-bold text-rose-200">{isAr ? 'إجمالي التكلفة للمزودين' : 'Supplier Costs'}</span>
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white/90">${data.totalCost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                  </div>
                  <div className="w-px bg-white/20"></div>
                  <div className="text-center md:text-right">
                    <span className="text-[10px] text-white/75 block uppercase font-bold bg-white/10 px-2 py-0.5 rounded-md">{isAr ? 'صافي أرباح المنصة' : 'Net Margin'}</span>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-amber-200 block mt-0.5">${data.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category breakdown Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.keys(data.categories).map((key) => {
                const cat = data.categories[key as 'hotels' | 'apartments' | 'cars' | 'restaurants'];
                const count = cat.count;
                const profit = cat.profit;
                const pct = data.totalProfit > 0 ? (profit / data.totalProfit) * 105 : 0;
                const safePct = Math.min(100, pct);

                // Color themes
                const colors = {
                  emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', barBg: 'bg-emerald-500', hover: 'hover:border-emerald-300' },
                  purple: { text: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', barBg: 'bg-purple-500', hover: 'hover:border-purple-300' },
                  indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100', barBg: 'bg-indigo-500', hover: 'hover:border-indigo-300' },
                  amber: { text: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', barBg: 'bg-amber-500', hover: 'hover:border-amber-300' }
                }[cat.color];

                return (
                  <div 
                    key={key}
                    className={`bg-white border border-slate-200 p-4 rounded-3xl shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow ${colors.hover}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wide block">
                        {isAr ? cat.nameAr : cat.nameEn}
                      </span>
                      <div className="p-1 px-2 rounded-full bg-slate-50 border border-slate-200/50 text-[10px] font-black font-mono text-slate-500 line-none">
                        {count} {isAr ? 'حجوزات' : 'bookings'}
                      </div>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl sm:text-2xl font-black ${colors.text} tracking-tight`}>
                          ${profit.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">USD</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 font-bold">{safePct.toFixed(0)}%</span>
                    </div>

                    {/* Simple inline progress bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${colors.barBg}`}
                        style={{ width: `${Math.max(3, safePct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Individual Transactions details ledger */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-teal-600" />
                  <span>{isAr ? 'دفتر الأستاذ المالي للحجوزات المقبولة' : 'Financial Ledger for Approved Bookings'}</span>
                </span>
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full">
                  {data.detailedItems.length} {isAr ? 'عمليات مؤكدة' : 'approved bookings'}
                </span>
              </h3>

              {data.detailedItems.length === 0 ? (
                <div className="p-16 text-center text-slate-400">
                  <CheckCircle className="w-16 h-16 mx-auto text-slate-300 opacity-40 mb-4" />
                  <p className="text-sm font-bold">{isAr ? 'لا توجد حجوزات مقبولة حالياً لحساب أرباحها.' : 'No accepted bookings have been tabulated for profit margins yet.'}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right sm:text-start" dir={isAr ? 'rtl' : 'ltr'}>
                    <thead>
                      <tr className="border-b border-slate-150 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 text-start">{isAr ? 'العميل وتاريخ الحجز' : 'Client & Date'}</th>
                        <th className="pb-3 text-start">{isAr ? 'الخدمة / الوجهة والمزود' : 'Offer & Provider'}</th>
                        <th className="pb-3 text-center">{isAr ? 'التصنيف' : 'Type'}</th>
                        <th className="pb-3 text-center">{isAr ? 'سعر البيع' : 'Sold at'}</th>
                        <th className="pb-3 text-center">{isAr ? 'سعر التكلفة' : 'Cost to Us'}</th>
                        <th className="pb-3 text-end">{isAr ? 'الربح الصافي' : 'Net Margin'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {data.detailedItems.map((item) => {
                        const CategoryIcon = {
                          hotels: Hotel,
                          apartments: Home,
                          cars: Car,
                          restaurants: Utensils
                        }[item.category];

                        return (
                          <tr key={item.bookingId} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 pr-2 text-start">
                              <span className="font-extrabold text-slate-900 block">{item.guestName}</span>
                              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{item.date}</span>
                            </td>
                            <td className="py-3.5 text-start">
                              <span className="font-bold text-slate-800 block line-clamp-1">{item.tripTitle}</span>
                              <span className="text-[10px] text-teal-600 block mt-0.5 font-semibold">
                                🏢 {isAr ? `المزود: ${item.companyName}` : `Provider: ${item.companyName}`}
                              </span>
                            </td>
                            <td className="py-3.5 text-center">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-black border rounded-full px-2 py-0.5 uppercase
                                ${item.category === 'hotels' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                  item.category === 'apartments' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                                  item.category === 'cars' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-amber-50 text-amber-700 border-amber-100'}
                              `}>
                                <CategoryIcon className="w-3 h-3 shrink-0" />
                                <span>
                                  {item.category === 'hotels' ? (isAr ? 'فندق' : 'Hotel') : 
                                   item.category === 'apartments' ? (isAr ? 'شقة' : 'Apartment') : 
                                   item.category === 'cars' ? (isAr ? 'سيارة' : 'Car') : (isAr ? 'مطعم' : 'Restaurant')}
                                </span>
                              </span>
                            </td>
                            <td className="py-3.5 text-center font-bold font-mono text-slate-800">
                              ${item.revenue.toFixed(1)}
                            </td>
                            <td className="py-3.5 text-center font-bold font-mono text-slate-400">
                              ${item.cost.toFixed(1)}
                            </td>
                            <td className="py-3.5 text-end font-extrabold font-mono text-emerald-600 text-sm">
                              +${item.profit.toFixed(1)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB AREA 4: MANAGING REGISTERED CORPORATIONS IN SYRIA */}
      {activeTab === 'companies' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
              <Building2 className="w-5 h-5 text-pink-600 shrink-0" />
              <span>{isAr ? 'الشركات والمنشآت المسجلة في المحافظات السورية' : 'Affiliated Companies & Local Travel Bureaus'}</span>
            </h3>

            <div className="space-y-4">
              {companies.map((c) => {
                const isActivated = c.active !== false;
                return (
                  <div 
                    key={c.id} 
                    className="bg-slate-50 border border-slate-200/70 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-black text-slate-800">{c.name}</h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border
                          ${isActivated ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}
                        `}>
                          {isActivated ? (isAr ? 'نشط ومصرح' : 'Active') : (isAr ? 'موقوف مؤقتاً' : 'Suspended')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-500 text-xs mt-2 flex-wrap font-semibold leading-none">
                        <span>
                          {isAr ? (
                            `المجال: ${
                              c.category === 'hotels' || c.category === 'hotel' ? 'فنادق' : 
                              c.category === 'cars' || c.category === 'car' ? 'سيارات' : 
                              c.category === 'apartments' || c.category === 'apartment' ? 'شقق سكنية' : 
                              c.category === 'restaurants' || c.category === 'restaurant' ? 'مطاعم' : 'فئة أخرى'
                            }`
                          ) : (
                            `Category: ${c.category}`
                          )}
                        </span>
                        {c.phone && <span>• 📞 {c.phone}</span>}
                        <span>• 📧 {c.email}</span>
                      </div>
                    </div>

                    {/* Suspend or Activate toggles */}
                    <div className="flex gap-2 shrink-0 self-start sm:self-center">
                      <button 
                        onClick={() => handleToggleCompanyStatus(c.id)}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer
                          ${isActivated 
                            ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }
                        `}
                      >
                        {isActivated ? (isAr ? '⏸ إيقاف الشركة' : 'Suspend') : (isAr ? '▶ تفعيل الشركة' : 'Activate')}
                      </button>

                      <button 
                        onClick={() => handleDeleteCompany(c.id)}
                        className="p-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                        title={isAr ? 'حذف معلومات الشركة' : 'Delete credentials'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB AREA 5: PRICING & PROFIT ENGINE STATS */}
      {activeTab === 'profits' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{isAr ? 'تحديث ومراقبة نسب الأرباح وتسعير التكلفة' : 'Tweak Selling Rates and Cost Differentials'}</span>
            </h3>

            <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
              {isAr 
                ? 'عدل سعر التكلفة النهائي المتلقى من الطرف المزود (شركة تأجير، الفندق الشريك) وسعر النشر المعروض للعملاء — الفارق المحسوب هو الهامش الصافي العائد لرحلات ترافيلو.'
                : 'Supervise direct price margins across Damascus and Syria catalogs. Difference represents net profit directly processed through billing logs.'}
            </p>

            <div className="space-y-4">
              {trips.filter(t => !t.pendingApproval).map((trip, idx) => {
                const numericPrice = parseFloat(trip.price) || 0;
                const costPrice = (trip as any).companyPrice !== undefined ? parseFloat((trip as any).companyPrice) : (numericPrice * 0.82);
                const differential = numericPrice - costPrice;

                return (
                  <div 
                    key={trip.id}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                  >
                    <div className="flex gap-4 items-center">
                      <img 
                        src={trip.image} 
                        alt={trip.title} 
                        className="w-14 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-black text-slate-800">{isAr ? trip.title : trip.title_en}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase mt-0.5">{trip.category}</span>
                      </div>
                    </div>

                    {/* Inputs to adjust costing and listing */}
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">{isAr ? 'سعر التكلفة للشركة ($)' : 'Agency Net Cost ($)'}</label>
                        <input 
                          type="number" 
                          value={costPrice.toFixed(1)}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = trips.map(t => {
                              if (t.id === trip.id) {
                                return { ...t, companyPrice: String(parseFloat(val) || 0) };
                              }
                              return t;
                            });
                            setTrips(updated);
                            // trips managed in-memory
                          }}
                          className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold font-mono focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">{isAr ? 'سعر النشر للجمهور ($)' : 'Listing Display Price ($)'}</label>
                        <input 
                          type="number" 
                          value={trip.price}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = trips.map(t => {
                              if (t.id === trip.id) {
                                return { ...t, price: val };
                              }
                              return t;
                            });
                            setTrips(updated);
                            // trips managed in-memory
                          }}
                          className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold font-mono focus:border-emerald-500"
                        />
                      </div>

                      {/* Differential output */}
                      <div className="lg:text-center shrink-0">
                        <span className="block text-[10px] font-bold text-slate-400 mb-1">{isAr ? 'هامش الربح لكل حجز' : 'Margin per Single Booking'}</span>
                        <span className={`text-base font-black ${differential >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {differential >= 0 ? '+' : ''}${differential.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL DIALOG PRESETS IN REACT FOR TRIPS */}
      {editingTrip && (
        <div className="fixed inset-0 z-[8000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-[32px] p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                <Edit2 className="w-5 h-5 text-indigo-600" />
                <span>{isAr ? 'تعديل بيانات وتفاصيل العرض' : 'Edit Listing Profile'}</span>
              </h3>
              <button 
                onClick={() => setEditingTrip(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditOffer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">{isAr ? 'اسم العرض (العربية)' : 'Title (Arabic)'}</label>
                  <input 
                    type="text"
                    value={editingTrip.title}
                    onChange={(e) => setEditingTrip({ ...editingTrip, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-sans outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">{isAr ? 'اسم العرض (الإنكليزية)' : 'Title (English)'}</label>
                  <input 
                    type="text"
                    value={editingTrip.title_en}
                    onChange={(e) => setEditingTrip({ ...editingTrip, title_en: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-sans outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">{isAr ? 'المحافظة (العربية)' : 'Location (Arabic)'}</label>
                  <input 
                    type="text"
                    value={editingTrip.locationName || ''}
                    onChange={(e) => setEditingTrip({ ...editingTrip, locationName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-sans outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">{isAr ? 'المحافظة (الإنكليزية)' : 'Location (English)'}</label>
                  <input 
                    type="text"
                    value={editingTrip.locationName_en || ''}
                    onChange={(e) => setEditingTrip({ ...editingTrip, locationName_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-sans outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">{isAr ? 'سعر بيع المستخدم ($)' : 'Customer retail price ($)'}</label>
                  <input 
                    type="number"
                    value={editingTrip.price}
                    onChange={(e) => setEditingTrip({ ...editingTrip, price: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-sans outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">{isAr ? 'سعر التكلفة لـ ترافيلو ($)' : 'Our cost price ($)'}</label>
                  <input 
                    type="number"
                    value={(editingTrip as any).companyPrice || ''}
                    onChange={(e) => setEditingTrip({ ...editingTrip, companyPrice: parseFloat(e.target.value) || 0 } as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-sans outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">{isAr ? 'سرد تفصيل أو وصف مختصر' : 'Description summary excerpt'}</label>
                <textarea 
                  value={editingTrip.subtitle}
                  onChange={(e) => setEditingTrip({ ...editingTrip, subtitle: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingTrip(null)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md cursor-pointer"
                >
                  {isAr ? 'حفظ التعديلات' : 'Commit Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
