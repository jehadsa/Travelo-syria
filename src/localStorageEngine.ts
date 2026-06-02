/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, User, Trip, Booking, Notification } from './types';
import { INITIAL_TRIPS } from './data';

const KEY_LANGUAGE = 'travelo_lang';
const KEY_USER = 'travelo_user';
const KEY_TRIPS = 'travelo_trips';
const KEY_BOOKINGS = 'travelo_bookings';
const KEY_NOTIFICATIONS = 'travelo_notifications';

// --- Language ---
export function getStoredLanguage(): Language {
  const lang = localStorage.getItem(KEY_LANGUAGE);
  return (lang === 'en' ? 'en' : 'ar') as Language;
}

export function setStoredLanguage(lang: Language): void {
  localStorage.setItem(KEY_LANGUAGE, lang);
}

// --- User Auth ---
export function getStoredUser(): User | null {
  const u = localStorage.getItem(KEY_USER);
  if (!u) return null;
  try {
    return JSON.parse(u);
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  if (user) {
    localStorage.setItem(KEY_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEY_USER);
  }
}

// --- Trips (Catalog with Live Booking Status) ---
export function getStoredTrips(): Trip[] {
  const trips = localStorage.getItem(KEY_TRIPS);
  if (!trips) {
    localStorage.setItem(KEY_TRIPS, JSON.stringify(INITIAL_TRIPS));
    return INITIAL_TRIPS;
  }
  try {
    const parsed = JSON.parse(trips) as Trip[];
    if (!parsed.some(t => t.category === 'apartments')) {
      const extra = INITIAL_TRIPS.filter(t => t.category === 'apartments');
      const updated = [...parsed, ...extra];
      localStorage.setItem(KEY_TRIPS, JSON.stringify(updated));
      return updated;
    }
    return parsed;
  } catch {
    return INITIAL_TRIPS;
  }
}

export function updateStoredTripBooking(tripId: string, isBooked: boolean): Trip[] {
  const trips = getStoredTrips();
  const updated = trips.map(t => t.id === tripId ? { ...t, isBooked } : t);
  localStorage.setItem(KEY_TRIPS, JSON.stringify(updated));
  return updated;
}

// --- Bookings History ---
export function getStoredBookings(): Booking[] {
  const bookings = localStorage.getItem(KEY_BOOKINGS);
  if (!bookings) return [];
  try {
    return JSON.parse(bookings);
  } catch {
    return [];
  }
}

export function addStoredBooking(booking: Booking): Booking[] {
  const bookings = getStoredBookings();
  const updated = [...bookings, booking];
  localStorage.setItem(KEY_BOOKINGS, JSON.stringify(updated));

  // Also reserve the trip as "Booked"
  updateStoredTripBooking(booking.tripId, true);

  return updated;
}

// --- Notifications System ---
export function getStoredNotifications(): Notification[] {
  const user = getStoredUser();
  if (!user) return [];

  const notifsStr = localStorage.getItem(`${KEY_NOTIFICATIONS}_${user.email}`);
  if (!notifsStr) {
    // Inject a beautiful initial welcome notification
    const initialWelcome: Notification[] = [
      {
        id: 'welcome-notif',
        message: `مرحباً بك يا ${user.name} في منصة ترافيلو سوريا! ابدأ رحلتك الآن واكتشف العروض الفاخرة المخصصة لك.`,
        message_en: `Welcome, ${user.name}, to Travelo Syria! Start discovering customized premium offers selected just for you.`,
        type: 'welcome',
        read: false,
        date: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }
    ];
    localStorage.setItem(`${KEY_NOTIFICATIONS}_${user.email}`, JSON.stringify(initialWelcome));
    return initialWelcome;
  }
  try {
    return JSON.parse(notifsStr);
  } catch {
    return [];
  }
}

export function addStoredNotification(notif: Notification): Notification[] {
  const user = getStoredUser();
  if (!user) return [];

  const notifs = getStoredNotifications();
  const updated = [notif, ...notifs];
  localStorage.setItem(`${KEY_NOTIFICATIONS}_${user.email}`, JSON.stringify(updated));
  return updated;
}

export function setNotificationRead(notifId: string): Notification[] {
  const user = getStoredUser();
  if (!user) return [];

  const notifs = getStoredNotifications();
  const updated = notifs.map(n => n.id === notifId ? { ...n, read: true } : n);
  localStorage.setItem(`${KEY_NOTIFICATIONS}_${user.email}`, JSON.stringify(updated));
  return updated;
}

export function markAllNotificationsRead(): Notification[] {
  const user = getStoredUser();
  if (!user) return [];

  const notifs = getStoredNotifications();
  const updated = notifs.map(n => ({ ...n, read: true }));
  localStorage.setItem(`${KEY_NOTIFICATIONS}_${user.email}`, JSON.stringify(updated));
  return updated;
}

export function clearAllStoredNotifications(): Notification[] {
  const user = getStoredUser();
  if (!user) return [];

  localStorage.setItem(`${KEY_NOTIFICATIONS}_${user.email}`, JSON.stringify([]));
  return [];
}
