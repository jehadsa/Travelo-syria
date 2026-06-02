/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import { ToastMessage, Language } from '../types';

interface ToastsProps {
  lang: Language;
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toasts: React.FC<ToastsProps> = ({ lang, toasts, onDismiss }) => {
  return (
    <div 
      className={`fixed bottom-6 z-[99999] p-4 flex flex-col gap-3 pointer-events-none max-w-sm w-full select-none
        ${lang === 'ar' ? 'right-0 sm:right-6' : 'left-0 sm:left-6'}
      `}
    >
      {toasts.map((toast) => {
        const title = lang === 'ar' ? toast.title : toast.titleEn;
        const body = lang === 'ar' ? toast.body : toast.bodyEn;

        return (
          <div
            key={toast.id}
            onClick={() => onDismiss(toast.id)}
            style={{ borderRightWidth: lang === 'ar' ? '5px' : '0px', borderRightColor: lang === 'ar' ? toast.color : 'transparent', borderLeftWidth: lang === 'en' ? '5px' : '0px', borderLeftColor: lang === 'en' ? toast.color : 'transparent' }}
            className="bg-slate-900/95 backdrop-filter backdrop-blur-xl border border-white/10 text-white rounded-2xl p-4 shadow-xl flex items-start gap-3 pointer-events-auto cursor-pointer animate-slide-in relative group max-w-xs sm:max-w-md"
          >
            {/* Slide animation inline styles */}
            <style>{`
              @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              .animate-slide-in {
                animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}</style>

            <span className="text-xl shrink-0 mt-0.5">{toast.icon}</span>
            <div className="flex-1 min-w-0 pr-1">
              <h5 className="font-extrabold text-sm text-white leading-tight">{title}</h5>
              <p className="text-xs text-white/70 leading-normal mt-1">{body}</p>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(toast.id);
              }}
              className="text-white/40 hover:text-white transition-colors p-0.5 rounded-full hover:bg-white/5 cursor-pointer self-start opacity-0 group-hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
