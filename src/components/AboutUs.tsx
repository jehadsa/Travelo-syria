/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, ShieldCheck, HeartHandshake, Sparkles, Smile, Landmark, Building2 } from 'lucide-react';
import { Language } from '../types';

interface AboutProps {
  lang: Language;
}

export const AboutUs: React.FC<AboutProps> = ({ lang }) => {
  const t = {
    ar: {
      sectionTitle: "من نحن",
      desc1: "شركة Travelo هي منصة رائدة في مجال السياحة والسفر في سوريا، تأسست عام 2026 بهدف تقديم أفضل الخدمات السياحية بأسعار تنافسية وجودة عالية.",
      desc2: "نحن نؤمن بأن السفر يجب أن يكون تجربة ممتعة وخالية من المتاعب، لذلك نعمل جاهدين لتوفير كل ما يحتاجه السائح في مكان واحد لتيسير استكشاف جمال سوريا العريقة.",
      stat1Val: "5000+",
      stat1Lbl: "عميل سعيد",
      stat2Val: "150+",
      stat2Lbl: "فندق شريك",
      stat3Val: "50+",
      stat3Lbl: "مدينة سورية",
      whyTitle: "لماذا Travelo ؟",
      why1Title: "أفضل الأسعار",
      why1Desc: "نضمن لك أقل وأعدل الأسعار التنافسية في السوق السوري.",
      why2Title: "خدمة موثوقة",
      why2Desc: "جميع حجوزاتنا وخدماتنا مضمونة وموثقة بأسلوب قانوني آمن.",
      why3Title: "دعم 24/7",
      why3Desc: "فريق مستشاري السفر جاهز لمساعدتكم في أي وقت وبكل ود.",
      why4Title: "جودة عالية",
      why4Desc: "نختار شركاءنا بعناية فائقة لضمان راحتكم المطلقة ورضاكم.",
      missionTitle: "رسالة شركة Travelo",
      missionBody: "نحن نسعى لجعل كل رحلة مع ترافيلو تجربة لا تُنسى، من خلال توفير خدمات متكاملة تجمع بين معايير الجودة الرفيعة، والأسعار المناسبة، والراحة التامة للسائح العزيز. مع Travelo، سفرك واستكشافك لسوريا أصبح أسهل، وأجمل!"
    },
    en: {
      sectionTitle: "About Us",
      desc1: "Travelo is a leading platform in tourism and travel in Syria, founded in 2026 to offer state-of-the-art hospitality services with competitive pricing and stellar quality.",
      desc2: "We believe that travel should be a delight, filled with excitement and free from hassles. We dedicate ourselves to supplying everything a tourist needs under one elegant roof.",
      stat1Val: "5000+",
      stat1Lbl: "Happy Clients",
      stat2Val: "150+",
      stat2Lbl: "Partner Hotels",
      stat3Val: "50+",
      stat3Lbl: "Syrian Towns",
      whyTitle: "Why Travelo?",
      why1Title: "Best Prices",
      why1Desc: "We guarantee the most competitive and honest local rates.",
      why2Title: "Reliable Service",
      why2Desc: "All reservation details are legally protected and documented.",
      why3Title: "24/7 Support",
      why3Desc: "Our dedicated travel experts are always ready to support you instantly.",
      why4Title: "High Quality",
      why4Desc: "We handpick our premium partners to guarantee absolute customer comfort.",
      missionTitle: "The Travelo Mission",
      missionBody: "We strive to transform every trip into a lifetime memory, delivering comprehensive services combining luxury standards, friendly budgets, and full peace of mind. With Travelo, discovering Syrian heritage has never been easier or more unforgettable!"
    }
  }[lang];

  return (
    <section id="about" className="py-14 border-t border-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Core Description Panel */}
        <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-8 border border-slate-200/50 flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-teal-100">
              <Landmark className="w-3 h-3" />
              <span>{lang === 'ar' ? 'رحلتنا وقيمنا' : 'Our Legacy & Values'}</span>
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">{t.sectionTitle}</h3>
            
            <div className="space-y-4 text-slate-600 leading-relaxed font-normal text-sm sm:text-base">
              <p>{t.desc1}</p>
              <p>{t.desc2}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-200">
            <div className="bg-white p-4 rounded-2xl text-center border border-slate-100 hover:shadow-sm transition-shadow">
              <Smile className="w-5 h-5 text-teal-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-none">{t.stat1Val}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1.5 leading-tight">{t.stat1Lbl}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-center border border-slate-100 hover:shadow-sm transition-shadow">
              <Building2 className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-none">{t.stat2Val}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1.5 leading-tight">{t.stat2Lbl}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-center border border-slate-100 hover:shadow-sm transition-shadow">
              <Landmark className="w-5 h-5 text-amber-600 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-none">{t.stat3Val}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1.5 leading-tight">{t.stat3Lbl}</div>
            </div>
          </div>
        </div>

        {/* Why Travelo Features Panel */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">{t.whyTitle}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl h-fit shadow-inner">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{t.why1Title}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-normal">{t.why1Desc}</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl h-fit shadow-inner">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{t.why2Title}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-normal">{t.why2Desc}</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl h-fit shadow-inner">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{t.why3Title}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-normal">{t.why3Desc}</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl h-fit shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{t.why4Title}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-normal">{t.why4Desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Slogan Quote Block */}
          <div className="mt-8 p-5 bg-gradient-to-r from-teal-50/70 to-indigo-50/70 border border-teal-100/30 rounded-2xl text-center relative overflow-hidden">
            <span className="text-4xl text-teal-300 font-serif absolute -top-2 left-3 select-none">“</span>
            <h4 className="text-teal-900 font-extrabold text-sm sm:text-base leading-snug">{t.missionTitle}</h4>
            <p className="text-teal-700/80 text-xs sm:text-sm leading-relaxed mt-2 italic font-medium px-4">
              {t.missionBody}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
