/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPlus, LogIn, UserCheck, X, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Language, User } from '../types';
import { verifyAndLogin, saveAccount, updateAccountDetails } from '../authDb';

interface ModalsProps {
  lang: Language;
  loginOpen: boolean;
  signupOpen: boolean;
  editOpen: boolean;
  authRequiredOpen: boolean;
  currentUser: User | null;
  onCloseAll: () => void;
  onSetUser: (user: User | null) => void;
  onShowToast: (icon: string, titleAr: string, titleEn: string, bodyAr: string, bodyEn: string, color: string) => void;
  onOpenSignup: () => void;
  onOpenLogin: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  lang,
  loginOpen,
  signupOpen,
  editOpen,
  authRequiredOpen,
  currentUser,
  onCloseAll,
  onSetUser,
  onShowToast,
  onOpenSignup,
  onOpenLogin
}) => {
  const isAr = lang === 'ar';

  // State: Form inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPass, setEditPass] = useState('');
  const [editConfirmPass, setEditConfirmPass] = useState('');

  // Sync edits on load
  React.useEffect(() => {
    if (currentUser && editOpen) {
      setEditName(currentUser.name);
      setEditPass('');
      setEditConfirmPass('');
    }
  }, [currentUser, editOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) return;

    const loggedUser = verifyAndLogin(loginEmail, loginPass);
    if (loggedUser) {
      onSetUser(loggedUser);
      onShowToast(
        '🔑',
        `أهلاً بك مجدداً يا ${loggedUser.name}!`,
        `Welcome back, ${loggedUser.name}!`,
        'تم تسجيل دخولك بنجاح إلى ترافيلو واستعادة حجوزاتك.',
        'Successfully logged into Travelo. All bookings synced.',
        '#0d9488'
      );
      setLoginEmail('');
      setLoginPass('');
      onCloseAll();
    } else {
      alert(isAr ? 'خطأ: البريد الإلكتروني أو كملة المرور غير مطابقة.' : 'Error: Invalid email or password.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPass) return;
    if (!agreeTerms) {
      alert(isAr ? 'يرجى الموافقة على الشروط والأحكام أولاً.' : 'Please concur with our Terms and Conditions.');
      return;
    }

    const newUser: User = { name: signupName, email: signupEmail };
    const success = saveAccount(newUser, signupPass);

    if (success) {
      onSetUser(newUser);
      onShowToast(
        '🎉',
        `مرحباً بك للتسجيل يا ${newUser.name}!`,
        `Welcome to Travelo, ${newUser.name}!`,
        'تم إنشاء حسابك بنجاح. ابدأ الآن بحجز الفنادق والسيارات.',
        'Your profile has been created. Start exploring Syrian stays now.',
        '#6366f1'
      );
      setSignupName('');
      setSignupEmail('');
      setSignupPass('');
      setAgreeTerms(false);
      onCloseAll();
    } else {
      alert(isAr ? 'البريد الإلكتروني مسجل مسبقاً. يرجى استخدام حساب آخر.' : 'Email is already registered. Please login.');
    }
  };

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!editName) return;

    if (editPass && editPass !== editConfirmPass) {
      alert(isAr ? 'خطأ: كلمتا المرور الجديدتين غير متطابقتين.' : 'Passwords do not match.');
      return;
    }

    const updated = updateAccountDetails(currentUser.email, editName, editPass || undefined);
    if (updated) {
      onSetUser(updated);
      onShowToast(
        '👤',
        'تم التعديل بنجاح!',
        'Profile Updated!',
        'تم حفظ معلومات حسابك الجديدة وتثبيتها بنجاح.',
        'Your new account credentials have been secured.',
        '#f59e0b'
      );
      setEditPass('');
      setEditConfirmPass('');
      onCloseAll();
    }
  };

  if (!loginOpen && !signupOpen && !editOpen && !authRequiredOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] p-4 flex items-center justify-center bg-slate-900/60 backdrop-blur-md select-none animate-fade-in-backdrop">
      <style>{`
        @keyframes fadeInB { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleInB { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in-backdrop { animation: fadeInB 0.25s ease forwards; }
        .animate-scale-in-box { animation: scaleInB 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
      
      {/* 1. LOGIN REQUIRED DIALOG */}
      {authRequiredOpen && (
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-100 shadow-2xl relative text-center animate-scale-in-box">
          <button onClick={onCloseAll} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>
          
          <h3 className="text-xl font-extrabold text-slate-800">
            {isAr ? 'تسجيل الدخول مطلوب' : 'Login Required'}
          </h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {isAr ? 'يرجى تسجيل الدخول أولاً لتتمكن من إرسال طلبات حجز الفنادق أو السيارات أو طاولات الطعام.' : 'You must log in to proceed with hotel, car rentals, or table bookings.'}
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <button 
              onClick={onOpenLogin}
              className="py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              {isAr ? 'تسجيل الدخول' : 'Sign in to Account'}
            </button>
            <button 
              onClick={onOpenSignup}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              {isAr ? 'إنشاء حساب جديد' : 'Register New Account'}
            </button>
          </div>
        </div>
      )}

      {/* 2. LOGIN MODAL */}
      {loginOpen && (
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-100 shadow-2xl relative animate-scale-in-box">
          <button onClick={onCloseAll} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <LogIn className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">{isAr ? 'تسجيل الدخول' : 'Sign In'}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              {isAr ? 'مرحباً بك مجدداً! سجل دخولك للمتابعة السريعة' : 'Welcome back! Please login to your profile'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">{isAr ? 'كلمة المرور' : 'Password'}</label>
              <div className="relative">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute inset-y-0 left-auto right-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-teal-600/10"
            >
              {isAr ? 'دخول' : 'Sign In'}
            </button>
          </form>



          <div className="text-center mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <span>{isAr ? 'ليس لديك حساب؟' : "Don't have an account?"} </span>
            <button onClick={onOpenSignup} className="text-teal-600 hover:underline font-bold cursor-pointer">
              {isAr ? 'إنشاء حساب جديد' : 'Register Here'}
            </button>
          </div>
        </div>
      )}

      {/* 3. SIGNUP MODAL */}
      {signupOpen && (
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-100 shadow-2xl relative animate-scale-in-box">
          <button onClick={onCloseAll} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">{isAr ? 'إنشاء حساب' : 'Register'}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              {isAr ? 'انضم إلينا واستمتع بمميزات ترافيلو اللامعة' : 'Unlock exclusive travel properties across Syria'}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">{isAr ? 'الاسم بالكامل' : 'Full Name'}</label>
              <input
                type="text"
                required
                placeholder={isAr ? 'جهاد الصماك' : 'John Doe'}
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input
                type="email"
                required
                placeholder="example@mail.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">{isAr ? 'كلمة المرور' : 'Password'}</label>
              <div className="relative">
                <input
                  type={showSignupPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={signupPass}
                  onChange={(e) => setSignupPass(e.target.value)}
                  className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPass(!showSignupPass)}
                  className="absolute inset-y-0 left-auto right-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                id="agree"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="accent-indigo-600 h-4 w-4 cursor-pointer"
              />
              <label htmlFor="agree" className="text-xs text-slate-500 cursor-pointer font-medium leading-none">
                {isAr ? 'أوافق على الشروط والسياسات الخاصة بالموقع' : 'I agree to the travel terms and privacy services'}
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-indigo-600/10"
            >
              {isAr ? 'إنشاء حساب جديد' : 'Register Now'}
            </button>
          </form>

          <div className="text-center mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <span>{isAr ? 'لديك حساب سلفاً؟' : 'Already have an account?'} </span>
            <button onClick={onOpenLogin} className="text-indigo-600 hover:underline font-bold cursor-pointer">
              {isAr ? 'سجل دخولك' : 'Sign In'}
            </button>
          </div>
        </div>
      )}

      {/* 4. EDIT PROFILE MODAL */}
      {editOpen && (
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-100 shadow-2xl relative animate-scale-in-box">
          <button onClick={onCloseAll} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">{isAr ? 'تعديل الملف الشخصي' : 'Edit Profile'}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              {isAr ? 'قم بتحديث معلوماتك الشخصية لتثبيتها' : 'Adjust and update your registered account details'}
            </p>
          </div>

          <form onSubmit={handleEditProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">{isAr ? 'الاسم بالكامل' : 'Full Name'}</label>
              <input
                type="text"
                required
                placeholder={isAr ? 'الاسم الجديد' : 'New name'}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase opacity-60">{isAr ? 'البريد الإلكتروني (غير قابل للتغيير)' : 'Email Address (Constant)'}</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full py-3 px-4 bg-slate-100 border border-slate-200 select-none rounded-xl outline-none text-slate-400 text-sm transition-all"
              />
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-[10px] sm:text-xs text-amber-800">
              {isAr ? 'أدخل كلمة مرور جديدة للتغيير، أو اتركها فارغة للإبقاء على الحالية.' : 'Provide new password keys to adjust, or leave empty to keep current.'}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">{isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={editPass}
                onChange={(e) => setEditPass(e.target.value)}
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">{isAr ? 'تأكيد كلمة المرور' : 'Confirm New Password'}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={editConfirmPass}
                onChange={(e) => setEditConfirmPass(e.target.value)}
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl outline-none text-slate-800 text-sm transition-all focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-amber-600/10"
            >
              {isAr ? 'حفظ التعديلات' : 'Save Adjustments'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
