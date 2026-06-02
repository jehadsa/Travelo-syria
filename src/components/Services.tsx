/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bed, Car, Utensils, Building, HelpCircle, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';

interface ServicesProps {
  lang: Language;
  onFilterSelect: (category: 'all' | 'hotels' | 'cars' | 'restaurants' | 'apartments') => void;
}

export const Services: React.FC<ServicesProps> = ({ lang, onFilterSelect }) => {
  const t = {
    ar: {
      sectionTitle: "⚙️ خدماتنا المتميزة",
      sectionSub: "نقدم لكم باقة متكاملة من الخدمات السياحية الفاخرة الميسرة لجعل رحلتكم مع Travelo تجربة استجابة وراحة لا تُنسى",
      service1Title: "حجز الفنادق",
      service1Desc: "أكثر من 150 فندقاً في شتى المحافظات والمدن السورية بأسعار تنافسية وجودة رفيعة.",
      service1Action: "استكشف الفنادق",
      service2Title: "تأجير السيارات",
      service2Desc: "أسطول متنوع مجهز من سيارات الصالون الاقتصادية إلى سيارات كبار الشخصيات مع خيار السائق.",
      service2Action: "استعراض السيارات",
      service3Title: "حجز الطاولات والمطاعم",
      service3Desc: "أشهر وأعرق المطاعم السورية والشرقية التراثية مع قوائم طعام وعروض حصرية.",
      service3Action: "اكتشف المطاعم",
      service4Title: "أجار شقق سكنية",
      service4Desc: "شقق سكنية مفروشة ديلوكس في دمشق والمحافظات السورية بإطلالات خلابة وتجهيزات ذكية كاملة.",
      service4Action: "استكشف الشقق",
      service5Title: "الدعم والمساعدة",
      service5Desc: "فريق استشارات سياحية مكامل متاح بسبل تواصل سريعة وموثوقة على مدار الساعة.",
      service5Action: "اتصل بنا الآن"
    },
    en: {
      sectionTitle: "⚙️ Our Services",
      sectionSub: "We afford you an exquisite portfolio of integrated concierge and travel services to outline your Syrian journey into a magnificent dream.",
      service1Title: "Hotel Bookings",
      service1Desc: "Gain access to over 150 certified properties across Syria, holding premium status and friendly prices.",
      service1Action: "Explore Hotels",
      service2Title: "Premium Car Rentals",
      service2Desc: "Unlock a rich fleet ranging from friendly city sedans to VIP high-end limousines with tailored private drivers.",
      service2Action: "Browse Cars",
      service3Title: "Table Reservations",
      service3Desc: "Reserve instant tables at the finest ancient patios and panoramic diners with menu benefits.",
      service3Action: "Discover Diners",
      service4Title: "Apartment Rentals",
      service4Desc: "Settle into luxury fully-furnished residential suites and flat options across Syrian cities with great views.",
      service4Action: "Explore Apartments",
      service5Title: "Concierge & Support",
      service5Desc: "An all-season help desk dedicated to handling questions regarding routes, stays, or customs instantly.",
      service5Action: "Get In Touch"
    }
  }[lang];

  const servicesData = [
    {
      id: 'hotels',
      icon: <Bed className="w-6 h-6 text-teal-600" />,
      bg: 'bg-teal-50',
      title: t.service1Title,
      desc: t.service1Desc,
      action: t.service1Action,
      category: 'hotels' as const
    },
    {
      id: 'cars',
      icon: <Car className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
      title: t.service2Title,
      desc: t.service2Desc,
      action: t.service2Action,
      category: 'cars' as const
    },
    {
      id: 'restaurants',
      icon: <Utensils className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
      title: t.service3Title,
      desc: t.service3Desc,
      action: t.service3Action,
      category: 'restaurants' as const
    },
    {
      id: 'apartments',
      icon: <Building className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: t.service4Title,
      desc: t.service4Desc,
      action: t.service4Action,
      category: 'apartments' as const
    },
    {
      id: 'concierge',
      icon: <HelpCircle className="w-6 h-6 text-slate-800" />,
      bg: 'bg-slate-100',
      title: t.service5Title,
      desc: t.service5Desc,
      action: t.service5Action,
      anchor: '#contact'
    }
  ];

  const handleAction = (item: typeof servicesData[0]) => {
    if (item.category) {
      onFilterSelect(item.category);
      window.scrollTo({
        top: document.getElementById('catalog-content')?.offsetTop ? document.getElementById('catalog-content')!.offsetTop - 100 : 400,
        behavior: 'smooth'
      });
    } else if (item.anchor) {
      const target = document.querySelector(item.anchor);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="services" className="py-14 border-t border-slate-100">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.sectionTitle}</h2>
        <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {t.sectionSub}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((s) => (
          <div 
            key={s.id} 
            className="p-6 bg-white rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className={`p-4 rounded-xl w-fit ${s.bg} mb-4 shadow-sm`}>
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>

            <button 
              onClick={() => handleAction(s)}
              className="mt-6 flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer w-fit"
            >
              <span>{s.action}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
