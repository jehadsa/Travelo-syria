/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface ContactProps {
  lang: Language;
  onShowToast: (icon: string, titleAr: string, titleEn: string, bodyAr: string, bodyEn: string, color: string) => void;
}

export const ContactSection: React.FC<ContactProps> = ({ lang, onShowToast }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const t = {
    ar: {
      sectionTitle: "📞 اتصل بنا",
      sectionSub: "نحن هنا لخدمتك على مدار الساعة، تواصل معنا عبر أي من وسائل الاتصال التالية",
      infoTitle: "معلومات الاتصال",
      formTitle: "أرسل لنا رسالة",
      phone: "رقم الموبايل",
      whatsapp: "واتساب",
      email: "البريد الإلكتروني",
      address: "العنوان",
      addressValue: "شارع بغداد، بناء الشام، دمشق، سوريا",
      available: "متاح 24/7",
      instantReply: "رد فوري",
      placeholderName: "الاسم الكامل *",
      placeholderEmail: "البريد الإلكتروني *",
      placeholderPhone: "رقم الموبايل (اختياري)",
      placeholderMessage: "رسالتك...",
      sendBtn: "إرسال الرسالة",
      sending: "جاري الإرسال...",
      successTitle: "تم الإرسال بنجاح!",
      successBody: "شكراً لتواصلك معنا المحترم. سيتصل بك مستشار ترافيلو قريباً."
    },
    en: {
      sectionTitle: "📞 Contact Us",
      sectionSub: "We are here to serve you around the clock. Connect with us through any of our channels below.",
      infoTitle: "Contact Information",
      formTitle: "Send us a message",
      phone: "Mobile Number",
      whatsapp: "WhatsApp Support",
      email: "Email Support",
      address: "Headquarters",
      addressValue: "Baghdad Street, Al Sham Building, Damascus, Syria",
      available: "Available 24/7",
      instantReply: "Instant reply",
      placeholderName: "Full Name *",
      placeholderEmail: "Email *",
      placeholderPhone: "Mobile Number (optional)",
      placeholderMessage: "Your message...",
      sendBtn: "Send Message",
      sending: "Sending...",
      successTitle: "Sent Successfully!",
      successBody: "Thank you for contacting us. A Travelo representative will respond shortly."
    }
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onShowToast(
        '✉️',
        'تم إرسال رسالتك!',
        'Message Sent!',
        'شكراً لتواصلك مع ترافيلو. سنقوم بمراجعة رسالتك والرد قريباً.',
        'Thank you for reaching out. We will review your message and respond shortly.',
        '#0d9488'
      );
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1200);
  };

  return (
    <section id="contact" className="py-14 border-t border-slate-100">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.sectionTitle}</h2>
        <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {t.sectionSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Contact Info Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-white/10">{t.infoTitle}</h3>

            <div className="space-y-6">
              {/* Phone item */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="p-3 rounded-full bg-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold opacity-75">{t.phone}</h4>
                  <a href="tel:+963987654321" className="text-base font-bold text-teal-300 hover:underline block mt-0.5" dir="ltr">
                    +963 933 124 556
                  </a>
                  <span className="text-xs opacity-60 font-medium block mt-0.5">{t.available}</span>
                </div>
              </div>

              {/* Email item */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold opacity-75">{t.email}</h4>
                  <a href="mailto:support@travelo.sy" className="text-base font-bold text-indigo-300 hover:underline block mt-0.5">
                    support@travelo.sy
                  </a>
                  <span className="text-xs opacity-60 font-medium block mt-0.5">{t.instantReply}</span>
                </div>
              </div>

              {/* Address item */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="p-3 rounded-full bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold opacity-75">{t.address}</h4>
                  <p className="text-sm mt-0.5 opacity-90 leading-relaxed font-semibold">
                    {t.addressValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs opacity-60 font-mono">
            <span>© 2026 Travelo Arabia</span>
            <span>Syria Business License #931A</span>
          </div>
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">{t.formTitle}</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder={t.placeholderName}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder={t.placeholderEmail}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
                />
              </div>
            </div>

            <div>
              <input
                type="tel"
                placeholder={t.placeholderPhone}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <textarea
                required
                rows={4}
                placeholder={t.placeholderMessage}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm shadow-teal-600/10 cursor-pointer"
            >
              {submitting ? (
                <>
                  <HelpCircle className="w-4 h-4 animate-spin" />
                  <span>{t.sending}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.sendBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
