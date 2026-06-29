/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * localStorageEngine.ts — REFACTORED
 * 
 * localStorage removed. All state now lives in React in-memory state (App.tsx).
 * This file is kept as a compatibility shim — functions here are no-ops or 
 * return default values. Real state is managed via props/context in App.tsx.
 */

import { Language, User, Trip, Booking, Notification } from './types';
import { INITIAL_TRIPS } from './data';

// --- Language ---
export function getStoredLanguage(): Language {
  return 'ar';
}

export function setStoredLanguage(_lang: Language): void {
  // No-op: language state managed in App.tsx
}

// --- User Auth ---
export function getStoredUser(): User | null {
  return null; // No persistence — user must log in each session
}

export function setStoredUser(_user: User | null): void {
  // No-op: user state managed in App.tsx
}

// --- Trips ---
export function getStoredTrips(): Trip[] {
  return INITIAL_TRIPS;
}

export function updateStoredTripBooking(_tripId: string, _isBooked: boolean): Trip[] {
  return INITIAL_TRIPS; // No-op shim — real logic in App.tsx
}

// --- Bookings ---
export function getStoredBookings(): Booking[] {
  return [];
}

export function addStoredBooking(_booking: Booking): Booking[] {
  return []; // No-op shim — real logic in App.tsx
}

// --- Notifications ---
export function getStoredNotifications(): Notification[] {
  return [];
}

export function addStoredNotification(_notif: Notification): Notification[] {
  return [];
}

export function setNotificationRead(_notifId: string): Notification[] {
  return [];
}

export function markAllNotificationsRead(): Notification[] {
  return [];
}

export function clearAllStoredNotifications(): Notification[] {
  return [];
}
