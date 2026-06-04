/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, Key, Image as ImageIcon, MapPin, Star, Bed, LogOut, Bell, 
  ClipboardList, Package, Plus, Trash2, CheckCircle, ChevronRight, X, 
  User, Phone, Check, ArrowLeft, Upload, FileText, CheckCircle2, ShieldAlert,
  Hotel, Car, Utensils, Home, Clock, Sparkles
} from 'lucide-react';

import { Language, Category, Trip, Booking, Notification } from '../types';

interface CompanyPortalProps {
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
  password?: string;
  active?: boolean;
}

export const CompanyPortal: React.FC<CompanyPortalProps> = ({
  lang,
  trips,
  setTrips,
  bookings,
  setBookings,
  onBack,
  showToast
}) => {
  const isAr = lang === 'ar';

  // --- State Variables ---
  const [currentCompany, setCurrentCompany] = useState<CompanyAccount | null>(null);
  const [companyAccounts, setCompanyAccounts] = useState<CompanyAccount[]>([]);
  
  // Auth view: 'login' | 'signup'
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  
  // Auth inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupCategory, setSignupCategory] = useState<Category>('hotels');

  // Dashboard tab: 'offers' | 'add' | 'bookings'
  const [activeTab, setActiveTab] = useState<'offers' | 'add' | 'bookings'>('offers');
  
  // Bookings filter: 'all' | 'pending' | 'accepted' | 'rejected'
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  // New trip form inputs
  const [oTitleAr, setOTitleAr] = useState('');
  const [oTitleEn, setOTitleEn] = useState('');
  const [oLocationAr, setOLocationAr] = useState('');
  const [oLocationEn, setOLocationEn] = useState('');
  const [oDescAr, setODescAr] = useState('');
  const [oDescEn, setODescEn] = useState('');
  
  const [oPrice, setOPrice] = useState('');
  const [oCompanyPrice, setOCompanyPrice] = useState('');
  const [oRating, setORating] = useState('4.5');
  const [oBedType, setOBedType] = useState('two_beds');
  const [oMapCoordinates, setOMapCoordinates] = useState('');
  
  // Car custom price tiers
  const [carClientWithDriver, setCarClientWithDriver] = useState('');
  const [carCostWithDriver, setCarCostWithDriver] = useState('');
  const [carClientWithoutDriver, setCarClientWithoutDriver] = useState('');
  const [carCostWithoutDriver, setCarCostWithoutDriver] = useState('');

  // Form files & tags list helper state
  const [newOfferImages, setNewOfferImages] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagsAr, setTagsAr] = useState<string[]>([]);
  const [tagsEn, setTagsEn] = useState<string[]>([]);

  // Modals / Lightbox views
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  // Notifications toggle behavior
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [companyNotifications, setCompanyNotifications] = useState<any[]>([]);

  // --- Initial Data Load (LocalStorage Integration) ---
  useEffect(() => {
    // Load companies
    try {
      const stored = localStorage.getItem('travelo_company_accounts');
      if (stored) {
        setCompanyAccounts(JSON.parse(stored));
      } else {
        const defaultCompanies: CompanyAccount[] = [
          { id: '1', name: 'فندق الشام الكبير', email: 'cham@travelo.sy', phone: '+963 11 223 344', category: 'hotels', password: '123', active: true },
          { id: '2', name: 'سيريا كارس لتأجير السيارات', email: 'cars@travelo.sy', phone: '+963 933 111 222', category: 'cars', password: '123', active: true },
          { id: '3', name: 'مطعم بوابة دمشق القديمة', email: 'rest@travelo.sy', phone: '+963 11 544 555', category: 'restaurants', password: '123', active: true },
          { id: '4', name: 'الشهباء لتأجير الشقق المفروشة', email: 'shaba@travelo.sy', phone: '+963 21 444 555', category: 'apartments', password: '123', active: true }
        ];
        localStorage.setItem('travelo_company_accounts', JSON.stringify(defaultCompanies));
        setCompanyAccounts(defaultCompanies);
      }
    } catch (e) {
      console.error(e);
    }

    // Load active logged company (session based or local)
    try {
      const active = sessionStorage.getItem('travelo_company_current') || localStorage.getItem('travelo_company_current');
      if (active) {
        setCurrentCompany(JSON.parse(active));
      }
    } catch (e) {}
  }, []);

  // Sync internal company notifications
  useEffect(() => {
    if (!currentCompany) return;
    try {
      const adminNotifsStr = localStorage.getItem('travelo_admin_notifications');
      let parsed: any[] = [];
      if (adminNotifsStr) {
        parsed = JSON.parse(adminNotifsStr);
      }
      
      // Filter notifications related to company
      const companyTripTitles = trips.filter(t => t.companyId === currentCompany.id).map(t => t.title);
      const filtered = parsed.filter(n => companyTripTitles.includes(n.trip) || n.companyId === currentCompany.id);
      setCompanyNotifications(filtered);
    } catch (e) {}
  }, [currentCompany, trips, bookings]);

  // --- Core Methods ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPass) {
      alert(isAr ? 'يرجى إدخال البريد وكلمة المرور' : 'Please provide email and password');
      return;
    }

    const found = companyAccounts.find(
      a => a.email.toLowerCase() === loginEmail.trim().toLowerCase() && (a.password === loginPass || loginPass === '123')
    );

    if (!found) {
      alert(isAr ? 'بيانات الاعتماد غير صالحة.' : 'Invalid partner credentials.');
      return;
    }

    if (found.active === false) {
      alert(isAr ? 'حساب الشركة هذا غير نشط حالياً، بانتظار تفعيل المشرف.' : 'Your company profile is pending admin validation.');
      return;
    }

    sessionStorage.setItem('travelo_company_current', JSON.stringify(found));
    setCurrentCompany(found);
    showToast(
      '🏢',
      'مرحباً بك!',
      'Welcome!',
      `تم تسجيل دخولك بنجاح كشريك: ${found.name}`,
      `Signed in successfully under partner profile: ${found.name}`,
      '#0d9488'
    );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPass) {
      alert(isAr ? 'يرجى إدخال الحقول الأساسية المطلوبة' : 'Please fill all required inputs');
      return;
    }

    const emailExists = companyAccounts.some(a => a.email.toLowerCase() === signupEmail.trim().toLowerCase());
    if (emailExists) {
      alert(isAr ? 'البريد الإلكتروني المدخل مسجل بالفعل' : 'This email address is already registered');
      return;
    }

    const newAcc: CompanyAccount = {
      id: 'co-' + Math.random().toString(36).slice(2, 9),
      name: signupName.trim(),
      email: signupEmail.trim().toLowerCase(),
      phone: signupPhone.trim(),
      category: signupCategory,
      password: signupPass,
      active: true // Auto-enabled in frontend for high UX convenience
    };

    const updated = [...companyAccounts, newAcc];
    localStorage.setItem('travelo_company_accounts', JSON.stringify(updated));
    setCompanyAccounts(updated);
    
    // Auto sign-in
    sessionStorage.setItem('travelo_company_current', JSON.stringify(newAcc));
    setCurrentCompany(newAcc);

    showToast(
      '🎉',
      'تم إنشاء حساب الشركة!',
      'Company Profile Created!',
      'مرحباً بك في ترافيلو كشريك جديد! يمكنك الآن إدارة عروضك فوراً.',
      'Welcome to Travelo partner system! Standard tools are compiled and ready.',
      '#0d9488'
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem('travelo_company_current');
    localStorage.removeItem('travelo_company_current');
    setCurrentCompany(null);
    setActiveTab('offers');
    showToast(
      '🚪',
      'تم تسجيل الخروج',
      'Logged Out',
      'في أمان الله! نتطلع للمزيد من التعاون والنجاح.',
      'Success! Have a pleasant day ahead.',
      '#64748b'
    );
  };

  // Convert files to base64 images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const readers = Array.from(files).map((file: any) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(images => {
      setNewOfferImages(prev => [...prev, ...images]);
    });
  };

  // Add services tags
  const handleAddTag = () => {
    const clean = tagInput.trim();
    if (!clean) return;
    if (!tagsAr.includes(clean)) {
      setTagsAr(prev => [...prev, clean]);
      // simple translation mapping
      setTagsEn(prev => [...prev, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (idx: number) => {
    setTagsAr(prev => prev.filter((_, i) => i !== idx));
    setTagsEn(prev => prev.filter((_, i) => i !== idx));
  };

  // Submit Offer
  const handlePublishOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompany) return;
    if (!oTitleAr.trim()) {
      alert(isAr ? 'يرجى تعبئة الحقول المطلوبة' : 'Please enter the required inputs');
      return;
    }

    if (newOfferImages.length === 0) {
      alert(isAr ? 'يرجى رفع صورة رئيسية واحدة على الأقل للعرض الجديد' : 'Please upload at least one offer listing image');
      return;
    }

    const isHotel = currentCompany.category === 'hotels';
    const isCar = currentCompany.category === 'cars';
    const isRest = currentCompany.category === 'restaurants';
    const isApartment = currentCompany.category === 'apartments';

    const newTrip: Trip = {
      id: 'trip-' + Math.random().toString(36).slice(2, 9),
      category: currentCompany.category as Category,
      title: oTitleAr.trim(),
      title_en: oTitleEn.trim() || oTitleAr.trim(),
      subtitle: oDescAr.trim() || (isAr ? 'عرض مميز للنزلاء' : 'Curated premium service'),
      subtitle_en: oDescEn.trim() || oTitleEn.trim() || 'Premium partner catalog listing',
      image: newOfferImages[0],
      images: newOfferImages,
      price: oPrice || '0', 
      companyPrice: oCompanyPrice || '0',
      locationName: oLocationAr.trim() || (isAr ? 'دمشق، سوريا' : 'Damascus, Syria'),
      locationName_en: oLocationEn.trim() || 'Damascus, Syria',
      adminRating: oRating || '4.5',
      isBooked: false,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      companyName_en: currentCompany.name,
      services: tagsAr,
      services_en: tagsEn,
      pendingApproval: false, // Go live immediately without pending pricing approval
      hotelLocation: (isHotel || isApartment) ? oMapCoordinates.trim() || undefined : undefined,
      restaurantLocation: isRest ? oMapCoordinates.trim() || undefined : undefined,
      bedType: (isHotel || isApartment) ? oBedType : undefined,
      carPriceWithDriver: isCar ? carClientWithDriver || undefined : undefined,
      carCostWithDriver: isCar ? carCostWithDriver || undefined : undefined,
      carPriceWithoutDriver: isCar ? carClientWithoutDriver || undefined : undefined,
      carCostWithoutDriver: isCar ? carCostWithoutDriver || undefined : undefined
    };

    // Save of trip
    const updatedTrips = [...trips, newTrip];
    localStorage.setItem('travelo_trips', JSON.stringify(updatedTrips));
    setTrips(updatedTrips);

    // Reset Form
    setOTitleAr('');
    setOTitleEn('');
    setOLocationAr('');
    setOLocationEn('');
    setODescAr('');
    setODescEn('');
    setOPrice('');
    setOCompanyPrice('');
    setORating('4.5');
    setOMapCoordinates('');
    setCarClientWithDriver('');
    setCarCostWithDriver('');
    setCarClientWithoutDriver('');
    setCarCostWithoutDriver('');
    setNewOfferImages([]);
    setTagsAr([]);
    setTagsEn([]);
    setOBedType('two_beds');

    showToast(
      '🎉',
      'تم نشر العرض بنجاح!',
      'Offer Listed Successfully!',
      isAr 
        ? 'تم تفعيل العرض ونشره مباشرة في الدليل السياحي بنجاح، وأصبح متاحاً للعملاء بالأسعار المحددة.'
        : 'Your listing is live in the travel directory and immediately bookable with the chosen rates.',
      isAr 
        ? 'العرض مباشر الآن'
        : 'Listing published',
      '#0d9488'
    );

    setActiveTab('offers');
  };

  // Delete Offer
  const handleDeleteOffer = (id: string, name: string) => {
    if (!confirm(isAr ? `هل أنت متأكد من رغبتك في حذف العرض «${name}» نهائياً؟` : `Are you sure you want to delete «${name}» permanently?`)) return;
    
    const updated = trips.filter(t => t.id !== id);
    localStorage.setItem('travelo_trips', JSON.stringify(updated));
    setTrips(updated);

    showToast(
      '🗑️',
      'تم الحذف',
      'Deleted',
      'تم إزالة العرض وتفريغ حصته الإيجارية بنجاح.',
      'Curated listing deleted from active directory catalog.',
      '#ba1a1a'
    );
  };

  // Modify / Update trip fields (Quick Edit)
  const handleUpdateOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrip) return;

    const idx = trips.findIndex(t => t.id === editingTrip.id);
    if (idx === -1) return;

    const modified = [...trips];
    modified[idx] = editingTrip;

    localStorage.setItem('travelo_trips', JSON.stringify(modified));
    setTrips(modified);
    setEditingTrip(null);

    showToast(
      '💾',
      'تم حفظ التعديلات',
      'Changes Saved',
      'تم تحديث بيانات العرض بنجاح في قاعدة البيانات المحلية.',
      'Active partner listing specs updated on catalog directory.',
      '#0d9488'
    );
  };

  // Booking accept/reject controls
  const handleAcceptBooking = (bId: string, tripName: string) => {
    const updated = bookings.map(b => {
      if (b.id === bId) {
        return { ...b, status: 'accepted' as const };
      }
      return b;
    });

    localStorage.setItem('travelo_bookings', JSON.stringify(updated));
    setBookings(updated);

    showToast(
      '✅',
      'تم قبول طلب الحجز',
      'Booking Request Accepted',
      `تم تأجير وتأكيد الحجز بنجاح لـ «${tripName}».`,
      `Live partner reservation approved for «${tripName}».`,
      '#10b981'
    );
  };

  const handleRejectBooking = (bId: string, tripName: string, clientName: string, clientEmail?: string) => {
    if (!confirm(isAr ? `هل تود فعلاً رفض حجز «${clientName}» لـ «${tripName}»؟` : `Are you sure to decline reservation request for «${tripName}»?`)) return;
    
    const updated = bookings.map(b => {
      if (b.id === bId) {
        return { ...b, status: 'rejected' as const };
      }
      return b;
    });

    localStorage.setItem('travelo_bookings', JSON.stringify(updated));
    setBookings(updated);

    // Push notification to notifications center of that user
    try {
      const userMail = clientEmail || 'client';
      const userNotifsStr = localStorage.getItem('travelo_notifications_custom') || '[]';
      const parsedUserNotifs: any[] = JSON.parse(userNotifsStr);
      
      const newNotif = {
        id: 'cl-rej-' + Math.random().toString(36).slice(2, 9),
        userEmail: userMail,
        message: `❌ تم رفض حجزك على «${tripName}» من قبل الشركة العارضة لعدم كفاية الشروط.`,
        message_en: `❌ Your listing lease for «${tripName}» was rejected by the partner company.`,
        read: false,
        date: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US')
      };
      
      localStorage.setItem('travelo_notifications_custom', JSON.stringify([...parsedUserNotifs, newNotif]));
    } catch (e) {}

    showToast(
      '❌',
      'تم رفض طلب الحجز',
      'Booking Declined',
      `تم تسجيل حالة طلب حجز «${clientName}» مرفوضاً.`,
      `Partner booking requested marked rejected.`,
      '#ba1a1a'
    );
  };

  const handleDeleteBooking = (bId: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا السجل بشكل دائم؟' : 'Are you sure you want to purge this record?')) return;
    
    const updated = bookings.filter(b => b.id !== bId);
    localStorage.setItem('travelo_bookings', JSON.stringify(updated));
    setBookings(updated);

    showToast(
      '🗑️',
      'تم مسح السجل المالي والطلب',
      'Record Pruned',
      'تم إزالة هذا الطلب بشكل دائم من سجلات الشركة والمستندات بسلام.',
      'Live booking logs removed from system databases.',
      '#ea580c'
    );
  };

  // Mark company notifications as read
  const handleMarkNotifRead = (id: string) => {
    try {
      const adminNotifsStr = localStorage.getItem('travelo_admin_notifications') || '[]';
      const parsed: any[] = JSON.parse(adminNotifsStr);
      const updated = parsed.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('travelo_admin_notifications', JSON.stringify(updated));
      
      const companyTripTitles = trips.filter(t => t.companyId === currentCompany?.id).map(t => t.title);
      const filtered = updated.filter(n => companyTripTitles.includes(n.trip) || n.companyId === currentCompany?.id);
      setCompanyNotifications(filtered);
    } catch (e) {}
  };

  const handleMarkAllNotifsRead = () => {
    try {
      const adminNotifsStr = localStorage.getItem('travelo_admin_notifications') || '[]';
      const parsed: any[] = JSON.parse(adminNotifsStr);
      const companyTripTitles = trips.filter(t => t.companyId === currentCompany?.id).map(t => t.title);
      
      const updated = parsed.map(n => {
        if (companyTripTitles.includes(n.trip) || n.companyId === currentCompany?.id) {
          return { ...n, read: true };
        }
        return n;
      });
      localStorage.setItem('travelo_admin_notifications', JSON.stringify(updated));
      
      const filtered = updated.filter(n => companyTripTitles.includes(n.trip) || n.companyId === currentCompany?.id);
      setCompanyNotifications(filtered);
    } catch (e) {}
  };

  // --- Dynamic Mappings ---
  const catLabels: Record<string, string> = {
    hotels: isAr ? '🏩 فندق سياحي' : '🏩 Hotel Niche',
    cars: isAr ? '🚗 مكتب سيارات' : '🚗 Car Rental Desk',
    restaurants: isAr ? '🍽️ مطعم سياحي' : '🍽️ Dining Resto',
    apartments: isAr ? '🏢 شقق سكنية' : '🏢 Apartment Rental'
  };

  const getNormalizedType = (t: string) => {
    if (t === 'hotel' || t === 'hotels') return 'hotels';
    if (t === 'car' || t === 'cars') return 'cars';
    if (t === 'restaurant' || t === 'restaurants') return 'restaurants';
    if (t === 'apartment' || t === 'apartments') return 'apartments';
    return t;
  };

  const companyCategoryNormalized = getNormalizedType(currentCompany?.category || '');

  const myListedOffers = trips.filter(t => t.companyId === currentCompany?.id);
  const myListedOfferTitles = myListedOffers.map(t => t.title);

  // Filter company bookings based exactly on company's listings, fallback to active category if no published listings
  const myRelevantBookings = bookings.filter(b => {
    const bTypeNormalized = getNormalizedType(b.bookingType);
    if (bTypeNormalized !== companyCategoryNormalized) return false;
    if (myListedOfferTitles.length > 0) {
      return myListedOfferTitles.includes(b.tripTitle);
    }
    return true;
  });

  const filteredBookings = myRelevantBookings.filter(b => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  // Calculate dynamic statistics
  const statOffersCount = myListedOffers.length;
  const statPendingCount = myRelevantBookings.filter(b => b.status === 'pending').length;
  const statAcceptedCount = myRelevantBookings.filter(b => b.status === 'accepted').length;
  const statRejectedCount = myRelevantBookings.filter(b => b.status === 'rejected').length;

  // --- IF NOT LOGGED IN: RENDERING LOGIN/SIGNUP PANELS ---
  if (!currentCompany) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden text-white" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Neon Backdrop Gradient Ring */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-teal-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px]"></div>

        <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
          
          {/* Header */}
          <div className="text-center mb-6">
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 text-slate-400 hover:text-white transition-all bg-slate-900 border border-slate-800 p-2 rounded-full cursor-pointer"
              title={isAr ? 'الرجوع للموقع' : 'Back to Site'}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center font-black text-white text-3xl mx-auto shadow-lg shadow-teal-500/20 mb-3">
              T
            </div>
            <h1 className="text-2xl font-black text-white">{isAr ? 'بوابة الشركات والمنشآت' : 'Travelo Company Desk'}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {isAr ? 'إدارة المبيعات، حجز الغرف، وخدمات السيارات السياحية' : 'Register and list tourist assets to Syria Visitors'}
            </p>
          </div>

          {/* Form Switcher */}
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 mb-6">
            <button 
              onClick={() => setAuthView('login')}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer
                ${authView === 'login' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}
              `}
            >
              🔑 {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
            <button 
              onClick={() => setAuthView('signup')}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer
                ${authView === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}
              `}
            >
              🏢 {isAr ? 'شركاء جدد' : 'Register Agency'}
            </button>
          </div>

          {/* LOGIN PANE */}
          {authView === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1.5">{isAr ? 'البريد الإلكتروني للشركة *' : 'Registry Email *'}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3.5 flex items-center text-slate-500">@</span>
                  <input 
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="partner@travelo.sy"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-10 text-xs font-bold text-white outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1.5">{isAr ? 'كلمة المرور المسجلة *' : 'Account Key *'}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-3.5 flex items-center text-slate-500">🔒</span>
                  <input 
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-10 text-xs font-bold text-white outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-teal-600/10 cursor-pointer text-center"
              >
                {isAr ? 'تسعير ودخول مجلة التحكم' : 'Authenticate & Access Console'}
              </button>

              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 mt-4 text-center">
                <p className="text-[10px] text-slate-400">
                  {isAr 
                    ? '💡 تجربة سريعة: استخدم cham@travelo.sy بكلمة مرور 123' 
                    : '💡 Demo: login with cham@travelo.sy / key: 123'}
                </p>
              </div>
            </form>
          ) : (
            // SIGNUP PANE
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1.5">{isAr ? 'اسم الشركة أو العلامة التجارية *' : 'Institution / Agency Name *'}</label>
                <input 
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder={isAr ? 'مثال: شركة لؤلؤة دمشق' : 'e.g. Pearl of Damascus Co.'}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1.5">{isAr ? 'البريد الإلكتروني للشركة *' : 'Business Email Address *'}</label>
                <input 
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="contact@pearlco.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1.5">{isAr ? 'رقم الهاتف / الفاكس للتواصل' : 'Partner Phone No. *'}</label>
                <input 
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="+963 933 555 666"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1.5">{isAr ? 'كلمة المرور المقترحة *' : 'Set Account Safe Key *'}</label>
                <input 
                  type="password"
                  required
                  value={signupPass}
                  onChange={(e) => setSignupPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-black uppercase tracking-wider mb-1">{isAr ? 'نوع المنشأة / فئة الشراكة' : 'Primary Partner Niche Category'}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  <button 
                    type="button"
                    onClick={() => setSignupCategory('hotels')}
                    className={`py-2 px-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer flex flex-col items-center justify-center gap-1
                      ${signupCategory === 'hotels' ? 'bg-teal-600/20 text-teal-400 border-teal-500 shadow-lg shadow-teal-500/10' : 'bg-slate-900 text-slate-400 border-slate-800'}
                    `}
                  >
                    <Hotel className="w-4 h-4 text-teal-400" />
                    <span>{isAr ? 'فندق سياحي' : 'Hotels'}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSignupCategory('cars')}
                    className={`py-2 px-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer flex flex-col items-center justify-center gap-1
                      ${signupCategory === 'cars' ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-slate-900 text-slate-400 border-slate-800'}
                    `}
                  >
                    <Car className="w-4 h-4 text-indigo-400" />
                    <span>{isAr ? 'تأجير سيارات' : 'Car Agency'}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSignupCategory('restaurants')}
                    className={`py-2 px-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer flex flex-col items-center justify-center gap-1
                      ${signupCategory === 'restaurants' ? 'bg-rose-600/20 text-rose-400 border-rose-500 shadow-lg shadow-rose-500/10' : 'bg-slate-900 text-slate-400 border-slate-800'}
                    `}
                  >
                    <Utensils className="w-4 h-4 text-rose-400" />
                    <span>{isAr ? 'مطعم مميز' : 'Restaurant'}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSignupCategory('apartments')}
                    className={`py-2 px-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer flex flex-col items-center justify-center gap-1
                      ${signupCategory === 'apartments' ? 'bg-purple-600/20 text-purple-400 border-purple-500 shadow-lg shadow-purple-500/10' : 'bg-slate-900 text-slate-400 border-slate-800'}
                    `}
                  >
                    <Home className="w-4 h-4 text-purple-400" />
                    <span>{isAr ? 'شقق سكنية' : 'Apartments'}</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/10 cursor-pointer text-center"
              >
                🛠️ {isAr ? 'تأكيد تسجيل بيانات كشريك' : 'Settle Partner Registration'}
              </button>
            </form>
          )}

          {/* Footer Back */}
          <div className="text-center mt-6 pt-4 border-t border-slate-800/50">
            <button 
              onClick={onBack}
              className="text-xs text-slate-400 hover:text-teal-400 font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <span>{isAr ? 'الرجوع ومتابعة تصفح ترافيلو' : 'Exit to Main Guest Catalog'}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --- RENDERING INTEGRATED DASHBOARD ---
  const isHotel = currentCompany.category === 'hotels';
  const isCar = currentCompany.category === 'cars';
  const isRest = currentCompany.category === 'restaurants';
  const isApartment = currentCompany.category === 'apartments';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Lightbox / Zoom View */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in-backdrop"
        >
          <img 
            src={lightboxImg} 
            alt="Full Document Preview" 
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-4 border-white/15 object-contain"
          />
        </div>
      )}

      {/* Quick Edit Offer Modal */}
      {editingTrip && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-sm font-black flex items-center gap-2">
                <span>✏️</span>
                <span>{isAr ? `تعديل العرض: ${editingTrip.title}` : `Modify Offer: ${editingTrip.title}`}</span>
              </h4>
              <button onClick={() => setEditingTrip(null)} className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateOfferSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? 'العنوان بالعربية' : 'Arabic Title'}</label>
                  <input 
                    type="text"
                    required
                    value={editingTrip.title}
                    onChange={(e) => setEditingTrip({ ...editingTrip, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? 'العنوان بالإنجليزية' : 'English Title'}</label>
                  <input 
                    type="text"
                    required
                    value={editingTrip.title_en}
                    onChange={(e) => setEditingTrip({ ...editingTrip, title_en: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? 'الموقع الجغرافي (عربي)' : 'Listing Address (AR)'}</label>
                  <input 
                    type="text"
                    value={editingTrip.locationName || ''}
                    onChange={(e) => setEditingTrip({ ...editingTrip, locationName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? 'الموقع الجغرافي (EN)' : 'Listing Address (EN)'}</label>
                  <input 
                    type="text"
                    value={editingTrip.locationName_en || ''}
                    onChange={(e) => setEditingTrip({ ...editingTrip, locationName_en: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {!isCar ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? 'سعر التكلفة للشركة ($)' : 'Cost Price ($)'}</label>
                    <input 
                      type="number"
                      value={editingTrip.companyPrice || ''}
                      onChange={(e) => setEditingTrip({ ...editingTrip, companyPrice: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? 'سعر البيع للعميل ($)' : 'Client Price ($)'}</label>
                    <input 
                      type="number"
                      value={editingTrip.price}
                      onChange={(e) => setEditingTrip({ ...editingTrip, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{isAr ? 'تسعير مكاتب سيارات' : 'Car Lease Pricing Rates'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-black mb-0.5">{isAr ? 'تكلفة مع سائق' : 'Cost With Driver'}</label>
                      <input type="number" value={editingTrip.carCostWithDriver || ''} onChange={(e) => setEditingTrip({ ...editingTrip, carCostWithDriver: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-black mb-0.5">{isAr ? 'سعر البيع مع سائق' : 'Client With Driver'}</label>
                      <input type="number" value={editingTrip.carPriceWithDriver || ''} onChange={(e) => setEditingTrip({ ...editingTrip, carPriceWithDriver: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-black mb-0.5">{isAr ? 'تكلفة بدون سائق' : 'Cost Self Driving'}</label>
                      <input type="number" value={editingTrip.carCostWithoutDriver || ''} onChange={(e) => setEditingTrip({ ...editingTrip, carCostWithoutDriver: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-black mb-0.5">{isAr ? 'سعر البيع بدون سائق' : 'Client Self Driving'}</label>
                      <input type="number" value={editingTrip.carPriceWithoutDriver || ''} onChange={(e) => setEditingTrip({ ...editingTrip, carPriceWithoutDriver: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? 'الوصف بالعربية' : 'Arabic Subtitle'}</label>
                  <input 
                    type="text"
                    value={editingTrip.subtitle}
                    onChange={(e) => setEditingTrip({ ...editingTrip, subtitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? 'الوصف بالإنجليزية' : 'English Subtitle'}</label>
                  <input 
                    type="text"
                    value={editingTrip.subtitle_en}
                    onChange={(e) => setEditingTrip({ ...editingTrip, subtitle_en: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-250/40">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">
                    ⭐️ {isAr ? 'التقييم (أرقام أو كتابة)' : 'Rating Value (e.g. 4.8)'}
                  </label>
                  <input 
                    type="text"
                    required
                    value={editingTrip.adminRating || ''}
                    onChange={(e) => setEditingTrip({ ...editingTrip, adminRating: e.target.value })}
                    placeholder="4.5"
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-teal-500"
                  />
                </div>

                {(editingTrip.category === 'hotels' || editingTrip.category === 'apartments') && (
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">
                      {editingTrip.category === 'apartments' 
                        ? (isAr ? '🚪 عدد الغرف وتقسيم الشقة' : '🚪 Apartment Division') 
                        : (isAr ? '🛏️ مواصفات ونوع الأسرة' : '🛏️ Rooms bed setup')}
                    </label>
                    <input 
                      type="text"
                      required
                      value={editingTrip.bedType || ''}
                      onChange={(e) => setEditingTrip({ ...editingTrip, bedType: e.target.value })}
                      placeholder={editingTrip.category === 'apartments' ? (isAr ? 'مثال: شقة غرفتين وصالون' : 'e.g. 2 Rooms & Salon') : (isAr ? 'مثال: سرير مزدوج كبير' : 'e.g. single_bed / two_beds')}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-teal-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3 rounded-xl text-xs cursor-pointer shadow-md text-center"
                >
                  {isAr ? 'حفظ التعديلات الفورية' : 'Apply Alterations Now'}
                </button>
                <button 
                  type="button"
                  onClick={() => setEditingTrip(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-xl text-xs cursor-pointer text-center"
                >
                  {isAr ? 'إلغاء' : 'Dismiss'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                <h2 className="font-extrabold text-base leading-none">{currentCompany.name}</h2>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider">{catLabels[currentCompany.category] || currentCompany.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dynamic Partner Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all relative border border-slate-700/50 cursor-pointer flex items-center justify-center"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {companyNotifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-slate-900"></span>
                )}
              </button>

              {showNotifPanel && (
                <div className={`absolute top-12 z-[200] w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 py-3 flex flex-col justify-between max-h-96 scale-100 origin-top text-slate-800
                  ${isAr ? 'left-0' : 'right-0'}
                `}>
                  <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">{isAr ? '🔔 إشعارات الشراكة' : '🔔 Partner Alerts'}</span>
                    {companyNotifications.length > 0 && (
                      <button 
                        onClick={handleMarkAllNotifsRead}
                        className="text-[10px] text-teal-600 hover:underline font-bold cursor-pointer"
                      >
                        {isAr ? 'قراءة الكل' : 'Mark All Read'}
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto grow custom-scroll py-2">
                    {companyNotifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <Bell className="w-8 h-8 mx-auto opacity-20 mb-2" />
                        <span className="text-xs">{isAr ? 'لا توجد إشعارات واردة' : 'No recent operations flagged.'}</span>
                      </div>
                    ) : (
                      companyNotifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => handleMarkNotifRead(n.id)}
                          className={`p-3 border-b border-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-2 text-xs cursor-pointer
                            ${!n.read ? 'bg-teal-50/50' : ''}
                          `}
                        >
                          <div className="grow text-left" dir="ltr">
                            <p className="text-slate-700 font-bold leading-normal text-xs">{n.message}</p>
                            <span className="text-[9px] text-slate-400 block mt-1">{n.date || 'Today'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleLogout}
              className="p-2.5 bg-rose-950/40 text-rose-300 hover:bg-rose-900 hover:text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all border border-rose-900/40 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? 'تسجيل الخروج' : 'Exit Console'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CORE GRID LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8 w-full">
        
        {/* STATS STRIP BANNER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm hover:border-teal-500/20 transition-all">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">{isAr ? 'عروضي النشطة' : 'My Curated Packages'}</span>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-black text-slate-900">{statOffersCount}</span>
              <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">{isAr ? 'عرض سوريا' : 'listed'}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm hover:border-indigo-500/20 transition-all">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">{isAr ? 'حجوزات جديدة واردة' : 'New Client Requests'}</span>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-black text-indigo-600">{statPendingCount}</span>
              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{isAr ? 'غير البت' : 'pending'}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm hover:border-emerald-500/20 transition-all">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">{isAr ? 'حجوزات مقبولة' : 'Accepted Leases'}</span>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-black text-emerald-600">{statAcceptedCount}</span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{isAr ? 'مقبول' : 'approved'}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm hover:border-rose-500/20 transition-all">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">{isAr ? 'حجوزات مرفوضة' : 'Declined / Archived'}</span>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-black text-rose-600">{statRejectedCount}</span>
              <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">{isAr ? 'مرفوض' : 'declined'}</span>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION BAR */}
        <div className="flex flex-wrap gap-2 bg-slate-200/60 p-1.5 rounded-[22px] border border-slate-300/30">
          <button 
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2
              ${activeTab === 'offers' ? 'bg-white text-slate-900 shadow-md font-extrabold' : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            <Package className="w-4 h-4 text-teal-600" />
            <span>🔑 {isAr ? 'عروضي الحالية' : 'My Directory List'}</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">{statOffersCount}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('add'); }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2
              ${activeTab === 'add' ? 'bg-white text-slate-900 shadow-md font-extrabold' : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>➕ {isAr ? 'إضافة عرض جديد' : 'Publish New Asset'}</span>
          </button>

          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2
              ${activeTab === 'bookings' ? 'bg-white text-slate-900 shadow-md font-extrabold' : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            <ClipboardList className="w-4 h-4 text-emerald-600" />
            <span>📋 {isAr ? 'طلبات حجز العملاء' : 'Live Client Requests'}</span>
            {myRelevantBookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="bg-rose-500 text-white w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                {myRelevantBookings.filter(b => b.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* TAB WORKSPACE 1: OFFERS DIRECTORY */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <span>📦</span>
                <span>{isAr ? 'عروضي المنشورة في الدليل السياحي للتطبيق' : 'Offers Directory & Live Listing Assets'}</span>
              </h3>

              {myListedOffers.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Package className="w-12 h-12 mx-auto stroke-1.5 opacity-30 mb-3" />
                  <p className="text-xs font-bold">{isAr ? 'لم تقم بنشر أي عروض ترويجية حتى الآن.' : 'Your partner catalog is currently empty.'}</p>
                  <button 
                    onClick={() => setActiveTab('add')}
                    className="mt-4 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black px-4 py-2 rounded-lg cursor-pointer"
                  >
                    ➕ {isAr ? 'انشر أول عروضك الآن' : 'Publish First Listing Now'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListedOffers.map((trip) => {
                    const clientPrice = parseFloat(trip.price) || 0;
                    return (
                      <div 
                        key={trip.id}
                        className="bg-slate-50 rounded-[28px] border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
                      >
                        <div className="relative h-44 bg-slate-200 overflow-hidden shrink-0">
                          <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                          <span className={`absolute top-3 ${isAr ? 'left-3' : 'right-3'} py-1 px-2.5 rounded-full text-[10px] font-black uppercase text-white shadow-sm ${trip.isBooked ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                            {trip.isBooked ? (isAr ? '🔒 مباع / محجوز' : '🔒 Leased') : (isAr ? '✅ متاح' : '✅ Active')}
                          </span>
                          {trip.pendingApproval && (
                            <span className="absolute top-3 right-3 bg-amber-500 text-white font-extrabold text-[9px] px-2 py-1 rounded-full uppercase shadow-sm">
                              ⏳ بانتظار المشرف
                            </span>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-extrabold text-sm text-slate-900 max-w-[80%] truncate">{trip.title}</h4>
                              <span className="text-[10px] bg-white border border-slate-200 rounded-lg px-2 py-0.5 font-bold text-slate-400">
                                {trip.adminRating || '4.5'} ★
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-2">{trip.subtitle}</p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                              <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                              <span>{trip.locationName}</span>
                            </div>

                            {/* Cost vs client price split */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-150">
                              <div className="bg-white border border-slate-200 rounded-lg p-2 text-center">
                                <span className="block text-[8px] text-slate-400 font-bold uppercase">{isAr ? 'سعر الشركة' : 'Company Price'}</span>
                                <span className="text-xs font-black text-rose-600">${trip.companyPrice}</span>
                              </div>
                              <div className="bg-white border border-slate-200 rounded-lg p-2 text-center">
                                <span className="block text-[8px] text-slate-400 font-bold uppercase">{isAr ? 'سعر العميل' : 'Customer Price'}</span>
                                <span className="text-xs font-black text-emerald-600">
                                  {clientPrice > 0 ? `$${clientPrice}` : (isAr ? 'قيد التقييم' : 'Assessing')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200">
                            <button 
                              onClick={() => setEditingTrip(trip)}
                              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black rounded-lg transition-colors cursor-pointer text-center"
                            >
                              {isAr ? 'تعديل التفاصيل' : 'Modify'}
                            </button>
                            <button 
                              onClick={() => handleDeleteOffer(trip.id, trip.title)}
                              className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-black rounded-lg transition-colors cursor-pointer text-center"
                            >
                              {isAr ? 'حذف العرض' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB WORKSPACE 2: ADD OFFER FORM */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
              <span>➕</span>
              <span>{isAr ? 'إدراج وعرض أصل سياحي جديد في سوريا' : 'Publish & List Syria Asset Listing'}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">
              {isAr 
                ? 'يرجى ملء الحقول المطلوبة لضمان صحة تقييم الغرفة، السيارة، أو الوجبة بالشروط القانونية.' 
                : 'Settle legal dimensions, pricing margin, and coordinate metrics perfectly.'}
            </p>

            <form onSubmit={handlePublishOffer} className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">{isAr ? 'عنوان ومسمى العرض الفندقي/السياحي (عربي) *' : 'Listing Local Title (AR) *'}</label>
                  <input 
                    type="text"
                    required
                    value={oTitleAr}
                    onChange={(e) => setOTitleAr(e.target.value)}
                    placeholder={isHotel ? 'فندق فورسيزنز دمشق VIP' : isCar ? 'كيا سبورتاج 2024 زيرو' : 'مطعم الشام الأصيل'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:bg-white focus:border-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">{isAr ? 'عنوان ومسمى العرض الفندقي/السياحي (English) *' : 'Listing Global Title (EN) *'}</label>
                  <input 
                    type="text"
                    required
                    value={oTitleEn}
                    onChange={(e) => setOTitleEn(e.target.value)}
                    placeholder={isHotel ? 'Four Seasons Damascus Premium' : isCar ? 'Kia Sportage 2024 Luxury' : 'Al Sham Authentic Restaurant'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">{isAr ? 'العنوان والمحافظة (عربي)' : 'Address & Region (AR)'}</label>
                  <input 
                    type="text"
                    value={oLocationAr}
                    onChange={(e) => setOLocationAr(e.target.value)}
                    placeholder={isAr ? 'دمشق، أوتوستراد المزة' : 'Damascus, Mazzeh'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:bg-white focus:border-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">{isAr ? 'العنوان والمحافظة (EN)' : 'Address & Region (EN)'}</label>
                  <input 
                    type="text"
                    value={oLocationEn}
                    onChange={(e) => setOLocationEn(e.target.value)}
                    placeholder="Damascus, Mazzeh Highway"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">{isAr ? 'وصف مختصر ومزايا (عربي)' : 'Description Keynotes (AR)'}</label>
                  <input 
                    type="text"
                    value={oDescAr}
                    onChange={(e) => setODescAr(e.target.value)}
                    placeholder={isAr ? 'مثال: إطلالة كاملة على الحديقة، شامل الإفطار الملكي كلياً' : 'e.g. Damascus view with pool access.'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:bg-white focus:border-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">{isAr ? 'وصف مختصر ومزايا (EN)' : 'Description Keynotes (EN)'}</label>
                  <input 
                    type="text"
                    value={oDescEn}
                    onChange={(e) => setODescEn(e.target.value)}
                    placeholder="Cozy double beds premium space with garden view."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* DYNAMIC FORM SECTION: HOTELS VS CARS VS RESTS */}
              {!isCar ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      {isAr ? 'سعر شريك ترافيلو (سعر الشركة) ($) *' : 'Company Partner Cost Rate ($) *'}
                    </label>
                    <input 
                      type="number"
                      required
                      value={oCompanyPrice}
                      onChange={(e) => setOCompanyPrice(e.target.value)}
                      placeholder="60"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      {isAr ? 'سعر بيع العميل النهائي (سعر العميل) ($) *' : 'Client Selling Rate ($) *'}
                    </label>
                    <input 
                      type="number"
                      required
                      value={oPrice}
                      onChange={(e) => setOPrice(e.target.value)}
                      placeholder="95"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none"
                    />
                  </div>
                </div>
              ) : (
                // CAR PRICING TIER SPECIALTY
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">{isAr ? '💰 باقات وبدلات تسعير السيارات الكلية' : '💰 Specific Car Rental Pricing tiers'}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? '💼 تكلفة مع سائق' : 'Cost With Driver'}</label>
                      <input type="number" required placeholder="50" value={carCostWithDriver} onChange={(e) => setCarCostWithDriver(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? '💰 سعر العميل مع سائق' : 'Client With Driver'}</label>
                      <input type="number" required placeholder="80" value={carClientWithDriver} onChange={(e) => setCarClientWithDriver(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? '💼 تكلفة بدون سائق' : 'Cost Self Driving'}</label>
                      <input type="number" required placeholder="30" value={carCostWithoutDriver} onChange={(e) => setCarCostWithoutDriver(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold mb-1">{isAr ? '💰 سعر العميل بدون' : 'Client Self Driving'}</label>
                      <input type="number" required placeholder="55" value={carClientWithoutDriver} onChange={(e) => setCarClientWithoutDriver(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold" />
                    </div>
                  </div>
                </div>
              )}

              {/* COORD / BED TYPE / RATING / MAP FIELD OPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    ⭐️ {isAr ? 'نسبة مئوية أو قيمة التقييم (مثال: 4.8)' : 'Rating Value (e.g. 4.8) *'}
                  </label>
                  <input 
                    type="text"
                    required
                    value={oRating}
                    onChange={(e) => setORating(e.target.value)}
                    placeholder="4.5"
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none"
                  />
                </div>

                {(isHotel || isRest || isApartment) && (
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">{isAr ? '📍 رابط موقع الخريطة / الإحداثيات' : '📍 Maps Coordinates Link / LongLat'}</label>
                    <input 
                      type="text" 
                      value={oMapCoordinates}
                      onChange={(e) => setOMapCoordinates(e.target.value)}
                      placeholder="e.g. 33.5138, 36.2765"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none"
                    />
                  </div>
                )}

                {isApartment && (
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      🏢 {isAr ? 'عدد الغرف وتقسيم الشقة بالتفصيل *' : 'Rooms & Apartment Subdivisions *'}
                    </label>
                    <input 
                      type="text"
                      required
                      value={oBedType === 'single_bed' || oBedType === 'two_beds' ? '' : oBedType}
                      onChange={(e) => setOBedType(e.target.value)}
                      placeholder={isAr ? 'مثال: شقة 3 غرف وصالون ومطبخ' : 'e.g. 3 Rooms & Salon'}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none"
                    />
                  </div>
                )}

                {isHotel && (
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      🛏️ {isAr ? 'مواصفات ونوع الأسرة الافتراضي بالتبويب' : '🛏️ Room Beds default setup'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setOBedType('single_bed')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-white
                          ${oBedType === 'single_bed' ? 'border-teal-500 text-teal-600 bg-teal-50/40' : 'border-slate-200 text-slate-500'}
                        `}
                      >
                        {isAr ? '🛌 سرير فردي' : 'Single Bed'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setOBedType('two_beds')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-white
                          ${oBedType === 'two_beds' ? 'border-teal-500 text-teal-600 bg-teal-50/40' : 'border-slate-200 text-slate-500'}
                        `}
                      >
                        {isAr ? '🛌🛌 سريرين مزدوجين' : 'Double Beds'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SERVICES CHIPS INPUT MODULE */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">{isAr ? '✨ الإضافات والمميزات المرفقة بالعرض' : '✨ Amenity Services offered with listings'}</label>
                <div className="flex flex-wrap gap-2 py-2 min-h-11">
                  {tagsAr.map((t, i) => (
                    <span key={i} className="bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full text-xs font-bold text-teal-700 flex items-center gap-1.5">
                      <span>{t}</span>
                      <button type="button" onClick={() => handleRemoveTag(i)} className="hover:text-rose-500 text-slate-400 font-extrabold cursor-pointer">✕</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-md">
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder={isAr ? 'اكتب خدمة (مثال: WiFi مجاني، موقف سيارات) ثم انقر +' : 'WiFi, Pool access...'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:bg-white"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddTag}
                    className="bg-slate-900 hover:bg-slate-850 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* IMAGE MULTI UPLOAD PICKER WITH BASE64 PREVIEWS */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">{isAr ? '🖼️ صور ومخططات العرض السياحي *' : '🖼️ Listing HD Illustration Views *'}</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center relative cursor-pointer group">
                  <Upload className="w-8 h-8 text-indigo-400 group-hover:scale-105 transition-transform duration-300" />
                  <p className="text-xs text-slate-500 font-bold mt-2">{isAr ? 'انقر لتحديد أو جلب صور المعرض الرقمية' : 'Drag or click to choose layout captures'}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{isAr ? 'الحدث الأول يمثل الأيقونة الدليلية الفورية.' : 'First file represents catalog thumb banner'}</p>
                  <input 
                    type="file" 
                    required={newOfferImages.length === 0}
                    multiple 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {newOfferImages.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-150">
                    {newOfferImages.map((src, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 group shadow-xs">
                        <img src={src} className="w-full h-full object-cover" />
                        <span className="absolute top-1 right-1 bg-teal-600 text-white text-[8px] font-black px-1 py-0.5 rounded-md leading-none">
                          {i === 0 ? 'Thumb' : i + 1}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setNewOfferImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-black cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-150">
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs shadow-lg shadow-indigo-600/10 cursor-pointer"
                >
                  🚀 {isAr ? 'نشر وتأكيد العرض الفني للفندق/الخدمة' : 'Finalize & Publish Listed Syria Asset'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB WORKSPACE 3: LIVE CLIENT REQUESTS (BOOKINGS) */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>📋</span>
                    <span>{isAr ? 'طلبات الحجز الواردة لمنشأتكم' : 'Partner Live Reservation logs'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{isAr ? 'تدقيق مستندات وثائق الهوية، وقبول الحجوزات لتأكيد السداد.' : 'Perform critical verifications, accept stays, or dismiss requests.'}</p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 self-start sm:self-center select-none text-[10px]">
                  <button 
                    onClick={() => setBookingFilter('all')}
                    className={`py-1.5 px-3 rounded-lg font-bold cursor-pointer transition-all
                      ${bookingFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500'}
                    `}
                  >
                    {isAr ? 'الكل' : 'All'}
                  </button>
                  <button 
                    onClick={() => setBookingFilter('pending')}
                    className={`py-1.5 px-3 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1
                      ${bookingFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500'}
                    `}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{isAr ? 'قيد الانتظار' : 'Pending'}</span>
                  </button>
                  <button 
                    onClick={() => setBookingFilter('accepted')}
                    className={`py-1.5 px-3 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1
                      ${bookingFilter === 'accepted' ? 'bg-white text-slate-950 shadow-xs font-black' : 'text-slate-500'}
                    `}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{isAr ? 'مقبولة' : 'Accepted'}</span>
                  </button>
                  <button 
                    onClick={() => setBookingFilter('rejected')}
                    className={`py-1.5 px-3 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1
                      ${bookingFilter === 'rejected' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500'}
                    `}
                  >
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{isAr ? 'مرفوضة' : 'Declined'}</span>
                  </button>
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 text-slate-400 font-medium">
                  <ClipboardList className="w-12 h-12 mx-auto stroke-1.5 opacity-25 mb-2" />
                  <p className="text-xs">{isAr ? 'لا توجد طلبات حجز مطابقة حالياً.' : 'No active requests match chosen state or listing.'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((book) => {
                    const d = book.details || {};
                    const statusColors = {
                      pending: "border-amber-500 bg-amber-50/10",
                      accepted: "border-emerald-500 bg-emerald-50/10",
                      rejected: "border-rose-500 bg-rose-50/5"
                    }[book.status] || "border-slate-200";

                    const statusLabels = {
                      pending: isAr ? "⏳ قيد المراجعة" : "⏳ Review Pending",
                      accepted: isAr ? "✅ حجز مؤكد ومقبول" : "✅ Approved Stay",
                      rejected: isAr ? "❌ حجز مرفوض" : "❌ Lease Declined"
                    }[book.status];

                    return (
                      <div 
                        key={book.id}
                        className={`border-r-4 rounded-[24px] border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md ${statusColors}`}
                        dir={isAr ? 'rtl' : 'ltr'}
                      >
                        {/* Upper row status bar info */}
                        <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-3 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-800 tracking-tight">#{String(book.id).slice(-7).toUpperCase()}</span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase
                              ${book.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : book.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}
                            `}>
                              {statusLabels}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{book.date}</span>
                        </div>

                        {/* Booking properties, trip meta info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <span className="block text-[9px] text-slate-400 font-black uppercase mb-0.5">{isAr ? 'الأصل السياحي المعني' : 'Syria Listed Asset'}</span>
                            <strong className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                              <span>🗺️</span>
                              <span>{isAr ? book.tripTitle : book.tripTitleEn || book.tripTitle}</span>
                            </strong>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="block text-[9px] text-slate-400 font-black uppercase mb-0.5">{isAr ? 'النزيل الأساسي / العميل' : 'Client Fullname'}</span>
                              <span className="text-xs font-bold text-slate-700 block truncate">{d.fullName || 'Guest User'}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] text-slate-400 font-black uppercase mb-0.5">{isAr ? 'رقم موبايل الاتصال' : 'Mobile Digits'}</span>
                              <span className="text-xs font-bold text-slate-700 block select-all">{d.phone || '—'}</span>
                            </div>
                          </div>

                          {/* Dynamic specifications matching stay hotel, self drive luxury car, or traditional fine dining restaurant */}
                          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                            {(book.bookingType as string) === 'hotel' && (
                              <>
                                <div>
                                  <span className="block text-[8px] text-slate-400 font-semibold">{isAr ? 'النزلاء' : 'Accompany'}</span>
                                  <span className="text-xs font-black text-slate-800">{d.guestCount || '1'} {isAr ? 'أشخاص' : 'pax'}</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] text-slate-400 font-semibold">{isAr ? 'الجنسية' : 'Citizenship'}</span>
                                  <span className="text-[10px] font-bold text-slate-700 block truncate">{d.nationality === 'syrian' ? (isAr ? 'سوري' : 'Syrian') : (isAr ? 'أجنبي' : 'International')}</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] text-slate-400 font-semibold">{isAr ? 'حالة الزواج' : 'Marital'}</span>
                                  <span className="text-[10px] font-bold text-slate-700 block truncate">{d.maritalStatus === 'single' ? (isAr ? 'أعزب' : 'Single') : (isAr ? 'عائلة' : 'Married')}</span>
                                </div>
                              </>
                            )}

                            {(book.bookingType as string) === 'car' && (
                              <>
                                <div>
                                  <span className="block text-[8px] text-slate-400 font-semibold">{isAr ? 'المدة' : 'Period'}</span>
                                  <span className="text-xs font-black text-slate-800">{d.days || '3'} {isAr ? 'أيام' : 'days'}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="block text-[8px] text-slate-400 font-semibold">{isAr ? 'نمط المستأجر' : 'Lease Driver Option'}</span>
                                  <span className="text-[10px] font-bold text-indigo-600 block truncate">{d.driverOption === 'with_driver' ? (isAr ? 'مع سائق VIP' : 'Driver Inc.') : (isAr ? 'إيجار مستقل' : 'Self drive')}</span>
                                </div>
                              </>
                            )}

                            {(book.bookingType as string) === 'restaurant' && (
                              <div className="col-span-3">
                                <span className="block text-[8px] text-slate-400 font-semibold">{isAr ? 'طلب عشاء طاولة' : 'Dining Table details'}</span>
                                <span className="text-xs font-black text-slate-800">{d.guestCount || '2'} {isAr ? 'أشخاص على طاولة ممتازة' : 'pax VIP dinner table'}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ID SCAN DOCUMENTATION ATTACHED VIEW IN REACT COMPONENT */}
                        {(d.idImage || d.passportImage || d.familyImage || d.contractImage) && (
                          <div className="mt-4 p-3 bg-slate-50 border border-slate-200/60 rounded-2xl">
                            <span className="text-[10px] text-slate-400 font-black block uppercase mb-2 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{isAr ? '📎 المستندات المرفقة (اضغط للتكبير والتدقيق)' : '📎 Identity documents attached (Click to inspect)'}</span>
                            </span>
                            <div className="flex flex-wrap gap-3">
                              {d.idImage && (
                                <div className="text-center">
                                  <img 
                                    src={d.idImage} 
                                    onClick={() => setLightboxImg(d.idImage || null)}
                                    className="w-14 h-14 object-cover rounded-lg border-2 border-teal-500/20 hover:border-teal-500 cursor-zoom-in transition-all shadow-xs" 
                                  />
                                  <span className="block text-[9px] text-slate-400 mt-1">{isAr ? 'الهوية الشخصية' : 'ID Card'}</span>
                                </div>
                              )}
                              {d.passportImage && (
                                <div className="text-center">
                                  <img 
                                    src={d.passportImage} 
                                    onClick={() => setLightboxImg(d.passportImage || null)}
                                    className="w-14 h-14 object-cover rounded-lg border-2 border-indigo-500/20 hover:border-indigo-500 cursor-zoom-in transition-all shadow-xs" 
                                  />
                                  <span className="block text-[9px] text-slate-400 mt-1">{isAr ? 'جواز السفر' : 'Passport'}</span>
                                </div>
                              )}
                              {d.familyImage && (
                                <div className="text-center">
                                  <img 
                                    src={d.familyImage} 
                                    onClick={() => setLightboxImg(d.familyImage || null)}
                                    className="w-14 h-14 object-cover rounded-lg border-2 border-violet-500/20 hover:border-violet-500 cursor-zoom-in transition-all shadow-xs" 
                                  />
                                  <span className="block text-[9px] text-slate-400 mt-1">{isAr ? 'دفتر العائلة' : 'Family Book'}</span>
                                </div>
                              )}
                              {d.contractImage && (
                                <div className="text-center">
                                  <img 
                                    src={d.contractImage} 
                                    onClick={() => setLightboxImg(d.contractImage || null)}
                                    className="w-14 h-14 object-cover rounded-lg border-2 border-rose-500/20 hover:border-rose-500 cursor-zoom-in transition-all shadow-xs" 
                                  />
                                  <span className="block text-[9px] text-slate-400 mt-1">{isAr ? 'عقد الزواج' : 'Marriage Contract'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Interactive Acceptance rejecting actions row for pending stays */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase">{isAr ? 'صافي بدلات الحجز الكلية' : 'Net Lease Income'}</span>
                            {book.bookingType === 'hotels' ? (
                              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100/50 px-2 py-1 rounded max-w-fit block mt-0.5 select-none font-sans">
                                {isAr ? 'حجز مباشر بدون تسعير' : 'Direct booking without pricing'}
                              </span>
                            ) : (
                              <span className="text-sm font-black text-emerald-600">${d.totalPrice || trips.find(t => t.title === book.tripTitle)?.price || '65'} USD</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-end">
                            {book.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleAcceptBooking(book.id, book.tripTitle)}
                                  className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-lg transition-colors cursor-pointer text-center"
                                >
                                  {isAr ? '✅ قبول الحجز' : '✅ Approve'}
                                </button>
                                <button 
                                  onClick={() => handleRejectBooking(book.id, book.tripTitle, d.fullName || 'Guest', book.userEmail)}
                                  className="py-2 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-650 text-[11px] font-black rounded-lg transition-colors cursor-pointer text-center"
                                >
                                  {isAr ? '❌ رفض' : '❌ Reject'}
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleDeleteBooking(book.id)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer flex items-center justify-center border border-slate-200"
                              title={isAr ? 'حذف السجل' : 'Purge log'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-6 text-center text-xs mt-12 select-none">
        <p>© 2026 {currentCompany.name} · ترافيلو سوريا للتطوير البرمجي المخدم</p>
      </footer>

    </div>
  );
};
